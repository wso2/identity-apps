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
import React, { FunctionComponent, ReactElement } from "react";
import { ButtonProps, Loader, LoaderProps, Button as SemanticButton } from "semantic-ui-react";

/**
 * Link button component Prop types.
 */
export interface LinkButtonPropsInterface extends ButtonProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Compact mode with no padding.
     */
    compact?: boolean;
    /**
     * Hover type.
     */
    hoverType?: "underline";
    /**
     * To represent info state.
     */
    info?: boolean;
    /**
     * Loader position.
     */
    loaderPosition?: "left" | "right";
    /**
     * Loader size.
     */
    loaderSize?: LoaderProps["size"];
    /**
     * To represent warning state.
     */
    warning?: boolean;
}

/**
 * Link button component.
 *
 * @param {LinkButtonPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const LinkButton: FunctionComponent<LinkButtonPropsInterface> = (
    props: LinkButtonPropsInterface
): ReactElement => {

    const {
        children,
        className,
        compact,
        hoverType,
        info,
        loading,
        loaderPosition,
        loaderSize,
        warning,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "link-button",
        {
            compact,
            [ `hover-${ hoverType }` ]: hoverType,
            info,
            [ `loader-${ loaderPosition }` ]: loading && loaderPosition,
            warning
        },
        className
    );

    return (
        <SemanticButton
            className={ classes }
            loading={ loading && !loaderPosition }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            {
                loading && loaderPosition === "left" && (
                    <Loader
                        active
                        inline
                        size={ loaderSize }
                        data-componentid={ `${ componentId }-loader` }
                        data-testid={ `${ testId }-loader` }
                    />
                )
            }
            { children }
            {
                loading && loaderPosition === "right" && (
                    <Loader
                        active
                        inline
                        size={ loaderSize }
                        data-componentid={ `${ componentId }-loader` }
                        data-testid={ `${ testId }-loader` }
                    />
                )
            }
        </SemanticButton>
    );
};

/**
 * Prop types for the link button component.
 */
LinkButton.defaultProps = {
    basic: true,
    "data-componentid": "link-button",
    "data-testid": "link-button",
    loaderSize: "mini",
    primary: true
};
