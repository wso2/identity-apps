/**
 * Model for a customer profile.
 */

export interface ProfileModel {
    profile_id: string;
    user_id: string;
    meta: MetaData;
    traits: Traits;
    identity_attributes: Record<string, any>;
    application_data: ApplicationDataItem[];
    merged_to?: MergeReference;
    merged_from?: MergeReference;
}

// Metadata like timestamps and location
export interface MetaData {
    created_at: number; // Unix timestamp
    updated_at: number;
    location: string;
}

// Structured trait group
export interface Traits {
    [key: string]: any;
}

// Represents merged references
export interface MergeReference {
    reference_profile_id: string;
    reference_reason: string;
}

// Single application block in application_data array
export interface ApplicationDataItem {
    application_id: string;
    attributes: Record<string, any>;
}
