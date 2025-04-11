<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="navbar-brand">
        <router-link to="/dashboard" class="logo">
          <h2>Health<span>Hub</span></h2>
        </router-link>
      </div>

      <!-- Mobile Menu Button -->
      <button class="mobile-menu-btn" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <span class="hamburger"></span>
      </button>

      <!-- Navigation Menu -->
      <div class="navbar-menu" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
        <!-- Navigation Links -->
        <div class="navbar-start">
          <router-link to="/tracker" class="nav-item" active-class="active">
            <i class="fas fa-heartbeat"></i>
            Health Tracker
          </router-link>
          <router-link to="/chat" class="nav-item" active-class="active">
            <i class="fas fa-robot"></i>
            AI Chat
          </router-link>
          <router-link to="/appointments" class="nav-item" active-class="active">
            <i class="fas fa-calendar-check"></i>
            Appointments
          </router-link>
          <router-link to="/medical-records" class="nav-item" active-class="active">
            <i class="fas fa-file-medical"></i>
            Medical Records
          </router-link>
          <router-link to="/timely-diagnosis" class="nav-item" active-class="active">
            <i class="fas fa-stethoscope"></i>
            Timely Diagnosis
          </router-link>
        </div>

        <!-- User Section -->
        <div class="navbar-end">
          <div class="user-section">
            <!-- Notifications -->
            <div class="notifications">
              <button class="notification-btn" @click="toggleNotifications">
                <i class="fas fa-bell"></i>
                <span v-if="notificationCount" class="notification-badge">
                  {{ notificationCount }}
                </span>
              </button>
              <!-- Notification Panel -->
              <div v-if="showNotifications" class="notification-panel">
                <div class="notification-header">
                  <h3>Notifications</h3>
                  <button class="clear-all" @click="clearNotifications">Clear All</button>
                </div>
                <div class="notification-list">
                  <div v-if="notifications.length === 0" class="no-notifications">
                    No new notifications
                  </div>
                  <div v-else v-for="notification in notifications" 
                       :key="notification.id" 
                       class="notification-item">
                    <i :class="notification.icon"></i>
                    <div class="notification-content">
                      <p class="notification-text">{{ notification.text }}</p>
                      <span class="notification-time">{{ notification.time }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- User Profile -->
            <div class="user-profile" @click="toggleUserMenu">
              <div class="user-avatar">
                <img v-if="userImage" :src="userImage" alt="User Avatar">
                <span v-else class="avatar-text">{{ userInitials }}</span>
              </div>
              <span class="username">{{ userName }}</span>
              
              <!-- User Menu -->
              <div v-if="showUserMenu" class="user-menu">
                <router-link to="/profile" class="menu-item">
                  <i class="fas fa-user"></i>
                  My Profile
                </router-link>
                <router-link to="/settings" class="menu-item">
                  <i class="fas fa-cog"></i>
                  Settings
                </router-link>
                <div class="menu-divider"></div>
                <button class="menu-item logout" @click="handleLogout">
                  <i class="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isMobileMenuOpen = ref(false);
const showNotifications = ref(false);
const showUserMenu = ref(false);
const notificationCount = ref(3);

// User information
const userName = ref('John Doe');
const userImage = ref(''); // Add user image URL here if available

const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
});

// Sample notifications
const notifications = ref([
  {
    id: 1,
    icon: 'fas fa-calendar-alt',
    text: 'Upcoming appointment tomorrow at 10:00 AM',
    time: '1 hour ago'
  },
  {
    id: 2,
    icon: 'fas fa-pills',
    text: 'Time to take your medication',
    time: '2 hours ago'
  },
  {
    id: 3,
    icon: 'fas fa-heart',
    text: 'New health report available',
    time: '3 hours ago'
  }
]);

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showUserMenu.value = false;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showNotifications.value = false;
};

const clearNotifications = () => {
  notifications.value = [];
  notificationCount.value = 0;
};

const handleLogout = async () => {
  try {
    // Clear all user-related data
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    // Reset component state
    showUserMenu.value = false;
    showNotifications.value = false;
    isMobileMenuOpen.value = false;
    notifications.value = [];
    notificationCount.value = 0;

    // Redirect to login page
    await router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Close menus when clicking outside
const closeMenus = (event) => {
  if (!event.target.closest('.notifications') && !event.target.closest('.user-profile')) {
    showNotifications.value = false;
    showUserMenu.value = false;
  }
};

// Add event listener for clicks outside menus
if (typeof window !== 'undefined') {
  window.addEventListener('click', closeMenus);
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
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

/* Logo Styles */
.navbar-brand .logo {
  text-decoration: none;
}

.navbar-brand h2 {
  color: #ffffff;
  font-weight: 700;
  margin: 0;
  font-size: 1.8rem;
}

.navbar-brand h2 span {
  opacity: 0.9;
}

/* Navigation Menu */
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

.nav-item {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item i {
  font-size: 1.1rem;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
}

/* User Section */
.user-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Notifications */
.notifications {
  position: relative;
  margin-right: 1.5rem;
}

.notification-btn {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  position: relative;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.notification-btn i {
  font-size: 1.2rem;
  color: #666;
  transition: all 0.3s ease;
}

.notification-btn:hover {
  background: rgba(71, 118, 230, 0.1);
}

.notification-btn:hover i {
  color: #4776E6;
  transform: scale(1.1);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.notification-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  z-index: 1000;
  overflow: hidden;
}

.notification-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.clear-all {
  background: none;
  border: none;
  color: #4776E6;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.clear-all:hover {
  background: rgba(71, 118, 230, 0.1);
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  padding: 15px 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid #eee;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background: rgba(71, 118, 230, 0.05);
}

.notification-item i {
  color: #4776E6;
  font-size: 1.1rem;
  margin-top: 3px;
}

.notification-content {
  flex: 1;
}

.notification-text {
  margin: 0;
  font-size: 0.9rem;
  color: #333;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
  display: block;
}

.no-notifications {
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

/* User Profile */
.user-profile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.avatar-text {
  color: #ffffff;
  font-weight: 600;
  font-size: 1.1rem;
}

.username {
  color: #ffffff;
  font-weight: 500;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  padding: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-item i {
  font-size: 1.1rem;
  color: #4776E6;
}

.menu-divider {
  height: 1px;
  background: #eee;
  margin: 0.5rem 0;
}

.logout {
  color: #dc3545;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
}

.logout i {
  color: #dc3545;
}

/* Mobile Menu Button */
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
  background: #ffffff;
  position: relative;
  transition: all 0.3s ease;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: #ffffff;
  transition: all 0.3s ease;
}

.hamburger::before {
  top: -6px;
}

.hamburger::after {
  bottom: -6px;
}

/* Responsive Design */
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

  .username {
    display: none;
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
    background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
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

  .nav-item {
    width: 100%;
    justify-content: center;
  }

  .user-section {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }

  .notification-panel,
  .user-menu {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    margin: 0;
    border-radius: 12px 12px 0 0;
  }
}
</style>
