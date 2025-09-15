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

import { useRequiredScopes } from "@wso2is/access-control";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { identityProviderConfig } from "@wso2is/admin.extensions.v1";
import { TestableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, EmphasizedSegment, ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import CustomAuthenticatorSettings from "./settings/custom-authenticator-settings";
import { JITProvisioningSettings } from "./settings/jit-provisioning-settings";
import { CommonAuthenticatorConstants } from "../../constants/common-authenticator-constants";
import { ConnectionUIConstants } from "../../constants/connection-ui-constants";
import { FederatedAuthenticatorConstants } from "../../constants/federated-authenticator-constants";
import {
    ConnectionAdvanceInterface,
    ConnectionInterface,
    ConnectionTabTypes,
    ConnectionTemplateInterface,
    ImplicitAssociaionConfigInterface
} from "../../models/connection";
import { isProvisioningAttributesEnabled } from "../../utils/attribute-utils";
import { ConnectionsManagementUtils } from "../../utils/connection-utils";

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
    const [ isCustomLocalAuthenticator, setIsCustomLocalAuthenticator ] = useState<boolean>(false);

    const hasApplicationReadPermissions: boolean = useRequiredScopes(featureConfig?.applications?.scopes?.read);

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

    const AuthenticatorSettingsTabPane = (): ReactElement =>
        isCustomAuthenticator ? (
            <ResourceTab.Pane controlledSegmentation>
                <CustomAuthenticatorSettings
                    isCustomLocalAuthenticator={ isCustomLocalAuthenticator }
                    isLoading={ isLoading }
                    isReadOnly={ isReadOnly }
                    connector={ identityProvider }
                    onUpdate={ onUpdate }
                    loader={ Loader }
                    data-componentid={ `${ testId }-authenticator-settings` }
                />
            </ResourceTab.Pane>
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
            type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.EXTERNAL_CUSTOM_AUTHENTICATOR ||
                type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.INTERNAL_CUSTOM_AUTHENTICATOR ||
                type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TWO_FACTOR_CUSTOM_AUTHENTICATOR
        );
        setIsCustomLocalAuthenticator(
            type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.INTERNAL_CUSTOM_AUTHENTICATOR ||
                type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TWO_FACTOR_CUSTOM_AUTHENTICATOR
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
            hasApplicationReadPermissions
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
            !isCustomLocalAuthenticator
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
