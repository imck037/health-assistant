<template>
  <div class="chat-container">
    <div class="header">
      <h2>Healthcare Chatbot</h2>
      <div class="connection-status" :class="{ 'connected': isConnected }">
        {{ isConnected ? 'Connected' : 'Disconnected' }}
      </div>
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div class="chat-box" ref="chatBox">
      <div v-for="(msg, index) in messages" :key="index" class="chat-message">
        <p><strong>{{ msg.sender }}:</strong> {{ msg.text }}</p>
      </div>
      <div v-if="isLoading" class="chat-message bot">
        <p><strong>Bot:</strong> <span class="typing-indicator">...</span></p>
      </div>
    </div>
    <div class="input-container">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="Describe your symptoms..."
        :disabled="!isConnected || isLoading"
      />
      <button 
        @click="sendMessage" 
        :disabled="!isConnected || isLoading || !userInput.trim()"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChatBot",
  data() {
    return {
      userInput: "",
      messages: [],
      isConnected: false,
      isLoading: false,
      errorMessage: "",
      API_BASE_URL: "http://localhost:5000"
    };
  },
  methods: {
    async checkConnection() {
      try {
        const response = await axios.get(`${this.API_BASE_URL}/health`);
        this.isConnected = response.data.status === "ok";
        this.errorMessage = "";
      } catch (error) {
        this.isConnected = false;
        this.errorMessage = "Unable to connect to the server. Please make sure the server is running.";
        console.error("Connection error:", error);
      }
    },
    async sendMessage() {
      if (!this.userInput.trim() || !this.isConnected || this.isLoading) return;

      const userMessage = this.userInput.trim();
      this.messages.push({ sender: "User", text: userMessage });
      this.userInput = "";
      this.isLoading = true;
      this.errorMessage = "";

      try {
        const res = await axios.post(`${this.API_BASE_URL}/ask`, {
          message: userMessage,
        });

        if (res.data.error) {
          throw new Error(res.data.details || res.data.reply);
        }

        this.messages.push({ sender: "Bot", text: res.data.reply });
      } catch (error) {
        console.error("Error sending message:", error);
        this.errorMessage = error.response?.data?.details || 
                           error.message || 
                           "Error: Unable to connect to the server.";
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },
    scrollToBottom() {
      setTimeout(() => {
        const chatBox = this.$refs.chatBox;
        if (chatBox) {
          chatBox.scrollTop = chatBox.scrollHeight;
        }
      }, 100);
    }
  },
  mounted() {
    this.checkConnection();
    // Check connection status every 30 seconds
    setInterval(this.checkConnection, 30000);
  }
};
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.connection-status {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9em;
  background-color: #ff4444;
  color: white;
}

.connection-status.connected {
  background-color: #00C851;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  text-align: center;
}

.chat-box {
  border: 1px solid #ccc;
  padding: 10px;
  height: 400px;
  overflow-y: scroll;
  margin-bottom: 10px;
  background: #f9f9f9;
  border-radius: 4px;
}

.chat-message {
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
}

.chat-message.bot {
  background-color: #f0f0f0;
}

.input-container {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

button {
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.typing-indicator {
  display: inline-block;
  animation: typing 1s infinite;
}

@keyframes typing {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
</style>
