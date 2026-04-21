<template>
  <div class="py-16" :class="isAdmin ? 'bg-amber-50/20' : ''">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-primary-dark mb-2">Our Hall of Fame</h1>
        <p class="text-gray-500 text-sm">Celebrating the achievements of our students</p>
        <div v-if="isAdmin" class="inline-flex items-center gap-2 mt-4 px-4 py-1.5 bg-amber-100 border border-amber-300 rounded-full text-amber-700 text-xs font-semibold">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Admin Edit Mode — Click any field to edit
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl shadow-sm animate-pulse">
          <div class="w-24 h-24 bg-gray-200 rounded-full mx-auto mt-6"></div>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>

      <!-- Category groups -->
      <div v-else-if="groupedResults.length > 0">
        <div v-for="group in groupedResults" :key="group.category" class="mb-14">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-3">{{ group.category }}</h2>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <!-- Result Card -->
            <div
              v-for="result in group.items"
              :key="result.id"
              :class="[
                'bg-white rounded-2xl shadow-sm p-5 text-center border-t-4 transition-all',
                group.category.includes('NEET') || group.category.includes('JEE') ? 'border-primary' : 'border-secondary',
                isAdmin ? 'ring-2 ring-amber-200 hover:ring-amber-400 hover:shadow-md' : 'hover:shadow-md'
              ]"
            >
              <!-- Photo -->
              <div class="relative w-24 h-24 mx-auto mb-3 group">
                <img
                  v-if="result.imageUrl"
                  :src="result.imageUrl"
                  :alt="result.name"
                  class="w-full h-full object-cover rounded-full border-2 border-gray-100"
                />
                <div v-else class="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <!-- Admin image controls -->
                <div v-if="isAdmin" class="absolute inset-0 bg-black/0 group-hover:bg-black/50 rounded-full transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                  <button @click="triggerPhotoUpload(result)" :disabled="result._uploading" class="p-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition" title="Upload photo">
                    <svg v-if="!result._uploading" class="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <svg v-else class="h-3.5 w-3.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  </button>
                  <button v-if="result.imageUrl" @click="clearPhoto(result)" class="p-1.5 bg-red-500 hover:bg-red-600 rounded-lg transition" title="Remove photo">
                    <svg class="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <!-- Upload progress -->
                <div v-if="result._uploadProgress > 0 && result._uploadProgress < 100" class="absolute -bottom-1 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 transition-all" :style="{ width: result._uploadProgress + '%' }"></div>
                </div>
              </div>

              <!-- Name -->
              <input v-if="isAdmin" :value="result.name" @blur="saveResultField(result, 'name', $event.target.value)"
                placeholder="Student Name"
                class="w-full text-center font-bold text-gray-800 text-sm bg-transparent border-b-2 border-transparent hover:border-amber-300 focus:border-amber-400 focus:outline-none transition mb-1 px-1" />
              <h3 v-else class="font-bold text-gray-800 text-sm mb-1">{{ result.name || 'Student Name' }}</h3>

              <!-- Score -->
              <input v-if="isAdmin" :value="result.score" @blur="saveResultField(result, 'score', $event.target.value)"
                placeholder="Score / Rank"
                class="w-full text-center font-bold text-secondary text-sm bg-transparent border-b-2 border-transparent hover:border-amber-300 focus:border-amber-400 focus:outline-none transition mb-1 px-1" />
              <p v-else class="font-bold text-secondary text-sm mb-1">{{ result.score || 'Score' }}</p>

              <!-- Exam -->
              <input v-if="isAdmin" :value="result.exam" @blur="saveResultField(result, 'exam', $event.target.value)"
                placeholder="e.g., NEET 2024"
                class="w-full text-center text-xs text-gray-500 bg-transparent border-b-2 border-transparent hover:border-amber-300 focus:border-amber-400 focus:outline-none transition mb-2 px-1" />
              <p v-else class="text-xs text-gray-500 mb-2">{{ result.exam || 'Exam' }}</p>

              <!-- Admin delete -->
              <button v-if="isAdmin" @click="confirmDelete(result)" class="text-xs text-red-400 hover:text-red-600 transition flex items-center gap-1 mx-auto mt-1">
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>

            <!-- Add new result card (admin) -->
            <div v-if="isAdmin && group.items === groupedResults[groupedResults.length - 1]?.items"
              @click="addResult(group.category)"
              class="border-2 border-dashed border-gray-300 hover:border-amber-400 hover:bg-amber-50/50 rounded-2xl flex flex-col items-center justify-center min-h-[200px] cursor-pointer transition-all">
              <svg class="h-8 w-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-xs text-gray-500">Add topper</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <svg class="h-16 w-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <p class="text-gray-400 font-medium">No results yet.</p>
        <div v-if="isAdmin" class="flex gap-3 justify-center mt-4">
          <button @click="addResult('NEET / JEE Toppers')" class="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition">+ Add NEET/JEE Topper</button>
          <button @click="addResult('Board Exam Toppers')" class="px-4 py-2 bg-secondary text-white rounded-xl text-sm font-medium hover:opacity-90 transition">+ Add Board Topper</button>
        </div>
      </div>

      <!-- Admin: Add buttons (when results exist) -->
      <div v-if="isAdmin && results.length > 0" class="flex justify-center gap-4 mt-8">
        <button @click="addResult('NEET / JEE Toppers')" class="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl text-sm font-medium transition">+ NEET/JEE Topper</button>
        <button @click="addResult('Board Exam Toppers')" class="px-5 py-2.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 rounded-xl text-sm font-medium transition">+ Board Topper</button>
      </div>

      <!-- Hidden file input -->
      <input ref="photoInput" type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="handlePhotoFile" />
    </div>

    <!-- Delete Modal -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 class="font-bold text-gray-900 mb-2">Remove Result?</h3>
        <p class="text-sm text-gray-500 mb-5">Remove <strong>{{ deleteTarget.name || 'this entry' }}</strong> from the Hall of Fame?</p>
        <div class="flex gap-3">
          <button @click="deleteTarget = null" class="flex-1 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button @click="handleDelete" :disabled="deleting" class="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2">
            <svg v-if="deleting" class="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            {{ deleting ? 'Removing...' : 'Remove' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getResults, addResult, updateResult, deleteResult } from '../services/firestoreService'
import { uploadToCloudinary, validateFile } from '../services/cloudinaryService'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'ResultsPage',

  setup() {
    const { user } = useAuth()
    return { user }
  },

  data() {
    return {
      results: [],
      loading: true,
      deleteTarget: null,
      deleting: false,
      activeUploadResult: null
    }
  },

  computed: {
    isAdmin() { return !!this.user },
    groupedResults() {
      const map = new Map()
      for (const r of this.results) {
        const cat = r.category || 'NEET / JEE Toppers'
        if (!map.has(cat)) map.set(cat, [])
        map.get(cat).push(r)
      }
      return Array.from(map.entries()).map(([category, items]) => ({ category, items }))
    }
  },

  async created() {
    await this.loadResults()
  },

  methods: {
    async loadResults() {
      this.loading = true
      try {
        const data = await getResults()
        this.results = data.map(r => ({ ...r, _uploading: false, _uploadProgress: 0 }))
      } catch (e) {
        console.error('Results load error:', e)
      } finally {
        this.loading = false
      }
    },

    async saveResultField(result, field, value) {
      if (result[field] === value) return
      result[field] = value
      try {
        await updateResult(result.id, { [field]: value })
      } catch (e) {
        console.error('Save failed:', e)
      }
    },

    async addResult(category) {
      try {
        const docRef = await addResult({ name: 'Student Name', score: 'Score', exam: 'Exam 2024', category })
        this.results.unshift({ id: docRef.id, name: 'Student Name', score: 'Score', exam: 'Exam 2024', category, imageUrl: '', _uploading: false, _uploadProgress: 0 })
      } catch (e) {
        console.error('Add result error:', e)
      }
    },

    triggerPhotoUpload(result) {
      this.activeUploadResult = result
      this.$refs.photoInput.value = ''
      this.$refs.photoInput.click()
    },

    async handlePhotoFile(event) {
      const file = event.target.files[0]
      const result = this.activeUploadResult
      if (!file || !result) return
      const { valid, error } = validateFile(file, 'image')
      if (!valid) { alert(error); return }

      result._uploading = true
      result._uploadProgress = 0
      try {
        const imageUrl = await uploadToCloudinary(file, (p) => { result._uploadProgress = p })
        await updateResult(result.id, { imageUrl })
        result.imageUrl = imageUrl
      } catch (e) {
        console.error('Upload error:', e)
        alert('Upload failed. Check Cloudinary config.')
      } finally {
        result._uploading = false
        result._uploadProgress = 0
        this.activeUploadResult = null
      }
    },

    async clearPhoto(result) {
      result.imageUrl = ''
      await updateResult(result.id, { imageUrl: '' })
    },

    confirmDelete(result) { this.deleteTarget = result },

    async handleDelete() {
      if (!this.deleteTarget) return
      this.deleting = true
      try {
        await deleteResult(this.deleteTarget.id)
        this.results = this.results.filter(r => r.id !== this.deleteTarget.id)
        this.deleteTarget = null
      } catch (e) {
        console.error('Delete error:', e)
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>
