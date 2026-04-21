<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md">
      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-700 to-blue-600 p-8 text-center">
          <div class="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white">Admin Login</h1>
          <p class="text-blue-200 text-sm mt-1">Manch Science Classes</p>
        </div>

        <!-- Form -->
        <div class="p-8">
          <!-- Error Alert -->
          <div v-if="error" class="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <svg class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email -->
            <div>
              <label for="admin-email" class="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="admin-email"
                  v-model="form.email"
                  type="email"
                  placeholder="admin@manchscience.com"
                  required
                  :disabled="loading"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60 disabled:bg-gray-50"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="admin-password" class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="admin-password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                  :disabled="loading"
                  class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60 disabled:bg-gray-50"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="!showPassword" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Submit -->
            <button
              id="admin-login-btn"
              type="submit"
              :disabled="loading"
              class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              <svg v-if="loading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ loading ? 'Signing in...' : 'Sign In to Admin Panel' }}
            </button>
          </form>

          <p class="text-center text-xs text-gray-400 mt-6">
            Restricted to authorized administrators only
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginAdmin } from '../../services/authService'

export default {
  name: 'AdminLogin',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      error: null,
      showPassword: false
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = null
      try {
        await loginAdmin(this.form.email, this.form.password)
        this.$router.push('/admin/dashboard')
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
