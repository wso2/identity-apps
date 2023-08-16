/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Message, MessageProps } from "semantic-ui-react";

/**
 * Proptypes for the confirmation modal message component.
 */
export interface ConfirmationModalMessagePropsInterface extends MessageProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * If the message should be attached to the top.
     */
    attached?: boolean;
}

/**
 * Confirmation modal message component.
 *
 * @param props - Props injected to the component.
 *
 * @returns the confirmation modal message component.
 */
export const ConfirmationModalMessage: FunctionComponent<ConfirmationModalMessagePropsInterface> = (
    props: ConfirmationModalMessagePropsInterface
): ReactElement => {

    const {
        attached,
        children,
        className,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "confirmation-modal-message",
        {
            attached
        },
        className
    );

    return (
        <Message
            data-testid={ testId }
            data-componentid={ componentId }
            { ...rest }
            className={ classes }
        >
            { children }
        </Message>
    );
};

/**
 * Default proptypes for the confirmation modal message component.
 */
ConfirmationModalMessage.defaultProps = {
    "data-componentid": "confirmation-modal-message",
    "data-testid": "confirmation-modal-message"
};
