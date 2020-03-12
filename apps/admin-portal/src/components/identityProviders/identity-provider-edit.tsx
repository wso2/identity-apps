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

import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { IdentityProviderAdvanceInterface, IdentityProviderInterface } from "../../models";
import { AdvanceSettings } from "./advance-idp-settings";
import { GeneralIdentityProviderSettings } from "./general-idp-settings";
import { AuthenticatorSettings } from "./settings-authenticator";

/**
 * Proptypes for the idp edit component.
 */
interface EditIdentityProviderPropsInterface {
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
        onDelete,
        onUpdate
    } = props;

    const idpAdvanceConfig: IdentityProviderAdvanceInterface = {
        isFederationHub: identityProvider.isFederationHub,
        homeRealmIdentifier: identityProvider.homeRealmIdentifier,
        alias: identityProvider.alias,
        certificate: identityProvider.certificate,
    };

    const GeneralIdentityProviderSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <GeneralIdentityProviderSettings
                idpId={ identityProvider.id }
                description={ identityProvider.description }
                isEnabled={ identityProvider.isEnabled }
                imageUrl={ identityProvider.image }
                name={ identityProvider.name }
                isLoading={ isLoading }
                onDelete={ onDelete }
                onUpdate={ onUpdate }
            />
        </ResourceTab.Pane>
    );

    const AuthenticatorSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <AuthenticatorSettings
                idpId={ identityProvider.id }
                federatedAuthenticators={ identityProvider.federatedAuthenticators }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
            />
        </ResourceTab.Pane>
    );

    const AdvancedSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <AdvanceSettings
                idpId={ identityProvider.id }
                advancedConfigurations={ idpAdvanceConfig }
                onUpdate={ onUpdate }
            />
        </ResourceTab.Pane>
    );

    return (
        identityProvider && (
            <ResourceTab
                panes={ [
                    {
                        menuItem: "General",
                        render: GeneralIdentityProviderSettingsTabPane
                    },
                    {
                        menuItem: "Authenticator",
                        render: AuthenticatorSettingsTabPane
                    },
                    {
                        menuItem: "Advance",
                        render: AdvancedSettingsTabPane,
                    },
                ] }
            />
        )
    );
};
