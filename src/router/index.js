import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import { getAuthReady } from '../services/authService'

// ── Public Routes ──────────────────────────────────────────────
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../pages/About.vue')
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('../pages/Courses.vue')
  },
  {
    path: '/faculty',
    name: 'Faculty',
    component: () => import('../pages/Faculty.vue')
  },
  {
    path: '/study-material',
    name: 'StudyMaterial',
    component: () => import('../pages/StudyMaterial.vue')
  },
  {
    path: '/admission',
    name: 'Admission',
    component: () => import('../pages/Admission.vue')
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('../pages/Gallery.vue')
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import('../pages/Results.vue')
  },
  {
    path: '/lectures',
    name: 'LecturePlanner',
    component: () => import('../pages/LecturePlanner.vue')
  },
  {
    path: '/msat-registration',
    name: 'MSATRegistration',
    component: () => import('../pages/MSATRegistration.vue')
  },

  // ── Admin Routes (protected) ─────────────────────────────────
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../pages/admin/AdminLogin.vue'),
    meta: { guestOnly: true } // Redirect if already logged in
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../pages/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/gallery',
    name: 'AdminGallery',
    component: () => import('../pages/admin/AdminGallery.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/materials',
    name: 'AdminMaterials',
    component: () => import('../pages/admin/AdminMaterials.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/faculty',
    name: 'AdminFaculty',
    component: () => import('../pages/admin/AdminFaculty.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/lectures',
    name: 'AdminLectures',
    component: () => import('../pages/admin/AdminLectures.vue'),
    meta: { requiresAuth: true }
  },

  // Catch-all 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// ── Navigation Guard ──────────────────────────────────────────
router.beforeEach(async (to) => {
  // Wait for Firebase auth to initialize (avoids race condition on first load)
  const user = await getAuthReady()

  // If route requires auth and user is not logged in → redirect to login
  if (to.meta.requiresAuth && !user) {
    return { name: 'AdminLogin' }
  }

  // If route is guest-only (login page) and user is already logged in → redirect to dashboard
  if (to.meta.guestOnly && user) {
    return { name: 'AdminDashboard' }
  }
})

export default router
