<template>
  <div class="doctor-selection">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-semibold text-gray-800">Select a Doctor</h3>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Search and Filter -->
        <div class="mb-6 flex gap-4">
          <div class="flex-1">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search doctors..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            v-model="selectedSpecialty"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Specialties</option>
            <option v-for="specialty in specialties" :key="specialty" :value="specialty">
              {{ specialty }}
            </option>
          </select>
        </div>

        <!-- Doctors Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="doctor in filteredDoctors"
            :key="doctor.id"
            class="doctor-card"
            @click="selectDoctor(doctor)"
          >
            <div class="doctor-avatar">
              <img :src="doctor.avatar" :alt="doctor.name" class="w-full h-full object-cover" />
            </div>
            <div class="doctor-info">
              <h4 class="text-lg font-semibold text-gray-800">{{ doctor.name }}</h4>
              <p class="text-blue-600">{{ doctor.specialty }}</p>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <i class="fas fa-clock"></i>
                <span>{{ doctor.experience }} years experience</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <i class="fas fa-star text-yellow-400"></i>
                <span>{{ doctor.rating }} ({{ doctor.reviews }} reviews)</span>
              </div>
              <div class="availability mt-2">
                <span
                  :class="[
                    'text-sm px-2 py-1 rounded-full',
                    doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ doctor.available ? 'Available Now' : 'Next Available: ' + doctor.nextAvailable }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Doctor Details -->
        <div v-if="selectedDoctor" class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 class="text-lg font-semibold mb-2">Selected Doctor: {{ selectedDoctor.name }}</h4>
          <p class="text-gray-600 mb-4">{{ selectedDoctor.description }}</p>
          <div class="flex justify-end gap-3">
            <button
              @click="selectedDoctor = null"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Change Selection
            </button>
            <button
              @click="confirmSelection"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue with {{ selectedDoctor.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['close', 'select']);

const searchQuery = ref('');
const selectedSpecialty = ref('');
const selectedDoctor = ref(null);

const specialties = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Neurologist',
  'Orthopedist',
  'ENT Specialist',
  'Ophthalmologist'
];

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Smith',
    specialty: 'General Physician',
    experience: 15,
    rating: 4.8,
    reviews: 234,
    available: true,
    nextAvailable: null,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    description: 'Specialized in preventive care and chronic disease management.'
  },
  {
    id: 2,
    name: 'Dr. James Wilson',
    specialty: 'Cardiologist',
    experience: 20,
    rating: 4.9,
    reviews: 189,
    available: false,
    nextAvailable: '2:00 PM',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    description: 'Expert in cardiovascular health and preventive cardiology.'
  },
  {
    id: 3,
    name: 'Dr. Emily Brown',
    specialty: 'Dermatologist',
    experience: 12,
    rating: 4.7,
    reviews: 156,
    available: true,
    nextAvailable: null,
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    description: 'Specialized in skin conditions and cosmetic dermatology.'
  },
  {
    id: 4,
    name: 'Dr. Michael Chen',
    specialty: 'Pediatrician',
    experience: 18,
    rating: 4.9,
    reviews: 278,
    available: true,
    nextAvailable: null,
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    description: "Dedicated to children's health and development."
  },
  {
    id: 5,
    name: 'Dr. Lisa Anderson',
    specialty: 'Neurologist',
    experience: 16,
    rating: 4.8,
    reviews: 145,
    available: false,
    nextAvailable: '3:30 PM',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    description: 'Expert in neurological disorders and treatments.'
  },
  {
    id: 6,
    name: 'Dr. Robert Taylor',
    specialty: 'Orthopedist',
    experience: 22,
    rating: 4.9,
    reviews: 198,
    available: true,
    nextAvailable: null,
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    description: 'Specialized in bone and joint conditions.'
  }
];

const filteredDoctors = computed(() => {
  return doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesSpecialty = !selectedSpecialty.value || doctor.specialty === selectedSpecialty.value;
    return matchesSearch && matchesSpecialty;
  });
});

const selectDoctor = (doctor) => {
  selectedDoctor.value = doctor;
};

const confirmSelection = () => {
  emit('select', selectedDoctor.value);
};
</script>

<style scoped>
.doctor-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.doctor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.doctor-avatar {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.doctor-info {
  padding: 1.5rem;
}

.availability {
  display: inline-block;
  margin-top: 0.5rem;
}

/* Animation for selection */
.doctor-card {
  position: relative;
}

.doctor-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.doctor-card:hover::after {
  transform: translateX(100%);
}
</style> 