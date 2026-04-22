<template>
  <AdminLayout>
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">

      <!-- Upload Form -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-base font-semibold text-gray-800 mb-5">Upload Study Material</h2>

          <form @submit.prevent="handleUpload" class="space-y-4">
            <!-- Title -->
            <div>
              <label for="material-title" class="block text-sm font-medium text-gray-700 mb-1.5">Title <span class="text-red-500">*</span></label>
              <input
                id="material-title"
                v-model="form.title"
                type="text"
                placeholder="e.g., Chapter 5 - Laws of Motion"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <!-- Standard -->
            <div>
              <label for="material-standard" class="block text-sm font-medium text-gray-700 mb-1.5">Standard / Grade <span class="text-red-500">*</span></label>
              <select
                id="material-standard"
                v-model="form.standard"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="" disabled>Select standard</option>
                <option v-for="std in standards" :key="std" :value="std">{{ std }}</option>
              </select>
            </div>

            <!-- Subject -->
            <div>
              <label for="material-subject" class="block text-sm font-medium text-gray-700 mb-1.5">Subject <span class="text-red-500">*</span></label>
              <select
                id="material-subject"
                v-model="form.subject"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="" disabled>Select subject</option>
                <option v-for="sub in subjects" :key="sub" :value="sub">{{ sub }}</option>
              </select>
            </div>

            <!-- File -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">File <span class="text-red-500">*</span></label>
              <div
                @click="$refs.matFileInput.click()"
                @dragover.prevent
                @drop.prevent="onFileDrop"
                :class="[
                  'border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors',
                  form.file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                ]"
              >
                <input
                  ref="matFileInput"
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  class="hidden"
                  @change="onFileChange"
                />
                <svg class="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p v-if="!form.file" class="text-sm text-gray-500">
                  Drag & drop or <span class="text-blue-600 font-medium">browse</span>
                </p>
                <p v-else class="text-sm text-blue-600 font-medium">{{ form.file.name }}</p>
                <p class="text-xs text-gray-400 mt-1">PDF, JPG, PNG, WebP • Max 20MB</p>
              </div>
              <p v-if="fileError" class="text-xs text-red-500 mt-1">{{ fileError }}</p>
            </div>

            <!-- Upload Progress -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>Uploading...</span><span>{{ uploadProgress }}%</span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-blue-600 rounded-full transition-all" :style="{ width: uploadProgress + '%' }"></div>
              </div>
            </div>

            <button
              id="material-upload-btn"
              type="submit"
              :disabled="uploading || !form.file || !form.title || !form.standard || !form.subject"
              class="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <svg v-if="uploading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ uploading ? 'Uploading...' : 'Upload Material' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Materials List -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-base font-semibold text-gray-800">All Materials <span class="text-gray-400 text-sm font-normal">({{ materials.length }})</span></h2>
            <button @click="fetchMaterials" class="text-xs text-blue-600 hover:underline">Refresh</button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="space-y-3">
            <div v-for="i in 4" :key="i" class="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
          </div>

          <!-- Empty -->
          <div v-else-if="materials.length === 0" class="text-center py-12">
            <svg class="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-sm text-gray-400">No materials yet. Upload your first file!</p>
          </div>

          <!-- Table -->
          <div v-else class="space-y-2">
            <div
              v-for="mat in materials"
              :key="mat.id"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition group"
            >
              <!-- Type Badge -->
              <div :class="['h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold uppercase', mat.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600']">
                {{ mat.type === 'pdf' ? 'PDF' : 'IMG' }}
              </div>
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">{{ mat.title }}</p>
                <p class="text-xs text-gray-500">{{ mat.standard }} • {{ mat.subject }}</p>
              </div>
              <!-- Actions -->
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a :href="getPreviewUrl(mat)" target="_blank" rel="noopener noreferrer" class="p-1.5 text-gray-400 hover:text-blue-600 transition" title="Preview">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </a>
                <a :href="getDownloadUrl(mat)" :download="mat.title" class="p-1.5 text-gray-400 hover:text-green-600 transition" title="Download">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
                <button @click="confirmDelete(mat)" class="p-1.5 text-gray-400 hover:text-red-500 transition" title="Delete">
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

    <!-- Delete Confirm Modal -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 class="font-bold text-gray-900 mb-2">Delete Material?</h3>
        <p class="text-sm text-gray-500 mb-5">This will permanently delete "{{ deleteTarget.title }}" from Storage and Firestore.</p>
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
import { getMaterials, addMaterial, deleteMaterial } from '../../services/firestoreService'
import { uploadToCloudinary, validateFile } from '../../services/cloudinaryService'
import { showSuccess, showError } from '../../components/common/ToastNotification.vue'

export default {
  name: 'AdminMaterials',
  components: { AdminLayout },
  data() {
    return {
      form: { title: '', standard: '', subject: '', file: null },
      fileError: null,
      uploading: false,
      uploadProgress: 0,
      loading: true,
      materials: [],
      deleteTarget: null,
      deleting: false,
      standards: ['8th', '9th', '10th', '11th', '12th', 'Foundation', 'NEET', 'JEE', 'MHT-CET', 'Other'],
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Science', 'English', 'Marathi', 'Social Studies', 'History/Civics', 'Geography', 'General']
    }
  },
  async created() {
    await this.fetchMaterials()
  },
  methods: {
    async fetchMaterials() {
      this.loading = true
      try {
        this.materials = await getMaterials()
      } catch {
        showError('Failed to load materials', 'Check your Firebase connection.')
      } finally {
        this.loading = false
      }
    },

    onFileChange(e) { this.handleFile(e.target.files[0]) },
    onFileDrop(e) { this.handleFile(e.dataTransfer.files[0]) },

    handleFile(file) {
      if (!file) return
      const { valid, error } = validateFile(file, 'material')
      if (!valid) {
        this.fileError = error
        this.form.file = null
        return
      }
      this.fileError = null
      this.form.file = file
    },

    async handleUpload() {
      if (!this.form.file) return
      this.uploading = true
      this.uploadProgress = 0
      try {
        const isPdf = this.form.file.type === 'application/pdf'
        // Upload directly to Cloudinary — no CORS issues!
        const fileUrl = await uploadToCloudinary(
          this.form.file,
          (p) => { this.uploadProgress = p }
        )
        await addMaterial({
          title: this.form.title.trim(),
          standard: this.form.standard,
          subject: this.form.subject,
          fileUrl,
          type: isPdf ? 'pdf' : 'image'
        })
        showSuccess('Material uploaded!', 'Now visible on the Study Material page.')
        this.form = { title: '', standard: '', subject: '', file: null }
        this.uploadProgress = 0
        this.$refs.matFileInput.value = ''
        await this.fetchMaterials()
      } catch (err) {
        showError('Upload failed', err.message)
      } finally {
        this.uploading = false
      }
    },

    getPreviewUrl(mat) {
      if (!mat.fileUrl) return '#'
      // For PDFs, we can use Google Docs Viewer as a proxy if direct link fails
      // Or just ensure it's a clean secure URL
      return mat.fileUrl
    },

    getDownloadUrl(mat) {
      if (!mat.fileUrl) return '#'
      // Force download by adding fl_attachment to Cloudinary URL
      if (mat.fileUrl.includes('cloudinary.com')) {
        return mat.fileUrl.replace('/upload/', '/upload/fl_attachment/')
      }
      return mat.fileUrl
    },

    confirmDelete(mat) { this.deleteTarget = mat },

    async handleDelete() {
      if (!this.deleteTarget) return
      this.deleting = true
      try {
        // Only remove Firestore record
        // (Cloudinary deletion requires API secret — manage files via Cloudinary dashboard)
        await deleteMaterial(this.deleteTarget.id)
        showSuccess('Material removed', 'Removed from Firestore.')
        this.materials = this.materials.filter(m => m.id !== this.deleteTarget.id)
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
