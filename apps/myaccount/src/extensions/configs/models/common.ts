/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { ProfileSchema } from "../../../models";

export interface CommonConfig {
    advancedSearchWithBasicFilters: {
        enableQuerySearch: boolean;
    };
    header: {
        organization: string;
        /**
         * Should the app switcher be shown as nine dots dropdown.
         */
        renderAppSwitcherAsDropdown: boolean;
    };
    userProfilePage: {
        showEmail: boolean;
    };
    nonLocalCredentialUser: {
        enableNonLocalCredentialUserView: boolean;
    };
    overviewPage: {
        enableAlternateWidgetLayout: boolean;
    };
    accountSecurityPage: {
        accountRecovery: {
            emailRecovery: {
                enableEditEmail: boolean;
            };
        };
        mfa: {
            fido2: {
                allowLegacyKeyRegistration: boolean;
            };
            totp: {
                showRegenerateConfirmation: boolean;
            };
        }
    };
    personalInfoPage: {
        externalLogins: {
            disableExternalLoginsOnEmpty: boolean;
        }
    };
    utils: {
        isManageConsentAllowedForUser: (userstore: string) => boolean;
        isShowAdditionalWidgetAllowed: (userstore: string) => boolean;
        isConsoleNavigationAllowed: (userstore: string) => boolean;
        isSchemaNameSkippableforProfileCompletion: (schema: ProfileSchema) => boolean;
    }
}
