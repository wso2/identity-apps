/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetExtensionTemplates from "../api/use-get-extension-templates";
import { ExtensionTemplateConstants } from "../constants/templates";
import ExtensionTemplatesContext from "../context/extension-templates-context";
import {
    CategorizedExtensionTemplatesInterface,
    ExtensionTemplateCategoryInterface,
    ExtensionTemplateListInterface,
    ResourceTypes
} from "../models/templates";

/**
 * Props interface for the Extension templates provider.
 */
export interface ExtensionTemplatesProviderProps {
    /**
     * Templates type need to be retrieved from the API.
     */
    resourceType: ResourceTypes
    /**
     * Metadata describing the supported categories in the current extension templates.
     */
    categories: ExtensionTemplateCategoryInterface[];
}

/**
 * Extension templates provider.
 *
 * @param props - Props for the provider.
 * @returns Extension templates provider.
 */
const ExtensionTemplatesProvider: FunctionComponent<
    PropsWithChildren<ExtensionTemplatesProviderProps>
> = ({
    categories,
    children,
    resourceType
}: PropsWithChildren<ExtensionTemplatesProviderProps>): ReactElement => {

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const {
        data: extensionTemplates,
        isLoading: isExtensionTemplatesFetchRequestLoading,
        error: extensionTemplatesFetchRequestError
    } = useGetExtensionTemplates(resourceType);

    /**
     * Categorize extension templates based on the `category` attribute.
     */
    const categorizedTemplates: CategorizedExtensionTemplatesInterface[] = useMemo(() => {
        const categoryMap: CategorizedExtensionTemplatesInterface[] = [];

        if (!extensionTemplates
            || !Array.isArray(extensionTemplates)
            || extensionTemplates?.length <= 0) {

            return categoryMap;
        }

        // Sort the extension template categories based on their assigned display order.
        categories.sort(
            (category1: ExtensionTemplateCategoryInterface, category2: ExtensionTemplateCategoryInterface) =>
                category1?.displayOrder - category2?.displayOrder
        );

        // Categorize the templates based on their actual categories
        categories.forEach(
            (category: ExtensionTemplateCategoryInterface) => {
                const categoryData: CategorizedExtensionTemplatesInterface = { ...category, templates: [] };

                categoryData.templates = extensionTemplates?.filter(
                    (template: ExtensionTemplateListInterface) => template?.category === category?.id);

                categoryMap.push(categoryData);
            }
        );

        // Categorize all other unsupported template categories as the "other" type.
        const supportedCategories: string[] = categories.map(
            (category: ExtensionTemplateCategoryInterface) => category?.id);

        categoryMap.push({
            ...ExtensionTemplateConstants.OTHER_CATEGORY_INFO,
            templates: extensionTemplates?.filter(
                (template: ExtensionTemplateListInterface) => !supportedCategories.includes(template?.category))
        });

        return categoryMap;
    }, [ extensionTemplates ]);

    /**
     * Handles the extension templates fetch request error.
     */
    useEffect(() => {

        if (!extensionTemplatesFetchRequestError) {
            return;
        }

        if (extensionTemplatesFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: extensionTemplatesFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("templateCore:notifications." +
                    "fetchTemplates.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("templateCore:notifications.fetchTemplates" +
                ".genericError.description", { type: resourceType }),
            level: AlertLevels.ERROR,
            message: t("templateCore:notifications." +
                "fetchTemplates.genericError.message")
        }));
    }, [ extensionTemplatesFetchRequestError ]);

    return (
        <ExtensionTemplatesContext.Provider
            value={
                {
                    categorizedTemplates,
                    isExtensionTemplatesRequestLoading: isExtensionTemplatesFetchRequestLoading,
                    templates: extensionTemplates
                }
            }
        >
            { children }
        </ExtensionTemplatesContext.Provider>
    );
};

export default ExtensionTemplatesProvider;
