/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import AppShell from "@oxygen-ui/react/AppShell";
import { AlertInterface, RouteInterface } from "@wso2is/core/models";
import { initializeAlertSystem } from "@wso2is/core/store";
import {
    Alert,
    ContentLoader
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
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { Dispatch } from "redux";
import { Header, ProtectedRoute } from "../components";
import {
    getDefaultLayoutRoutes
} from "../configs";
import { AppConstants, UIConstants } from "../constants";
import { AppState } from "../store";

/**
 * Default page layout.
 *
 * @param props - Props injected to the default page layout component.
 *
 * @returns Dashboard Layout.
 */
export const DefaultLayout: FunctionComponent = (): ReactElement => {
    const dispatch: Dispatch = useDispatch();

    const alert: AlertInterface = useSelector(
        (state: AppState) => state.global.alert
    );
    const alertSystem: System = useSelector(
        (state: AppState) => state.global.alertSystem
    );

    const [ defaultLayoutRoutes, setDefaultLayoutRoutes ] = useState<
        RouteInterface[]
    >(getDefaultLayoutRoutes());

    /**
     * Listen for base name changes and updated the layout routes.
     */
    useEffect(() => {
        setDefaultLayoutRoutes(getDefaultLayoutRoutes());
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    const handleAlertSystemInitialize = (system: System) => {
        dispatch(initializeAlertSystem(system));
    };

    return (
        <>
            <Alert
                dismissInterval={ UIConstants.ALERT_DISMISS_INTERVAL }
                alertsPosition="br"
                alertSystem={ alertSystem }
                alert={ alert }
                onAlertSystemInitialize={ handleAlertSystemInitialize }
                withIcon={ true }
            />
            <AppShell header={ <Header /> }>
                <Suspense fallback={ <ContentLoader dimmer={ false } /> }>
                    <Switch>
                        { defaultLayoutRoutes.map((route: RouteInterface, index: number) =>
                            route.redirectTo ? (
                                <Redirect to={ route.redirectTo } key={ index } />
                            ) : route.protected ? (
                                <ProtectedRoute
                                    component={
                                        route.component ? route.component : null
                                    }
                                    path={ route.path }
                                    key={ index }
                                    exact={ route.exact }
                                />
                            ) : (
                                <Route
                                    path={ route.path }
                                    render={ (renderProps: RouteComponentProps) =>
                                        route.component ? (
                                            <route.component { ...renderProps } />
                                        ) : null
                                    }
                                    key={ index }
                                    exact={ route.exact }
                                />
                            )
                        ) }
                    </Switch>
                </Suspense>
            </AppShell>
        </>
    );
};

/**
 * Default props for the default layout.
 */
DefaultLayout.defaultProps = {
    fluid: false
};
