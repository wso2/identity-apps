import axios from "axios";

const API_BASE_URL = "http://localhost:8900/api/v1";

export const fetchProfiles = async (query = "") => {
    const url = query
        ? `http://localhost:8900/api/v1/profiles?${query}`
        : `http://localhost:8900/api/v1/profiles`;

    const res = await axios.get(url);
    return res.data;
};

export const fetchUserDetails = async (permaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/profiles/${permaId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user details for ${permaId}:`, error);
        return null;
    }
};

export const fetchRules = async (permaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/unification-rules`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user details for ${permaId}:`, error);
        return null;
    }
};

export const deleteUserProfile = async (permaId) => {

    try {
    const response = await axios.delete(`${API_BASE_URL}/profiles/${permaId}`);
    } catch (error) {
        throw new Error("Failed to delete user profile");
    }
};
