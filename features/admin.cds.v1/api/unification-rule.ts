export const fetchRules = async (permaId) => {
    try {
        const response = await axios.get(`${CDM_BASE_URL}/unification-rules`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user details for ${permaId}:`, error);
        return null;
    }
};