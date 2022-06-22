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

import keyBy from "lodash-es/keyBy";
import merge from "lodash-es/merge";
import values from "lodash-es/values";
import { ComponentType, LazyExoticComponent, ReactElement, lazy } from "react";
import GeneralApplicationTemplateCategory from "./categories/general-application-template-category.json";
import DesktopApplicationTemplateGroup from "./groups/desktop-application-template-group.json";
import MobileApplicationTemplateGroup from "./groups/mobile-application-template-group.json";
import WebApplicationTemplateGroup from "./groups/web-application-template-group.json";
import AndroidMobileApplicationTemplate from "./templates/android-mobile-application/android-mobile-application.json";
import CustomApplicationTemplate from "./templates/custom-application/custom-application.json";
import OIDCWebApplicationTemplate from "./templates/oidc-web-application/oidc-web-application.json";
import SAMLWebApplicationTemplate from "./templates/saml-web-application/saml-web-application.json";
import SinglePageApplicationTemplate from "./templates/single-page-application/single-page-application.json";
import WindowsDesktopApplicationTemplate
    from "./templates/windows-desktop-application/windows-desktop-application.json";
import { ExtensionsManager, applicationConfig } from "../../../../extensions";
import {
    ApplicationTemplateCategoryInterface,
    ApplicationTemplateGroupInterface,
    ApplicationTemplateInterface
} from "../../models";

export interface ApplicationTemplatesConfigInterface {
    categories: TemplateConfigInterface<ApplicationTemplateCategoryInterface>[];
    groups: TemplateConfigInterface<ApplicationTemplateGroupInterface>[];
    templates: TemplateConfigInterface<ApplicationTemplateInterface>[];
}

export interface TemplateConfigInterface<T = Record<string, unknown>> {
    content?: TemplateContentInterface;
    enabled: boolean;
    id: string;
    resource?: T | Promise<T> | string;
}

export interface TemplateContentInterface extends StrictTemplateContentInterface {
    [ key: string ]: any;
}

export interface StrictTemplateContentInterface {
    wizardHelp?: LazyExoticComponent<ComponentType<any>> | ReactElement | any;
    wizardHelp2?: LazyExoticComponent<ComponentType<any>> | ReactElement | any;
    wizardHelp3?: LazyExoticComponent<ComponentType<any>> | ReactElement | any;
}

export const getApplicationTemplatesConfig = (): ApplicationTemplatesConfigInterface => {

    const extensionsManager: ExtensionsManager = ExtensionsManager.getInstance();

    return {
        categories: values(
            merge(
                keyBy([
                    {
                        enabled: true,
                        id: GeneralApplicationTemplateCategory.id,
                        resource: GeneralApplicationTemplateCategory
                    }
                ], "id"),
                keyBy(extensionsManager.getApplicationTemplatesConfig().categories, "id")
            )
        ),
        groups: values(
            merge(
                keyBy([
                    {
                        enabled: true,
                        id: WebApplicationTemplateGroup.id,
                        resource: WebApplicationTemplateGroup
                    },
                    {
                        enabled: true,
                        id: DesktopApplicationTemplateGroup.id,
                        resource: DesktopApplicationTemplateGroup
                    },
                    {
                        enabled: true,
                        id: MobileApplicationTemplateGroup.id,
                        resource: MobileApplicationTemplateGroup
                    }
                ], "id"),
                keyBy(extensionsManager.getApplicationTemplatesConfig().groups, "id")
            )
        ),
        templates: values(
            merge(
                keyBy([
                    {
                        content: {
                            wizardHelp: lazy(() => import("./templates/android-mobile-application/create-wizard-help"))
                        },
                        enabled: applicationConfig.templates.android,
                        id: AndroidMobileApplicationTemplate.id,
                        resource: AndroidMobileApplicationTemplate
                    },
                    {
                        content: {
                            wizardHelp: lazy(() => import("./templates/oidc-web-application/create-wizard-help"))
                        },
                        enabled: applicationConfig.templates.oidc,
                        id: OIDCWebApplicationTemplate.id,
                        resource: OIDCWebApplicationTemplate
                    },
                    {
                        content: {
                            wizardHelp: lazy(() => import("./templates/saml-web-application/create-wizard-help")),
                            wizardHelp2:
                                lazy(() => import("./templates/saml-web-application/create-file-based-wizard-help")),
                            wizardHelp3:
                                lazy(() => import("./templates/saml-web-application/create-url-based-wizard-help"))
                        },
                        enabled: applicationConfig.templates.saml,
                        id: SAMLWebApplicationTemplate.id,
                        resource: SAMLWebApplicationTemplate
                    },
                    {
                        content: {
                            wizardHelp: lazy(() => import("./templates/single-page-application/create-wizard-help"))
                        },
                        enabled: applicationConfig.templates.spa,
                        id: SinglePageApplicationTemplate.id,
                        resource: SinglePageApplicationTemplate
                    },
                    {
                        content: {
                            wizardHelp: lazy(() => import("./templates/windows-desktop-application/create-wizard-help"))
                        },
                        enabled: applicationConfig.templates.windows,
                        id: WindowsDesktopApplicationTemplate.id,
                        resource: WindowsDesktopApplicationTemplate
                    },
                    {
                        content: {
                            wizardHelp: null
                        },
                        enabled: applicationConfig.templates.custom,
                        id: CustomApplicationTemplate.id,
                        resource: CustomApplicationTemplate
                    }
                ], "id"),
                keyBy(extensionsManager.getApplicationTemplatesConfig().templates, "id")
            )
        )
    };
};
