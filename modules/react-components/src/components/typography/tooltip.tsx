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
import React, { PropsWithChildren, ReactElement } from "react";
import { Popup, PopupProps } from "semantic-ui-react";

/**
 * Tooltip component prop types.
 */
export interface TooltipPropsInterface extends PopupProps, IdentifiableComponentInterface,
    TestableComponentInterface { }

/**
 * Tooltip component.
 *
 * @param {React.PropsWithChildren<TooltipPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
