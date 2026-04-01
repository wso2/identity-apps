/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { useRequiredScopes } from "@wso2is/access-control";
import useGetActionById from "@wso2is/admin.actions.v1/api/use-get-action-by-id";
import { InFlowExtensionActionResponseInterface } from "@wso2is/admin.actions.v1/models/actions";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ContentLoader,
    EmphasizedSegment,
    ResourceTab,
    ResourceTabPaneInterface,
    TabPageLayout
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { TabProps } from "semantic-ui-react";
import { InFlowExtensionAccessConfigSettings } from
    "../components/edit/settings/in-flow-extension-access-config-settings";
import { InFlowExtensionEndpointSettings } from "../components/edit/settings/in-flow-extension-endpoint-settings";
import { InFlowExtensionGeneralSettings } from "../components/edit/settings/in-flow-extension-general-settings";
import { AuthenticatorMeta } from "../meta/authenticator-meta";

const ACTION_TYPE: string = "inFlowExtension";

type InFlowExtensionEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

const InFlowExtensionEditPage: FunctionComponent<InFlowExtensionEditPagePropsInterface> = ({
    location,
    ["data-componentid"]: componentId = "in-flow-extension-edit-page"
}: InFlowExtensionEditPagePropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const isReadOnly: boolean = !useRequiredScopes(featureConfig?.identityProviders?.scopes?.update);

    const [ defaultActiveIndex, setDefaultActiveIndex ] = useState<number>(0);

    const getActionId = (pathname: string): string => {
        const parts: string[] = pathname.split("/");

        return parts[parts.length - 1];
    };

    const actionId: string = getActionId(location.pathname);

    const {
        data: action,
        error: actionFetchError,
        isLoading: isActionLoading,
        mutate: mutateAction
    } = useGetActionById<InFlowExtensionActionResponseInterface>(ACTION_TYPE, actionId);

    useEffect(() => {
        if (actionFetchError) {
            dispatch(addAlert({
                description: actionFetchError?.response?.data?.description
                    ?? t("inFlowExtension:notifications.fetchError.description"),
                level: AlertLevels.ERROR,
                message: t("inFlowExtension:notifications.fetchError.message")
            }));
        }
    }, [ actionFetchError ]);

    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("IDP"));
    };

    const handleDelete = (): void => {
        history.push(AppConstants.getPaths().get("IDP"));
    };

    const handleUpdate = (): void => {
        mutateAction();
    };

    const Loader = (): ReactElement => (
        <EmphasizedSegment padded>
            <ContentLoader inline="centered" active />
        </EmphasizedSegment>
    );

    const resolveImage = (): ReactElement => {
        if (action?.name) {
            return (
                <AppAvatar
                    hoverable={ false }
                    name={ action.name }
                    image={ AuthenticatorMeta.getInFlowExtensionIcon() }
                    size="tiny"
                />
            );
        }

        return (
            <AnimatedAvatar
                hoverable={ false }
                name={ action?.name ?? "" }
                size="tiny"
                floated="left"
            />
        );
    };

    const GeneralSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <InFlowExtensionGeneralSettings
                action={ action }
                isLoading={ isActionLoading }
                isReadOnly={ isReadOnly }
                onDelete={ handleDelete }
                onUpdate={ handleUpdate }
                loader={ Loader }
                data-componentid={ `${componentId}-general-settings` }
            />
        </ResourceTab.Pane>
    );

    const EndpointSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <InFlowExtensionEndpointSettings
                action={ action }
                isLoading={ isActionLoading }
                isReadOnly={ isReadOnly }
                onUpdate={ handleUpdate }
                loader={ Loader }
                data-componentid={ `${componentId}-endpoint-settings` }
            />
        </ResourceTab.Pane>
    );

    const AccessConfigTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <InFlowExtensionAccessConfigSettings
                action={ action }
                isLoading={ isActionLoading }
                isReadOnly={ isReadOnly }
                onUpdate={ handleUpdate }
                loader={ Loader }
                data-componentid={ `${componentId}-access-config-settings` }
            />
        </ResourceTab.Pane>
    );

    const getPanes = (): ResourceTabPaneInterface[] => {
        const panes: ResourceTabPaneInterface[] = [];

        panes.push({
            "data-tabid": "general",
            menuItem: "General",
            render: GeneralSettingsTabPane
        });

        panes.push({
            "data-tabid": "settings",
            menuItem: "Settings",
            render: EndpointSettingsTabPane
        });

        panes.push({
            "data-tabid": "access-configuration",
            menuItem: "Access Configuration",
            render: AccessConfigTabPane
        });

        return panes;
    };

    return (
        <TabPageLayout
            pageTitle="Edit In-Flow Extension"
            isLoading={ isActionLoading }
            loadingStateOptions={ {
                count: 5,
                imageType: "square"
            } }
            title={ action?.name ?? "" }
            contentTopMargin={ true }
            description={ action?.description ?? "" }
            image={ resolveImage() }
            backButton={ {
                "data-componentid": `${componentId}-back-button`,
                onClick: handleBackButtonClick,
                text: t("authenticationProvider:edit.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-componentid={ `${componentId}-layout` }
        >
            <ResourceTab
                isLoading={ isActionLoading }
                data-componentid={ `${componentId}-resource-tabs` }
                panes={ getPanes() }
                defaultActiveIndex={ defaultActiveIndex }
                onTabChange={ (
                    _e: React.MouseEvent<HTMLDivElement, MouseEvent>,
                    data: TabProps
                ) => {
                    setDefaultActiveIndex(data.activeIndex as number);
                } }
            />
        </TabPageLayout>
    );
};

export default InFlowExtensionEditPage;
