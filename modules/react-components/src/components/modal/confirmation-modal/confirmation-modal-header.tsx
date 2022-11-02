/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
