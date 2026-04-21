<template>
  <div class="py-16" :class="isAdmin ? 'bg-amber-50/20' : ''">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-primary-dark mb-2">Gallery</h1>
        <p class="text-gray-500 text-sm">Moments from Manch Science Classes</p>
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
          Admin Edit Mode — Hover images for edit/delete
        </div>
      </div>

      <!-- ── Admin Upload Panel ─────────────────────────────── -->
      <div
        v-if="isAdmin"
        class="mb-10 bg-white border-2 border-dashed border-amber-300 rounded-2xl p-5"
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Upload New Image
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <!-- Event/Category -->
          <select
            v-model="upload.event"
            class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Select Event *</option>
            <option v-for="ev in eventOptions" :key="ev" :value="ev">
              {{ ev }}
            </option>
            <option value="__custom">+ New event...</option>
          </select>
          <!-- Custom event input -->
          <input
            v-if="upload.event === '__custom'"
            v-model="upload.customEvent"
            type="text"
            placeholder="Event name e.g., Sports Day 2025"
            class="px-3 py-2 border border-amber-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <!-- Caption -->
          <input
            v-model="upload.title"
            type="text"
            placeholder="Caption (optional)"
            :class="[
              'px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400',
              upload.event === '__custom' ? '' : 'sm:col-span-2',
            ]"
          />

          <!-- File picker -->
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span class="truncate">{{
              upload.file
                ? upload.file.name.substring(0, 16) + "…"
                : "Choose Image"
            }}</span>
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              class="hidden"
              @change="onFileChange"
            />
          </label>
        </div>

        <!-- Image preview -->
        <div v-if="upload.previewUrl" class="mt-3">
          <img
            :src="upload.previewUrl"
            alt="Preview"
            class="h-24 w-auto rounded-xl object-cover border border-amber-200"
          />
        </div>

        <!-- Progress bar -->
        <div v-if="uploading" class="mt-3">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Uploading to Cloudinary...</span
            ><span>{{ uploadProgress }}%</span>
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
          :disabled="uploading || !upload.file || !upload.event"
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
          {{ uploading ? "Uploading..." : "Upload Image" }}
        </button>
      </div>

      <!-- Loading skeletons -->
      <div v-if="loading" class="space-y-12">
        <div v-for="i in 2" :key="i">
          <div class="h-7 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="j in 4"
              :key="j"
              class="aspect-square bg-gray-200 rounded-lg animate-pulse"
            ></div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-16">
        <svg
          class="h-12 w-12 text-red-300 mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-gray-500">
          Could not load gallery. Please try again later.
        </p>
      </div>

      <!-- Empty state -->
      <div v-else-if="groupedEvents.length === 0" class="text-center py-16">
        <svg
          class="h-16 w-16 text-gray-300 mx-auto mb-4"
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
        <p class="text-gray-400 font-medium">No gallery images yet.</p>
        <p class="text-gray-400 text-sm mt-1">
          {{
            isAdmin
              ? "Use the upload panel above to add your first image."
              : "Check back soon!"
          }}
        </p>
      </div>

      <!-- ✅ Event-wise Grouped Gallery -->
      <div v-else>
        <div v-for="event in groupedEvents" :key="event.name" class="mb-14">
          <!-- Section Header -->
          <h2
            class="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-secondary pl-3"
          >
            {{ event.name }}
          </h2>

          <!-- Image Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="image in event.images"
              :key="image.id"
              class="relative group"
            >
              <!-- Image tile -->
              <div
                @click="!isAdmin && openLightbox(image)"
                :class="[
                  'aspect-square bg-gray-200 rounded-xl overflow-hidden relative',
                  isAdmin ? '' : 'cursor-pointer',
                ]"
              >
                <img
                  :src="image.imageUrl"
                  :alt="image.title || event.name"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                <!-- PUBLIC hover overlay (lightbox trigger) -->
                <div
                  v-if="!isAdmin"
                  class="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all flex items-center justify-center"
                >
                  <svg
                    class="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>

                <!-- ADMIN hover overlay (edit/delete/preview) -->
                <div
                  v-if="isAdmin"
                  class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100"
                >
                  <div class="flex gap-2">
                    <!-- Preview/lightbox -->
                    <button
                      @click.stop="openLightbox(image)"
                      class="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      title="Preview"
                    >
                      <svg
                        class="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <!-- Delete -->
                    <button
                      @click.stop="deleteImage(image)"
                      class="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition"
                      title="Delete"
                    >
                      <svg
                        class="h-4 w-4 text-white"
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
                    </button>
                  </div>
                </div>

                <!-- Caption bar (always visible if title exists) -->
                <div
                  v-if="image.title && !isAdmin"
                  class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <p class="text-white text-xs font-medium line-clamp-1">
                    {{ image.title }}
                  </p>
                </div>
              </div>

              <!-- Admin: inline caption + event editor (below the image tile) -->
              <div v-if="isAdmin" class="mt-1.5 space-y-1">
                <input
                  :value="image.title"
                  @blur="saveImageField(image, 'title', $event.target.value)"
                  placeholder="Add caption..."
                  class="w-full text-xs text-gray-700 bg-transparent border-b border-transparent hover:border-amber-300 focus:border-amber-400 focus:outline-none transition px-1 py-0.5 placeholder-gray-400"
                />
                <select
                  :value="image.event"
                  @change="saveImageField(image, 'event', $event.target.value)"
                  class="w-full text-xs text-gray-500 bg-transparent border-b border-transparent hover:border-amber-300 focus:border-amber-400 focus:outline-none transition px-1 py-0.5"
                >
                  <option v-for="ev in eventOptions" :key="ev" :value="ev">
                    {{ ev }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div
      v-if="lightboxImage"
      class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      @click.self="closeLightbox"
    >
      <button
        @click="closeLightbox"
        class="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"
      >
        <svg
          class="h-8 w-8"
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
      <div class="max-w-4xl w-full">
        <img
          :src="lightboxImage.imageUrl"
          :alt="lightboxImage.title || lightboxImage.event"
          class="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
        />
        <div class="text-center mt-3">
          <p v-if="lightboxImage.title" class="text-white text-sm font-medium">
            {{ lightboxImage.title }}
          </p>
          <p class="text-gray-400 text-xs mt-1">{{ lightboxImage.event }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from "../services/firestoreService";
import {
  uploadToCloudinary,
  validateFile,
} from "../services/cloudinaryService";
import { useAuth } from "../composables/useAuth";

export default {
  name: "GalleryPage",

  setup() {
    const { user } = useAuth();
    return { user };
  },

  data() {
    return {
      allImages: [],
      loading: true,
      error: false,
      lightboxImage: null,
      // Upload state
      upload: {
        event: "",
        customEvent: "",
        title: "",
        file: null,
        previewUrl: null,
        fileError: null,
      },
      uploading: false,
      uploadProgress: 0,
      eventOptions: [
        "Aarambh - Annual Function",
        "TechFest - Innovation Showcase",
        "Inspire - Guest Lectures",
        "Transform - Farewell Ceremony",
        "Sports Day",
        "Science Exhibition",
        "Campus Life",
        "General",
      ],
    };
  },

  computed: {
    isAdmin() {
      return !!this.user;
    },

    groupedEvents() {
      const map = new Map();
      for (const image of this.allImages) {
        const eventName = image.event || "General";
        if (!map.has(eventName))
          map.set(eventName, { name: eventName, images: [] });
        map.get(eventName).images.push(image);
      }
      return Array.from(map.values());
    },
  },

  async created() {
    try {
      this.allImages = await getGalleryImages();
    } catch (e) {
      console.error("Gallery load error:", e);
      this.error = true;
    } finally {
      this.loading = false;
    }
  },

  methods: {
    // ── Lightbox ──
    openLightbox(image) {
      this.lightboxImage = image;
    },
    closeLightbox() {
      this.lightboxImage = null;
    },

    // ── Upload ────────────────────────────────────────────────
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      const { valid, error } = validateFile(file, "image");
      if (!valid) {
        this.upload.fileError = error;
        this.upload.file = null;
        this.upload.previewUrl = null;
        return;
      }
      this.upload.fileError = null;
      this.upload.file = file;
      this.upload.previewUrl = URL.createObjectURL(file);
    },

    async handleUpload() {
      if (!this.upload.file || !this.upload.event) return;
      const finalEvent =
        this.upload.event === "__custom"
          ? this.upload.customEvent.trim()
          : this.upload.event;
      if (!finalEvent) {
        this.upload.fileError = "Please enter an event name.";
        return;
      }

      this.uploading = true;
      this.uploadProgress = 0;
      try {
        const imageUrl = await uploadToCloudinary(this.upload.file, (p) => {
          this.uploadProgress = p;
        });
        const docRef = await addGalleryImage({
          imageUrl,
          title: this.upload.title.trim(),
          event: finalEvent,
        });
        // Optimistic prepend
        this.allImages.unshift({
          id: docRef.id,
          imageUrl,
          title: this.upload.title.trim(),
          event: finalEvent,
          uploadedAt: null,
        });
        // Reset form
        this.upload = {
          event: "",
          customEvent: "",
          title: "",
          file: null,
          previewUrl: null,
          fileError: null,
        };
        this.$refs.fileInput.value = "";
        this.uploadProgress = 0;
      } catch (e) {
        console.error("Upload error:", e);
        this.upload.fileError = "Upload failed. Check Cloudinary config.";
      } finally {
        this.uploading = false;
      }
    },

    // ── Inline field save ─────────────────────────────────────
    async saveImageField(image, field, value) {
      if (image[field] === value) return;
      image[field] = value; // Optimistic
      try {
        await updateGalleryImage(image.id, {
          title: image.title,
          event: image.event,
        });
      } catch (e) {
        console.error("Save failed:", e);
      }
    },

    // ── Delete ────────────────────────────────────────────────
    async deleteImage(image) {
      if (
        !confirm(`Delete this image${image.title ? ` "${image.title}"` : ""}?`)
      )
        return;
      try {
        await deleteGalleryImage(image.id);
        this.allImages = this.allImages.filter((i) => i.id !== image.id);
      } catch (e) {
        console.error("Delete error:", e);
        alert("Delete failed. Please try again.");
      }
    },
  },
};
</script>
