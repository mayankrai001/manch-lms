<template>
  <div class="relative bg-blue-900 h-[500px] overflow-hidden" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
    <!-- Carousel Track -->
    <div 
      class="whitespace-nowrap h-full" 
      :class="{ 'transition-transform duration-700 ease-in-out': !isSnapping }"
      :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      @transitionend="handleTransitionEnd"
    >
      <div v-for="(slide, index) in displaySlides" :key="index" class="inline-block w-full h-full relative">
        <!-- Placeholder for background image -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
        
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center px-4 max-w-4xl mx-auto whitespace-normal">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-md">
              {{ slide.tagline }}
            </h1>
            <p class="text-xl text-blue-100 mb-8 font-medium">
              {{ slide.subtext }}
            </p>
            <div class="space-x-4">
              <router-link to="/admission" class="bg-secondary hover:bg-secondary-dark text-white px-8 py-3 rounded-full font-bold transition-colors inline-block shadow-lg">
                Join Us Today
              </router-link>
              <router-link to="/courses" class="bg-white hover:bg-gray-100 text-primary-dark px-8 py-3 rounded-full font-bold transition-colors inline-block shadow-lg">
                Explore Courses
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Carousel Controls -->
    <button @click="prev" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white z-10">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
    </button>
    <button @click="next" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white z-10">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
    </button>

    <!-- Navigation Dots -->
    <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
      <button v-for="(slide, index) in slides" :key="'dot'+index" 
        @click="goToSlide(index)"
        :class="['w-3 h-3 rounded-full transition-colors', activeDot === index ? 'bg-secondary' : 'bg-white/50']">
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroCarousel',
  data() {
    return {
      currentSlide: 1, // Start at the first real slide (index 1 in displaySlides)
      isSnapping: false,
      interval: null,
      slides: [
        { tagline: 'Nurturing Creative Innovators of Tomorrow', subtext: 'Welcome to Manch, where interactive learning meets well-rounded growth' },
        { tagline: 'Excellence in NEET & JEE', subtext: 'Expert faculty and comprehensive study material' },
        { tagline: 'Strong Foundation from 8th Grade', subtext: 'Building concepts early for a brighter future' },
        { tagline: 'Achieve Beyond Academics', subtext: 'Fostering overall personality development' }
      ]
    }
  },
  computed: {
    displaySlides() {
      if (this.slides.length === 0) return [];
      // [Last Slide Clone, Slide 1, Slide 2, Slide 3, Slide 4, First Slide Clone]
      return [
        this.slides[this.slides.length - 1],
        ...this.slides,
        this.slides[0]
      ];
    },
    activeDot() {
      // Map currentSlide (1 to length) to dot index (0 to length-1)
      if (this.currentSlide === 0) return this.slides.length - 1;
      if (this.currentSlide > this.slides.length) return 0;
      return this.currentSlide - 1;
    }
  },
  methods: {
    next() {
      if (this.isSnapping) return;
      this.currentSlide++;
    },
    prev() {
      if (this.isSnapping) return;
      this.currentSlide--;
    },
    goToSlide(index) {
      if (this.isSnapping) return;
      this.currentSlide = index + 1;
    },
    handleTransitionEnd() {
      // If we reached the end clone (First Slide Clone)
      if (this.currentSlide >= this.displaySlides.length - 1) {
        this.isSnapping = true;
        this.currentSlide = 1;
        // Wait for next tick to re-enable transitions
        this.$nextTick(() => {
          // forcing reflow might be needed in some browsers, but Vue's reactive update usually handles it
          setTimeout(() => { this.isSnapping = false; }, 50);
        });
      }
      // If we reached the beginning clone (Last Slide Clone)
      else if (this.currentSlide <= 0) {
        this.isSnapping = true;
        this.currentSlide = this.slides.length;
        this.$nextTick(() => {
          setTimeout(() => { this.isSnapping = false; }, 50);
        });
      }
    },
    startAutoPlay() {
      this.stopAutoPlay();
      this.interval = setInterval(this.next, 5000);
    },
    stopAutoPlay() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  },
  mounted() {
    this.startAutoPlay();
  },
  beforeUnmount() {
    this.stopAutoPlay();
  }
}
</script>
