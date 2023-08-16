/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CommonConfig } from "./models";
import { ProfileSchema } from "../../models";
import { UserstoreConstants } from "../userstores/userstore-constants";

export const commonConfig: CommonConfig = {
    accountSecurityPage: {
        accountRecovery: {
            emailRecovery: {
                enableEditEmail: false
            }
        },
        mfa: {
            fido2: {
                allowLegacyKeyRegistration: false
            },
            totp: {
                regenerateWarning: "myAccount:components.mfa.authenticatorApp.modals.scan.regenerateWarning.generic",
                showRegenerateConfirmation: false
            }
        }
    },
    advancedSearchWithBasicFilters: {
        enableQuerySearch: false
    },
    header: {
        organization: "Asgardeo",
        renderAppSwitcherAsDropdown: false
    },
    nonLocalCredentialUser: {
        enableNonLocalCredentialUserView: true
    },
    overviewPage: {
        enableAlternateWidgetLayout: true
    },
    personalInfoPage: {
        externalLogins: {
            disableExternalLoginsOnEmpty: true
        }
    },
    userProfilePage: {
        showEmail: true
    },
    utils: {
        isConsoleNavigationAllowed(userstore: string): boolean {
            if (userstore === UserstoreConstants.ASGARDEO_USERSTORE) {
                return true;
            }

            return false;
        },
        isFIDOEnabled(userstore: string): boolean {
            if (userstore === UserstoreConstants.ASGARDEO_USERSTORE) {
                return false;
            }

            return true;
        },
        isManageConsentAllowedForUser(userstore: string): boolean {
            if (userstore === UserstoreConstants.ASGARDEO_USERSTORE) {
                return false;
            }

            return true;
        },
        isSchemaNameSkippableforProfileCompletion(schema: ProfileSchema): boolean {
            return schema.displayName === "Role" || schema.displayName === "Local Credential Exists" 
                || schema.displayName === "Username";
        },
        isShowAdditionalWidgetAllowed(userstore: string): boolean {
            if (userstore === UserstoreConstants.ASGARDEO_USERSTORE) {
                return false;
            }

            return true;
        }
    }
};
