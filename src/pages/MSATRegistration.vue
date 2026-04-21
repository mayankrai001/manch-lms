<template>
  <div class="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-center text-white">
          <div class="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold mb-1">MSAT Registration</h1>
          <p class="text-blue-200 text-sm">Manch Scholarship Admission Test</p>
          <div class="mt-4 inline-block bg-white/10 px-4 py-1.5 rounded-full text-xs font-medium">
            🏆 Win up to 100% scholarship
          </div>
        </div>

        <div class="p-8">
          <!-- Success State -->
          <div v-if="submitted" class="text-center py-8">
            <div class="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
            <p class="text-gray-500 mb-2">Thank you, <strong>{{ submittedName }}</strong>!</p>
            <p class="text-gray-400 text-sm">Our team will reach out with exam details within 24–48 hours.</p>
            <div class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700 text-left">
              <p class="font-medium mb-1">📌 What's Next?</p>
              <ul class="space-y-1 text-blue-600 text-xs">
                <li>• You'll receive exam date & venue details via phone/email</li>
                <li>• Bring original mark sheets for verification</li>
                <li>• No exam fee required</li>
              </ul>
            </div>
            <button @click="resetForm" class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              Register Another Student
            </button>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submitRegistration" class="space-y-5">
            <!-- Error -->
            <div v-if="formError" class="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {{ formError }}
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Name -->
              <div class="sm:col-span-2">
                <label for="msat-name" class="block text-sm font-medium text-gray-700 mb-1.5">Student Full Name <span class="text-red-500">*</span></label>
                <input
                  id="msat-name"
                  v-model="form.name"
                  type="text"
                  placeholder="As per school records"
                  required
                  :disabled="loading"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60"
                />
              </div>

              <!-- Phone -->
              <div>
                <label for="msat-phone" class="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number <span class="text-red-500">*</span></label>
                <input
                  id="msat-phone"
                  v-model="form.phone"
                  type="tel"
                  pattern="[6-9][0-9]{9}"
                  placeholder="Parent/student number"
                  required
                  :disabled="loading"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60"
                />
              </div>

              <!-- Email -->
              <div>
                <label for="msat-email" class="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  id="msat-email"
                  v-model="form.email"
                  type="email"
                  placeholder="Optional"
                  :disabled="loading"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60"
                />
              </div>

              <!-- Class -->
              <div>
                <label for="msat-class" class="block text-sm font-medium text-gray-700 mb-1.5">Current Class <span class="text-red-500">*</span></label>
                <select
                  id="msat-class"
                  v-model="form.currentClass"
                  required
                  :disabled="loading"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60"
                >
                  <option value="" disabled>Select class</option>
                  <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
                </select>
              </div>

              <!-- School -->
              <div>
                <label for="msat-school" class="block text-sm font-medium text-gray-700 mb-1.5">School Name <span class="text-red-500">*</span></label>
                <input
                  id="msat-school"
                  v-model="form.school"
                  type="text"
                  placeholder="Current school name"
                  required
                  :disabled="loading"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60"
                />
              </div>

              <!-- Preferred Date -->
              <div class="sm:col-span-2">
                <label for="msat-date" class="block text-sm font-medium text-gray-700 mb-1.5">Preferred Exam Date</label>
                <input
                  id="msat-date"
                  v-model="form.preferredDate"
                  type="date"
                  :min="minDate"
                  :disabled="loading"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60"
                />
              </div>
            </div>

            <button
              id="msat-submit-btn"
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              <svg v-if="loading" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ loading ? 'Submitting...' : 'Register for MSAT' }}
            </button>

            <p class="text-center text-xs text-gray-400">
              By submitting, you agree to be contacted regarding exam details.
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { submitMSATRegistration } from '../services/firestoreService'

export default {
  name: 'MSATRegistration',
  data() {
    return {
      form: {
        name: '',
        phone: '',
        email: '',
        currentClass: '',
        school: '',
        preferredDate: ''
      },
      loading: false,
      submitted: false,
      submittedName: '',
      formError: null,
      classes: ['7th', '8th', '9th', '10th', '11th', '12th']
    }
  },
  computed: {
    minDate() {
      return new Date().toISOString().split('T')[0]
    }
  },
  methods: {
    async submitRegistration() {
      this.loading = true
      this.formError = null
      try {
        await submitMSATRegistration({ ...this.form })
        this.submittedName = this.form.name
        this.submitted = true
      } catch (err) {
        console.error('MSAT registration error:', err)
        this.formError = 'Registration failed. Please try again or contact us directly.'
      } finally {
        this.loading = false
      }
    },
    resetForm() {
      this.form = { name: '', phone: '', email: '', currentClass: '', school: '', preferredDate: '' }
      this.submitted = false
      this.submittedName = ''
    }
  }
}
</script>
