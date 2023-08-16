/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { ButtonProps, Button as SemanticButton } from "semantic-ui-react";

/**
 * Primary button component Prop types.
 */
export interface PrimaryButtonPropsInterface extends ButtonProps, IdentifiableComponentInterface,
    TestableComponentInterface { }

/**
 * Primary button component.
 *
 * @param props - Props injected to the component.
 *
 * @returns a React component
 */
export const PrimaryButton: FunctionComponent<PrimaryButtonPropsInterface> = (
    props: PrimaryButtonPropsInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    return (
        <SemanticButton
            { ...props }
            primary
            data-componentid={ componentId }
            data-testid={ testId }
        />
    );
};

/**
 * Prop types for the primary button component.
 */
PrimaryButton.defaultProps = {
    "data-componentid": "primary-button",
    "data-testid": "primary-button"
};
