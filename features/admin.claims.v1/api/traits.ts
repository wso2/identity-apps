import axios from "axios";

export const getTraits = async (): Promise<Trait[]> => {
    const response = await axios.get("http://localhost:8900/api/v1/profile-schema/traits");
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
