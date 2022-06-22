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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Grid, List, SemanticWIDTHS } from "semantic-ui-react";
import { ResourceListHeaderCellPropsInterface } from "./resource-list-header-cell";

/**
 * Proptypes for the resource list header component.
 */
export interface ResourceListHeaderPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
}

/**
 * Resource list header component.
 *
 * @param {ResourceListHeaderPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ResourceListHeader: FunctionComponent<PropsWithChildren<ResourceListHeaderPropsInterface>> = (
    props: PropsWithChildren<ResourceListHeaderPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames("resource-list-header", className);

    return (
        <List.Item
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
        >
            { React.Children.count(children) > 0 && (
                <Grid>
                    <Grid.Row columns={ React.Children.count(children) as SemanticWIDTHS }>
                        {
                            React.Children.map(children,
                                (heading: ReactElement<ResourceListHeaderCellPropsInterface>, index: number) => (
                                    <>
                                        { heading.props.offset && (
                                            <Grid.Column width={ heading.props.offset } />
                                        ) }
                                        <Grid.Column key={ index } width={ heading.props.width }>
                                            <List.Header
                                                data-componentid={ `${ componentId }-heading` }
                                                data-testid={ `${ testId }-heading` }
                                            >
                                                { heading }
                                            </List.Header>
                                        </Grid.Column>
                                    </>
                                ))
                        }
                    </Grid.Row>
                </Grid>
            ) }
        </List.Item>
    );
};

/**
 * Default props for resource list header component.
 */
ResourceListHeader.defaultProps = {
    "data-componentid": "resource-list-header",
    "data-testid": "resource-list-header"
};
