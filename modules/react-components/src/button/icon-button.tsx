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

import React, { PropsWithChildren } from "react";
import { Button as SemanticButton, ButtonProps } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Danger button component Prop types.
 */
interface IconButtonPropsInterface extends ButtonProps {
    customIcon?: any;
    customIconPosition?: "left" | "right";
    customIconSize?: GenericIconSizes;
}

/**
 * Icon button component.
 *
 * @param {IconButtonPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const IconButton: React.FunctionComponent<PropsWithChildren<IconButtonPropsInterface>> = (
    props: PropsWithChildren<IconButtonPropsInterface>
): JSX.Element => {

    const {
        children,
        customIcon,
        customIconPosition,
        customIconSize
    } = props;

    return (
        <SemanticButton
            { ...props }
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
                    />
                )
            }
            { children }
        </SemanticButton>
    );
};

IconButton.defaultProps = {
    customIconPosition: "left"
};
