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

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Box from "@oxygen-ui/react/Box";
import Divider from "@oxygen-ui/react/Divider";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal, ConfirmationModalPropsInterface } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { NotificationSeverity, VisualEditorNotification } from "../models/visual-editor-notification";

/**
 * Proptypes for the Authentication flow update warning modal component.
 */
export interface AuthenticationFlowUpdateWarningModalPropsInterface
    extends Partial<ConfirmationModalPropsInterface>,
        IdentifiableComponentInterface {
    /**
     * List of warnings to display.
     */
    warnings: VisualEditorNotification[];
    /**
     * List of errors to display.
     */
    errors: VisualEditorNotification[];
    /**
     * Callback to be fired when the user confirms the update.
     */
    onConfirm: () => void;
}

/**
 * Authentication flow update warning modal.
 * Displays warnings and errors before allowing the user to update the flow.
 *
 * @param props - Props injected to the component.
 * @returns Authentication flow update warning modal.
 */
const AuthenticationFlowUpdateWarningModal: FunctionComponent<AuthenticationFlowUpdateWarningModalPropsInterface> = (
    props: AuthenticationFlowUpdateWarningModalPropsInterface
): ReactElement => {
    const {
        open,
        onClose,
        warnings,
        errors,
        onConfirm,
        "data-componentid": componentId
    } = props;

    const { t } = useTranslation();

    const hasErrors: boolean = errors?.length > 0;
    const hasWarnings: boolean = warnings?.length > 0;

    /**
     * Render a notification item.
     */
    const renderNotificationItem = (notification: VisualEditorNotification): ReactElement => {
        const isWarning: boolean = notification.severity === NotificationSeverity.WARNING;

        return (
            <Box
                key={ notification.id }
                sx={ {
                    alignItems: "flex-start",
                    backgroundColor: isWarning ? "#FFF4E5" : "#FDEDED",
                    borderRadius: "4px",
                    display: "flex",
                    gap: 1.5,
                    marginBottom: 1,
                    padding: "12px 16px"
                } }
                data-componentid={ `${componentId}-notification-item-${notification.id}` }
            >
                { isWarning ? (
                    <ReportProblemOutlinedIcon
                        sx={ { color: "#ED6C02", fontSize: "1.25rem", mt: 0.25 } }
                    />
                ) : (
                    <ErrorOutlineIcon
                        sx={ { color: "#D32F2F", fontSize: "1.25rem", mt: 0.25 } }
                    />
                ) }
                <Box sx={ { flex: 1 } }>
                    <Typography variant="body2" fontWeight={ 500 } sx={ { mb: 0.5 } }>
                        { notification.title }
                        { notification.stepNumber && (
                            <Typography
                                component="span"
                                variant="caption"
                                sx={ {
                                    backgroundColor: "rgba(0,0,0,0.08)",
                                    borderRadius: "4px",
                                    marginLeft: "8px",
                                    padding: "2px 8px"
                                } }
                            >
                                Step { notification.stepNumber }
                            </Typography>
                        ) }
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        { notification.description }
                    </Typography>
                </Box>
            </Box>
        );
    };

    return (
        <ConfirmationModal
            open={ open }
            onClose={ onClose }
            type={ hasErrors ? "negative" : "warning" }
            closeOnDimmerClick={ false }
            primaryAction={
                hasErrors
                    ? t("common:close")
                    : t("authenticationFlow:updateConfirmationModal.primaryActionButtonText")
            }
            secondaryAction={
                hasErrors
                    ? undefined
                    : t("authenticationFlow:updateConfirmationModal.secondaryActionButtonText")
            }
            data-componentid={ componentId }
            onPrimaryActionClick={
                hasErrors
                    ? (event: MouseEvent<HTMLElement>) => onClose(event, null)
                    : (event: MouseEvent<HTMLElement>) => {
                        onConfirm();
                        onClose(event, null);
                    }
            }
            onSecondaryActionClick={
                hasErrors
                    ? undefined
                    : (event: MouseEvent<HTMLElement>) => onClose(event, null)
            }
        >
            <ConfirmationModal.Header data-componentid={ `${componentId}-header` }>
                { hasErrors
                    ? t("authenticationFlow:updateConfirmationModal.errorTitle")
                    : t("authenticationFlow:updateConfirmationModal.warningTitle")
                }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning={ !hasErrors }
                negative={ hasErrors }
                data-componentid={ `${componentId}-message` }
            >
                { hasErrors
                    ? t("authenticationFlow:updateConfirmationModal.errorMessage")
                    : t("authenticationFlow:updateConfirmationModal.warningMessage")
                }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${componentId}-content` }>
                { hasErrors && errors.length > 0 && (
                    <Box sx={ { mb: hasWarnings ? 2 : 0 } }>
                        <Typography variant="subtitle2" fontWeight={ 600 } sx={ { mb: 1 } }>
                            Errors ({ errors.length })
                        </Typography>
                        { errors.map((notification: VisualEditorNotification) =>
                            renderNotificationItem(notification)
                        ) }
                    </Box>
                ) }
                { hasErrors && hasWarnings && <Divider sx={ { my: 2 } } /> }
                { hasWarnings && warnings.length > 0 && (
                    <Box>
                        <Typography variant="subtitle2" fontWeight={ 600 } sx={ { mb: 1 } }>
                            Warnings ({ warnings.length })
                        </Typography>
                        { warnings.map((notification: VisualEditorNotification) =>
                            renderNotificationItem(notification)
                        ) }
                    </Box>
                ) }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
AuthenticationFlowUpdateWarningModal.defaultProps = {
    "data-componentid": "authentication-flow-update-warning-modal"
};

export default AuthenticationFlowUpdateWarningModal;
