<template>
  <div class="home-page">
    <HeroCarousel />
    <StatsSection />
    <AboutPreview />
    <CourseCardsSection />
    <!-- Other sections like News, Gallery Preview, Testimonials, Contact can be added here -->
  </div>
</template>

<script>
import HeroCarousel from '../components/home/HeroCarousel.vue';
import StatsSection from '../components/home/StatsSection.vue';
import AboutPreview from '../components/home/AboutPreview.vue';
import CourseCardsSection from '../components/home/CourseCardsSection.vue';

export default {
  name: 'HomePage',
  components: {
    HeroCarousel,
    StatsSection,
    AboutPreview,
    CourseCardsSection
  }
}
</script>
