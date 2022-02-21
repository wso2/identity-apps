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

import { ChildRouteInterface, IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Menu } from "semantic-ui-react";
import { CommonSidePanelPropsInterface } from "./side-panel";
import { SidePanelItem } from "./side-panel-item";

/**
 * Side panel item group component Prop types.
 */
export interface SidePanelItemGroupPropsInterface extends CommonSidePanelPropsInterface, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Child routes array.
     */
    childRoutes: ChildRouteInterface[];
    /**
     * Is opened.
     */
    open?: boolean;
    /**
     * Scopes allowed for the user.
     */
    allowedScopes: string;
}

/**
 * Side panel item group component.
 *
 * @param {SidePanelItemGroupPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SidePanelItemGroup: FunctionComponent<SidePanelItemGroupPropsInterface> = (
    props: SidePanelItemGroupPropsInterface
): ReactElement => {

    const {
        allowedScopes,
        childRoutes,
        open,
        sidePanelItemHeight,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "child-routes",
        {
            open
        }
    );

    const styles = {
        maxHeight: open ? `${ childRoutes.length * sidePanelItemHeight }px` : 0
    };

    return (
        <Menu.Menu className={ classes } style={ styles } data-testid={ testId } data-componentid={ componentId }>
            {
                childRoutes.map((route, index) => (
                    <SidePanelItem
                        key={ route.level ? `level-${ route.level }-${index}` : `level-${ 0 }-${index}` }
                        route={ route }
                        iconSize="nano"
                        allowedScopes={ allowedScopes }
                        data-componentid={ `${ componentId }-child-item` }
                        data-testid={ `${ testId }-child-item` }
                        { ...props }
                    />
                ))
            }
        </Menu.Menu>
    );
};

/**
 * Default props for the side panel item group component.
 */
SidePanelItemGroup.defaultProps = {
    "data-componentid": "side-panel-item-group",
    "data-testid": "side-panel-item-group"
};
