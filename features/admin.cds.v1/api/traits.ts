import axios from "axios";
import { CDM_BASE_URL } from "../models/constants";

export const getTraits = async (): Promise<Trait[]> => {
    const url = `${CDM_BASE_URL}/profile-schema/traits`;
    const response = await axios.get(url);
    return response.data;
};

export interface SubAttribute {
    attribute_id: string;
    attribute_name: string;
}

export interface CanonicalValue {
    value: string;
    label?: string;
}
export interface Trait {
    attribute_id: string;
    attribute_name: string;
    description?: string;
    value_type: string;
    merge_strategy?: string;
    multi_valued?: boolean;
    mutability?: string;
    sub_attributes?: SubAttribute[];
    canonical_values?: CanonicalValue[];
}
