<template>
  <header class="bg-white shadow-sm">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-blue-600">
            HealthCare
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link 
            v-for="item in navigationItems" 
            :key="item.path"
            :to="item.path"
            class="text-gray-600 hover:text-blue-600 transition-colors"
            :class="{ 'text-blue-600': isCurrentRoute(item.path) }"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- User Profile -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button 
              @click="toggleProfileMenu"
              class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <img 
                :src="userAvatar" 
                alt="User Avatar" 
                class="w-8 h-8 rounded-full object-cover"
              >
              <span class="hidden md:block">{{ userName }}</span>
            </button>

            <!-- Profile Dropdown -->
            <div 
              v-if="showProfileMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
            >
              <router-link 
                to="/profile" 
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </router-link>
              <router-link 
                to="/settings" 
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Settings
              </router-link>
              <button 
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const showProfileMenu = ref(false);

const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Appointments', path: '/appointments' },
  { name: 'Medical Records', path: '/medical-records' },
  { name: 'Chat', path: '/chat' }
];

const userAvatar = 'https://randomuser.me/api/portraits/men/1.jpg';
const userName = 'John Doe';

const isCurrentRoute = (path) => {
  return route.path === path;
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const handleLogout = () => {
  // Add logout logic here
  router.push('/login');
};

// Close profile menu when clicking outside
const handleClickOutside = (event) => {
  if (showProfileMenu.value && !event.target.closest('.relative')) {
    showProfileMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.router-link-active {
  color: #2563eb;
  font-weight: 500;
}
</style> 