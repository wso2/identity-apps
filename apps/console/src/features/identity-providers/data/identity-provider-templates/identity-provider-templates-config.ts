/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import keyBy from "lodash/keyBy";
import merge from "lodash/merge";
import values from "lodash/values";
import { ComponentType, LazyExoticComponent, ReactElement, lazy } from "react";
import GeneralIdentityProviderTemplateCategory from "./categories/general-identity-provider-template-category.json";
import EnterpriseIdentityProviderTemplate from "./templates/enterprise-identity-provider/enterprise-identity-provider.json";
import GoogleIDPTemplate from "./templates/google/google.json";
import { ExtensionsManager } from "../../../../extensions";
import {
    IdentityProviderTemplateCategoryInterface,
    IdentityProviderTemplateListItemInterface
} from "../../models";

export interface IdentityProviderTemplatesConfigInterface {
    categories: TemplateConfigInterface<IdentityProviderTemplateCategoryInterface>[];
    templates: TemplateConfigInterface<IdentityProviderTemplateListItemInterface>[];
}

export interface TemplateConfigInterface<T = {}> {
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
}

export const getIdentityProviderTemplatesConfig = (): IdentityProviderTemplatesConfigInterface => {

    const extensionsManager: ExtensionsManager = ExtensionsManager.getInstance();

    return {
        categories: values(
            merge(
                keyBy([
                    {
                        enabled: true,
                        id: GeneralIdentityProviderTemplateCategory.id,
                        resource: GeneralIdentityProviderTemplateCategory
                    }
                ], "id"),
                keyBy(extensionsManager.getIdentityProviderTemplatesConfig().categories, "id")
            )
        ),
        templates: values(
            merge(
                keyBy([
                    {
                        content: {
                            wizardHelp: lazy(() => import("./templates/google/create-wizard-help"))
                        },
                        enabled: true,
                        id: GoogleIDPTemplate.id,
                        resource: GoogleIDPTemplate
                    },
                    {
                        content: {
                            wizardHelp: lazy(() => import("./templates/enterprise-identity-provider/create-wizard-help"))
                        },
                        enabled: true,
                        id: EnterpriseIdentityProviderTemplate.id,
                        resource: EnterpriseIdentityProviderTemplate
                    }
                ], "id"),
                keyBy(extensionsManager.getIdentityProviderTemplatesConfig().templates, "id")
            )
        )
    };
};
