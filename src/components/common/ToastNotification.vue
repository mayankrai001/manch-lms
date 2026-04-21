<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-sm',
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          ]"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5">
            <svg v-if="toast.type === 'success'" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="toast.type === 'error'" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <!-- Message -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-xs mt-0.5 opacity-80">{{ toast.message }}</p>
          </div>

          <!-- Close button -->
          <button @click="removeToast(toast.id)" class="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script>
// Singleton toast state — importable anywhere
import { reactive } from 'vue'

export const toastState = reactive({ toasts: [] })
let nextId = 0

export const showToast = (title, message = '', type = 'info', duration = 4000) => {
  const id = ++nextId
  toastState.toasts.push({ id, title, message, type })
  setTimeout(() => {
    const idx = toastState.toasts.findIndex(t => t.id === id)
    if (idx !== -1) toastState.toasts.splice(idx, 1)
  }, duration)
}

export const showSuccess = (title, message = '') => showToast(title, message, 'success')
export const showError = (title, message = '') => showToast(title, message, 'error')
export const showInfo = (title, message = '') => showToast(title, message, 'info')

export default {
  name: 'ToastNotification',
  data() {
    return {
      toasts: toastState.toasts
    }
  },
  methods: {
    removeToast(id) {
      const idx = this.toasts.findIndex(t => t.id === id)
      if (idx !== -1) this.toasts.splice(idx, 1)
    }
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
</style>
