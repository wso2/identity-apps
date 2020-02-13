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

import { RouteInterface } from "@wso2is/core/models";
import React from "react";
import { Menu } from "semantic-ui-react";
import { CommonSidePanelPropsInterface } from "./side-panel";
import { SidePanelItem } from "./side-panel-item";

/**
 * Side panel items component Prop types.
 */
export interface SidePanelItemsPropsInterface extends CommonSidePanelPropsInterface {
    routes: RouteInterface[];
    type?: "desktop" | "mobile";
}

/**
 * Side panel items component.
 *
 * @param {SidePanelItemsPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const SidePanelItems: React.FunctionComponent<SidePanelItemsPropsInterface> = (
    props: SidePanelItemsPropsInterface
): JSX.Element => {

    const {
        desktopContentTopSpacing,
        headerHeight,
        routes,
        sidePanelPosition,
        sidePanelTopMargin,
        type
    } = props;

    const calcSidePanelTopMargin = (): string | undefined => {
        if (!sidePanelTopMargin) {
            return undefined;
        }

        if (typeof sidePanelTopMargin === "number") {
            return `${sidePanelTopMargin}px`;
        } else if (typeof sidePanelTopMargin === "boolean" && sidePanelTopMargin === true) {
            return `${headerHeight + desktopContentTopSpacing}px`;
        }

        return undefined;
    };

    const style = type === "desktop"
        ? {
            position: sidePanelPosition,
            top: calcSidePanelTopMargin()
        }
        : null;

    return (
        <Menu className={ `side-panel ${type}` } style={ style } vertical fluid>
            {
                routes
                    ? routes.map((route, index) => (
                        <SidePanelItem
                            key={ route.level ? `level-${route.level}-${index}` : `level-${0}-${index}` }
                            route={ route }
                            { ...props }
                        />
                    ))
                    : null
            }
        </Menu>
    );
};
