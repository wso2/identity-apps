/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Interface for marketing consent endpoints.
 */
export interface MarketingConsentEndpointsInterface {
    addConsentEndpoint: string;
    getConsentEndpoint: string;
}

/**
 * Enum for consent types.
 */
export enum ConsentTypes {
    MARKETING = "marketing"
}

/**
 * Enum for consent status.
 */
export enum ConsentStatus {
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
    NOT_GIVEN = "NOT_GIVEN"
}

/**
 * Interface for consent response.
 */
export interface ConsentResponseInterface {
    consentType: ConsentTypes;
    status: ConsentStatus;
}
