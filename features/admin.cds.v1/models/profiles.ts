/**
 * API response: list profiles with pagination.
 */
export interface ProfileListAPIResponse {
    pagination: Pagination;
    profiles: ProfileListItem[]; // matches json:"profiles"
  }
  
  /**
   * Pagination model (adjust fields to exactly match your backend pagination struct).
   */
  export interface Pagination {
    count: number;
    page_size: number;
    next_cursor?: string | null;
    previous_cursor?: string | null;
  }
  
  /**
   * One profile row in the list.
   * Matches ProfileListResponse json tags (converted to camelCase).
   */
  export interface ProfileListItem {
    profileId: string;
    userId?: string | null;
  
    meta: Meta;
  
    identityAttributes?: Record<string, unknown>;
    traits?: Record<string, unknown>;
  
    /**
     * backend: map[string]map[string]interface{}
     * appName -> { key: value }
     */
    applicationData?: Record<string, Record<string, unknown>>;
  
    mergedFrom?: ProfileReference[]; // backend has merged_from
    // If your API actually returns merged_to, add it too:
    mergedTo?: ProfileReference[];
  }
  
  export interface Meta {
    created_at: string;
    updated_at: string;
    location: string;
  }
  
  export interface ProfileReference {
    profileId: string;
    mergedReason: string;
  }
  
  /**
 * API response for a single profile
 * Mirrors Go: ProfileResponse
 */
export interface ProfileModel {
    profileId: string;
    userId?: string | null;
  
    meta: Meta;
  
    identityAttributes?: Record<string, unknown>;
    traits?: Record<string, unknown>;
  
    /**
     * map[string]map[string]interface{}
     * appName -> { key: value }
     */
    applicationData?: Record<string, Record<string, unknown>>;
  
    /**
     * Pointer in Go (*Reference) -> optional or null
     */
    mergedTo?: ProfileReference | null;
  
    /**
     * Slice in Go ([]Reference) -> optional array
     */
    mergedFrom?: ProfileReference[];
  }
  