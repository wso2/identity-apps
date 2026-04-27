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
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";

/**
 * Props interface for the Clear Chat Confirmation Modal component.
 */
export interface ClearChatConfirmationModalProps extends IdentifiableComponentInterface {
    /**
     * Whether the modal is open.
     */
    open: boolean;
    /**
     * Callback for when the modal should be closed.
     */
    onClose: () => void;
    /**
     * Callback for when the clear chat action is confirmed.
     */
    onConfirm: () => Promise<void>;
}

/**
 * Clear Chat Confirmation Modal component.
 *
 * @param props - Props injected to the component.
 * @returns Clear Chat Confirmation Modal component.
 */
const ClearChatConfirmationModal: React.FunctionComponent<ClearChatConfirmationModalProps> = (
    props: ClearChatConfirmationModalProps
): ReactElement => {
    const {
        open,
        onClose,
        onConfirm,
        ["data-componentid"]: componentId = "clear-chat-confirmation-modal"
    } = props;

    const { t } = useTranslation();

    /**
     * Handle confirm action.
     */
    const handleConfirm: () => void = (): void => {
        // Close modal immediately so the panel's refresh indicator is visible during the async op.
        // Errors are handled inside onConfirm via Redux state, so the Promise is intentionally not awaited.
        onClose();
        onConfirm();
    };

    return (
        <ConfirmationModal
            open={ open }
            onClose={ onClose }
            type="warning"
            primaryAction={ t("console:common.copilot.clearChat.confirm") }
            secondaryAction={ t("console:common.copilot.clearChat.cancel") }
            onPrimaryActionClick={ handleConfirm }
            onSecondaryActionClick={ onClose }
            closeOnDimmerClick={ false }
            data-componentid={ componentId }
        >
            <ConfirmationModal.Header data-componentid={ `${componentId}-header` }>
                { t("console:common.copilot.clearChat.title") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Content data-componentid={ `${componentId}-content` }>
                { t("console:common.copilot.clearChat.message") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

export default ClearChatConfirmationModal;
