const express = require('express');
const router = express.Router();

// Generate mock health data for the last 7 days
const generateMockHealthData = () => {
  try {
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayData = {
        date: date.toISOString().split('T')[0],
        steps: Math.floor(Math.random() * 5000) + 3000,
        heart_rate: Math.floor(Math.random() * 20) + 60,
        sleep_hours: (Math.random() * 3 + 6).toFixed(1),
        calories: Math.floor(Math.random() * 1000) + 1500,
        weight: (Math.random() * 5 + 65).toFixed(1),
        blood_pressure: `${Math.floor(Math.random() * 20) + 110}/${Math.floor(Math.random() * 10) + 70}`,
        mood: ['Happy', 'Neutral', 'Tired', 'Energetic', 'Stressed'][Math.floor(Math.random() * 5)]
      };
      
      console.log(`Generated data for ${dayData.date}:`, dayData);
      data.push(dayData);
    }
    
    return data;
  } catch (error) {
    console.error('Error generating mock data:', error);
    throw error;
  }
};

// Get health tracking data
router.get('/tracking', async (req, res) => {
  try {
    console.log('Health tracking data requested');
    console.log('Request headers:', req.headers);
    
    const healthData = generateMockHealthData();
    console.log('Generated health data length:', healthData.length);
    
    if (!healthData || !Array.isArray(healthData)) {
      throw new Error('Invalid data format generated');
    }
    
    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 100));
    
    res.status(200).json(healthData);
  } catch (error) {
    console.error('Error in health tracking route:', error);
    res.status(500).json({ 
      message: 'Error fetching health data',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
