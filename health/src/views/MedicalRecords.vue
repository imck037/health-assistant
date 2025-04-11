<template>
  <div class="medical-records-container">
    <div class="records-card">
      <div class="header-section">
        <h2 class="title">Medical Records</h2>
        <div class="actions">
          <button class="action-btn">
            <i class="fas fa-download"></i>
            Export
          </button>
          <button class="action-btn">
            <i class="fas fa-print"></i>
            Print
          </button>
        </div>
      </div>

      <!-- Patient Info -->
      <div class="patient-info">
        <div class="info-header">
          <div class="patient-avatar">
            <img v-if="user.avatar" :src="user.avatar" alt="Patient Avatar">
            <span v-else class="avatar-text">{{ userInitials }}</span>
          </div>
          <div class="info-details">
            <h3 class="patient-name">{{ user.name }}</h3>
            <div class="info-meta">
              <span><i class="fas fa-user"></i> {{ user.age }} years | {{ user.gender }}</span>
              <span><i class="fas fa-id-card"></i> ID: {{ user.id }}</span>
              <span><i class="fas fa-calendar"></i> Last Updated: {{ user.lastUpdated }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Vital Stats -->
      <div class="vitals-section">
        <h3 class="section-title">Vital Statistics</h3>
        <div class="vitals-grid">
          <div v-for="(value, key) in user.vitals" :key="key" class="vital-card">
            <div class="vital-icon">
              <i :class="getVitalIcon(key)"></i>
            </div>
            <div class="vital-info">
              <p class="vital-label">{{ key }}</p>
              <p class="vital-value">{{ value }}</p>
            </div>
            <div class="vital-status" :class="getVitalStatus(value, key)">
              {{ getVitalStatusText(value, key) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Medical Reports -->
      <div class="reports-section">
        <div class="section-header">
          <h3 class="section-title">Medical Reports</h3>
          <button class="add-report-btn">
            <i class="fas fa-plus"></i>
            New Report
          </button>
        </div>
        <div class="reports-list">
          <div v-for="report in user.reports" :key="report.id" class="report-card">
            <div class="report-icon">
              <i :class="getReportIcon(report.type)"></i>
            </div>
            <div class="report-content">
              <div class="report-header">
                <h4 class="report-title">{{ report.title }}</h4>
                <span class="report-date">{{ report.date }}</span>
              </div>
              <p class="report-description">{{ report.description }}</p>
              <div class="report-actions">
                <button class="view-btn" @click="openReport(report)">
                  <i class="fas fa-eye"></i>
                  View
                </button>
                <button class="download-btn">
                  <i class="fas fa-download"></i>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Modal -->
      <div v-if="selectedReport" class="modal-overlay" @click="closeReport">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <div class="modal-title">
              <i :class="getReportIcon(selectedReport.type)"></i>
              <h3>{{ selectedReport.title }}</h3>
            </div>
            <button class="close-btn" @click="closeReport">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="report-info">
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">{{ selectedReport.date }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Type:</span>
                <span class="info-value">{{ selectedReport.type }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value status-normal">Normal</span>
              </div>
            </div>
            <div class="report-details">
              <h4>Report Details</h4>
              <p>{{ selectedReport.description }}</p>
              <div class="report-findings">
                <h4>Findings</h4>
                <ul>
                  <li>All parameters within normal range</li>
                  <li>No significant abnormalities detected</li>
                  <li>Follow-up recommended in 6 months</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="closeReport">Close</button>
            <button class="modal-btn primary">
              <i class="fas fa-download"></i>
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const user = {
  name: 'John Doe',
  age: 42,
  gender: 'Male',
  id: 'MR-2024-001',
  lastUpdated: '2024-03-25',
  avatar: '',
  vitals: {
    'Blood Pressure': '120/80 mmHg',
    'Heart Rate': '72 bpm',
    'Temperature': '98.6°F',
    'Oxygen Saturation': '98%',
    'Blood Sugar': '95 mg/dL',
    'BMI': '24.5',
  },
  reports: [
    { 
      id: 1, 
      title: 'Complete Blood Count', 
      type: 'blood',
      date: '2024-03-22',
      description: 'Routine blood work showing normal ranges for all parameters.'
    },
    { 
      id: 2, 
      title: 'Chest X-Ray', 
      type: 'imaging',
      date: '2024-03-15',
      description: 'Clear lung fields, no abnormalities detected.'
    },
    { 
      id: 3, 
      title: 'ECG Report', 
      type: 'cardiac',
      date: '2024-03-01',
      description: 'Normal sinus rhythm, no significant findings.'
    },
  ],
};

const userInitials = computed(() => {
  return user.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
});

const getVitalIcon = (vital) => {
  const icons = {
    'Blood Pressure': 'fas fa-heartbeat',
    'Heart Rate': 'fas fa-heart',
    'Temperature': 'fas fa-thermometer-half',
    'Oxygen Saturation': 'fas fa-lungs',
    'Blood Sugar': 'fas fa-tint',
    'BMI': 'fas fa-weight',
  };
  return icons[vital] || 'fas fa-chart-line';
};

const getReportIcon = (type) => {
  const icons = {
    'blood': 'fas fa-vial',
    'imaging': 'fas fa-x-ray',
    'cardiac': 'fas fa-heartbeat',
  };
  return icons[type] || 'fas fa-file-medical';
};

const getVitalStatus = (value, vital) => {
  // This is a simplified version. In a real app, you'd want more sophisticated logic
  const ranges = {
    'Blood Pressure': { normal: '120/80', high: '140/90' },
    'Heart Rate': { normal: '60-100', high: '100' },
    'Temperature': { normal: '98.6', high: '99.5' },
    'Oxygen Saturation': { normal: '95-100', low: '95' },
    'Blood Sugar': { normal: '70-100', high: '100' },
    'BMI': { normal: '18.5-24.9', high: '25' },
  };

  if (!ranges[vital]) return 'normal';
  
  const numValue = parseFloat(value);
  if (numValue > parseFloat(ranges[vital].high)) return 'high';
  if (numValue < parseFloat(ranges[vital].low)) return 'low';
  return 'normal';
};

const getVitalStatusText = (value, vital) => {
  const status = getVitalStatus(value, vital);
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const selectedReport = ref(null);

const openReport = (report) => {
  selectedReport.value = report;
};

const closeReport = () => {
  selectedReport.value = null;
};
</script>

<style scoped>
.medical-records-container {
  padding: 2rem;
  min-height: 100vh;
  background: #f8f9fa;
}

.records-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: #f8f9fa;
  color: #4776E6;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #4776E6;
  color: white;
}

.patient-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.patient-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #4776E6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.info-details {
  flex: 1;
}

.patient-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.info-meta {
  display: flex;
  gap: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.info-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

.vitals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.vital-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.vital-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4776E6;
  font-size: 1.2rem;
}

.vital-info {
  flex: 1;
}

.vital-label {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.vital-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0.2rem 0 0 0;
}

.vital-status {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.vital-status.normal {
  background: #e3fcef;
  color: #00a854;
}

.vital-status.high {
  background: #fff1f0;
  color: #f5222d;
}

.vital-status.low {
  background: #e6f7ff;
  color: #1890ff;
}

.reports-section {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.add-report-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: #4776E6;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-report-btn:hover {
  background: #3867d5;
  transform: translateY(-1px);
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: white;
  border: 1px solid #eee;
  transition: all 0.3s ease;
}

.report-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.report-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4776E6;
  font-size: 1.4rem;
}

.report-content {
  flex: 1;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.report-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.report-date {
  font-size: 0.9rem;
  color: #666;
}

.report-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1rem 0;
}

.report-actions {
  display: flex;
  gap: 1rem;
}

.view-btn, .download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn {
  background: #f8f9fa;
  color: #4776E6;
}

.download-btn {
  background: #4776E6;
  color: white;
}

.view-btn:hover {
  background: #4776E6;
  color: white;
}

.download-btn:hover {
  background: #3867d5;
}

@media (max-width: 768px) {
  .medical-records-container {
    padding: 1rem;
  }

  .records-card {
    padding: 1rem;
  }

  .info-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .vitals-grid {
    grid-template-columns: 1fr;
  }

  .report-card {
    flex-direction: column;
  }

  .report-icon {
    width: 100%;
    height: 40px;
    border-radius: 8px;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-title i {
  font-size: 1.5rem;
  color: #4776E6;
}

.modal-title h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem;
}

.report-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-size: 0.9rem;
}

.info-value {
  font-weight: 500;
  color: #2c3e50;
}

.status-normal {
  color: #00a854;
  background: #e3fcef;
  padding: 0.2rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.report-details {
  margin-top: 1.5rem;
}

.report-details h4 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.report-findings {
  margin-top: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
}

.report-findings ul {
  margin: 1rem 0 0 0;
  padding-left: 1.5rem;
}

.report-findings li {
  color: #666;
  margin-bottom: 0.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn.secondary {
  background: #f8f9fa;
  color: #666;
}

.modal-btn.primary {
  background: #4776E6;
  color: white;
}

.modal-btn.secondary:hover {
  background: #eee;
}

.modal-btn.primary:hover {
  background: #3867d5;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 