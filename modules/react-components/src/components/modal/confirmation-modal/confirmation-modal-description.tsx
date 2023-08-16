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
import { Modal, ModalDescriptionProps } from "semantic-ui-react";

/**
 * Confirmation modal description props.
 */
export interface ConfirmationModalDescriptionPropsInterface extends ModalDescriptionProps,
    IdentifiableComponentInterface, TestableComponentInterface { }

/**
 * Confirmation modal description component.
 *
 * @param props - Props injected to the component.
 *
 * @returns the description component of the confirmation modal.
 */
export const ConfirmationModalDescription: FunctionComponent<ConfirmationModalDescriptionPropsInterface> = (
    props: ConfirmationModalDescriptionPropsInterface
): ReactElement => {

    const {
        children,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    return (
        <Modal.Description
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            { children }
        </Modal.Description>
    );
};

/**
 * Default proptypes for the confirmation modal description component.
 */
ConfirmationModalDescription.defaultProps = {
    "data-componentid": "confirmation-modal-description",
    "data-testid": "confirmation-modal-description"
};
