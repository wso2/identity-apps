/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

export interface SCIMConfigInterface {
    custom: string;
    hideCore1Schema: boolean;
    oidc: string;
    scim: {
        core1Schema: string,
        coreSchema: string,
        enterpriseSchema: string,
        userSchema: string
    };
    scimEnterpriseUserClaimUri: {
        accountDisabled: string,
        accountLocked: string,
        askPassword: string,
        isReadOnlyUser: string,
        oneTimePassword: string,
        profileUrl: string
    };
    scimDialectID: {
        customEnterpriseSchema: string,
    };
    serverSupportedClaimsAvailable: string[];
}
