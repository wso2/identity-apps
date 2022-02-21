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

import {
    ChildRouteInterface,
    IdentifiableComponentInterface,
    RouteInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import classNames from "classnames";
import kebabCase from "lodash-es/kebabCase";
import React, { ReactElement } from "react";
import { Label, Menu } from "semantic-ui-react";
import { CommonSidePanelPropsInterface } from "./side-panel";
import { SidePanelItemGroup } from "./side-panel-item-group";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Side panel item component Prop types.
 */
export interface SidePanelItemPropsInterface extends CommonSidePanelPropsInterface, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Size of the icon.
     */
    iconSize?: GenericIconSizes;
    /**
     * Route of the item.
     */
    route: RouteInterface | ChildRouteInterface;
    /**
     * Scopes allowed for the user.
     */
    allowedScopes: string;
}

/**
 * Side panel item component.
 *
 * @param {SidePanelItemPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SidePanelItem: React.FunctionComponent<SidePanelItemPropsInterface> = (
    props: SidePanelItemPropsInterface
): ReactElement => {

    const {
        allowedScopes,
        caretIcon,
        categorized,
        footerHeight,
        headerHeight,
        iconSize,
        onSidePanelItemClick,
        route,
        selected,
        showEllipsis,
        translationHook,
        sidePanelItemHeight,
        hoverType,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "side-panel-item",
        {
            [ `hover-${ hoverType }` ]: hoverType,
            "active" : selected && (selected.path === route.path),
            categorized,
            "ellipsis": showEllipsis
        }
    );
    
    const featureStatusLabelClasses = classNames(
        "feature-status-label",
        {
            [ kebabCase(route.featureStatus?.toLocaleLowerCase()) ]: route.featureStatus
        }
    );

    /**
     * Validates if any of the child routes is supposed to be shown
     * on the side panel.
     *
     * @param {ChildRouteInterface[]} children - Child routes.
     * @return {boolean} If valid or not.
     */
    const validateChildren = (children: ChildRouteInterface[]): boolean => {
        if (!(children && children instanceof Array && children.length > 0)) {
            return false;
        }

        return children.some((child) => {
            return child.showOnSidePanel === true;
        });
    };

    /**
     * Checks if the child item is the selected, if so opens
     * the child items section automatically to improve UX.
     *
     * @param {boolean} isOpen - Passed as a prop when manually clicked.
     * @param {RouteInterface | ChildRouteInterface}selectedRoute - The selected route.
     * @param {ChildRouteInterface[]} children - Child routes.
     * @return {boolean} Should the child item section be opened or not.
     */
    const validateOpenState = (isOpen: boolean, selectedRoute: RouteInterface | ChildRouteInterface,
        children: ChildRouteInterface[]): boolean => {
        if (isOpen) {
            return true;
        }

        const recurse = (childrenArr): boolean => {
            for (const child of childrenArr) {
                if (child.id === selectedRoute?.id) {
                    return true;
                }

                if (child.children) {
                    recurse(child.children);
                }
            }

            return false;
        };

        return recurse(children);
    };

    return (
        <>
            {
                route && (
                    <Menu.Item
                        name={ route.name }
                        className={ classes }
                        disabled={ route.isFeatureEnabled === false }
                        active={ selected && (selected.path === route.path) }
                        onClick={ (): void => onSidePanelItemClick(route) }
                        data-componentid={ `${ componentId }-${ kebabCase(route.id) }` }
                        data-testid={ `${ testId }-${ kebabCase(route.id) }` }
                    >
                        <GenericIcon
                            transparent
                            className="left-icon"
                            size={ iconSize }
                            floated="left"
                            spaced="right"
                            { ...route.icon }
                            data-componentid={ `${ componentId }-icon` }
                            data-testid={ `${ testId }-icon` }
                        />
                        <span
                            className="route-name"
                            data-componentid={ `${ componentId }-label` }
                            data-testid={ `${ testId }-label` }
                        >
                            { translationHook ? translationHook(route.name) : route.name }
                            { route.featureStatus && (
                                <Label
                                    className={ featureStatusLabelClasses }
                                    size="mini"
                                    data-componentid={ `${ componentId }-version` }
                                    data-testid={ `${ testId }-version` }
                                >
                                    { translationHook(route.featureStatusLabel) }
                                </Label>
                            ) }
                        </span>
                        {
                            // Check if any of the child items are defined to be shown on the side panel.
                            // If not hides the caret icon.
                            (caretIcon && validateChildren(route.children))
                                ? (
                                    <GenericIcon
                                        className={ `caret ${ route.open ? "down" : "right" }` }
                                        icon={ caretIcon }
                                        size="auto"
                                        floated="right"
                                        data-componentid={ `${ componentId }-caret` }
                                        data-testid={ `${ testId }-caret` }
                                        transparent
                                    />
                                )
                                : null
                        }
                    </Menu.Item>
                )
            }
            {
                (route.children && route.children.length && route.children.length > 0)
                    ? (
                        <SidePanelItemGroup
                            caretIcon={ caretIcon }
                            hoverType={ hoverType }
                            categorized={ categorized }
                            childRoutes={ route.children }
                            footerHeight={ footerHeight }
                            headerHeight={ headerHeight }
                            onSidePanelItemClick={ onSidePanelItemClick }
                            selected={ selected }
                            open={ validateOpenState(route.open, selected, route.children) }
                            sidePanelItemHeight={ sidePanelItemHeight }
                            translationHook={ translationHook }
                            allowedScopes={ allowedScopes } 
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
    "data-componentid": "side-panel-item",
    "data-testid": "side-panel-item",
    iconSize: "micro"
};
