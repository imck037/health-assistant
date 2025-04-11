<template>
  <div class="appointment-history">
    <h1>Appointment History</h1>
    <div class="appointment-list">
      <div v-for="appointment in appointments" :key="appointment.id" class="appointment-card">
        <div class="appointment-header">
          <h3>{{ appointment.doctorName }}</h3>
          <span :class="['status', appointment.status.toLowerCase()]">{{ appointment.status }}</span>
        </div>
        <div class="appointment-details">
          <p><strong>Date:</strong> {{ appointment.date }}</p>
          <p><strong>Time:</strong> {{ appointment.time }}</p>
          <p><strong>Type:</strong> {{ appointment.type }}</p>
          <p><strong>Notes:</strong> {{ appointment.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppointmentHistory',
  data() {
    return {
      appointments: [
        {
          id: 1,
          doctorName: 'Dr. Sarah Johnson',
          date: '2024-03-15',
          time: '10:00 AM',
          type: 'General Checkup',
          status: 'Completed',
          notes: 'Regular health checkup. All vitals normal.'
        },
        {
          id: 2,
          doctorName: 'Dr. Michael Chen',
          date: '2024-02-20',
          time: '2:30 PM',
          type: 'Follow-up',
          status: 'Completed',
          notes: 'Follow-up appointment for previous treatment.'
        },
        {
          id: 3,
          doctorName: 'Dr. Emily Brown',
          date: '2024-01-10',
          time: '11:15 AM',
          type: 'Consultation',
          status: 'Cancelled',
          notes: 'Appointment cancelled due to emergency.'
        }
      ]
    }
  }
}
</script>

<style scoped>
.appointment-history {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.appointment-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.appointment-header h3 {
  margin: 0;
  color: #2c3e50;
}

.status {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9em;
  font-weight: 500;
}

.status.completed {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status.cancelled {
  background-color: #ffebee;
  color: #d32f2f;
}

.appointment-details p {
  margin: 8px 0;
  color: #666;
}

.appointment-details strong {
  color: #2c3e50;
  margin-right: 5px;
}
</style> 