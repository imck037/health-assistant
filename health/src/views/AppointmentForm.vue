<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center text-purple-800">Book an Appointment</h1>
    
    <!-- Appointment Type Selection -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4 text-center text-gray-700">Select Appointment Type</h2>
      <div class="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <button 
          @click="appointmentType = 'online'"
          :class="[
            'flex-1 p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105', 
            appointmentType === 'online' 
              ? 'border-purple-600 bg-purple-50 shadow-lg' 
              : 'border-gray-200 hover:border-purple-300'
          ]"
        >
          <div class="text-center">
            <i class="fas fa-video text-3xl mb-3 text-purple-600"></i>
            <h3 class="font-semibold text-lg mb-2">Online Consultation</h3>
            <p class="text-sm text-gray-600">Video call with your doctor</p>
          </div>
        </button>
        
        <button 
          @click="appointmentType = 'offline'"
          :class="[
            'flex-1 p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105', 
            appointmentType === 'offline' 
              ? 'border-purple-600 bg-purple-50 shadow-lg' 
              : 'border-gray-200 hover:border-purple-300'
          ]"
        >
          <div class="text-center">
            <i class="fas fa-hospital text-3xl mb-3 text-purple-600"></i>
            <h3 class="font-semibold text-lg mb-2">In-Person Visit</h3>
            <p class="text-sm text-gray-600">Visit our clinic</p>
          </div>
        </button>
      </div>
    </div>

    <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <!-- Common Fields -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Name <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="form.name" 
          type="text" 
          required 
          class="form-input"
          :class="{ 'error': errors.name }"
          @blur="validateField('name')"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="form.email" 
          type="email" 
          required 
          class="form-input"
          :class="{ 'error': errors.email }"
          @blur="validateField('email')"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Phone <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="form.phone" 
          type="tel" 
          required 
          class="form-input"
          :class="{ 'error': errors.phone }"
          @blur="validateField('phone')"
        />
        <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Doctor <span class="text-red-500">*</span>
        </label>
        <select 
          v-model="form.doctor" 
          required 
          class="form-input"
          :class="{ 'error': errors.doctor }"
          @blur="validateField('doctor')"
        >
          <option value="" disabled>Select a doctor</option>
          <option v-for="doc in doctors" :key="doc.id" :value="doc.name">
            {{ doc.name }} ({{ doc.specialty }})
          </option>
        </select>
        <span v-if="errors.doctor" class="error-message">{{ errors.doctor }}</span>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Date <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="form.date" 
          type="date" 
          required 
          class="form-input"
          :class="{ 'error': errors.date }"
          @blur="validateField('date')"
        />
        <span v-if="errors.date" class="error-message">{{ errors.date }}</span>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Time <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="form.time" 
          type="time" 
          required 
          class="form-input"
          :class="{ 'error': errors.time }"
          @blur="validateField('time')"
        />
        <span v-if="errors.time" class="error-message">{{ errors.time }}</span>
      </div>

      <!-- Online-specific Fields -->
      <template v-if="appointmentType === 'online'">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Preferred Video Platform <span class="text-red-500">*</span>
          </label>
          <select 
            v-model="form.platform" 
            required 
            class="form-input"
            :class="{ 'error': errors.platform }"
            @blur="validateField('platform')"
          >
            <option value="zoom">Zoom</option>
            <option value="google_meet">Google Meet</option>
            <option value="microsoft_teams">Microsoft Teams</option>
          </select>
          <span v-if="errors.platform" class="error-message">{{ errors.platform }}</span>
        </div>

        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Device Type <span class="text-red-500">*</span>
          </label>
          <select 
            v-model="form.deviceType" 
            required 
            class="form-input"
            :class="{ 'error': errors.deviceType }"
            @blur="validateField('deviceType')"
          >
            <option value="desktop">Desktop/Laptop</option>
            <option value="mobile">Mobile Phone</option>
            <option value="tablet">Tablet</option>
          </select>
          <span v-if="errors.deviceType" class="error-message">{{ errors.deviceType }}</span>
        </div>
      </template>

      <!-- Offline-specific Fields -->
      <template v-if="appointmentType === 'offline'">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Preferred Location <span class="text-red-500">*</span>
          </label>
          <select 
            v-model="form.location" 
            required 
            class="form-input"
            :class="{ 'error': errors.location }"
            @blur="validateField('location')"
          >
            <option value="main">Main Hospital</option>
            <option value="branch1">North Branch</option>
            <option value="branch2">South Branch</option>
          </select>
          <span v-if="errors.location" class="error-message">{{ errors.location }}</span>
        </div>

        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Transportation Required
          </label>
          <select 
            v-model="form.transportation" 
            class="form-input"
            :class="{ 'error': errors.transportation }"
            @blur="validateField('transportation')"
          >
            <option value="none">No transportation needed</option>
            <option value="wheelchair">Wheelchair assistance</option>
            <option value="ambulance">Ambulance service</option>
          </select>
          <span v-if="errors.transportation" class="error-message">{{ errors.transportation }}</span>
        </div>
      </template>

      <!-- Additional Notes -->
      <div class="form-group md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes
        </label>
        <textarea 
          v-model="form.notes" 
          class="form-input"
          rows="3"
          placeholder="Any specific requirements or concerns..."
        ></textarea>
      </div>

      <div class="md:col-span-2 flex justify-center">
        <button 
          type="submit" 
          class="submit-button"
          :disabled="!isFormValid"
        >
          <span class="button-content">
            <i class="fas" :class="appointmentType === 'online' ? 'fa-video' : 'fa-hospital'"></i>
            Book {{ appointmentType === 'online' ? 'Online' : 'In-Person' }} Appointment
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      appointmentType: this.$route.query.type || 'online',
      form: {
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        doctor: '',
        platform: 'zoom',
        deviceType: 'desktop',
        location: 'main',
        transportation: 'none',
        notes: '',
      },
      errors: {
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        doctor: '',
        platform: '',
        deviceType: '',
        location: '',
        transportation: '',
      },
      doctors: [
        {
          id: 1,
          name: 'Dr. Emily Smith',
          specialty: 'Cardiology',
        },
        {
          id: 2,
          name: 'Dr. James Wilson',
          specialty: 'Pediatrics',
        },
        {
          id: 3,
          name: 'Dr. Sarah Johnson',
          specialty: 'Dermatology',
        },
        {
          id: 4,
          name: 'Dr. Michael Brown',
          specialty: 'Orthopedics',
        },
        {
          id: 5,
          name: 'Dr. Lisa Chen',
          specialty: 'Neurology',
        },
        {
          id: 6,
          name: 'Dr. Robert Taylor',
          specialty: 'Internal Medicine',
        },
        {
          id: 7,
          name: 'Dr. Maria Garcia',
          specialty: 'Family Medicine',
        },
        {
          id: 8,
          name: 'Dr. David Kim',
          specialty: 'Ophthalmology',
        },
      ],
    };
  },
  computed: {
    isFormValid() {
      return !Object.values(this.errors).some(error => error !== '');
    }
  },
  watch: {
    '$route.query.type'(newType) {
      if (newType === 'online' || newType === 'offline') {
        this.appointmentType = newType;
      }
    }
  },
  methods: {
    validateField(field) {
      switch (field) {
        case 'name':
          this.errors.name = this.form.name.length < 2 
            ? 'Name must be at least 2 characters long' 
            : '';
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          this.errors.email = !emailRegex.test(this.form.email)
            ? 'Please enter a valid email address'
            : '';
          break;
        case 'phone':
          const phoneRegex = /^\+?[\d\s-]{10,}$/;
          this.errors.phone = !phoneRegex.test(this.form.phone)
            ? 'Please enter a valid phone number'
            : '';
          break;
        case 'date':
          const selectedDate = new Date(this.form.date);
          const today = new Date();
          this.errors.date = selectedDate < today
            ? 'Please select a future date'
            : '';
          break;
        case 'time':
          this.errors.time = !this.form.time
            ? 'Please select a time'
            : '';
          break;
        case 'doctor':
          this.errors.doctor = !this.form.doctor
            ? 'Please select a doctor'
            : '';
          break;
      }
    },
    submitForm() {
      // Validate all fields
      Object.keys(this.errors).forEach(field => this.validateField(field));
      
      if (!this.isFormValid) {
        return;
      }

      // Create appointment data
      const appointmentData = {
        ...this.form,
        type: this.appointmentType,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Handle form submission
      console.log('Appointment Data:', appointmentData);
      alert(`Appointment booked with ${this.form.doctor} on ${this.form.date} at ${this.form.time}`);
      
      // Reset form
      this.form = {
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        doctor: '',
        platform: 'zoom',
        deviceType: 'desktop',
        location: 'main',
        transportation: 'none',
        notes: '',
      };
      
      // Reset errors
      Object.keys(this.errors).forEach(key => this.errors[key] = '');
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8fafc;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  background-color: white;
  color: #1e293b;
}

.form-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-input.error {
  border-color: #f43f5e;
  background-color: #fff1f2;
}

.error-message {
  color: #f43f5e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
  font-weight: 500;
}

.submit-button {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  min-width: 280px;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -1px rgba(14, 165, 233, 0.06);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(14, 165, 233, 0.2);
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  background: #94a3b8;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

/* Medical-themed custom styles */
h1 {
  color: #0f172a;
  font-weight: 700;
  letter-spacing: -0.5px;
}

h2 {
  color: #334155;
  font-weight: 600;
}

label {
  color: #475569;
  font-weight: 500;
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.5em;
  padding-right: 2.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .submit-button {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
  
  .form-input {
    padding: 0.75rem;
  }
}

/* Animations */
@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(8px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.form-group {
  animation: fadeIn 0.4s ease-out forwards;
}

/* Loading State */
.submit-button.loading {
  position: relative;
  color: transparent;
}

.submit-button.loading::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  top: 50%;
  left: 50%;
  margin: -12px 0 0 -12px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
