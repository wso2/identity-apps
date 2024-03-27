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

import { AlertInterface, AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { AuthorizationAPIResource, GeneralAPIResource, PermissionAPIResource } from "./api-resource-panes";
import { FeatureConfigInterface } from "../../core";
import { deleteScopeFromAPIResource, updateAPIResource } from "../api";
import { APIResourceInterface, UpdatedAPIResourceInterface } from "../models";

/**
 * Prop-types for the API resources page component.
 */
interface EditAPIResourceInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {
    /**
     * List of API Resources
     */
    apiResourceData: APIResourceInterface;
    /**
     * show if API resources list is still loading
     */
    isAPIResourceDataLoading: boolean;
    /**
     * is read only
     */
    isReadOnly: boolean;
    /**
     * Update API Resource once it has been updated
     */
    mutateAPIResource: () => void;
}

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
export const EditAPIResource: FunctionComponent<EditAPIResourceInterface> = (
    props: EditAPIResourceInterface
): ReactElement => {

    const {
        featureConfig,
        isReadOnly,
        apiResourceData,
        isAPIResourceDataLoading,
        mutateAPIResource
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Panes for the resource tab.
     * @returns `ResourceTab.Pane[]`
     */
    const panes = () => ([
        {
            menuItem: t("extensions:develop.apiResource.tabs.general.label"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <GeneralAPIResource
                        apiResourceData={ apiResourceData }
                        isAPIResourceDataLoading={ isAPIResourceDataLoading }
                        featureConfig={ featureConfig }
                        isReadOnly={ isReadOnly }
                        isSubmitting = { isSubmitting }
                        handleUpdateAPIResource = { handleUpdateAPIResource } />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("apiResources:tabs.scopes.label"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <PermissionAPIResource
                        apiResourceData={ apiResourceData }
                        isAPIResourceDataLoading={ isAPIResourceDataLoading }
                        isSubmitting = { isSubmitting }
                        isReadOnly={ isReadOnly }
                        handleUpdateAPIResource = { handleUpdateAPIResource }
                        handleDeleteAPIScope = { handleDeleteAPIScope } />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("extensions:develop.apiResource.tabs.authorization.label"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <AuthorizationAPIResource
                        apiResourceData={ apiResourceData }
                        isAPIResourceDataLoading={ isAPIResourceDataLoading } />
                </ResourceTab.Pane>
            )
        }
    ]);

    /**
     * Handles API Resource update actions.
     *
     * @param updatedDetails - Form values.
     * @param callback - Callback function to be executed after the update is completed.
     */
    const handleUpdateAPIResource = (updatedAPIResource: UpdatedAPIResourceInterface, callback?: () => void): void => {
        setIsSubmitting(true);

        updateAPIResource(apiResourceData.id, updatedAPIResource)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.apiResource.notifications.updateAPIResource.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.apiResource.notifications.updateAPIResource.success.message")
                }));
                mutateAPIResource();
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.apiResource.notifications.updateAPIResource" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.apiResource.notifications.updateAPIResource" +
                        ".genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);

                // Callback function to be executed after the update is completed.
                callback && callback();
            });
    };

    /**
     * Handles API scope delete action.
     *
     * @param deletingScopeName - Name of the scope that needs to be deleted.
     * @param callback - Callback function to be executed after the update is completed.
     */
    const handleDeleteAPIScope = (deletingScopeName: string, callback?: () => void): void => {
        setIsSubmitting(true);

        deleteScopeFromAPIResource(apiResourceData.id, deletingScopeName)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.apiResource.notifications.updateAPIResource.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.apiResource.notifications.updateAPIResource.success.message")
                }));
                mutateAPIResource();
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.apiResource.notifications.updateAPIResource" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.apiResource.notifications.updateAPIResource" +
                        ".genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);

                // Callback function to be executed after the update is completed.
                callback && callback();
            });
    };

    return (
        <ResourceTab
            isLoading={ isAPIResourceDataLoading }
            panes={ panes() }
        />
    );

};
