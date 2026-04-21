<template>
  <AdminLayout>
    <!-- Upload Section -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Upload Form -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-base font-semibold text-gray-800 mb-5">
            Upload New Image
          </h2>

          <form @submit.prevent="handleUpload" class="space-y-5">
            <!-- Event / Category -->
            <div>
              <label
                for="gallery-event"
                class="block text-sm font-medium text-gray-700 mb-1.5"
                >Event / Category <span class="text-red-500">*</span></label
              >
              <div class="flex gap-2">
                <select
                  id="gallery-event"
                  v-model="form.event"
                  class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="" disabled>Select or type below</option>
                  <option v-for="ev in eventOptions" :key="ev" :value="ev">
                    {{ ev }}
                  </option>
                  <option value="__custom">+ Add new event...</option>
                </select>
              </div>
              <input
                v-if="form.event === '__custom'"
                v-model="form.customEvent"
                type="text"
                placeholder="e.g., Sports Day 2025"
                class="mt-2 w-full px-4 py-2.5 border border-blue-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <!-- Title -->
            <div>
              <label
                for="gallery-title"
                class="block text-sm font-medium text-gray-700 mb-1.5"
                >Image Caption
                <span class="text-gray-400 font-normal">(optional)</span></label
              >
              <input
                id="gallery-title"
                v-model="form.title"
                type="text"
                placeholder="e.g., Annual Function 2024"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <!-- File Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Image File <span class="text-red-500">*</span></label
              >
              <div
                @click="$refs.fileInput.click()"
                @dragover.prevent
                @drop.prevent="onFileDrop"
                :class="[
                  'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
                  form.file
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50',
                ]"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  class="hidden"
                  @change="onFileChange"
                />
                <div v-if="!previewUrl">
                  <svg
                    class="h-10 w-10 text-gray-400 mx-auto mb-2"
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
                  <p class="text-sm text-gray-500">
                    Drag & drop or
                    <span class="text-blue-600 font-medium">browse</span>
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    JPG, PNG, WebP, GIF • Max 5MB
                  </p>
                </div>
                <div v-else class="relative">
                  <img
                    :src="previewUrl"
                    alt="Preview"
                    class="h-32 w-full object-cover rounded-lg"
                  />
                  <p class="text-xs text-blue-600 mt-2">
                    {{ form.file?.name }}
                  </p>
                </div>
              </div>
              <p v-if="fileError" class="text-xs text-red-500 mt-1">
                {{ fileError }}
              </p>
            </div>

            <!-- Progress Bar -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>Uploading...</span>
                <span>{{ uploadProgress }}%</span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-600 rounded-full transition-all"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Submit -->
            <button
              id="gallery-upload-btn"
              type="submit"
              :disabled="uploading || !form.file"
              class="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <svg
                v-if="uploading"
                class="h-4 w-4 animate-spin"
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
          </form>
        </div>
      </div>

      <!-- Images List -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-base font-semibold text-gray-800">
              Gallery Images
              <span class="text-gray-400 text-sm font-normal"
                >({{ images.length }})</span
              >
            </h2>
            <button
              @click="fetchImages"
              class="text-xs text-blue-600 hover:underline"
            >
              Refresh
            </button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="i in 6"
              :key="i"
              class="aspect-square bg-gray-100 rounded-xl animate-pulse"
            ></div>
          </div>

          <!-- Empty -->
          <div v-else-if="images.length === 0" class="text-center py-12">
            <svg
              class="h-12 w-12 text-gray-300 mx-auto mb-3"
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
            <p class="text-sm text-gray-400">
              No images yet. Upload your first one!
            </p>
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="image in images"
              :key="image.id"
              class="group relative aspect-square rounded-xl overflow-hidden bg-gray-100"
            >
              <img
                :src="image.imageUrl"
                :alt="image.title || 'Gallery image'"
                class="h-full w-full object-cover"
                loading="lazy"
              />
              <!-- Hover overlay — Tailwind v4 slash opacity syntax -->
              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100"
              >
                <p
                  class="text-white text-xs font-medium px-2 text-center line-clamp-2"
                >
                  {{ image.title || "Untitled" }}
                </p>
                <div class="flex gap-2">
                  <!-- Edit button -->
                  <button
                    @click.stop="startEdit(image)"
                    class="p-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                    title="Edit caption & event"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <!-- Delete button -->
                  <button
                    @click.stop="confirmDelete(image)"
                    class="p-1.5 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                    title="Delete image"
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="editTarget"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 class="font-bold text-gray-900 mb-1">Edit Image Details</h3>
        <p class="text-xs text-gray-400 mb-4">
          Update the caption or event for this image.
        </p>

        <!-- Preview thumb -->
        <img
          :src="editTarget.imageUrl"
          alt="Preview"
          class="w-full h-28 object-cover rounded-xl mb-4"
        />

        <!-- Event -->
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1.5"
            >Event / Category</label
          >
          <select
            v-model="editForm.event"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">None</option>
            <option v-for="ev in eventOptions" :key="ev" :value="ev">
              {{ ev }}
            </option>
            <option value="__custom">+ Add new event...</option>
          </select>
          <input
            v-if="editForm.event === '__custom'"
            v-model="editForm.customEvent"
            type="text"
            placeholder="e.g., Sports Day 2025"
            class="mt-2 w-full px-4 py-2.5 border border-blue-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <!-- Caption -->
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-1.5"
            >Caption
            <span class="text-gray-400 font-normal">(optional)</span></label
          >
          <input
            v-model="editForm.title"
            type="text"
            placeholder="e.g., Stage performance"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div class="flex gap-3">
          <button
            @click="editTarget = null"
            class="flex-1 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            @click="handleEditSave"
            :disabled="saving"
            class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
          >
            <svg
              v-if="saving"
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
            {{ saving ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 class="font-bold text-gray-900 mb-2">Delete Image?</h3>
        <p class="text-sm text-gray-500 mb-5">
          This will permanently delete "{{
            deleteTarget.title || "this image"
          }}" from Storage and Firestore.
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
  </AdminLayout>
</template>

<script>
import AdminLayout from "../../components/admin/AdminLayout.vue";
import {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from "../../services/firestoreService";
import {
  uploadToCloudinary,
  validateFile,
} from "../../services/cloudinaryService";
import {
  showSuccess,
  showError,
} from "../../components/common/ToastNotification.vue";

export default {
  name: "AdminGallery",
  components: { AdminLayout },
  data() {
    return {
      form: { title: "", event: "", customEvent: "", file: null },
      eventOptions: [
        "Aarambh - Annual Function",
        "TechFest - Innovation Showcase",
        "Inspire - Guest Lectures",
        "Transform - Farewell Ceremony",
        "Sports Day",
        "Science Exhibition",
        "Campus Life",
      ],
      previewUrl: null,
      fileError: null,
      uploading: false,
      uploadProgress: 0,
      loading: true,
      images: [],
      deleteTarget: null,
      deleting: false,
      // Edit
      editTarget: null,
      editForm: { title: "", event: "", customEvent: "" },
      saving: false,
    };
  },
  async created() {
    await this.fetchImages();
  },
  methods: {
    async fetchImages() {
      this.loading = true;
      try {
        this.images = await getGalleryImages();
      } catch {
        showError("Failed to load gallery", "Check your Firebase connection.");
      } finally {
        this.loading = false;
      }
    },

    onFileChange(event) {
      this.handleFile(event.target.files[0]);
    },

    onFileDrop(event) {
      this.handleFile(event.dataTransfer.files[0]);
    },

    handleFile(file) {
      if (!file) return;
      const { valid, error } = validateFile(file, "image");
      if (!valid) {
        this.fileError = error;
        this.form.file = null;
        this.previewUrl = null;
        return;
      }
      this.fileError = null;
      this.form.file = file;
      this.previewUrl = URL.createObjectURL(file);
    },

    async handleUpload() {
      if (!this.form.file) return;
      this.uploading = true;
      this.uploadProgress = 0;
      try {
        // Upload directly to Cloudinary — no CORS issues!
        const imageUrl = await uploadToCloudinary(
          this.form.file,
          (progress) => {
            this.uploadProgress = progress;
          },
        );
        const finalEvent =
          this.form.event === "__custom"
            ? this.form.customEvent.trim()
            : this.form.event;
        await addGalleryImage({
          imageUrl,
          title: this.form.title.trim(),
          event: finalEvent,
        });
        showSuccess(
          "Image uploaded!",
          "It is now visible in the public gallery.",
        );
        this.form = { title: "", event: "", customEvent: "", file: null };
        this.previewUrl = null;
        this.uploadProgress = 0;
        this.$refs.fileInput.value = "";
        await this.fetchImages();
      } catch (err) {
        showError("Upload failed", err.message);
      } finally {
        this.uploading = false;
      }
    },

    confirmDelete(image) {
      this.deleteTarget = image;
    },

    // ─── Edit ────────────────────────────────────────────────
    startEdit(image) {
      this.editTarget = image;
      this.editForm = {
        title: image.title || "",
        event: image.event || "",
        customEvent: "",
      };
    },

    async handleEditSave() {
      if (!this.editTarget) return;
      this.saving = true;
      try {
        const finalEvent =
          this.editForm.event === "__custom"
            ? this.editForm.customEvent.trim()
            : this.editForm.event;
        await updateGalleryImage(this.editTarget.id, {
          title: this.editForm.title.trim(),
          event: finalEvent,
        });
        // Update local list immediately
        const idx = this.images.findIndex(
          (img) => img.id === this.editTarget.id,
        );
        if (idx !== -1) {
          this.images[idx].title = this.editForm.title.trim();
          this.images[idx].event = finalEvent;
        }
        showSuccess("Saved!", "Image details updated.");
        this.editTarget = null;
      } catch (err) {
        showError("Save failed", err.message);
      } finally {
        this.saving = false;
      }
    },

    async handleDelete() {
      if (!this.deleteTarget) return;
      this.deleting = true;
      try {
        // Only remove Firestore record
        // (Cloudinary deletion requires API secret — handle via Cloudinary dashboard if needed)
        await deleteGalleryImage(this.deleteTarget.id);
        showSuccess("Image removed", "Removed from gallery.");
        this.images = this.images.filter(
          (img) => img.id !== this.deleteTarget.id,
        );
        this.deleteTarget = null;
      } catch (err) {
        showError("Delete failed", err.message);
      } finally {
        this.deleting = false;
      }
    },
  },
};
</script>
