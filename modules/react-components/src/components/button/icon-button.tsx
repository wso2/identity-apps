/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
 * @param props - Props injected to the component.
 *
 * @returns a React component
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
