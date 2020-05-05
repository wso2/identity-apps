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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { List, SemanticFLOATS, SemanticWIDTHS } from "semantic-ui-react";

/**
 * Proptypes for the resource list header cell component.
 */
export interface ResourceListHeaderCellPropsInterface extends TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Float direction.
     */
    floated?: SemanticFLOATS;
    /**
     * Cell offset.
     */
    offset?: SemanticWIDTHS;
    /**
     * Cell width.
     */
    width: SemanticWIDTHS;
}

/**
 * Resource list header cell component.
 *
 * @param {ResourceListHeaderCellPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ResourceListHeaderCell: FunctionComponent<PropsWithChildren<ResourceListHeaderCellPropsInterface>> = (
    props: PropsWithChildren<ResourceListHeaderCellPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        floated,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames("resource-list-header-cell", className);

    return (
        <List.Content className={ classes } floated={ floated } data-testid={ testId }>
            { children }
        </List.Content>
    );
};

/**
 * Default props for resource list header component.
 */
ResourceListHeaderCell.defaultProps = {
    "data-testid": "resource-list-header-cell"
};
