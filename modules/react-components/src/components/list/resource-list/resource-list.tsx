/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    IdentifiableComponentInterface,
    LoadingStateOptionsInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { List, ListProps, Placeholder } from "semantic-ui-react";
import { ResourceListHeader } from "./resource-list-header";
import { ResourceListHeaderCell } from "./resource-list-header-cell";
import { ResourceListItem } from "./resource-list-item";
import { Avatar } from "../../avatar";

/**
 * Interface for the resource tab sub component.
 */
export interface ResourceListSubComponentsInterface {
    Header: typeof ResourceListHeader;
    HeaderCell: typeof ResourceListHeaderCell;
    Item: typeof ResourceListItem;
}

/**
 * Proptypes for the resource list component.
 */
export interface ResourceListPropsInterface extends ListProps, IdentifiableComponentInterface,
    TestableComponentInterface  {

    /**
     * Should the list appear on a filled background (usually with foreground color).
     */
    fill?: boolean;
    /**
     * Is the list in loading state.
     */
    isLoading?: boolean;
    /**
     * Optional meta for the loading state.
     */
    loadingStateOptions?: LoadingStateOptionsInterface;
    /**
     * Should the list appear on a transparent background.
     */
    transparent?: boolean;
}

/**
 * Resource list component.
 *
 * @param props - Props injected to the component.
 *
 * @returns the resource list component.
 */
export const ResourceList: FunctionComponent<ResourceListPropsInterface> & ResourceListSubComponentsInterface = (
    props: ResourceListPropsInterface
): ReactElement => {

    const {
        celled,
        children,
        className,
        fill,
        isLoading,
        loadingStateOptions,
        transparent,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "resource-list",
        {
            transparent,
            [ typeof fill === "boolean" ? "fill-default" : `fill-${ fill }` ]: fill
        }
        , className
    );

    /**
     * Shows the loading state placeholder rows.
     *
     * @returns an array of placeholders
     */
    const showPlaceholders = (): ReactElement[] => {

        const placeholders: ReactElement[] = [];

        for(let i=0; i < loadingStateOptions.count; i++) {
            placeholders.push(
                <ResourceListItem
                    key={ i }
                    avatar={ (
                        <Avatar
                            image={ (
                                <Placeholder style={ { height: 35, width: 35 } }>
                                    <Placeholder.Image />
                                </Placeholder>
                            ) }
                            isLoading={ true }
                            shape={ loadingStateOptions.imageType }
                            size="mini"
                            floated="left"
                        />
                    ) }
                    itemHeader={ (
                        <Placeholder style={ { width: "300px" } }>
                            <Placeholder.Header>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                        </Placeholder>
                    ) }
                    data-componentid={ `${ componentId }-loading-placeholder` }
                    data-testid={ `${ testId }-loading-placeholder` }
                />
            );
        }

        return placeholders;
    };

    return (
        <List
            className={ classes }
            divided={ celled }
            relaxed="very"
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            {
                isLoading
                    ? showPlaceholders()
                    : children
            }
        </List>
    );
};

/**
 * Default props for the component.
 */
ResourceList.defaultProps = {
    celled: true,
    "data-componentid": "resource-list",
    "data-testid": "resource-list",
    isLoading: false,
    loadingStateOptions: {
        count: 10,
        imageType: "square"
    },
    transparent: true
};

ResourceList.Header = ResourceListHeader;
ResourceList.HeaderCell = ResourceListHeaderCell;
ResourceList.Item = ResourceListItem;
