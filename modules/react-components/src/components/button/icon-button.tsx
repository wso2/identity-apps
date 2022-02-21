/*
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
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { ButtonProps, Button as SemanticButton } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Icon button component Prop types.
 */
export interface IconButtonPropsInterface extends ButtonProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    customIcon?: any;
    customIconPosition?: "left" | "right";
    customIconSize?: GenericIconSizes;
}

/**
 * Icon button component.
 *
 * @param {IconButtonPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const IconButton: FunctionComponent<PropsWithChildren<IconButtonPropsInterface>> = (
    props: PropsWithChildren<IconButtonPropsInterface>
): ReactElement => {

    const {
        children,
        customIcon,
        customIconPosition,
        customIconSize,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    return (
        <SemanticButton
            { ...props }
            data-componentid={ componentId }
            data-testid={ testId }
            negative
        >
            {
                customIcon && (
                    <GenericIcon
                        icon={ customIcon }
                        size={ customIconSize }
                        transparent={ true }
                        spaced="right"
                        floated={ customIconPosition }
                        data-componentid={ `${ componentId }-icon` }
                        data-testid={ `${ testId }-icon` }
                    />
                )
            }
            { children }
        </SemanticButton>
    );
};

/**
 * Default props for the icon button component.
 */
IconButton.defaultProps = {
    customIconPosition: "left",
    "data-componentid": "icon-button",
    "data-testid": "icon-button"
};
