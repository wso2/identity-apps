/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com).
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
import {
    Alert,
    DashboardLayout as DashboardLayoutSkeleton,
    DashboardLayoutPropsInterface as DashboardLayoutSkeletonPropsInterface,
    TopLoadingBar
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    SyntheticEvent,
    useState
} from "react";
import { System } from "react-notification-system";
import { useDispatch, useSelector } from "react-redux";
import { Responsive } from "semantic-ui-react";
import {
    AppState,
    Footer,
    Header,
    UIConstants
} from "../features/core";

/**
 * Dashboard page layout component Prop types.
 */
export interface DashboardLayoutPropsInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
    /**
     * Side panel to be used in the layout.
     */
    sidePanel?: DashboardLayoutSkeletonPropsInterface["sidePanel"];
}

/**
 * Dashboard page layout.
 *
 * @param {DashboardPropsInterface} props - Props injected to the dashboard page layout component.
 *
 * @return {React.ReactElement}
 */
export const DashboardLayout: FunctionComponent<PropsWithChildren<DashboardLayoutPropsInterface>> = (
    props: PropsWithChildren<DashboardLayoutPropsInterface>
): ReactElement => {

    const { fluid,
        children,
        sidePanel
    } = props;

    const dispatch = useDispatch();

    const alert: AlertInterface = useSelector((state: AppState) => state.global.alert);
    const alertSystem: System = useSelector((state: AppState) => state.global.alertSystem);
    const isAJAXTopLoaderVisible: boolean = useSelector((state: AppState) => state.global.isAJAXTopLoaderVisible);
    const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);

    /**
     * Handles the layout on change event.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - On change event.
     * @param {any} width - Width of the browser window.
     */
    const handleLayoutOnUpdate = (event: SyntheticEvent<HTMLElement>, { width }): void => {
        if (width < Responsive.onlyTablet.minWidth) {
            setIsMobileViewport(true);
            return;
        }

        if (!isMobileViewport) {
            return;
        }

        setIsMobileViewport(false);
    };

    const handleAlertSystemInitialize = (system) => {
        dispatch(initializeAlertSystem(system));
    };

    return (
        <DashboardLayoutSkeleton
            fluid={ fluid }
            alert={ (
                <Alert
                    dismissInterval={ UIConstants.ALERT_DISMISS_INTERVAL }
                    alertsPosition="br"
                    alertSystem={ alertSystem }
                    alert={ alert }
                    onAlertSystemInitialize={ handleAlertSystemInitialize }
                    withIcon={ true }
                />
            ) }
            topLoadingBar={ (
                <TopLoadingBar
                    height={ UIConstants.AJAX_TOP_LOADING_BAR_HEIGHT }
                    visibility={ isAJAXTopLoaderVisible }
                />
            ) }
            onLayoutOnUpdate={ handleLayoutOnUpdate }
            header={ (
                <Header
                    fluid={ !isMobileViewport ? fluid : false }
                    showSidePanelToggle={ false }
                />
            ) }
            footer={ (
                <Footer
                    fluid={ !isMobileViewport ? fluid : false }
                />
            ) }
            sidePanel={ sidePanel }
        >
            { children }
        </DashboardLayoutSkeleton>
    );
};

/**
 * Dashboard props for the dashboard layout.
 */
DashboardLayout.defaultProps = {
    fluid: true
};
