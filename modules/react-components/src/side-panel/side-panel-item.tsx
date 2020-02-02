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

import { ChildRouteInterface, RouteInterface } from "@wso2is/core/models";
import { AuthenticateUtils } from "@wso2is/core/utils";
import React from "react";
import { Menu } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "../icon";
import { CommonSidePanelPropsInterface } from "./side-panel";
import { SidePanelItemGroup } from "./side-panel-item-group";

/**
 * Side panel item component Prop types.
 */
interface SidePanelItemPropsInterface extends CommonSidePanelPropsInterface {
    iconSize?: GenericIconSizes;
    route: RouteInterface | ChildRouteInterface;
}

/**
 * Side panel item component.
 *
 * @param {SidePanelItemPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const SidePanelItem: React.FunctionComponent<SidePanelItemPropsInterface> = (
    props: SidePanelItemPropsInterface
): JSX.Element => {

    const {
        caretIcon,
        footerHeight,
        headerHeight,
        icons,
        iconSize,
        onSidePanelItemClick,
        route,
        selected,
        translationHook,
        sidePanelItemHeight
    } = props;

    return (
        <>
            {
                (route.showOnSidePanel && (route.scope ? AuthenticateUtils.hasScope(route.scope) : true))
                    ? (
                        <Menu.Item
                            name={ route.name }
                            className={ `side-panel-item ${ selected.path === route.path ? "active" : "" }` }
                            active={ selected.path === route.path }
                            onClick={ () => onSidePanelItemClick(route) }
                        >
                            <GenericIcon
                                className="left-icon"
                                icon={ icons[ route.icon ] }
                                size={ iconSize }
                                floated="left"
                                spaced="right"
                                transparent
                            />
                            <span className="route-name">
                                { translationHook ? translationHook(route.name) : route.name }
                            </span>
                            {
                                (caretIcon && route.children && route.children.length && route.children.length > 0)
                                    ? (
                                        <GenericIcon
                                            className={ `caret ${ route.open ? "down" : "right" }` }
                                            icon={ caretIcon }
                                            size="auto"
                                            floated="right"
                                            transparent
                                        />
                                    )
                                    : null
                            }
                        </Menu.Item>
                    )
                    : null
            }
            {
                (route.children && route.children.length && route.children.length > 0)
                    ? (
                        <SidePanelItemGroup
                            caretIcon={ caretIcon }
                            childRoutes={ route.children }
                            footerHeight={ footerHeight }
                            headerHeight={ headerHeight }
                            icons={ icons }
                            onSidePanelItemClick={ onSidePanelItemClick }
                            selected={ selected }
                            open={ route.open }
                            sidePanelItemHeight = { sidePanelItemHeight }
                        />
                    )
                    : null
            }
        </>
    );
};

/**
 * Default props for the side panel item component.
 */
SidePanelItem.defaultProps = {
    iconSize: "micro"
};
