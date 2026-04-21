<template>
  <nav class="fixed top-0 left-0 w-full bg-white shadow-md z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center py-1">
            <img
              src="@/assets/logo.svg"
              alt="Manch Science Classes"
              class="h-16 w-auto"
            />
          </router-link>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-6">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
            active-class="text-primary font-bold"
          >
            {{ link.name }}
          </router-link>
          <router-link
            to="/admission"
            class="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200 shadow-sm"
          >
            Admissions
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button
            @click="toggleMobileMenu"
            class="text-gray-600 hover:text-primary focus:outline-none"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="isMobileMenuOpen" class="md:hidden bg-white border-t">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          @click="closeMobileMenu"
          class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50 rounded-md"
          active-class="text-primary bg-blue-50 font-bold"
        >
          {{ link.name }}
        </router-link>
        <router-link
          to="/admission"
          @click="closeMobileMenu"
          class="block w-full text-left px-3 py-2 text-base font-medium bg-secondary text-white rounded-md mt-2"
        >
          Admissions
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "MainNavbar",
  data() {
    return {
      isMobileMenuOpen: false,
      navLinks: [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Courses", path: "/courses" },
        { name: "Faculty", path: "/faculty" },
        { name: "Study Material", path: "/study-material" },
        { name: "Gallery", path: "/gallery" },
        { name: "Results", path: "/results" },
        { name: "Lectures", path: "/lectures" },
      ],
    };
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
  },
};
</script>
