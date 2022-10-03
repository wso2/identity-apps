/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

export const commonConfig: CommonConfig = {
    advancedSearchWithBasicFilters: {
        enableQuerySearch: false
    },
    header: {
        organization: "WSO2",
        renderAppSwitcherAsDropdown: false
    },
    userProfilePage: {
        showEmail: true
    },
    nonLocalCredentialUser: {
        enableNonLocalCredentialUserView: false
    },
    overviewPage: {
        enableAlternateWidgetLayout: false
    },
    accountSecurityPage: {
        accountRecovery: {
            emailRecovery: {
                enableEditEmail: true
            }
        },
        mfa: {
            fido2: {
                allowLegacyKeyRegistration: true
            },
            totp: {
                regenerateWarning: "myAccount:components.mfa.authenticatorApp.modals.scan.regenerateWarning.extended",
                showRegenerateConfirmation: true
            }
        }
    },
    personalInfoPage: {
        externalLogins: {
            disableExternalLoginsOnEmpty: false
        }
    },
    utils: {
        isManageConsentAllowedForUser(): boolean {
            return true;
        },
        isShowAdditionalWidgetAllowed(): boolean {
            return false;
        },
        isConsoleNavigationAllowed(): boolean {
            return true;
        },
        isFIDOEnabled(): boolean {
            return true;
        },
        isSchemaNameSkippableforProfileCompletion(schema: ProfileSchema): boolean {
            return schema.displayName === "Role" || schema.displayName === "Local Credential Exists" ;
        }
    }
};
