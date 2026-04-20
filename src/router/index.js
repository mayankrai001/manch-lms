import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
