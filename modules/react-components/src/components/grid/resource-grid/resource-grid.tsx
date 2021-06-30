/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, {
    FunctionComponent, PropsWithChildren,
    ReactElement
} from "react";
import { Card, CardGroupProps } from "semantic-ui-react";
import { ResourceGridCard } from "./resource-grid-card";

/**
 * Interface for the Resource Grid sub components.
 */
export interface ResourceGridSubComponentsInterface {
    Card: typeof ResourceGridCard;
}

/**
 * Interface for the Resource Grid component.
 */
export interface ResourceGridPropsInterface extends CardGroupProps, TestableComponentInterface {

    /**
     * CSS classes for the wrapper.
     */
    wrapperClassName?: string;
}

/**
 * Resource Grid component.
 * Displays resources as cards on a grid.
 *
 * @param {ResourceGridPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ResourceGrid: FunctionComponent<
    PropsWithChildren<ResourceGridPropsInterface>> & ResourceGridSubComponentsInterface = (
        props: ResourceGridPropsInterface
): ReactElement => {

    const {
        children,
        className,
        searchOptions,
        showSearch,
        testId,
        wrapperClassName,
        ...rest
    } = props;

    const classes = classNames(
        "resource-grid",
        className
    );
    
    const wrapperClasses = classNames(
        "resource-grid-wrapper",
        wrapperClassName
    );

    return (
        <div className={ wrapperClasses } data-testid={ testId }>
            <Card.Group className={ classes } { ...rest }>
                { children }
            </Card.Group>
        </div>
    );
};

/**
 * Default props for the component.
 */
ResourceGrid.defaultProps = {
    "data-testid": "resource-grid"
};

ResourceGrid.Card = ResourceGridCard;
