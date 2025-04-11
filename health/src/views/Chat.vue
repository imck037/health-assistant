<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>AI Health Assistant</h1>
      <p>Ask me anything about your health, symptoms, or medical concerns</p>
    </div>
    <ChatBot />
  </div>
</template>

<script setup>
import ChatBot from '@/components/ChatBot.vue'
</script>

<style scoped>
.chat-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 64px);
  background: #f8faff;
}

.chat-header {
  text-align: center;
  margin-bottom: 2rem;
}

.chat-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.chat-header p {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.6;
}
</style>
  