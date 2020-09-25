/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertInterface } from "@wso2is/core/models";
import { initializeAlertSystem } from "@wso2is/core/store";
import { Alert } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { System } from "react-notification-system";
import { useDispatch,  useSelector } from "react-redux";
import { AppState } from "..";
import { UIConstants } from "../constants";


/**
 * This components wraps the `Alert` component and passes prop values from the Redux store.
 *
 * @return {ReactElement} AlertWrapper - A component that wraps the `Alert` component.
 */
export const AlertWrapper = (): ReactElement => {
    const alertSystem: System = useSelector((state: AppState) => state.global.alertSystem);
    const alert: AlertInterface = useSelector((state: AppState) => state.global.alert);

    const dispatch = useDispatch();

    const handleAlertSystemInitialize = (system) => {
        dispatch(initializeAlertSystem(system));
    };

    return (
        <Alert
            dismissInterval={ UIConstants.ALERT_DISMISS_INTERVAL }
            alertsPosition="br"
            alertSystem={ alertSystem }
            alert={ alert }
            onAlertSystemInitialize={ handleAlertSystemInitialize }
            withIcon={ true }
        />
    );
}
