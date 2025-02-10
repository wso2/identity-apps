/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetUserStoreDetails from "@wso2is/admin.userstores.v1/api/use-get-user-store-details";
import { getDatabaseAvatarGraphic } from "@wso2is/admin.userstores.v1/configs/ui";
import { DISABLED, RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import { UserStoreProperty } from "@wso2is/admin.userstores.v1/models/user-stores";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, Popup, ResourceTab, ResourceTabPaneInterface, TabPageLayout } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import { ConfigurationSettings } from "../components/edit/userstore-configuration-settings";
import { UserStoreGeneralSettings } from "../components/edit/userstore-general-settings";
import { SetupGuideTab } from "../components/edit/userstore-setup-guide";
import { RemoteUserStoreEditTabIDs } from "../constants/ui-constants";

/**
 * Props for the Remote user store edit page.
 */
type RemoteUserStoreEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

/**
 * This renders the userstore edit page.
 *
 * @param props - Props injected to the component.
 *
 * @returns The Remote User Store edit page.
 */
const RemoteUserStoreEditPage: FunctionComponent<RemoteUserStoreEditPagePropsInterface> = (
    {
        match,
        ["data-componentid"]: componentId = "remote-user-store-edit-page"
    }: RemoteUserStoreEditPagePropsInterface
): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const userStoreId: string = match.params[ "id" ]?.split( "#" )[ 0 ];
    const remoteUserStoreFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userStores
    );
    const hasUserStoreUpdatePermission: boolean = useRequiredScopes(
        remoteUserStoreFeatureConfig?.scopes?.update
    );

    const [ disabled, setDisabled ] = useState<string>("");

    const {
        data: userStoreDetails,
        isLoading: isUserStoreDetailsRequestLoading,
        error: userStoreDetailsRequestError,
        remainingRetryCount: userStoreDetailsRequestRemainingRetryCount,
        mutate: mutateUserStoreDetails
    } = useGetUserStoreDetails(userStoreId, !isEmpty(userStoreId));

    const userStoreManager: RemoteUserStoreManagerType = userStoreDetails?.typeName as RemoteUserStoreManagerType;

    /**
     * Handles the user store details request error.
     */
    useEffect(() => {
        if (userStoreDetailsRequestError) {
            // Since user store creation can be delayed,
            // 404 error is ignored until the maximum retry count is reached.
            if (userStoreDetailsRequestError.response?.status === 404
                && userStoreDetailsRequestRemainingRetryCount > 0) {
                return;
            }

            dispatch(addAlert(
                {
                    description: t("userstores:notifications.fetchUserstores.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("userstores:notifications.fetchUserstores.genericError.message")
                }
            ));
        }
    }, [ userStoreDetailsRequestError ]);

    useEffect(() => {
        if (userStoreDetails) {
            setDisabled(userStoreDetails?.properties?.find(
                (property: UserStoreProperty) => property.name === DISABLED)?.value);
        }
    }, [ userStoreDetails ]);

    const isUserStoreDisabled: boolean = disabled === "true";

    const onUserStoreUpdated = (): void => {
        // Mutate the user store details with a delay as the user store update operation is async
        // and can be delayed.
        setTimeout(() => {
            mutateUserStoreDetails();
        }, 3000);
    };

    /**
     * The tab panes.
     */
    const panes: ResourceTabPaneInterface[] = [
        {
            "data-tabid": RemoteUserStoreEditTabIDs.GUIDE,
            menuItem: t("remoteUserStores:pages.edit.tabs.guide"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <SetupGuideTab
                        isUserStoreLoading={ isUserStoreDetailsRequestLoading }
                        userStoreId={ userStoreId }
                        userStoreManager={ userStoreManager }
                        isUserStoreDisabled={ isUserStoreDisabled }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            "data-tabid": RemoteUserStoreEditTabIDs.GENERAL,
            menuItem: t("remoteUserStores:pages.edit.tabs.general"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserStoreGeneralSettings
                        isDisabled={ isUserStoreDisabled }
                        userStore={ userStoreDetails }
                        userStoreId={ userStoreId }
                        userStoreManager={ userStoreManager }
                        handleUserStoreDisabled={ (value: string) => setDisabled(value) }
                        isReadOnly={ !hasUserStoreUpdatePermission }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            "data-tabid": RemoteUserStoreEditTabIDs.CONFIGURATIONS,
            menuItem: t("remoteUserStores:pages.edit.tabs.configurations"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <ConfigurationSettings
                        userStore={ userStoreDetails }
                        userStoreId={ userStoreId }
                        userStoreManager={ userStoreManager }
                        isLoading={ isUserStoreDetailsRequestLoading }
                        isReadOnly={ !hasUserStoreUpdatePermission }
                        onUpdate={ onUserStoreUpdated }
                        isUserStoreDisabled={ isUserStoreDisabled }
                    />
                </ResourceTab.Pane>
            )
        }
    ];

    /**
     * Renders the status icon based on the user store active status.
     *
     * @returns Status icon.
     */
    const renderStatusIcon = (): ReactElement => {
        const _isDisabled: boolean = disabled === "true";

        return (
            <Popup
                trigger={ (
                    <Icon
                        className="mr-2 ml-0 vertical-aligned-baseline"
                        size="small"
                        name="circle"
                        color={ _isDisabled ? "red" : "green" }
                    />
                ) }
                content={ _isDisabled ? t("common:disabled") : t("common:enabled") }
                inverted
            />
        );
    };

    return (
        <TabPageLayout
            image={ (
                <GenericIcon
                    bordered
                    defaultIcon
                    size="x60"
                    relaxed="very"
                    shape="rounded"
                    hoverable={ false }
                    icon={ getDatabaseAvatarGraphic() }
                />
            ) }
            title={
                (
                    <>
                        { renderStatusIcon() }
                        { userStoreDetails?.name }
                    </>
                )
            }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("USERSTORES"));
                },
                text: t("userstores:pageLayout.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            isLoading={ isUserStoreDetailsRequestLoading || !userStoreDetails }
            data-componentid={ `${ componentId }-layout` }
            className="remote-user-store-edit-page"
        >
            <ResourceTab
                className="remote-user-store-edit-section"
                panes={ panes }
                data-componentid={ `${ componentId }-tabs` }
                defaultActiveTab={ RemoteUserStoreEditTabIDs.GENERAL }
                isLoading={ isUserStoreDetailsRequestLoading || !userStoreDetails }
                controlTabRedirectionInternally
            />
        </TabPageLayout>
    );
};

export default RemoteUserStoreEditPage;
