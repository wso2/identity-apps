export interface SubAttribute {
    attribute_id: string;
    attribute_name: string;
}

export interface CanonicalValue {
    value: string;
    label?: string;
}

export interface ProfileAttribute {
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