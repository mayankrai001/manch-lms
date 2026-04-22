<template>
  <AdminLayout>
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
      >
        <div :class="['h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0', stat.bg]">
          <span v-html="stat.icon"></span>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">
            <span v-if="loading">—</span>
            <span v-else>{{ stat.value }}</span>
          </p>
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-10">
      <h2 class="text-base font-semibold text-gray-700 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <router-link
          v-for="action in quickActions"
          :key="action.to"
          :to="action.to"
          :class="['p-5 rounded-2xl border-2 border-dashed transition-all hover:shadow-md hover:border-solid group', action.border, action.hover]"
        >
          <div :class="['h-10 w-10 rounded-xl flex items-center justify-center mb-3', action.iconBg]" v-html="action.icon"></div>
          <p class="font-semibold text-gray-800 text-sm">{{ action.title }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ action.description }}</p>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity placeholder -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-base font-semibold text-gray-700 mb-4">Welcome, {{ adminName }}!</h2>
      <p class="text-sm text-gray-500 leading-relaxed">
        Use the sidebar to manage gallery images, study materials, and lecture schedules.
        All changes reflect immediately on the public website.
      </p>
      <div class="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p class="text-xs text-blue-700 font-medium">💡 Tip: Real-time lecture updates are powered by Firestore's onSnapshot listener — students see changes instantly without refreshing.</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { useAuth } from '../../composables/useAuth'
import { getGalleryImages, getMaterials, getFaculty } from '../../services/firestoreService'

const ICON = {
  gallery: `<svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
  materials: `<svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`,
  faculty: `<svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
  lectures: `<svg class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
}

export default {
  name: 'AdminDashboard',
  components: { AdminLayout },
  setup() {
    const { user } = useAuth()
    return { user }
  },
  data() {
    return {
      loading: true,
      galleryCount: 0,
      materialsCount: 0,
      facultyCount: 0,
      stats: [],
      quickActions: [
        {
          to: '/admin/gallery',
          title: 'Upload Gallery Image',
          description: 'Add new event or campus photos',
          icon: ICON.gallery,
          iconBg: 'bg-purple-100',
          border: 'border-purple-200',
          hover: 'hover:bg-purple-50'
        },
        {
          to: '/admin/materials',
          title: 'Upload Study Material',
          description: 'Share PDFs or notes with students',
          icon: ICON.materials,
          iconBg: 'bg-green-100',
          border: 'border-green-200',
          hover: 'hover:bg-green-50'
        },
        {
          to: '/admin/faculty',
          title: 'Manage Faculty',
          description: 'Update team profiles and photos',
          icon: ICON.faculty,
          iconBg: 'bg-indigo-100',
          border: 'border-indigo-200',
          hover: 'hover:bg-indigo-50'
        },
        {
          to: '/admin/lectures',
          title: 'Manage Lectures',
          description: 'Create or edit timetable entries',
          icon: ICON.lectures,
          iconBg: 'bg-orange-100',
          border: 'border-orange-200',
          hover: 'hover:bg-orange-50'
        }
      ]
    }
  },
  computed: {
    adminName() {
      return this.user?.email?.split('@')[0] || 'Admin'
    }
  },
  async created() {
    try {
      const [gallery, materials, faculty] = await Promise.all([
        getGalleryImages(),
        getMaterials(),
        getFaculty()
      ])
      this.galleryCount = gallery.length
      this.materialsCount = materials.length
      this.facultyCount = faculty.length
    } catch {
      // Non-critical, just show 0
    } finally {
      this.loading = false
      this.stats = [
        { label: 'Gallery Images', value: this.galleryCount, bg: 'bg-purple-100', icon: ICON.gallery },
        { label: 'Study Materials', value: this.materialsCount, bg: 'bg-green-100', icon: ICON.materials },
        { label: 'Faculty Members', value: this.facultyCount, bg: 'bg-indigo-100', icon: ICON.faculty },
        { label: 'Live Lectures', value: '—', bg: 'bg-orange-100', icon: ICON.lectures }
      ]
    }
  }
}
</script>
