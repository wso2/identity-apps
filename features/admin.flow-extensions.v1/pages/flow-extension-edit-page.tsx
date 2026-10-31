/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, ResourceTab, ResourceTabPaneInterface, TabPageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import useGetFlowExtensionById from "../api/use-get-flow-extension-by-id";
import FlowExtensionAccessConfigSettings from "../components/edit/flow-extension-access-config-settings";
import FlowExtensionEndpointSettings from "../components/edit/flow-extension-endpoint-settings";
import FlowExtensionGeneralSettings from "../components/edit/flow-extension-general-settings";
import { getFlowExtensionIcon } from "../configs/ui";
import { FlowExtensionResponseInterface } from "../models/flow-extension";

/**
 * Props for the Flow Extension edit page.
 */
type FlowExtensionEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps<{ id: string }>;

/**
 * Flow Extension edit page. Loads a Flow Extension by ID and renders its editable settings as a
 * tabbed page.
 *
 * @param props - Props injected to the component.
 * @returns Flow Extension edit page component.
 */
const FlowExtensionEditPage: FunctionComponent<FlowExtensionEditPagePropsInterface> = ({
    match,
    ["data-componentid"]: componentId = "flow-extension-edit-page"
}: FlowExtensionEditPagePropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const extensionId: string = match?.params?.id;

    const flowExtensionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.flowExtensions
    );
    const isReadOnly: boolean = !useRequiredScopes(flowExtensionsFeatureConfig?.scopes?.update);

    const {
        data: flowExtension,
        isLoading,
        error,
        mutate: mutateFlowExtension
    } = useGetFlowExtensionById<FlowExtensionResponseInterface>(extensionId);

    useEffect(() => {
        if (isLoading || !error) {
            return;
        }

        dispatch(addAlert({
            description: t("flowExtension:notifications.fetchError.description"),
            level: AlertLevels.ERROR,
            message: t("flowExtension:notifications.fetchError.message")
        }));
    }, [ isLoading, error ]);

    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("IDP"));
    };

    const GeneralTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <FlowExtensionGeneralSettings
                flowExtension={ flowExtension }
                isLoading={ isLoading }
                isReadOnly={ isReadOnly }
                mutateFlowExtension={ mutateFlowExtension }
                data-componentid={ `${componentId}-general-settings` }
            />
        </ResourceTab.Pane>
    );

    const EndpointTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <FlowExtensionEndpointSettings
                flowExtension={ flowExtension }
                isLoading={ isLoading }
                isReadOnly={ isReadOnly }
                mutateFlowExtension={ mutateFlowExtension }
                data-componentid={ `${componentId}-endpoint-settings` }
            />
        </ResourceTab.Pane>
    );

    const AccessConfigTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <FlowExtensionAccessConfigSettings
                flowExtension={ flowExtension }
                isLoading={ isLoading }
                isReadOnly={ isReadOnly }
                mutateFlowExtension={ mutateFlowExtension }
                data-componentid={ `${componentId}-access-config-settings` }
            />
        </ResourceTab.Pane>
    );

    const getPanes = (): ResourceTabPaneInterface[] => {
        const panes: ResourceTabPaneInterface[] = [
            {
                "data-tabid": "general",
                menuItem: t("flowExtension:edit.tabs.general.label"),
                render: GeneralTabPane
            },
            {
                "data-tabid": "endpoint",
                menuItem: t("flowExtension:edit.tabs.endpoint.label"),
                render: EndpointTabPane
            },
            {
                "data-tabid": "access-config",
                menuItem: t("flowExtension:edit.tabs.accessConfig.label"),
                render: AccessConfigTabPane
            }
        ];

        return panes;
    };

    return (
        <TabPageLayout
            pageTitle={ t("flowExtension:edit.pageTitle") }
            title={ flowExtension?.name }
            description={ flowExtension?.description }
            image={
                (<GenericIcon
                    icon={ flowExtension?.iconUrl || getFlowExtensionIcon() }
                    size="tiny"
                    transparent
                />)
            }
            isLoading={ isLoading }
            loadingStateOptions={ {
                count: 5,
                imageType: "square"
            } }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("flowExtension:edit.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-componentid={ `${componentId}-layout` }
        >
            <ResourceTab
                isLoading={ isLoading }
                panes={ getPanes() }
                data-componentid={ `${componentId}-tabs` }
            />
        </TabPageLayout>
    );
};

export default FlowExtensionEditPage;
