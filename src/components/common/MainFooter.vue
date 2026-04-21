<template>
  <footer class="bg-gray-900 text-white pt-12 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About -->
        <div class="col-span-1 md:col-span-1">
          <div class="mb-5 bg-black p-2 inline-block rounded-md shadow-inner">
            <img
              src="@/assets/logo.svg"
              alt="Manch Science Classes"
              class="h-14 md:h-16 w-auto"
            />
          </div>
          <p class="text-gray-400 text-sm mb-4">
            Nurturing Creative Innovators of Tomorrow. Welcome to Manch, where
            interactive learning meets well-rounded growth.
          </p>
        </div>

        <!-- Links -->
        <div>
          <h3
            class="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block"
          >
            Quick Links
          </h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li>
              <router-link
                to="/about"
                class="hover:text-secondary transition-colors"
                >About Us</router-link
              >
            </li>
            <li>
              <router-link
                to="/courses"
                class="hover:text-secondary transition-colors"
                >Courses</router-link
              >
            </li>
            <li>
              <router-link
                to="/faculty"
                class="hover:text-secondary transition-colors"
                >Faculty</router-link
              >
            </li>
            <li>
              <router-link
                to="/results"
                class="hover:text-secondary transition-colors"
                >Results</router-link
              >
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3
            class="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block"
          >
            Resources
          </h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li>
              <router-link
                to="/study-material"
                class="hover:text-secondary transition-colors"
                >Study Material</router-link
              >
            </li>
            <li>
              <router-link
                to="/gallery"
                class="hover:text-secondary transition-colors"
                >Gallery</router-link
              >
            </li>
            <li>
              <router-link
                to="/admission"
                class="hover:text-secondary transition-colors"
                >Admissions</router-link
              >
            </li>
            <li>
              <a href="#" class="hover:text-secondary transition-colors"
                >Privacy Policy</a
              >
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3
            class="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block"
          >
            Contact Us
          </h3>
          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex items-start gap-2">
              <svg
                class="h-5 w-5 text-secondary flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>123 Knowledge Avenue, Education City, 400001</span>
            </li>
            <li class="flex items-center gap-2">
              <svg
                class="h-5 w-5 text-secondary flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>+91 98765 43210</span>
            </li>
            <li class="flex items-center gap-2">
              <svg
                class="h-5 w-5 text-secondary flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>info@manchclasses.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p>
          &copy; {{ new Date().getFullYear() }} Manch Science Classes. All
          rights reserved.
        </p>
        <div class="flex space-x-4">
          <!-- Social Icons (Placeholders) -->
          <a href="#" class="text-gray-400 hover:text-white transition-colors"
            >Facebook</a
          >
          <a href="#" class="text-gray-400 hover:text-white transition-colors"
            >Twitter</a
          >
          <a href="#" class="text-gray-400 hover:text-white transition-colors"
            >Instagram</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "MainFooter",
};
</script>
