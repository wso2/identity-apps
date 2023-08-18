/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import {
    Header,
    Icon,
    MessageHeaderProps,
    MessageProps,
    Message as SemanticMessage,
    SemanticShorthandContent,
    SemanticShorthandItem
} from "semantic-ui-react";

/**
 * Proptypes for the message with icon component.
 */
export interface MessagePropsInterface extends MessageProps, IdentifiableComponentInterface,
    TestableComponentInterface {
    /**
     * Type of the message.
     */
    type?: "info" | "warning" | "error" | "success";
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Content of the message.
     * */
    content?: SemanticShorthandContent;
    /**
     * Header of the message.
     * */
    header?: SemanticShorthandItem<MessageHeaderProps>;
    /**
     * Change the visibility of the message.
     * */
    visible?: boolean;

}

/**
 * Message with icon component.
 *
 * @param props - Props injected in to the message with icon component.
 * @returns Message with icon component.
 */
export const Message: FunctionComponent<MessagePropsInterface> = (props: MessagePropsInterface): ReactElement => {

    const {
        className,
        type,
        header,
        content,
        visible,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        `${ type }-message-with-icon`,
        className
    );

    const resolveMessageIcon = () => {
        switch (type) {
            case "info":
                return (<Icon name="info circle"/>);
            case "warning":
                return (<Icon name="warning circle"/>);
            case "success":
                return (<Icon name="check circle"/>);
            case "error":
                return (<Icon name="times circle"/>);
            default:
                return (<Icon name="info circle"/>);
        }
    };

    return (
        <SemanticMessage
            className={ classes }
            visible={ visible }
            header={
                header
                    ? (
                        <Header as="h5" className={ !props?.icon ? "mb-3" : null }>
                            <Header.Content>
                                <>
                                    {
                                        !props?.icon
                                            ? resolveMessageIcon()
                                            : null
                                    }
                                    { header }
                                </>
                            </Header.Content>
                        </Header>
                    ) : undefined
            }
            content={
                header
                    ? (
                        <div>
                            { content }
                        </div>
                    )
                    : (
                        <div>
                            { resolveMessageIcon() }
                            { content }
                        </div>
                    )
            }
            data-componentid={ componentId }
            data-testid={ testId }
            info={ type === "info" }
            warning={ type === "warning" }
            error={ type === "error" }
            success={ type === "success" }
            { ...rest }
        />
    );
};

/**
 * Default proptypes for the message with icon component.
 */
Message.defaultProps = {
    "data-componentid": "message-info",
    "data-testid": "message-info",
    visible: true
};
