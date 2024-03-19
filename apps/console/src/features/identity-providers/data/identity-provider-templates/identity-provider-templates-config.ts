/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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
import merge from "lodash-es/merge";
import values from "lodash-es/values";
import { ComponentType, LazyExoticComponent, ReactElement, lazy } from "react";
import GeneralIdentityProviderTemplateCategory from "./categories/general-identity-provider-template-category.json";
import EnterpriseIdentityProviderTemplateGroup from "./groups/enterprise-idp-template-group.json";
import AppleIDPTemplate from "./templates/apple/apple.json";
import EnterpriseIdentityProviderTemplate
    from "./templates/enterprise-identity-provider/enterprise-identity-provider.json";
import ExpertModeIdentityProviderTemplate from "./templates/expert-mode/expert-mode.json";
import FacebookIDPTemplate from "./templates/facebook/facebook.json";
import GitHubIDPTemplate from "./templates/github/github.json";
import GoogleIDPTemplate from "./templates/google/google.json";
import HYPRIDPTemplate from "./templates/hypr/hypr.json";
import IproovIDPTemplate from "./templates/iproov/iproov.json";
import MicrosoftIDPTemplate from "./templates/microsoft/microsoft.json";
import EnterpriseOIDCIdentityProviderTemplate
    from "./templates/oidc-identity-provider/enterprise-oidc-identity-provider.json";
import OrganizationEnterpriseIDPTemplate from
    "./templates/organization-enterprise-identity-provider/organization-enterprise-identity-provider.json";
import EnterpriseSAMLIdentityProviderTemplate
    from "./templates/saml-identity-provider/enterprise-saml-identity-provider.json";
import { ExtensionsManager, identityProviderConfig } from "../../../../extensions";
import {
    EnterpriseIdentityProviderTemplateExtension
} from "../../../../extensions/configs/identity-providers-templates";
import { AppConstants, store } from "../../../core";
import { IdentityProviderTemplateCategoryInterface, IdentityProviderTemplateGroupInterface } from "../../models";

/**
 * This is used to extend two configurations. Say for example,
 * you override the template from extensions, this will merge
 * the enterprise idp configuration with yours.
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EnterpriseIdentityProviderTemplateExtended: any = {
    ...EnterpriseIdentityProviderTemplate,
    ...EnterpriseIdentityProviderTemplateExtension
};

export interface IdentityProviderTemplatesConfigInterface {
    categories: TemplateConfigInterface<IdentityProviderTemplateCategoryInterface>[];
    groups?: TemplateConfigInterface<IdentityProviderTemplateGroupInterface>[];
    templates: TemplateConfigInterface<any>[];
}

export interface TemplateConfigInterface<T> {
    content?: TemplateContentInterface;
    enabled: boolean;
    comingSoon?: boolean;
    id: string;
    resource?: T | Promise<T> | string;
}

export interface TemplateContentInterface extends StrictTemplateContentInterface {
    [ key: string ]: any;
}

export interface StrictTemplateContentInterface {
    wizardHelp?: LazyExoticComponent<ComponentType<any>> | ReactElement | any;
}

export const getIdentityProviderTemplatesConfig = (): IdentityProviderTemplatesConfigInterface => {

    const extensionsManager: ExtensionsManager = ExtensionsManager.getInstance();

    return {
        categories: values(
            merge(
                keyBy(
                    [
                        {
                            enabled: true,
                            id: GeneralIdentityProviderTemplateCategory.id,
                            resource: GeneralIdentityProviderTemplateCategory
                        }
                    ],
                    "id"
                ),
                identityProviderConfig?.templates?.useTemplateExtensions
                    ? keyBy(extensionsManager.getIdentityProviderTemplatesConfig().categories, "id")
                    : {}
            )
        ),
        groups: values(
            merge(
                keyBy([
                    {
                        enabled: EnterpriseIdentityProviderTemplateGroup.enabled,
                        id: EnterpriseIdentityProviderTemplateGroup.id,
                        resource: EnterpriseIdentityProviderTemplateGroup
                    }
                ], "id"),
                identityProviderConfig?.templates?.useTemplateExtensions
                    ? keyBy(
                        extensionsManager.getIdentityProviderTemplatesConfig().groups,
                        "id"
                    )
                    : {}
            )
        ),
        templates: values(
            merge(
                keyBy(
                    [
                        {
                            content: {
                                wizardHelp: lazy(() => import("./templates/google/create-wizard-help"))
                            },
                            enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.google?.enabled
                                ?? identityProviderConfig.templates.google,
                            id: GoogleIDPTemplate.id,
                            resource: GoogleIDPTemplate
                        },
                        {
                            content: {
                                wizardHelp: lazy(() => import("./templates/facebook/create-wizard-help"))
                            },
                            enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.facebook?.enabled
                                ?? identityProviderConfig.templates.facebook,
                            id: FacebookIDPTemplate.id,
                            resource: FacebookIDPTemplate
                        },
                        {
                            content: {
                                wizardHelp: lazy(() => import("./templates/github/create-wizard-help"))
                            },
                            enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.github?.enabled
                                ?? identityProviderConfig.templates.github,
                            id: GitHubIDPTemplate.id,
                            resource: GitHubIDPTemplate
                        },
                        {
                            content: {
                                wizardHelp: lazy(() => import("./templates/microsoft/create-wizard-help"))
                            },
                            enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.microsoft?.enabled
                                ?? identityProviderConfig.templates.microsoft,
                            id: MicrosoftIDPTemplate.id,
                            resource: MicrosoftIDPTemplate
                        },
                        {
                            content: {
                                wizardHelp: lazy(() => import("./templates/apple/create-wizard-help"))
                            },
                            enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.apple?.enabled
                                ?? identityProviderConfig.templates.apple,
                            id: AppleIDPTemplate.id,
                            resource: AppleIDPTemplate
                        },
                        {
                            content: {
                                wizardHelp: lazy(() => import("./templates/hypr/create-wizard-help"))
                            },
                            enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.hypr?.enabled
                                ?? identityProviderConfig.templates.hypr,
                            id: HYPRIDPTemplate.id,
                            resource: HYPRIDPTemplate
                        },
                        {
                            content: {
                                wizardHelp: lazy(() => import("./templates/iproov/create-wizard-help"))
                            },
                            enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.iproov?.enabled
                                ?? identityProviderConfig.templates.iproov,
                            id: IproovIDPTemplate.id,
                            resource: IproovIDPTemplate
                        },
                        {
                            content: {
                                wizardHelp: lazy(() => import("./templates/" +
                                "organization-enterprise-identity-provider/create-wizard-help"))
                            },
                            enabled:
                                (window[ "AppUtils" ].getConfig().ui
                                    ?.identityProviderTemplates
                                    ?.organizationEnterprise?.enabled ||
                                    identityProviderConfig?.templates
                                        ?.organizationEnterprise) &&
                                (store.getState()?.organization
                                    ?.isFirstLevelOrganization ||
                                    window[ "AppUtils" ].getConfig()
                                        ?.organizationName ||
                                    store.getState()?.auth?.tenantDomain ===
                                    AppConstants.getSuperTenant()),
                            id: OrganizationEnterpriseIDPTemplate.id,
                            resource: OrganizationEnterpriseIDPTemplate
                        },
                        {
                            content: {
                                wizardHelp: lazy(() =>
                                    import("./templates/oidc-identity-provider/create-wizard-help")
                                )
                            },
                            enabled: window["AppUtils"].getConfig()
                                .ui.identityProviderTemplates?.enterpriseOIDC?.enabled
                                ?? identityProviderConfig.templates.oidc,
                            id: EnterpriseOIDCIdentityProviderTemplate.id,
                            resource: EnterpriseOIDCIdentityProviderTemplate
                        },
                        {
                            content: {
                                fileBasedHelpPanel: lazy(() => (
                                    import("./templates/saml-identity-provider/saml-idp-wizard-file-based-help")
                                )),
                                wizardHelp: lazy(() => (
                                    import("./templates/saml-identity-provider/saml-idp-wizard-help")
                                ))
                            },
                            enabled: window["AppUtils"].getConfig()
                                .ui.identityProviderTemplates?.enterpriseSAML?.enabled
                                    ?? identityProviderConfig.templates.saml,
                            id: EnterpriseSAMLIdentityProviderTemplate.id,
                            resource: EnterpriseSAMLIdentityProviderTemplate
                        },
                        {
                            content: {
                                wizardHelp: lazy(() =>
                                    import("./templates/expert-mode/create-wizard-help")
                                )
                            },
                            enabled: window["AppUtils"].getConfig()
                                .ui.identityProviderTemplates?.expertMode?.enabled
                                    ?? identityProviderConfig.templates.expertMode,
                            id: ExpertModeIdentityProviderTemplate.id,
                            resource: ExpertModeIdentityProviderTemplate
                        }
                    ],
                    "id"
                ),
                identityProviderConfig?.templates?.useTemplateExtensions
                    ? keyBy(extensionsManager.getIdentityProviderTemplatesConfig().templates, "id")
                    : {}
            )
        )
    };
};
