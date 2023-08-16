/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import classNames from "classnames";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactNode
} from "react";
import { Card, CardGroupProps, Loader, Placeholder } from "semantic-ui-react";
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
export interface ResourceGridPropsInterface extends CardGroupProps, IdentifiableComponentInterface,
    TestableComponentInterface, LoadableComponentInterface {

    /**
     * Empty placeholder component.
     */
    emptyPlaceholder?: ReactNode;
    /**
     * Is the list empty.
     */
    isEmpty?: boolean;
    /**
     * Is pagination in progress.
     */
    isPaginating?: boolean;
    /**
     * CSS classes for the wrapper.
     */
    wrapperClassName?: string;
}

/**
 * Resource Grid component.
 * Displays resources as cards on a grid.
 *
 * @param props - Props injected to the component.
 * @returns the resource grid component.
 */
export const ResourceGrid: FunctionComponent<
    PropsWithChildren<ResourceGridPropsInterface>> & ResourceGridSubComponentsInterface = (
        props: ResourceGridPropsInterface
    ): ReactElement => {

        const {
            children,
            className,
            emptyPlaceholder,
            isEmpty,
            isLoading,
            isPaginating,
            testId,
            wrapperClassName,
            [ "data-componentid" ]: componentId,
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

        const numberOfPlaceholderCards: number = 4;

        /**
         * Renders the loading state placeholder cards.
         *
         * @returns Loading Placeholder cards.
         */
        const getPlaceholderCards = (): ReactElement[] => {
            const placeholders: ReactElement[] = [];

            for (let i = 0; i < numberOfPlaceholderCards; i++) {
                placeholders.push(
                    //TODO: Add placeholder style classes.
                    <Card style={ { boxShadow: "none", width: "220px" } }>
                        <Placeholder>
                            <Placeholder.Image style={ { height: "230px" } } />
                        </Placeholder>
                    </Card>
                );
            }

            return placeholders;
        };

        if (isLoading) {
            return (
                <Card.Group style={ { marginBottom: "3rem" } }>
                    {
                        getPlaceholderCards()
                    }
                </Card.Group>
            );
        }

        return (
            <div
                className={ wrapperClasses }
                data-componentid={ componentId }
                data-testid={ testId }
            >
                {
                    isEmpty
                        ? emptyPlaceholder
                        : (
                            <Card.Group className={ classes } { ...rest }>
                                {
                                    (isLoading && !isPaginating)
                                        ? <Loader active inline="centered" />
                                        : isPaginating
                                            ? <Loader>Loading...</Loader>
                                            : children
                                }
                            </Card.Group>
                        )
                }
            </div>
        );
    };

/**
 * Default props for the component.
 */
ResourceGrid.defaultProps = {
    "data-componentid": "resource-grid",
    "data-testid": "resource-grid"
};

ResourceGrid.Card = ResourceGridCard;
