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
        userSchema: "urn:ietf:params:scim:schemas:core:2.0:User"
    },

    scimEnterpriseUserClaimUri: {
        accountDisabled: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.accountDisabled",
        accountLocked: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.accountLocked",
        askPassword: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.askPassword",
        isReadOnlyUser: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.isReadOnlyUser",
        oneTimePassword: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.oneTimePassword",
        profileUrl: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.profileUrl"
    }
};
