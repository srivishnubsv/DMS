import { auth } from "../firebase";

const API_URL = "http://localhost:5000/api";

export const saveSurvey = async (surveyData) => {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(`${API_URL}/surveys/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(surveyData),
    });

    if (!response.ok) {
      throw new Error("Failed to save survey");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving survey:", error);
    throw error;
  }
};
