/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com).
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
 * Consent Model
 */
export interface ConsentInterface {
    consentReceiptID: string;
    language: string;
    piiPrincipalId: string;
    spDescription: string;
    spDisplayName: string;
    state: ConsentState;
    tenantDomain: string;
    consentReceipt?: ConsentReceiptInterface;
}

/**
 * ConsentReceipt Model
 */
export interface ConsentReceiptInterface {
    jurisdiction: string;
    language: string;
    policyUrl: string;
    collectionMethod: string;
    services: ServiceInterface[];
    version: string;
}

/**
 * Service Model
 */
export interface ServiceInterface {
    purposes: PurposeInterface[];
    service: string;
    serviceDescription: string;
    serviceDisplayName: string;
    tenantDomain: string;
}

/**
 * This is the Purpose Model nested in the {@link ServiceInterface}
 * Don't get confused this with the {@link PurposeModel}
 *
 * @see ServiceInterface
 */
export interface PurposeInterface {
    consentType: string;
    purpose: string;
    purposeId: number;
    piiCategory: PIICategory[];
    primaryPurpose: boolean;
    termination: string;
    thirdPartyDisclosure: boolean;
    thirdPartyName: string;
    /**
     * This property contains all the PII categories of
     * this Purpose. {@link piiCategory} has the accepted
     * PII claims. But this contains both accepted/denied
     * claims.
     */
    allPIICategories?: PurposeModelPIICategory[];
    /**
     * This property contains the description value which
     * is fetched via the Purpose detail endpoint.
     *
     * @see attachReceiptPurposeDetails function in {@link Consents}
     */
    description?: string;
}

/**
 * This interface describes the type definitions that gets
 * from the API response.
 *
 * @see PurposeModelPIICategory
 */
export interface PurposeModel {
    description: string;
    group: string;
    groupType: string;
    piiCategories: PurposeModelPIICategory[];
    purpose: string;
    purposeId: number;
}

/**
 * This is a structural model nested inside the {@link PurposeModel}
 *
 * @see PurposeModel
 */
export interface PurposeModelPIICategory {
    description: string;
    displayName: string;
    mandatory: boolean;
    piiCategory: string;
    piiCategoryId: number;
    sensitive: boolean;
}

/**
 * This model is a partial structure sent by our API.
 * The only difference between this and {@link PurposeModel} is
 * that this does not contain the {@link PurposeModel.piiCategories}
 * list.
 *
 * For more information, see {@link "/apidocs/Consent-management-apis/#!/operations#Purpose#consentsPurposesGet"}.
 *
 * @see fetchAllPurposes for usages.
 */

export interface PurposeModelPartial {
    description: string;
    group: string;
    groupType: string;
    purpose: string;
    purposeId: number;
}

/**
 * PII category mapping model in the UI.
 */
export interface PIICategoryClaimToggleItem {
    piiCategoryId?: number;
    purposeId?: number;
    receiptId?: string;
    status?: PIICategoryStatus;
}

/**
 * PIICategory Model
 */
export interface PIICategory {
    piiCategoryDisplayName: string;
    piiCategoryId: number;
    piiCategoryName: string;
    validity: string;
}

export interface PIICategoryWithStatus extends PIICategory {
    status: PIICategoryStatus;
}

type PIICategoryStatus = "accepted" | "denied";

/**
 * This model will be used map the payload of the
 * receipt update API request.
 */
export interface UpdateReceiptInterface {
    collectionMethod: string;
    jurisdiction: string;
    language: string;
    policyURL: string;
    services: UpdateReceiptServiceInterface[];
}

/**
 * Service model to be used in the update receipt model.
 */
interface UpdateReceiptServiceInterface {
    purposes: UpdateReceiptPurposeInterface[];
    service: string;
    serviceDescription: string;
    serviceDisplayName: string;
    tenantDomain: string;
}

/**
 * Purpose modal to be used in the update receipt model.
 */
interface UpdateReceiptPurposeInterface {
    consentType: string;
    piiCategory: UpdateReceiptPIICategoryInterface[];
    primaryPurpose: boolean;
    purposeCategoryId: number[];
    purposeId: number;
    termination: string;
    thirdPartyDisclosure: boolean;
    thirdPartyName: string;
}

/**
 * PII Category modal to be used in the update receipt model.
 */
interface UpdateReceiptPIICategoryInterface {
    piiCategoryId: number;
    validity: string;
}

/**
 * Types of consent states.
 */
export enum ConsentState {
    ACTIVE = "ACTIVE"
}

/**
 * Summary of a user consent record returned from GET /consents list.
 */
export interface PolicyConsentSummaryInterface {
    id: string;
    serviceId: string;
    state: string;
    subjectId: string;
    timestamp: number;
    validityTime: number | null;
}

/**
 * Paginated list response for user consent records.
 */
export interface PolicyConsentListResponseInterface {
    Consents: PolicyConsentSummaryInterface[];
    links?: Array<{ rel: "next" | "previous"; href: string }>;
    totalResults: number;
}

/**
 * A data element within a consented purpose.
 */
interface ConsentedElementInterface {
    displayName: string;
    id: string;
    name: string;
}

/**
 * A purpose within a full user consent record.
 */
export interface ConsentedPurposeInterface {
    elements: ConsentedElementInterface[];
    id: string;
    name: string;
    properties?: {
        policyUrl?: string;
        promptOnLogin?: string;
    };
    purposeVersionId?: string;
    type?: string;
    version: string | null;
    versionId?: string;
}

/**
 * Full user consent record returned from GET /consents/{consentId}.
 */
export interface PolicyConsentDetailInterface {
    id: string;
    language: string;
    properties?: Record<string, string>;
    purposes: ConsentedPurposeInterface[];
    serviceId: string;
    state: string;
    subjectId: string;
    timestamp: number;
    validityTime: number | null;
}

/**
 * UI-level flat item representing a single policy a user has consented to.
 */
export interface PolicyConsentItemInterface {
    consentId: string;
    policyUrl: string | null;
    purposeId: string;
    purposeName: string;
    purposeVersionId: string;
    state: string;
    timestamp: number;
    version: string | null;
}

export interface PreferenceManagementElementInterface {
    displayName: string;
    id: string;
    name: string;
}

export interface PreferenceManagementItemInterface extends PolicyConsentItemInterface {
    elements: PreferenceManagementElementInterface[];
    language: string;
    purposeDescription?: string;
    serviceId: string;
}

