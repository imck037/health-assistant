<template>
  <div class="profile">
    <UserProfile @profile-updated="handleProfileUpdate" />
  </div>
</template>

<script setup>
import UserProfile from '@/components/UserProfile.vue'

const handleProfileUpdate = (profileData) => {
  // Here you would typically handle the profile update
  // For example, make an API call to save the data
  console.log('Profile updated:', profileData)
}
</script>

<style scoped>
.profile {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
  