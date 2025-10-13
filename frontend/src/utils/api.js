// Utility functions for API calls
import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "https://ruzmovie-6.onrender.com/api/v1",
});
/**
 * Fetch all videos
 * @returns {Promise<Array>} Array of video objects
 */
export const fetchVideos = async () => {
  try {
    const response = await api.get("/v1/videos");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

/**
 * Fetch a single video by ID
 * @param {string} id - Video ID
 * @returns {Promise<Object>} Video object
 */
export const fetchVideo = async (id) => {
  try {
    const response = await api.get(`/v1/videos/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching video ${id}:`, error);
    throw error;
  }
};

/**
 * Search videos by term
 * @param {string} searchTerm - Term to search for
 * @returns {Promise<Array>} Array of matching video objects
 */
export const searchVideos = async (searchTerm) => {
  try {
    const response = await api.get(
      `/v1/videos/search?searchterm=${encodeURIComponent(searchTerm)}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error searching videos for "${searchTerm}":`, error);
    throw error;
  }
};

export default api;
