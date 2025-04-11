<template>
  <div class="profile-container">
    <h2>Complete Your Profile</h2>
    
    <!-- Success Message -->
    <div v-if="showSuccess" class="success-message">
      <i class="fas fa-check-circle"></i>
      <span>Profile updated successfully!</span>
    </div>

    <form @submit.prevent="submitProfile" class="profile-form">
      <!-- Read-only fields from signup -->
      <div class="form-group">
        <label for="name">
          Full Name
          <span class="locked-badge">
            <i class="fas fa-lock"></i> From Signup
          </span>
        </label>
        <input 
          type="text" 
          id="name" 
          v-model="profile.name" 
          required 
          placeholder="Enter your full name"
          disabled
          class="locked-field"
        >
      </div>

      <div class="form-group">
        <label for="email">
          Email
          <span class="locked-badge">
            <i class="fas fa-lock"></i> From Signup
          </span>
        </label>
        <input 
          type="email" 
          id="email" 
          v-model="profile.email" 
          required 
          placeholder="Enter your email"
          disabled
          class="locked-field"
        >
      </div>

      <div class="form-group">
        <label for="dateOfBirth">
          Date of Birth
          <span class="locked-badge">
            <i class="fas fa-lock"></i> From Signup
          </span>
        </label>
        <input 
          type="date" 
          id="dateOfBirth" 
          v-model="profile.dateOfBirth" 
          required 
          placeholder="Enter your date of birth"
          disabled
          class="locked-field"
        >
      </div>

      <div class="form-group">
        <label for="gender">
          Gender
          <span class="locked-badge">
            <i class="fas fa-lock"></i> From Signup
          </span>
        </label>
        <select id="gender" v-model="profile.gender" required disabled class="locked-field">
          <option value="">Select your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <!-- Editable fields -->
      <div class="form-group">
        <label for="weight">Weight (kg)</label>
        <input 
          type="number" 
          id="weight" 
          v-model="profile.weight" 
          required 
          min="20" 
          max="300"
          placeholder="Enter your weight in kg"
        >
      </div>

      <div class="form-group">
        <label for="height">Height (cm)</label>
        <input 
          type="number" 
          id="height" 
          v-model="profile.height" 
          required 
          min="100" 
          max="250"
          placeholder="Enter your height in cm"
        >
      </div>

      <div class="form-group">
        <label for="bloodGroup">Blood Group</label>
        <select id="bloodGroup" v-model="profile.bloodGroup" required>
          <option value="">Select your blood group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      <div class="form-group">
        <label for="medicalHistory">Medical History</label>
        <textarea 
          id="medicalHistory" 
          v-model="profile.medicalHistory" 
          placeholder="Enter any relevant medical history"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="allergies">Allergies</label>
        <textarea 
          id="allergies" 
          v-model="profile.allergies" 
          placeholder="Enter any allergies you have"
          rows="2"
        ></textarea>
      </div>

      <button type="submit" class="submit-btn" :disabled="isSaving">
        <span v-if="isSaving" class="loading-spinner"></span>
        <span v-else>Save Profile</span>
      </button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { userService } from '@/services/userService'

export default {
  name: 'UserProfile',
  setup() {
    const profile = ref({
      name: '',
      email: '',
      dateOfBirth: '',
      gender: '',
      weight: null,
      height: null,
      bloodGroup: '',
      medicalHistory: '',
      allergies: ''
    })

    const isSaving = ref(false)
    const showSuccess = ref(false)

    const loadProfileData = async () => {
      try {
        // First try to get existing profile data
        const existingProfile = await userService.getUserProfile()
        if (existingProfile) {
          profile.value = { ...existingProfile }
        } else {
          // If no profile exists, load signup data
          const signupData = userService.getSignupData()
          if (signupData) {
            // Only set the signup fields, leave others empty
            profile.value = {
              ...profile.value,
              name: signupData.name || '',
              email: signupData.email || '',
              dateOfBirth: signupData.dateOfBirth || '',
              gender: signupData.gender || ''
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error)
      }
    }

    const submitProfile = async () => {
      try {
        isSaving.value = true
        
        // Get the current profile data
        const currentProfile = await userService.getUserProfile()
        
        // Merge the current profile with the new data, preserving signup fields
        const updatedProfile = {
          ...currentProfile,
          ...profile.value,
          // Ensure these fields cannot be changed
          name: currentProfile?.name || profile.value.name,
          email: currentProfile?.email || profile.value.email,
          dateOfBirth: currentProfile?.dateOfBirth || profile.value.dateOfBirth,
          gender: currentProfile?.gender || profile.value.gender
        }
        
        await userService.updateUserProfile(updatedProfile)
        
        // Show success message
        showSuccess.value = true
        setTimeout(() => {
          showSuccess.value = false
        }, 3000)

        // Clear signup data after successful profile creation
        userService.clearSignupData()
        
        // Emit success event
        emit('profile-updated', updatedProfile)
      } catch (error) {
        console.error('Error updating profile:', error)
      } finally {
        isSaving.value = false
      }
    }

    onMounted(loadProfileData)

    return {
      profile,
      submitProfile,
      isSaving,
      showSuccess
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.success-message {
  background-color: #4CAF50;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slideIn 0.3s ease-out;
}

.success-message i {
  font-size: 1.2rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.locked-badge {
  font-size: 0.75rem;
  background-color: #f0f0f0;
  color: #666;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.locked-badge i {
  font-size: 0.7rem;
}

input, select, textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.locked-field {
  background-color: #f9f9f9;
  border-color: #e0e0e0;
  color: #555;
  cursor: not-allowed;
}

input:disabled, select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.submit-btn {
  background-color: #42b983;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  background-color: #3aa876;
  transform: translateY(-1px);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 