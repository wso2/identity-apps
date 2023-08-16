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
import { Modal, ModalContentProps } from "semantic-ui-react";

/**
 * Confirmation modal content props.
 */
export interface ConfirmationModalContentPropsInterface extends ModalContentProps, IdentifiableComponentInterface,
    TestableComponentInterface { }

/**
 * Confirmation modal content component.
 *
 * @param props - Props injected to the component.
 *
 * @returns the confirmation modal content component.
 */
export const ConfirmationModalContent: FunctionComponent<ConfirmationModalContentPropsInterface> = (
    props: ConfirmationModalContentPropsInterface
): ReactElement => {

    const {
        children,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    return (
        <Modal.Content
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            { children }
        </Modal.Content>
    );
};

/**
 * Default proptypes for the confirmation modal content component.
 */
ConfirmationModalContent.defaultProps = {
    "data-componentid": "confirmation-modal-content",
    "data-testid": "confirmation-modal-content"
};
