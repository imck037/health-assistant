<template>
  <div class="health-tracker">
    <h2 class="text-2xl font-bold mb-6">Health Tracker - Last 7 Days</h2>
    
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading health data...</p>
    </div>

    <div v-else-if="healthData.length" class="days-container">
      <div
        v-for="(day, index) in healthData"
        :key="index"
        class="day-card"
        :class="{ 'today': isToday(day.date) }"
      >
        <div class="day-header">
          <h3 class="day-title">Day {{ index + 1 }}</h3>
          <span class="date">{{ formatDate(day.date) }}</span>
        </div>
        
        <div class="health-metrics">
          <div class="metric">
            <span class="metric-icon">👣</span>
            <div class="metric-info">
              <span class="metric-label">Steps</span>
              <span class="metric-value">{{ day.steps || 0 }}</span>
            </div>
          </div>
          
          <div class="metric">
            <span class="metric-icon">❤</span>
            <div class="metric-info">
              <span class="metric-label">Heart Rate</span>
              <span class="metric-value">{{ day.heart_rate || 0 }} bpm</span>
            </div>
          </div>
          
          <div class="metric">
            <span class="metric-icon">😴</span>
            <div class="metric-info">
              <span class="metric-label">Sleep</span>
              <span class="metric-value">{{ day.sleep_hours || 0 }} hrs</span>
            </div>
          </div>
          
          <div class="metric">
            <span class="metric-icon">🔥</span>
            <div class="metric-info">
              <span class="metric-label">Calories</span>
              <span class="metric-value">{{ day.calories || 0 }} kcal</span>
            </div>
          </div>
          
          <div class="metric">
            <span class="metric-icon">⚖</span>
            <div class="metric-info">
              <span class="metric-label">Weight</span>
              <span class="metric-value">{{ day.weight || 0 }} kg</span>
            </div>
          </div>
          
          <div class="metric">
            <span class="metric-icon">🩸</span>
            <div class="metric-info">
              <span class="metric-label">Blood Pressure</span>
              <span class="metric-value">{{ day.blood_pressure || '--/--' }}</span>
            </div>
          </div>
          
          <div class="metric">
            <span class="metric-icon">😊</span>
            <div class="metric-info">
              <span class="metric-label">Mood</span>
              <span class="metric-value">{{ day.mood || 'Not recorded' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <p>No health data available for the last 7 days.</p>
      <button @click="fetchHealthData" class="refresh-btn">Refresh Data</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onErrorCaptured } from 'vue'
import axios from 'axios'

const healthData = ref([])
const loading = ref(true)

const fetchHealthData = async () => {
  try {
    loading.value = true
    console.log('Fetching health data...')
    
    // Create axios instance with timeout
    const axiosInstance = axios.create({
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const response = await axiosInstance.get('http://localhost:4000/api/health/tracking')
    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)
    console.log('Response data:', response.data)
    
    if (response.status === 200 && response.data && Array.isArray(response.data)) {
      console.log('Setting health data:', response.data)
      healthData.value = response.data
    } else {
      console.error('Invalid response format:', response)
      throw new Error('Invalid response format received from server')
    }
  } catch (error) {
    console.error('Error fetching health data:', error)
    console.error('Error response:', error.response)
    console.error('Error message:', error.message)
    healthData.value = [] // Clear any existing data
    
    // Show more detailed error message
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to refresh health data. Please try again.'
    alert(errorMessage)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const isToday = (dateString) => {
  const today = new Date()
  const date = new Date(dateString)
  return date.toDateString() === today.toDateString()
}

// Add a watcher to debug healthData changes
watch(healthData, (newVal) => {
  console.log('Health data changed:', newVal)
}, { deep: true })

// Add error handling for the component
onErrorCaptured((err) => {
  console.error('Component error:', err)
  return false
})

onMounted(() => {
  fetchHealthData()
})
</script>

<style scoped>
.health-tracker {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.days-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.day-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.day-card:hover {
  transform: translateY(-5px);
}

.day-card.today {
  border: 2px solid #4CAF50;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.day-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.date {
  font-size: 0.9rem;
  color: #666;
}

.health-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.metric {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.metric-icon {
  font-size: 1.2rem;
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.8rem;
  color: #666;
}

.metric-value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.refresh-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.refresh-btn:hover {
  background: #2980b9;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .days-container {
    grid-template-columns: 1fr;
  }
  
  .health-metrics {
    grid-template-columns: repeat(2, 1fr);
}
}
</style>
