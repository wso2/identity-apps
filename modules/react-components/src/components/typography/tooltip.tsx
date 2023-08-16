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
import React, { PropsWithChildren, ReactElement } from "react";
import { PopupProps } from "semantic-ui-react";
import { Popup } from "../popup";

/**
 * Tooltip component prop types.
 */
export interface TooltipPropsInterface extends PopupProps, IdentifiableComponentInterface,
    TestableComponentInterface { }

/**
 * Tooltip component.
 *
 * @param props - Props injected to the component.
 *
 * @returns ReactElement.
 */
export const Tooltip: React.FunctionComponent<PropsWithChildren<TooltipPropsInterface>> = (
    props: PropsWithChildren<TooltipPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        compact,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "ui-tooltip",
        {
            compact
        },
        className
    );

    return (
        <Popup
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
            popper={ <div style={ { filter: "none" } }></div> }
            { ...rest }
        >
            { children }
        </Popup>
    );
};

/**
 * Default props for the tooltip component.
 */
Tooltip.defaultProps = {
    basic: true,
    compact: false,
    "data-componentid": "tooltip",
    "data-testid": "tooltip",
    inverted: true,
    pinned: true,
    position: "bottom center",
    size: "mini"
};
