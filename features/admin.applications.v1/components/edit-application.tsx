/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { Show, useRequiredScopes } from "@wso2is/access-control";
import { ApplicationEditForm } from "@wso2is/admin.application-templates.v1/components/application-edit-form";
import { ApplicationMarkdownGuide } from "@wso2is/admin.application-templates.v1/components/application-markdown-guide";
import useApplicationTemplateMetadata from
    "@wso2is/admin.application-templates.v1/hooks/use-application-template-metadata";
import {
    ApplicationEditTabContentType,
    ApplicationEditTabMetadataInterface
} from "@wso2is/admin.application-templates.v1/models/templates";
import { BrandingPreferencesConstants } from "@wso2is/admin.branding.v1/constants";
import {
    AppConstants,
    AppState,
    CORSOriginsListInterface,
    EventPublisher,
    FeatureConfigInterface,
    getCORSOrigins,
    history
} from "@wso2is/admin.core.v1";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { ApplicationTabIDs, applicationConfig } from "@wso2is/admin.extensions.v1";
import AILoginFlowProvider from "@wso2is/admin.login-flow.ai.v1/providers/ai-login-flow-provider";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    CopyInputField,
    DangerZone,
    DangerZoneGroup,
    Link,
    ResourceTab,
    ResourceTabPaneInterface,
    TAB_URL_HASH_FRAGMENT
} from "@wso2is/react-components";
import Axios, { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, { FormEvent, FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { CheckboxProps, Divider, Form, Grid, Menu, TabProps } from "semantic-ui-react";
import { InboundProtocolsMeta } from "./meta/inbound-protocols.meta";
import MyAccountOverview from "./my-account/my-account-overview";
import { AccessConfiguration } from "./settings/access-configuration";
import { AdvancedSettings } from "./settings/advanced-settings";
import { AttributeSettings } from "./settings/attribute-management/attribute-settings";
import { GeneralApplicationSettings } from "./settings/general-application-settings";
import { Info } from "./settings/info";
import { ProvisioningSettings } from "./settings/provisioning/provisioning-settings";
import { SharedAccess } from "./settings/shared-access";
import { SignOnMethods } from "./settings/sign-on-methods/sign-on-methods";
import { disableApplication, getInboundProtocolConfig } from "../api/application";
import { ApplicationManagementConstants } from "../constants/application-management";
import CustomApplicationTemplate
    from "../data/application-templates/templates/custom-application/custom-application.json";
import {
    ApplicationInterface,
    ApplicationTabTypes,
    ApplicationTemplateIdTypes,
    ApplicationTemplateInterface,
    InboundProtocolListItemInterface,
    OIDCApplicationConfigurationInterface,
    SAMLApplicationConfigurationInterface
} from "../models/application";
import {
    AuthProtocolMetaListItemInterface,
    OIDCDataInterface,
    SupportedAuthProtocolTypes
} from "../models/application-inbound";
import { ApplicationManagementUtils } from "../utils/application-management-utils";
import "./edit-application.scss";

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
        readOnly,
        urlSearchParams,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const { isSuperOrganization, isSubOrganization } = useGetCurrentOrganizationType();
    const dispatch: Dispatch = useDispatch();
    const { UIConfig } = useUIConfig();
    const {
        templateMetadata: extensionTemplateMetadata,
        isTemplateMetadataRequestLoading: isExtensionTemplateMetadataFetchRequestLoading
    } = useApplicationTemplateMetadata();
    // Check if the user has the required scopes to update the application.
    const hasApplicationUpdatePermissions: boolean = useRequiredScopes(featureConfig?.applications?.scopes?.update);

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
    const [ isM2MApplication, setM2MApplication ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const isFragmentApp: boolean = application?.advancedConfigurations?.fragment || false;
    const hiddenAuthenticators: string[] = [ ...(UIConfig?.hiddenAuthenticators ?? []) ];
    const isMyAccount: boolean =
        ApplicationManagementConstants.MY_ACCOUNT_CLIENT_ID === application?.clientId ||
        ApplicationManagementConstants.MY_ACCOUNT_APP_NAME === application?.name;
    const applicationsUpdateScopes: string[] = featureConfig?.applications?.scopes?.update;

    const [ isDisableInProgress, setIsDisableInProgress ] = useState<boolean>(false);
    const [ enableStatus, setEnableStatus ] = useState<boolean>(false);
    const [ showDisableConfirmationModal, setShowDisableConfirmationModal ] = useState<boolean>(false);
    const brandingDisabledFeatures: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.features?.branding?.disabledFeatures);

    /**
     * Called when an application updates.
     *
     * @param id - Application id.
     */
    const handleApplicationUpdate = (id: string): void => {
        setIsApplicationUpdated(true);
        handleProtocolUpdate();
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

                    if (error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
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

    /**
     * Handles the toggle change to show confirmation modal.
     *
     * @param event - Form event.
     * @param data - Checkbox data.
     */
    const handleAppEnableDisableToggleChange = (event: FormEvent<HTMLInputElement>, data: CheckboxProps): void => {
        setEnableStatus(!data?.checked);
        setShowDisableConfirmationModal(true);
    };

    /**
     * Disables an application.
     */
    const handleApplicationDisable = (): void => {
        setIsDisableInProgress(true);
        disableApplication(application.id, enableStatus)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.disableApplication.success" +
                        ".description", { state: enableStatus ? "enabled" : "disabled" }),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.disableApplication.success.message", {
                        state : enableStatus ? "enabled" : "disabled" })
                }));

                setShowDisableConfirmationModal(false);
                onUpdate(application.id);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.disableApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.disableApplication" +
                        ".genericError.description", { state: enableStatus ? "enable" : "disable" }),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.disableApplication.genericError" +
                        ".message")
                }));
            })
            .finally(() => {
                setIsDisableInProgress(false);
            });
    };

    const MyAccountOverviewTabPane = (): ReactElement => (
        <>
            <ResourceTab.Pane controlledSegmentation>
                <MyAccountOverview/>
            </ResourceTab.Pane>
            <Divider hidden />
            { !isSubOrganization() && (
                <Show
                    when={ applicationsUpdateScopes }
                >
                    <DangerZoneGroup
                        sectionHeader={ t("applications:dangerZoneGroup.header") }
                    >
                        <DangerZone
                            actionTitle={ t("applications:dangerZoneGroup.disableApplication.actionTitle") }
                            header={ t("applications:dangerZoneGroup.disableApplication.header") }
                            subheader={ t("applications:dangerZoneGroup.disableApplication.subheader") }
                            onActionClick={ undefined }
                            toggle={ {
                                checked: !application.applicationEnabled,
                                onChange: handleAppEnableDisableToggleChange
                            } }
                            data-testid={ `${ componentId }-danger-zone-disable` }
                        />
                    </DangerZoneGroup>
                </Show>
            ) }
            <ConfirmationModal
                onClose={ (): void => setShowDisableConfirmationModal(false) }
                type="warning"
                open={ showDisableConfirmationModal }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => setShowDisableConfirmationModal(false) }
                onPrimaryActionClick={ (): void => handleApplicationDisable() }
                closeOnDimmerClick={ false }
                primaryActionLoading={ isDisableInProgress }
                data-testid={ `${ componentId }-myAccount-disable-confirmation-modal` }
            >
                <ConfirmationModal.Header
                    data-testid={
                        `${ componentId }-myAccount-disable-confirmation-modal-header`
                    }
                >
                    { enableStatus
                        ? t("applications:confirmations.enableApplication.header")
                        : t("applications:confirmations.disableApplication.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                    data-testid={
                        `${ componentId }-myAccount-disable-confirmation-modal-message`
                    }
                >
                    { enableStatus
                        ? t("applications:confirmations.enableApplication.message")
                        : t("applications:confirmations.disableApplication.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-testid={
                        `${ componentId }-application-disable-confirmation-modal-content`
                    }
                >
                    { enableStatus
                        ? t("applications:confirmations.enableApplication.content")
                        : (
                            <>
                                <Trans
                                    i18nKey={ "applications:confirmations.disableApplication.content.0" }
                                >
                                    This may prevent consumers from accessing the application,
                                    but it can be resolved by re-enabling the application.
                                </Trans>
                                <br /><br />
                                <Trans
                                    i18nKey={ "applications:confirmations.disableApplication.content.1" }
                                >
                                            Ensure that the references to the application in
                                    <Link
                                        data-componentid={ `${componentId}-link-email-templates-page` }
                                        onClick={
                                            () => history.push(AppConstants.getPaths().get("EMAIL_MANAGEMENT"))
                                        }
                                        external={ false }
                                    >
                                        email templates
                                    </Link> and other relevant locations are updated to reflect the application
                                    status accordingly.
                                </Trans>
                            </>
                        ) }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );

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
                isBrandingSectionHidden={ brandingDisabledFeatures.includes(BrandingPreferencesConstants.
                    APP_WISE_BRANDING_FEATURE_TAG) }
                readOnly={ readOnly || applicationConfig.editApplication.getTabPanelReadOnlyStatus(
                    "APPLICATION_EDIT_GENERAL_SETTINGS", application) }
                data-componentid={ `${ componentId }-general-settings` }
                isManagementApp={ application?.isManagementApp }
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
                appVersion={ application?.applicationVersion }
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
        <AILoginFlowProvider>
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
        </AILoginFlowProvider>
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
                appId={ application.id }
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
    const DynamicApplicationEditTabPane = (tab: ApplicationEditTabMetadataInterface): ReactElement => {
        const firstProtocolName: string = mapProtocolTypeToName(application?.inboundProtocols?.[0]?.type);

        return (
            <ResourceTab.Pane controlledSegmentation>
                <ApplicationEditForm
                    tab={ tab }
                    application={ application }
                    protocolName={ firstProtocolName }
                    inboundProtocolConfigurations={ inboundProtocolConfig?.[firstProtocolName] }
                    isLoading={ isLoading }
                    onUpdate={ handleApplicationUpdate }
                    onProtocolUpdate = { handleProtocolUpdate }
                    readOnly={ readOnly }
                />
            </ResourceTab.Pane>
        );
    };

    /**
     * Renders a markdown guide tab pane.
     *
     * @param guideContent - Content to display in Markdown format.
     * @returns The rendered tab pane.
     */
    const MarkdownGuideTabPane = (guideContent: string): ReactElement => {
        const firstProtocolName: string = mapProtocolTypeToName(application?.inboundProtocols?.[0]?.type);

        return (
            <ResourceTab.Pane controlledSegmentation>
                <ApplicationMarkdownGuide
                    application={ application }
                    inboundProtocolConfigurations={ inboundProtocolConfig?.[firstProtocolName] }
                    content={ guideContent }
                    isLoading={ isLoading }
                    protocolName={ firstProtocolName }
                />
            </ResourceTab.Pane>
        );
    };

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

        if (tabPaneExtensions && tabPaneExtensions?.length > 0) {
            extensionPanes.push(...cloneDeep(tabPaneExtensions));
        }

        if (featureConfig) {
            if (isMyAccount) {
                panes.push({
                    componentId: "overview",
                    menuItem: t("applications:myaccount.overview.tabName"),
                    render: MyAccountOverviewTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_GENERAL_SETTINGS"))
                && (isSubOrganization() ?
                    !brandingDisabledFeatures.includes(
                        BrandingPreferencesConstants.APP_WISE_BRANDING_FEATURE_TAG): true)
                && !isMyAccount
            ) {
                if (applicationConfig.editApplication.
                    isTabEnabledForApp(
                        inboundProtocolConfig?.oidc?.clientId,
                        ApplicationTabTypes.GENERAL,
                        tenantDomain
                    )) {
                    panes.push({
                        componentId: "general",
                        "data-tabid": ApplicationTabIDs.GENERAL,
                        menuItem:
                                 <Menu.Item data-tourid="general">
                                     { t("applications:edit.sections.general.tabName") }
                                 </Menu.Item>,
                        render: () =>
                            applicationConfig.editApplication.
                                getOverriddenTab(
                                    inboundProtocolConfig?.oidc?.clientId,
                                    ApplicationTabTypes.GENERAL,
                                    GeneralApplicationSettingsTabPane(),
                                    application,
                                    tenantDomain
                                )
                    });
                }
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ACCESS_CONFIG"))
                && !isFragmentApp
                && !isMyAccount
            ) {

                applicationConfig.editApplication.isTabEnabledForApp(
                    inboundProtocolConfig?.oidc?.clientId,
                    ApplicationTabTypes.PROTOCOL,
                    tenantDomain
                ) &&
                panes.push({
                    componentId: "protocol",
                    "data-tabid": ApplicationTabIDs.PROTOCOL,
                    menuItem: t("applications:edit.sections.access.tabName"),
                    render: ApplicationSettingsTabPane
                });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_ATTRIBUTE_MAPPING"))
                && !isFragmentApp
                && !isM2MApplication
                && (UIConfig?.legacyMode?.applicationSystemAppsSettings ||
                    application?.name !== ApplicationManagementConstants.MY_ACCOUNT_APP_NAME)
            ) {

                applicationConfig.editApplication.isTabEnabledForApp(
                    inboundProtocolConfig?.oidc?.clientId, ApplicationTabTypes.USER_ATTRIBUTES, tenantDomain) &&
                panes.push({
                    componentId: "user-attributes",
                    "data-tabid": ApplicationTabIDs.USER_ATTRIBUTES,
                    menuItem:
                        <Menu.Item data-tourid="attributes">
                            { t("applications:edit.sections.attributes.tabName") }
                        </Menu.Item>,
                    render: () =>
                        applicationConfig.editApplication.
                            getOverriddenTab(
                                inboundProtocolConfig?.oidc?.clientId,
                                ApplicationTabTypes.USER_ATTRIBUTES,
                                AttributeSettingTabPane(),
                                application,
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
                      "data-tabid": ApplicationTabIDs.SIGN_IN_METHODS,
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
                    "data-tabid": ApplicationTabIDs.PROVISIONING,
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
                      "data-tabid": ApplicationTabIDs.ADVANCED,
                      menuItem: (
                          <Menu.Item data-tourid="advanced">
                              { t("applications:edit.sections.advanced.tabName") }
                          </Menu.Item> ),
                      render: () =>
                          applicationConfig.editApplication.
                              getOverriddenTab(
                                  inboundProtocolConfig?.oidc?.clientId,
                                  ApplicationTabTypes.ADVANCED,
                                  AdvancedSettingsTabPane(),
                                  application,
                                  tenantDomain,
                                  handleApplicationUpdate,
                                  readOnly
                              )
                  });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_SHARED_ACCESS"))
                 && application?.templateId != ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS
                    && !isFragmentApp
                    && !isM2MApplication
                    && applicationConfig.editApplication.showApplicationShare
                    && (isFirstLevelOrg || window[ "AppUtils" ].getConfig().organizationName)
                    && hasApplicationUpdatePermissions
                    && orgType !== OrganizationType.SUBORGANIZATION
                    && !ApplicationManagementConstants.SYSTEM_APPS.includes(application?.clientId)) {
                applicationConfig.editApplication.
                    isTabEnabledForApp(
                        inboundProtocolConfig?.oidc?.clientId,
                        ApplicationTabTypes.INFO,
                        tenantDomain
                    ) &&
                    panes.push({
                        componentId: "shared-access",
                        "data-tabid": ApplicationTabIDs.SHARED_ACCESS,
                        menuItem: t("applications:edit.sections.sharedAccess.tabName"),
                        render: SharedAccessTabPane
                    });
            }
            if (isFeatureEnabled(featureConfig?.applications,
                ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_INFO"))
                 && !isFragmentApp
                 && !isMyAccount) {

                applicationConfig.editApplication.
                    isTabEnabledForApp(
                        inboundProtocolConfig?.oidc?.clientId,
                        ApplicationTabTypes.INFO,
                        tenantDomain
                    ) &&
                 panes.push({
                     componentId: "info",
                     "data-tabid": ApplicationTabIDs.INFO,
                     menuItem: {
                         className: "info-tab-icon",
                         content: t("applications:edit.sections.info.tabName"),
                         icon: "info circle"
                     },
                     render: InfoTabPane
                 });
            }

            extensionPanes.forEach(
                (extensionPane: ResourceTabPaneInterface) => {
                    panes.splice(extensionPane?.index, 0, extensionPane);
                }
            );

            return panes;
        }

        return [
            {
                componentId: "general",
                "data-tabid": ApplicationTabIDs.GENERAL,
                menuItem: t("applications:edit.sections.general.tabName"),
                render: GeneralApplicationSettingsTabPane
            },
            {
                componentId: "protocol",
                "data-tabid": ApplicationTabIDs.PROTOCOL,
                menuItem: t("applications:edit.sections.access.tabName"),
                render: ApplicationSettingsTabPane
            },
            {
                componentId: "user-attributes",
                "data-tabid": ApplicationTabIDs.USER_ATTRIBUTES,
                menuItem: t("applications:edit.sections.attributes.tabName"),
                render: AttributeSettingTabPane
            },
            {
                componentId: "sign-in-method",
                "data-tabid": ApplicationTabIDs.SIGN_IN_METHODS,
                menuItem: t("applications:edit.sections.signOnMethod.tabName"),
                render: SignOnMethodsTabPane
            },
            applicationConfig.editApplication.showProvisioningSettings && {
                componentId: "provisioning",
                "data-tabid": ApplicationTabIDs.PROVISIONING,
                menuItem: t("applications:edit.sections.provisioning.tabName"),
                render: ProvisioningSettingsTabPane
            },
            {
                componentId: "advanced",
                "data-tabid": ApplicationTabIDs.ADVANCED,
                menuItem: t("applications:edit.sections.advanced.tabName"),
                render: AdvancedSettingsTabPane
            },
            {
                componentId: "shared-access",
                "data-tabid": ApplicationTabIDs.SHARED_ACCESS,
                menuItem: t("applications:edit.sections.sharedAccess.tabName"),
                render: SharedAccessTabPane
            },
            {
                componentId: "info",
                "data-tabid": ApplicationTabIDs.INFO,
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
     * @param tabs - All available tabs.
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
                        tabs?.find((item: ResourceTabPaneInterface) => item?.["data-tabid"] === currentTab?.id);

            if (predefineTab) {
                if (currentTab?.displayName) {
                    predefineTab.menuItem = currentTab?.displayName;
                }

                filteredTabs.push(predefineTab);
            }
        };

        extensionTemplateMetadata?.edit?.tabs?.forEach((tab: ApplicationEditTabMetadataInterface) => {
            switch (tab?.contentType) {
                case ApplicationEditTabContentType.GUIDE:
                    if (tab?.guide) {
                        filteredTabs.push({
                            componentId: tab?.id,
                            "data-tabid": tab?.id,
                            menuItem: tab?.displayName,
                            render: () => MarkdownGuideTabPane(tab?.guide)
                        });
                    }

                    break;
                case ApplicationEditTabContentType.FORM:
                    if (tab?.form) {
                        filteredTabs.push({
                            componentId: tab?.id,
                            "data-tabid": tab?.id,
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
     * Get the default active tab.
     */
    const getDefaultActiveTab = (): number | string => {

        let defaultTab: number | string = 0;

        if(applicationConfig.editApplication.extendTabs
            && template?.id !== CustomApplicationTemplate.id
            && !isSubOrganization()) {
            defaultTab = 1;
        }

        if (extensionTemplateMetadata?.edit?.defaultActiveTabId) {
            defaultTab = extensionTemplateMetadata?.edit?.defaultActiveTabId;
        }

        return defaultTab;
    };

    /**
     * When the strong authentication parameter is set to true, set the sign-in methods tab.
     */
    useEffect(() => {

        if(isEmpty(window?.location?.hash)){
            if(urlSearchParams.get(ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_KEY) ===
                ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_VALUE) {
                window.location.hash = TAB_URL_HASH_FRAGMENT + ApplicationTabIDs.SIGN_IN_METHODS;
            } else if (urlSearchParams.get(ApplicationManagementConstants.IS_PROTOCOL) === "true") {
                window.location.hash = TAB_URL_HASH_FRAGMENT + ApplicationTabIDs.PROTOCOL;
            } else if (urlSearchParams.get(ApplicationManagementConstants.IS_ROLES) === "true") {
                window.location.hash = TAB_URL_HASH_FRAGMENT + ApplicationTabIDs.APPLICATION_ROLES;
            }
        }
    },[ urlSearchParams ]);

    /**
     * Check whether the application is an M2M Application.
     */
    useEffect(() => {

        if (template?.id === ApplicationTemplateIdTypes.M2M_APPLICATION) {
            setM2MApplication(true);
        }
    }, [ template ]);

    /**
     * Fetch the allowed origins list whenever there's an update.
     */
    useEffect(() => {
        const allowedCORSOrigins: string[] = [];

        if (isSuperOrganization()) {
            getCORSOrigins()
                .then((response: CORSOriginsListInterface[]) => {
                    response?.map((origin: CORSOriginsListInterface) => {
                        allowedCORSOrigins.push(origin?.url);
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

        if (inboundProtocolConfig && samlConfigurations && samlConfigurations?.certificate) {
            inboundProtocolConfig.certificate = samlConfigurations?.certificate;
            inboundProtocolConfig.ssoUrl = samlConfigurations?.ssoUrl;
            inboundProtocolConfig.issuer = samlConfigurations?.issuer;
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
                    history.push({
                        hash: `#tab=${tabIndex}`
                    });
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
                        isLoading={ isLoading || isExtensionTemplateMetadataFetchRequestLoading }
                        data-componentid={ `${ componentId }-resource-tabs` }
                        controlTabRedirectionInternally
                        defaultActiveTab={ getDefaultActiveTab() }
                        onTabChange={ handleTabChange }
                        panes={ renderedTabPanes }
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
