/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Status of the My Account portal.
 */
export interface MyAccountPortalStatusInterface {
    key?: string;
    value?: string;
}

export interface MyAccountDataInterface {
    attributes?: MyAccountPortalStatusInterface[];
    created?: string;
    files?: [];
    lastModified?: string;
    resourceId?: string;
    resourceName?: string;
    resourceType?: string;
    tenantDomain?: string;
}

export interface MyAccountFormInterface {
    emailOtpEnabled: boolean;
    smsOtpEnabled: boolean;
    totpEnabled: boolean;
    backupCodeEnabled: boolean;
    totpEnrollmentEnabled: boolean;
}

export interface TotpConfigPortalStatusInterface {
    key?: string;
    value?: string;
}

export interface TotpConfigInterface {
    attributes: {
        key: string;
        value: boolean;
    }[];
    name: string;
}

export interface MyAccountConfigInterface {
    attributes: {
        key: string;
       value: boolean;
    }[];
    name: string;
}

export interface NotificationSenderProperty {
    key: string;
    value: string;
}
