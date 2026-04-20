<template>
  <div class="py-16 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
    <div class="p-6 flex-grow">
      <h3 class="text-xl font-bold text-gray-800 mb-3">{{ title }}</h3>
      <ul class="space-y-2 mb-6">
        <li v-for="(point, idx) in points" :key="idx" class="flex items-start text-sm text-gray-600">
          <svg class="h-4 w-4 text-secondary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ point }}
        </li>
      </ul>
    </div>
    <div class="px-6 pb-6 mt-auto">
      <button class="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded font-medium transition-colors">
        View Details
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseCard',
  props: {
    title: { type: String, required: true },
    points: { type: Array, required: true }
  }
}
</script>
