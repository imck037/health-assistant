<template>
  <nav class="navbar" :style="navbarStyles">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="logo">
          <h2>Health<span>Hub</span></h2>
        </router-link>
      </div>

      <button class="mobile-menu-btn" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <span class="hamburger"></span>
      </button>

      <div class="navbar-menu" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
        <template v-if="!isLoggedIn">
          <div class="navbar-start">
            <router-link to="/" class="nav-item" active-class="active">Home</router-link>
            <router-link to="/about" class="nav-item" active-class="active">About</router-link>
            <router-link to="/services" class="nav-item" active-class="active">Services</router-link>
            <router-link to="/contact" class="nav-item" active-class="active">Contact</router-link>
          </div>
          <div class="navbar-end">
            <div class="auth-buttons">
              <router-link to="/signup" class="nav-item signup">Sign Up</router-link>
              <button @click="handleLogin" class="nav-item login">Login</button>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="navbar-start">
            <router-link to="/dashboard" class="nav-item" active-class="active">Dashboard</router-link>
            <router-link to="/tracker" class="nav-item" active-class="active">Health Tracker</router-link>
            <router-link to="/chat" class="nav-item" active-class="active">AI Chat</router-link>
            <router-link to="/appointments" class="nav-item" active-class="active">Appointments</router-link>
            <router-link to="/records" class="nav-item" active-class="active">Medical Records</router-link>
          </div>
          <div class="navbar-end">
            <div class="user-section">
              <div class="notifications">
                <button class="notification-btn" @click="toggleNotifications">
                  <svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span v-if="notificationCount" class="notification-badge">{{ notificationCount }}</span>
                </button>
              </div>
              <div class="user-avatar" @click="goToProfile">
                <svg class="profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <button class="logout-btn" @click="handleLogout">Logout</button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  primaryColor: {
    type: String,
    default: '#4776E6'
  },
  secondaryColor: {
    type: String,
    default: '#8E54E9'
  },
  backgroundColor: {
    type: String,
    default: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  }
});

const router = useRouter();
const isLoggedIn = computed(() => !!localStorage.getItem('token'));
const isMobileMenuOpen = ref(false);
const notificationCount = ref(2); // Example notification count

const userInitials = computed(() => {
  const email = localStorage.getItem('userEmail') || 'User';
  return email.charAt(0).toUpperCase();
});

const navbarStyles = computed(() => ({
  '--primary-color': props.primaryColor,
  '--secondary-color': props.secondaryColor,
  '--background': props.backgroundColor,
  '--text-color': props.textColor
}));

const goToProfile = () => {
  router.push('/profile');
  isMobileMenuOpen.value = false;
};

const handleLogin = () => {
  router.push('/login');
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userIdentifier');
  localStorage.removeItem('isAuthenticated');
  router.push('/login');
};

const toggleNotifications = () => {
  // Add notification panel toggle logic here
  console.log('Toggle notifications');
};
</script>

<style scoped>
.navbar {
  background: var(--background);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand .logo {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.navbar-brand h2 {
  color: var(--text-color);
  font-weight: 700;
  margin: 0;
  font-size: 1.8rem;
}

.navbar-brand h2 span {
  color: #ffffff;
  opacity: 0.9;
}

.navbar-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  margin-left: 2rem;
}

.navbar-start {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.navbar-end {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-item {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  opacity: 0.9;
  white-space: nowrap;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  opacity: 1;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  opacity: 1;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  padding: 8px;
}

.profile-icon {
  width: 100%;
  height: 100%;
  color: var(--text-color);
  stroke-width: 2;
}

.user-avatar:hover {
  transform: scale(1.05);
  border-color: #ffffff;
  background: rgba(255, 255, 255, 0.3);
}

.logout-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.notifications {
  position: relative;
}

.notification-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  position: relative;
}

.notification-icon {
  width: 24px;
  height: 24px;
  color: var(--text-color);
  stroke-width: 2;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.auth-buttons .signup {
  background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
  border: none;
  font-weight: 600;
}

.auth-buttons .login {
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-color);
  position: relative;
  transition: all 0.3s ease;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: var(--text-color);
  transition: all 0.3s ease;
}

.hamburger::before {
  top: -6px;
}

.hamburger::after {
  bottom: -6px;
}

@media (max-width: 1024px) {
  .navbar-container {
    padding: 0.8rem 1.5rem;
  }

  .navbar-start {
    gap: 1rem;
  }

  .nav-item {
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }

  .navbar-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--background);
    flex-direction: column;
    margin: 0;
    padding: 1rem;
    gap: 1rem;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .navbar-menu.mobile-menu-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .navbar-start {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .navbar-end {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }

  .nav-item {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
  }

  .auth-buttons {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }

  .auth-buttons .nav-item {
    width: 100%;
  }

  .user-section {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }

  .notifications {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style> 