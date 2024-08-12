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
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetApplicationTemplateMetadata from "../api/use-get-application-template-metadata";
import ApplicationTemplateMetadataContext from "../context/application-template-metadata-context";

/**
 * Props interface for the Application template metadata provider.
 */
export interface ApplicationTemplateMetadataProviderProps {
    /**
     * Listing data of the selected template.
     */
    template: ExtensionTemplateListInterface
}

/**
 * Application template metadata provider.
 *
 * @param props - Props for the provider.
 * @returns Application template metadata provider.
 */
const ApplicationTemplateMetadataProvider: FunctionComponent<
    PropsWithChildren<ApplicationTemplateMetadataProviderProps>
> = ({
    children,
    template
}: PropsWithChildren<ApplicationTemplateMetadataProviderProps>): ReactElement => {

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const {
        data: applicationTemplateMetadata,
        isLoading: isApplicationTemplateMetadataFetchRequestLoading,
        error: applicationTemplateMetadataFetchRequestError
    } = useGetApplicationTemplateMetadata(template?.id, !!template?.id);

    /**
     * Handle errors that occur during the application template meta data fetch request.
     */
    useEffect(() => {
        if (!applicationTemplateMetadataFetchRequestError
            || applicationTemplateMetadataFetchRequestError?.response?.status === 404) {
            return;
        }

        if (applicationTemplateMetadataFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: applicationTemplateMetadataFetchRequestError?.response?.data?.description,
                level: AlertLevels.ERROR,
                message: t("applicationTemplates:notifications.fetchTemplateMetadata.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applicationTemplates:notifications.fetchTemplateMetadata" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applicationTemplates:notifications." +
                "fetchTemplateMetadata.genericError.message")
        }));
    }, [ applicationTemplateMetadataFetchRequestError ]);

    return (
        <ApplicationTemplateMetadataContext.Provider
            value={
                {
                    isTemplateMetadataRequestLoading: isApplicationTemplateMetadataFetchRequestLoading,
                    templateMetadata: applicationTemplateMetadata
                }
            }
        >
            { children }
        </ApplicationTemplateMetadataContext.Provider>
    );
};

export default ApplicationTemplateMetadataProvider;
