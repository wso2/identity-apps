/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
 * Represents a tenant.
 */
export interface Tenant<T = TenantOwner> {
    /**
     * The unique identifier of the tenant.
     */
    id: string;
    /**
     * The domain of the tenant.
     */
    domain: string;
    /**
     * The owners of the tenant.
     */
    owners: T[];
    /**
     * The date when the tenant was created.
     */
    createdDate: string;
    /**
     * The lifecycle status of the tenant.
     */
    lifecycleStatus: TenantLifecycleStatus;
}

/**
 * Ways to configure the password of a tenant.
 */
export enum TenantStatus {
    /**
     * A valid password should be sent in the request body
     */
    INLINE_PASSWORD = "inline-password",
    /**
     * An email link will be sent to the given email address to set the password.
     */
    INVITE_VIA_EMAIL = "invite-via-email"
}

/**
 * Represents a request payload to add a tenant.
 */
export type AddTenantRequestPayload = Pick<Tenant<Omit<TenantOwner, "id"> & {
    /**
     * The provisioning method of the tenant.
     */
    provisioningMethod: TenantStatus;
    /**
     * Additional claims to be added to the tenant.
     */
    additionalClaims?: {
        /**
         * Claim URI. ex: http://wso2.org/claims/telephone
         */
        claim: string;
        /**
         * Value of the claim.
         */
        value: string;
    }[];
}>, "domain" | "owners">;

/**
 * Represents an owner of a tenant.
 */
export interface TenantOwner {
    /**
     * The unique identifier of the owner.
     */
    id: string;
    /**
     * The username of the owner.
     */
    username: string;
    /**
     * The password of the owner.
     */
    password?: string;
    /**
     * The email of the owner.
     */
    email: string;
    /**
     * The first name of the owner.
     */
    firstname: string;
    /**
     * The last name of the owner.
     */
    lastname: string;
    /**
     * Set of additional user details.
     */
    additionalClaims?: {
        claim: string;
        value: string;
    }[];
}

/**
 * Represents the lifecycle status of a tenant.
 */
export interface TenantLifecycleStatus {
    /**
     * Indicates whether the tenant is activated.
     */
    activated: boolean;
}

/**
 * Represents a tenant response.
 */
export interface TenantListResponse {
    /**
     * The total number of results.
     */
    totalResults: number;
    /**
     * The index of the first result.
     */
    startIndex: number;
    /**
     * The number of results.
     */
    count: number;
    /**
     * The links.
     */
    links: {
        href: string;
        rel: "next" | "previous"
    }[];
    /**
     * The tenants list.
     */
    tenants: Tenant[];
}
