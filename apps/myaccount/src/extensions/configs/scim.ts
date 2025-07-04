/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

import { SCIMConfigInterface } from "./models/scim";

/**
 * This configuration is used to overwrite (in asgardeo-app-extension) and pass the,
 * wso2 custom dialect to the Asgardeo.
 */
export const SCIMConfigs: SCIMConfigInterface = {

    oidc: "http://wso2.org/oidc/claim",

    scim: {
        core1Schema: "urn:scim:schemas:core:1.0",
        coreSchema: "urn:ietf:params:scim:schemas:core:2.0",
        customEnterpriseSchema: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
        enterpriseSchema: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
        systemSchema: "urn:scim:wso2:schema",
        userSchema: "urn:ietf:params:scim:schemas:core:2.0:User"
    },

    scimEnterpriseUserClaimUri: {
        accountDisabled: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.accountDisabled",
        accountLocked: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.accountLocked",
        askPassword: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.askPassword",
        isReadOnlyUser: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.isReadOnlyUser",
        oneTimePassword: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.oneTimePassword",
        profileUrl: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.profileUrl"
    },

    /**
     * The non-empty schemas defined here will be specially treated in system profile logic.
     * Refer: https://github.com/wso2/identity-apps/pull/8452
     * Ex: country - show country dropdown in the UI.
     *    emailAddresses - show email addresses in the UI with primary, verified status.
     */
    scimSystemSchema: {
        country: "urn:scim:wso2:schema:country",
        emailAddresses: "urn:scim:wso2:schema:emailAddresses",
        mobileNumbers: "urn:scim:wso2:schema:mobileNumbers"
    },

    /**
     * The non-empty schemas defined here will be specially treated in user profile logic.
     * Refer: https://github.com/wso2/identity-apps/pull/8452
     * Ex: phoneNumbers.mobile
     *    should be submitted as `phoneNumbers: [ { type: "mobile", value: "1234567890" } ]`
     *    instead of `phoneNumbers: { mobile: "1234567890" }`
     * Ex: addresses.home
     *    should be submitted as `addresses: [ { type: "home", formatted: "123 Main St" } ]`
     *    instead of `addresses: { home: "123 Main St" }`
     */
    scimUserSchema: {
        addressesHome: "urn:ietf:params:scim:schemas:core:2.0:User:addresses.home",
        addressesWork: "urn:ietf:params:scim:schemas:core:2.0:User:addresses.work",
        emails: "urn:ietf:params:scim:schemas:core:2.0:User:emails",
        emailsHome: "urn:ietf:params:scim:schemas:core:2.0:User:emails.home",
        emailsOther: "urn:ietf:params:scim:schemas:core:2.0:User:emails.other",
        emailsWork: "urn:ietf:params:scim:schemas:core:2.0:User:emails.work",
        phoneNumbersFax: "urn:ietf:params:scim:schemas:core:2.0:User:phoneNumbers.fax",
        phoneNumbersHome: "urn:ietf:params:scim:schemas:core:2.0:User:phoneNumbers.home",
        phoneNumbersMobile: "urn:ietf:params:scim:schemas:core:2.0:User:phoneNumbers.mobile",
        phoneNumbersOther: "urn:ietf:params:scim:schemas:core:2.0:User:phoneNumbers.other",
        phoneNumbersPager: "urn:ietf:params:scim:schemas:core:2.0:User:phoneNumbers.pager",
        phoneNumbersWork: "urn:ietf:params:scim:schemas:core:2.0:User:phoneNumbers.work"
    }
};
