<template>
  <div class="dashboard-container">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">Welcome back, {{ userName }}</h1>
        <p class="welcome-subtitle">Here's your health overview</p>
      </div>
      <div class="quick-actions">
        <button @click="$router.push('/appointment-form')" class="action-button primary">
          <i class="fas fa-plus"></i>
          Book Appointment
        </button>
        <button @click="$router.push('/appointments')" class="action-button secondary">
          <i class="fas fa-calendar-alt"></i>
          View Appointments
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon appointments">
          <i class="fas fa-calendar-check"></i>
        </div>
        <div class="stat-info">
          <h3>Upcoming Appointments</h3>
          <p class="stat-value">{{ upcomingAppointments }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon completed">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-info">
          <h3>Completed Visits</h3>
          <p class="stat-value">{{ completedVisits }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon doctors">
          <i class="fas fa-user-md"></i>
        </div>
        <div class="stat-info">
          <h3>Your Doctors</h3>
          <p class="stat-value">{{ doctorsCount }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon records">
          <i class="fas fa-file-medical"></i>
        </div>
        <div class="stat-info">
          <h3>Medical Records</h3>
          <p class="stat-value">{{ recordsCount }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Upcoming Appointments -->
      <div class="content-card appointments-card">
        <div class="card-header">
          <h2>Upcoming Appointments</h2>
          <router-link to="/appointments" class="view-all">View All</router-link>
        </div>
        <div class="appointments-list">
          <div v-for="appointment in nextAppointments" 
               :key="appointment.id" 
               class="appointment-item"
          >
            <div class="appointment-info">
              <h3>{{ appointment.doctor }}</h3>
              <p class="appointment-datetime">
                <i class="fas fa-calendar"></i>
                {{ formatDate(appointment.date) }} at {{ formatTime(appointment.time) }}
              </p>
              <p class="appointment-type">
                <i class="fas" :class="appointment.type === 'online' ? 'fa-video' : 'fa-hospital'"></i>
                {{ appointment.type === 'online' ? 'Online Consultation' : 'In-Person Visit' }}
              </p>
            </div>
            <div class="appointment-actions">
              <button class="action-btn" @click="joinAppointment(appointment)">
                <i class="fas" :class="appointment.type === 'online' ? 'fa-video' : 'fa-directions'"></i>
                {{ appointment.type === 'online' ? 'Join' : 'Directions' }}
              </button>
            </div>
          </div>
          <div v-if="nextAppointments.length === 0" class="empty-state">
            <i class="fas fa-calendar-times"></i>
            <p>No upcoming appointments</p>
            <button @click="$router.push('/appointment-form')" class="btn-primary">
              Book an Appointment
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Medical Records -->
      <div class="content-card records-card">
        <div class="card-header">
          <h2>Recent Medical Records</h2>
          <router-link to="/medical-records" class="view-all">View All</router-link>
        </div>
        <div class="records-list">
          <div v-for="record in recentRecords" 
               :key="record.id" 
               class="record-item"
          >
            <div class="record-icon">
              <i class="fas" :class="getRecordIcon(record.type)"></i>
            </div>
            <div class="record-info">
              <h3>{{ record.title }}</h3>
              <p class="record-date">{{ formatDate(record.date) }}</p>
              <p class="record-doctor">By {{ record.doctor }}</p>
            </div>
            <button class="view-record" @click="viewRecord(record)">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <div v-if="recentRecords.length === 0" class="empty-state">
            <i class="fas fa-file-medical-alt"></i>
            <p>No recent medical records</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      userName: 'John',
      upcomingAppointments: 2,
      completedVisits: 8,
      doctorsCount: 3,
      recordsCount: 12,
      nextAppointments: [
        {
          id: 1,
          doctor: 'Dr. Sarah Johnson',
          date: '2024-04-15',
          time: '10:00',
          type: 'online',
          meetingLink: 'https://meet.google.com/abc-defg-hij'
        },
        {
          id: 2,
          doctor: 'Dr. Michael Chen',
          date: '2024-04-20',
          time: '14:30',
          type: 'offline',
          location: 'Main Hospital - Room 305'
        }
      ],
      recentRecords: [
        {
          id: 1,
          title: 'Blood Test Results',
          date: '2024-03-28',
          type: 'lab',
          doctor: 'Dr. Sarah Johnson'
        },
        {
          id: 2,
          title: 'X-Ray Report',
          date: '2024-03-25',
          type: 'imaging',
          doctor: 'Dr. Michael Chen'
        },
        {
          id: 3,
          title: 'Prescription Update',
          date: '2024-03-20',
          type: 'prescription',
          doctor: 'Dr. Emily Brown'
        }
      ]
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    },
    formatTime(time) {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    },
    getRecordIcon(type) {
      const icons = {
        lab: 'fa-flask',
        imaging: 'fa-x-ray',
        prescription: 'fa-prescription-bottle-alt',
        note: 'fa-file-medical'
      };
      return icons[type] || 'fa-file-medical';
    },
    joinAppointment(appointment) {
      if (appointment.type === 'online') {
        window.open(appointment.meetingLink, '_blank');
      } else {
        // Handle directions to the hospital
        console.log('Show directions to:', appointment.location);
      }
    },
    viewRecord(record) {
      // Handle viewing medical record
      console.log('View record:', record);
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f8fafc;
  min-height: calc(100vh - 64px);
}

/* Welcome Section */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.welcome-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  color: #64748b;
  font-size: 1.125rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.action-button.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.action-button.secondary {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.appointments {
  background-color: #dbeafe;
  color: #3b82f6;
}

.stat-icon.completed {
  background-color: #dcfce7;
  color: #22c55e;
}

.stat-icon.doctors {
  background-color: #fef3c7;
  color: #f59e0b;
}

.stat-icon.records {
  background-color: #f3e8ff;
  color: #a855f7;
}

.stat-info h3 {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.content-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.view-all {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

.view-all:hover {
  text-decoration: underline;
}

/* Appointments List */
.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.appointment-item:hover {
  background: #f1f5f9;
}

.appointment-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.appointment-datetime,
.appointment-type {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: #3b82f6;
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #2563eb;
}

/* Records List */
.records-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.record-item:hover {
  background: #f1f5f9;
}

.record-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3e8ff;
  color: #a855f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.record-info {
  flex: 1;
}

.record-info h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.record-date,
.record-doctor {
  font-size: 0.75rem;
  color: #64748b;
}

.view-record {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
}

.view-record:hover {
  color: #3b82f6;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #94a3b8;
}

.empty-state p {
  margin-bottom: 1rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .welcome-section {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .quick-actions {
    width: 100%;
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
  