/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
 * @param props - Props injected to the component.
 *
 * @returns the resource list header component.
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
