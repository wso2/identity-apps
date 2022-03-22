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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { ChildRouteInterface, RouteInterface, TestableComponentInterface } from "@wso2is/core/models";
import { RouteUtils } from "@wso2is/core/utils";
import { GenericIcon } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { fetchApplications } from "../../api";
import { getSidePanelIcons, getAppRoutes } from "../../configs";
import { AppConstants } from "../../constants";
import * as UIConstants from "../../constants/ui-constants";
import { FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";
import { toggleApplicationsPageVisibility } from "../../store/actions";
import { filterRoutes } from "../../utils";

/**
 * Side panel items component Prop types.
 * Also see {@link SidePanelItems.defaultProps}
 */
interface SidePanelItemsProps extends TestableComponentInterface {
    headerHeight: number;
    onSidePanelItemClick: () => void;
    type: "desktop" | "mobile";
}

/**
 * Side panel items component.
 *
 * @param {SidePanelItemsProps} props - Props injected to the side panel items component.
 * @return {ReactElement}
 */
export const SidePanelItems: React.FunctionComponent<SidePanelItemsProps> = (
    props: SidePanelItemsProps
): ReactElement => {

    const {
        headerHeight,
        type,
        onSidePanelItemClick,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const isApplicationsPageVisible = useSelector((state: AppState) => state.global.isApplicationsPageVisible);
    const [ isOverviewPageVisible ] = useState(false);
    const appConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);

    const [ filteredRoutes, setFilteredRoutes ] = useState<RouteInterface[]>(getAppRoutes());
    const [
        selectedRoute,
        setSelectedRoute
    ] = useState<RouteInterface | ChildRouteInterface>(getAppRoutes()[ 0 ]);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);

    const style = type === "desktop"
        ? {
            position: "sticky",
            top: `${ headerHeight + UIConstants.DESKTOP_CONTENT_TOP_PADDING }px`
        }
        : null;

    /**
     * Converts the isReadOnlyUserString to a boolean variable
     * @return {boolean} True/False
     */
    const convertToBoolean = (isReadOnlyUserString: any): boolean => {
        return (isReadOnlyUserString === "true");
    };
      
    /**
     * Listen for base name changes and updated the routes.
     */
    useEffect(() => {
        setFilteredRoutes(filterRoutes(getAppRoutes(), appConfig));
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    useEffect(() => {
        setSelectedRoute(RouteUtils.getInitialActiveRoute(location.pathname, filteredRoutes));
    }, [ filteredRoutes ]);

    /**
     * Performs pre-requisites for the side panel items visibility.
     */
    useEffect(() => {
        // Fetches the list of applications to see if the list is empty.
        // If it is empty, hides the side panel item.
        if (isApplicationsPageVisible === undefined) {
            fetchApplications(null, null, null)
                .then((response) => {
                    if (isEmpty(response.applications)) {
                        dispatch(toggleApplicationsPageVisibility(false));
                        return;
                    }
                    dispatch(toggleApplicationsPageVisibility(true));
                })
                .catch(() => {
                    dispatch(toggleApplicationsPageVisibility(false));
                });
        }
    }, [dispatch, isApplicationsPageVisible ]);

    const isRouteActive = (path: string) => {
        return (selectedRoute?.path === path) ? "active" : "";
    };

    /**
     * Validates if the side panel item should be displayed.
     *
     * @param {string} path - specific route.
     * @return {boolean}
     */
    const validateSidePanelVisibility = (path: string): boolean => {
        if (path === AppConstants.getPaths().get("APPLICATIONS")) {
            return isApplicationsPageVisible;
        }
        return true;
    };

    /**
     * Validates if the overview page should be displayed in the side panel.
     *
     * @param {string} path - specific route.
     * @return {boolean}
     */
    const validateOverviewVisibility = (path: string): boolean => {
        if ((path === AppConstants.getPaths().get("OVERVIEW")) && convertToBoolean(isReadOnlyUser)) {
            return false; 
        }

        return true;
    };

    return (
        <Menu className={ `side-panel ${ type }` }
              data-testid={ `${testId}-menu` }
              style={ style } vertical fluid>
            {
                appConfig && (
                    filteredRoutes.map((route, index) => (
                        (route.showOnSidePanel
                            && hasRequiredScopes(appConfig[route.id], appConfig[route.id]?.scopes?.read, allowedScopes)
                            && validateSidePanelVisibility(route.path)
                            && validateOverviewVisibility(route.path))
                            ? (
                                <Menu.Item
                                    data-testid={ `${testId}-menu-item` }
                                    as={ NavLink }
                                    to={ route.path }
                                    name={ route.name }
                                    className={
                                        `side-panel-item ${ isRouteActive(route.path) } hover-background ellipsis`
                                    }
                                    active={ isRouteActive(route.path) === "active" }
                                    onClick={ onSidePanelItemClick }
                                    key={ index }
                                >
                                    <GenericIcon
                                        icon={ getSidePanelIcons()[ route.icon ] }
                                        size="micro"
                                        floated="left"
                                        spaced="right"
                                        transparent
                                    />
                                    <span className="route-name">{ t(route.name) }</span>
                                </Menu.Item>
                            )
                            : null
                    ))
                )
            }
        </Menu>
    );
};

/**
 * Default props of {@link SidePanelItems}
 * See type definitions in {@link SidePanelItemsProps}
 */
SidePanelItems.defaultProps = {
    "data-testid": "side-panel"
};
