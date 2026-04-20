<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <MainNavbar />
    
    <main class="flex-grow pt-16">
      <router-view />
    </main>

    <MainFooter />
  </div>
</template>

<script>
import MainNavbar from './components/common/MainNavbar.vue';
import MainFooter from './components/common/MainFooter.vue';

export default {
  name: 'App',
  components: {
    MainNavbar,
    MainFooter
  }
}
</script>

<style>
/* Global styles can also go here, but tailwind is in main.css */
</style>
