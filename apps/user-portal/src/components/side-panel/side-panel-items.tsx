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

import * as React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { DESKTOP_CONTENT_TOP_PADDING, routes, SidePanelIcons } from "../../configs";
import { ThemeIcon } from "../shared";

/**
 * Side panel items component Prop types.
 */
interface SidePanelItemsProps {
    headerHeight: number;
    onSidePanelItemClick: () => void;
    type: "desktop" | "mobile";
}

/**
 * Side panel items component.
 *
 * @param {SidePanelItemsProps} props - Props injected to the side panel items component.
 * @return {JSX.Element}
 */
export const SidePanelItems: React.FunctionComponent<SidePanelItemsProps> = (
    props: SidePanelItemsProps
): JSX.Element => {
    const { headerHeight, type, onSidePanelItemClick } = props;
    const { t } = useTranslation();
    const activeRoute = (path: string) => {
        const pathname = window.location.pathname;
        const urlTokens = path.split("/");
        return pathname.indexOf(urlTokens[1]) > -1 ? "active" : "";
    };

    const style = type === "desktop"
        ? {
            position: "sticky",
            top: `${ headerHeight + DESKTOP_CONTENT_TOP_PADDING }px`
        }
        : null;

    return (
        <Menu className={ `side-panel ${ type }` } style={ style } vertical fluid>
            {
                routes.map((route, index) => (
                    route.showOnSidePanel ?
                        <Menu.Item
                            as={ NavLink }
                            to={ route.path }
                            name={ route.name }
                            className={ `side-panel-item ${ activeRoute(route.path) }` }
                            active={ activeRoute(route.path) === "active" }
                            onClick={ onSidePanelItemClick }
                            key={ index }
                        >
                            <ThemeIcon
                                icon={ SidePanelIcons[route.icon] }
                                size="micro"
                                floated="left"
                                spaced="right"
                                transparent
                            />
                            <span className="route-name">{ t(route.name) }</span>
                        </Menu.Item>
                        : null
                ))
            }
        </Menu>
    );
};
