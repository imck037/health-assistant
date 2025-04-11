<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <h2>Reset Password</h2>
      <p class="description">Enter your email address and we'll send you a link to reset your password.</p>
      
      <form @submit.prevent="handleSubmit" class="forgot-password-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="Enter your email"
            :class="{ 'error': errorMessage }"
          >
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>

        <div class="links">
          <router-link to="/login" class="back-to-login">
            ← Back to Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    // Here you would typically make an API call to your backend
    // For now, we'll simulate the API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success message
    successMessage.value = 'Password reset link has been sent to your email!';
    email.value = '';

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login');
    }, 3000);

  } catch (error) {
    errorMessage.value = error.message || 'Something went wrong. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.forgot-password-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.description {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.forgot-password-form {
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
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #4776E6;
  box-shadow: 0 0 0 2px rgba(71, 118, 230, 0.2);
}

input.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: -0.5rem;
}

.success-message {
  color: #28a745;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -0.5rem;
}

.submit-btn {
  background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.links {
  text-align: center;
  margin-top: 1rem;
}

.back-to-login {
  color: #4776E6;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.back-to-login:hover {
  color: #8E54E9;
}

@media (max-width: 480px) {
  .forgot-password-card {
    padding: 1.5rem;
  }
}
</style> 