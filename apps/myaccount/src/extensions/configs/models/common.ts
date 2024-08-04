/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import { ProfileSchema } from "../../../models";

export interface CommonConfig {
    advancedSearchWithBasicFilters: {
        enableQuerySearch: boolean;
    };
    enableDefaultPreLoader: boolean;
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
            smsRecovery: {
                enableEditMobile: boolean;
            };
        };
        mfa: {
            fido2: {
                allowLegacyKeyRegistration: boolean;
            };
            totp: {
                regenerateWarning: string;
                showRegenerateConfirmation: boolean;
            };
        };
    };
    personalInfoPage: {
        externalLogins: {
            disableExternalLoginsOnEmpty: boolean;
        };
    };
    showOrganizationManagedBy: boolean;
    utils: {
        isManageConsentAllowedForUser: (userstore: string) => boolean;
        isShowAdditionalWidgetAllowed: (userstore: string) => boolean;
        isConsoleNavigationAllowed: (userstore: string) => boolean;
        isFIDOEnabled: (userstore: string) => boolean;
        isSchemaNameSkippableforProfileCompletion: (schema: ProfileSchema) => boolean;
    };
}
