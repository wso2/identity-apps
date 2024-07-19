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

import { ExtensionTemplateListInterface } from "@wso2is/admin.template-core.v1/models/templates";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetApplicationTemplate from "../api/use-get-application-template";
import ApplicationTemplateContext from "../context/application-template-context";
import { ApplicationTemplateInterface } from "../models/templates";

/**
 * Props interface for the Application template provider.
 */
export interface ApplicationTemplateProviderProps {
    /**
     * Listing data of the selected template.
     */
    template: ExtensionTemplateListInterface
}

/**
 * Application template provider.
 *
 * @param props - Props for the provider.
 * @returns Application template provider.
 */
const ApplicationTemplateProvider: FunctionComponent<
    PropsWithChildren<ApplicationTemplateProviderProps>
> = ({
    children,
    template
}: PropsWithChildren<ApplicationTemplateProviderProps>): ReactElement => {

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const {
        data: applicationTemplate,
        isLoading: isApplicationTemplateFetchRequestLoading,
        error: applicationTemplateFetchRequestError
    } = useGetApplicationTemplate(template?.id, !!template?.id);

    /**
     * Handle errors that occur during the application template data fetch request.
     */
    useEffect(() => {
        if (!applicationTemplateFetchRequestError || applicationTemplateFetchRequestError?.response?.status === 404) {
            return;
        }

        if (applicationTemplateFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: applicationTemplateFetchRequestError?.response?.data?.description,
                level: AlertLevels.ERROR,
                message: t("applicationTemplates:notifications.fetchTemplate.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applicationTemplates:notifications.fetchTemplate" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applicationTemplates:notifications." +
                "fetchTemplate.genericError.message")
        }));
    }, [ applicationTemplateFetchRequestError ]);

    /**
     * Memoized function to combine template data with its listing data.
     */
    const templateData: ApplicationTemplateInterface = useMemo(() => {
        if (!applicationTemplate || !template) {
            return null;
        }

        const { self: _self, customAttributes: _customAttributes, ...rest } = template;

        return {
            ...rest,
            ...applicationTemplate
        };
    }, [ applicationTemplate, template ]);

    return (
        <ApplicationTemplateContext.Provider
            value={
                {
                    isTemplateRequestLoading: isApplicationTemplateFetchRequestLoading,
                    template: templateData
                }
            }
        >
            { children }
        </ApplicationTemplateContext.Provider>
    );
};

export default ApplicationTemplateProvider;
