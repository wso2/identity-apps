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
import { AppState } from "@wso2is/admin.core.v1/store";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FC, ReactElement } from "react";
import { useSelector } from "react-redux";
import { AuthenticatorCreateWizardFactory } from "./authenticator-create-wizard-factory";
import FlowExtensionCreateWizard from "./flow-extension-create-wizard";
import { CommonAuthenticatorConstants } from "../../constants/common-authenticator-constants";
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

    const actionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.actions);
    const { isSubOrganization } = useGetCurrentOrganizationType();
    const flowExtensionFeatureKey: string = isSubOrganization()
        ? "actions.types.org.list.flowExtension"
        : "actions.types.list.flowExtension";

    if (!isModalOpen) {
        return null;
    }

    if (connectionType === ConnectionTypes.IDVP) {
        return (
            <IdVPCreationModal
                selectedTemplate={ selectedTemplate }
                onClose={ onWizardClose }
            />
        );
    }

    // Match either by the enum type on the template OR by the template's id string.
    // The backend may type the template as "DEFAULT" even though it's an flow extension,
    // so we fall back to checking the templateId string.
    if (
        (connectionType === ConnectionTypes.FLOW_EXTENSION ||
        type === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.FLOW_EXTENSION) &&
        isFeatureEnabled(actionsFeatureConfig, flowExtensionFeatureKey)
    ) {
        return (
            <FlowExtensionCreateWizard
                title={ selectedTemplate?.name }
                subTitle={ selectedTemplate?.description }
                onWizardClose={ onWizardClose }
                template={ selectedTemplate as ConnectionTemplateInterface }
                data-componentid={ selectedTemplate?.templateId }
                { ...rest }
            />
        );
    }

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
