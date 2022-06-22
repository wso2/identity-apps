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
import React, { CSSProperties, FunctionComponent, ReactElement } from "react";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Logo component Prop types.
 */
export interface LogoPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Logo image.
     */
    image: any;
    /**
     * Logo image size.
     */
    size?: GenericIconSizes;
    /**
     * Custom styles object.
     */
    style?: CSSProperties | undefined;
}

/**
 * Logo component.
 *
 * @param {LogoPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const Logo: FunctionComponent<LogoPropsInterface> = (
    props: LogoPropsInterface
): ReactElement => {

    const {
        className,
        image,
        size,
        style,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(className, "product-logo");

    return (
        <GenericIcon
            icon={ image }
            className={ classNames(classes, "product-logo") }
            size={ size }
            style={ style }
            data-componentid={ componentId }
            data-testid={ testId }
            transparent
            inline
        />
    );
};

/**
 * Default props for the logo component.
 */
Logo.defaultProps = {
    "data-componentid": "logo",
    "data-testid": "logo",
    size: "auto"
};
