<template>
  <div class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-primary-dark mb-8 text-center">Our Expert Faculty</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="i in 8" :key="i" class="bg-white rounded-lg shadow-sm overflow-hidden text-center hover:shadow-md transition-shadow">
          <div class="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
            Image Placeholder
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800">Teacher Name</h3>
            <p class="text-secondary font-medium text-sm mb-2">Subject Expert</p>
            <p class="text-gray-600 text-sm">M.Sc, B.Ed</p>
            <p class="text-gray-500 text-sm mt-2">10+ Years Experience</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FacultyPage'
}
</script>
