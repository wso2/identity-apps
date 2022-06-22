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

import { UIConstants } from "@wso2is/core/constants";
import {
    CategorizedRouteInterface,
    ChildRouteInterface,
    IdentifiableComponentInterface,
    RouteInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import classNames from "classnames";
import sortBy from "lodash-es/sortBy";
import React, { PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { Container, Responsive, Sidebar } from "semantic-ui-react";
import { SidePanelItems } from "./side-panel-items";

/**
 * Common side panel base component Prop types.
 */
export interface CommonSidePanelPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Caret icon.
     */
    caretIcon?: any;
    /**
     * Should the panel be categorized.
     */
    categorized?: boolean;
    /**
     * Content spacing.
     */
    desktopContentTopSpacing?: number;
    /**
     * height of the footer.
     */
    footerHeight: number;
    /**
     * Height of the header.
     */
    headerHeight: number;
    /**
     * Hover type.
     */
    hoverType?: "highlighted" | "background";
    /**
     * Should the panel routes be ordered.
     */
    ordered?: boolean;
    /**
     * Side panel item onclick callback.
     * @param {RouteInterface | ChildRouteInterface} route - Clicked route.
     */
    onSidePanelItemClick: (route: RouteInterface | ChildRouteInterface) => void;
    /**
     * Add more margins between items.
     */
    relaxed?: boolean;
    /**
     * Selected route.
     */
    selected: RouteInterface | ChildRouteInterface;
    /**
     * Show category dividers.
     */
    showCategoryDividers?: boolean;
    /**
     * Show ellipsis in side panel items.
     */
    showEllipsis?: boolean;
    /**
     * Side panel item height.
     */
    sidePanelItemHeight?: number;
    /**
     * Position of the side panel.
     */
    sidePanelPosition?: "absolute" | "fixed" | "inherit" | "initial" | "relative" | "static" | "sticky" | "unset";
    /**
     * Top margin.
     */
    sidePanelTopMargin?: number | boolean;
    /**
     * Stop showing the category label for single item categories.
     */
    skipCategoryLabelForSingleItemCategories?: boolean;
    /**
     * i18next translation hook.
     */
    translationHook?: any;
    /**
     * Scopes allowed for the user.
     */
    allowedScopes: string;
}

/**
 * Side panel base component Prop types.
 */
export interface SidePanelPropsInterface extends CommonSidePanelPropsInterface {
    bordered?: "left" | "right" | "top" | "bottom" | boolean;
    fluid?: boolean;
    mobileSidePanelVisibility: boolean;
    onSidePanelPusherClick: () => void;
    routes: RouteInterface[];
}

/**
 * Side panel base component.
 *
 * @param {SidePanelPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SidePanel: React.FunctionComponent<PropsWithChildren<SidePanelPropsInterface>> = (
    props: PropsWithChildren<SidePanelPropsInterface>
): ReactElement => {

    const {
        allowedScopes,
        bordered,
        categorized,
        children,
        desktopContentTopSpacing,
        footerHeight,
        fluid,
        headerHeight,
        mobileSidePanelVisibility,
        ordered,
        onSidePanelItemClick,
        onSidePanelPusherClick,
        routes,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const [ items, setItems ] = useState<RouteInterface[]>(routes);

    const wrapperClasses = classNames(
        "side-panel-wrapper",
        {
            bordered,
            [ typeof bordered === "boolean" ? "all" : `${ bordered }` ]: bordered
        }
    );

    const mainLayoutStyles = {
        paddingBottom: `${ footerHeight }px`,
        paddingTop: `${ headerHeight }px`
    };

    const desktopContentStyle = {
        minHeight: `calc(100vh - ${ headerHeight + footerHeight }px`,
        paddingTop: `${ desktopContentTopSpacing }px`
    };

    /**
     * Update items when the routes prop changes
     */
    useEffect(() => {
        setItems(routes);
    }, [ routes ]);

    /**
     * Evaluate if the child item section should be extended or not. If so, adds
     * `open` attribute to the route section.
     *
     * @param {RouteInterface[] | ChildRouteInterface[]} routesArray - Array of routes.
     * @param {RouteInterface | ChildRouteInterface} route - Evaluating route.
     *
     * @return {RouteInterface[]} Modified set of routes.
     */
    const evaluateSidePanelItemExtension = (
        routesArray: RouteInterface[] | ChildRouteInterface[],
        route: RouteInterface | ChildRouteInterface): RouteInterface[] | ChildRouteInterface[] => {

        return [ ...routesArray ].filter((evalRoute) => {
            if (evalRoute.id === route.id) {
                evalRoute.open = !evalRoute.open;
            }
            if (evalRoute.children) {
                evaluateSidePanelItemExtension(evalRoute.children, route);
            }

            return true;
        });
    };

    /**
     * Handles side panel item onclick.
     *
     * @param {RouteInterface | ChildRouteInterface} route - Clicked on route.
     */
    const handleItemOnClick = (route: RouteInterface | ChildRouteInterface): void => {
        setItems(evaluateSidePanelItemExtension(routes, route));
        onSidePanelItemClick(route);
    };

    /**
     * Categorize the routes.
     *
     * @param {RouteInterface[]} routes - Routes array.
     * @return {CategorizedRouteInterface} Categorized routes.
     */
    const getCategorizedItems = (routes: RouteInterface[]): CategorizedRouteInterface => {
        const categorizedRoutes: CategorizedRouteInterface = {};

        for (const route of sortRoutes(routes, "order")) {
            if (route.category) {
                if (categorizedRoutes[route.category]) {
                    categorizedRoutes[route.category].push(route);

                    continue;
                }

                categorizedRoutes[route.category] = [ route ];
            }
        }

        return categorizedRoutes;
    };

    /**
     * Sorted routes based on the provided criteria.
     *
     * @param {RouteInterface[]} routes - Routes array.
     * @param {"order"} criteria - Sorting criteria.
     * @return {RouteInterface[]} Sorted routes.
     */
    const sortRoutes = (routes: RouteInterface[], criteria: "order" = "order"): RouteInterface[] => {
        return sortBy(routes, criteria);
    };

    return (
        <div style={ mainLayoutStyles } className="layout-content">
            <Responsive { ...Responsive.onlyMobile } className="mobile-container">
                <Sidebar.Pushable>
                    <Sidebar
                        animation="push"
                        visible={ mobileSidePanelVisibility }
                        data-componentid={ componentId }
                        data-testid={ testId }
                    >
                        <SidePanelItems
                            { ...props }
                            type="mobile"
                            onSidePanelItemClick={ handleItemOnClick }
                            routes={
                                categorized
                                    ? getCategorizedItems(items)
                                    : ordered
                                        ? sortRoutes(items)
                                        : items
                            }
                            data-componentid={ `${ componentId }-items` }
                            data-testid={ `${testId}-items` }
                            allowedScopes={ allowedScopes }
                        />
                    </Sidebar>
                    <Sidebar.Pusher
                        onClick={ onSidePanelPusherClick }
                        className="side-panel-pusher"
                    >
                        <div className="content-wrapper">
                            { children }
                        </div>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </Responsive>
            <Responsive
                as={ Container }
                className="desktop-container"
                fluid={ fluid }
                style={ desktopContentStyle }
                minWidth={ Responsive.onlyTablet.minWidth }
            >
                <div className={ wrapperClasses } data-testid={ testId } data-componentid={ componentId }>
                    <SidePanelItems
                        { ...props }
                        type="desktop"
                        onSidePanelItemClick={ handleItemOnClick }
                        routes={
                            categorized
                                ? getCategorizedItems(items)
                                : ordered
                                    ? sortRoutes(items)
                                    : items
                        }
                        data-componentid={ `${ componentId }-items` }
                        data-testid={ `${ testId }-items` }
                    />
                </div>
                <div className="content-wrapper">
                    { children }
                </div>
            </Responsive>
        </div>
    );
};

/**
 * Default props for the side panel items component.
 */
SidePanel.defaultProps = {
    categorized: false,
    "data-componentid": "side-panel",
    "data-testid": "side-panel",
    desktopContentTopSpacing: UIConstants.DEFAULT_DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING,
    fluid: false,
    hoverType: "highlighted",
    ordered: true,
    showCategoryDividers: true,
    showEllipsis: true,
    sidePanelItemHeight: UIConstants.DEFAULT_SIDE_PANEL_ITEM_HEIGHT,
    sidePanelTopMargin: false,
    skipCategoryLabelForSingleItemCategories: true,
    translationHook: null
};
