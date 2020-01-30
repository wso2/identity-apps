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
import { ChildRouteInterface, RouteInterface } from "@wso2is/core/models";
import classNames from "classnames";
import _ from "lodash";
import React, { PropsWithChildren, useState } from "react";
import { Container, Responsive, Sidebar } from "semantic-ui-react";
import { SidePanelItems } from "./side-panel-items";

/**
 * Common side panel base component Prop types.
 */
export interface CommonSidePanelPropsInterface {
    caretIcon?: any;
    desktopContentTopSpacing?: number;
    footerHeight: number;
    headerHeight: number;
    icons: any;
    onSidePanelItemClick: (route: RouteInterface | ChildRouteInterface) => void;
    selected: RouteInterface | ChildRouteInterface;
    sidePanelItemHeight?: number;
    sidePanelPosition?: "absolute" | "fixed" | "inherit" | "initial" | "relative" | "static" | "sticky" | "unset";
    sidePanelTopMargin?: number | boolean;
    translationHook?: any;
}

/**
 * Side panel base component Prop types.
 */
interface SidePanelPropsInterface extends CommonSidePanelPropsInterface {
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
 * @return {JSX.Element}
 */
export const SidePanel: React.FunctionComponent<PropsWithChildren<SidePanelPropsInterface>> = (
    props: PropsWithChildren<SidePanelPropsInterface>
): JSX.Element => {

    const {
        bordered,
        children,
        desktopContentTopSpacing,
        footerHeight,
        fluid,
        headerHeight,
        mobileSidePanelVisibility,
        onSidePanelItemClick,
        onSidePanelPusherClick,
        routes
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

    const handleItemOnClick = (route: RouteInterface | ChildRouteInterface) => {
        setItems(evaluateSidePanelItemExtension(routes, route));
        onSidePanelItemClick(route);
    };

    const evaluateSidePanelItemExtension = (routesArray, route) => {
        return _.filter([ ...routesArray ], (evalRoute) => {
            if (evalRoute.path === route.path) {
                evalRoute.open = !evalRoute.open;
            }
            if (evalRoute.children) {
                evaluateSidePanelItemExtension(evalRoute.children, route);
            }
            return evalRoute;
        });
    };

    return (
        <div style={ mainLayoutStyles } className="layout-content">
            <Responsive { ...Responsive.onlyMobile } className="mobile-container">
                <Sidebar.Pushable>
                    <Sidebar
                        animation="push"
                        visible={ mobileSidePanelVisibility }
                    >
                        <SidePanelItems
                            { ...props }
                            type="mobile"
                            onSidePanelItemClick={ handleItemOnClick }
                            routes={ items }
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
                <div className={ wrapperClasses }>
                    <SidePanelItems
                        { ...props }
                        type="desktop"
                        onSidePanelItemClick={ handleItemOnClick }
                        routes={ items }
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
    desktopContentTopSpacing: UIConstants.DEFAULT_DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING,
    fluid: false,
    sidePanelItemHeight: UIConstants.DEFAULT_SIDE_PANEL_ITEM_HEIGHT,
    sidePanelTopMargin: false,
    translationHook: null
};
