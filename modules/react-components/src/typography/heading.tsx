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

import { Header, HeaderProps } from "semantic-ui-react";
import React, { ReactElement } from "react";
import classNames from "classnames";

/**
 * Heading component prop types.
 */
export interface HeadingPropsInterface extends HeaderProps {
    /**
     * Determines if the hint is in the disabled state.
     */
    disabled?: boolean;
    /**
     * Determines if the font weight should be bold.
     */
    bold?: boolean;
    /**
     * Adds intentional omission to the header when a width is defined.
     */
    ellipsis?: boolean;
    /**
     * Hide the margins and make the component compact.
     */
    compact?: boolean;
    /**
     * De-emphasises the heading.
     */
    subHeading?: boolean;
}

/**
 * Heading component.
 *
 * @param {HeadingPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const Heading: React.FunctionComponent<HeadingPropsInterface> = (
    props: HeadingPropsInterface
): ReactElement => {

    const {
        bold,
        ellipsis,
        className,
        compact,
        disabled,
        subHeading,
        ...rest
    } = props;

    const classes = classNames(
        "heading",
        {
            bold,
            compact,
            disabled,
            ellipsis,
            [ "subheading" ]: subHeading
        }
        , className
    );

    return (
        <Header className={ classes } { ...rest } />
    );
};
