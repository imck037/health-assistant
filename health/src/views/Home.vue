<template>
  <div class="home-container">
    <main class="home-content">
      <div class="hero-section">
        <h1>Welcome to HealthHub</h1>
        <p>Your personal healthcare assistant, all in one place.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="icon">🏥</div>
          <h3>Health Tracking</h3>
          <p>Monitor your vital signs and health metrics</p>
        </div>
        <div class="feature-card">
          <div class="icon">📊</div>
          <h3>Analytics</h3>
          <p>View detailed health analytics and trends</p>
        </div>
        <div class="feature-card">
          <div class="icon">🤖</div>
          <h3>AI Assistant</h3>
          <p>Get instant health-related answers</p>
        </div>
        <div class="feature-card">
          <div class="icon">📱</div>
          <h3>Easy Access</h3>
          <p>Access your health data anytime, anywhere</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 64px); /* Adjust based on navbar height */
  background: #f8faff;
}

.home-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  gap: 4rem;
}

.hero-section {
  text-align: center;
  max-width: 800px;
}

.hero-section h1 {
  font-size: 3.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-section p {
  font-size: 1.25rem;
  color: #4a5568;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card .icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.feature-card p {
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .home-content {
    padding: 2rem 1rem;
    gap: 2rem;
  }

  .hero-section h1 {
    font-size: 2.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
  