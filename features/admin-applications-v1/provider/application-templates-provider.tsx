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
import React, { PropsWithChildren, ReactElement, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetApplicationTemplates from "../api/use-get-application-templates";
import ApplicationTemplatesContext from "../context/application-templates-context";
import {
    ApplicationTemplateListInterface,
    CategorizedApplicationTemplatesInterface
} from "../models/application-templates";

/**
 * Props interface for the Application templates provider.
 */
export type ApplicationTemplatesProviderProps = PropsWithChildren;

/**
 * Application templates provider.
 *
 * @param props - Props for the provider.
 * @returns Application templates provider.
 */
const ApplicationTemplatesProvider = (props: ApplicationTemplatesProviderProps): ReactElement => {
    const { children } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const {
        data: applicationTemplates,
        isLoading: isApplicationTemplatesFetchRequestLoading,
        error: applicationTemplatesFetchRequestError
    } = useGetApplicationTemplates();

    /**
     * Categorize application templates based on the `category` attribute.
     */
    const categorizedTemplates: CategorizedApplicationTemplatesInterface = useMemo(() => {
        const categoryMap: CategorizedApplicationTemplatesInterface = {};

        if (applicationTemplates) {
            // Create a category called "ALL" and push all items into it
            categoryMap["ALL"] = [ ...applicationTemplates ];

            // Categorize the templates based on their actual categories
            applicationTemplates.forEach((template: ApplicationTemplateListInterface) => {
                const category: string = template?.category;

                if (category) {
                    if (!categoryMap[category]) {
                        categoryMap[category] = [];
                    }

                    categoryMap[category].push(template);
                }
            });
        }

        return categoryMap;
    }, [ applicationTemplates ]);

    /**
     * Handles the application templates fetch request error.
     */
    useEffect(() => {

        if (!applicationTemplatesFetchRequestError) {
            return;
        }

        if (applicationTemplatesFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: applicationTemplatesFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications." +
                    "fetchTemplates.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchTemplates" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications." +
                "fetchTemplates.genericError.message")
        }));
    }, [ applicationTemplatesFetchRequestError ]);

    return (
        <ApplicationTemplatesContext.Provider
            value={
                {
                    categorizedTemplates,
                    isApplicationTemplatesRequestLoading: isApplicationTemplatesFetchRequestLoading,
                    templates: applicationTemplates
                }
            }
        >
            { children }
        </ApplicationTemplatesContext.Provider>
    );
};

export default ApplicationTemplatesProvider;
