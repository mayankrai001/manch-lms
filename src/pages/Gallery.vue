<template>
  <div class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-primary-dark mb-8 text-center">Gallery</h1>
      
      <div v-for="event in events" :key="event.name" class="mb-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-secondary pl-3">{{ event.name }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer relative">
            <div class="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
              <svg class="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GalleryPage',
  data() {
    return {
      events: [
        { name: 'Aarambh - Annual Function' },
        { name: 'TechFest - Innovation Showcase' },
        { name: 'Inspire - Guest Lectures' },
        { name: 'Transform - Farewell Ceremony' }
      ]
    }
  }
}
</script>
