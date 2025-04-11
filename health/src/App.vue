<script>
import Navbar from './components/Navbar.vue'
import Navbar1 from './components/Navbar1.vue'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  components: {
    Navbar,
    Navbar1
  },
  setup() {
    const isLoggedIn = ref(false);
    const router = useRouter();

    // Check authentication status on mount
    onMounted(() => {
      checkAuthStatus();
    });

    // Watch for route changes to check auth status
    watch(() => router.currentRoute.value, () => {
      checkAuthStatus();
    });

    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      isLoggedIn.value = !!token;
    };

    return {
      isLoggedIn
    }
  }
}
</script>

<template>
  <div id="app">
    <!-- Render Navbar1 for authenticated users, Navbar for non-authenticated users -->
    <Navbar1 v-if="isLoggedIn" />
    <Navbar v-else />
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

/* Global styles */
body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}
</style>
