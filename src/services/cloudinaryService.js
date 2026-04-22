// ============================================================
// Cloudinary Service — Direct Browser Upload (No Backend)
// ============================================================
// SETUP STEPS:
// 1. Go to https://cloudinary.com → Create free account
// 2. Dashboard → copy your "Cloud name"
// 3. Settings → Upload → Add upload preset:
//    - Signing mode: Unsigned
//    - Folder: manch-lms (optional)
//    - Copy the preset name
// 4. Replace CLOUD_NAME and UPLOAD_PRESET below
// ============================================================

// 🔥 Using environment variables from .env
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Cloudinary upload endpoint (auto detects image/pdf/video)
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

// ─── Validation ────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_MATERIAL_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

/**
 * Validate a file before upload (type + size check).
 * @param {File} file
 * @param {'image'|'material'} type
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateFile = (file, type = "image") => {
  const maxSizes = { image: 5, material: 20 }; // MB
  const allowedTypes =
    type === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_MATERIAL_TYPES;
  const maxMB = maxSizes[type];

  if (!file) return { valid: false, error: "No file selected." };

  if (!allowedTypes.includes(file.type)) {
    const readable =
      type === "image" ? "JPG, PNG, WebP, or GIF" : "PDF, JPG, PNG, or WebP";
    return { valid: false, error: `Invalid file type. Allowed: ${readable}` };
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxMB) {
    return {
      valid: false,
      error: `File too large. Max ${maxMB}MB. (Current: ${sizeMB.toFixed(1)}MB)`,
    };
  }

  return { valid: true, error: null };
};

// ─── Upload ────────────────────────────────────────────────

/**
 * Upload a file directly to Cloudinary from the browser.
 * Uses XHR for real progress tracking.
 *
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Called with 0-100 progress percentage
 * @returns {Promise<string>} - Cloudinary secure_url (CDN URL)
 */
export const uploadToCloudinary = (file, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();

    // Progress tracking
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.secure_url);
        } catch {
          reject(new Error("Invalid response from Cloudinary."));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(
            new Error(
              err?.error?.message ||
                "Upload failed. Check your cloud name and upload preset.",
            ),
          );
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject(
        new Error(
          "Network error during upload. Check your internet connection.",
        ),
      );
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was cancelled."));
    });

    xhr.open("POST", UPLOAD_URL);
    xhr.send(formData);
  });
};
