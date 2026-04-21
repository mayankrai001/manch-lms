<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <!-- Hide Navbar/Footer on admin routes -->
    <template v-if="!isAdminRoute">
      <MainNavbar />
    </template>

    <main :class="isAdminRoute ? '' : 'flex-grow pt-16'">
      <router-view />
    </main>

    <template v-if="!isAdminRoute">
      <MainFooter />
    </template>

    <!-- Global Toast Notification (always present) -->
    <ToastNotification />
  </div>
</template>

<script>
import MainNavbar from './components/common/MainNavbar.vue'
import MainFooter from './components/common/MainFooter.vue'
import ToastNotification from './components/common/ToastNotification.vue'

export default {
  name: 'App',
  components: {
    MainNavbar,
    MainFooter,
    ToastNotification
  },
  computed: {
    isAdminRoute() {
      return this.$route.path.startsWith('/admin')
    }
  }
}
</script>

<style>
/* Global styles can also go here, but tailwind is in main.css */
</style>
