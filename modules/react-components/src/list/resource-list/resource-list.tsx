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
import { List , ListProps } from "semantic-ui-react";
import { ResourceListItem } from "./resource-list-item";
import { ResourceListHeader } from "./resource-list-header";
import { ResourceListHeaderCell } from "./resource-list-header-cell";

/**
 * Interface for the resource tab sub component.
 */
interface ResourceListSubComponentsInterface {
    Header: typeof ResourceListHeader;
    HeaderCell: typeof ResourceListHeaderCell;
    Item: typeof ResourceListItem;
}

/**
 * Resource list component.
 *
 * @param {ListProps} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ResourceList: FunctionComponent<ListProps> & ResourceListSubComponentsInterface = (
    props: ListProps
): ReactElement => {

    const {
        children,
        className,
        rest
    } = props;

    const classes = classNames(
        "resource-list"
        , className
    );

    return (
        <List
            className={ classes }
            celled
            relaxed="very"
            { ...rest }
        >
            { children }
        </List>
    );
};

ResourceList.Header = ResourceListHeader;
ResourceList.HeaderCell = ResourceListHeaderCell;
ResourceList.Item = ResourceListItem;
