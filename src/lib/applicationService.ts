import axios from 'axios';
import BASE_URL from "../api"; // ✅ ADD THIS

// Base API URL
const API_URL = `${BASE_URL}/api/applications`; // ✅ FIX

// Types (optional but recommended)
export interface ApplicationData {
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  serviceType: string;
  serviceId: string;
  status: string;
  priority: 'normal' | 'urgent';
  details: Record<string, string>;
}

// Create new application
export const createApplication = async (data: ApplicationData) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating application:', error);
    throw error;
  }
};

// Get applications of a specific user
export const getMyApplications = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/applications", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }

  return res.json();
};