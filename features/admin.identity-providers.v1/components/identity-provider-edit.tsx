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
import { identityProviderConfig } from "../../admin-extensions-v1";
import { ConnectionTabTypes } from "../../admin.connections.v1";
import { AppState, FeatureConfigInterface } from "../../admin-core-v1";
import { IdentityProviderConstants, IdentityProviderManagementConstants } from "../constants";
import {
    IdentityProviderAdvanceInterface,
    IdentityProviderInterface,
    IdentityProviderTabTypes,
    IdentityProviderTemplateInterface
} from "../models";

/**
 * Proptypes for the idp edit component.
 */
interface EditIdentityProviderPropsInterface extends TestableComponentInterface {
    /**
     * Editing idp.
     */
    identityProvider: IdentityProviderInterface;
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
    onUpdate: (id: string) => void;
    /**
     * Check if IDP is Google
     */
    isGoogle: boolean;
    /**
     * Check if the requesting IDP is enterprise
     * with SAML and OIDC protocols.
     */
    isEnterprise?: boolean | undefined;
    isOidc: boolean | undefined;
    isSaml: boolean | undefined;
    /**
     * IDP template.
     */
    template: IdentityProviderTemplateInterface;
    /**
     * Callback to see if tab extensions are available
     */
    isTabExtensionsAvailable: (isAvailable: boolean) => void;
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
     * Specifies, to which tab(tabid) it need to redirect.
     */
    tabIdentifier?: string;
}

/**
 * Identity Provider edit component.
 *
 * @param props - Props injected to the component.
 * @returns React Element
 */
export const EditIdentityProvider: FunctionComponent<EditIdentityProviderPropsInterface> = (
    props: EditIdentityProviderPropsInterface
): ReactElement => {

    const {
        identityProvider,
        isLoading,
        isSaml,
        isOidc,
        onDelete,
        onUpdate,
        template,
        isTabExtensionsAvailable,
        type,
        isReadOnly,
        isAutomaticTabRedirectionEnabled,
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

    const isOrganizationEnterpriseAuthenticator: boolean = identityProvider.federatedAuthenticators
        .defaultAuthenticatorId === IdentityProviderManagementConstants.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID;

    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);

    const idpAdvanceConfig: IdentityProviderAdvanceInterface = {
        alias: identityProvider.alias,
        certificate: identityProvider.certificate,
        homeRealmIdentifier: identityProvider.homeRealmIdentifier,
        isFederationHub: identityProvider.isFederationHub
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
                isTrustedTokenIssuer={ isTrustedTokenIssuer }
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
                onUpdate={ onUpdate }
                data-testid={ `${ testId }-advance-settings` }
                isReadOnly={ isReadOnly }
                isLoading={ isLoading }
                loader={ Loader }
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
        setIsTrustedTokenIssuer(type === IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER);
    }, [ type ]);

    useEffect(() => {
        if (tabPaneExtensions) {
            return;
        }

        if (!template?.content?.quickStart || !identityProvider?.id) {
            return;
        }

        const extensions: ResourceTabPaneInterface[] = identityProviderConfig
            .editIdentityProvider.getTabExtensions({
                content: template.content.quickStart,
                identityProvider: identityProvider,
                template: template
            });

        if (Array.isArray(extensions) && extensions.length > 0) {
            isTabExtensionsAvailable(true);
            if (!urlSearchParams.get(IdentityProviderManagementConstants.IDP_STATE_URL_SEARCH_PARAM_KEY)) {
                setDefaultActiveIndex(1);
            }
        }

        setTabPaneExtensions(extensions);
    }, [
        template,
        tabPaneExtensions,
        identityProvider
    ]);

    const getPanes = () => {
        const panes: ResourceTabPaneInterface[] = [];

        if (tabPaneExtensions && tabPaneExtensions.length > 0) {
            panes.push(...tabPaneExtensions);
        }

        /**
         * This check is used as a temporary fix to hide the un-necessary tabs for trusted token issuers.
         * This will be removed once the dynamic tab loading is implemented.
         * (https://github.com/wso2-enterprise/iam-engineering/issues/575)
         */
        if (isTrustedTokenIssuer) {
            panes.push({
                "data-tabid": IdentityProviderConstants.GENERAL_TAB_ID,
                menuItem: "General",
                render: GeneralIdentityProviderSettingsTabPane
            });
        } else {
            panes.push({
                "data-tabid": IdentityProviderConstants.GENERAL_TAB_ID,
                menuItem: "General",
                render: GeneralIdentityProviderSettingsTabPane
            });

            !isOrganizationEnterpriseAuthenticator && panes.push({
                "data-tabid": IdentityProviderConstants.SETTINGS_TAB_ID,
                menuItem: "Settings",
                render: AuthenticatorSettingsTabPane
            });

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
            if ((attributesForSamlEnabled || shouldShowAttributeSettings(type))
            && !isOrganizationEnterpriseAuthenticator) {
                panes.push({
                    "data-tabid": IdentityProviderConstants.ATTRIBUTES_TAB_ID,
                    menuItem: "Attributes",
                    render: AttributeSettingsTabPane
                });
            }

            panes.push({
                "data-tabid": IdentityProviderConstants.CONNECTED_APPS_TAB_ID,
                menuItem: "Connected Apps",
                render: ConnectedAppsTabPane
            });

            if (featureConfig?.identityProviderGroups?.enabled
            && !isOrganizationEnterpriseAuthenticator) {
                panes.push({
                    "data-tabid": IdentityProviderConstants.IDENTITY_PROVIDER_GROUPS_TAB_ID,
                    menuItem: "Groups",
                    render: IdentityProviderGroupsTabPane
                });
            }

            if (identityProviderConfig.editIdentityProvider.showOutboundProvisioning
            && !isOrganizationEnterpriseAuthenticator) {
                panes.push({
                    "data-tabid": IdentityProviderConstants.OUTBOUND_PROVISIONING_TAB_ID,
                    menuItem: "Outbound Provisioning",
                    render: OutboundProvisioningSettingsTabPane
                });
            }

            if (identityProviderConfig.editIdentityProvider.showJitProvisioning
            && !isOrganizationEnterpriseAuthenticator) {
                panes.push({
                    "data-tabid": IdentityProviderConstants.JIT_PROVISIONING_TAB_ID,
                    menuItem: identityProviderConfig.jitProvisioningSettings?.menuItemName,
                    render: JITProvisioningSettingsTabPane
                });
            }

            if (identityProviderConfig.editIdentityProvider.showAdvancedSettings
            && !isOrganizationEnterpriseAuthenticator) {
                panes.push({
                    "data-tabid": IdentityProviderConstants.ADVANCED_TAB_ID,
                    menuItem: "Advanced",
                    render: AdvancedSettingsTabPane
                });
            }
        }

        return panes;
    };

    /**
     * Evaluate internally whether to show/hide `Attributes` tab.
     *
     * @param type - IDP Type.
     *
     * @returns Should show attribute settings or not.
     */
    const shouldShowAttributeSettings = (type: string): boolean => {

        const isTabEnabledInExtensions: boolean | undefined = identityProviderConfig
            .editIdentityProvider
            .isTabEnabledForIdP(type, ConnectionTabTypes.USER_ATTRIBUTES);

        return isTabEnabledInExtensions !== undefined
            ? isTabEnabledInExtensions
            : true;
    };

    if (!identityProvider || isLoading) {
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
            } }
            isAutomaticTabRedirectionEnabled={ isAutomaticTabRedirectionEnabled }
            tabIdentifier={ tabIdentifier }
        />
    );
};

/**
 * Default proptypes for the IDP edit component.
 */
EditIdentityProvider.defaultProps = {
    "data-testid": "idp-edit"
};
