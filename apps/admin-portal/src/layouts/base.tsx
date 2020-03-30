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
import React, { PropsWithChildren, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UIConstants } from "../constants";
import { AppState } from "../store";
import { TopLoadingBar } from "@wso2is/react-components";

/**
 * Base layout.
 * This layout contains the alert and can be used by any other
 * layout to include the alert.
 *
 * @return {React.ReactElement}
 */
export const BaseLayout: React.FunctionComponent<PropsWithChildren<{}>> = (
    props: PropsWithChildren<{}>
): ReactElement => {

    const alert: AlertInterface = useSelector((state: AppState) => state.global.alert);
    const alertSystem: any = useSelector((state: AppState) => state.global.alertSystem);
    const ajaxLoaderVisibility: boolean = useSelector((state: AppState) => state.global.isGlobalLoaderVisible);

    const dispatch = useDispatch();
    const { children } = props;

    const handleAlertSystemInitialize = (system) => {
        dispatch(initializeAlertSystem(system));
    };

    return (
        <>
            <TopLoadingBar height={ UIConstants.AJAX_TOP_LOADING_BAR_HEIGHT } visibility={ ajaxLoaderVisibility } />
            { children }
            <Alert
                dismissInterval={ UIConstants.ALERT_DISMISS_INTERVAL }
                alertsPosition="br"
                alertSystem={ alertSystem }
                alert={ alert }
                onAlertSystemInitialize={ handleAlertSystemInitialize }
                withIcon={ true }
            />
        </>
    );
};
