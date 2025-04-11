const express = require('express');
const router = express.Router();

// GET /api/diagnosis/notifications
router.get('/notifications', async (req, res) => {
  try {
    // Sample notifications data - replace with actual database query later
    const notifications = [
      {
        title: "New Diagnosis Report",
        message: "Your latest health check results are ready for review",
        time: "2 hours ago",
        type: "info"
      },
      {
        title: "Follow-up Required",
        message: "Please schedule a follow-up appointment for your recent diagnosis",
        time: "1 day ago",
        type: "warning"
      },
      {
        title: "Test Results Available",
        message: "Your laboratory test results have been uploaded",
        time: "2 days ago",
        type: "alert"
      },
      {
        title: "Health Check Complete",
        message: "Your annual health check has been completed successfully",
        time: "3 days ago",
        type: "success"
      }
    ];

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

module.exports = router; 