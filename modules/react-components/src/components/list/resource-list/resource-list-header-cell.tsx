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
import { List, SemanticFLOATS, SemanticWIDTHS } from "semantic-ui-react";

/**
 * Proptypes for the resource list header cell component.
 */
export interface ResourceListHeaderCellPropsInterface extends IdentifiableComponentInterface,
    TestableComponentInterface {

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
 * @param props - Props injected to the component.
 *
 * @returns the resource list header cell component.
 */
export const ResourceListHeaderCell: FunctionComponent<PropsWithChildren<ResourceListHeaderCellPropsInterface>> = (
    props: PropsWithChildren<ResourceListHeaderCellPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        floated,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames("resource-list-header-cell", className);

    return (
        <List.Content
            className={ classes }
            floated={ floated }
            data-componentid={ componentId }
            data-testid={ testId }
        >
            { children }
        </List.Content>
    );
};

/**
 * Default props for resource list header component.
 */
ResourceListHeaderCell.defaultProps = {
    "data-componentid": "resource-list-header-cell",
    "data-testid": "resource-list-header-cell"
};
