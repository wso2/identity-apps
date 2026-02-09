/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Profiles list response from CDS.
 * Cursor pagination: count is per-page returned count (NOT total).
 */
export interface ProfilesListResponse {
  pagination: ProfilesPagination;
  profiles: ProfileListItem[];
}

export interface ProfilesPagination {
  count: number;                 // returned count for this page
  page_size: number;             // requested page size (echo) or server cap
  next_cursor?: string | null;
  previous_cursor?: string | null;
}

export interface ProfileListItem {
  profile_id: string;
  user_id?: string | null;

  meta: {
      created_at: string;
      updated_at: string;
      location: string;
  };

  identity_attributes?: Record<string, any>;
  traits?: Record<string, any>;

  application_data?: Record<string, Record<string, unknown>>;

  merged_from?: Array<{
      profile_id: string;
      reason: string;
  }>;
}

export type ProfileModel = ProfileListItem;
