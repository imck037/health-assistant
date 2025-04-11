<template>
    <div class="timely-diagnosis p-6">
      <h2 class="text-2xl font-bold mb-4">Timely Diagnosis & Notifications</h2>
  
      <div v-if="notifications.length === 0">
        <p class="text-gray-500">No new notifications. You're all caught up!</p>
      </div>
  
      <ul class="space-y-4" v-else>
        <li
          v-for="(note, index) in notifications"
          :key="index"
          class="bg-white p-4 rounded-lg shadow"
        >
          <h3 class="text-lg font-semibold">{{ note.title }}</h3>
          <p class="text-gray-600">{{ note.message }}</p>
          <small class="text-sm text-gray-400">⏰ {{ note.time }}</small>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const notifications = ref([])
  
  onMounted(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/diagnosis/notifications')
      notifications.value = res.data || []
    } catch (err) {
      console.error("Failed to fetch diagnosis notifications", err)
    }
})
</script>
