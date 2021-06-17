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
import { ConfirmationModal, ContentLoader, CopyInputField, ResourceTab } from "@wso2is/react-components";
import Axios from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Form, Grid } from "semantic-ui-react";
import { InboundProtocolsMeta } from "./meta";
import {
    AccessConfiguration,
    AdvancedSettings,
    AttributeSettings,
    GeneralApplicationSettings,
    ProvisioningSettings,
    SignOnMethods
} from "./settings";
import { Info } from "./settings/info";
import { ComponentExtensionPlaceholder, applicationConfig } from "../../../extensions";
import { AppState, CORSOriginsListInterface, FeatureConfigInterface, getCORSOrigins } from "../../core";
import { getInboundProtocolConfig } from "../api";
import { ApplicationManagementConstants } from "../constants";
import {
    ApplicationInterface,
    ApplicationTemplateInterface,
    AuthProtocolMetaListItemInterface,
    OIDCApplicationConfigurationInterface,
    OIDCDataInterface,
    SAMLApplicationConfigurationInterface,
    SupportedAuthProtocolTypes
} from "../models";
import { ApplicationManagementUtils } from "../utils";
import SAMLApplicationTemplate
    from "../data/application-templates/templates/saml-web-application/saml-web-application.json";
import CustomApplicationTemplate
    from "../data/application-templates/templates/custom-application/custom-application.json";

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
     * Used to the configured inbound protocols list from the parent component.
     */
    getConfiguredInboundProtocolsList?: (list: string[]) => void;
    /**
     * Used to the configured inbound protocol configs from the parent component.
     */
    getConfiguredInboundProtocolConfigs?: (configs: object) => void;
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
    template?: ApplicationTemplateInterface;
    /**
     * Callback to see if tab extensions are available
     */
    isTabExtensionsAvailable: (isAvailable: boolean) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * URL Search params received to the parent edit page component.
     */
    urlSearchParams?: URLSearchParams;
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
        getConfiguredInboundProtocolsList,
        getConfiguredInboundProtocolConfigs,
        onDelete,
        onUpdate,
        template,
        isTabExtensionsAvailable,
        readOnly,
        urlSearchParams,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const availableInboundProtocols: AuthProtocolMetaListItemInterface[] =
        useSelector((state: AppState) => state.application.meta.inboundProtocols);
    const oidcConfigurations: OIDCApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.oidcConfigurations);
    const samlConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.samlConfigurations);
    const isClientSecretHashEnabled: boolean = useSelector((state: AppState) =>
        state.config.ui.isClientSecretHashEnabled);

    const [ isInboundProtocolConfigRequestLoading, setIsInboundProtocolConfigRequestLoading ] = useState<boolean>(true);
    const [ inboundProtocolList, setInboundProtocolList ] = useState<string[]>([]);
    const [ inboundProtocolConfig, setInboundProtocolConfig ] = useState<any>(undefined);
    const [ isInboundProtocolsRequestLoading, setInboundProtocolsRequestLoading ] = useState<boolean>(false);
    const [ tabPaneExtensions, setTabPaneExtensions ] = useState<any>(undefined);
    const [ allowedOrigins, setAllowedOrigins ] = useState([]);
    const [ isAllowedOriginsUpdated, setIsAllowedOriginsUpdated ] = useState<boolean>(false);
    const [ isApplicationUpdated, setIsApplicationUpdated ] = useState<boolean>(false);
    const [ showClientSecretHashDisclaimerModal, setShowClientSecretHashDisclaimerModal ] = useState<boolean>(false);
    const [
        clientSecretHashDisclaimerModalInputs,
        setClientSecretHashDisclaimerModalInputs
    ] = useState<{ clientSecret: string; clientId: string }>({ clientId: "", clientSecret: "" });
    const [ isOIDCConfigsLoading, setOIDCConfigsLoading ] = useState<boolean>(false);
    const [ isSAMLConfigsLoading, setSAMLConfigsLoading ] = useState<boolean>(false);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(undefined);

    /**
     * Called when an application updates.
     *
     * @param {string} id - Application id.
     */
    const handleApplicationUpdate = (id: string): void => {
        setIsApplicationUpdated(true);
        onUpdate(id);
    };

    /**
     * Called when the defaultActiveIndex updates.
     */
    useEffect( () => {
        // Change defaultActiveIndex value for custom applications.
        if ((application?.templateId === CustomApplicationTemplate.id
            || application?.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
            || application?.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS
            || application?.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_SAML)
            && !urlSearchParams.get(ApplicationManagementConstants.APP_STATE_PROTOCOL_PARAM_KEY)) {
            setActiveTabIndex(defaultActiveIndex - 1);
            return;
        }
        setActiveTabIndex(defaultActiveIndex);

    },[defaultActiveIndex]);

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
                        message: t("console:develop.features.applications.notifications.fetchAllowedCORSOrigins." +
                            "error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.fetchAllowedCORSOrigins" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.fetchAllowedCORSOrigins." +
                        "genericError.message")
                }));
            });
    }, [ isAllowedOriginsUpdated ]);

    /**
     * Called on `availableInboundProtocols` prop update.
     */
    useEffect(() => {
        if (!isEmpty(availableInboundProtocols)) {
            return;
        }

        setInboundProtocolsRequestLoading(true);

        ApplicationManagementUtils.getInboundProtocols(InboundProtocolsMeta, false)
            .finally(() => {
                setInboundProtocolsRequestLoading(false);
            });
    }, [ availableInboundProtocols ]);

    /**
     * Watch for `inboundProtocols` array change and fetch configured protocols if there's a difference.
     */
    useEffect(() => {
        if (!application?.inboundProtocols || !application?.id) {
            return;
        }

        findConfiguredInboundProtocol(application.id);
    }, [ application?.inboundProtocols ]);

    useEffect(() => {
        if (samlConfigurations !== undefined) {
            return;
        }
        setSAMLConfigsLoading(true);


        ApplicationManagementUtils.getSAMLApplicationMeta()
            .finally(() => {
                setSAMLConfigsLoading(false);
            });
    }, [ samlConfigurations, inboundProtocolConfig ]);

    useEffect(() => {
        if (oidcConfigurations !== undefined) {
            return;
        }
        setOIDCConfigsLoading(true);

        ApplicationManagementUtils.getOIDCApplicationMeta()
            .finally(() => {
                setOIDCConfigsLoading(false);
            });
    }, [ oidcConfigurations, inboundProtocolConfig ]);

    useEffect(() => {
        if (tabPaneExtensions && !isApplicationUpdated) {
            return;
        }

        if (!template?.content?.quickStart || !application?.id || isInboundProtocolConfigRequestLoading) {
            return;
        }

        if (inboundProtocolConfig && samlConfigurations && samlConfigurations.certificate) {
            inboundProtocolConfig.certificate = samlConfigurations.certificate;
            inboundProtocolConfig.ssoUrl = samlConfigurations.ssoUrl;
            inboundProtocolConfig.issuer = samlConfigurations.issuer;
        }

        const extensions: any[] = ComponentExtensionPlaceholder({
            component: "application",
            props: {
                application: application,
                content: template.content.quickStart,
                inboundProtocolConfig: inboundProtocolConfig,
                inboundProtocols: inboundProtocolList,
                onApplicationUpdate: () => {
                    onUpdate(application?.id);
                },
                onTriggerTabUpdate: (tabIndex: number) => {
                    setActiveTabIndex(tabIndex);
                },
                template: template
            },
            subComponent: "edit",
            type: "tab"
        });

        if (Array.isArray(extensions) && extensions.length > 0) {
            isTabExtensionsAvailable(true);
        }

        setTabPaneExtensions(extensions);
        setIsApplicationUpdated(false);
    }, [
        tabPaneExtensions,
        template,
        application,
        inboundProtocolList,
        inboundProtocolConfig,
        isInboundProtocolConfigRequestLoading
    ]);

    useEffect(() => {

        if (!urlSearchParams.get(ApplicationManagementConstants.APP_STATE_URL_SEARCH_PARAM_KEY)) {
            return;
        }

        setShowClientSecretHashDisclaimerModal(true);
    }, [ urlSearchParams.get(ApplicationManagementConstants.CLIENT_SECRET_HASH_ENABLED_URL_SEARCH_PARAM_KEY) ]);

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
     * This function will normalize the SAML name ID format
     * returned by the API.
     *
     * @param {any} protocolConfigs
     */
    const normalizeSAMLNameIDFormat = (protocolConfigs: any): void => {
        const key = "saml";
        if (protocolConfigs[ key ]) {
            const assertion = protocolConfigs[ key ].singleSignOnProfile?.assertion;
            if (assertion) {
                const ref = assertion.nameIdFormat as string;
                assertion.nameIdFormat = ref.replace(/\//g, ":");
            }
        }
    };

    /**
     * Finds the configured inbound protocol.
     */
    const findConfiguredInboundProtocol = (appId): void => {
        let protocolConfigs: any = {};
        const selectedProtocolList: string[] = [];
        const inboundProtocolRequests: Promise<any>[] = [];
        const protocolNames: string[] = [];

        if (application?.inboundProtocols?.length > 0) {
            application.inboundProtocols.forEach((protocol) => {

                if (protocol.type === "openid") {
                    return;
                }

                const protocolName = mapProtocolTypeToName(protocol.type);

                protocolNames.push(protocolName);

                inboundProtocolRequests.push(getInboundProtocolConfig(appId, protocolName));
            });

            setIsInboundProtocolConfigRequestLoading(true);
            Axios.all(inboundProtocolRequests).then(Axios.spread((...responses) => {
                responses.forEach((response, index: number) => {
                    protocolConfigs = {
                        ...protocolConfigs,
                        [ protocolNames[ index ] ]: response
                    };

                    selectedProtocolList.push(protocolNames[ index ]);
                });

            }))
                .catch((error) => {
                    if (error?.response?.status === 404) {
                        return;
                    }

                    if (error?.response && error?.response?.data && error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.applications.notifications.getInboundProtocolConfig" +
                                ".error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("console:develop.features.applications.notifications.getInboundProtocolConfig" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.getInboundProtocolConfig" +
                            ".genericError.message")
                    }));
                })
                .finally(() => {

                    // Mutate the saml: NameIDFormat property according to the specification.
                    normalizeSAMLNameIDFormat(protocolConfigs);

                    setIsApplicationUpdated(true);
                    setInboundProtocolList(selectedProtocolList);
                    setInboundProtocolConfig(protocolConfigs);
                    setIsInboundProtocolConfigRequestLoading(false);
                    getConfiguredInboundProtocolsList(selectedProtocolList);
                    getConfiguredInboundProtocolConfigs(protocolConfigs);
                });
        } else {
            setInboundProtocolList([]);
            setInboundProtocolConfig({});
            setIsInboundProtocolConfigRequestLoading(false);
            getConfiguredInboundProtocolsList([]);
            getConfiguredInboundProtocolConfigs({});
        }
    };

    /**
     * Called when an application updates.
     *
     * @param {string} id - Application id.
     */
    const handleProtocolUpdate = (): void => {
        if (!application?.id) {
            return;
        }

        findConfiguredInboundProtocol(application.id);
    };

    /**
     * Handles application secret regenerate.
     * @param {OIDCDataInterface} config - Config response.
     */
    const handleApplicationSecretRegenerate = (config: OIDCDataInterface): void => {

        if (isEmpty(config) || !config.clientSecret || !config.clientId) {
            return;
        }

        setClientSecretHashDisclaimerModalInputs({
            clientId: config.clientId,
            clientSecret: config.clientSecret
        });
        setShowClientSecretHashDisclaimerModal(true);
    };

    const GeneralApplicationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <GeneralApplicationSettings
                accessUrl={ application.accessUrl }
                appId={ application.id }
                description={ application.description }
                discoverability={ application.advancedConfigurations?.discoverableByEndUsers }
                hiddenFields={ [ "imageUrl" ] }
                imageUrl={ application.imageUrl }
                name={ application.name }
                isLoading={ isLoading }
                onDelete={ onDelete }
                onUpdate={ handleApplicationUpdate }
                featureConfig={ featureConfig }
                template={ template }
                readOnly={ readOnly }
                data-testid={ `${ testId }-general-settings` }
            />
        </ResourceTab.Pane>
    );

    const ApplicationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AccessConfiguration
                allowedOriginList={ allowedOrigins }
                certificate={ application.advancedConfigurations?.certificate }
                onAllowedOriginsUpdate={ () => setIsAllowedOriginsUpdated(!isAllowedOriginsUpdated) }
                onApplicationSecretRegenerate={ handleApplicationSecretRegenerate }
                appId={ application.id }
                appName={ application.name }
                applicationTemplateId={ application.templateId }
                extendedAccessConfig={ tabPaneExtensions !== undefined }
                isLoading={ isLoading }
                onUpdate={ handleApplicationUpdate }
                onProtocolUpdate = { handleProtocolUpdate }
                isInboundProtocolConfigRequestLoading={ isInboundProtocolConfigRequestLoading }
                inboundProtocolsLoading={ isInboundProtocolConfigRequestLoading }
                inboundProtocolConfig={ inboundProtocolConfig }
                inboundProtocols={ inboundProtocolList }
                featureConfig={ featureConfig }
                template={ template }
                readOnly={ readOnly }
                data-testid={ `${ testId }-access-settings` }
            />
        </ResourceTab.Pane>
    );

    const AttributeSettingTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AttributeSettings
                appId={ application.id }
                technology={ application.inboundProtocols }
                claimConfigurations={ application.claimConfiguration }
                featureConfig={ featureConfig }
                onlyOIDCConfigured={
                    (application?.templateId === CustomApplicationTemplate.id
                        || application?.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC)
                    && inboundProtocolList.length === 0
                        ? true
                        : inboundProtocolList.length === 1
                        && (inboundProtocolList[ 0 ] === SupportedAuthProtocolTypes.OIDC)
                }
                onUpdate={ handleApplicationUpdate }
                readOnly={ readOnly }
                data-testid={ `${ testId }-attribute-settings` }
            />
        </ResourceTab.Pane>
    );


    const SignOnMethodsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <SignOnMethods
                application={ application }
                appId={ application.id }
                authenticationSequence={ application.authenticationSequence }
                isLoading={ isLoading }
                onUpdate={ handleApplicationUpdate }
                featureConfig={ featureConfig }
                readOnly={ readOnly }
                data-testid={ `${ testId }-sign-on-methods` }
            />
        </ResourceTab.Pane>
    );

    const AdvancedSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AdvancedSettings
                appId={ application.id }
                advancedConfigurations={ application.advancedConfigurations }
                onUpdate={ handleApplicationUpdate }
                featureConfig={ featureConfig }
                readOnly={ readOnly }
                data-testid={ `${ testId }-advanced-settings` }
            />
        </ResourceTab.Pane>
    );

    const ProvisioningSettingsTabPane = (): ReactElement => (
        applicationConfig.editApplication.showProvisioningSettings
            ? < ResourceTab.Pane controlledSegmentation>
                <ProvisioningSettings
                    application={ application }
                    provisioningConfigurations={ application.provisioningConfigurations }
                    onUpdate={ handleApplicationUpdate }
                    featureConfig={ featureConfig }
                    readOnly={ readOnly }
                    data-testid={ `${ testId }-provisioning-settings` }
                />
            </ResourceTab.Pane>
            : null
    );

    const InfoTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <Info
                inboundProtocols={ application?.inboundProtocols }
                isOIDCConfigLoading={ isOIDCConfigsLoading }
                isSAMLConfigLoading={ isSAMLConfigsLoading }
                templateId={ application?.templateId }
                data-testid={ `${ testId }-server-endpoints` }
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

        if (!tabPaneExtensions && applicationConfig.editApplication.extendTabs
            && application?.templateId !== ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
            && application?.templateId !== ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS
            && application?.templateId !== ApplicationManagementConstants.CUSTOM_APPLICATION_SAML) {
            return [];
        }

        if (tabPaneExtensions && tabPaneExtensions.length > 0
            && application?.templateId !== CustomApplicationTemplate.id
            && application?.templateId !== ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
            && application?.templateId !== ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS
            && application?.templateId !== ApplicationManagementConstants.CUSTOM_APPLICATION_SAML) {
            panes.push(...tabPaneExtensions);
        }

        if (featureConfig) {
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_GENERAL_SETTINGS"))) {

                panes.push({
                    menuItem: t("console:develop.features.applications.edit.sections.general.tabName"),
                    render: GeneralApplicationSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ACCESS_CONFIG"))) {

                panes.push({
                    menuItem: t("console:develop.features.applications.edit.sections.access.tabName"),
                    render: ApplicationSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ATTRIBUTE_MAPPING"))) {

                panes.push({
                    menuItem: t("console:develop.features.applications.edit.sections.attributes.tabName"),
                    render: AttributeSettingTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_SIGN_ON_METHOD_CONFIG"))) {

                panes.push({
                    menuItem: t("console:develop.features.applications.edit.sections.signOnMethod.tabName"),
                    render: SignOnMethodsTabPane
                });
            }

            if (applicationConfig.editApplication.showProvisioningSettings
                && isFeatureEnabled(featureConfig?.applications,
                    ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_PROVISIONING_SETTINGS"))) {

                panes.push({
                    menuItem: t("console:develop.features.applications.edit.sections.provisioning.tabName"),
                    render: ProvisioningSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ADVANCED_SETTINGS"))) {

                panes.push({
                    menuItem: t("console:develop.features.applications.edit.sections.advanced.tabName"),
                    render: AdvancedSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_INFO"))) {

                panes.push({
                    menuItem: {
                        content: t("console:develop.features.applications.edit.sections.info.tabName"),
                        icon: "info circle grey"
                    },
                    render: InfoTabPane
                });
            }

            return panes;
        }

        return [
            {
                menuItem: t("console:develop.features.applications.edit.sections.general.tabName"),
                render: GeneralApplicationSettingsTabPane
            },
            {
                menuItem: t("console:develop.features.applications.edit.sections.access.tabName"),
                render: ApplicationSettingsTabPane
            },
            {
                menuItem: t("console:develop.features.applications.edit.sections.attributes.tabName"),
                render: AttributeSettingTabPane
            },
            {
                menuItem: t("console:develop.features.applications.edit.sections.signOnMethod.tabName"),
                render: SignOnMethodsTabPane
            },
            applicationConfig.editApplication.showProvisioningSettings && {
                menuItem: t("console:develop.features.applications.edit.sections.provisioning.tabName"),
                render: ProvisioningSettingsTabPane
            },
            {
                menuItem: t("console:develop.features.applications.edit.sections.advanced.tabName"),
                render: AdvancedSettingsTabPane
            },
            {
                menuItem: {
                    content: t("console:develop.features.applications.edit.sections.info.tabName"),
                    icon: "info circle grey"
                },
                render: InfoTabPane
            }
        ];
    };

    /**
     * Handles the tab change.
     */
    const handleTabChange = (e, { activeIndex }): void => {
        setActiveTabIndex(activeIndex);
    };

    /**
     * Renders the client secret hash disclaimer modal.
     * @return {React.ReactElement}
     */
    const renderClientSecretHashDisclaimerModal = (): ReactElement => {

        // If client hashing is disabled, don't show the modal.
        if (!isClientSecretHashEnabled) {
            return null;
        }

        const isOIDCConfigured: boolean = inboundProtocolList.includes(SupportedAuthProtocolTypes.OIDC);

        if (!isOIDCConfigured
            || isEmpty(inboundProtocolConfig?.oidc)
            || !inboundProtocolConfig.oidc.clientId
            || !inboundProtocolConfig.oidc.clientSecret) {

            return null;
        }

        const clientSecret: string = clientSecretHashDisclaimerModalInputs.clientSecret
            || inboundProtocolConfig.oidc.clientSecret;
        const clientId: string = clientSecretHashDisclaimerModalInputs.clientId
            || inboundProtocolConfig.oidc.clientId;

        return (
            <ConfirmationModal
                data-testid={ `${ testId }-client-secret-hash-disclaimer-modal` }
                type="warning"
                open={ true }
                primaryAction={ t("common:confirm") }
                onPrimaryActionClick={ (): void => {
                    setShowClientSecretHashDisclaimerModal(false);
                    setClientSecretHashDisclaimerModalInputs({
                        clientId: "",
                        clientSecret: ""
                    });
                } }
            >
                <ConfirmationModal.Header
                    data-testid={ `${ testId }-client-secret-hash-disclaimer-modal-header` }
                >
                    {
                        t("console:develop.features.applications.confirmations.clientSecretHashDisclaimer" +
                            ".modal.header")
                    }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                    data-testid={ `${ testId }-client-secret-hash-disclaimer-modal-message` }
                >
                    {
                        t("console:develop.features.applications.confirmations.clientSecretHashDisclaimer" +
                            ".modal.message")
                    }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-testid={ `${ testId }-client-secret-hash-disclaimer-modal-content` }
                >
                    <Form>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <label>
                                        {
                                            t("console:develop.features.applications.confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientId.label")
                                        }
                                    </label>
                                    <CopyInputField
                                        value={ clientId }
                                        hideSecretLabel={
                                            t("console:develop.features.applications.confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientId.hide")
                                        }
                                        showSecretLabel={
                                            t("console:develop.features.applications.confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientId.show")
                                        }
                                        data-testid={ `${ testId }-client-secret-readonly-input` }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("console:develop.features.applications.confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm." +
                                                "clientSecret.label")
                                        }
                                    </label>
                                    <CopyInputField
                                        secret
                                        value={ clientSecret }
                                        hideSecretLabel={
                                            t("console:develop.features.applications.confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientSecret.hide")
                                        }
                                        showSecretLabel={
                                            t("console:develop.features.applications.confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientSecret.show")
                                        }
                                        data-testid={ `${ testId }-client-secret-readonly-input` }
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    </Form>
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    return (
        application && !isInboundProtocolsRequestLoading
        && (tabPaneExtensions || !applicationConfig.editApplication.extendTabs
            || application?.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
            || application?.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS
            || application?.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_SAML )
            ? (
                <>
                    <ResourceTab
                        activeIndex= { activeTabIndex }
                        data-testid= { `${testId}-resource-tabs` }
                        defaultActiveIndex={ defaultActiveIndex }
                        onTabChange={ handleTabChange }
                        panes= { resolveTabPanes() }
                    />
                    { showClientSecretHashDisclaimerModal && renderClientSecretHashDisclaimerModal() }
                </>
            )
            : <ContentLoader />
    );
};

/**
 * Default props for the application edit component.
 */
EditApplication.defaultProps = {
    "data-testid": "edit-application",
    getConfiguredInboundProtocolConfigs: () => null,
    getConfiguredInboundProtocolsList: () => null
};
