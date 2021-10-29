/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { CommonConfig } from "./models";

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
        }
    },
    personalInfoPage: {
        externalLogins: {
            disableExternalLoginsOnEmpty: false
        }
    },
    utils: {
        isManageConsentAllowedForUser(userstore: string): boolean {
            return true;
        },
        isShowAdditionalWidgetAllowed(userstore: string): boolean {
            return false;
        },
        isConsoleNavigationAllowed(userstore: string): boolean {
            return true;
        }
    }
};
