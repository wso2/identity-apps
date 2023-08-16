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
import { Modal, ModalHeaderProps } from "semantic-ui-react";

/**
 * Confirmation modal header props.
 */
export interface ConfirmationModalHeaderPropsInterface extends ModalHeaderProps, IdentifiableComponentInterface,
    TestableComponentInterface { }

/**
 * Confirmation modal header component.
 *
 * @param props - Props injected to the component.
 *
 * @returns the header of the confirmation modal.
 */
export const ConfirmationModalHeader: FunctionComponent<ConfirmationModalHeaderPropsInterface> = (
    props: ConfirmationModalHeaderPropsInterface
): ReactElement => {

    const {
        children,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    return (
        <Modal.Header
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            { children }
        </Modal.Header>
    );
};

/**
 * Default proptypes for the confirmation modal header component.
 */
ConfirmationModalHeader.defaultProps = {
    "data-componentid": "confirmation-modal-header",
    "data-testid": "confirmation-modal-header"
};
