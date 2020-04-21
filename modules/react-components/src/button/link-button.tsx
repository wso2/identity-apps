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

import { ButtonProps, Loader, LoaderProps, Button as SemanticButton } from "semantic-ui-react";
import classNames from "classnames";
import React from "react";

interface LinkButtonPropsInterface extends ButtonProps {
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
 * @return {JSX.Element}
 */
export const LinkButton: React.FunctionComponent<LinkButtonPropsInterface> = (
    props: ButtonProps
): JSX.Element => {

    const {
        children,
        className,
        info,
        loading,
        loaderPosition,
        loaderSize,
        warning,
        ...rest
    } = props;

    const classes = classNames(
        "link-button",
        {
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
            { ...rest }
        >
            {
                loading && loaderPosition === "left" && (
                    <Loader active inline size={ loaderSize }/>
                )
            }
            { children }
            {
                loading && loaderPosition === "right" && (
                    <Loader active inline size={ loaderSize }/>
                )
            }
        </SemanticButton>
    );
};

/**
 * Prop types for the link button component.
 */
LinkButton.defaultProps = {
    loaderSize: "mini"
};
