<template>
  <div class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row items-center gap-12">
        <div class="w-full lg:w-1/2">
          <!-- Video Placeholder -->
          <div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
            <div class="absolute inset-0 flex items-center justify-center">
              <button class="bg-primary/90 hover:bg-primary text-white rounded-full p-4 transition-transform transform hover:scale-110 shadow-xl">
                <svg class="h-10 w-10 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
            <span class="text-gray-500 font-medium">Video Placeholder</span>
          </div>
        </div>
        
        <div class="w-full lg:w-1/2">
          <h2 class="text-sm font-bold text-secondary uppercase tracking-wider mb-2">About Us</h2>
          <h3 class="text-3xl font-bold text-gray-900 mb-6">Welcome to Manch Science Classes</h3>
          <p class="text-gray-600 mb-6 leading-relaxed">
            At Manch, we believe in nurturing creative innovators of tomorrow. Our mission is to provide an interactive learning environment that not only focuses on academic excellence but also well-rounded growth. We empower students to achieve their dreams in competitive exams like NEET, JEE, and Board examinations.
          </p>
          <router-link to="/about" class="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors">
            Read Our Full Story
            <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPreview'
}
</script>
