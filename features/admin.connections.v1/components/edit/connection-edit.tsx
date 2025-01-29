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

import Button from "@oxygen-ui/react/Button";
import { useRequiredScopes } from "@wso2is/access-control";
import ActionEndpointConfigForm from "@wso2is/admin.actions.v1/components/action-endpoint-config-form";
import { EndpointConfigFormPropertyInterface } from "@wso2is/admin.actions.v1/models/actions";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { identityProviderConfig } from "@wso2is/admin.extensions.v1";
import { FederatedAuthenticatorInterface } from "@wso2is/admin.identity-providers.v1/models";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps } from "@wso2is/form";
import { ContentLoader, EmphasizedSegment, ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, lazy, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { TabProps } from "semantic-ui-react";
import {
    AdvanceSettings,
    AttributeSettings,
    AuthenticatorSettings,
    ConnectedApps,
    GeneralSettings,
    IdentityProviderGroupsTab,
    OutboundProvisioningSettings
} from "./settings";
import { JITProvisioningSettings } from "./settings/jit-provisioning-settings";
import { getLocalAuthenticator } from "../../api/authenticators";
import { getFederatedAuthenticatorDetails, updateCustomAuthentication, updateFederatedAuthenticator }
    from "../../api/connections";
import { CommonAuthenticatorConstants } from "../../constants/common-authenticator-constants";
import { ConnectionUIConstants } from "../../constants/connection-ui-constants";
import { FederatedAuthenticatorConstants } from "../../constants/federated-authenticator-constants";
import {
    ConnectionAdvanceInterface,
    ConnectionInterface,
    ConnectionTabTypes,
    ConnectionTemplateInterface,
    CustomAuthConnectionInterface,
    EndpointAuthenticationType,
    EndpointAuthenticationUpdateInterface,
    FederatedAuthenticatorListItemInterface,
    ImplicitAssociaionConfigInterface
} from "../../models/connection";
import { isProvisioningAttributesEnabled } from "../../utils/attribute-utils";
import { ConnectionsManagementUtils, handleConnectionUpdateError } from "../../utils/connection-utils";
import { validateEndpointAuthentication } from "../../utils/form-field-utils";
import "./connection-edit.scss";

/**
 * Proptypes for the connection edit component.
 */
interface EditConnectionPropsInterface extends TestableComponentInterface {
    /**
     * Editing idp.
     */
    identityProvider: ConnectionInterface;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Callback to be triggered after deleting the idp.
     */
    onDelete: () => void;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string, tabName?: string) => void;
    /**
     * Check if IDP is Google
     */
    isGoogle?: boolean;
    /**
     * Check if the requesting IDP is enterprise
     * with SAML and OIDC protocols.
     */
    isEnterprise?: boolean | undefined;
    /**
     * Check if the requesting IDP is OIDC.
     */
    isOidc?: boolean | undefined;
    /**
     * Check if the requesting IDP is SAML.
     */
    isSaml?: boolean | undefined;
    /**
     * IDP template.
     */
    template: ConnectionTemplateInterface;
    /**
     * Type of IDP.
     * @see {@link IdentityProviderManagementConstants } Use one of `IDP_TEMPLATE_IDS`.
     */
    type: string;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Specifies if it is needed to redirect to a specific tabindex
     */
    isAutomaticTabRedirectionEnabled?: boolean;
    /**
     * Function to enable/disable automatic tab redirection.
     */
    setIsAutomaticTabRedirectionEnabled?: (state: boolean) => void;
    /**
     * Specifies, to which tab(tabid) it need to redirect.
     */
    tabIdentifier?: string;
    /**
     * Connection setting section meta data.
     */
    connectionSettingsMetaData?: any;
}

/**
 * Identity Provider edit component.
 *
 * @param props - Props injected to the component.
 * @returns React Element
 */
export const EditConnection: FunctionComponent<EditConnectionPropsInterface> = (
    props: EditConnectionPropsInterface
): ReactElement => {
    const {
        connectionSettingsMetaData,
        identityProvider,
        isLoading,
        isSaml,
        isOidc,
        onDelete,
        onUpdate: onConnectionUpdate,
        template,
        type,
        isReadOnly,
        isAutomaticTabRedirectionEnabled,
        setIsAutomaticTabRedirectionEnabled,
        tabIdentifier,
        ["data-testid"]: testId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ tabPaneExtensions, setTabPaneExtensions ] = useState<ResourceTabPaneInterface[]>(undefined);
    const [ defaultActiveIndex, setDefaultActiveIndex ] = useState<number | string>(0);
    const disabledFeatures: string[] = useSelector(
        (state: AppState) => state.config.ui.features.identityProviders?.disabledFeatures
    );

    /**
     * This is placed as a temporary fix until the dynamic tab loading is implemented.
     * (https://github.com/wso2-enterprise/iam-engineering/issues/575)
     */
    const [ isTrustedTokenIssuer, setIsTrustedTokenIssuer ] = useState<boolean>(false);
    const [ isExpertMode, setIsExpertMode ] = useState<boolean>(false);
    const [ isCustomAuthenticator, setIsCustomAuthenticator ] = useState<boolean>(false);
    const [ isCustomLocalAuthenticator, setIsCustomLocalAuthenticator ] = useState<boolean>(undefined);
    const [ endpointAuthenticationType, setEndpointAuthenticationType ] = useState<EndpointAuthenticationType>(null);
    const [ isAuthenticationUpdateFormState, setIsAuthenticationUpdateFormState ] = useState<boolean>(false);
    const [ authenticatorEndpoint, setAuthenticatorEndpoint ] = useState<EndpointConfigFormPropertyInterface>(null);

    const hasApplicationReadPermissions: boolean = useRequiredScopes(featureConfig?.applications?.scopes?.read);

    const { t } = useTranslation();

    const isOrganizationEnterpriseAuthenticator: boolean =
        identityProvider?.federatedAuthenticators?.defaultAuthenticatorId ===
        FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID;
    const isEnterpriseConnection: boolean =
        identityProvider?.federatedAuthenticators?.defaultAuthenticatorId ===
            FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.SAML_AUTHENTICATOR_ID ||
        identityProvider?.federatedAuthenticators?.defaultAuthenticatorId ===
            FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.OIDC_AUTHENTICATOR_ID;

    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);

    const idpAdvanceConfig: ConnectionAdvanceInterface = {
        alias: identityProvider?.alias,
        certificate: identityProvider?.certificate,
        homeRealmIdentifier: identityProvider?.homeRealmIdentifier,
        isFederationHub: identityProvider?.isFederationHub
    };

    const idpImplicitAssociationConfig: ImplicitAssociaionConfigInterface = {
        isEnabled: identityProvider?.implicitAssociation?.isEnabled,
        lookupAttribute: identityProvider?.implicitAssociation?.lookupAttribute
    };

    const getCustomLocalAuthenticator = (localAuthenticatorId: string) => {
        getLocalAuthenticator(localAuthenticatorId)
            .then((data: CustomAuthConnectionInterface) => {
                const endpointAuth: EndpointConfigFormPropertyInterface = {
                    authenticationType: data?.endpoint?.authentication?.type,
                    endpointUri: data?.endpoint?.uri
                };

                setAuthenticatorEndpoint(endpointAuth);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: t("authenticationProvider:notifications.getIDP.error.description", {
                                description: error.response.data.description
                            }),
                            level: AlertLevels.ERROR,
                            message: t("authenticationProvider:" + "notifications.getIDP.error.message")
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t("authenticationProvider:" + "notifications.getIDP.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:" + "notifications.getIDP.genericError.message")
                    })
                );
            });
    };

    const getCustomFederatedAuthenticator = (localAuthenticatorId: string) => {
        getFederatedAuthenticatorDetails(identityProvider?.id, localAuthenticatorId)
            .then((data: FederatedAuthenticatorListItemInterface) => {
                const endpointAuth: EndpointConfigFormPropertyInterface = {
                    authenticationType: data?.endpoint?.authentication?.type,
                    endpointUri: data?.endpoint?.uri
                };

                setAuthenticatorEndpoint(endpointAuth);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: t("authenticationProvider:notifications.getIDP.error.description", {
                                description: error.response.data.description
                            }),
                            level: AlertLevels.ERROR,
                            message: t("authenticationProvider:" + "notifications.getIDP.error.message")
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t("authenticationProvider:" + "notifications.getIDP.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:" + "notifications.getIDP.genericError.message")
                    })
                );
            });
    };

    useEffect(() => {
        if (!identityProvider?.id) {
            setIsAuthenticationUpdateFormState(true);
        }
    }, [ identityProvider ]);

    useEffect(() => {
        if (!isCustomAuthenticator) {
            return;
        }

        if (isCustomLocalAuthenticator === undefined) {
            return;
        }

        setIsAutomaticTabRedirectionEnabled(false);

        let customAuthenticatorId: string;

        if (isCustomLocalAuthenticator) {
            customAuthenticatorId = (identityProvider as CustomAuthConnectionInterface)?.id;
            getCustomLocalAuthenticator(customAuthenticatorId);
        } else {
            customAuthenticatorId = identityProvider?.federatedAuthenticators?.authenticators[0]?.authenticatorId;
            getCustomFederatedAuthenticator(customAuthenticatorId);
        }
    }, [ isCustomLocalAuthenticator ]);

    /**
     * This wrapper function ensures that the user stays on the tab that
     * triggered the update after completion. Additionally, it invokes
     * the onUpdate callback on the parent component.
     *
     * @param id - Updated connection id.
     */
    const onUpdate = (id: string): void => {
        if (isAutomaticTabRedirectionEnabled && tabIdentifier) {
            onConnectionUpdate(id, tabIdentifier);
        } else {
            onConnectionUpdate(id, getPanes()[defaultActiveIndex]["data-tabid"]);
        }
    };

    const onAuthenticationTypeChange = (): void => {
        (updatedValue: EndpointAuthenticationType, change: boolean) => {
            setEndpointAuthenticationType(updatedValue);
            setIsAuthenticationUpdateFormState(change);
        };
    };

    const validateForm = (
        values: EndpointConfigFormPropertyInterface
    ): Partial<EndpointConfigFormPropertyInterface> => {
        return validateEndpointAuthentication(
            values,
            {
                authenticationType: endpointAuthenticationType,
                isAuthenticationUpdateFormState: isAuthenticationUpdateFormState
            },
            t
        );
    };

    const resolveDisplayName = (): string => {
        if (isCustomLocalAuthenticator) {
            return (identityProvider as CustomAuthConnectionInterface)?.displayName;
        } else {
            return (identityProvider as ConnectionInterface)?.name;
        }
    };


    const Loader = (): ReactElement => (
        <EmphasizedSegment padded>
            <ContentLoader inline="centered" active />
        </EmphasizedSegment>
    );

    const GeneralIdentityProviderSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <GeneralSettings
                hideIdPLogoEditField={ ConnectionsManagementUtils.hideLogoInputFieldInIdPGeneralSettingsForm(
                    identityProvider?.templateId
                ) }
                templateType={ type }
                isSaml={ isSaml }
                isOidc={ isOidc }
                isCustomAuthenticator={ isCustomAuthenticator }
                editingIDP={ identityProvider }
                isLoading={ isLoading }
                onDelete={ onDelete }
                onUpdate={ onUpdate }
                data-testid={ `${testId}-general-settings` }
                isReadOnly={ isReadOnly }
                loader={ Loader }
            />
        </ResourceTab.Pane>
    );

    const AttributeSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AttributeSettings
                idpId={ identityProvider.id }
                initialClaims={ identityProvider.claims }
                initialRoleMappings={ identityProvider.roles.mappings }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                hideIdentityClaimAttributes={
                    /*identity claim attributes are disabled for saml and oidc selectively*/
                    (isSaml || isOidc) &&
                    identityProviderConfig.utils.hideIdentityClaimAttributes(
                        identityProvider.federatedAuthenticators.defaultAuthenticatorId
                    )
                }
                isRoleMappingsEnabled={
                    isSaml ||
                    FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.SAML_AUTHENTICATOR_ID !==
                        identityProvider.federatedAuthenticators.defaultAuthenticatorId
                }
                data-testid={ `${testId}-attribute-settings` }
                provisioningAttributesEnabled={
                    !disabledFeatures?.includes("identityProviders.attributes.provisioningAttributes") &&
                    (isSaml ||
                        isProvisioningAttributesEnabled(
                            identityProvider.federatedAuthenticators.defaultAuthenticatorId
                        ))
                }
                isReadOnly={ isReadOnly }
                loader={ Loader }
                isOIDC={ isOidc }
                isSaml={ isSaml }
            />
        </ResourceTab.Pane>
    );

    const CustomAuthenticatorSettingsTabPane = (): ReactElement => {

        const handleSubmit = (
            values: EndpointConfigFormPropertyInterface,
            changedFields: EndpointConfigFormPropertyInterface
        ) => {

            const authProperties: any = {};

            switch (values.authenticationType) {
                case EndpointAuthenticationType.BASIC:
                    authProperties["username"] = values.usernameAuthProperty;
                    authProperties["password"] = values.passwordAuthProperty;

                    break;
                case EndpointAuthenticationType.BEARER:
                    authProperties["accessToken"] = values.accessTokenAuthProperty;

                    break;
                case EndpointAuthenticationType.API_KEY:
                    authProperties["header"]= values.headerAuthProperty;
                    authProperties["value"] = values.valueAuthProperty;

                    break;
                case EndpointAuthenticationType.NONE:
                    break;
                default:
                    break;
            }

            if (isCustomLocalAuthenticator) {
                const updatingValues: EndpointAuthenticationUpdateInterface = {
                    displayName: resolveDisplayName(),
                    endpoint: {
                        authentication: {
                            properties: authProperties,
                            type: values.authenticationType as EndpointAuthenticationType
                        },
                        uri: changedFields?.endpointUri ? values.endpointUri : undefined
                    },
                    isEnabled: identityProvider.isEnabled,
                    isPrimary: identityProvider.isPrimary
                };

                updateCustomAuthentication(identityProvider.id, updatingValues as CustomAuthConnectionInterface)
                    .then(() => {
                        dispatch(
                            addAlert({
                                description: t("authenticationProvider:notifications.updateIDP." +
                                    "success.description"),
                                level: AlertLevels.SUCCESS,
                                message: t("authenticationProvider:notifications.updateIDP." + "success.message")
                            })
                        );
                        onUpdate(identityProvider.id);
                    })
                    .catch((error: AxiosError) => {
                        handleConnectionUpdateError(error);
                    })
                    .finally(() => {
                        getCustomLocalAuthenticator(identityProvider.id);
                    });
            } else {
                const federatedAuthenticatorId: string = identityProvider?.federatedAuthenticators?.
                    authenticators[0]?.authenticatorId;
                const updatingValues: FederatedAuthenticatorInterface = {
                    authenticatorId: federatedAuthenticatorId,
                    endpoint: {
                        authentication: {
                            properties: authProperties,
                            type: values.authenticationType as EndpointAuthenticationType
                        },
                        uri: values.endpointUri
                    },
                    isEnabled: identityProvider.isEnabled
                };

                updateFederatedAuthenticator(identityProvider.id, updatingValues)
                    .then(() => {
                        dispatch(addAlert({
                            description: t("authenticationProvider:" +
                                                    "notifications.updateFederatedAuthenticator." +
                                                    "success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("authenticationProvider:notifications." +
                                                    "updateFederatedAuthenticator." +
                                                    "success.message")
                        }));
                        onUpdate(identityProvider.id);
                    })
                    .catch((error: AxiosError) => {
                        if (error.response && error.response.data && error.response.data.description) {
                            dispatch(addAlert({
                                description: t("authenticationProvider:" +
                                            "notifications.updateFederatedAuthenticator." +
                                            "error.description", { description: error.response.data.description }),
                                level: AlertLevels.ERROR,
                                message: t("authenticationProvider:" +
                                            "notifications.updateFederatedAuthenticator." +
                                            "error.message")
                            }));

                            return;
                        }

                        dispatch(addAlert({
                            description: t("authenticationProvider:notifications." +
                                        "updateFederatedAuthenticator." +
                                        "genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("authenticationProvider:notifications." +
                                        "updateFederatedAuthenticator." +
                                        "genericError.message")
                        }));
                    })
                    .finally(() => {
                        getCustomFederatedAuthenticator(federatedAuthenticatorId);
                    });
            }
        };

        return(
            <div className="custom-authentication-create-wizard">
                <FinalForm
                    onSubmit={ (values: EndpointConfigFormPropertyInterface, form: any) => {
                        handleSubmit(values, form.getState().dirtyFields); }
                    }
                    initialValues={ authenticatorEndpoint }
                    validate={ validateForm }
                    render={ ({ handleSubmit }: FormRenderProps) => (
                        <form onSubmit={ handleSubmit }>
                            <EmphasizedSegment
                                className="form-wrapper"
                                padded={ "very" }
                                data-componentid={ `${testId}-section` }
                            >
                                <div className="form-container with-max-width">
                                    <ActionEndpointConfigForm
                                        initialValues={ authenticatorEndpoint }
                                        isCreateFormState={ false }
                                        onAuthenticationTypeChange={ onAuthenticationTypeChange }
                                    />
                                    { !isLoading && (
                                        <Button
                                            size="medium"
                                            variant="contained"
                                            onClick={ handleSubmit }
                                            className={ "button-container" }
                                            data-componentid={ `${testId}-primary-button` }
                                        >
                                            { t("actions:buttons.update") }
                                        </Button>
                                    ) }
                                </div>
                            </EmphasizedSegment>
                        </form>
                    ) }
                ></FinalForm>
            </div>
        );
    };

    const AuthenticatorSettingsTabPane = (): ReactElement =>
        isCustomAuthenticator ? (
            CustomAuthenticatorSettingsTabPane()
        ) : (
            <ResourceTab.Pane controlledSegmentation>
                <AuthenticatorSettings
                    connectionSettingsMetaData={ connectionSettingsMetaData }
                    identityProvider={ identityProvider }
                    isLoading={ isLoading }
                    onUpdate={ onUpdate }
                    data-testid={ `${testId}-authenticator-settings` }
                    isReadOnly={ isReadOnly }
                    loader={ Loader }
                />
            </ResourceTab.Pane>
        );

    const OutboundProvisioningSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <OutboundProvisioningSettings
                identityProvider={ identityProvider }
                outboundConnectors={ identityProvider?.provisioning?.outboundConnectors }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                data-testid={ `${testId}-outbound-provisioning-settings` }
                isReadOnly={ isReadOnly }
                loader={ Loader }
            />
        </ResourceTab.Pane>
    );

    const JITProvisioningSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <JITProvisioningSettings
                idpId={ identityProvider.id }
                jitProvisioningConfigurations={ identityProvider?.provisioning?.jit }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                data-testid={ `${testId}-jit-provisioning-settings` }
                isReadOnly={ isReadOnly }
                loader={ Loader }
            />
        </ResourceTab.Pane>
    );

    const AdvancedSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AdvanceSettings
                editingIDP={ identityProvider }
                advancedConfigurations={ idpAdvanceConfig }
                implicitAssociationConfig={ idpImplicitAssociationConfig }
                onUpdate={ onUpdate }
                data-testid={ `${testId}-advance-settings` }
                isReadOnly={ isReadOnly }
                isLoading={ isLoading }
                loader={ Loader }
                templateType={ type }
            />
        </ResourceTab.Pane>
    );

    const ConnectedAppsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <ConnectedApps
                editingIDP={ identityProvider }
                isReadOnly={ isReadOnly }
                isLoading={ isLoading }
                loader={ Loader }
                data-componentid={ `${testId}-connected-apps-settings` }
            />
        </ResourceTab.Pane>
    );

    const IdentityProviderGroupsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <IdentityProviderGroupsTab
                editingIDP={ identityProvider }
                isReadOnly={ isReadOnly }
                isLoading={ isLoading }
                loader={ Loader }
                isOIDC={ isOidc }
                data-componentid={ `${testId}-groups-settings` }
            />
        </ResourceTab.Pane>
    );

    useEffect(() => {
        setIsTrustedTokenIssuer(type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER);
        setIsExpertMode(type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.EXPERT_MODE);
        setIsCustomAuthenticator(
            type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.EXTERNAL_CUSTOM_AUTHENTICATION ||
                type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.INTERNAL_CUSTOM_AUTHENTICATION ||
                type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TWO_FACTOR_CUSTOM_AUTHENTICATION
        );
        setIsCustomLocalAuthenticator(
            type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.INTERNAL_CUSTOM_AUTHENTICATION ||
                type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TWO_FACTOR_CUSTOM_AUTHENTICATION
        );
    }, [ type ]);

    useEffect(() => {
        if (tabPaneExtensions) {
            return;
        }

        if (!connectionSettingsMetaData?.edit?.tabs?.quickStart || !identityProvider?.id) {
            return;
        }

        let extensions: ResourceTabPaneInterface[] = [];

        if (typeof connectionSettingsMetaData?.edit?.tabs?.quickStart === "string") {
            extensions = identityProviderConfig.editIdentityProvider.getTabExtensions({
                content: lazy(() =>
                    import(
                        `../../resources/guides/${connectionSettingsMetaData?.edit?.tabs?.quickStart}/quick-start.tsx`
                    )
                ),
                identityProvider: identityProvider,
                template: template
            });
        } else {
            extensions = identityProviderConfig.editIdentityProvider.getTabExtensions({
                content: lazy(() => import("./connection-quick-start")),
                identityProvider: identityProvider,
                quickStartContent: connectionSettingsMetaData?.edit?.tabs?.quickStart,
                template: template
            });
        }

        if (Array.isArray(extensions) && extensions.length > 0) {
            if (!urlSearchParams.get(ConnectionUIConstants.IDP_STATE_URL_SEARCH_PARAM_KEY)) {
                setDefaultActiveIndex(1);
            }
        }

        setTabPaneExtensions(extensions);
    }, [ template, tabPaneExtensions, identityProvider, connectionSettingsMetaData ]);

    const getPanes = () => {
        const panes: ResourceTabPaneInterface[] = [];

        if (tabPaneExtensions && tabPaneExtensions.length > 0) {
            panes.push(...tabPaneExtensions);
        }

        if (shouldShowTab(type, ConnectionTabTypes.GENERAL)) {
            panes.push({
                "data-tabid": ConnectionUIConstants.TabIds.GENERAL,
                menuItem: "General",
                render: GeneralIdentityProviderSettingsTabPane
            });
        }

        if (shouldShowTab(type, ConnectionTabTypes.SETTINGS) && !isOrganizationEnterpriseAuthenticator) {
            panes.push({
                "data-tabid": ConnectionUIConstants.TabIds.SETTINGS,
                menuItem: "Settings",
                render: AuthenticatorSettingsTabPane
            });
        }

        /**
         * If the protocol is SAML and if the feature is enabled in
         * configuration level we can show the attributes section.
         * {@link identityProviderConfig} contains the configuration
         * to enable or disable this via extensions. Please refer
         * {@link apps/console/src/extensions#} configs folder and
         * models folder for types. identity-provider.ts
         */
        const attributesForSamlEnabled: boolean = isSaml;

        const isAttributesEnabledForOIDC: boolean = isOidc;

        // Evaluate whether to Show/Hide `Attributes`.
        if (
            shouldShowTab(type, ConnectionTabTypes.USER_ATTRIBUTES) &&
            !isOrganizationEnterpriseAuthenticator &&
            !isCustomAuthenticator &&
            (type !== CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.OIDC || isAttributesEnabledForOIDC) &&
            (type !== CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.SAML || attributesForSamlEnabled)
        ) {
            panes.push({
                "data-tabid": ConnectionUIConstants.TabIds.ATTRIBUTES,
                menuItem: "Attributes",
                render: AttributeSettingsTabPane
            });
        }

        if (
            shouldShowTab(type, ConnectionTabTypes.CONNECTED_APPS) &&
            hasApplicationReadPermissions &&
            !isCustomLocalAuthenticator
        ) {
            panes.push({
                "data-tabid": ConnectionUIConstants.TabIds.CONNECTED_APPS,
                menuItem: "Connected Apps",
                render: ConnectedAppsTabPane
            });
        }

        if (
            shouldShowTab(type, ConnectionTabTypes.IDENTITY_PROVIDER_GROUPS) &&
            featureConfig?.identityProviderGroups?.enabled &&
            !isOrganizationEnterpriseAuthenticator &&
            !isCustomAuthenticator
        ) {
            panes.push({
                "data-tabid": ConnectionUIConstants.TabIds.IDENTITY_PROVIDER_GROUPS,
                menuItem: "Groups",
                render: IdentityProviderGroupsTabPane
            });
        }

        if (
            shouldShowTab(type, ConnectionTabTypes.OUTBOUND_PROVISIONING) &&
            identityProviderConfig.editIdentityProvider.showOutboundProvisioning &&
            !isOrganizationEnterpriseAuthenticator &&
            !isCustomAuthenticator
        ) {
            panes.push({
                "data-tabid": ConnectionUIConstants.TabIds.OUTBOUND_PROVISIONING,
                menuItem: "Outbound Provisioning",
                render: OutboundProvisioningSettingsTabPane
            });
        }

        if (
            shouldShowTab(type, ConnectionTabTypes.JIT_PROVISIONING) &&
            identityProviderConfig.editIdentityProvider.showJitProvisioning &&
            !isOrganizationEnterpriseAuthenticator &&
            !isCustomLocalAuthenticator
        ) {
            panes.push({
                "data-tabid": ConnectionUIConstants.TabIds.JIT_PROVISIONING,
                menuItem: identityProviderConfig.jitProvisioningSettings?.menuItemName,
                render: JITProvisioningSettingsTabPane
            });
        }

        if (
            shouldShowTab(type, ConnectionTabTypes.ADVANCED) &&
            identityProviderConfig.editIdentityProvider.showAdvancedSettings &&
            !isOrganizationEnterpriseAuthenticator &&
            !isCustomAuthenticator
        ) {
            panes.push({
                "data-tabid": ConnectionUIConstants.TabIds.ADVANCED,
                menuItem: "Advanced",
                render: AdvancedSettingsTabPane
            });
        }

        return panes;
    };

    /**
     * Evaluate internally whether to show/hide a tab.
     *
     * @param templateType - IDP Type.
     *
     * @returns Should show tab or not.
     */
    const shouldShowTab = (templateType: string, tabType: ConnectionTabTypes): boolean => {
        const isTabEnabledInExtensions:
            | boolean
            | undefined = identityProviderConfig.editIdentityProvider.isTabEnabledForIdP(templateType, tabType);

        return isTabEnabledInExtensions !== undefined ? isTabEnabledInExtensions : true;
    };

    if (
        !identityProvider ||
        isLoading ||
        (!isOrganizationEnterpriseAuthenticator &&
            !isTrustedTokenIssuer &&
            !isEnterpriseConnection &&
            !isExpertMode &&
            !isCustomAuthenticator &&
            !tabPaneExtensions)
    ) {
        return <Loader />;
    }

    return (
        <ResourceTab
            isLoading={ isLoading }
            data-testid={ `${testId}-resource-tabs` }
            panes={ getPanes() }
            defaultActiveIndex={ defaultActiveIndex }
            onTabChange={ (e: React.MouseEvent<HTMLDivElement, MouseEvent>, data: TabProps) => {
                setDefaultActiveIndex(data.activeIndex);
                isAutomaticTabRedirectionEnabled && setIsAutomaticTabRedirectionEnabled(false);
            } }
            isAutomaticTabRedirectionEnabled={ isAutomaticTabRedirectionEnabled }
            tabIdentifier={ tabIdentifier }
        />
    );
};

/**
 * Default proptypes for the IDP edit component.
 */
EditConnection.defaultProps = {
    "data-testid": "idp-edit"
};
