import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Chat from '../views/Chat.vue'
import Profile from '../views/Profile.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import MedicalRecords from '../views/MedicalRecords.vue'
import Appointments from '../views/Appointments.vue'
import DoctorSelection from '../views/DoctorSelection.vue'
import AppointmentForm from '../views/AppointmentForm.vue'
import AppointmentHistory from '../views/AppointmentHistory.vue'
import HealthTracer from '../components/HealthTracer.vue'
import TimelyDiagnosis from '../views/TimelyDiagnosis.vue'

const routes = [
  { 
    path: '/', 
    redirect: '/login'
  },
  { 
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  { 
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { path: '/chat', name: 'Chat', component: Chat },
  { path: '/profile', name: 'Profile', component: Profile },  
  { path: '/signup', component: SignupView },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView
  },
  {
    path: '/medical-records',
    name: 'MedicalRecords',
    component: MedicalRecords
  },
  {
    path: '/appointments',
    name: 'Appointments',
    component: Appointments
  },
  {
    path: '/appointment-history',
    name: 'AppointmentHistory',
    component: AppointmentHistory
  },
  {
    path: '/doctor-selection',
    name: 'DoctorSelection',
    component: DoctorSelection
  },
  {
    path: '/appointment-form',
    name: 'AppointmentForm',
    component: AppointmentForm
  },
  {
    path: '/tracker',
    name: 'HealthTracker',
    component: HealthTracer
  },
  {
    path: '/records',
    name: 'Records',
    component: MedicalRecords
  },
  {
    path: '/timely-diagnosis',
    name: 'TimelyDiagnosis',
    component: TimelyDiagnosis
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
