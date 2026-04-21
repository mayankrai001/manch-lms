<template>
  <div class="py-16 bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-primary p-8 text-center text-white">
          <h1 class="text-3xl font-bold mb-2">Admission Enquiry</h1>
          <p>Register your interest for Manch Scholarship Admission Test (MSAT)</p>
        </div>

        <div class="p-8">
          <!-- Success Message -->
          <div v-if="submitted" class="text-center py-8">
            <div class="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">Enquiry Submitted!</h2>
            <p class="text-gray-500 mb-6">Thank you, {{ submittedName }}! We'll contact you within 24 hours.</p>
            <button @click="resetForm" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
              Submit Another
            </button>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submitForm" class="space-y-6">
            <!-- Error -->
            <div v-if="formError" class="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {{ formError }}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="enq-name" class="block text-sm font-medium text-gray-700 mb-1">Student Name <span class="text-red-500">*</span></label>
                <input
                  id="enq-name"
                  v-model="form.name"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="Enter full name"
                  required
                  :disabled="loading"
                />
              </div>
              <div>
                <label for="enq-phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number <span class="text-red-500">*</span></label>
                <input
                  id="enq-phone"
                  v-model="form.phone"
                  type="tel"
                  pattern="[6-9][0-9]{9}"
                  class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="10-digit mobile number"
                  required
                  :disabled="loading"
                />
              </div>
              <div>
                <label for="enq-email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="enq-email"
                  v-model="form.email"
                  type="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="Enter email address"
                  :disabled="loading"
                />
              </div>
              <div>
                <label for="enq-class" class="block text-sm font-medium text-gray-700 mb-1">Current Class <span class="text-red-500">*</span></label>
                <select
                  id="enq-class"
                  v-model="form.currentClass"
                  class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  required
                  :disabled="loading"
                >
                  <option value="" disabled>Select class</option>
                  <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
                </select>
              </div>
            </div>

            <div>
              <label for="enq-course" class="block text-sm font-medium text-gray-700 mb-1">Course Interested In <span class="text-red-500">*</span></label>
              <select
                id="enq-course"
                v-model="form.course"
                class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                required
                :disabled="loading"
              >
                <option value="" disabled>Select course</option>
                <option v-for="course in courses" :key="course">{{ course }}</option>
              </select>
            </div>

            <div>
              <label for="enq-message" class="block text-sm font-medium text-gray-700 mb-1">Any specific query?</label>
              <textarea
                id="enq-message"
                v-model="form.message"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                placeholder="Write your message here..."
                :disabled="loading"
              ></textarea>
            </div>

            <button
              id="admission-submit-btn"
              type="submit"
              :disabled="loading"
              class="w-full bg-secondary hover:bg-secondary-dark disabled:opacity-60 text-white font-bold py-3 px-4 rounded transition-colors text-lg flex items-center justify-center gap-2"
            >
              <svg v-if="loading" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ loading ? 'Submitting...' : 'Submit Enquiry' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { submitEnquiry } from '../services/firestoreService'

export default {
  name: 'AdmissionPage',
  data() {
    return {
      form: {
        name: '',
        phone: '',
        email: '',
        currentClass: '',
        course: '',
        message: ''
      },
      loading: false,
      submitted: false,
      submittedName: '',
      formError: null,
      classes: ['7th', '8th', '9th', '10th', '11th', '12th'],
      courses: ['Foundation (8th-9th)', 'SSC Board', 'HSC Board', 'MHT-CET', 'NEET', 'JEE']
    }
  },
  methods: {
    async submitForm() {
      this.loading = true
      this.formError = null
      try {
        await submitEnquiry({ ...this.form })
        this.submittedName = this.form.name
        this.submitted = true
      } catch (err) {
        console.error('Enquiry error:', err)
        this.formError = 'Something went wrong. Please try again or contact us directly.'
      } finally {
        this.loading = false
      }
    },
    resetForm() {
      this.form = { name: '', phone: '', email: '', currentClass: '', course: '', message: '' }
      this.submitted = false
      this.submittedName = ''
    }
  }
}
</script>
