<template>
  <div class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-primary-dark mb-8 text-center">Our Hall of Fame</h1>
      
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">NEET & JEE Top Scorers</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="'neet'+i" class="bg-white rounded-lg shadow-sm p-4 text-center border-t-4 border-primary">
            <div class="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-3"></div>
            <h3 class="font-bold text-gray-800">Student Name</h3>
            <p class="text-secondary font-bold">AIR {{ i * 15 }}</p>
            <p class="text-xs text-gray-500">NEET 2023</p>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Board Exam Toppers</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="'board'+i" class="bg-white rounded-lg shadow-sm p-4 text-center border-t-4 border-secondary">
            <div class="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-3"></div>
            <h3 class="font-bold text-gray-800">Student Name</h3>
            <p class="text-primary-dark font-bold">9{{ 9-i }}%</p>
            <p class="text-xs text-gray-500">HSC 2023</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultsPage'
}
</script>
