import axios from "axios";
import { CDM_BASE_URL } from "../models/constants";

export const getTraits = async (): Promise<Trait[]> => {
    const url = `${CDM_BASE_URL}/profile-schema/traits`;
    const response = await axios.get(url);
    return response.data;
};

