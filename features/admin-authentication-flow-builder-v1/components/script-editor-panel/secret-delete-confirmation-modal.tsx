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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ConfirmationModalPropsInterface } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { deleteSecret } from "../../../secrets/api/secret";
import { SecretModel } from "../../../secrets/models/secret";

/**
 * Proptypes for the secret delete confirmation modal component.
 */
export interface SecretDeleteConfirmationModalPropsInterface extends Partial<ConfirmationModalPropsInterface>,
    IdentifiableComponentInterface {
        /**
         * The secret that's meant to be deleted.
         */
        deletingSecret: SecretModel;
    }

/**
 * Secret delete confirmation modal.
 *
 * @param props - React component props.
 * @returns Selected template delete confirmation modal.
 */
const SecretDeleteConfirmationModal: FunctionComponent<SecretDeleteConfirmationModalPropsInterface> = (
    props: SecretDeleteConfirmationModalPropsInterface
): ReactElement => {
    const { deletingSecret, open, onClose, ["data-componentid"]: componentId, ...rest } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    /**
     * This will be only called when user gives their consent for deletion.
     * @see `SecretDeleteConfirmationModal`
     */
    const handleSecretDelete = (): void => {
        deleteSecret({
            params: {
                secretName: deletingSecret.secretName,
                secretType: deletingSecret.type
            }
        })
            .then(() => {

                dispatch(addAlert({
                    description: t("secrets:alerts.deleteSecret.description", {
                        secretName: deletingSecret.secretName,
                        secretType: deletingSecret.type
                    }),
                    level: AlertLevels.SUCCESS,
                    message: t("secrets:alerts.deleteSecret.message")
                }));
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: error.response.data.message
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("secrets:errors.generic.description"),
                    level: AlertLevels.ERROR,
                    message: t("secrets:errors.generic.message")
                }));
            })
            .finally(() => {
                onClose(null, null);
            });
    };

    return (
        <ConfirmationModal
            open={ open }
            onClose={ onClose }
            type="negative"
            closeOnDimmerClick={ false }
            assertionHint={ t("secrets:modals.deleteSecret.assertionHint") }
            assertionType="checkbox"
            primaryAction={ t("secrets:modals.deleteSecret.primaryActionButtonText") }
            secondaryAction={ t("secrets:modals.deleteSecret.secondaryActionButtonText") }
            data-componentid={ `${componentId}-delete-confirmation-modal` }
            onPrimaryActionClick={ () => handleSecretDelete() }
            onSecondaryActionClick={ (event: MouseEvent<HTMLElement>) => onClose(event, null) }
            { ...rest }
        >
            <ConfirmationModal.Header data-componentid={ `${componentId}-delete-confirmation-modal-header` }>
                { t("secrets:modals.deleteSecret.title") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-componentid={ `${componentId}-delete-confirmation-modal-message` }
            >
                { t("secrets:modals.deleteSecret.warningMessage") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${componentId}-delete-confirmation-modal-content` }>
                { t("secrets:modals.deleteSecret.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
SecretDeleteConfirmationModal.defaultProps = {
    "data-componentid": "secret-delete-confirmation-modal"
};

export default SecretDeleteConfirmationModal;
