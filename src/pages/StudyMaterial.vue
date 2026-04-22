<template>
  <div class="py-16" :class="isAdmin ? 'bg-amber-50/20' : ''">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-primary-dark mb-2">
          Study Material
        </h1>
        <p class="text-gray-500 text-sm">
          Download notes, PDFs, and practice material
        </p>
        <div
          v-if="isAdmin"
          class="inline-flex items-center gap-2 mt-3 px-4 py-1.5 bg-amber-100 border border-amber-300 rounded-full text-amber-700 text-xs font-semibold"
        >
          <svg
            class="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Admin Edit Mode — Hover cards for controls
        </div>
      </div>

      <!-- Standard Tabs -->
      <div
        class="mb-6 flex overflow-x-auto pb-2 gap-2 border-b border-gray-200"
      >
        <button
          v-for="std in standards"
          :key="std"
          @click="selectStandard(std)"
          :class="[
            'px-5 py-2.5 font-semibold text-sm whitespace-nowrap border-b-2 transition-all',
            activeStandard === std
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50',
          ]"
        >
          {{ std }}
        </button>
      </div>

      <!-- Subject Pills (Secondary Filter) -->
      <div
        v-if="availableSubjects.length > 1"
        class="mb-8 flex flex-wrap gap-2"
      >
        <button
          v-for="sub in availableSubjects"
          :key="sub"
          @click="activeSubject = sub"
          :class="[
            'px-4 py-1.5 rounded-full text-xs font-medium transition-all border',
            activeSubject === sub
              ? 'bg-secondary text-white border-secondary shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-secondary hover:text-secondary',
          ]"
        >
          {{ sub }}
        </button>
      </div>

      <!-- Admin Upload Form (inline, only shown when admin) -->
      <div
        v-if="isAdmin"
        class="mb-8 bg-white border-2 border-dashed border-amber-300 rounded-2xl p-5"
      >
        <h3
          class="text-sm font-semibold text-amber-700 mb-4 flex items-center gap-2"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Upload New Material
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <input
            v-model="upload.title"
            type="text"
            placeholder="Title (e.g. Formula Sheet) *"
            required
            class="sm:col-span-2 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <select
            v-model="upload.standard"
            class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Standard *</option>
            <option v-for="std in standards.slice(1)" :key="std" :value="std">
              {{ std }}
            </option>
          </select>

          <select
            v-model="upload.subject"
            class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Subject *</option>
            <option v-for="sub in subjects" :key="sub" :value="sub">
              {{ sub }}
            </option>
          </select>

          <label
            class="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition"
          >
            <svg
              class="h-4 w-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            <span class="truncate">{{
              upload.file ? upload.file.name : "Choose File"
            }}</span>
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              class="hidden"
              @change="onUploadFileChange"
            />
          </label>
        </div>
        <!-- Progress -->
        <div v-if="uploading" class="mt-3">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Uploading...</span><span>{{ uploadProgress }}%</span>
          </div>
          <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-amber-500 transition-all"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
        </div>
        <div v-if="upload.fileError" class="mt-2 text-xs text-red-500">
          {{ upload.fileError }}
        </div>
        <button
          @click="handleUpload"
          :disabled="
            uploading ||
            !upload.file ||
            !upload.title ||
            !upload.standard ||
            !upload.subject
          "
          class="mt-3 px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2"
        >
          <svg
            v-if="uploading"
            class="h-3.5 w-3.5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          {{ uploading ? "Uploading..." : "Upload Material" }}
        </button>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="h-40 bg-gray-100 rounded-xl animate-pulse"
        ></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-16">
        <p class="text-gray-500">Could not load materials. Please try again.</p>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredMaterials.length === 0" class="text-center py-16">
        <svg
          class="h-14 w-14 text-gray-300 mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-gray-400 font-medium">
          No materials found for this selection.
        </p>
      </div>

      <!-- Material Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="mat in filteredMaterials"
          :key="mat.id"
          :class="[
            'bg-white p-5 rounded-2xl shadow-sm border flex flex-col transition-all group',
            isAdmin
              ? 'border-amber-200 hover:border-amber-400 hover:shadow-md'
              : 'border-gray-100 hover:shadow-md',
          ]"
        >
          <div class="flex items-start justify-between mb-3">
            <!-- Editable title -->
            <input
              v-if="isAdmin"
              :value="mat.title"
              @blur="saveMatField(mat, 'title', $event.target.value)"
              class="flex-1 font-bold text-gray-800 text-sm bg-transparent border-b-2 border-transparent hover:border-amber-300 focus:border-amber-400 focus:outline-none transition pr-2"
            />
            <h3 v-else class="font-bold text-gray-800 flex-1 pr-2 text-sm">
              {{ mat.title }}
            </h3>
            <span
              :class="[
                'text-xs px-2 py-1 rounded font-semibold uppercase flex-shrink-0',
                mat.type === 'pdf'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700',
              ]"
            >
              {{ mat.type }}
            </span>
          </div>

          <!-- Editable subject -->
          <div v-if="isAdmin" class="flex gap-2 mb-2">
            <select
              :value="mat.standard"
              @change="saveMatField(mat, 'standard', $event.target.value)"
              class="text-xs text-blue-600 bg-transparent border-b border-transparent hover:border-amber-300 focus:outline-none transition flex-1"
            >
              <option v-for="std in standards.slice(1)" :key="std" :value="std">
                {{ std }}
              </option>
            </select>
            <select
              :value="mat.subject"
              @change="saveMatField(mat, 'subject', $event.target.value)"
              class="text-xs text-gray-600 bg-transparent border-b border-transparent hover:border-amber-300 focus:outline-none transition flex-1"
            >
              <option v-for="sub in subjects" :key="sub" :value="sub">
                {{ sub }}
              </option>
            </select>
          </div>
          <p v-else class="text-gray-500 text-sm mb-1 flex-grow">
            <span class="font-medium text-gray-700">🎓 {{ mat.standard }}</span>
            •
            <span class="text-gray-600">{{ mat.subject }}</span>
          </p>

          <p class="text-xs text-gray-400 mb-4">
            {{ formatDate(mat.uploadedAt) }}
          </p>

          <div class="flex gap-2 mt-auto">
            <button
              @click="openPreview(mat)"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium transition text-center"
            >
              Preview
            </button>
            <a
              :href="getDownloadUrl(mat)"
              :download="mat.title"
              class="flex-1 bg-primary hover:bg-primary-dark text-white py-2 rounded-lg text-sm font-medium transition text-center"
            >
              ⬇ Download
            </a>
          </div>

          <!-- Admin delete -->
          <button
            v-if="isAdmin"
            @click="confirmDelete(mat)"
            class="mt-3 text-xs text-red-400 hover:text-red-600 transition flex items-center gap-1 opacity-0 group-hover:opacity-100"
          >
            <svg
              class="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete material
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 class="font-bold text-gray-900 mb-2">Delete Material?</h3>
        <p class="text-sm text-gray-500 mb-5">
          Remove <strong>"{{ deleteTarget.title }}"</strong>?
        </p>
        <div class="flex gap-3">
          <button
            @click="deleteTarget = null"
            class="flex-1 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            :disabled="deleting"
            class="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
          >
            <svg
              v-if="deleting"
              class="h-3.5 w-3.5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            {{ deleting ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div
      v-if="showPreviewModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6"
      @click.self="closePreview"
    >
      <div
        class="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        <!-- Modal Header -->
        <div
          class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white"
        >
          <div class="flex items-center gap-3">
            <div
              :class="[
                'p-2 rounded-xl',
                previewTarget.type === 'pdf'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-blue-50 text-blue-600',
              ]"
            >
              <svg
                v-if="previewTarget.type === 'pdf'"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3
                class="font-bold text-gray-900 leading-none truncate max-w-[200px] sm:max-w-md"
              >
                {{ previewTarget.title }}
              </h3>
              <p class="text-[10px] text-gray-500 uppercase mt-1">
                {{ previewTarget.standard }} • {{ previewTarget.subject }}
              </p>
            </div>
          </div>
          <button
            @click="closePreview"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 bg-gray-50 relative flex flex-col overflow-hidden">
          <!-- PDF Viewer -->
          <div
            v-if="previewTarget.type === 'pdf'"
            class="flex-1 flex flex-col h-full overflow-hidden"
          >
            <!-- Slim info bar -->
            <!-- <div
              class="bg-blue-50 px-4 py-2 text-[10px] text-blue-700 flex items-center justify-between border-b border-blue-100 flex-shrink-0"
            >
              <button
                @click="openInNewTab(previewTarget.fileUrl)"
                class="font-bold underline hover:text-blue-900"
              >
                Open in New Tab ↗
              </button>
            </div> -->

            <!-- Error state: shown when iframe fails -->
            <div
              v-if="iframeError"
              class="flex-1 flex flex-col items-center justify-center gap-4 p-8 bg-white"
            >
              <svg
                class="h-14 w-14 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p class="text-sm font-semibold text-gray-700">
                Preview not available
              </p>
              <p class="text-xs text-gray-400 text-center max-w-xs">
                Your browser blocked the embedded PDF viewer. Use the buttons
                below to open or download the file.
              </p>
              <div class="flex gap-3 mt-2">
                <button
                  @click="openInNewTab(previewTarget.fileUrl)"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
                >
                  Open in New Tab ↗
                </button>
                <a
                  :href="getDownloadUrl(previewTarget)"
                  :download="previewTarget.title"
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition"
                >
                  ⬇ Download
                </a>
              </div>
            </div>

            <!-- Iframe: Direct URL works because "PDF and ZIP delivery" is enabled -->
            <div v-else class="flex-1 relative bg-white">
              <div
                class="absolute inset-0 flex items-center justify-center bg-gray-50 z-0 pointer-events-none"
              >
                <div class="text-center text-gray-400">
                  <svg
                    class="h-8 w-8 animate-spin mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  <p class="text-[10px]">Loading PDF Preview...</p>
                </div>
              </div>
              <iframe
                :src="getPreviewUrl(previewTarget)"
                class="relative z-10 w-full h-full border-none shadow-inner"
                @error="iframeError = true"
              ></iframe>
            </div>
          </div>

          <!-- Image Preview -->
          <div
            v-else
            class="w-full h-full flex items-center justify-center p-8 bg-white"
          >
            <img
              :src="previewTarget.fileUrl"
              class="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              alt="Preview"
            />
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <a
            :href="getDownloadUrl(previewTarget)"
            :download="previewTarget.title"
            class="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition flex items-center gap-2"
          >
            ⬇ Download {{ previewTarget.type.toUpperCase() }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
} from "../services/firestoreService";
import {
  uploadToCloudinary,
  validateFile,
} from "../services/cloudinaryService";
import { useAuth } from "../composables/useAuth";

export default {
  name: "StudyMaterialPage",

  setup() {
    const { user } = useAuth();
    return { user };
  },

  data() {
    return {
      allMaterials: [],
      loading: true,
      error: false,
      activeStandard: "All",
      activeSubject: "All",
      standards: [
        "All",
        "8th",
        "9th",
        "10th",
        "11th",
        "12th",
        "Foundation",
        "NEET",
        "JEE",
        "MHT-CET",
        "Other",
      ],
      subjects: [
        "Physics",
        "Chemistry",
        "Mathematics",
        "Biology",
        "Science",
        "English",
        "Marathi",
        "Social Studies",
        "History/Civics",
        "Geography",
        "General",
      ],
      // Upload form
      upload: {
        title: "",
        standard: "",
        subject: "",
        file: null,
        fileError: null,
      },
      uploading: false,
      uploadProgress: 0,
      // Preview
      showPreviewModal: false,
      previewTarget: null,
      iframeError: false,
      // Delete
      deleteTarget: null,
      deleting: false,
    };
  },

  computed: {
    isAdmin() {
      return !!this.user;
    },
    filteredMaterials() {
      return this.allMaterials.filter((m) => {
        const stdMatch =
          this.activeStandard === "All" || m.standard === this.activeStandard;
        const subMatch =
          this.activeSubject === "All" || m.subject === this.activeSubject;
        return stdMatch && subMatch;
      });
    },
    availableSubjects() {
      if (this.activeStandard === "All") return ["All", ...this.subjects];
      // Get subjects that actually have content for this standard
      const subsInStd = this.allMaterials
        .filter((m) => m.standard === this.activeStandard)
        .map((m) => m.subject);
      const uniqueSubs = [...new Set(subsInStd)].sort();
      return uniqueSubs.length > 0 ? ["All", ...uniqueSubs] : ["All"];
    },
  },

  async created() {
    try {
      this.allMaterials = await getMaterials();
    } catch (e) {
      console.error("Materials load error:", e);
      this.error = true;
    } finally {
      this.loading = false;
    }
  },

  methods: {
    formatDate(timestamp) {
      if (!timestamp) return "";
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },

    openInNewTab(url) {
      if (!url) return;
      window.open(url, "_blank");
    },

    getPreviewUrl(mat) {
      if (!mat.fileUrl) return "#";
      // Direct URL now works because "PDF and ZIP delivery" was enabled in Cloudinary
      return mat.fileUrl;
    },

    // Guaranteed 1st-page preview using Cloudinary's built-in PDF-to-Image tech
    getPdfThumbnailUrl(url) {
      if (!url || !url.includes("cloudinary.com")) return "";
      // Replaces .pdf with .jpg and adds pg_1 transformation
      return url
        .replace(/\.pdf$/, ".jpg")
        .replace("/upload/", "/upload/f_auto,q_auto,pg_1/");
    },

    openPreview(mat) {
      this.previewTarget = mat;
      this.iframeError = false;
      this.showPreviewModal = true;
      document.body.style.overflow = "hidden";
    },

    closePreview() {
      this.showPreviewModal = false;
      this.previewTarget = null;
      document.body.style.overflow = "auto";
    },

    getDownloadUrl(mat) {
      if (!mat.fileUrl) return "#";
      if (mat.fileUrl.includes("cloudinary.com")) {
        return mat.fileUrl.replace("/upload/", "/upload/fl_attachment/");
      }
      return mat.fileUrl;
    },

    onUploadFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      const { valid, error } = validateFile(file, "material");
      if (!valid) {
        this.upload.fileError = error;
        this.upload.file = null;
        return;
      }
      this.upload.fileError = null;
      this.upload.file = file;
    },

    selectStandard(std) {
      this.activeStandard = std;
      this.activeSubject = "All"; // Reset subject when changing standard
    },

    async handleUpload() {
      if (!this.upload.file || !this.upload.title) return;
      this.uploading = true;
      this.uploadProgress = 0;
      try {
        const isPdf = this.upload.file.type === "application/pdf";
        const fileUrl = await uploadToCloudinary(this.upload.file, (p) => {
          this.uploadProgress = p;
        });
        const docRef = await addMaterial({
          title: this.upload.title.trim(),
          standard: this.upload.standard,
          subject: this.upload.subject,
          fileUrl,
          type: isPdf ? "pdf" : "image",
        });
        this.allMaterials.unshift({
          id: docRef.id,
          title: this.upload.title.trim(),
          standard: this.upload.standard,
          subject: this.upload.subject,
          fileUrl,
          type: isPdf ? "pdf" : "image",
          uploadedAt: null,
        });
        this.upload = {
          title: "",
          standard: "",
          subject: "",
          file: null,
          fileError: null,
        };
        this.uploadProgress = 0;
      } catch (e) {
        console.error("Upload error:", e);
        alert("Upload failed. Check Cloudinary config.");
      } finally {
        this.uploading = false;
      }
    },

    async saveMatField(mat, field, value) {
      if (mat[field] === value) return;
      mat[field] = value;
      try {
        await updateMaterial(mat.id, { [field]: value });
      } catch (e) {
        console.error("Save failed:", e);
      }
    },

    confirmDelete(mat) {
      this.deleteTarget = mat;
    },

    async handleDelete() {
      if (!this.deleteTarget) return;
      this.deleting = true;
      try {
        await deleteMaterial(this.deleteTarget.id);
        this.allMaterials = this.allMaterials.filter(
          (m) => m.id !== this.deleteTarget.id,
        );
        this.deleteTarget = null;
      } catch (e) {
        console.error("Delete error:", e);
      } finally {
        this.deleting = false;
      }
    },
  },
};
</script>
