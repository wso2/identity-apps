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

import { TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, useEffect, useRef } from "react";
import NotificationSystem from "react-notification-system";
import { useDispatch, useSelector } from "react-redux";
import { AlertIcons } from "../../configs";
import { AlertInterface, AlertLevels } from "../../models";
import { AppState } from "../../store";
import { initializeAlertSystem } from "../../store/actions";

/**
 * Prop types for the Alert component.
 * Also see {@link Alert.defaultProps}
 */
export interface AlertProps extends TestableComponentInterface {
    dismissInterval?: number;
    alertsPosition?: "tr" | "tl" | "tc" | "br" | "bl" | "bc";
}

/**
 * Alert component.
 *
 * @param {AlertProps} props - Props injected in to the alert component.
 * @return {JSX.Element}
 */
export const Alert: FunctionComponent<AlertProps> = (props: AlertProps): JSX.Element => {

    const alertRef = useRef(null);
    const alert: AlertInterface = useSelector((state: AppState) => state.global.alert);
    const alertSystem: any = useSelector((state: AppState) => state.global.alertSystem);
    const dispatch = useDispatch();

    const {
        alertsPosition,
        dismissInterval,
        ["data-testid"]: testId
    } = props;

    useEffect(() => {
        dispatch(initializeAlertSystem(alertRef.current));
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
                icon = AlertIcons().success;
                break;
            }
            case AlertLevels.WARNING as string: {
                icon = AlertIcons().warning;
                break;
            }
            case AlertLevels.ERROR as string: {
                icon = AlertIcons().error;
                break;
            }
            case AlertLevels.INFO as string: {
                icon = AlertIcons().info;
                break;
            }
            default:
                break;
        }

        alertSystem.addNotification({
            autoDismiss: dismissInterval,
            level: alert.level,
            message: (
                <div className="alert-message">
                    <div className="header bold-text">{ alert.message }</div>
                    <div className="description">{ alert.description }</div>
                </div>
            ),
            position: alertsPosition,
            title: (
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
        });
    }, [ alert ]);

    return (
        <div className="alert-wrapper">
            <NotificationSystem ref={ alertRef } data-testid={ testId } style={ {
                NotificationItem: {
                    DefaultStyle: {
                        cursor: "unset"
                    }
                }
            } }/>
        </div>
    );
};

/**
 * Prop types for the Alert component.
 * See type definitions in {@link AlertProps}
 */
Alert.defaultProps =  {
    alertsPosition: "br",
    "data-testid": "alert",
    dismissInterval: 5
};
