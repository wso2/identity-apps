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

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, MouseEvent, ReactElement, ReactNode } from "react";
import { ModalProps } from "semantic-ui-react";
import { Heading } from "../../typography";
import { ConfirmationModal } from "../confirmation-modal";

/**
 * Session Management Modal props interface.
 */
export interface SessionTimeoutModalPropsInterface extends ModalProps, TestableComponentInterface {
    /**
     * Modal description.
     */
    description?: ReactNode;
    /**
     * Modal Heading.
     */
    heading?: ReactNode;
    /**
     * Secondary button text.
     */
    secondaryButtonText?: string;
    /**
     * Primary button text.
     */
    primaryButtonText?: string;
    /**
     * Callback function for the primary action button.
     */
    onPrimaryActionClick?: (e: MouseEvent<HTMLElement>) => void;
    /**
     * Callback function for the secondary action button.
     */
    onSecondaryActionClick?: (e: MouseEvent<HTMLElement>) => void;
}

/**
 * Session Timeout modal.
 *
 * @param {SessionTimeoutModalPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const SessionTimeoutModal: FunctionComponent<SessionTimeoutModalPropsInterface> = (
    props: SessionTimeoutModalPropsInterface
): ReactElement => {

    const {
        description,
        heading,
        onSecondaryActionClick,
        onPrimaryActionClick,
        primaryButtonText,
        secondaryButtonText,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    return (
        <ConfirmationModal
            animated
            type="warning"
            textAlign="center"
            primaryAction={ primaryButtonText }
            secondaryAction={ secondaryButtonText }
            onSecondaryActionClick={ onSecondaryActionClick }
            onPrimaryActionClick={ onPrimaryActionClick }
            data-testid={ testId }
            { ...rest }
        >
            <ConfirmationModal.Content>
                <Heading as="h3">{ heading }</Heading>
                <p>
                    { description }
                </p>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
SessionTimeoutModal.defaultProps = {
    "data-testid": "session-timeout-modal",
    description: "You will be logged out of the current session due to inactivity." +
        "\nPlease choose Stay logged in if you would like to continue the session.",
    heading: "You will be logged out!",
    primaryButtonText: "Stay logged in",
    secondaryButtonText: "Logout"
};
