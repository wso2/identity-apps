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
import React, { FunctionComponent } from "react";
import { List , ListProps } from "semantic-ui-react";
import { ResourceListItem } from "./resource-list-item";

interface ResourceListSubComponentsInterface {
    Item: typeof ResourceListItem;
}

/**
 * Resource list component.
 *
 * @param {ListProps} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const ResourceList: FunctionComponent<ListProps> & ResourceListSubComponentsInterface = (
    props: ListProps
): JSX.Element => {

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

ResourceList.Item = ResourceListItem;
