<template>
  <div class="py-16 bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-primary p-8 text-center text-white">
          <h1 class="text-3xl font-bold mb-2">Admission Enquiry</h1>
          <p>Register for Manch Scholarship Admission Test (MSAT)</p>
        </div>
        
        <div class="p-8">
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary" placeholder="Enter full name" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary" placeholder="Enter mobile number" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary" placeholder="Enter email address">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Current Class</label>
                <select class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary" required>
                  <option value="" disabled selected>Select class</option>
                  <option>7th</option>
                  <option>8th</option>
                  <option>9th</option>
                  <option>10th</option>
                  <option>11th</option>
                  <option>12th</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Course Interested In</label>
              <select class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary" required>
                <option value="" disabled selected>Select course</option>
                <option>Foundation (8th-9th)</option>
                <option>SSC Board</option>
                <option>HSC Board</option>
                <option>MHT-CET</option>
                <option>NEET</option>
                <option>JEE</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Any specific query?</label>
              <textarea rows="3" class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary" placeholder="Write your message here..."></textarea>
            </div>

            <button type="submit" class="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-4 rounded transition-colors text-lg">
              Submit Enquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdmissionPage',
  methods: {
    submitForm() {
      // Future Firebase Integration
      alert('Form submitted! We will contact you soon.');
    }
  }
}
</script>
