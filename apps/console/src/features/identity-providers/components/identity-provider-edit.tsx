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

import { TestableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, EmphasizedSegment, ResourceTab } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { TabProps } from "semantic-ui-react";
import {
    AdvanceSettings,
    AttributeSettings,
    AuthenticatorSettings,
    ConnectedApps,
    GeneralSettings,
    OutboundProvisioningSettings
} from "./settings";
import { JITProvisioningSettings } from "./settings/jit-provisioning-settings";
import { ComponentExtensionPlaceholder, identityProviderConfig } from "../../../extensions";
import { IdentityProviderManagementConstants } from "../constants";
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
}

/**
 * Identity Provider edit component.
 *
 * @param {EditIdentityProviderPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
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
        [ "data-testid" ]: testId
    } = props;

    const [ tabPaneExtensions, setTabPaneExtensions ] = useState<any>(undefined);
    const [ defaultActiveIndex, setDefaultActiveIndex ] = useState<any>(0);

    const isOrganizationEnterpriseAuthenticator = identityProvider.federatedAuthenticators
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
                isSaml={ isSaml }
                isOidc={ isOidc }
                editingIDP={ identityProvider }
                description={ identityProvider.description }
                isEnabled={ identityProvider.isEnabled }
                imageUrl={ identityProvider.image }
                name={ identityProvider.name }
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
                data-testid={ `${ testId }-connected-apps-settings` }
            />
        </ResourceTab.Pane>
    );

    useEffect(() => {
        if (tabPaneExtensions) {
            return;
        }

        if (!template?.content?.quickStart || !identityProvider?.id) {
            return;
        }

        const extensions: any[] = ComponentExtensionPlaceholder({
            component: "identityProvider",
            props: {
                content: template.content.quickStart,
                identityProvider: identityProvider,
                template: template
            },
            subComponent: "edit",
            type: "tab"
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
        const panes = [];

        if (tabPaneExtensions && tabPaneExtensions.length > 0) {
            panes.push(...tabPaneExtensions);
        }

        panes.push({
            menuItem: "General",
            render: GeneralIdentityProviderSettingsTabPane
        });

        !isOrganizationEnterpriseAuthenticator && panes.push({
            menuItem: "Settings",
            render: AuthenticatorSettingsTabPane
        });

        /**
         * If the protocol is SAML and if the feature is enabled in
         * configuration level we can show the attributes section.
         * {@link identityProviderConfig} contains the configuration
         * to enable or disable this via extensions. Please refer
         * {@link apps/console/src/extensions/} configs folder and
         * models folder for types. {@file identity-provider.ts}
         */
        const attributesForSamlEnabled = isSaml && identityProviderConfig.editIdentityProvider.attributesSettings;

        // Evaluate whether to Show/Hide `Attributes`.
        if ((attributesForSamlEnabled || shouldShowAttributeSettings(type))
            && !isOrganizationEnterpriseAuthenticator) {
            panes.push({
                menuItem: "Attributes",
                render: AttributeSettingsTabPane
            });
        }

        if (identityProviderConfig.editIdentityProvider.showOutboundProvisioning
            && !isOrganizationEnterpriseAuthenticator ) {
            panes.push({
                menuItem: "Outbound Provisioning",
                render: OutboundProvisioningSettingsTabPane
            });
        }

        if (identityProviderConfig.editIdentityProvider.showJitProvisioning
            && !isOrganizationEnterpriseAuthenticator) {
            panes.push({
                menuItem: identityProviderConfig.jitProvisioningSettings?.menuItemName,
                render: JITProvisioningSettingsTabPane
            });
        }

        if (identityProviderConfig.editIdentityProvider.showAdvancedSettings
            && !isOrganizationEnterpriseAuthenticator) {
            panes.push({
                menuItem: "Advanced",
                render: AdvancedSettingsTabPane
            });
        }

        panes.push({
            menuItem: "Connected Apps",
            render: ConnectedAppsTabPane
        });

        return panes;
    };

    /**
     * Evaluate internally whether to show/hide `Attributes` tab.
     *
     * @param {string} type - IDP Type.
     *
     * @return {boolean}
     */
    const shouldShowAttributeSettings = (type: string): boolean => {

        const isTabEnabledInExtensions: boolean | undefined = identityProviderConfig
            .editIdentityProvider
            .isTabEnabledForIdP(type, IdentityProviderTabTypes.USER_ATTRIBUTES);

        return isTabEnabledInExtensions !== undefined
            ? isTabEnabledInExtensions
            : true;
    };

    if (!identityProvider || isLoading) {
        return <Loader />;
    }

    return (
        <ResourceTab
            data-testid={ `${ testId }-resource-tabs` }
            panes={ getPanes() }
            defaultActiveIndex={ defaultActiveIndex }
            onTabChange={ (e, data: TabProps ) => {
                setDefaultActiveIndex(data.activeIndex);
            } }
        />
    );
};

/**
 * Default proptypes for the IDP edit component.
 */
EditIdentityProvider.defaultProps = {
    "data-testid": "idp-edit"
};
