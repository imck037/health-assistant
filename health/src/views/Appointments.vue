<template>
  <div class="appointments-container">
    <h1 class="text-3xl font-bold mb-8 text-center text-slate-800">My Appointments</h1>
    
    <!-- Appointment Type Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Online Appointments Card -->
      <div 
        class="appointment-type-card"
        :class="{ 'active': activeTab === 'online' }"
        @click="$router.push('/appointment-form?type=online')"
      >
        <div class="card-icon">
          <i class="fas fa-video"></i>
        </div>
        <h3 class="card-title">Online Appointments</h3>
        <p class="card-count">{{ onlineAppointments.length }} scheduled</p>
      </div>

      <!-- In-Person Appointments Card -->
      <div 
        class="appointment-type-card"
        :class="{ 'active': activeTab === 'offline' }"
        @click="$router.push('/appointment-form?type=offline')"
      >
        <div class="card-icon">
          <i class="fas fa-hospital"></i>
        </div>
        <h3 class="card-title">In-Person Appointments</h3>
        <p class="card-count">{{ offlineAppointments.length }} scheduled</p>
      </div>

      <!-- Appointment History Card -->
      <div 
        class="appointment-type-card"
        :class="{ 'active': activeTab === 'history' }"
        @click="$router.push('/appointment-history')"
      >
        <div class="card-icon">
          <i class="fas fa-history"></i>
        </div>
        <h3 class="card-title">Appointment History</h3>
        <p class="card-count">{{ appointmentHistory.length }} records</p>
      </div>
    </div>

    <!-- Content Sections -->
    <div class="content-section">
      <!-- Online Appointment Section -->
      <div v-if="activeTab === 'online'" class="section-content">
        <div class="section-header">
          <h2 class="section-title">Online Appointments</h2>
          <router-link 
            to="/appointment-form?type=online" 
            class="btn-primary"
          >
            <i class="fas fa-plus mr-2"></i>
            Book Online Appointment
          </router-link>
        </div>
        <div class="appointments-grid">
          <div v-for="appointment in onlineAppointments" 
               :key="appointment.id" 
               class="appointment-card"
               :class="getStatusClass(appointment.status)"
          >
            <div class="card-content">
              <div class="card-main">
                <h3 class="doctor-name">{{ appointment.doctor }}</h3>
                <div class="appointment-details">
                  <p class="detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    {{ formatDate(appointment.date) }} at {{ formatTime(appointment.time) }}
                  </p>
                  <p class="detail-item">
                    <i class="fas fa-video"></i>
                    <a :href="appointment.meetingLink" 
                       class="meeting-link" 
                       target="_blank"
                    >
                      Join Meeting
                    </a>
                  </p>
                  <p class="status-badge" :class="getStatusClass(appointment.status)">
                    <i class="fas fa-circle"></i>
                    {{ appointment.status }}
                  </p>
                </div>
              </div>
              <div class="card-actions" v-if="appointment.status === 'Scheduled'">
                <button 
                  @click="rescheduleAppointment(appointment.id)" 
                  class="btn-secondary"
                >
                  <i class="fas fa-calendar-alt"></i>
                  Reschedule
                </button>
                <button 
                  @click="cancelAppointment(appointment.id)" 
                  class="btn-danger"
                >
                  <i class="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div v-if="onlineAppointments.length === 0" class="empty-state">
            <i class="fas fa-calendar-times"></i>
            <p>No online appointments scheduled</p>
            <router-link 
              to="/appointment-form?type=online" 
              class="btn-primary"
            >
              Book Your First Online Appointment
            </router-link>
          </div>
        </div>
      </div>

      <!-- Offline Appointment Section -->
      <div v-if="activeTab === 'offline'" class="section-content">
        <div class="section-header">
          <h2 class="section-title">In-Person Appointments</h2>
          <router-link 
            to="/appointment-form?type=offline" 
            class="btn-primary"
          >
            <i class="fas fa-plus mr-2"></i>
            Book In-Person Appointment
          </router-link>
        </div>
        <div class="appointments-grid">
          <div v-for="appointment in offlineAppointments" 
               :key="appointment.id" 
               class="appointment-card"
               :class="getStatusClass(appointment.status)"
          >
            <div class="card-content">
              <div class="card-main">
                <h3 class="doctor-name">{{ appointment.doctor }}</h3>
                <div class="appointment-details">
                  <p class="detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    {{ formatDate(appointment.date) }} at {{ formatTime(appointment.time) }}
                  </p>
                  <p class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ appointment.location }}
                  </p>
                  <p class="status-badge" :class="getStatusClass(appointment.status)">
                    <i class="fas fa-circle"></i>
                    {{ appointment.status }}
                  </p>
                </div>
              </div>
              <div class="card-actions" v-if="appointment.status === 'Scheduled'">
                <button 
                  @click="rescheduleAppointment(appointment.id)" 
                  class="btn-secondary"
                >
                  <i class="fas fa-calendar-alt"></i>
                  Reschedule
                </button>
                <button 
                  @click="cancelAppointment(appointment.id)" 
                  class="btn-danger"
                >
                  <i class="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div v-if="offlineAppointments.length === 0" class="empty-state">
            <i class="fas fa-calendar-times"></i>
            <p>No in-person appointments scheduled</p>
            <router-link 
              to="/appointment-form?type=offline" 
              class="btn-primary"
            >
              Book Your First In-Person Appointment
            </router-link>
          </div>
        </div>
      </div>

      <!-- Appointment History Section -->
      <div v-if="activeTab === 'history'" class="section-content">
        <!-- This section will be removed as we're moving to a separate page -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Appointments',
  data() {
    return {
      activeTab: 'online',
      tabs: [
        { id: 'online', name: 'Online Appointments', icon: 'fas fa-video' },
        { id: 'offline', name: 'In-Person Appointments', icon: 'fas fa-hospital' },
        { id: 'history', name: 'Appointment History', icon: 'fas fa-history' }
      ],
      onlineAppointments: [
        {
          id: 1,
          doctor: 'Dr. Emily Smith',
          date: '2024-04-15',
          time: '10:00',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          status: 'Scheduled'
        }
      ],
      offlineAppointments: [
        {
          id: 2,
          doctor: 'Dr. John Davis',
          date: '2024-04-20',
          time: '14:30',
          location: 'Main Hospital - Room 305',
          status: 'Scheduled'
        }
      ],
      appointmentHistory: [
        {
          id: 3,
          doctor: 'Dr. Sarah Wilson',
          date: '2024-03-15',
          time: '11:00',
          type: 'Online',
          status: 'Completed'
        }
      ]
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
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
    cancelAppointment(appointmentId) {
      if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointment = [...this.onlineAppointments, ...this.offlineAppointments]
          .find(a => a.id === appointmentId);
        if (appointment) {
          appointment.status = 'Cancelled';
          // Move to history
          this.appointmentHistory.unshift({
            ...appointment,
            id: Date.now()
          });
        }
      }
    },
    rescheduleAppointment(appointmentId) {
      // Implement rescheduling logic
      console.log('Rescheduling appointment:', appointmentId);
    },
    getStatusClass(status) {
      return {
        'text-green-600': status === 'Completed',
        'text-blue-600': status === 'Scheduled',
        'text-red-600': status === 'Cancelled'
      };
    }
  }
}
</script>

<style scoped>
.appointments-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f0f7ff;
  min-height: calc(100vh - 100px);
}

/* Appointment Type Cards */
.appointment-type-card {
  background: white;
  border-radius: 1.25rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.appointment-type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.1);
  border-color: #60a5fa;
}

.appointment-type-card.active {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.15);
}

.card-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 1.25rem;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 1.75rem;
  transition: all 0.3s ease;
}

.appointment-type-card:hover .card-icon {
  transform: scale(1.1);
  background: #dbeafe;
}

.card-title {
  font-size: 1.375rem;
  font-weight: 600;
  color: #1e3a8a;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
}

.card-count {
  color: #64748b;
  font-size: 0.9375rem;
  font-weight: 500;
}

/* Content Section */
.content-section {
  background: white;
  border-radius: 1.25rem;
  padding: 2.5rem;
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.08);
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f1f5f9;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e3a8a;
  letter-spacing: -0.025em;
}

.appointments-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .appointments-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .appointments-grid {
    grid-template-columns: 1fr;
  }
}

/* Appointment Cards */
.appointment-card {
  background: white;
  border-radius: 1.25rem;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.appointment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.1);
  border-color: #60a5fa;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.card-main {
  flex: 1;
}

.doctor-name {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 1.25rem;
  letter-spacing: -0.025em;
}

.appointment-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #475569;
  font-size: 1rem;
  font-weight: 500;
}

.detail-item i {
  color: #3b82f6;
  width: 20px;
  font-size: 1.125rem;
}

.meeting-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.meeting-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.status-badge i {
  font-size: 0.625rem;
}

/* Status Colors */
.text-green-600 {
  color: #047857;
  background-color: #ecfdf5;
  border: 1px solid #a7f3d0;
}

.text-blue-600 {
  color: #0369a1;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
}

.text-red-600 {
  color: #b91c1c;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background-color: #f8fafc;
  color: #475569;
  border-radius: 0.875rem;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  color: #1e293b;
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background-color: #fef2f2;
  color: #dc2626;
  border-radius: 0.875rem;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 1px solid #fecaca;
  cursor: pointer;
}

.btn-danger:hover {
  background-color: #fee2e2;
  border-color: #fca5a5;
  color: #b91c1c;
}

.card-actions {
  display: flex;
  gap: 1rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #f8fafc;
  border-radius: 1.25rem;
  border: 2px dashed #e2e8f0;
  transition: all 0.3s ease;
}

.empty-state:hover {
  border-color: #60a5fa;
  background: #f0f9ff;
}

.empty-state i {
  font-size: 3.5rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.empty-state:hover i {
  color: #3b82f6;
  transform: scale(1.1);
}

.empty-state p {
  color: #64748b;
  margin-bottom: 2rem;
  font-size: 1.125rem;
  font-weight: 500;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.appointment-card {
  animation: fadeIn 0.4s ease-out forwards;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
  border: 2px solid #f1f5f9;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style> 