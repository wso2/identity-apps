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
 * @param {ConfirmationModalContentPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
