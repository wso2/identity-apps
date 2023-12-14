/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    EmphasizedSegment,
    ResourceTab,
    ResourceTabPaneInterface
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    lazy,
    useEffect,
    useState
} from "react";
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
import { JITProvisioningSettings } from "./settings/jit-provisioning-settings";
import { identityProviderConfig } from "../../../../extensions";
import { AppState, FeatureConfigInterface } from "../../../core";
import { AuthenticatorManagementConstants } from "../../constants/autheticator-constants";
import { ConnectionManagementConstants } from "../../constants/connection-constants";
import {
    ConnectionAdvanceInterface,
    ConnectionInterface,
    ConnectionTabTypes,
    ConnectionTemplateInterface,
    ImplicitAssociaionConfigInterface
} from "../../models/connection";

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
    isGoogle: boolean;
    /**
     * Check if the requesting IDP is enterprise
     * with SAML and OIDC protocols.
     */
    isEnterprise?: boolean | undefined;
    /**
     * Check if the requesting IDP is OIDC.
     */
    isOidc: boolean | undefined;
    /**
     * Check if the requesting IDP is SAML.
     */
    isSaml: boolean | undefined;
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
    connectionSettingsMetaData: any;
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
        [ "data-testid" ]: testId
    } = props;

    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ tabPaneExtensions, setTabPaneExtensions ] = useState<ResourceTabPaneInterface[]>(undefined);
    const [ defaultActiveIndex, setDefaultActiveIndex ] = useState<number | string>(0);

    /**
     * This is placed as a temporary fix until the dynamic tab loading is implemented.
     * (https://github.com/wso2-enterprise/iam-engineering/issues/575)
     */
    const [ isTrustedTokenIssuer, setIsTrustedTokenIssuer ] = useState<boolean>(false);
    const [ isExpertMode, setIsExpertMode ] = useState<boolean>(false);

    const isOrganizationEnterpriseAuthenticator: boolean = identityProvider.federatedAuthenticators
        .defaultAuthenticatorId === ConnectionManagementConstants.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID;
    const isEnterpriseConnection: boolean = identityProvider?.federatedAuthenticators
        .defaultAuthenticatorId === AuthenticatorManagementConstants.SAML_AUTHENTICATOR_ID ||
        identityProvider?.federatedAuthenticators
            .defaultAuthenticatorId === AuthenticatorManagementConstants.OIDC_AUTHENTICATOR_ID;

    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);

    const idpAdvanceConfig: ConnectionAdvanceInterface = {
        alias: identityProvider.alias,
        certificate: identityProvider.certificate,
        homeRealmIdentifier: identityProvider.homeRealmIdentifier,
        isFederationHub: identityProvider.isFederationHub
    };

    const idpImplicitAssociationConfig: ImplicitAssociaionConfigInterface = {
        isEnabled: identityProvider.implicitAssociation.isEnabled,
        lookupAttribute: identityProvider.implicitAssociation.lookupAttribute
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
            <ContentLoader inline="centered" active/>
        </EmphasizedSegment>
    );

    const GeneralIdentityProviderSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <GeneralSettings
                hideIdPLogoEditField={
                    identityProviderConfig
                        .utils
                        ?.hideLogoInputFieldInIdPGeneralSettingsForm(
                            identityProvider?.federatedAuthenticators?.defaultAuthenticatorId
                        )
                }
                templateType={ type }
                isSaml={ isSaml }
                isOidc={ isOidc }
                editingIDP={ identityProvider }
                isLoading={ isLoading }
                onDelete={ onDelete }
                onUpdate={ onUpdate }
                data-testid={ `${ testId }-general-settings` }
                isReadOnly = { isReadOnly }
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
                    /*identity claim attributes are disabled for saml*/
                    isSaml && identityProviderConfig.utils.hideIdentityClaimAttributes(
                        identityProvider.federatedAuthenticators.defaultAuthenticatorId
                    )
                }
                isRoleMappingsEnabled={
                    isSaml || identityProviderConfig.utils.isRoleMappingsEnabled(
                        identityProvider.federatedAuthenticators.defaultAuthenticatorId
                    )
                }
                data-testid={ `${ testId }-attribute-settings` }
                provisioningAttributesEnabled={
                    isSaml || identityProviderConfig.utils.isProvisioningAttributesEnabled(
                        identityProvider.federatedAuthenticators.defaultAuthenticatorId
                    )
                }
                isReadOnly={ isReadOnly }
                loader={ Loader }
                isSaml={ isSaml }
            />
        </ResourceTab.Pane>
    );

    const AuthenticatorSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AuthenticatorSettings
                connectionSettingsMetaData={ connectionSettingsMetaData }
                identityProvider={ identityProvider }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                data-testid={ `${ testId }-authenticator-settings` }
                isReadOnly={ isReadOnly }
                loader={ Loader }
            />
        </ResourceTab.Pane>
    );

    const OutboundProvisioningSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <OutboundProvisioningSettings
                identityProvider={ identityProvider }
                outboundConnectors={ identityProvider.provisioning?.outboundConnectors }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                data-testid={ `${ testId }-outbound-provisioning-settings` }
                isReadOnly={ isReadOnly }
                loader={ Loader }
            />
        </ResourceTab.Pane>
    );

    const JITProvisioningSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <JITProvisioningSettings
                idpId={ identityProvider.id }
                jitProvisioningConfigurations={ identityProvider.provisioning?.jit }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                data-testid={ `${ testId }-jit-provisioning-settings` }
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
                data-testid={ `${ testId }-advance-settings` }
                isReadOnly={ isReadOnly }
                isLoading={ isLoading }
                loader={ Loader }
                templateType = { type }
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
                data-componentid={ `${ testId }-connected-apps-settings` }
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
                data-componentid={ `${ testId }-groups-settings` }
            />
        </ResourceTab.Pane>
    );

    useEffect(() => {
        setIsTrustedTokenIssuer(type === "trusted-token-issuer");
        setIsExpertMode(type === "expert-mode-idp");
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
            extensions = identityProviderConfig
                .editIdentityProvider.getTabExtensions({
                    content: lazy(
                        () => import(`../../resources/guides/${
                            connectionSettingsMetaData?.edit?.tabs?.quickStart
                        }/quick-start`)
                    ),
                    identityProvider: identityProvider,
                    template: template
                });
        } else {
            extensions = identityProviderConfig
                .editIdentityProvider.getTabExtensions({
                    content: lazy(() => import("./connection-quick-start")),
                    identityProvider: identityProvider,
                    quickStartContent: connectionSettingsMetaData?.edit?.tabs?.quickStart,
                    template: template
                });
        }

        if (Array.isArray(extensions) && extensions.length > 0) {
            if (!urlSearchParams.get(ConnectionManagementConstants.IDP_STATE_URL_SEARCH_PARAM_KEY)) {
                setDefaultActiveIndex(1);
            }
        }

        setTabPaneExtensions(extensions);
    }, [
        template,
        tabPaneExtensions,
        identityProvider,
        connectionSettingsMetaData
    ]);

    const getPanes = () => {
        const panes: ResourceTabPaneInterface[] = [];

        if (tabPaneExtensions && tabPaneExtensions.length > 0) {
            panes.push(...tabPaneExtensions);
        }

        if (shouldShowTab(type, ConnectionTabTypes.GENERAL)) {
            panes.push({
                "data-tabid": ConnectionManagementConstants.GENERAL_TAB_ID,
                menuItem: "General",
                render: GeneralIdentityProviderSettingsTabPane
            });
        }

        if (shouldShowTab(type, ConnectionTabTypes.SETTINGS) && !isOrganizationEnterpriseAuthenticator) {
            panes.push({
                "data-tabid": ConnectionManagementConstants.SETTINGS_TAB_ID,
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
        const attributesForSamlEnabled: boolean = isSaml &&
        identityProviderConfig.editIdentityProvider.attributesSettings;

        // Evaluate whether to Show/Hide `Attributes`.
        if ((attributesForSamlEnabled || shouldShowTab(type, ConnectionTabTypes.USER_ATTRIBUTES))
        && !isOrganizationEnterpriseAuthenticator) {
            panes.push({
                "data-tabid": ConnectionManagementConstants.ATTRIBUTES_TAB_ID,
                menuItem: "Attributes",
                render: AttributeSettingsTabPane
            });
        }

        if (shouldShowTab(type, ConnectionTabTypes.CONNECTED_APPS)) {
            panes.push({
                "data-tabid": ConnectionManagementConstants.CONNECTED_APPS_TAB_ID,
                menuItem: "Connected Apps",
                render: ConnectedAppsTabPane
            });
        }

        if (shouldShowTab(type, ConnectionTabTypes.IDENTITY_PROVIDER_GROUPS) &&
        featureConfig?.identityProviderGroups?.enabled &&
        !isOrganizationEnterpriseAuthenticator) {
            panes.push({
                "data-tabid": ConnectionManagementConstants.IDENTITY_PROVIDER_GROUPS_TAB_ID,
                menuItem: "Groups",
                render: IdentityProviderGroupsTabPane
            });
        }

        if (shouldShowTab(type, ConnectionTabTypes.OUTBOUND_PROVISIONING) &&
        identityProviderConfig.editIdentityProvider.showOutboundProvisioning &&
        !isOrganizationEnterpriseAuthenticator) {
            panes.push({
                "data-tabid": ConnectionManagementConstants.OUTBOUND_PROVISIONING_TAB_ID,
                menuItem: "Outbound Provisioning",
                render: OutboundProvisioningSettingsTabPane
            });
        }

        if (shouldShowTab(type, ConnectionTabTypes.JIT_PROVISIONING) &&
        identityProviderConfig.editIdentityProvider.showJitProvisioning &&
        !isOrganizationEnterpriseAuthenticator) {
            panes.push({
                "data-tabid": ConnectionManagementConstants.JIT_PROVISIONING_TAB_ID,
                menuItem: identityProviderConfig.jitProvisioningSettings?.menuItemName,
                render: JITProvisioningSettingsTabPane
            });
        }

        if (shouldShowTab(type, ConnectionTabTypes.ADVANCED) &&
        identityProviderConfig.editIdentityProvider.showAdvancedSettings &&
        !isOrganizationEnterpriseAuthenticator) {
            panes.push({
                "data-tabid": ConnectionManagementConstants.ADVANCED_TAB_ID,
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

        const isTabEnabledInExtensions: boolean | undefined = identityProviderConfig
            .editIdentityProvider
            .isTabEnabledForIdP(templateType, tabType);

        return isTabEnabledInExtensions !== undefined
            ? isTabEnabledInExtensions
            : true;
    };

    if (!identityProvider || isLoading ||
        ((!isOrganizationEnterpriseAuthenticator && !isTrustedTokenIssuer
        && !isEnterpriseConnection && !isExpertMode) && !tabPaneExtensions)) {

        return <Loader />;
    }

    return (
        <ResourceTab
            isLoading={ isLoading }
            data-testid={ `${ testId }-resource-tabs` }
            panes={ getPanes() }
            defaultActiveIndex={ defaultActiveIndex }
            onTabChange={ (e: React.MouseEvent<HTMLDivElement, MouseEvent>, data: TabProps ) => {
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
