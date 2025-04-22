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

import Alert from "@oxygen-ui/react/Alert";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import "./system-notification-alert.scss";
import { useResendAccountConfirmationAlert } from "../../hooks/use-resend-account-confirmation-alert";
import { SystemNotificationAlertState } from "../../models";

/**
 * SystemNotificationAlert component props.
 */
export type SystemNotificationAlertProps = IdentifiableComponentInterface;

/**
 * System Notification Alert component.
 *
 * @param props - Props injected into the component.
 * @returns ReactElement
 */
export const SystemNotificationAlert: FunctionComponent<SystemNotificationAlertProps> = ({
    ["data-componentid"]: componentId = "system-notification-alert"
}: SystemNotificationAlertProps): ReactElement | null => {
    const systemNotificationAlertState: SystemNotificationAlertState =
        useResendAccountConfirmationAlert(componentId);

    if (!systemNotificationAlertState?.isVisible) return null;

    return (
        <Alert
            severity={ systemNotificationAlertState?.severity }
            data-componentid={ componentId }
            className="system-notification-alert"
        >
            { systemNotificationAlertState?.message }
        </Alert>
    );
};
