import axios from "axios";
import {CDM_BASE_URL} from "../models/constants";


export const fetchProfiles = async (query = "") => {
    const url = query
        ? `${CDM_BASE_URL}/profiles?${query}`
        : `${CDM_BASE_URL}`;

    const res = await axios.get(url);
    return res.data;
};

export const fetchUserDetails = async (permaId) => {
    try {
        const response = await axios.get(`${CDM_BASE_URL}/profiles/${permaId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user details for ${permaId}:`, error);
        return null;
    }
};

export const fetchRules = async (permaId) => {
    try {
        const response = await axios.get(`${CDM_BASE_URL}/unification-rules`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user details for ${permaId}:`, error);
        return null;
    }
};

export const deleteUserProfile = async (permaId) => {

    try {
    const response = await axios.delete(`${CDM_BASE_URL}/profiles/${permaId}`);
    } catch (error) {
        throw new Error("Failed to delete user profile");
    }
};
