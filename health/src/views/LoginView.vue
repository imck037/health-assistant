<template>
  <div class="login-page">
    <div class="login-box">
      <div class="logo-container">
        <div class="logo-animation">🏥</div>
      </div>
      <h2 class="title-animation">🔐 Welcome Back</h2>
      
      <div class="verification-toggle">
        <button 
          :class="['toggle-btn', { active: verificationType === 'email' }]"
          @click="verificationType = 'email'"
        >
          <span class="icon">📧</span>
          <span class="text">Email Login</span>
        </button>
        <button 
          :class="['toggle-btn', { active: verificationType === 'mobile' }]"
          @click="verificationType = 'mobile'"
        >
          <span class="icon">📱</span>
          <span class="text">Mobile Login</span>
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="form-animation">
        <!-- Email Login Form -->
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
                  placeholder="Enter your password"
                  class="animated-input"
                />
              </div>
              <div class="forgot-password">
                <router-link to="/forgot-password" class="forgot-link">
                  Forgot Password?
                </router-link>
              </div>
            </div>
          </div>
        </transition>

        <!-- Mobile Login Form -->
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

        <button type="submit" class="btn-submit hover-animation">
          <span class="btn-icon">
            {{ verificationType === 'email' ? '🚀' : (otpSent ? '✅' : '➡️') }}
          </span>
          {{ verificationType === 'email' ? 'Login' : (otpSent ? 'Verify OTP' : 'Continue') }}
        </button>
      </form>

      <p class="signup-redirect">
        Don't have an account?
        <router-link to="/signup" class="link-animation">Sign Up Here</router-link>
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

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const verificationType = ref('email')
    const email = ref('')
    const password = ref('')
    const countryCode = ref('+1')
    const mobileNumber = ref('')
    const otp = ref('')
    const otpSent = ref(false)
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
        
        if (response.data) {
          otpSent.value = true
          showCustomPopup('OTP sent successfully!', 'success')
        }
      } catch (error) {
        console.error('OTP Error:', error)
        const msg = error.response?.data?.message || 'Failed to send OTP. Please check if the server is running.'
        showCustomPopup(msg, 'error')
      }
    }

    const handleLogin = async () => {
      try {
        let response;
        
        if (verificationType.value === 'email') {
          response = await axios.post('http://localhost:4000/api/auth/login', {
            email: email.value,
            password: password.value
          })
        } else {
          response = await axios.post('http://localhost:4000/api/auth/verify-otp', {
            mobileNumber: countryCode.value + mobileNumber.value,
            otp: otp.value
          })
        }
        
        if (response.data && response.data.token) {
          // Store the token and user identifier
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('userIdentifier', verificationType.value === 'email' ? email.value : mobileNumber.value)
          localStorage.setItem('isAuthenticated', 'true')
          
          showCustomPopup('Login successful!', 'success')
          router.push('/dashboard')
        } else {
          throw new Error('Invalid response from server')
        }
      } catch (error) {
        console.error('Login Error:', error)
        const msg = error.response?.data?.message || 'Network error. Please check if the server is running.'
        showCustomPopup(msg, 'error')
      }
    }

    // Add method to handle direct navigation from navbar
    const handleNavbarLogin = () => {
      router.push('/login')
    }

    return {
      verificationType,
      email,
      password,
      countryCode,
      mobileNumber,
      otp,
      otpSent,
      showPopup,
      popupMessage,
      popupType,
      handleLogin,
      handleNavbarLogin,
      sendOTP,
      showCustomPopup
    }
  }
}
</script>

<style scoped>
.login-page {
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

.login-box {
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

.verification-toggle {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
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
  width: 120px;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
}

.animated-select:focus {
  border-color: #4776E6;
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.1);
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
  .login-box {
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

.forgot-password {
  text-align: right;
  margin-top: 0.5rem;
}

.forgot-link {
  color: #4776E6;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #8E54E9;
  text-decoration: underline;
}
</style>
