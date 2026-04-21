<template>
  <div class="py-16" :class="isAdmin ? 'bg-amber-50/20' : ''">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-primary-dark mb-2">Lecture Planner</h1>
        <p class="text-gray-500 text-sm">Upcoming class schedule for all batches</p>
        <div v-if="isAdmin" class="inline-flex items-center gap-2 mt-3 px-4 py-1.5 bg-amber-100 border border-amber-300 rounded-full text-amber-700 text-xs font-semibold">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Admin Edit Mode — Add, edit and delete lectures in real-time
        </div>
      </div>

      <!-- View Toggle -->
      <div class="flex justify-center gap-2 mb-8">
        <button @click="view = 'list'" :class="['px-4 py-2 rounded-xl text-sm font-medium transition-all', view === 'list' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50']">
          📋 List View
        </button>
        <button @click="view = 'timetable'" :class="['px-4 py-2 rounded-xl text-sm font-medium transition-all', view === 'timetable' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50']">
          📅 Weekly Timetable
        </button>
      </div>

      <!-- Admin Add Lecture Panel -->
      <div v-if="isAdmin" class="mb-8 bg-white border-2 border-dashed border-amber-300 rounded-2xl p-5">
        <h3 class="text-sm font-semibold text-amber-700 mb-4 flex items-center gap-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Lecture
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <input v-model="form.subject" placeholder="Subject *" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <input v-model="form.teacher" placeholder="Teacher *" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <select v-model="form.day" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option value="">Day *</option>
            <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
          </select>
          <input v-model="form.startTime" type="time" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <input v-model="form.endTime" type="time" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <select v-model="form.batch" class="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option value="">Batch *</option>
            <option v-for="b in batches" :key="b" :value="b">{{ b }}</option>
          </select>
        </div>
        <div v-if="formError" class="mt-2 text-xs text-red-500">{{ formError }}</div>
        <button @click="handleAddLecture" :disabled="adding"
          class="mt-3 px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2">
          <svg v-if="adding" class="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ adding ? 'Adding...' : '+ Add Lecture' }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="lectures.length === 0" class="text-center py-20">
        <svg class="h-16 w-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-400 font-medium">No lectures scheduled yet.</p>
        <p v-if="isAdmin" class="text-gray-400 text-sm mt-1">Use the form above to add your first lecture.</p>
      </div>

      <template v-else>
        <!-- ════ LIST VIEW ════ -->
        <div v-if="view === 'list'">
          <!-- Batch filter -->
          <div class="flex gap-2 mb-6 overflow-x-auto pb-1">
            <button
              v-for="b in ['All', ...batches]"
              :key="b"
              @click="activeBatch = b"
              :class="['px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all', activeBatch === b ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary']"
            >{{ b }}</button>
          </div>

          <div class="space-y-3">
            <div
              v-for="lecture in filteredLectures"
              :key="lecture.id"
              :class="['bg-white rounded-2xl border p-4 flex items-center gap-4 group transition-all', isAdmin ? 'border-amber-200 hover:border-amber-400 hover:shadow-sm' : 'border-gray-100 hover:shadow-sm']"
            >
              <!-- Day badge -->
              <div class="w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold text-primary uppercase">{{ lecture.day?.substring(0, 3) }}</span>
              </div>

              <!-- Info — editable in admin mode -->
              <div class="flex-1 min-w-0">
                <!-- Subject -->
                <input v-if="isAdmin" :value="lecture.subject"
                  @blur="saveLectureField(lecture, 'subject', $event.target.value)"
                  class="font-bold text-gray-800 w-full bg-transparent border-b-2 border-transparent hover:border-amber-300 focus:border-amber-400 focus:outline-none transition text-sm" />
                <p v-else class="font-bold text-gray-800 text-sm truncate">{{ lecture.subject }}</p>

                <!-- Teacher -->
                <input v-if="isAdmin" :value="lecture.teacher"
                  @blur="saveLectureField(lecture, 'teacher', $event.target.value)"
                  class="text-gray-500 text-xs w-full bg-transparent border-b-2 border-transparent hover:border-amber-300 focus:border-amber-400 focus:outline-none transition mt-0.5" />
                <p v-else class="text-gray-500 text-xs mt-0.5">{{ lecture.teacher }}</p>
              </div>

              <!-- Batch & Time -->
              <div class="text-right flex-shrink-0">
                <span class="inline-block px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-1">{{ lecture.batch }}</span>
                <p class="text-xs text-gray-500">{{ lecture.startTime }} – {{ lecture.endTime }}</p>
              </div>

              <!-- Admin delete -->
              <button v-if="isAdmin" @click="deleteLectureEntry(lecture)"
                class="opacity-0 group-hover:opacity-100 transition p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                title="Delete lecture">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ════ WEEKLY TIMETABLE VIEW ════ -->
        <div v-else class="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table class="w-full min-w-[640px] bg-white">
            <thead>
              <tr class="bg-primary text-white">
                <th class="py-3 px-4 text-left text-sm font-semibold w-24">Batch</th>
                <th v-for="day in days" :key="day" class="py-3 px-3 text-center text-sm font-semibold">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(batch, idx) in batches" :key="batch" :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'">
                <td class="py-3 px-4 font-semibold text-xs text-primary border-r border-gray-100 align-top">{{ batch }}</td>
                <td v-for="day in days" :key="day" class="py-2 px-2 border-r border-gray-100 align-top min-w-[100px]">
                  <div v-for="lec in getLecturesFor(batch, day)" :key="lec.id" class="mb-1 last:mb-0">
                    <div class="bg-primary/10 rounded-lg px-2 py-1.5 text-xs group relative">
                      <p class="font-semibold text-primary-dark leading-tight">{{ lec.subject }}</p>
                      <p class="text-gray-500 text-[10px] leading-tight">{{ lec.startTime }}–{{ lec.endTime }}</p>
                      <p class="text-gray-400 text-[10px] leading-tight">{{ lec.teacher }}</p>
                      <!-- Admin delete in timetable -->
                      <button v-if="isAdmin" @click="deleteLectureEntry(lec)"
                        class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition p-0.5 text-red-400 hover:text-red-600">
                        <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div v-if="getLecturesFor(batch, day).length === 0" class="text-gray-300 text-[10px] text-center py-2">—</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { subscribeToLectures, addLecture, updateLecture, deleteLecture } from '../services/firestoreService'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'LecturePlanner',

  setup() {
    const { user } = useAuth()
    return { user }
  },

  data() {
    return {
      lectures: [],
      loading: true,
      view: 'list',         // 'list' | 'timetable'
      activeBatch: 'All',
      unsubscribe: null,
      adding: false,
      formError: null,
      form: { subject: '', teacher: '', day: '', startTime: '', endTime: '', batch: '' },
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      batches: ['8th-9th Foundation', '10th Board', '11th-12th Science', 'NEET Prep', 'JEE Prep', 'MHT-CET']
    }
  },

  computed: {
    isAdmin() { return !!this.user },

    filteredLectures() {
      const sorted = [...this.lectures].sort((a, b) => {
        const dayOrder = this.days
        return (dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)) ||
               (a.startTime || '').localeCompare(b.startTime || '')
      })
      if (this.activeBatch === 'All') return sorted
      return sorted.filter(l => l.batch === this.activeBatch)
    }
  },

  created() {
    // Real-time subscription via onSnapshot
    this.unsubscribe = subscribeToLectures((lectures) => {
      this.lectures = lectures
      this.loading = false
    })
  },

  beforeUnmount() {
    // Clean up Firestore listener when leaving page
    if (this.unsubscribe) this.unsubscribe()
  },

  methods: {
    getLecturesFor(batch, day) {
      return this.lectures
        .filter(l => l.batch === batch && l.day === day)
        .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
    },

    async handleAddLecture() {
      const { subject, teacher, day, startTime, endTime, batch } = this.form
      if (!subject || !teacher || !day || !batch) {
        this.formError = 'Subject, teacher, day and batch are required.'
        return
      }
      this.formError = null
      this.adding = true
      try {
        await addLecture({ subject, teacher, day, startTime, endTime, batch })
        // Real-time listener will auto-add it to the list
        this.form = { subject: '', teacher: '', day: '', startTime: '', endTime: '', batch: '' }
      } catch (e) {
        console.error('Add lecture error:', e)
        this.formError = 'Failed to add lecture. Try again.'
      } finally {
        this.adding = false
      }
    },

    async saveLectureField(lecture, field, value) {
      if (lecture[field] === value || !value) return
      lecture[field] = value  // Optimistic update
      try {
        await updateLecture(lecture.id, { [field]: value })
      } catch (e) {
        console.error('Update failed:', e)
      }
    },

    async deleteLectureEntry(lecture) {
      if (!confirm(`Delete "${lecture.subject}" on ${lecture.day}?`)) return
      try {
        await deleteLecture(lecture.id)
        // onSnapshot listener removes it automatically from the list
      } catch (e) {
        console.error('Delete error:', e)
      }
    }
  }
}
</script>
