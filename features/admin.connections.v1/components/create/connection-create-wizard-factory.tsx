/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import IdVPCreationModal from "@wso2is/admin.identity-verification-providers.v1/components/create/idvp-creation-modal";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FC, ReactElement } from "react";
import { AuthenticatorCreateWizardFactory } from "./authenticator-create-wizard-factory";
import {
    ConnectionTemplateInterface,
    ConnectionTypes,
    GenericConnectionCreateWizardPropsInterface
} from "../../models/connection";

/**
 * Proptypes for the Authenticator Create Wizard factory.
 */
interface ConnectionCreateWizardFactoryPropsInterface extends IdentifiableComponentInterface {
    /**
     * Show/Hide the wizard
     */
    isModalOpen: boolean;
    /**
     * Callback to be triggered on modal visibility change.
     */
    handleModalVisibility: (isVisible: boolean) => void;
    /**
     * Callback to be triggered on wizard close.
     */
    onWizardClose: GenericConnectionCreateWizardPropsInterface[ "onWizardClose" ];
    /**
     * Callback to be triggered on successful IDP create.
     */
    onIDPCreate: GenericConnectionCreateWizardPropsInterface[ "onIDPCreate" ];
    /**
     * Type of the connection.
     */
    connectionType: ConnectionTypes;
    /**
     * Type of the wizard.
     */
    type: string;
    /**
     * Selected template. Added this since this {@link AuthenticatorCreateWizardFactory}
     * does not support template grouping. If we are introducing the functionality
     * this must be well tested because it might be a breaking change. For more context
     * please refer {@link IdentityProviderTemplateSelectPage}
     */
    selectedTemplate?: ConnectionTemplateInterface;
}

/**
 * Authenticator Create Wizard factory.
 *
 * @param props - Props injected to the component.
 *
 * @returns ReactElement
 */
export const ConnectionCreateWizardFactory: FC<ConnectionCreateWizardFactoryPropsInterface> = (
    {
        isModalOpen,
        handleModalVisibility,
        onWizardClose,
        connectionType,
        type,
        selectedTemplate,
        ...rest
    }: ConnectionCreateWizardFactoryPropsInterface
): ReactElement => {

    if (!isModalOpen) {
        return null;
    }

    switch (connectionType) {
        case ConnectionTypes.IDVP:
            return (
                <IdVPCreationModal
                    selectedTemplate={ selectedTemplate }
                    onClose={ onWizardClose }
                />
            );

        default:
            return (
                <AuthenticatorCreateWizardFactory
                    isModalOpen={ isModalOpen }
                    handleModalVisibility={ handleModalVisibility }
                    type={ type }
                    selectedTemplate={ selectedTemplate }
                    onWizardClose={ onWizardClose }
                    { ...rest }
                />
            );
    };
};
