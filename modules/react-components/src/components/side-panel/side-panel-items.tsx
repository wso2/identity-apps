/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    CategorizedRouteInterface,
    IdentifiableComponentInterface,
    RouteInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import classNames from "classnames";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import { Menu } from "semantic-ui-react";
import { CommonSidePanelPropsInterface } from "./side-panel";
import { SidePanelItem } from "./side-panel-item";

/**
 * Side panel items component Prop types.
 */
export interface SidePanelItemsPropsInterface extends CommonSidePanelPropsInterface, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Set of routes.
     */
    routes: RouteInterface[] | CategorizedRouteInterface | any;
    /**
     * Panel type.
     */
    type?: "desktop" | "mobile";
    /**
     * Scopes allowed for a user.
     */
    allowedScopes: string;
}

/**
 * Side panel items component.
 *
 * @param props - Props injected to the component.
 *
 * @returns a React component
 */
export const SidePanelItems: FunctionComponent<SidePanelItemsPropsInterface> = (
    props: SidePanelItemsPropsInterface
): ReactElement => {

    const {
        allowedScopes,
        desktopContentTopSpacing,
        headerHeight,
        relaxed,
        routes,
        showCategoryDividers,
        sidePanelPosition,
        sidePanelTopMargin,
        skipCategoryLabelForSingleItemCategories,
        type,
        translationHook,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const menuClasses = classNames(
        "side-panel",
        {
            relaxed,
            [ type ]: type
        }
    );

    const categoryClasses = classNames(
        "side-panel-category",
        {
            "with-dividers": showCategoryDividers
        }
    );

    const calcSidePanelTopMargin = (): string | undefined => {
        if (!sidePanelTopMargin) {
            return undefined;
        }

        if (typeof sidePanelTopMargin === "number") {
            return `${ sidePanelTopMargin }px`;
        } else if (typeof sidePanelTopMargin === "boolean" && sidePanelTopMargin === true) {
            return `${ headerHeight + desktopContentTopSpacing }px`;
        }

        return undefined;
    };

    const style = type === "desktop"
        ? {
            position: sidePanelPosition,
            top: calcSidePanelTopMargin()
        }
        : null;

    /**
     * Renders a re-usable side panel item.
     *
     * @param route - Route object.
     * @param index - Index.
     * @returns a React component
     */
    const renderItem = (route: RouteInterface, index: number) => (
        <SidePanelItem
            key={ route.level ? `level-${ route.level }-${ index }` : `level-${ 0 }-${ index }` }
            route={ route }
            data-componentid={ `${ componentId }-item` }
            data-testid={ `${ testId }-item` }
            allowedScopes={ allowedScopes }
            { ...props }
        />
    );

    return (
        <Menu
            className={ menuClasses }
            style={ style }
            data-componentid={ componentId }
            data-testid={ testId }
            vertical
            fluid
        >
            {
                routes && (
                    routes instanceof Array
                        ? routes.map((route, index) => (
                            renderItem(route, index)
                        ))
                        : Object.entries(routes).map(([ key, value ]) => (
                            <Fragment key={ key }>
                                {
                                    skipCategoryLabelForSingleItemCategories
                                        ? (value instanceof Array && value.length > 1) && (
                                            <div className={ categoryClasses }>
                                                { translationHook ? translationHook(key) : key }
                                            </div>
                                        )
                                        : (
                                            <div className={ categoryClasses }>
                                                { translationHook ? translationHook(key) : key }
                                            </div>
                                        )
                                }
                                {
                                    value instanceof Array && value.map((route, index) => (
                                        renderItem(route, index)
                                    ))
                                }
                            </Fragment>
                        ))
                )
            }
        </Menu>
    );
};

/**
 * Default props for the side panel items component.
 */
SidePanelItems.defaultProps = {
    "data-componentid": "side-panel-items",
    "data-testid": "side-panel-items"
};
