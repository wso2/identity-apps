/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
 * @param props - Props injected to the component.
 *
 * @returns a React component
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
