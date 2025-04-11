<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <img src="@/assets/logo.svg" alt="Logo" class="logo" />
      <h2>Reset Password</h2>
      <div class="form-container">
        <form @submit.prevent="handleSubmit">
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
          <button type="submit" class="submit-btn">
            Send Reset Link
          </button>
          <div class="back-to-login">
            <router-link to="/login" class="back-link">
              Back to Login
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordView',
  data() {
    return {
      email: ''
    }
  },
  methods: {
    async handleSubmit() {
      try {
        // TODO: Implement password reset logic here
        // For now, just show a success message
        alert('If an account exists with this email, you will receive a password reset link shortly.')
        this.$router.push('/login')
      } catch (error) {
        console.error('Error:', error)
        alert('An error occurred. Please try again.')
      }
    }
  }
}
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
  padding: 20px;
}

.forgot-password-box {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.logo {
  display: block;
  margin: 0 auto 1.5rem;
  max-width: 150px;
  height: auto;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.form-container {
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.label-animation {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.input-container {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
}

.animated-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.animated-input:focus {
  outline: none;
  border-color: #4776E6;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(71, 118, 230, 0.3);
  text-decoration: none;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(71, 118, 230, 0.4);
  background: linear-gradient(135deg, #3867d5 0%, #7d43d8 100%);
}

.submit-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(71, 118, 230, 0.3);
}

.submit-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.submit-btn:hover::after {
  transform: translateX(100%);
}

.back-to-login {
  text-align: center;
  margin-top: 1.5rem;
}

.back-link {
  color: #4776E6;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 10px 20px;
  border-radius: 6px;
  background: rgba(71, 118, 230, 0.1);
  display: inline-block;
  letter-spacing: 0.3px;
  border: 1px solid transparent;
}

.back-link:hover {
  color: #8E54E9;
  background: rgba(71, 118, 230, 0.15);
  transform: translateY(-1px);
  border: 1px solid rgba(71, 118, 230, 0.2);
  box-shadow: 0 4px 12px rgba(71, 118, 230, 0.1);
}

.back-link:active {
  transform: translateY(1px);
  box-shadow: 0 2px 6px rgba(71, 118, 230, 0.1);
}
</style> 