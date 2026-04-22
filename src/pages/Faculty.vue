<template>
  <div class="py-16" :class="isAdmin ? 'bg-amber-50/30' : ''">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-primary-dark mb-2">
          Our Expert Faculty
        </h1>
        <p class="text-gray-500 text-sm">
          Meet the educators behind Manch Science Classes
        </p>
        <!-- Admin mode badge -->
        <div
          v-if="isAdmin"
          class="inline-flex items-center gap-2 mt-4 px-4 py-1.5 bg-amber-100 border border-amber-300 rounded-full text-amber-700 text-xs font-semibold"
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
          Admin Edit Mode Active
        </div>
      </div>

      <!-- Loading skeletons -->
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse"
        >
          <div class="h-52 bg-gray-200"></div>
          <div class="p-5 space-y-3">
            <div class="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-16">
        <p class="text-gray-500">Failed to load faculty. Please try again.</p>
      </div>

      <!-- Faculty Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Faculty Card -->
        <div
          v-for="member in faculty"
          :key="member.id"
          :class="[
            'bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-200',
            isAdmin
              ? 'ring-2 ring-amber-200 hover:ring-amber-400 hover:shadow-lg'
              : 'hover:shadow-md',
          ]"
        >
          <!-- Image Area -->
          <div class="relative aspect-[4/3] bg-gray-100 group overflow-hidden">
            <img
              v-if="member.imageUrl"
              :src="getFacultyImageUrl(member.imageUrl)"
              :alt="member.name"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <!-- Placeholder when no image -->
            <div
              v-else
              class="h-full w-full flex flex-col items-center justify-center text-gray-300"
            >
              <svg
                class="h-12 w-12 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span class="text-xs">No photo</span>
            </div>

            <!-- Subject Badge on Image -->
            <div class="absolute top-3 left-3">
              <span
                class="px-3 py-1 bg-amber-400 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm"
              >
                {{ member.subject || "Expert" }}
              </span>
            </div>

            <!-- Admin Image Controls (on hover) -->
            <div
              v-if="isAdmin"
              class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100"
            >
              <!-- Upload new image -->
              <button
                @click="triggerImageUpload(member)"
                :disabled="member._uploading"
                class="p-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 rounded-xl transition-colors"
                title="Change photo"
              >
                <svg
                  v-if="!member._uploading"
                  class="h-5 w-5 text-white"
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
                <svg
                  v-else
                  class="h-5 w-5 text-white animate-spin"
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
              </button>
              <!-- Remove image -->
              <button
                v-if="member.imageUrl"
                @click="removeImage(member)"
                class="p-2 bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                title="Remove photo"
              >
                <svg
                  class="h-5 w-5 text-white"
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

            <!-- Upload progress bar -->
            <div
              v-if="member._uploadProgress > 0 && member._uploadProgress < 100"
              class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200"
            >
              <div
                class="h-full bg-blue-500 transition-all"
                :style="{ width: member._uploadProgress + '%' }"
              ></div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-6 space-y-4">
            <!-- Name & Meta -->
            <div class="text-center">
              <input
                v-if="isAdmin"
                :value="member.name"
                @change="saveField(member, 'name', $event.target.value)"
                class="w-full text-center text-xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-amber-300 focus:border-amber-400 focus:outline-none transition-colors rounded px-1 py-0.5"
              />
              <h3 v-else class="text-xl font-bold text-gray-900">
                {{ member.name || "Faculty Name" }}
              </h3>

              <div v-if="isAdmin" class="mt-1">
                <input
                  :value="member.subject"
                  @change="saveField(member, 'subject', $event.target.value)"
                  class="text-xs font-semibold text-secondary bg-transparent border-b border-gray-200 hover:border-amber-300 focus:outline-none text-center"
                />
              </div>
            </div>

            <!-- Stats/Icons Grid -->
            <div class="grid grid-cols-2 gap-2 border-y border-gray-50 py-3">
              <div class="text-center">
                <div
                  class="text-[10px] text-gray-400 uppercase tracking-widest mb-1"
                >
                  Quals
                </div>
                <div v-if="isAdmin">
                  <input
                    :value="member.qualification"
                    @change="
                      saveField(member, 'qualification', $event.target.value)
                    "
                    class="w-full text-center text-xs font-bold text-gray-700 bg-transparent focus:outline-none"
                  />
                </div>
                <div v-else class="text-xs font-bold text-gray-700">
                  {{ member.qualification || "N/A" }}
                </div>
              </div>
              <div class="text-center border-l border-gray-50">
                <div
                  class="text-[10px] text-gray-400 uppercase tracking-widest mb-1"
                >
                  Exp
                </div>
                <div v-if="isAdmin">
                  <input
                    :value="member.experience"
                    @change="
                      saveField(member, 'experience', $event.target.value)
                    "
                    class="w-full text-center text-xs font-bold text-gray-700 bg-transparent focus:outline-none"
                  />
                </div>
                <div v-else class="text-xs font-bold text-gray-700">
                  {{ member.experience || "N/A" }}
                </div>
              </div>
            </div>

            <!-- Bio section -->
            <div class="relative">
              <textarea
                v-if="isAdmin"
                :value="member.bio"
                @change="saveField(member, 'bio', $event.target.value)"
                placeholder="Add a short bio..."
                class="w-full text-xs text-gray-500 bg-transparent border rounded p-2 focus:outline-none focus:ring-1 focus:ring-amber-300 text-center resize-none"
                rows="3"
              ></textarea>
              <p
                v-else
                class="text-xs text-gray-500 leading-relaxed text-center italic line-clamp-3 px-2"
              >
                "{{
                  member.bio ||
                  "Dedicated to excellence in education and student success."
                }}"
              </p>
            </div>

            <!-- Admin: Delete Card Button -->
            <div v-if="isAdmin" class="pt-3 border-t border-gray-100 mt-3">
              <button
                @click="confirmDeleteMember(member)"
                class="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 mx-auto"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Remove Card
              </button>
            </div>
          </div>
        </div>

        <!-- Admin: Add New Faculty Card -->
        <div
          v-if="isAdmin"
          @click="addNewMember"
          :class="[
            'border-2 border-dashed rounded-2xl flex flex-col items-center justify-center h-72 cursor-pointer transition-all',
            adding
              ? 'border-amber-400 bg-amber-50'
              : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/50',
          ]"
        >
          <svg
            v-if="!adding"
            class="h-10 w-10 text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <svg
            v-else
            class="h-8 w-8 text-amber-500 animate-spin mb-2"
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
          <span class="text-sm text-gray-500 font-medium">{{
            adding ? "Adding..." : "Add Faculty"
          }}</span>
        </div>
      </div>

      <!-- Hidden file input for image upload -->
      <input
        ref="imgInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="hidden"
        @change="handleImageFile"
      />
    </div>

    <!-- Delete Confirm Modal -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 class="font-bold text-gray-900 mb-2">Remove Faculty Member?</h3>
        <p class="text-sm text-gray-500 mb-5">
          This will permanently remove
          <strong>{{ deleteTarget.name || "this member" }}</strong> from the
          faculty list.
        </p>
        <div class="flex gap-3">
          <button
            @click="deleteTarget = null"
            class="flex-1 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteMember"
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
            {{ deleting ? "Removing..." : "Remove" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getFaculty,
  addFaculty,
  updateFaculty,
  deleteFaculty,
} from "../services/firestoreService";
import {
  uploadToCloudinary,
  validateFile,
} from "../services/cloudinaryService";
import { useAuth } from "../composables/useAuth";

export default {
  name: "FacultyPage",

  setup() {
    const { user } = useAuth();
    return { user };
  },

  data() {
    return {
      faculty: [],
      loading: true,
      error: false,
      adding: false,
      deleteTarget: null,
      deleting: false,
      // Tracks which member's image is being uploaded
      activeUploadMember: null,
    };
  },

  computed: {
    // Any authenticated user with Firebase Auth is considered admin.
    // Since only admins are created via Firebase Console, this is secure.
    isAdmin() {
      return !!this.user;
    },
  },

  async created() {
    await this.loadFaculty();
  },

  methods: {
    getFacultyImageUrl(url) {
      if (!url) return "";
      // If it's a Cloudinary URL, inject transformations for face-focus and portrait crop
      if (url.includes("cloudinary.com")) {
        // c_thumb: Zoomed in on face, g_face: Focus on face, z_0.75: Slightly zoom out to keep top of head
        return url.replace("/upload/", "/upload/c_thumb,g_face,w_400,h_300,z_0.75/");
      }
      return url;
    },

    async loadFaculty() {
      this.loading = true;
      this.error = false;
      try {
        const data = await getFaculty();
        // Add reactive UI state per card (_uploading, _uploadProgress)
        this.faculty = data.map((m) => ({
          ...m,
          _uploading: false,
          _uploadProgress: 0,
        }));
      } catch (e) {
        console.error("Faculty load error:", e);
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    // ── Inline field save (debounce not needed — fires on blur/change) ──────
    async saveField(member, field, value) {
      if (member[field] === value) return; // No change
      member[field] = value; // Optimistic update
      try {
        await updateFaculty(member.id, { [field]: value });
      } catch (e) {
        console.error("Save field error:", e);
        alert("Failed to save change. Please try again.");
      }
    },

    // ── Image upload ─────────────────────────────────────────────────────────
    triggerImageUpload(member) {
      this.activeUploadMember = member;
      this.$refs.imgInput.value = "";
      this.$refs.imgInput.click();
    },

    async handleImageFile(event) {
      const file = event.target.files[0];
      const member = this.activeUploadMember;
      if (!file || !member) return;

      const { valid, error } = validateFile(file, "image");
      if (!valid) {
        alert(error);
        return;
      }

      member._uploading = true;
      member._uploadProgress = 0;
      try {
        const imageUrl = await uploadToCloudinary(file, (progress) => {
          member._uploadProgress = progress;
        });
        await updateFaculty(member.id, { imageUrl });
        member.imageUrl = imageUrl; // Optimistic update
      } catch (e) {
        console.error("Image upload error:", e);
        alert("Image upload failed. Check your Cloudinary configuration.");
      } finally {
        member._uploading = false;
        member._uploadProgress = 0;
        this.activeUploadMember = null;
      }
    },

    async removeImage(member) {
      member.imageUrl = ""; // Optimistic update
      try {
        await updateFaculty(member.id, { imageUrl: "" });
      } catch (e) {
        console.error("Remove image error:", e);
      }
    },

    // ── Add new member ───────────────────────────────────────────────────────
    async addNewMember() {
      if (this.adding) return;
      this.adding = true;
      try {
        const docRef = await addFaculty({
          name: "New Faculty Member",
          subject: "Subject",
          qualification: "Qualification",
          experience: "Experience",
          bio: "",
          imageUrl: "",
        });
        // Add to local list with the new doc id
        this.faculty.push({
          id: docRef.id,
          name: "New Faculty Member",
          subject: "Subject",
          qualification: "Qualification",
          experience: "Experience",
          bio: "",
          imageUrl: "",
          _uploading: false,
          _uploadProgress: 0,
        });
      } catch (e) {
        console.error("Add member error:", e);
        alert("Failed to add faculty member.");
      } finally {
        this.adding = false;
      }
    },

    // ── Delete member ────────────────────────────────────────────────────────
    confirmDeleteMember(member) {
      this.deleteTarget = member;
    },

    async handleDeleteMember() {
      if (!this.deleteTarget) return;
      this.deleting = true;
      try {
        await deleteFaculty(this.deleteTarget.id);
        this.faculty = this.faculty.filter(
          (m) => m.id !== this.deleteTarget.id,
        );
        this.deleteTarget = null;
      } catch (e) {
        console.error("Delete member error:", e);
        alert("Failed to remove faculty member.");
      } finally {
        this.deleting = false;
      }
    },
  },
};
</script>
