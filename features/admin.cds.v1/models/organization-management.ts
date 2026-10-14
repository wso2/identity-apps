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
 * Origin of a profile attribute or a unification rule in an organization.
 * OWNED: the organization owns it. SHARED: an ancestor organization shares it. INHERITED: a child
 * organization inherits the identity attribute from its root organization.
 */
export type ResourceOrigin = "OWNED" | "SHARED" | "INHERITED";

/**
 * State of a shared unification rule in the current organization.
 */
export type ShareStateValue = "ACTIVE" | "CONFLICTED" | "INACTIVE_MISSING_ATTRIBUTE";

/**
 * Why a shared unification rule is not active in the current organization.
 */
export type ShareStateReason =
    | "LOCAL_NAME_CONFLICT"
    | "SHARED_NAME_CONFLICT"
    | "MISSING_ATTRIBUTE";

/**
 * The decision of a share policy or of the organization access. "all" reaches all organizations
 * below the initiating organization, also the ones created later. "selected" reaches the
 * organizations in orgs.
 */
export type ChildOrgsMode = "all" | "selected";

/**
 * The reach of a selected organization: the organization only, or the organization and all
 * organizations below it, also the ones created later.
 */
export type ChildOrgReach = "org" | "subtree";

/**
 * A selected organization, with its reach.
 */
export interface ChildOrg {
    org_id: string;
    reach: ChildOrgReach;
}

/**
 * The organizations that a share policy or the organization access reaches.
 */
export interface ChildOrgs {
    mode: ChildOrgsMode;
    orgs?: ChildOrg[];
}

export interface SharePolicyRequest {
    child_orgs: ChildOrgs;
}

/**
 * A share policy of a profile attribute or a unification rule.
 */
export interface SharePolicy {
    id: string;
    resource_type: "SCHEMA_ATTRIBUTE" | "UNIFICATION_RULE";
    resource_id: string;
    owning_org_id: string;
    initiating_org_id: string;
    child_orgs: ChildOrgs;
}


export interface SharePolicyList {
    total_results: number;
    policies: SharePolicy[];
}

/**
 * The organization access of a root organization: the organizations that can use CDS.
 */
export interface OrgAccessPolicy {
    id: string;
    owning_org_id: string;
    initiating_org_id: string;
    child_orgs: ChildOrgs;
}

export interface OrgAccessPolicyList {
    total_results: number;
    policies: OrgAccessPolicy[];
}

/**
 * The resource that a share policy is for.
 */
export type ShareableResource =
    | { type: "attribute"; scope: string; id: string }
    | { type: "rule"; id: string };

/**
 * State of the organization tree sync of a root organization.
 */
export type TreeSyncState = "NOT_SYNCED" | "SYNCING" | "SYNCED" | "FAILED";

/**
 * GET /organizations/sync-status. last_synced_at is the end of the last sync that completed. The
 * organization access needs it.
 */
export interface TreeSyncStatus {
    state: TreeSyncState;
    started_at?: string;
    finished_at?: string;
    last_synced_at?: string;
    org_count?: number;
    error?: string;
}
