/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RouteInterface } from "@wso2is/core/models";
import { ContentLoader, ErrorLayout as ErrorLayoutSkeleton } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, Suspense, useEffect, useState } from "react";
import { StaticContext } from "react-router";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { ProtectedRoute } from "../features/core/components";
import { getErrorLayoutRoutes } from "../features/core/configs";
import { AppConstants } from "../features/core/constants";

/**
 * Error layout Prop types.
 */
export interface ErrorLayoutPropsInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Implementation of the error layout skeleton.
 * Used to render error pages.
 *
 * @param PropsWithChildren - Props injected to the component.
 *
 * @returns a React.ReactElement.
 */
export const ErrorLayout: FunctionComponent<PropsWithChildren<ErrorLayoutPropsInterface>> = (
    props: PropsWithChildren<ErrorLayoutPropsInterface>
): ReactElement => {

    const { fluid } = props;

    const [ errorLayoutRoutes, setErrorLayoutRoutes ] = useState<RouteInterface[]>(getErrorLayoutRoutes());

    /**
     * Listen for base name changes and updates the layout routes.
     */
    useEffect(() => {
        setErrorLayoutRoutes(getErrorLayoutRoutes());
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    return (
        <ErrorLayoutSkeleton fluid={ fluid }>
            <Suspense fallback={ <ContentLoader dimmer/> }>
                <Switch>
                    {
                        errorLayoutRoutes.map((route: RouteInterface, index: number) => (
                            route.redirectTo
                                ? <Redirect key={ index } to={ route.redirectTo } />
                                : route.protected
                                    ? (
                                        <ProtectedRoute
                                            component={ route.component }
                                            path={ route.path }
                                            key={ index }
                                        />
                                    )
                                    : (
                                        <Route
                                            path={ route.path }
                                            render={ (renderProps: RouteComponentProps<{
                                                [x: string]: string;
                                            }, StaticContext, unknown>) =>
                                                (<route.component { ...renderProps } />)
                                            }
                                            key={ index }
                                        />
                                    )
                        ))
                    }
                </Switch>
            </Suspense>
        </ErrorLayoutSkeleton>
    );
};

/**
 * Default props for the error layout.
 */
ErrorLayout.defaultProps = {
    fluid: true
};
