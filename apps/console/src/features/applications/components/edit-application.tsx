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
import _ from "lodash";
import isEmpty from "lodash/isEmpty";
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
import { ComponentExtensionPlaceholder } from "../../../extensions";
import { AppState, CORSOriginsListInterface, FeatureConfigInterface, getCORSOrigins } from "../../core";
import { getInboundProtocolConfig } from "../api";
import { ApplicationManagementConstants } from "../constants";
import {
    ApplicationInterface,
    ApplicationTemplateInterface,
    AuthProtocolMetaListItemInterface,
    OIDCDataInterface,
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
    const isClientSecretHashEnabled: boolean = useSelector((state: AppState) =>
        state.config.ui.isClientSecretHashEnabled);

    const [ isInboundProtocolConfigRequestLoading, setIsInboundProtocolConfigRequestLoading ] = useState<boolean>(true);
    const [ inboundProtocolList, setInboundProtocolList ] = useState<string[]>([]);
    const [ inboundProtocolConfig, setInboundProtocolConfig ] = useState<any>(undefined);
    const [ isInboundProtocolsRequestLoading, setInboundProtocolsRequestLoading ] = useState<boolean>(false);
    const [ tabPaneExtensions, setTabPaneExtensions ] = useState<any>(undefined);
    const [ allowedOrigins, setAllowedOrigins ] = useState([]);
    const [ isAllowedOriginsUpdated, setIsAllowedOriginsUpdated ] = useState<boolean>(false);
    const [ showClientSecretHashDisclaimerModal, setShowClientSecretHashDisclaimerModal ] = useState<boolean>(false);
    const [
        clientSecretHashDisclaimerModalInputs,
        setClientSecretHashDisclaimerModalInputs
    ] = useState<{ clientSecret: string; clientId: string }>({ clientId: "", clientSecret: "" });

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

    useEffect(() => {
        if (tabPaneExtensions) {
            return;
        }

        if (!template?.content?.quickStart || !application?.id || isInboundProtocolConfigRequestLoading) {
            return;
        }

        const extensions: any[] = ComponentExtensionPlaceholder({
            component: "application",
            props: {
                application: application,
                content: template.content.quickStart,
                inboundProtocolConfig: inboundProtocolConfig,
                inboundProtocols: inboundProtocolList,
                template: template
            },
            subComponent: "edit",
            type: "tab"
        });

        if (Array.isArray(extensions) && extensions.length > 0) {
            isTabExtensionsAvailable(true);
        }

        setTabPaneExtensions(extensions);
    }, [
        tabPaneExtensions,
        template,
        application,
        inboundProtocolList,
        inboundProtocolConfig,
        isInboundProtocolConfigRequestLoading
    ]);

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
        if (protocolConfigs[key]) {
            const assertion = protocolConfigs[key].singleSignOnProfile?.assertion;
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
                readOnly={ readOnly }
                data-testid={ `${ testId }-general-settings` }
            />
        </ResourceTab.Pane>
    );

    const ApplicationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AccessConfiguration
                allowedOriginList={ allowedOrigins }
                onAllowedOriginsUpdate={ () => setIsAllowedOriginsUpdated(!isAllowedOriginsUpdated) }
                onApplicationSecretRegenerate={ handleApplicationSecretRegenerate }
                appId={ application.id }
                appName={ application.name }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                isInboundProtocolConfigRequestLoading={ isInboundProtocolConfigRequestLoading }
                inboundProtocolsLoading={ isInboundProtocolConfigRequestLoading }
                inboundProtocolConfig={ inboundProtocolConfig }
                inboundProtocols={ inboundProtocolList }
                featureConfig={ featureConfig }
                readOnly={ readOnly }
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
                    inboundProtocolList.length === 1 && (inboundProtocolList[ 0 ] === SupportedAuthProtocolTypes.OIDC)
                }
                onUpdate={ onUpdate }
                readOnly={ readOnly }
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
                onUpdate={ onUpdate }
                featureConfig={ featureConfig }
                readOnly={ readOnly }
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
                readOnly={ readOnly }
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
            if (isFeatureEnabled(featureConfig?.applications,
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
            {
                menuItem: t("console:develop.features.applications.edit.sections.provisioning.tabName"),
                render: ProvisioningSettingsTabPane
            },
            {
                menuItem: t("console:develop.features.applications.edit.sections.advanced.tabName"),
                render: AdvancedSettingsTabPane
            }
        ];
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
                                            "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientSecret.label")
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
            ? (
                <>
                    <ResourceTab
                        data-testid={ `${ testId }-resource-tabs` }
                        panes={ resolveTabPanes() }
                        defaultActiveIndex={ defaultActiveIndex }
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
