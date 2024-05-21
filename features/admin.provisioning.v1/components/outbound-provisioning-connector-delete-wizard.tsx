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

import { OutboundProvisioningConfigurationInterface } from "@wso2is/admin.applications.v1/models/application";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";

/**
 * Interface for the outbound provisioning IDP delete confirmation modal props.
 */
interface OutboundProvisioningConnectorDeleteWizardPropsInterface extends IdentifiableComponentInterface {
    isOpen: boolean;
    onClose: () => void;
    deletingIdp: OutboundProvisioningConfigurationInterface;
    onConfirm: (idp: OutboundProvisioningConfigurationInterface) => void;
}

/**
 * Outbound provisioning IDP delete confirmation modal component.
 *
 * @param props - Props injected to the component.
 * @returns Outbound provisioning IDP delete confirmation modal component.
 */
export const OutboundProvisioningConnectorDeleteWizard: FunctionComponent<
    OutboundProvisioningConnectorDeleteWizardPropsInterface
> = (props: OutboundProvisioningConnectorDeleteWizardPropsInterface): ReactElement => {

    const {
        isOpen,
        onClose,
        deletingIdp,
        onConfirm,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    return (
        <ConfirmationModal
            onClose={ onClose }
            type="negative"
            open={ isOpen }
            assertion={ deletingIdp?.idp }
            assertionHint={ (
                <p>
                    <Trans
                        i18nKey={
                            "applications:confirmations" +
                            ".deleteOutboundProvisioningIDP.assertionHint"
                        }
                        tOptions={ { name: deletingIdp?.idp } }
                    >
                        Please type <strong>{ deletingIdp?.idp }</strong> to confirm.
                    </Trans>
                </p>
            ) }
            assertionType="input"
            primaryAction={ t("common:confirm") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ onClose }
            onPrimaryActionClick={ () => onConfirm(deletingIdp) }
            data-componentid={ `${ componentId }-connector-delete-confirmation-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header
                data-componentid={ `${ componentId }-connector-delete-confirmation-modal-header` }
            >
                { t("applications:confirmations.deleteOutboundProvisioningIDP.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-componentid={ `${ componentId }-connector-delete-confirmation-modal-message` }
            >
                { t("applications:confirmations.deleteOutboundProvisioningIDP.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content
                data-componentid={ `${ componentId }-connector-delete-confirmation-modal-content` }
            >
                { t("applications:confirmations.deleteOutboundProvisioningIDP.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the outbound provisioning IDP create wizard.
 */
OutboundProvisioningConnectorDeleteWizard.defaultProps = {
    "data-componentid": "outbound-provisioning-connector-delete-wizard"
};
