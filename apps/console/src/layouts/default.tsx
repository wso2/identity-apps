/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertInterface, RouteInterface } from "@wso2is/core/models";
import { initializeAlertSystem, setMobileSidePanelVisibility } from "@wso2is/core/store";
import {
    Alert,
    ContentLoader,
    DefaultLayout as DefaultLayoutSkeleton,
    TopLoadingBar,
    useUIElementSizes
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    Suspense,
    useEffect,
    useState
} from "react";
import { System } from "react-notification-system";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import {
    AppConstants,
    AppState,
    AppViewTypes,
    Footer,
    Header,
    ProtectedRoute,
    UIConstants,
    getDefaultLayoutRoutes
} from "../features/core";

/**
 * Default page layout component Prop types.
 */
export interface DefaultLayoutPropsInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Default page layout.
 *
 * @param props - Props injected to the default page layout component.
 *
 * @returns Dashboard Layout.
 */
export const DefaultLayout: FunctionComponent<DefaultLayoutPropsInterface> = (
    props: DefaultLayoutPropsInterface
): ReactElement => {

    const { fluid } = props;

    const dispatch = useDispatch();
    const { headerHeight, footerHeight } = useUIElementSizes({
        footerHeight: UIConstants.DEFAULT_FOOTER_HEIGHT,
        headerHeight: UIConstants.DEFAULT_HEADER_HEIGHT,
        topLoadingBarHeight: UIConstants.AJAX_TOP_LOADING_BAR_HEIGHT
    });

    const alert: AlertInterface = useSelector((state: AppState) => state.global.alert);
    const alertSystem: System = useSelector((state: AppState) => state.global.alertSystem);
    const activeView: AppViewTypes = useSelector((state: AppState) => state.global.activeView);
    const isAJAXTopLoaderVisible: boolean = useSelector((state: AppState) => state.global.isAJAXTopLoaderVisible);
    const isMobileSidePanelVisible: boolean = useSelector((state: AppState) => state.global.isMobileSidePanelVisible);
    const isMobileSidePanelToggleVisible: boolean = useSelector((state: AppState) => {
        return state.global.isMobileSidePanelToggleVisible;
    });

    const [ defaultLayoutRoutes, setDefaultLayoutRoutes ] = useState<RouteInterface[]>(getDefaultLayoutRoutes());

    /**
     * Listen for base name changes and updated the layout routes.
     */
    useEffect(() => {
        setDefaultLayoutRoutes(getDefaultLayoutRoutes());
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    /**
     * Handles side panel toggle click.
     */
    const handleSidePanelToggleClick = (): void => {
        dispatch(setMobileSidePanelVisibility(!isMobileSidePanelVisible));
    };

    /**
     * Handles alert system initialize.
     *
     * @param system - Alert system object.
     */
    const handleAlertSystemInitialize = (system: System): void => {
        dispatch(initializeAlertSystem(system));
    };

    return (
        <DefaultLayoutSkeleton
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
            footerHeight={ footerHeight }
            headerHeight={ headerHeight }
            header={ (
                <Header
                    activeView={ activeView }
                    fluid={ fluid }
                    onSidePanelToggleClick={ handleSidePanelToggleClick }
                    showSidePanelToggle={ isMobileSidePanelToggleVisible }
                />
            ) }
            footer={ (
                <Footer
                    fluid={ fluid }
                />
            ) }
        >
            <Suspense fallback={ <ContentLoader dimmer={ false } /> }>
                <Switch>
                    {
                        defaultLayoutRoutes.map((route, index) => (
                            route.redirectTo
                                ? <Redirect to={ route.redirectTo }/>
                                : route.protected
                                    ? (
                                        <ProtectedRoute
                                            component={ route.component ? route.component : null }
                                            path={ route.path }
                                            key={ index }
                                            exact={ route.exact }
                                        />
                                    )
                                    : (
                                        <Route
                                            path={ route.path }
                                            render={ (renderProps) =>
                                                route.component
                                                    ? <route.component { ...renderProps } />
                                                    : null
                                            }
                                            key={ index }
                                            exact={ route.exact }
                                        />
                                    )
                        ))
                    }
                </Switch>
            </Suspense>
        </DefaultLayoutSkeleton>
    );
};

/**
 * Default props for the default layout.
 */
DefaultLayout.defaultProps = {
    fluid: true
};
