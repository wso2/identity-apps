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
 * @param {ConfirmationModalMessagePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
