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

import { Show } from "@wso2is/access-control";
import {
    AppState,
    CORSOriginsListInterface,
    EventPublisher,
    FeatureConfigInterface,
    getCORSOrigins,
    history
} from "@wso2is/admin.core.v1";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { applicationConfig } from "@wso2is/admin.extensions.v1";
import { MyAccountOverview } from "@wso2is/admin.extensions.v1/configs/components/my-account-overview";
import AILoginFlowProvider from "@wso2is/admin.login-flow.ai.v1/providers/ai-login-flow-provider";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    CopyInputField,
    DangerZone,
    DangerZoneGroup,
    ResourceTab,
    ResourceTabPaneInterface
} from "@wso2is/react-components";
import Axios, { AxiosError, AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FormEvent, FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { CheckboxProps, Divider, Form, Grid, Menu, TabProps } from "semantic-ui-react";
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
import { disableApplication, getInboundProtocolConfig } from "../api";
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
    const { isSuperOrganization } = useGetCurrentOrganizationType();
    const dispatch: Dispatch = useDispatch();
    const { UIConfig } = useUIConfig();

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
    const isMyAccount: boolean =
        ApplicationManagementConstants.MY_ACCOUNT_CLIENT_ID === application?.clientId;
    const applicationsUpdateScopes: string[] = featureConfig?.applications?.scopes?.update;

    const { isSubOrganization } = useGetCurrentOrganizationType();
    const [ isDisableInProgress, setIsDisableInProgress ] = useState<boolean>(false);
    const [ enableStatus, setEnableStatus ] = useState<boolean>(false);
    const [ showDisableConfirmationModal, setShowDisableConfirmationModal ] = useState<boolean>(false);

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
            extensionPanes.push(...tabPaneExtensions);
        }

        if (featureConfig) {
            if (isMyAccount) {
                panes.push({
                    componentId: "overview",
                    menuItem: t("applications:myaccount.overview.tabName"),
                    render: MyAccountOverviewTabPane
                });
            }
            if (
                isFeatureEnabled(featureConfig?.applications,
                    ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT_GENERAL_SETTINGS"))
                && !isSubOrganization()
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
                && !isMyAccount
            ) {

                applicationConfig.editApplication.isTabEnabledForApp(
                    inboundProtocolConfig?.oidc?.clientId,
                    ApplicationTabTypes.PROTOCOL,
                    tenantDomain
                ) &&
                panes.push({
                    componentId: "protocol",
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
                menuItem: t("applications:edit.sections.general.tabName"),
                render: GeneralApplicationSettingsTabPane
            },
            {
                componentId: "protocol",
                menuItem: t("applications:edit.sections.access.tabName"),
                render: ApplicationSettingsTabPane
            },
            {
                componentId: "user-attributes",
                menuItem: t("applications:edit.sections.attributes.tabName"),
                render: AttributeSettingTabPane
            },
            {
                componentId: "sign-in-method",
                menuItem: t("applications:edit.sections.signOnMethod.tabName"),
                render: SignOnMethodsTabPane
            },
            applicationConfig.editApplication.showProvisioningSettings && {
                componentId: "provisioning",
                menuItem: t("applications:edit.sections.provisioning.tabName"),
                render: ProvisioningSettingsTabPane
            },
            {
                componentId: "advanced",
                menuItem: t("applications:edit.sections.advanced.tabName"),
                render: AdvancedSettingsTabPane
            },
            {
                componentId: "shared-access",
                menuItem: t("applications:edit.sections.sharedAccess.tabName"),
                render: SharedAccessTabPane
            },
            {
                componentId: "info",
                menuItem: {
                    content: t("applications:edit.sections.info.tabName"),
                    icon: "info circle grey"
                },
                render: InfoTabPane
            }
        ];
    };

    const renderedTabPanes: ResourceTabPaneInterface[] = useMemo(
        () => resolveTabPanes(), [
            tabPaneExtensions,
            application?.templateId
        ]);

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
            if(urlSearchParams.get(ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_KEY) ===
                ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_VALUE) {
                // When application selection is done through the strong authentication flow.
                const signInMethodtabIndex: number = renderedTabPanes?.findIndex(
                    (element: {"componentId": string}) =>
                        element.componentId === ApplicationManagementConstants.SIGN_IN_METHOD_TAB_URL_FRAG
                );

                if (signInMethodtabIndex !== -1) {
                    handleActiveTabIndexChange(signInMethodtabIndex);
                }

                return;
            } else if (urlSearchParams.get(ApplicationManagementConstants.IS_PROTOCOL) === "true") {
                const protocolTabIndex: number = renderedTabPanes?.findIndex(
                    (element: {"componentId": string}) =>
                        element.componentId === ApplicationManagementConstants.PROTOCOL_TAB_URL_FRAG
                );

                if(protocolTabIndex !== -1) {
                    handleActiveTabIndexChange(protocolTabIndex);
                }

                return;
            } else if (urlSearchParams.get(ApplicationManagementConstants.IS_ROLES) === "true") {
                const rolesTabIndex: number = renderedTabPanes?.findIndex(
                    (element: {"componentId": string}) =>
                        element.componentId === ApplicationManagementConstants.ROLES_TAB_URL_FRAG
                );

                if (rolesTabIndex !== -1) {
                    handleActiveTabIndexChange(rolesTabIndex);
                }

                return;
            }
            else {
                handleDefaultTabIndexChange(defaultTabIndex);
            }
        }
    },[ template, renderedTabPanes, urlSearchParams ]);

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

    /**
     * Handles the toggle change to show confirmation modal.
     *
     * @param event - Form event.
     * @param data - Checkbox data.
     */
    const handleAppEnableDisableToggleChange = (event: FormEvent<HTMLInputElement>, data: CheckboxProps): void => {
        setEnableStatus(data?.checked);
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
            <Show
                when={ applicationsUpdateScopes }
            >
                <DangerZoneGroup
                    sectionHeader={ t("applications:dangerZoneGroup.header") }
                >
                    <DangerZone
                        actionTitle={ t("applications:dangerZoneGroup.disableApplication.actionTitle",
                            { state: application.applicationEnabled ? t("common:disable") : t("common:enable") }) }
                        header={ t("applications:dangerZoneGroup.disableApplication.header",
                            { state: application.applicationEnabled ? t("common:disable") : t("common:enable") } ) }
                        subheader={ application.applicationEnabled
                            ? t("applications:dangerZoneGroup.disableApplication.subheader")
                            : t("applications:dangerZoneGroup.disableApplication.subheader2") }
                        onActionClick={ undefined }
                        toggle={ {
                            checked: application.applicationEnabled,
                            onChange: handleAppEnableDisableToggleChange
                        } }
                        data-testid={ `${ componentId }-danger-zone-disable` }
                    />
                </DangerZoneGroup>
            </Show>
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
                        : t("applications:confirmations.disableApplication.content") }
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
                        isLoading={ isLoading }
                        activeIndex={ activeTabIndex }
                        data-componentid={ `${ componentId }-resource-tabs` }
                        defaultActiveIndex={ defaultActiveIndex }
                        onTabChange={ handleTabChange }
                        panes={ resolveTabPanes() }
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
