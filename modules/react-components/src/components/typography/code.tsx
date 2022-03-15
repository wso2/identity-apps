/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

/**
 * Code component prop types.
 */
export interface CodePropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Extra CSS classes.
     */
    className?: string;
    /**
     * Make the component compact.
     */
    compact?: boolean;
    /**
     * Size of the font.
     */
    fontSize?: "inherit" | "default";
    /**
     * Font color.
     */
    fontColor?: "inherit" | "default";
    /**
     * Should the component render with a background.
     */
    withBackground?: boolean;
}

/**
 * Text with code formatting. Wrapper around `<code>` element.
 *
 * @param {CodePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const Code: React.FunctionComponent<PropsWithChildren<CodePropsInterface>> = (
    props: PropsWithChildren<CodePropsInterface>
): ReactElement => {

    const {
        withBackground,
        children,
        className,
        compact,
        fontColor,
        fontSize,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames("inline-code",
        {
            compact,
            [ `font-size-${ fontSize }` ]: fontSize,
            [ `font-color-${ fontColor }` ]: fontColor,
            "transparent" : !withBackground
        },
        className
    );

    return (
        <code
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            { children }
        </code>
    );
};

/**
 * Default props for the Code component.
 */
Code.defaultProps = {
    "data-componentid": "code",
    "data-testid": "code",
    withBackground: true
};
