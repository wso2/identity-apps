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
import React, { ReactElement } from "react";
import { Header, HeaderProps } from "semantic-ui-react";

/**
 * Heading component prop types.
 */
export interface HeadingPropsInterface extends HeaderProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Determines if the hint is in the disabled state.
     */
    disabled?: boolean;
    /**
     * Determines if the font weight should be bold.
     */
    bold?: boolean | "500";
    /**
     * Adds intentional omission to the header when a width is defined.
     */
    ellipsis?: boolean;
    /**
     * Hide the margins and make the component compact.
     */
    compact?: boolean;
    /**
     * Display inline.
     */
    inline?: boolean;
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
        inline,
        subHeading,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "heading",
        {
            [ typeof bold === "boolean" ? "bold" : "bold-" + bold ]: bold,
            compact,
            disabled,
            ellipsis,
            inline,
            [ "subheading" ]: subHeading
        }
        , className
    );

    return (
        <Header
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        />
    );
};

/**
 * Default props for the transfer component.
 */
Heading.defaultProps = {
    "data-componentid": "heading",
    "data-testid": "heading"
};
