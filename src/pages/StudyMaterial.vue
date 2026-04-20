<template>
  <div class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-primary-dark mb-8 text-center">Study Material</h1>
      
      <div class="mb-8 flex overflow-x-auto pb-4 gap-2 border-b">
        <button v-for="category in categories" :key="category" 
          @click="activeCategory = category"
          :class="['px-4 py-2 font-medium whitespace-nowrap border-b-2 transition-colors', 
            activeCategory === category ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800']">
          {{ category }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
          <div class="flex items-start justify-between mb-4">
            <h3 class="font-bold text-gray-800">Physics - Chapter {{i}}: Kinematics Notes</h3>
            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">PDF</span>
          </div>
          <p class="text-gray-500 text-sm mb-6 flex-grow">Comprehensive notes covering all topics with practice questions.</p>
          <div class="flex gap-2 mt-auto">
            <button class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded text-sm font-medium transition-colors">Preview</button>
            <button class="flex-1 bg-primary hover:bg-primary-dark text-white py-2 rounded text-sm font-medium transition-colors">Download</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudyMaterialPage',
  data() {
    return {
      activeCategory: '11th-12th Science',
      categories: ['8th-9th Foundation', '10th Board', '11th-12th Science', 'NEET Prep', 'JEE Prep']
    }
  }
}
</script>
