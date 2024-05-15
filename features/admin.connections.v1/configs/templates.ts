/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import keyBy from "lodash-es/keyBy";
import values from "lodash-es/values";
import { AppConfigs } from "../../admin.core.v1/configs/app-configs";
import DefaultConnectionTemplateCategory from "../meta/templates-meta/categories/default.json";
import EnterpriseConnetionTemplateGroup from "../meta/templates-meta/groups/enterprise.json";
import { ConnectionTemplatesConfigInterface } from "../models/connection";

export const getConnectionTemplatesConfig = (): ConnectionTemplatesConfigInterface => {

    return {
        categories: values(
            keyBy(
                [
                    {
                        enabled: true,
                        id: DefaultConnectionTemplateCategory.id,
                        resource: DefaultConnectionTemplateCategory
                    }
                ],
                "id"
            )
        ),
        groups: values(
            keyBy(
                [
                    {
                        enabled: EnterpriseConnetionTemplateGroup.enabled,
                        id: EnterpriseConnetionTemplateGroup.id,
                        resource: EnterpriseConnetionTemplateGroup
                    }
                ],
                "id"
            )
        ),
        templates: [
            {
                content: {
                    quickStart: "./identity-provider-templates/templates/google/quick-start.tsx"
                },
                enabled: AppConfigs.getAppUtils().getConfig().ui.identityProviderTemplates?.google?.enabled ?? true,
                id: "google-idp",
                resource: "./identity-provider-templates/templates/google/google.json"
            },
            {
                content: {
                    quickStart: "./identity-provider-templates/templates/github/quick-start.tsx"
                },
                enabled: AppConfigs.getAppUtils().getConfig().ui.identityProviderTemplates?.github?.enabled ?? true,
                id: "github-idp",
                resource: "./identity-provider-templates/templates/github/github.json"
            },
            {
                content: {
                    quickStart: "./identity-provider-templates/templates/facebook/quick-start.tsx"
                },
                enabled: AppConfigs.getAppUtils().getConfig().ui.identityProviderTemplates?.facebook?.enabled ?? true,
                id: "facebook-idp",
                resource: "./identity-provider-templates/templates/facebook/facebook.json"
            },
            {
                content: {},
                enabled: AppConfigs.getAppUtils().getConfig().ui.identityProviderTemplates?.
                    enterpriseOIDC?.enabled ?? true,
                id: "enterprise-oidc-idp",
                resource: "./identity-provider-templates/templates/oidc/oidc.json"
            },
            {
                content: {},
                enabled: AppConfigs.getAppUtils().getConfig().ui.identityProviderTemplates?.
                    enterpriseSAML?.enabled ?? true,
                id: "enterprise-saml-idp",
                resource: "./identity-provider-templates/templates/saml/saml.json"
            },
            {
                content: {
                    quickStart: "./identity-provider-templates/templates/microsoft/quick-start.tsx"
                },
                enabled: AppConfigs.getAppUtils().getConfig().ui.identityProviderTemplates?.microsoft?.enabled ?? true,
                id: "microsoft-idp",
                resource: "./identity-provider-templates/templates/microsoft/microsoft.json"
            },
            {
                content: {},
                enabled: AppConfigs.getAppUtils().getConfig().ui.identityProviderTemplates?.linkedin?.enabled ?? true,
                id: "linkedin-idp",
                resource: "./identity-provider-templates/templates/linkedin/linkedin.json"
            },
            {
                content: {
                    quickStart: "./identity-provider-templates/templates/apple/quick-start.tsx"
                },
                enabled: AppConfigs.getAppUtils().getConfig().ui.identityProviderTemplates?.apple?.enabled ?? true,
                id: "apple-idp",
                resource: "./identity-provider-templates/templates/apple/apple.json"
            },
            {
                content: {
                    quickStart: "./identity-provider-templates/templates/hypr/quick-start.tsx"
                },
                enabled: AppConfigs.getAppUtils().getConfig().ui.identityProviderTemplates?.hypr?.enabled ?? true,
                id: "hypr-idp",
                resource: "./identity-provider-templates/templates/hypr/hypr.json"
            },
            {
                content: {
                    quickStart: "./identity-provider-templates/templates/swe/quick-start.tsx",
                    wizardHelp: "./identity-provider-templates/templates/swe/create-wizard-help.tsx"
                },
                enabled: AppConfigs.getAppUtils().getConfig().ui.identityProviderTemplates?.swe?.enabled ?? true,
                id: "swe-idp",
                resource: "./identity-provider-templates/templates/swe/swe.json"
            }
        ]
    };
};
