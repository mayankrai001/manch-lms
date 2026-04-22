<template>
  <AdminLayout>
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Upload / Add Form -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h2 class="text-base font-semibold text-gray-800 mb-5">
            {{ editingMember ? 'Edit Faculty Member' : 'Add New Faculty Member' }}
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Name -->
            <div>
              <label for="fac-name" class="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span class="text-red-500">*</span></label>
              <input
                id="fac-name"
                v-model="form.name"
                type="text"
                placeholder="e.g., Prof. Rajesh Sharma"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <!-- Subject -->
            <div>
              <label for="fac-subject" class="block text-sm font-medium text-gray-700 mb-1.5">Subject / Specialization <span class="text-red-500">*</span></label>
              <input
                id="fac-subject"
                v-model="form.subject"
                type="text"
                placeholder="e.g., Physics Expert"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <!-- Qualification -->
            <div>
              <label for="fac-qual" class="block text-sm font-medium text-gray-700 mb-1.5">Qualification <span class="text-red-500">*</span></label>
              <input
                id="fac-qual"
                v-model="form.qualification"
                type="text"
                placeholder="e.g., M.Tech (IIT Bombay)"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <!-- Experience -->
            <div>
              <label for="fac-exp" class="block text-sm font-medium text-gray-700 mb-1.5">Experience <span class="text-red-500">*</span></label>
              <input
                id="fac-exp"
                v-model="form.experience"
                type="text"
                placeholder="e.g., 12+ Years Teaching"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <!-- Bio -->
            <div>
              <label for="fac-bio" class="block text-sm font-medium text-gray-700 mb-1.5">Short Bio / Achievements</label>
              <textarea
                id="fac-bio"
                v-model="form.bio"
                rows="3"
                placeholder="e.g., Expert in Physics, helping students clear NEET with 10+ years of dedicated coaching."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              ></textarea>
            </div>

            <!-- Photo Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Photo</label>
              <div
                @click="$refs.facPhotoInput.click()"
                :class="[
                  'border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors relative overflow-hidden h-32 flex flex-col items-center justify-center',
                  form.photoPreview || form.imageUrl ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                ]"
              >
                <input
                  ref="facPhotoInput"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  class="hidden"
                  @change="onPhotoChange"
                />
                
                <template v-if="form.photoPreview || form.imageUrl">
                  <img :src="getFacultyImageUrl(form.photoPreview || form.imageUrl)" class="absolute inset-0 w-full h-full object-cover opacity-20" />
                  <div class="relative z-10">
                    <p class="text-xs text-blue-600 font-medium">Photo Selected</p>
                    <button type="button" @click.stop="clearPhoto" class="text-[10px] text-red-500 hover:underline mt-1">Remove</button>
                  </div>
                </template>
                
                <template v-else>
                  <svg class="h-6 w-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-xs text-gray-500">Tap to upload photo</p>
                </template>
              </div>
            </div>

            <!-- Progress Bar -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100">
              <div class="h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
                <div class="h-full bg-blue-500 transition-all" :style="{ width: uploadProgress + '%' }"></div>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button
                v-if="editingMember"
                type="button"
                @click="resetForm"
                class="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                <svg v-if="saving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ editingMember ? 'Update Faculty' : 'Add Faculty' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Faculty List -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-base font-semibold text-gray-800">Faculty Members <span class="text-gray-400 text-sm font-normal">({{ faculty.length }})</span></h2>
            <button @click="fetchFaculty" class="text-xs text-blue-600 hover:underline">Refresh</button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="h-24 bg-gray-50 rounded-2xl animate-pulse"></div>
          </div>

          <!-- Empty -->
          <div v-else-if="faculty.length === 0" class="text-center py-16">
            <div class="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p class="text-sm text-gray-400">No faculty members found. Add your first one!</p>
          </div>

          <!-- Grid -->
          <div v-else class="space-y-4">
            <div
              v-for="member in faculty"
              :key="member.id"
              class="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/10 transition group"
            >
              <!-- Photo -->
              <div class="h-16 w-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                <img v-if="member.imageUrl" :src="getFacultyImageUrl(member.imageUrl)" class="h-full w-full object-cover" />
                <div v-else class="h-full w-full flex items-center justify-center text-gray-400">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-gray-900 truncate">{{ member.name }}</h3>
                </div>
                <p class="text-xs font-semibold text-secondary lowercase">{{ member.subject }}</p>
                <p class="text-xs text-gray-500 mt-1 line-clamp-1">{{ member.bio || 'No bio added' }}</p>
                <p class="text-[10px] text-gray-400 mt-1 uppercase">{{ member.qualification }} • {{ member.experience }}</p>
              </div>

              <!-- Actions -->
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="editMember(member)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition shadow-sm" title="Edit">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="confirmDelete(member)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition shadow-sm" title="Delete">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 class="font-bold text-gray-900 mb-2">Remove Faculty?</h3>
        <p class="text-sm text-gray-500 mb-5">Are you sure you want to delete {{ deleteTarget.name }}? This cannot be undone.</p>
        <div class="flex gap-3">
          <button @click="deleteTarget = null" class="flex-1 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button @click="handleDelete" :disabled="deleting" class="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2">
            <svg v-if="deleting" class="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { getFaculty, addFaculty, updateFaculty, deleteFaculty } from '../../services/firestoreService'
import { uploadToCloudinary, validateFile } from '../../services/cloudinaryService'
import { showSuccess, showError } from '../../components/common/ToastNotification.vue'

export default {
  name: 'AdminFaculty',
  components: { AdminLayout },
  data() {
    return {
      faculty: [],
      loading: true,
      saving: false,
      deleting: false,
      uploadProgress: 0,
      deleteTarget: null,
      editingMember: null,
      form: {
        name: '',
        subject: '',
        qualification: '',
        experience: '',
        imageUrl: '',
        photoFile: null,
        photoPreview: null
      }
    }
  },
  async created() {
    await this.fetchFaculty()
  },
  methods: {
    getFacultyImageUrl(url) {
      if (!url) return ''
      if (url.includes('cloudinary.com')) {
        // c_thumb: Focus on face, z_0.75: Slightly zoom out to keep top of head
        return url.replace('/upload/', '/upload/c_thumb,g_face,w_200,h_200,z_0.75/')
      }
      return url
    },
    async fetchFaculty() {
      this.loading = true
      try {
        this.faculty = await getFaculty()
      } catch (err) {
        showError('Failed to load faculty', err.message)
      } finally {
        this.loading = false
      }
    },

    onPhotoChange(e) {
      const file = e.target.files[0]
      if (!file) return
      
      const { valid, error } = validateFile(file, 'image')
      if (!valid) {
        showError('Invalid Image', error)
        return
      }

      this.form.photoFile = file
      this.form.photoPreview = URL.createObjectURL(file)
    },

    clearPhoto() {
      this.form.photoFile = null
      this.form.photoPreview = null
      this.form.imageUrl = ''
      if (this.$refs.facPhotoInput) this.$refs.facPhotoInput.value = ''
    },

    editMember(member) {
      this.editingMember = member
      this.form = {
        name: member.name,
        subject: member.subject,
        qualification: member.qualification,
        experience: member.experience,
        bio: member.bio || '',
        imageUrl: member.imageUrl,
        photoFile: null,
        photoPreview: null
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    resetForm() {
      this.editingMember = null
      this.form = {
        name: '',
        subject: '',
        qualification: '',
        experience: '',
        imageUrl: '',
        photoFile: null,
        photoPreview: null
      }
      this.uploadProgress = 0
      if (this.$refs.facPhotoInput) this.$refs.facPhotoInput.value = ''
    },

    async handleSubmit() {
      this.saving = true
      this.uploadProgress = 0
      try {
        let finalImageUrl = this.form.imageUrl

        // 1. Upload new photo if selected
        if (this.form.photoFile) {
          finalImageUrl = await uploadToCloudinary(
            this.form.photoFile,
            (p) => { this.uploadProgress = p }
          )
        }

        const facultyData = {
          name: this.form.name,
          subject: this.form.subject,
          qualification: this.form.qualification,
          experience: this.form.experience,
          bio: this.form.bio,
          imageUrl: finalImageUrl
        }

        if (this.editingMember) {
          // Update existing
          await updateFaculty(this.editingMember.id, facultyData)
          showSuccess('Updated!', `${facultyData.name}'s profile has been updated.`)
        } else {
          // Add new
          await addFaculty(facultyData)
          showSuccess('Added!', `${facultyData.name} has been added to the faculty list.`)
        }

        this.resetForm()
        await this.fetchFaculty()
      } catch (err) {
        showError('Action failed', err.message)
      } finally {
        this.saving = false
        this.uploadProgress = 0
      }
    },

    confirmDelete(member) {
      this.deleteTarget = member
    },

    async handleDelete() {
      if (!this.deleteTarget) return
      this.deleting = true
      try {
        await deleteFaculty(this.deleteTarget.id)
        showSuccess('Deleted', 'Faculty member removed.')
        this.faculty = this.faculty.filter(f => f.id !== this.deleteTarget.id)
        this.deleteTarget = null
      } catch (err) {
        showError('Delete failed', err.message)
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>
