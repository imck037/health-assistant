<template>
  <div class="doctor-selection-page">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Select a Doctor</h1>
          <router-link to="/appointments" class="text-blue-600 hover:text-blue-800 flex items-center">
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Appointments
          </router-link>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <DoctorSelection 
            @close="goBack"
            @select="handleDoctorSelection"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DoctorSelection from '../components/DoctorSelection.vue';

const router = useRouter();
const showBookingForm = ref(false);

const goBack = () => {
  router.push('/appointments');
};

const handleDoctorSelection = (doctor) => {
  // Store the selected doctor in localStorage or Vuex/Pinia for state management
  localStorage.setItem('selectedDoctor', JSON.stringify(doctor));
  
  // Set flag to hide navbar
  showBookingForm.value = true;
  
  // Navigate to the appointment form with the selected doctor
  router.push({
    path: '/appointment-form',
    query: { type: 'online', doctorId: doctor.id }
  });
};
</script>

<style scoped>
.doctor-selection-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
}
</style> 