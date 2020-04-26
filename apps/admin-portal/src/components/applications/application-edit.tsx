/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, ResourceTab } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdvanceSettings } from "./advance-application";
import { AttributeSettings } from "./attribute-management";
import { GeneralApplicationSettings } from "./general-application-settings";
import { InboundProtocolsMeta } from "./meta";
import { ProvisioningSettings } from "./provisioning";
import { ApplicationSettings } from "./settings-application";
import { SignOnMethods } from "./sign-on-methods";
import { getInboundProtocolConfig } from "../../api";
import { ApplicationManagementConstants } from "../../constants";
import {
    ApplicationInterface,
    ApplicationTemplateListItemInterface,
    AuthProtocolMetaListItemInterface,
    FeatureConfigInterface,
    SupportedAuthProtocolTypes
} from "../../models";
import { AppState } from "../../store";
import { ApplicationManagementUtils } from "../../utils";

/**
 * Proptypes for the applications edit component.
 */
interface EditApplicationPropsInterface extends SBACInterface<FeatureConfigInterface> {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Callback to be triggered after deleting the application.
     */
    onDelete: () => void;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Application template.
     */
    template?: ApplicationTemplateListItemInterface;
}

/**
 * Application edit component.
 *
 * @param {EditApplicationPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const EditApplication: FunctionComponent<EditApplicationPropsInterface> = (
    props: EditApplicationPropsInterface
): ReactElement => {

    const {
        application,
        featureConfig,
        isLoading,
        onDelete,
        onUpdate,
        template
    } = props;

    const dispatch = useDispatch();

    const availableInboundProtocols: AuthProtocolMetaListItemInterface[] =
        useSelector((state: AppState) => state.application.meta.inboundProtocols);

    const [isInboundProtocolConfigRequestLoading, setIsInboundProtocolConfigRequestLoading] = useState<boolean>(true);
    const [inboundProtocolList, setInboundProtocolList] =
        useState<AuthProtocolMetaListItemInterface[]>([]);
    const [inboundProtocolConfig, setInboundProtocolConfig] = useState<any>(undefined);
    const [isInboundProtocolsRequestLoading, setInboundProtocolsRequestLoading] = useState<boolean>(false);

    /**
     * Called on `availableInboundProtocols` prop update.
     */
    useEffect(() => {
        if (!_.isEmpty(availableInboundProtocols)) {
            return;
        }

        setInboundProtocolsRequestLoading(true);

        ApplicationManagementUtils.getInboundProtocols(InboundProtocolsMeta, false)
            .finally(() => {
                setInboundProtocolsRequestLoading(false);
            });
    }, [availableInboundProtocols]);

    /**
     * Watch for `inboundProtocols` array change and fetch configured protocols if there's a difference.
     */
    useEffect(() => {
        if (!application?.inboundProtocols || !application?.id) {
            return;
        }

        findConfiguredInboundProtocol(application.id);
    }, [ application?.inboundProtocols ]);

    /**
     * Finds the configured inbound protocol.
     */
    const findConfiguredInboundProtocol = (appId): void => {

        let protocolConfigs: any = {};
        const protocolList: AuthProtocolMetaListItemInterface[] = [];

        for (const protocol of availableInboundProtocols) {
            if (Object.values(SupportedAuthProtocolTypes).includes(protocol.id as SupportedAuthProtocolTypes)) {

                setIsInboundProtocolConfigRequestLoading(true);

                getInboundProtocolConfig(appId, protocol.id)
                    .then((response) => {
                        protocolConfigs = {
                            ...protocolConfigs,
                            [protocol.id]: response
                        };

                        protocolList.push(protocol);
                    })
                    .catch((error) => {
                        if (error?.response?.status === 404) {
                            return;
                        }

                        if (error?.response && error?.response?.data && error?.response?.data?.description) {
                            dispatch(addAlert({
                                description: error.response?.data?.description,
                                level: AlertLevels.ERROR,
                                message: "Retrieval error"
                            }));

                            return;
                        }

                        dispatch(addAlert({
                            description: "An error occurred retrieving the protocol configurations.",
                            level: AlertLevels.ERROR,
                            message: "Retrieval error"
                        }));
                    })
                    .finally(() => {
                        setInboundProtocolList(protocolList);
                        setInboundProtocolConfig(protocolConfigs);
                        setIsInboundProtocolConfigRequestLoading(false);
                    });
            }
        }
    };

    const GeneralApplicationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <GeneralApplicationSettings
                accessUrl={ application.accessUrl }
                appId={ application.id }
                description={ application.description }
                discoverability={ application.advancedConfigurations?.discoverableByEndUsers }
                imageUrl={ application.imageUrl }
                name={ application.name }
                isLoading={ isLoading }
                onDelete={ onDelete }
                onUpdate={ onUpdate }
                featureConfig={ featureConfig }
                // TODO we need check whether application is active or not as well.
                showRevoke={
                    inboundProtocolList.some((protocol) => protocol.id === SupportedAuthProtocolTypes.OIDC)
                }
                template={ template }
            />
        </ResourceTab.Pane>
    );

    const ApplicationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <ApplicationSettings
                appId={ application.id }
                appName={ application.name }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                isInboundProtocolConfigRequestLoading={ isInboundProtocolConfigRequestLoading }
                inboundProtocolConfig={ inboundProtocolConfig }
                inboundProtocols={ inboundProtocolList }
                featureConfig={ featureConfig }
            />
        </ResourceTab.Pane>
    );

    const AttributeSettingTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <AttributeSettings
                appId={ application.id }
                claimConfigurations={ application.claimConfiguration }
                featureConfig={ featureConfig }
                isOIDCConfigured={
                    inboundProtocolList.some((protocol) => protocol.id === SupportedAuthProtocolTypes.OIDC)
                }
            />
        </ResourceTab.Pane>
    );


    const SignOnMethodsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <SignOnMethods
                appId={ application.id }
                authenticationSequence={ application.authenticationSequence }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                featureConfig={ featureConfig }
            />
        </ResourceTab.Pane>
    );

    const AdvancedSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <AdvanceSettings
                appId={ application.id }
                advancedConfigurations={ application.advancedConfigurations }
                onUpdate={ onUpdate }
                featureConfig={ featureConfig }
            />
        </ResourceTab.Pane>
    );

    const ProvisioningSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <ProvisioningSettings
                appId={ application.id }
                provisioningConfigurations={ application.provisioningConfigurations }
                onUpdate={ onUpdate }
                featureConfig={ featureConfig }
            />
        </ResourceTab.Pane>
    );

    /**
     * Resolves the tab panes based on the application config.
     *
     * @return {any[]} Resolved tab panes.
     */
    const resolveTabPanes = (): any[] => {
        const panes: any[] = [];

        if (featureConfig) {
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_GENERAL_SETTINGS"))) {

                panes.push({
                    menuItem: "General",
                    render: GeneralApplicationSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ACCESS_CONFIG"))) {

                panes.push({
                    menuItem: "Access",
                    render: ApplicationSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ATTRIBUTE_MAPPING"))) {

                panes.push({
                    menuItem: "Attributes",
                    render: AttributeSettingTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_SIGN_ON_METHOD_CONFIG"))) {

                panes.push({
                    menuItem: "Sign-on Method",
                    render: SignOnMethodsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_PROVISIONING_SETTINGS"))) {

                panes.push({
                    menuItem: "Provisioning",
                    render: ProvisioningSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ADVANCED_SETTINGS"))) {

                panes.push({
                    menuItem: "Advanced",
                    render: AdvancedSettingsTabPane
                });
            }

            return panes;
        }

        return [
            {
                menuItem: "General",
                render: GeneralApplicationSettingsTabPane
            },
            {
                menuItem: "Access",
                render: ApplicationSettingsTabPane
            }, {
                menuItem: "Attribute",
                render: AttributeSettingTabPane
            },
            {
                menuItem: "Sign-on Method",
                render: SignOnMethodsTabPane
            },
            {
                menuItem: "Provisioning",
                render: ProvisioningSettingsTabPane
            },
            {
                menuItem: "Advanced",
                render: AdvancedSettingsTabPane
            }
        ];
    };

    return (
        application && !isInboundProtocolsRequestLoading ?
            <ResourceTab panes={ resolveTabPanes() }/> : <ContentLoader/>
    );
};
