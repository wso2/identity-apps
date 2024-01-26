/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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
    enableDefaultPreLoader: true,
    header: {
        organization: "{{productName}}",
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
    showOrganizationManagedBy: false,
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
