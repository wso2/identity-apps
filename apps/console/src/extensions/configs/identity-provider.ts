/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentityProviderConfig } from "./models";
import { IdentityProviderManagementConstants } from "../../features/identity-providers";

export const identityProviderConfig: IdentityProviderConfig = {
    editIdentityProvider: {
        showAdvancedSettings: true,
        showJitProvisioning: true,
        showOutboundProvisioning: true
    },
    generalDetailsForm: {
        showCertificate: true
    },
    templates: {
        enterprise: true,
        facebook: false,
        github: false,
        google: true
    },
    utils: {
        isAuthenticatorAllowed: (name: string): boolean => {
            return [
                IdentityProviderManagementConstants.BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR,
                IdentityProviderManagementConstants.OAUTH_REQUEST_PATH_AUTHENTICATOR,
                IdentityProviderManagementConstants.X509_AUTHENTICATOR,
                IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR
            ].includes(name);
        }
    }
};
