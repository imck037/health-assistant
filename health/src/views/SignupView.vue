<template>
  <div class="signup-page">
    <div class="signup-box">
      <div class="logo-container">
        <div class="logo-animation">🏥</div>
      </div>
      <h2 class="title-animation">🌟 Create Your Account</h2>
      
      <div class="verification-toggle">
        <button 
          :class="['toggle-btn', { active: signupType === 'patient' }]"
          @click="signupType = 'patient'"
        >
          <span class="icon">👤</span>
          <span class="text">Patient</span>
        </button>
        <button 
          :class="['toggle-btn', { active: signupType === 'doctor' }]"
          @click="signupType = 'doctor'"
        >
          <span class="icon">👨‍⚕️</span>
          <span class="text">Doctor</span>
        </button>
      </div>

      <div class="verification-method-toggle">
        <button 
          :class="['toggle-btn', { active: verificationType === 'email' }]"
          @click="verificationType = 'email'"
        >
          <span class="icon">📧</span>
          <span class="text">Email Signup</span>
        </button>
        <button 
          :class="['toggle-btn', { active: verificationType === 'mobile' }]"
          @click="verificationType = 'mobile'"
        >
          <span class="icon">📱</span>
          <span class="text">Mobile Signup</span>
        </button>
      </div>

      <form @submit.prevent="handleSignUp" class="form-animation">
        <div class="form-group">
          <label class="label-animation">Name</label>
          <div class="input-container">
            <span class="input-icon">👤</span>
            <input 
              type="text" 
              v-model="name" 
              required 
              placeholder="Enter your full name" 
              class="animated-input"
            />
          </div>
        </div>

        <!-- Email Signup Form -->
        <transition name="fade-slide" mode="out-in">
          <div v-if="verificationType === 'email'" key="email-form">
            <div class="form-group">
              <label class="label-animation">Email</label>
              <div class="input-container">
                <span class="input-icon">📧</span>
                <input 
                  type="email" 
                  v-model="email" 
                  required 
                  placeholder="Enter your email" 
                  class="animated-input"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="label-animation">Password</label>
              <div class="input-container">
                <span class="input-icon">🔒</span>
                <input 
                  type="password" 
                  v-model="password" 
                  required 
                  placeholder="Choose a strong password"
                  minlength="6"
                  class="animated-input"
                />
              </div>
            </div>
          </div>
        </transition>

        <!-- Mobile Signup Form -->
        <transition name="fade-slide" mode="out-in">
          <div v-if="verificationType === 'mobile'" key="mobile-form">
            <div class="form-group">
              <label class="label-animation">Mobile Number</label>
              <div class="mobile-input-group">
                <select v-model="countryCode" class="country-code animated-select">
                  <option value="+1">+1 🇺🇸</option>
                  <option value="+44">+44 🇬🇧</option>
                  <option value="+91">+91 🇮🇳</option>
                  <option value="+81">+81 🇯🇵</option>
                  <option value="+86">+86 🇨🇳</option>
                  <option value="+49">+49 🇩🇪</option>
                  <option value="+33">+33 🇫🇷</option>
                </select>
                <div class="input-container">
                  <span class="input-icon">📱</span>
                  <input 
                    type="tel" 
                    v-model="mobileNumber" 
                    required 
                    placeholder="Enter your mobile number"
                    pattern="[0-9]{10}"
                    class="animated-input"
                  />
                </div>
              </div>
            </div>
            <div class="form-group" v-if="!otpSent">
              <button type="button" class="btn-submit pulse-animation" @click="sendOTP">
                <span class="btn-icon">📤</span>
                Send OTP
              </button>
            </div>
            <transition name="fade-slide">
              <div v-if="otpSent" class="form-group">
                <label class="label-animation">Enter OTP</label>
                <div class="input-container">
                  <span class="input-icon">🔑</span>
                  <input 
                    type="text" 
                    v-model="otp" 
                    required 
                    placeholder="Enter 6-digit OTP"
                    maxlength="6"
                    class="animated-input"
                  />
                </div>
              </div>
            </transition>
          </div>
        </transition>

        <!-- Additional fields for doctors -->
        <transition name="fade-slide" mode="out-in">
          <div v-if="signupType === 'doctor'" key="doctor-fields">
            <div class="form-group">
              <label class="label-animation">License Number</label>
              <div class="input-container">
                <span class="input-icon">📋</span>
                <input 
                  type="text" 
                  v-model="licenseNumber" 
                  required 
                  placeholder="Enter your medical license number" 
                  class="animated-input"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="label-animation">Specialization</label>
              <div class="input-container">
                <span class="input-icon">🏥</span>
                <input 
                  type="text" 
                  v-model="specialization" 
                  required 
                  placeholder="Enter your specialization" 
                  class="animated-input"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="label-animation">Years of Experience</label>
              <div class="input-container">
                <span class="input-icon">⏳</span>
                <input 
                  type="number" 
                  v-model="experience" 
                  required 
                  placeholder="Years of experience" 
                  min="0" 
                  class="animated-input"
                />
              </div>
            </div>
          </div>
        </transition>

        <!-- Additional fields for patients -->
        <transition name="fade-slide" mode="out-in">
          <div v-if="signupType === 'patient'" key="patient-fields">
            <div class="form-group">
              <label class="label-animation">Date of Birth</label>
              <div class="input-container">
                <span class="input-icon">📅</span>
                <input 
                  type="date" 
                  v-model="dateOfBirth" 
                  required 
                  class="animated-input"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="label-animation">Gender</label>
              <div class="input-container">
                <span class="input-icon">⚧</span>
                <select v-model="gender" required class="animated-select">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </transition>

        <button type="submit" class="btn-submit hover-animation">
          <span class="btn-icon">✨</span>
          Sign Up as {{ signupType === 'patient' ? 'Patient' : 'Doctor' }}
        </button>
      </form>

      <p class="login-redirect">
        Already have an account?
        <router-link to="/login" class="link-animation">Login Here</router-link>
      </p>
    </div>

    <!-- Popup -->
    <transition name="popup">
      <div v-if="showPopup" class="popup" :class="popupType">
        <p>{{ popupMessage }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '../services/userService'

export default {
  name: 'SignUpView',
  setup() {
    const router = useRouter()
    const signupType = ref('patient')
    const verificationType = ref('email')
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const countryCode = ref('+1')
    const mobileNumber = ref('')
    const otp = ref('')
    const otpSent = ref(false)
    const licenseNumber = ref('')
    const specialization = ref('')
    const experience = ref('')
    const dateOfBirth = ref('')
    const gender = ref('')
    const showPopup = ref(false)
    const popupMessage = ref('')
    const popupType = ref('')

    const showCustomPopup = (message, type) => {
      popupMessage.value = message
      popupType.value = type
      showPopup.value = true
      setTimeout(() => {
        showPopup.value = false
      }, 3000)
    }

    const sendOTP = async () => {
      try {
        const response = await axios.post('http://localhost:4000/api/auth/send-otp', {
          mobileNumber: countryCode.value + mobileNumber.value
        })
        
        otpSent.value = true
        showCustomPopup('OTP sent successfully!', 'success')
      } catch (error) {
        const msg = error.response ? error.response.data.message : 'Failed to send OTP'
        showCustomPopup(msg, 'error')
        console.error('OTP Error:', error)
      }
    }

    const handleSignUp = async () => {
      try {
        // Prepare signup data as a plain object
        const signupData = {
          name: formData.value.name,
          email: formData.value.email,
          dateOfBirth: formData.value.dateOfBirth,
          gender: formData.value.gender,
          signupType: formData.value.signupType,
          verificationType: formData.value.verificationType
        }

        // Save signup data
        userService.saveSignupData(signupData)

        // Prepare registration data
        const registrationData = {
          name: formData.value.name,
          email: formData.value.email,
          password: formData.value.password,
          dateOfBirth: formData.value.dateOfBirth,
          gender: formData.value.gender
        }

        // Make API call to register user
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registrationData)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed')
        }

        // Store token
        localStorage.setItem('token', data.token)

        // Show success message
        showCustomPopup('Registration successful! Redirecting to profile...', 'success')

        // Redirect to profile page after a short delay
        setTimeout(() => {
          router.push('/profile')
        }, 2000)
      } catch (error) {
        console.error('Registration error:', error)
        showCustomPopup(error.message || 'Registration failed. Please try again.', 'error')
      }
    }

    return {
      signupType,
      verificationType,
      name,
      email,
      password,
      countryCode,
      mobileNumber,
      otp,
      otpSent,
      licenseNumber,
      specialization,
      experience,
      dateOfBirth,
      gender,
      showPopup,
      popupMessage,
      popupType,
      handleSignUp,
      sendOTP,
      showCustomPopup
    }
  }
}
</script>

<style scoped>
.signup-page {
  min-height: calc(100vh - 64px);
  background: linear-gradient(135deg, #4776E6, #8E54E9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.signup-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 420px;
  width: 100%;
  backdrop-filter: blur(10px);
  animation: boxAppear 0.6s ease-out;
}

.logo-container {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo-animation {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
}

.title-animation {
  text-align: center;
  color: #4776E6;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  animation: slideDown 0.6s ease-out;
}

.verification-toggle,
.verification-method-toggle {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.8s ease-out;
}

.toggle-btn {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #4776E6;
  background: transparent;
  color: #4776E6;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.toggle-btn .icon {
  font-size: 1.2rem;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #4776E6, #8E54E9);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 118, 230, 0.2);
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #4776E6;
  font-size: 1.1rem;
}

.animated-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.animated-input:focus {
  border-color: #4776E6;
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.1);
  transform: translateY(-1px);
}

.animated-select {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
  appearance: none;
}

.animated-select:focus {
  border-color: #4776E6;
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.1);
}

.mobile-input-group {
  display: flex;
  gap: 0.5rem;
}

.country-code {
  width: 120px;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
}

.country-code:focus {
  border-color: #4776E6;
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.1);
}

.mobile-input-group .input-container {
  flex: 1;
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #4776E6, #8E54E9);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-icon {
  font-size: 1.2rem;
}

.hover-animation:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 118, 230, 0.2);
}

.pulse-animation {
  animation: pulse 2s infinite;
}

.link-animation {
  color: white;
  background: #4776E6;
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  text-decoration: none;
  margin-left: 0.3rem;
  transition: all 0.3s ease;
  display: inline-block;
}

.link-animation:hover {
  background: #8E54E9;
  transform: translateY(-2px);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes boxAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

/* Responsive Design */
@media (max-width: 480px) {
  .signup-box {
    padding: 1.5rem;
  }

  .title-animation {
    font-size: 1.5rem;
  }

  .toggle-btn {
    padding: 0.6rem;
  }

  .animated-input,
  .animated-select {
    padding: 0.6rem;
  }
}
</style>
  