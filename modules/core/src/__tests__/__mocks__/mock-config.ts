/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

/* eslint-disable sort-keys */
export const configMock = {
    features: {
        applications: {
            scopes: {
                create: [],
                read: [ "internal_application_mgt_view" ],
                update: [ "internal_application_mgt_update" ],
                delete: [ "internal_application_mgt_delete" ]
            }
        },
        identityProviders: {
            scopes: {
                create: [ "internal_idp_create" ],
                read: [ "internal_idp_view" ],
                update: [ "internal_idp_update" ],
                delete: [ "internal_idp_delete" ]
            },
            disabledFeatures: []
        },
        users: {
            scopes: {
                create: [ "internal_user_mgt_create" ],
                read: [ "internal_user_mgt_list" ],
                update: [ "internal_user_mgt_update" ],
                delete: [ "internal_user_mgt_delete" ]
            },
            disabledFeatures: [ "users.add" ]
        },
        groups: {
            scopes: {
                create: [ "internal_role_mgt_create" ],
                read: [ "internal_role_mgt_view" ],
                update: [ "internal_role_mgt_update" ],
                delete: [ "internal_role_mgt_delete" ]
            },
            disabledFeatures: [ "groups.add", "groups.edit", "groups.edit.generalSettings" ]
        },
        roles: {
            scopes: {
                create: [ "internal_role_mgt_create" ],
                read: [ "internal_role_mgt_view" ],
                update: [ "internal_role_mgt_update" ],
                delete: [ "internal_role_mgt_delete" ]
            },
            disabledFeatures: []
        },
        attributeDialects: {
            scopes: {
                create: [ "internal_claim_meta_create" ],
                read: [ "internal_claim_meta_view" ],
                update: [ "internal_claim_meta_update" ],
                delete: [ "internal_claim_meta_delete" ]
            },
            disabledFeatures: []
        },
        userStores: {
            scopes: {
                create: [ "internal_userstore_create" ],
                read: [ "internal_userstore_view" ],
                update: [ "internal_userstore_update" ],
                delete: [ "internal_userstore_delete" ]
            },
            disabledFeatures: []
        },
        certificates: {
            scopes: {
                create: [ "internal_keystore_update" ],
                read: [ "internal_keystore_view" ],
                update: [ "internal_keystore_update" ],
                delete: [ "internal_keystore_update" ]
            },
            disabledFeatures: []
        },
        generalConfigurations: {
            scopes: {
                create: [ "internal_identity_mgt_create" ],
                read: [ "internal_identity_mgt_view" ],
                update: [ "internal_identity_mgt_update" ],
                delete: [ "internal_identity_mgt_delete" ]
            },
            disabledFeatures: []
        },
        emailTemplates: {
            scopes: {
                create: [ "internal_email_mgt_create" ],
                read: [ "internal_email_mgt_view" ],
                update: [ "internal_email_mgt_update" ],
                delete: [ "internal_email_mgt_delete" ]
            },
            disabledFeatures: []
        }
    }
};
/* eslint-enable sort-keys */
