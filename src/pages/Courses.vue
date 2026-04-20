<template>
  <div class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-primary-dark mb-8 text-center">Our Courses</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <CourseCard 
          v-for="(course, index) in courses" 
          :key="index"
          :title="course.title"
          :points="course.points"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CourseCard from '../components/common/CourseCard.vue';

export default {
  name: 'CoursesPage',
  components: {
    CourseCard
  },
  data() {
    return {
      courses: [
        { title: '8th - 9th Foundation', points: ['Building basic concepts', 'Mental ability training'] },
        { title: 'SSC (10th Board)', points: ['Complete board syllabus', 'Mock test series'] },
        { title: 'HSC (11th - 12th)', points: ['Science stream focus', 'Board exam preparation'] },
        { title: 'MHT-CET', points: ['State-level engineering', 'Pharmacy entrance prep'] },
        { title: 'NEET', points: ['Medical entrance focus', 'Rigorous biology training'] },
        { title: 'JEE Main & Advanced', points: ['Engineering entrance', 'Advanced problem solving'] }
      ]
    }
  }
}
</script>
