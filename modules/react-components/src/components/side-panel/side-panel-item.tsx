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

import { ChildRouteInterface, RouteInterface, TestableComponentInterface } from "@wso2is/core/models";
import { AuthenticateUtils } from "@wso2is/core/utils";
import classNames from "classnames";
import _ from "lodash";
import React, { ReactElement } from "react";
import { Label, Menu, SemanticCOLORS } from "semantic-ui-react";
import { CommonSidePanelPropsInterface } from "./side-panel";
import { SidePanelItemGroup } from "./side-panel-item-group";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Side panel item component Prop types.
 */
export interface SidePanelItemPropsInterface extends CommonSidePanelPropsInterface, TestableComponentInterface {
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

    /**
     * Resolves the label color to display the status of the feature .
     *
     * @return {SemanticCOLORS} Resolved color.
     */
    const resolveFeatureStatusLabelColor = (): SemanticCOLORS => {
        if (route.featureStatus === "new") {
            return "red";
        } else if (route.featureStatus === "beta") {
            return "teal";
        } else if (route.featureStatus === "alpha") {
            return "orange";
        }

        return "blue";
    };

    return (
        <>
            {
                (route.showOnSidePanel && (route.scope ? AuthenticateUtils.hasScope(route.scope, allowedScopes) : true))
                    ? (
                        <Menu.Item
                            name={ route.name }
                            className={ classes }
                            active={ selected && (selected.path === route.path) }
                            onClick={ (): void => onSidePanelItemClick(route) }
                            data-testid={ `${ testId }-${ _.kebabCase(route.id) }` }
                        >
                            <GenericIcon
                                transparent
                                className="left-icon"
                                size={ iconSize }
                                floated="left"
                                spaced="right"
                                { ...route.icon }
                                data-testid={ `${ testId }-icon` }
                            />
                            <span className="route-name" data-testid={ `${ testId }-label` }>
                                { translationHook ? translationHook(route.name) : route.name }
                                { route.featureStatus && (
                                    <Label
                                        color={ resolveFeatureStatusLabelColor() }
                                        className="feature-status-label"
                                        size="mini"
                                        data-testid={ `${ testId }-version` }
                                    >
                                        { route.featureStatus.toUpperCase() }
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
                                            data-testid={ `${ testId }-caret` }
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
    "data-testid": "side-panel-item",
    iconSize: "micro"
};
