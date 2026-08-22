/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ClientSecretInterface } from "../../models/application-inbound";

/**
 * Props for the delete client secret modal component.
 */
interface DeleteClientSecretModalPropsInterface extends IdentifiableComponentInterface {
    /**
     * Client secret to be deleted.
     */
    secret: ClientSecretInterface;
    /**
     * Whether the modal is open.
     */
    open: boolean;
    /**
     * Callback fired when the deletion is confirmed.
     */
    onConfirm: (secret: ClientSecretInterface) => void;
    /**
     * Callback fired when the modal is dismissed.
     */
    onCancel: () => void;
}

/**
 * Confirmation modal shown before deleting a client secret.
 *
 * @param props - Props injected to the component.
 * @returns Delete client secret modal.
 */
const DeleteClientSecretModal: FunctionComponent<DeleteClientSecretModalPropsInterface> = (
    props: DeleteClientSecretModalPropsInterface
): ReactElement => {

    const {
        secret,
        open,
        onConfirm,
        onCancel,
        [ "data-componentid" ]: componentId = "delete-client-secret-modal"
    } = props;

    const { t } = useTranslation();

    return (
        <ConfirmationModal
            type="negative"
            open={ open }
            assertionHint={ t("applications:clientSecrets.confirmations.deleteSecret.assertionHint") }
            assertionType="checkbox"
            primaryAction={ t("common:confirm") }
            secondaryAction={ t("common:cancel") }
            onClose={ onCancel }
            onSecondaryActionClick={ onCancel }
            onPrimaryActionClick={ (): void => onConfirm(secret) }
            closeOnDimmerClick={ false }
            data-componentid={ componentId }
        >
            <ConfirmationModal.Header data-componentid={ `${ componentId }-header` }>
                { t("applications:clientSecrets.confirmations.deleteSecret.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-componentid={ `${ componentId }-message` }
            >
                { t("applications:clientSecrets.confirmations.deleteSecret.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${ componentId }-content` }>
                { t("applications:clientSecrets.confirmations.deleteSecret.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

export default DeleteClientSecretModal;
