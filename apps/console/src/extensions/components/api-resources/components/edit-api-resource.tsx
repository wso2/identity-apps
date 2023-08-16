/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AlertInterface, AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ResourceTab } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { AuthorizationAPIResource, GeneralAPIResource, PermissionAPIResource } from "./api-resource-panes";
import { ExtendedFeatureConfigInterface } from "../../../configs/models";
import { updateAPIResource } from "../api";
import { APIResourcesConstants } from "../constants";
import { APIResourceInterface, UpdatedAPIResourceInterface } from "../models";

/**
 * Prop-types for the API resources page component.
 */
interface EditAPIResourceInterface extends SBACInterface<ExtendedFeatureConfigInterface>, 
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
     * is managed by Choreo
     */
    isManagedByChoreo: boolean;
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
        isManagedByChoreo,
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
                        isManagedByChoreo={ isManagedByChoreo }
                        isSubmitting = { isSubmitting }
                        handleUpdateAPIResource = { handleUpdateAPIResource } />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("extensions:develop.apiResource.tabs.permissions.label"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <PermissionAPIResource 
                        apiResourceData={ apiResourceData }
                        isAPIResourceDataLoading={ isAPIResourceDataLoading }
                        isSubmitting = { isSubmitting }
                        isReadOnly={ isReadOnly }
                        isManagedByChoreo={ isManagedByChoreo }
                        handleUpdateAPIResource = { handleUpdateAPIResource }/>
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
     * Handles form submit action.
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
            .catch((error: AxiosError) => {
                switch (error?.code) {
                    case APIResourcesConstants.UNAUTHORIZED_ACCESS:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.updateAPIResource" +
                                ".unauthorizedError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.updateAPIResource" +
                                ".unauthorizedError.message")
                        }));

                        break;

                    case APIResourcesConstants.NO_VALID_API_RESOURCE_ID_FOUND:
                    case APIResourcesConstants.API_RESOURCE_NOT_FOUND:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.updateAPIResource" +
                                ".notFoundError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.updateAPIResource" +
                                ".notFoundError.message")
                        }));

                        break;

                    case APIResourcesConstants.PERMISSION_ALREADY_EXISTS:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.addAPIResource" +
                                ".permissionAlreadyExistsError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.addAPIResource" +
                                ".permissionAlreadyExistsError.message")
                        }));

                        break;

                    case APIResourcesConstants.INVALID_REQUEST_PAYLOAD:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.updateAPIResource" +
                                ".invalidPayloadError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.updateAPIResource" +
                                ".invalidPayloadError.message")
                        }));

                        break;   

                    default:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.updateAPIResource" +
                                ".genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.updateAPIResource" +
                                ".genericError.message")
                        }));
                }
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
