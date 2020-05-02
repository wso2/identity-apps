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
export interface ResourceListPropsInterface extends ListProps {
    /**
     * Is the list in loading state.
     */
    isLoading?: boolean;
    /**
     * Optional meta for the loading state.
     */
    loadingStateOptions?: ListLoadingStateOptionsInterface;
}

/**
 * Interface for loading state options.
 */
interface ListLoadingStateOptionsInterface {
    /**
     * Number of loading rows.
     */
    count: number;
    /**
     * Loading state image type.
     */
    imageType: "circular" | "square";
}

/**
 * Resource list component.
 *
 * @param {ResourceListPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ResourceList: FunctionComponent<ResourceListPropsInterface> & ResourceListSubComponentsInterface = (
    props: ResourceListPropsInterface
): ReactElement => {

    const {
        children,
        className,
        isLoading,
        loadingStateOptions,
        rest
    } = props;

    const classes = classNames(
        "resource-list"
        , className
    );

    /**
     * Shows the loading state placeholder rows.
     *
     * @return {React.ReactElement[]}
     */
    const showPlaceholders = (): ReactElement[] => {

        const placeholders: ReactElement[] = [];

        for(let i=0; i < loadingStateOptions.count; i++) {
            placeholders.push(
                <ResourceListItem
                    avatar={ (
                        <Avatar
                            image={ (
                                <Placeholder style={ { height: 35, width: 35 } }>
                                    <Placeholder.Image />
                                </Placeholder>
                            ) }
                            isLoading={ true }
                            avatarType={ loadingStateOptions.imageType === "circular" ? "user" : "app" }
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
                />
            )
        }

        return placeholders;
    };

    return (
        <List
            className={ classes }
            celled
            relaxed="very"
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
    isLoading: false,
    loadingStateOptions: {
        count: 10,
        imageType: "square"
    }
};

ResourceList.Header = ResourceListHeader;
ResourceList.HeaderCell = ResourceListHeaderCell;
ResourceList.Item = ResourceListItem;
