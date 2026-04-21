<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      :class="['rounded-full border-4 border-t-transparent animate-spin', sizeClass, colorClass]"
    ></div>
    <span v-if="label" class="ml-3 text-sm font-medium" :class="labelColorClass">
      {{ label }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'md', // 'sm' | 'md' | 'lg'
    },
    color: {
      type: String,
      default: 'primary', // 'primary' | 'white' | 'gray'
    },
    label: {
      type: String,
      default: ''
    },
    fullPage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    containerClass() {
      return this.fullPage ? 'fixed inset-0 bg-white bg-opacity-80 z-50' : ''
    },
    sizeClass() {
      return {
        sm: 'h-5 w-5 border-2',
        md: 'h-8 w-8 border-4',
        lg: 'h-12 w-12 border-4'
      }[this.size] || 'h-8 w-8 border-4'
    },
    colorClass() {
      return {
        primary: 'border-blue-600',
        white: 'border-white',
        gray: 'border-gray-400'
      }[this.color] || 'border-blue-600'
    },
    labelColorClass() {
      return this.color === 'white' ? 'text-white' : 'text-gray-600'
    }
  }
}
</script>
