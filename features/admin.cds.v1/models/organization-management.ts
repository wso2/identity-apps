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
 */
export enum ResourceOrigin {
    /**
     * The organization owns it.
     */
    OWNED = "OWNED",
    /**
     * An ancestor organization shares it.
     */
    SHARED = "SHARED",
    /**
     * A child organization inherits the identity attribute from its root organization.
     */
    INHERITED = "INHERITED"
}

/**
 * The decision of a share policy or of the organization access.
 */
export enum ChildOrganizationsMode {
    /**
     * All organizations below the initiating organization, also the ones created later.
     */
    ALL = "all",
    /**
     * The organizations in orgs.
     */
    SELECTED = "selected"
}

/**
 * The mode of a share settings form or of the organization access form. NONE means no policy.
 */
export enum PolicyFormMode {
    NONE = "none",
    ALL = "all",
    SELECTED = "selected"
}

/**
 * The reach of a selected organization.
 */
export enum ChildOrganizationReach {
    /**
     * The organization only.
     */
    ORGANIZATION = "org",
    /**
     * The organization and all organizations below it, also the ones created later.
     */
    SUBTREE = "subtree"
}

/**
 * A selected organization, with its reach.
 */
export interface ChildOrganizationInterface {
    org_id: string;
    reach: ChildOrganizationReach;
}

/**
 * The organizations that a share policy or the organization access reaches.
 */
export interface ChildOrganizationsInterface {
    mode: ChildOrganizationsMode;
    orgs?: ChildOrganizationInterface[];
}

export interface SharePolicyRequestInterface {
    child_orgs: ChildOrganizationsInterface;
}

/**
 * The type of the resource of a share policy.
 */
enum SharePolicyResourceType {
    SCHEMA_ATTRIBUTE = "SCHEMA_ATTRIBUTE",
    UNIFICATION_RULE = "UNIFICATION_RULE"
}

/**
 * A share policy of a profile attribute or a unification rule.
 */
export interface SharePolicyInterface {
    id: string;
    resource_type: SharePolicyResourceType;
    resource_id: string;
    owning_org_id: string;
    initiating_org_id: string;
    child_orgs: ChildOrganizationsInterface;
}

export interface SharePolicyListInterface {
    total_results: number;
    policies: SharePolicyInterface[];
}

/**
 * The organization access of a root organization: the organizations that can use CDS.
 */
export interface OrganizationAccessPolicyInterface {
    id: string;
    owning_org_id: string;
    initiating_org_id: string;
    child_orgs: ChildOrganizationsInterface;
}

export interface OrganizationAccessPolicyListInterface {
    total_results: number;
    policies: OrganizationAccessPolicyInterface[];
}

/**
 * The type of a resource that can be shared.
 */
export enum ShareableResourceType {
    ATTRIBUTE = "attribute",
    RULE = "rule"
}

/**
 * The resource that a share policy is for.
 */
export type ShareableResource =
    | { type: ShareableResourceType.ATTRIBUTE; scope: string; id: string }
    | { type: ShareableResourceType.RULE; id: string };

/**
 * State of the organization tree sync of a root organization.
 */
export enum TreeSyncState {
    NOT_SYNCED = "NOT_SYNCED",
    SYNCING = "SYNCING",
    SYNCED = "SYNCED",
    FAILED = "FAILED"
}

/**
 * GET /organizations/sync-status. last_synced_at is the end of the last sync that completed. The
 * organization access needs it.
 */
export interface TreeSyncStatusInterface {
    state: TreeSyncState;
    started_at?: string;
    finished_at?: string;
    last_synced_at?: string;
    error?: string;
}
