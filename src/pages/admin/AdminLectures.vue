<template>
  <AdminLayout>
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">

      <!-- Form: Add/Edit Lecture -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-base font-semibold text-gray-800 mb-5">
            {{ editingId ? 'Edit Lecture' : 'Add New Lecture' }}
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Subject -->
            <div>
              <label for="lec-subject" class="block text-sm font-medium text-gray-700 mb-1.5">Subject <span class="text-red-500">*</span></label>
              <input
                id="lec-subject"
                v-model="form.subject"
                type="text"
                placeholder="e.g., Physics"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <!-- Teacher -->
            <div>
              <label for="lec-teacher" class="block text-sm font-medium text-gray-700 mb-1.5">Teacher <span class="text-red-500">*</span></label>
              <input
                id="lec-teacher"
                v-model="form.teacher"
                type="text"
                placeholder="e.g., Prof. Sharma"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <!-- Class -->
            <div>
              <label for="lec-class" class="block text-sm font-medium text-gray-700 mb-1.5">Class <span class="text-red-500">*</span></label>
              <select
                id="lec-class"
                v-model="form.class"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="" disabled>Select class</option>
                <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
              </select>
            </div>

            <!-- Date -->
            <div>
              <label for="lec-date" class="block text-sm font-medium text-gray-700 mb-1.5">Date <span class="text-red-500">*</span></label>
              <input
                id="lec-date"
                v-model="form.date"
                type="date"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <!-- Time -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="lec-start" class="block text-sm font-medium text-gray-700 mb-1.5">Start Time <span class="text-red-500">*</span></label>
                <input
                  id="lec-start"
                  v-model="form.startTime"
                  type="time"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label for="lec-end" class="block text-sm font-medium text-gray-700 mb-1.5">End Time <span class="text-red-500">*</span></label>
                <input
                  id="lec-end"
                  v-model="form.endTime"
                  type="time"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-1">
              <button
                v-if="editingId"
                type="button"
                @click="cancelEdit"
                class="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >Cancel</button>
              <button
                id="lecture-submit-btn"
                type="submit"
                :disabled="submitting"
                class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
              >
                <svg v-if="submitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ submitting ? 'Saving...' : (editingId ? 'Update Lecture' : 'Add Lecture') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lectures List — Real-time -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-base font-semibold text-gray-800">Scheduled Lectures</h2>
              <p class="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                <span class="h-1.5 w-1.5 rounded-full bg-green-500 inline-block"></span>
                Live — updates in real time
              </p>
            </div>
            <span class="text-sm text-gray-400">{{ lectures.length }} total</span>
          </div>

          <!-- Loading -->
          <div v-if="loadingLectures" class="space-y-3">
            <div v-for="i in 3" :key="i" class="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
          </div>

          <!-- Empty -->
          <div v-else-if="lectures.length === 0" class="text-center py-12">
            <svg class="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-sm text-gray-400">No lectures scheduled. Add your first one!</p>
          </div>

          <!-- Cards -->
          <div v-else class="space-y-3">
            <div
              v-for="lec in lectures"
              :key="lec.id"
              class="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition group"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-semibold text-gray-800 text-sm">{{ lec.subject }}</span>
                    <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{{ lec.class }}</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">👤 {{ lec.teacher }}</p>
                  <p class="text-xs text-gray-500">📅 {{ formatDate(lec.date) }} &nbsp;⏰ {{ lec.startTime }} – {{ lec.endTime }}</p>
                </div>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button @click="startEdit(lec)" class="p-1.5 text-gray-400 hover:text-blue-600 transition" title="Edit">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(lec.id)" class="p-1.5 text-gray-400 hover:text-red-500 transition" title="Delete">
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
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { addLecture, updateLecture, deleteLecture, subscribeToLectures } from '../../services/firestoreService'
import { showSuccess, showError } from '../../components/common/ToastNotification.vue'

const emptyForm = () => ({
  subject: '',
  teacher: '',
  class: '',
  date: '',
  startTime: '',
  endTime: ''
})

export default {
  name: 'AdminLectures',
  components: { AdminLayout },
  data() {
    return {
      form: emptyForm(),
      lectures: [],
      loadingLectures: true,
      submitting: false,
      editingId: null,
      unsubscribe: null,
      classes: ['8th', '9th', '10th', '11th', '12th', 'NEET Batch', 'JEE Batch', 'MHT-CET Batch']
    }
  },
  created() {
    // Real-time listener
    this.unsubscribe = subscribeToLectures((lectures) => {
      this.lectures = lectures
      this.loadingLectures = false
    })
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    async handleSubmit() {
      this.submitting = true
      try {
        if (this.editingId) {
          await updateLecture(this.editingId, { ...this.form })
          showSuccess('Lecture updated!', 'Changes are live immediately.')
          this.editingId = null
        } else {
          await addLecture({ ...this.form })
          showSuccess('Lecture added!', 'Now visible on the timetable.')
        }
        this.form = emptyForm()
      } catch (err) {
        showError('Operation failed', err.message)
      } finally {
        this.submitting = false
      }
    },

    startEdit(lec) {
      this.editingId = lec.id
      this.form = {
        subject: lec.subject,
        teacher: lec.teacher,
        class: lec.class,
        date: lec.date,
        startTime: lec.startTime,
        endTime: lec.endTime
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    cancelEdit() {
      this.editingId = null
      this.form = emptyForm()
    },

    async handleDelete(id) {
      if (!confirm('Delete this lecture?')) return
      try {
        await deleteLecture(id)
        showSuccess('Lecture deleted')
      } catch (err) {
        showError('Delete failed', err.message)
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
      })
    }
  }
}
</script>
