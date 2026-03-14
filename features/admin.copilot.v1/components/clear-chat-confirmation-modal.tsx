/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import WarningIcon from "@mui/icons-material/Warning";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import "./clear-chat-confirmation-modal.scss";

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
    onConfirm: () => void;
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

    const { t: _t } = useTranslation();

    /**
     * Handle confirm action.
     */
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog
            className="clear-chat-confirmation-modal"
            data-componentid={ componentId }
            disablePortal={ true }
            fullWidth
            hideBackdrop={ true }
            maxWidth="sm"
            onClose={ onClose }
            open={ open }
        >
            <DialogTitle className="clear-chat-modal-title">
                <Box className="clear-chat-modal-title-content">
                    <WarningIcon className="clear-chat-warning-icon" />
                    <Typography variant="h6" component="span">
                        Clear Chat
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent className="clear-chat-modal-content">
                <Typography variant="body1" className="clear-chat-modal-message">
                    Are you sure you want to clear the chat?
                </Typography>
                <Typography variant="body2" className="clear-chat-modal-submessage">
                    This action cannot be undone.
                </Typography>
            </DialogContent>

            <DialogActions className="clear-chat-modal-actions">
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={ onClose }
                    data-componentid={ `${componentId}-cancel-button` }
                    className="clear-chat-cancel-button"
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={ handleConfirm }
                    data-componentid={ `${componentId}-confirm-button` }
                    className="clear-chat-confirm-button"
                >
                    Clear Chat
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClearChatConfirmationModal;
