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
 * The high level sharing mode selected in the Shared Access tab.
 */
export enum IdPShareType {
    /**
     * The identity provider is not shared with any organization.
     */
    UNSHARE = "unshare",
    /**
     * The identity provider is shared with all existing and future organizations.
     */
    SHARE_ALL = "shareAll",
    /**
     * The identity provider is shared with a selected set of organizations.
     */
    SHARE_SELECTED = "shareSelected"
}

/**
 * Sharing policies supported by the identity provider sharing APIs.
 *
 * Unlike application/user sharing, identity provider sharing does not support role sharing.
 */
export enum IdPSharingPolicy {
    /**
     * Share with all existing and future organizations. Used by the `share-with-all` API.
     */
    ALL_EXISTING_AND_FUTURE_ORGS = "ALL_EXISTING_AND_FUTURE_ORGS",
    /**
     * Share with the selected organization only.
     */
    SELECTED_ORG_ONLY = "SELECTED_ORG_ONLY",
    /**
     * Share with the selected organization and all its existing and future child organizations.
     */
    SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN = "SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN"
}

/**
 * Request payload for sharing an identity provider with all organizations.
 * POST `identity-providers/share-with-all`
 */
export interface ShareIdPWithAllOrganizationsPayloadInterface {
    identityProviderId: string;
    policy: IdPSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS;
}

/**
 * A single organization entry in the selective share payload.
 */
export interface IdPSelectiveShareOrganizationInterface {
    orgId: string;
    policy: IdPSharingPolicy.SELECTED_ORG_ONLY | IdPSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN;
}

/**
 * Request payload for sharing an identity provider with selected organizations.
 * POST `identity-providers/share`
 */
export interface ShareIdPWithSelectedOrganizationsPayloadInterface {
    identityProviderId: string;
    organizations: IdPSelectiveShareOrganizationInterface[];
}

/**
 * Request payload for unsharing an identity provider from selected organizations.
 * POST `identity-providers/unshare`
 */
export interface UnshareIdPFromSelectedOrganizationsPayloadInterface {
    identityProviderId: string;
    orgIds: string[];
}

/**
 * Request payload for unsharing an identity provider from all organizations.
 * POST `identity-providers/unshare-with-all`
 */
export interface UnshareIdPWithAllOrganizationsPayloadInterface {
    identityProviderId: string;
}
