/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
 * @desc Structural Model
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
 * @desc Structural Model
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
 * This model is a partial structure which sent by our API
 * The only difference of this and {@link PurposeModel} is
 * that this does not contain the {@link PurposeModelPIICategory[]}
 * list.
 *
 * @link /apidocs/Consent-management-apis/#!/operations#Purpose#consentsPurposesGet
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

export type PIICategoryStatus = "accepted" | "denied";

/**
 * PIICategory Model
 */
export const creatPIICategory = (): PIICategory => ({
    piiCategoryDisplayName: "",
    piiCategoryId: 0,
    piiCategoryName: "",
    validity: ""
});

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
 * Creates an empty consent receipt object. This can be used to initialize
 * a consent receipt in the state.
 * @return {ConsentReceiptInterface}  an empty consent receipt object.
 */
export const createEmptyConsentReceipt = (): ConsentReceiptInterface => ({
    collectionMethod: "",
    jurisdiction: "",
    language: "",
    policyUrl: "",
    services: [
        {
            purposes: [
                {
                    consentType: "",
                    piiCategory: [
                        {
                            piiCategoryDisplayName: "",
                            piiCategoryId: 0,
                            piiCategoryName: "",
                            validity: ""
                        }
                    ],
                    primaryPurpose: false,
                    purpose: "",
                    purposeId: 0,
                    termination: "",
                    thirdPartyDisclosure: false,
                    thirdPartyName: ""
                }
            ],
            service: "",
            serviceDescription: "",
            serviceDisplayName: "",
            tenantDomain: ""
        }
    ],
    version: ""
});

/**
 * Creates an empty consent object. This can be used to initialize
 * a consent in the state.
 * @return {ConsentInterface} an empty consent object.
 */
export const createEmptyConsent = (): ConsentInterface => ({
    consentReceipt: createEmptyConsentReceipt(),
    consentReceiptID: "",
    language: "",
    piiPrincipalId: "",
    spDescription: "",
    spDisplayName: "",
    state: ConsentState.ACTIVE,
    tenantDomain: ""
});
