<template>
  <div class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-sm font-bold text-secondary uppercase tracking-wider mb-2">Our Programs</h2>
        <h3 class="text-3xl font-bold text-gray-900">Explore Our Courses</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <CourseCard 
          v-for="(course, index) in topCourses" 
          :key="index"
          :title="course.title"
          :points="course.points"
        />
      </div>
      
      <div class="text-center mt-12">
        <router-link to="/courses" class="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded transition-colors shadow-sm">
          View All Courses
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import CourseCard from '../common/CourseCard.vue';

export default {
  name: 'CourseCardsSection',
  components: {
    CourseCard
  },
  data() {
    return {
      topCourses: [
        { title: '8th - 9th Foundation', points: ['Building basic concepts', 'Mental ability training'] },
        { title: 'Medical Entrance (NEET)', points: ['Medical entrance focus', 'Rigorous biology training'] },
        { title: 'Engineering Entrance (JEE)', points: ['Engineering entrance', 'Advanced problem solving'] }
      ]
    }
  }
}
</script>
