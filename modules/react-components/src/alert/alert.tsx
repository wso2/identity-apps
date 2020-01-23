/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "@wso2is/theme";
import classNames from "classnames";
import React, { FunctionComponent, useEffect, useRef } from "react";
import NotificationSystem from "react-notification-system";
import { GenericIcon } from "../icon";

/**
 * Prop types interface for the Alert component.
 */
export interface AlertPropsInterface {
    /**
     * Unset the position of the alert.
     */
    absolute?: boolean;
    /**
     * Alert object.
     */
    alert: AlertInterface;
    /**
     * Position of the notification. Available: tr (top right), tl (top left),
     * tc (top center), br (bottom right), bl (bottom left), bc (bottom center)
     */
    alertsPosition?: "tr" | "tl" | "tc" | "br" | "bl" | "bc";
    /**
     * Alert system instance.
     */
    alertSystem: any;
    /**
     * Settings controlling if the alert is dismissible or not.
     */
    dismissible?: boolean;
    /**
     * Delay in seconds for the alert to go away.
     */
    dismissInterval?: number;
    /**
     * Callback to be triggered to initialize the alert system.
     * @param ref
     */
    onAlertSystemInitialize: (ref: any) => void;
    /**
     * If the icon should be visible or not.
     */
    withIcon?: boolean;
}

/**
 * Icons for different alert states.
 * @type {{success: any; warning: any; error: any; info: any}}
 */
const AlertIcons = {
    error: ErrorIcon,
    info: InfoIcon,
    success: SuccessIcon,
    warning: WarningIcon
};

/**
 * Alert component to show success, error, warning and info notifications on the front end dashboards.
 *
 * @param {AlertPropsInterface} props - Props injected in to the alert component.
 * @return {JSX.Element}
 */
export const Alert: FunctionComponent<AlertPropsInterface> = (
    props: AlertPropsInterface
): JSX.Element => {

    const {
        absolute,
        alert,
        alertsPosition,
        alertSystem,
        dismissible,
        dismissInterval,
        onAlertSystemInitialize,
        withIcon
    } = props;

    const classes = classNames({
        absolute
    }, "");

    const alertRef = useRef(null);

    useEffect(() => {
        onAlertSystemInitialize(alertRef.current);
    }, []);

    /**
     * Triggered when a new alert is available on the redux store.
     */
    useEffect(() => {
        if (!alertSystem || !alert) {
            return;
        }

        let icon = null;

        switch (alert.level) {
            case AlertLevels.SUCCESS as string: {
                icon = AlertIcons.success;
                break;
            }
            case AlertLevels.WARNING as string: {
                icon = AlertIcons.warning;
                break;
            }
            case AlertLevels.ERROR as string: {
                icon = AlertIcons.error;
                break;
            }
            case AlertLevels.INFO as string: {
                icon = AlertIcons.info;
                break;
            }
            default:
                break;
        }

        alertSystem.addNotification({
            autoDismiss: dismissInterval,
            dismissible,
            level: alert.level,
            message: (
                <div className="alert-message">
                    <div className="header bold-text">{ alert.message }</div>
                    <div className="description">{ alert.description }</div>
                </div>
            ),
            position: alertsPosition,
            title: withIcon
                ? (
                    <GenericIcon
                        icon={ icon }
                        colored
                        floated="left"
                        transparent
                        size="mini"
                        inline
                        spaced="right"
                        relaxed
                    />
                )
                : null
        });
    }, [ alert ]);

    return (
        <div className={ `alert-wrapper ${ classes }` }>
            <NotificationSystem ref={ alertRef } />
        </div>
    );
};

/**
 * Prop types for the Alert component.
 */
Alert.defaultProps = {
    absolute: false,
    alertsPosition: "br",
    dismissInterval: 5,
    dismissible: true,
    withIcon: true
};
