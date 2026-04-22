<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg flex flex-col fixed inset-y-0 left-0 z-30">
      <!-- Logo -->
      <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-700 to-blue-600">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
            <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <p class="text-white font-bold text-sm leading-tight">Manch Science</p>
            <p class="text-blue-200 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group"
          :class="[
            $route.path === item.to
              ? 'bg-blue-50 text-blue-700 border border-blue-100'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          ]"
        >
          <span class="flex-shrink-0" v-html="item.icon"></span>
          {{ item.label }}
        </router-link>
      </nav>

      <!-- Bottom: User + Logout -->
      <div class="px-4 py-4 border-t border-gray-100">
        <div class="flex items-center gap-3 mb-3 p-2 rounded-lg bg-gray-50">
          <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
            {{ adminInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-gray-800 truncate">{{ adminEmail }}</p>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="flex-1 ml-64 flex flex-col min-h-screen">
      <!-- Top bar -->
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 class="text-lg font-bold text-gray-900">{{ currentPageTitle }}</h1>
          <p class="text-xs text-gray-500 mt-0.5">Manch Science Classes Admin</p>
        </div>
        <div class="flex items-center gap-2">
          <router-link to="/" target="_blank" class="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Site
          </router-link>
        </div>
      </header>

      <!-- Page content slot -->
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
import { useAuth } from '../../composables/useAuth'
import { useRouter } from 'vue-router'
import { showSuccess } from '../common/ToastNotification.vue'

const NAV_ICONS = {
  dashboard: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
  gallery: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
  materials: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`,
  faculty: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
  lectures: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
}

export default {
  name: 'AdminLayout',
  setup() {
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
      await logout()
      showSuccess('Logged out', 'See you next time!')
      router.push('/admin/login')
    }

    return { user, handleLogout }
  },
  data() {
    return {
      navItems: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: NAV_ICONS.dashboard },
        { to: '/admin/gallery', label: 'Gallery', icon: NAV_ICONS.gallery },
        { to: '/admin/materials', label: 'Study Materials', icon: NAV_ICONS.materials },
        { to: '/admin/faculty', label: 'Faculty', icon: NAV_ICONS.faculty },
        { to: '/admin/lectures', label: 'Lectures', icon: NAV_ICONS.lectures }
      ]
    }
  },
  computed: {
    adminEmail() {
      return this.user?.email || 'admin@manch.com'
    },
    adminInitial() {
      return (this.user?.email || 'A').charAt(0).toUpperCase()
    },
    currentPageTitle() {
      const titles = {
        '/admin/dashboard': 'Dashboard',
        '/admin/gallery': 'Gallery Management',
        '/admin/materials': 'Study Materials',
        '/admin/faculty': 'Faculty Management',
        '/admin/lectures': 'Lecture Planner'
      }
      return titles[this.$route.path] || 'Admin Panel'
    }
  }
}
</script>
