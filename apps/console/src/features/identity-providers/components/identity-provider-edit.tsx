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
import { ResourceTab } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import {
    AdvanceSettings,
    AttributeSettings,
    AuthenticatorSettings,
    GeneralSettings,
    OutboundProvisioningSettings
} from "./settings";
import { JITProvisioningSettings } from "./settings/jit-provisioning-settings";
import { ComponentExtensionPlaceholder, identityProviderConfig } from "../../../extensions";
import { IdentityProviderManagementConstants } from "../constants";
import {
    IdentityProviderAdvanceInterface,
    IdentityProviderInterface,
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
     * Default active tab index.
     */
    defaultActiveIndex?: number;
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
        defaultActiveIndex,
        isTabExtensionsAvailable,
        type,
        isReadOnly,
        [ "data-testid" ]: testId
    } = props;

    const [ tabPaneExtensions, setTabPaneExtensions ] = useState<any>(undefined);

    const idpAdvanceConfig: IdentityProviderAdvanceInterface = {
        alias: identityProvider.alias,
        certificate: identityProvider.certificate,
        homeRealmIdentifier: identityProvider.homeRealmIdentifier,
        isFederationHub: identityProvider.isFederationHub
    };

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
                    isSaml && identityProviderConfig.utils.isRoleMappingsEnabled(
                        identityProvider.federatedAuthenticators.defaultAuthenticatorId
                    )
                }
                data-testid={ `${ testId }-attribute-settings` }
                provisioningAttributesEnabled={
                    isSaml && identityProviderConfig.utils.isProvisioningAttributesEnabled(
                        identityProvider.federatedAuthenticators.defaultAuthenticatorId
                    )
                }
                isReadOnly={ isReadOnly }
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

        panes.push({
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
        if (attributesForSamlEnabled || shouldShowAttributeSettings(type)) {
            panes.push({
                menuItem: "Attributes",
                render: AttributeSettingsTabPane
            });
        }

        identityProviderConfig.editIdentityProvider.showOutboundProvisioning &&
            panes.push({
                menuItem: "Outbound Provisioning",
                render: OutboundProvisioningSettingsTabPane
            });

        identityProviderConfig.editIdentityProvider.showJitProvisioning &&
            panes.push({
                menuItem: "Just-in-Time Provisioning",
                render: JITProvisioningSettingsTabPane
            });

        identityProviderConfig.editIdentityProvider.showAdvancedSettings &&
            panes.push({
                menuItem: "Advanced",
                render: AdvancedSettingsTabPane
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

        if (!type) {
            return false;
        }

        if (type === IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.FACEBOOK) {
            return false;
        } else if (type === IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE) {
            return false;
        } else if (type === IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GITHUB) {
            return false;
        } else if (type === IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.OIDC) {
            return false;
        }

        return true;
    };

    return (
        identityProvider && (
            <ResourceTab
                data-testid={ `${ testId }-resource-tabs` }
                panes={ getPanes() }
                defaultActiveIndex={ defaultActiveIndex }
            />
        )
    );
};

/**
 * Default proptypes for the IDP edit component.
 */
EditIdentityProvider.defaultProps = {
    "data-testid": "idp-edit"
};
