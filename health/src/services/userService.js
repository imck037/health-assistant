import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const userService = {
  // Get user profile data
  async getUserProfile() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Cache the profile data
      localStorage.setItem('userProfile', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      // If API call fails, try to get cached profile
      const cachedProfile = localStorage.getItem('userProfile');
      if (cachedProfile) {
        return JSON.parse(cachedProfile);
      }
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(profileData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/user/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update cached profile data
      localStorage.setItem('userProfile', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Get signup data from localStorage
  getSignupData() {
    const signupData = localStorage.getItem('signupData');
    return signupData ? JSON.parse(signupData) : null;
  },

  // Save signup data to localStorage
  saveSignupData: (data) => {
    try {
      // Create a plain object with only the necessary data
      const signupData = {
        name: data.name,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        signupType: data.signupType,
        verificationType: data.verificationType
      }
      localStorage.setItem('signupData', JSON.stringify(signupData))
    } catch (error) {
      console.error('Error saving signup data:', error)
    }
  },

  // Clear signup data
  clearSignupData() {
    localStorage.removeItem('signupData');
  },

  // Clear all user data (for logout)
  clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('signupData');
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  // Get cached profile data
  getCachedProfile() {
    const cachedProfile = localStorage.getItem('userProfile');
    return cachedProfile ? JSON.parse(cachedProfile) : null;
  }
}; 