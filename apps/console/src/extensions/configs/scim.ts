/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { SCIMConfigInterface } from "./models/scim";

/**
 * This configuration is used to overwrite (in asgardeo-app-extension) and pass the,
 * wso2 custom dialect to the Asgardeo.
 */
export const SCIMConfigs: SCIMConfigInterface = {
    custom: "urn:scim:wso2:schema",
    hideCore1Schema: false,
    oidc: "http://wso2.org/oidc/claim",
    scim: {
        core1Schema: "urn:scim:schemas:core:1.0",
        coreSchema: "urn:ietf:params:scim:schemas:core:2.0",
        enterpriseSchema: "urn:scim:wso2:schema",
        userSchema: "urn:ietf:params:scim:schemas:core:2.0:User"
    },
    scimDialectID: {
        customEnterpriseSchema: "dXJuOnNjaW06d3NvMjpzY2hlbWE",
    },
    scimEnterpriseUserClaimUri: {
        accountDisabled: "urn:scim:wso2:schema.accountDisabled",
        accountLocked: "urn:scim:wso2:schema.accountLocked",
        askPassword: "urn:scim:wso2:schema.askPassword",
        isReadOnlyUser: "urn:scim:wso2:schema.isReadOnlyUser",
        oneTimePassword: "urn:scim:wso2:schema.oneTimePassword",
        profileUrl: "urn:scim:wso2:schema.profileUrl"
    },
    serverSupportedClaimsAvailable: [
        "urn:scim:schemas:core:1.0",
        "urn:ietf:params:scim:schemas:core:2.0",
        "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
        "urn:ietf:params:scim:schemas:core:2.0:User"
    ]
};
