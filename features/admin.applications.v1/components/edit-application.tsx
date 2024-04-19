/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    CopyInputField,
    ResourceTab,
    ResourceTabPaneInterface
} from "@wso2is/react-components";
import Axios, { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Form, Grid, Menu, TabProps } from "semantic-ui-react";
import { ApplicationEditForm } from "./dynamic-forms/application-edit-form";
import { MarkdownGuide } from "./help-panel/markdown-guide";
import { InboundProtocolsMeta } from "./meta";
import {
    AccessConfiguration,
    AdvancedSettings,
    AttributeSettings,
    GeneralApplicationSettings,
    ProvisioningSettings,
    SharedAccess,
    SignOnMethods
} from "./settings";
import { Info } from "./settings/info";
import {
    AppState,
    CORSOriginsListInterface,
    EventPublisher,
    FeatureConfigInterface,
    getCORSOrigins,
    history
} from "../../admin.core.v1";
import useUIConfig from "../../admin.core.v1/hooks/use-ui-configs";
import { ApplicationTabIDs, applicationConfig } from "../../admin.extensions.v1";
import { OrganizationType } from "../../admin.organizations.v1/constants";
import { useGetCurrentOrganizationType } from "../../admin.organizations.v1/hooks/use-get-organization-type";
import { getInboundProtocolConfig } from "../api";
import useGetApplicationTemplateMetadata from "../api/use-get-application-template-metadata";
import { ApplicationManagementConstants } from "../constants";
import CustomApplicationTemplate
    from "../data/application-templates/templates/custom-application/custom-application.json";
import {
    ApplicationInterface,
    ApplicationTabTypes,
    ApplicationTemplateIdTypes,
    ApplicationTemplateInterface,
    AuthProtocolMetaListItemInterface,
    InboundProtocolListItemInterface,
    OIDCApplicationConfigurationInterface,
    OIDCDataInterface,
    SAMLApplicationConfigurationInterface,
    SupportedAuthProtocolTypes,
    URLFragmentTypes
} from "../models";
import {
    ApplicationEditTabContentTypes,
    ApplicationEditTabMetadataInterface,
    ApplicationTemplateListInterface
} from "../models/application-templates";
import { ApplicationManagementUtils } from "../utils/application-management-utils";

/**
 * Proptypes for the applications edit component.
 */
interface EditApplicationPropsInterface extends SBACInterface<FeatureConfigInterface>, IdentifiableComponentInterface {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * Used to the configured inbound protocols list from the parent component.
     */
    getConfiguredInboundProtocolsList?: (list: string[]) => void;
    /**
     * Used to the configured inbound protocol configs from the parent component.
     */
    getConfiguredInboundProtocolConfigs?: (configs: Record<string, unknown>) => void;
    /**
     * Is the data still loading.
     */
    isLoading: boolean;
    /**
     * Set is loading.
     */
    setIsLoading?: any;
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
     * Template that exists in the Extension Management API.
     *
     * This will be populated if the current application is created using
     * an application template from the Extension Management API.
     */
    extensionTemplate?: ApplicationTemplateListInterface;
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
 * @param props - Props injected to the component.
 *
 * @returns EditApplication component
 */
export const EditApplication: FunctionComponent<EditApplicationPropsInterface> = (
    props: EditApplicationPropsInterface
): ReactElement => {

    const {
        application,
        featureConfig,
        isLoading,
        setIsLoading,
        getConfiguredInboundProtocolsList,
        getConfiguredInboundProtocolConfigs,
        onDelete,
        onUpdate,
        template,
        extensionTemplate,
        readOnly,
        urlSearchParams,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const { isSuperOrganization, isSubOrganization } = useGetCurrentOrganizationType();
    const dispatch: Dispatch = useDispatch();
    const { UIConfig } = useUIConfig();
    const {
        data: extensionTemplateMetadata,
        isLoading: isExtensionTemplateMetadataFetchRequestLoading,
        error: extensionTemplateMetadataFetchRequestError
    } = useGetApplicationTemplateMetadata(extensionTemplate?.id, !!extensionTemplate);

    const availableInboundProtocols: AuthProtocolMetaListItemInterface[] =
        useSelector((state: AppState) => state.application.meta.inboundProtocols);
    const oidcConfigurations: OIDCApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.oidcConfigurations);
    const samlConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.samlConfigurations);
    const isClientSecretHashEnabled: boolean = useSelector((state: AppState) =>
        state.config.ui.isClientSecretHashEnabled);
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const isFirstLevelOrg: boolean = useSelector(
        (state: AppState) => state.organization.isFirstLevelOrganization
    );
    const orgType: OrganizationType = useSelector((state: AppState) =>
        state?.organization?.organizationType);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ isInboundProtocolConfigRequestLoading, setIsInboundProtocolConfigRequestLoading ] = useState<boolean>(true);
    const [ inboundProtocolList, setInboundProtocolList ] = useState<string[]>(undefined);
    const [ inboundProtocolConfig, setInboundProtocolConfig ] = useState<any>(undefined);
    const [ isInboundProtocolsRequestLoading, setInboundProtocolsRequestLoading ] = useState<boolean>(false);
    const [ tabPaneExtensions, setTabPaneExtensions ] = useState<ResourceTabPaneInterface[]>(undefined);
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
    const [ defaultActiveIndex, setDefaultActiveIndex ] = useState<number>(undefined);
    const [ totalTabs, setTotalTabs ] = useState<number>(undefined);
    const [ isM2MApplication, setM2MApplication ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const isFragmentApp: boolean = application?.advancedConfigurations?.fragment || false;
    const hiddenAuthenticators: string[] = [ ...(UIConfig?.hiddenAuthenticators ?? []) ];

    /**
     * Handle errors that occur during the application template meta data fetch request.
     */
    useEffect(() => {
        if (!extensionTemplateMetadataFetchRequestError) {
            return;
        }

        if (extensionTemplateMetadataFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: extensionTemplateMetadataFetchRequestError?.response?.data?.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications.fetchTemplateMetadata.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchTemplateMetadata" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications." +
                "fetchTemplateMetadata.genericError.message")
        }));
    }, [ extensionTemplateMetadataFetchRequestError ]);

    /**
     * Called when an application updates.
     *
     * @param id - Application id.
     */
    const handleApplicationUpdate = (id: string): void => {
        setIsApplicationUpdated(true);
        onUpdate(id);
    };

    /**
     * Todo Remove this mapping and fix the backend.
     */
    const mapProtocolTypeToName = ((type: string): string => {
        let protocolName: string = type;

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
     * @param protocolConfigs - Protocol config object
     */
    const normalizeSAMLNameIDFormat = (protocolConfigs: any): void => {
        const key: string = "saml";

        if (protocolConfigs[ key ]) {
            const assertion: any = protocolConfigs[ key ].singleSignOnProfile?.assertion;

            if (assertion) {
                const ref: string = assertion.nameIdFormat as string;

                assertion.nameIdFormat = ref.replace(/\//g, ":");
            }
        }
    };

    /**
     * Finds the configured inbound protocol.
     */
    const findConfiguredInboundProtocol = (appId: string): void => {
        let protocolConfigs: any = {};
        const selectedProtocolList: string[] = [];
        const inboundProtocolRequests: Promise<any>[] = [];
        const protocolNames: string[] = [];

        if (application?.inboundProtocols?.length > 0) {
            application.inboundProtocols.forEach((protocol: InboundProtocolListItemInterface) => {

                if (protocol.type === "openid") {
                    return;
                }

                const protocolName: string = mapProtocolTypeToName(protocol.type);

                if(!protocolNames.includes(protocolName)) {
                    protocolNames.push(protocolName);
                    inboundProtocolRequests.push(getInboundProtocolConfig(appId, protocolName));
                }
            });

            setIsInboundProtocolConfigRequestLoading(true);
            Axios.all(inboundProtocolRequests).then(Axios.spread((...responses: AxiosResponse[]) => {
                responses.forEach((response: AxiosResponse, index: number) => {
                    protocolConfigs = {
                        ...protocolConfigs,
                        [ protocolNames[ index ] ]: response
                    };

                    selectedProtocolList.push(protocolNames[ index ]);
                });

            }))
                .catch((error: AxiosError) => {
                    if (error?.response?.status === 404) {
                        return;
                    }

                    if (error?.response && error?.response?.data && error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: t("applications:notifications.getInboundProtocolConfig" +
                                ".error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("applications:notifications.getInboundProtocolConfig" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.getInboundProtocolConfig" +
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
     */
    const handleProtocolUpdate = (): void => {
        if (!application?.id) {
            return;
        }

        findConfiguredInboundProtocol(application.id);
    };

    /**
     * Handles application secret regenerate.
     * @param config - Config response.
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
                accessUrl={ application?.accessUrl }
                appId={ application?.id }
                description={ application?.description }
                discoverability={ application?.advancedConfigurations?.discoverableByEndUsers }
                imageUrl={ application?.imageUrl }
                name={ application?.name }
                application = { application }
                isLoading={ isLoading }
                onDelete={ onDelete }
                onUpdate={ handleApplicationUpdate }
                featureConfig={ featureConfig }
                template={ template }
                readOnly={ readOnly || applicationConfig.editApplication.getTabPanelReadOnlyStatus(
                    "APPLICATION_EDIT_GENERAL_SETTINGS", application) }
                data-componentid={ `${ componentId }-general-settings` }
                isManagementApp={ application.isManagementApp }
            />
        </ResourceTab.Pane>
    );

    const ApplicationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AccessConfiguration
                application={ application }
                allowedOriginList={ allowedOrigins }
                certificate={ application?.advancedConfigurations?.certificate }
                onAllowedOriginsUpdate={ () => setIsAllowedOriginsUpdated(!isAllowedOriginsUpdated) }
                onApplicationSecretRegenerate={ handleApplicationSecretRegenerate }
                appId={ application?.id }
                appName={ application?.name }
                applicationTemplateId={ application?.templateId }
                extendedAccessConfig={ tabPaneExtensions !== undefined }
                isLoading={ isLoading }
                setIsLoading={ setIsLoading }
                onUpdate={ handleApplicationUpdate }
                onProtocolUpdate = { handleProtocolUpdate }
                isInboundProtocolConfigRequestLoading={ isInboundProtocolConfigRequestLoading }
                inboundProtocolsLoading={ isInboundProtocolConfigRequestLoading }
                inboundProtocolConfig={ inboundProtocolConfig }
                inboundProtocols={ inboundProtocolList }
                featureConfig={ featureConfig }
                template={ template }
                readOnly={ readOnly || applicationConfig.editApplication.getTabPanelReadOnlyStatus(
                    "APPLICATION_EDIT_ACCESS_CONFIG", application) }
                isDefaultApplication={ ApplicationManagementConstants.DEFAULT_APPS.includes(application?.name) }
                isSystemApplication={ ApplicationManagementConstants.SYSTEM_APPS.includes(application?.name) }
                data-componentid={ `${ componentId }-access-settings` }
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
                    && inboundProtocolList?.length === 0
                        ? true
                        : inboundProtocolList?.length === 1
                        && (inboundProtocolList[ 0 ] === SupportedAuthProtocolTypes.OIDC)
                }
                onUpdate={ handleApplicationUpdate }
                applicationTemplateId={ application?.templateId }
                inboundProtocolConfig={ inboundProtocolConfig }
                readOnly={ readOnly }
                data-componentid={ `${ componentId }-attribute-settings` }
            />
        </ResourceTab.Pane>
    );


    const SignOnMethodsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <SignOnMethods
                application={ application }
                appId={ application.id }
                authenticationSequence={ application.authenticationSequence }
                clientId={ inboundProtocolConfig?.oidc?.clientId }
                hiddenAuthenticators={ hiddenAuthenticators }
                isLoading={ isLoading }
                onUpdate={ handleApplicationUpdate }
                featureConfig={ featureConfig }
                readOnly={ readOnly }
                data-componentid={ `${ componentId }-sign-on-methods` }
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
                template={ template }
                data-componentid={ `${ componentId }-advanced-settings` }
            />
        </ResourceTab.Pane>
    );

    const ProvisioningSettingsTabPane = (): ReactElement => (
        applicationConfig.editApplication.showProvisioningSettings
            ? (
                < ResourceTab.Pane controlledSegmentation>
                    <ProvisioningSettings
                        application={ application }
                        provisioningConfigurations={ application.provisioningConfigurations }
                        onUpdate={ handleApplicationUpdate }
                        featureConfig={ featureConfig }
                        readOnly={ readOnly }
                        data-componentid={ `${ componentId }-provisioning-settings` }
                    />
                </ResourceTab.Pane>
            )
            : null
    );

    const SharedAccessTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <SharedAccess
                application={ application }
                onUpdate={ handleApplicationUpdate }
                readOnly={ readOnly }
                data-componentid={ `${ componentId }-shared-access` }
            />
        </ResourceTab.Pane>
    );

    const InfoTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <Info
                inboundProtocols={ application?.inboundProtocols }
                isOIDCConfigLoading={ isOIDCConfigsLoading }
                isSAMLConfigLoading={ isSAMLConfigsLoading }
                templateId={ application?.templateId }
                data-componentid={ `${ componentId }-server-endpoints` }
            />
        </ResourceTab.Pane>
    );

    /**
     * Renders a dynamic application edit tab pane.
     *
     * @param tab - The metadata for the tab.
     * @returns The rendered tab pane.
     */
    const DynamicApplicationEditTabPane = (tab: ApplicationEditTabMetadataInterface): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <ApplicationEditForm
                tab={ tab }
                application={ application }
                isLoading={ isLoading }
                onUpdate={ handleApplicationUpdate }
                readOnly={ readOnly }
            />
        </ResourceTab.Pane>
    );

    /**
     * Renders a markdown guide tab pane.
     *
     * @param guideContent - Content to display in Markdown format.
     * @returns The rendered tab pane.
     */
    const MarkdownGuideTabPane = (guideContent: string): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <MarkdownGuide
                content={ guideContent }
            />
        </ResourceTab.Pane>
    );

    /**
     * Resolves the tab panes based on the application config.
     *
     * @returns Resolved tab panes.
     */
    const resolveTabPanes = (): ResourceTabPaneInterface[] => {
        const panes: ResourceTabPaneInterface[] = [];
        const extensionPanes: ResourceTabPaneInterface[] = [];

        if (!tabPaneExtensions && applicationConfig.editApplication.extendTabs
            && application?.templateId !== ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
            && application?.templateId !== ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS
            && application?.templateId !== ApplicationManagementConstants.CUSTOM_APPLICATION_SAML) {
            return [];
        }

        if (tabPaneExtensions && tabPaneExtensions.length > 0) {
            extensionPanes.push(...cloneDeep(tabPaneExtensions));
        }

        if (featureConfig) {
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_GENERAL_SETTINGS"))
                && !isSubOrganization()) {
                if (applicationConfig.editApplication.
                    isTabEnabledForApp(
                        inboundProtocolConfig?.oidc?.clientId,
                        ApplicationTabTypes.GENERAL,
                        tenantDomain
                    )) {
                    panes.push({
                        componentId: "general",
                        id: ApplicationTabIDs.GENERAL,
                        menuItem:
                                 <Menu.Item data-tourid="general">
                                     { t("applications:edit.sections.general.tabName") }
                                 </Menu.Item>,
                        render: () =>
                            applicationConfig.editApplication.
                                getOveriddenTab(
                                    inboundProtocolConfig?.oidc?.clientId,
                                    ApplicationTabTypes.GENERAL,
                                    GeneralApplicationSettingsTabPane(),
                                    application?.name,
                                    application?.id,
                                    tenantDomain
                                )
                    });
                }
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ACCESS_CONFIG"))
                && !isFragmentApp
            ) {

                applicationConfig.editApplication.isTabEnabledForApp(
                    inboundProtocolConfig?.oidc?.clientId,
                    ApplicationTabTypes.PROTOCOL,
                    tenantDomain
                ) &&
                panes.push({
                    componentId: "protocol",
                    id: ApplicationTabIDs.PROTOCOL,
                    menuItem: t("applications:edit.sections.access.tabName"),
                    render: ApplicationSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ATTRIBUTE_MAPPING"))
                && !isFragmentApp
                && !isM2MApplication
                && (UIConfig?.legacyMode?.applicationSystemAppsSettings ||
                    application?.name !== ApplicationManagementConstants.MY_ACCOUNT_APP_NAME)) {

                applicationConfig.editApplication.isTabEnabledForApp(
                    inboundProtocolConfig?.oidc?.clientId, ApplicationTabTypes.USER_ATTRIBUTES, tenantDomain) &&
                panes.push({
                    componentId: "user-attributes",
                    id: ApplicationTabIDs.USER_ATTRIBUTES,
                    menuItem:
                        <Menu.Item data-tourid="attributes">
                            { t("applications:edit.sections.attributes.tabName") }
                        </Menu.Item>,
                    render: () =>
                        applicationConfig.editApplication.
                            getOveriddenTab(
                                inboundProtocolConfig?.oidc?.clientId,
                                ApplicationTabTypes.USER_ATTRIBUTES,
                                AttributeSettingTabPane(),
                                application?.name,
                                application?.id,
                                tenantDomain
                            )
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_SIGN_ON_METHOD_CONFIG"))
                && !isM2MApplication) {

                applicationConfig.editApplication.
                    isTabEnabledForApp(
                        inboundProtocolConfig?.oidc?.clientId, ApplicationTabTypes.SIGN_IN_METHOD, tenantDomain) &&
                  panes.push({
                      componentId: "sign-in-method",
                      id: ApplicationTabIDs.SIGN_IN_METHODS,
                      menuItem:
                          <Menu.Item data-tourid="sign-in-methods">
                              { t("applications:edit.sections.signOnMethod.tabName") }
                          </Menu.Item>,
                      render: SignOnMethodsTabPane
                  });
            }
            if (applicationConfig.editApplication.showProvisioningSettings
                && isFeatureEnabled(featureConfig?.applications,
                    ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_PROVISIONING_SETTINGS"))
                && !isFragmentApp
                && !isM2MApplication
                && (UIConfig?.legacyMode?.applicationSystemAppsSettings ||
                    application?.name !== ApplicationManagementConstants.MY_ACCOUNT_APP_NAME)) {

                applicationConfig.editApplication.isTabEnabledForApp(
                    inboundProtocolConfig?.oidc?.clientId, ApplicationTabTypes.PROVISIONING, tenantDomain) &&
                panes.push({
                    componentId: "provisioning",
                    id: ApplicationTabIDs.PROVISIONING,
                    menuItem: t("applications:edit.sections.provisioning.tabName"),
                    render: ProvisioningSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ADVANCED_SETTINGS"))
                && !isFragmentApp
                && !isM2MApplication
                && (UIConfig?.legacyMode?.applicationSystemAppsSettings ||
                    application?.name !== ApplicationManagementConstants.MY_ACCOUNT_APP_NAME)) {

                applicationConfig.editApplication.
                    isTabEnabledForApp(
                        inboundProtocolConfig?.oidc?.clientId , ApplicationTabTypes.ADVANCED, tenantDomain) &&
                  panes.push({
                      componentId: "advanced",
                      id: ApplicationTabIDs.ADVANCED,
                      menuItem: (
                          <Menu.Item data-tourid="advanced">
                              { t("applications:edit.sections.advanced.tabName") }
                          </Menu.Item> ),
                      render: AdvancedSettingsTabPane
                  });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_SHARED_ACCESS"))
                 && application?.templateId != ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS
                    && !isFragmentApp
                    && !isM2MApplication
                    && applicationConfig.editApplication.showApplicationShare
                    && (isFirstLevelOrg || window[ "AppUtils" ].getConfig().organizationName)
                    && hasRequiredScopes(featureConfig?.applications,
                        featureConfig?.applications?.scopes?.update, allowedScopes)
                    && orgType !== OrganizationType.SUBORGANIZATION
                    && !ApplicationManagementConstants.SYSTEM_APPS.includes(application?.clientId)) {
                applicationConfig.editApplication.
                    isTabEnabledForApp(
                        inboundProtocolConfig?.oidc?.clientId,
                        ApplicationTabTypes.INFO,
                        tenantDomain
                    ) &&
                    UIConfig?.legacyMode?.organizations &&
                    panes.push({
                        componentId: "shared-access",
                        id: ApplicationTabIDs.SHARED_ACCESS,
                        menuItem: t("applications:edit.sections.sharedAccess.tabName"),
                        render: SharedAccessTabPane
                    });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_INFO"))
                 && !isFragmentApp) {

                applicationConfig.editApplication.
                    isTabEnabledForApp(
                        inboundProtocolConfig?.oidc?.clientId,
                        ApplicationTabTypes.INFO,
                        tenantDomain
                    ) &&
                 panes.push({
                     componentId: "info",
                     id: ApplicationTabIDs.INFO,
                     menuItem: {
                         content: t("applications:edit.sections.info.tabName"),
                         icon: "info circle grey"
                     },
                     render: InfoTabPane
                 });
            }

            extensionPanes.forEach(
                (extensionPane: ResourceTabPaneInterface) => {
                    panes.splice(extensionPane.index, 0, extensionPane);
                }
            );

            return panes;
        }

        return [
            {
                componentId: "general",
                id: ApplicationTabIDs.GENERAL,
                menuItem: t("applications:edit.sections.general.tabName"),
                render: GeneralApplicationSettingsTabPane
            },
            {
                componentId: "protocol",
                id: ApplicationTabIDs.PROTOCOL,
                menuItem: t("applications:edit.sections.access.tabName"),
                render: ApplicationSettingsTabPane
            },
            {
                componentId: "user-attributes",
                id: ApplicationTabIDs.USER_ATTRIBUTES,
                menuItem: t("applications:edit.sections.attributes.tabName"),
                render: AttributeSettingTabPane
            },
            {
                componentId: "sign-in-method",
                id: ApplicationTabIDs.SIGN_IN_METHODS,
                menuItem: t("applications:edit.sections.signOnMethod.tabName"),
                render: SignOnMethodsTabPane
            },
            applicationConfig.editApplication.showProvisioningSettings && {
                componentId: "provisioning",
                id: ApplicationTabIDs.PROVISIONING,
                menuItem: t("applications:edit.sections.provisioning.tabName"),
                render: ProvisioningSettingsTabPane
            },
            {
                componentId: "advanced",
                id: ApplicationTabIDs.ADVANCED,
                menuItem: t("applications:edit.sections.advanced.tabName"),
                render: AdvancedSettingsTabPane
            },
            {
                componentId: "shared-access",
                id: ApplicationTabIDs.SHARED_ACCESS,
                menuItem: t("applications:edit.sections.sharedAccess.tabName"),
                render: SharedAccessTabPane
            },
            {
                componentId: "info",
                id: ApplicationTabIDs.INFO,
                menuItem: {
                    content: t("applications:edit.sections.info.tabName"),
                    icon: "info circle grey"
                },
                render: InfoTabPane
            }
        ];
    };

    /**
     * Filter the available tabs based on metadata defined in the extension template.
     *
     * @param tabs - All available templates.
     * @returns Filtered tabs list.
     */
    const filterTabsBasedOnExtensionTemplateMetadata = (
        tabs: ResourceTabPaneInterface[]
    ): ResourceTabPaneInterface[] => {
        const filteredTabs: ResourceTabPaneInterface[] = [];

        /**
         * Check the existence of predefined tab based on the given tab ID and
         * add it to the filtered list.
         *
         * @param currentTab - Metadata for the tab defined in the template.
         */
        const addPredefineTab = (currentTab: ApplicationEditTabMetadataInterface) => {
            const predefineTab: ResourceTabPaneInterface =
                        tabs.find((item: ResourceTabPaneInterface) => item?.id === currentTab?.id);

            if (predefineTab) {
                if (currentTab?.displayName) {
                    predefineTab.menuItem = currentTab?.displayName;
                }

                filteredTabs.push(predefineTab);
            }
        };

        extensionTemplateMetadata?.edit?.tabs.forEach((tab: ApplicationEditTabMetadataInterface) => {
            switch (tab?.contentType) {
                case ApplicationEditTabContentTypes.GUIDE:
                    if (tab?.guide) {
                        filteredTabs.push({
                            componentId: tab?.id,
                            id: tab?.id,
                            menuItem: tab?.displayName,
                            render: () => MarkdownGuideTabPane(tab?.guide)
                        });
                    }

                    break;
                case ApplicationEditTabContentTypes.FORM:
                    if (tab?.form?.fields && Array.isArray(tab?.form?.fields) && tab?.form?.fields?.length > 0) {
                        filteredTabs.push({
                            componentId: tab?.id,
                            id: tab?.id,
                            menuItem: tab?.displayName,
                            render: () => DynamicApplicationEditTabPane(tab)
                        });
                    }

                    break;
                default:
                    addPredefineTab(tab);
            }
        });

        return filteredTabs?.length > 0 ? filteredTabs : tabs;
    };

    /**
     * Generate the final rendered tab list based on template metadata.
     *
     * @returns Tab panes list.
     */
    const getFinalRenderingTabPanes = (): ResourceTabPaneInterface[] => {
        const availableTabs: ResourceTabPaneInterface[] = resolveTabPanes();

        if (extensionTemplateMetadata?.edit?.tabs
                && Array.isArray(extensionTemplateMetadata?.edit?.tabs)
                && extensionTemplateMetadata?.edit?.tabs?.length > 0) {
            return filterTabsBasedOnExtensionTemplateMetadata(availableTabs);
        }

        return availableTabs;
    };

    /**
     * The list of tab panes rendered in the final render.
     */
    const renderedTabPanes: ResourceTabPaneInterface[] = getFinalRenderingTabPanes();

    /**
     * Handles the activeTabIndex change.
     *
     * @param tabIndex - Active tab index.
     */
    const handleActiveTabIndexChange = (tabIndex:number): void => {

        history.push({
            hash: `#${ URLFragmentTypes.TAB_INDEX }${ tabIndex }`,
            pathname: window.location.pathname
        });
        setActiveTabIndex(tabIndex);
    };

    /**
     * Handles the defaultActiveIndex change.
     */
    const handleDefaultTabIndexChange = (defaultActiveIndex: number): void => {

        if (template.id === CustomApplicationTemplate.id && defaultActiveIndex > 0) {
            handleActiveTabIndexChange(defaultActiveIndex - 1);

            return;
        }

        handleActiveTabIndexChange(defaultActiveIndex);
    };

    /**
     * Set the defaultTabIndex when the application template updates.
     */
    useEffect(() => {

        if(!template) {
            return;
        }

        let defaultTabIndex: number = 0;

        if(applicationConfig.editApplication.extendTabs) {
            defaultTabIndex=1;
        }

        setDefaultActiveIndex(defaultTabIndex);

        if(isEmpty(window.location.hash)){

            if(urlSearchParams.get(ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_KEY) !==
                ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_VALUE) {
                handleDefaultTabIndexChange(defaultTabIndex);

                return;
            }

            // When application selection is done through the strong authentication flow.
            const signInMethodtabIndex: number = renderedTabPanes?.findIndex(
                (element: {"componentId": string}) =>
                    element.componentId === ApplicationManagementConstants.SIGN_IN_METHOD_TAB_URL_FRAG
            );

            if (signInMethodtabIndex !== -1) {
                handleActiveTabIndexChange(signInMethodtabIndex);
            }
        }
    },[ template, renderedTabPanes ]);

    /**
     * Check whether the application is an M2M Application.
     */
    useEffect(() => {

        if (template?.id === ApplicationTemplateIdTypes.M2M_APPLICATION) {
            setM2MApplication(true);
        }
    }, [ template ]);

    /**
     * Called when the URL fragment updates.
     */
    useEffect( () => {

        if(totalTabs === undefined || window.location.hash.includes(URLFragmentTypes.VIEW) ||
            isEmpty(window.location.hash)) {

            return;
        }

        const urlFragment: string[] = window.location.hash.split("#"+URLFragmentTypes.TAB_INDEX);

        if(urlFragment.length === 2 && isEmpty(urlFragment[0]) && /^\d+$/.test(urlFragment[1])) {

            const tabIndex: number = parseInt(urlFragment[1], 10);

            if(tabIndex === activeTabIndex) {
                return;
            }

            handleActiveTabIndexChange(tabIndex);
        } else if (window.location.hash.includes(ApplicationManagementConstants.SIGN_IN_METHOD_TAB_URL_FRAG)) {
            // Handle loading sign-in method tab when redirecting from the "Connected Apps" Tab of an IdP.
            const SignInMethodtabIndex: number = renderedTabPanes?.findIndex(
                (element: {"componentId": string}) =>
                    element.componentId === ApplicationManagementConstants.SIGN_IN_METHOD_TAB_URL_FRAG);

            handleActiveTabIndexChange(SignInMethodtabIndex);
        } else {
            // Change the tab index to defaultActiveIndex for invalid URL fragments.
            handleDefaultTabIndexChange(defaultActiveIndex);
        }
    }, [ window.location.hash, totalTabs ]);

    /**
     * Fetch the allowed origins list whenever there's an update.
     */
    useEffect(() => {
        const allowedCORSOrigins: string[] = [];

        if (isSuperOrganization()) {
            getCORSOrigins()
                .then((response: CORSOriginsListInterface[]) => {
                    response.map((origin: CORSOriginsListInterface) => {
                        allowedCORSOrigins.push(origin.url);
                    });
                    setAllowedOrigins(allowedCORSOrigins);
                })
                .catch((error: AxiosError) => {
                    if (error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t("applications:notifications.fetchAllowedCORSOrigins." +
                                "error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("applications:notifications.fetchAllowedCORSOrigins" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.fetchAllowedCORSOrigins." +
                            "genericError.message")
                    }));
                });
        }
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
    }, [ JSON.stringify(application?.inboundProtocols) ]);

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

        if (!application?.id || isInboundProtocolConfigRequestLoading) {
            return;
        }

        if (inboundProtocolConfig && samlConfigurations && samlConfigurations.certificate) {
            inboundProtocolConfig.certificate = samlConfigurations.certificate;
            inboundProtocolConfig.ssoUrl = samlConfigurations.ssoUrl;
            inboundProtocolConfig.issuer = samlConfigurations.issuer;
        }

        const extensions: ResourceTabPaneInterface[] = applicationConfig.editApplication.getTabExtensions(
            {
                application: application,
                content: template?.content?.quickStart,
                inboundProtocolConfig: inboundProtocolConfig,
                inboundProtocols: inboundProtocolList,
                onApplicationUpdate: () => {
                    handleApplicationUpdate(application?.id);
                },
                onTriggerTabUpdate: (tabIndex: number) => {
                    setActiveTabIndex(tabIndex);
                },
                template: template
            },
            featureConfig,
            readOnly,
            tenantDomain
        );

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

        if (!urlSearchParams.get(ApplicationManagementConstants.CLIENT_SECRET_HASH_ENABLED_URL_SEARCH_PARAM_KEY)) {
            return;
        }

        setShowClientSecretHashDisclaimerModal(true);
    }, [ urlSearchParams.get(ApplicationManagementConstants.CLIENT_SECRET_HASH_ENABLED_URL_SEARCH_PARAM_KEY) ]);

    /**
     * Handles the tab change.
     *
     * @param e - Click event.
     * @param data - Tab properties.
     */
    const handleTabChange = (e: SyntheticEvent, data: TabProps): void => {
        eventPublisher.compute(() => {
            eventPublisher.publish("application-switch-edit-application-tabs", {
                type: data.panes[data.activeIndex].componentId
            });
        });

        handleActiveTabIndexChange(data.activeIndex as number);
    };

    /**
     * Renders the client secret hash disclaimer modal.
     * @returns Client Secret Hash Disclaimer Modal.
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
                data-componentid={ `${ componentId }-client-secret-hash-disclaimer-modal` }
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
                    data-componentid={ `${ componentId }-client-secret-hash-disclaimer-modal-header` }
                >
                    {
                        t("applications:confirmations.clientSecretHashDisclaimer" +
                            ".modal.header")
                    }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                    data-componentid={ `${ componentId }-client-secret-hash-disclaimer-modal-message` }
                >
                    {
                        t("applications:confirmations.clientSecretHashDisclaimer" +
                            ".modal.message")
                    }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${ componentId }-client-secret-hash-disclaimer-modal-content` }
                >
                    <Form>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <label>
                                        {
                                            t("applications:confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientId.label")
                                        }
                                    </label>
                                    <CopyInputField
                                        value={ clientId }
                                        hideSecretLabel={
                                            t("applications:confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientId.hide")
                                        }
                                        showSecretLabel={
                                            t("applications:confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientId.show")
                                        }
                                        data-componentid={ `${ componentId }-client-secret-readonly-input` }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("applications:confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm." +
                                                "clientSecret.label")
                                        }
                                    </label>
                                    <CopyInputField
                                        secret
                                        value={ clientSecret }
                                        hideSecretLabel={
                                            t("applications:confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientSecret.hide")
                                        }
                                        showSecretLabel={
                                            t("applications:confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientSecret.show")
                                        }
                                        data-componentid={ `${ componentId }-client-secret-readonly-input` }
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
        application && !isInboundProtocolsRequestLoading && inboundProtocolList != undefined
        && (tabPaneExtensions || !applicationConfig.editApplication.extendTabs)
            ? (
                <>
                    <ResourceTab
                        isLoading={ isLoading || (extensionTemplate && isExtensionTemplateMetadataFetchRequestLoading) }
                        activeIndex={ activeTabIndex }
                        data-componentid={ `${ componentId }-resource-tabs` }
                        defaultActiveIndex={ defaultActiveIndex }
                        onTabChange={ handleTabChange }
                        panes={ renderedTabPanes }
                        onInitialize={ ({ panesLength }: { panesLength: number }) => {
                            setTotalTabs(panesLength);
                        } }
                    />
                    { showClientSecretHashDisclaimerModal && renderClientSecretHashDisclaimerModal() }
                </>
            ) : <ContentLoader />
    );
};

/**
 * Default props for the application edit component.
 */
EditApplication.defaultProps = {
    "data-componentid": "edit-application",
    getConfiguredInboundProtocolConfigs: () => null,
    getConfiguredInboundProtocolsList: () => null
};
