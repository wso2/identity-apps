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
import { AlertLevels, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, ResourceTab } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { InboundProtocolsMeta } from "./meta";
import {
  AccessConfiguration,
  AdvancedSettings,
  AttributeSettings,
  GeneralApplicationSettings,
  ProvisioningSettings,
  SignOnMethods
} from "./settings";
import { ComponentExtensionPlaceholder } from "../../../extensions";
import { AppState, CORSOriginsListInterface, FeatureConfigInterface, getCORSOrigins } from "../../core";
import { getInboundProtocolConfig } from "../api";
import { ApplicationManagementConstants } from "../constants";
import {
    ApplicationInterface,
    ApplicationTemplateListItemInterface,
    AuthProtocolMetaListItemInterface,
    SupportedAuthProtocolTypes
} from "../models";
import { ApplicationManagementUtils } from "../utils";

/**
 * Proptypes for the applications edit component.
 */
interface EditApplicationPropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * Default active tab index.
     */
    defaultActiveIndex?: number;
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
    /**
     * Callback to see if tab extensions are available
     */
    isTabExtensionsAvailable: (isAvailable: boolean) => void;
}

/**
 * Application edit component.
 *
 * @param {EditApplicationPropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const EditApplication: FunctionComponent<EditApplicationPropsInterface> = (
    props: EditApplicationPropsInterface
): ReactElement => {

    const {
        application,
        defaultActiveIndex,
        featureConfig,
        isLoading,
        onDelete,
        onUpdate,
        template,
        isTabExtensionsAvailable,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const availableInboundProtocols: AuthProtocolMetaListItemInterface[] =
        useSelector((state: AppState) => state.application.meta.inboundProtocols);

    const [isInboundProtocolConfigRequestLoading, setIsInboundProtocolConfigRequestLoading] = useState<boolean>(true);
    const [inboundProtocolList, setInboundProtocolList] = useState<string[]>([]);
    const [inboundProtocolConfig, setInboundProtocolConfig] = useState<any>(undefined);
    const [isInboundProtocolsRequestLoading, setInboundProtocolsRequestLoading] = useState<boolean>(false);
    const [tabPaneExtensions, setTabPaneExtensions] = useState<any>(undefined);
    const [ allowedOrigins, setAllowedOrigins ] = useState([]);
    const [ isAllowedOriginsUpdated, setIsAllowedOriginsUpdated ] = useState<boolean>(false);

    /**
     * Fetch the allowed origins list whenever there's an update.
     */
    useEffect(() => {
        const allowedCORSOrigins = [];
        getCORSOrigins()
            .then((response: CORSOriginsListInterface[]) => {
                response.map((origin) => {
                    allowedCORSOrigins.push(origin.url);
                });
                setAllowedOrigins(allowedCORSOrigins);
            })
            .catch((error) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.applications.notifications.fetchAllowedCORSOrigins." +
                            "error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.applications.notifications.fetchAllowedCORSOrigins" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.applications.notifications.fetchAllowedCORSOrigins." +
                        "genericError.message")
                }));
            });
    }, [ isAllowedOriginsUpdated ]);

    useEffect(() => {
        if (tabPaneExtensions) {
            isTabExtensionsAvailable(true);
            return;
        }

        setTabPaneExtensions(ComponentExtensionPlaceholder({ 
            component: "application", 
            subComponent: "edit", 
            type: "tab" 
        })) ;
    }, [tabPaneExtensions]);

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
    }, [application?.inboundProtocols]);

    /**
     * Todo Remove this mapping and fix the backend.
     */
    const mapProtocolTypeToName = ((type: string): string => {
        let protocolName = type;
        if (protocolName === "oauth2") {
            protocolName = SupportedAuthProtocolTypes.OIDC;
        } else if (protocolName === "passivests") {
            protocolName = SupportedAuthProtocolTypes.WS_FEDERATION;
        } else if (protocolName === "wstrust") {
            protocolName = SupportedAuthProtocolTypes.WS_TRUST;
        } else if (protocolName === "samlsso") {
            protocolName = SupportedAuthProtocolTypes.SAML;
        }

        return protocolName;
    });

    /**
     * Finds the configured inbound protocol.
     */
    const findConfiguredInboundProtocol = (appId): void => {

        let protocolConfigs: any = {};
        const selectedProtocolList: string[] = [];

        application.inboundProtocols.map((protocol) => {

            const protocolName = mapProtocolTypeToName(protocol.type);

            setIsInboundProtocolConfigRequestLoading(true);

            getInboundProtocolConfig(appId, protocolName)
                .then((response) => {
                    protocolConfigs = {
                        ...protocolConfigs,
                        [protocolName]: response
                    };

                    selectedProtocolList.push(protocolName);
                })
                .catch((error) => {
                    if (error?.response?.status === 404) {
                        return;
                    }

                    if (error?.response && error?.response?.data && error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: t("devPortal:components.applications.notifications.getInboundProtocolConfig" +
                                ".error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("devPortal:components.applications.notifications.getInboundProtocolConfig" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.applications.notifications.getInboundProtocolConfig" +
                            ".genericError.message")
                    }));
                })
                .finally(() => {
                    setInboundProtocolList(selectedProtocolList);
                    setInboundProtocolConfig(protocolConfigs);
                    setIsInboundProtocolConfigRequestLoading(false);
                });
        });
    };

    const GeneralApplicationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <GeneralApplicationSettings
                accessUrl={ application.accessUrl }
                appId={ application.id }
                certificate={ application.advancedConfigurations?.certificate }
                description={ application.description }
                discoverability={ application.advancedConfigurations?.discoverableByEndUsers }
                imageUrl={ application.imageUrl }
                name={ application.name }
                isLoading={ isLoading }
                onDelete={ onDelete }
                onUpdate={ onUpdate }
                featureConfig={ featureConfig }
                template={ template }
                data-testid={ `${ testId }-general-settings` }
            />
        </ResourceTab.Pane>
    );

    const ApplicationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AccessConfiguration
                allowedOriginList={ allowedOrigins }
                onAllowedOriginsUpdate={ () => setIsAllowedOriginsUpdated(!isAllowedOriginsUpdated) }
                appId={ application.id }
                appName={ application.name }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                isInboundProtocolConfigRequestLoading={ isInboundProtocolConfigRequestLoading }
                inboundProtocolConfig={ inboundProtocolConfig }
                inboundProtocols={ inboundProtocolList }
                featureConfig={ featureConfig }
                data-testid={ `${ testId }-access-settings` }
            />
        </ResourceTab.Pane>
    );

    const AttributeSettingTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AttributeSettings
                appId={ application.id }
                claimConfigurations={ application.claimConfiguration }
                featureConfig={ featureConfig }
                onlyOIDCConfigured={
                    inboundProtocolList.length === 1 && (inboundProtocolList[0] === SupportedAuthProtocolTypes.OIDC)
                }
                onUpdate={ onUpdate }
                data-testid={ `${ testId }-attribute-settings` }
            />
        </ResourceTab.Pane>
    );


    const SignOnMethodsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <SignOnMethods
                appId={ application.id }
                authenticationSequence={ application.authenticationSequence }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                featureConfig={ featureConfig }
                data-testid={ `${ testId }-sign-on-methods` }
            />
        </ResourceTab.Pane>
    );

    const AdvancedSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AdvancedSettings
                appId={ application.id }
                advancedConfigurations={ application.advancedConfigurations }
                onUpdate={ onUpdate }
                featureConfig={ featureConfig }
                data-testid={ `${ testId }-advanced-settings` }
            />
        </ResourceTab.Pane>
    );

    const ProvisioningSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <ProvisioningSettings
                application={ application }
                provisioningConfigurations={ application.provisioningConfigurations }
                onUpdate={ onUpdate }
                featureConfig={ featureConfig }
                data-testid={ `${ testId }-provisioning-settings` }
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

        if (tabPaneExtensions && tabPaneExtensions.length > 0) {
            panes.push(...tabPaneExtensions);
        }

        if (featureConfig) {
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_GENERAL_SETTINGS"))) {

                panes.push({
                    menuItem: t("devPortal:components.applications.edit.sections.general.tabName"),
                    render: GeneralApplicationSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ACCESS_CONFIG"))) {

                panes.push({
                    menuItem: t("devPortal:components.applications.edit.sections.access.tabName"),
                    render: ApplicationSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ATTRIBUTE_MAPPING"))) {

                panes.push({
                    menuItem: t("devPortal:components.applications.edit.sections.attributes.tabName"),
                    render: AttributeSettingTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_SIGN_ON_METHOD_CONFIG"))) {

                panes.push({
                    menuItem: t("devPortal:components.applications.edit.sections.signOnMethod.tabName"),
                    render: SignOnMethodsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_PROVISIONING_SETTINGS"))) {

                panes.push({
                    menuItem: t("devPortal:components.applications.edit.sections.provisioning.tabName"),
                    render: ProvisioningSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ADVANCED_SETTINGS"))) {

                panes.push({
                    menuItem: t("devPortal:components.applications.edit.sections.advanced.tabName"),
                    render: AdvancedSettingsTabPane
                });
            }

            return panes;
        }

        return [
            {
                menuItem: t("devPortal:components.applications.edit.sections.general.tabName"),
                render: GeneralApplicationSettingsTabPane
            },
            {
                menuItem: t("devPortal:components.applications.edit.sections.access.tabName"),
                render: ApplicationSettingsTabPane
            },
            {
                menuItem: t("devPortal:components.applications.edit.sections.attributes.tabName"),
                render: AttributeSettingTabPane
            },
            {
                menuItem: t("devPortal:components.applications.edit.sections.signOnMethod.tabName"),
                render: SignOnMethodsTabPane
            },
            {
                menuItem: t("devPortal:components.applications.edit.sections.provisioning.tabName"),
                render: ProvisioningSettingsTabPane
            },
            {
                menuItem: t("devPortal:components.applications.edit.sections.advanced.tabName"),
                render: AdvancedSettingsTabPane
            }
        ];
    };

    return (
        application && !isInboundProtocolsRequestLoading
            ? <ResourceTab panes={ resolveTabPanes() } defaultActiveIndex={ defaultActiveIndex } />
            : <ContentLoader/>
    );
};

/**
 * Default props for the application edit component.
 */
EditApplication.defaultProps = {
    "data-testid": "edit-application"
};
