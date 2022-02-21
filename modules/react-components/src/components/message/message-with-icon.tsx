/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import {
    Divider,
    Header,
    Icon,
    Message,
    MessageHeaderProps,
    SemanticShorthandContent,
    SemanticShorthandItem
} from "semantic-ui-react";

/**
 * Proptypes for the message with icon component.
 */
export interface MessageWithIconProps extends IdentifiableComponentInterface, TestableComponentInterface {
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
 * @param {MessageWithIconProps} props - Props injected in to the message with icon component.
 *
 * @return {React.ReactElement}
 */
export const MessageWithIcon: FunctionComponent<MessageWithIconProps> = (props: MessageWithIconProps): ReactElement => {

    const {
        className,
        type,
        header,
        content,
        visible,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "info-message-with-icon",
        className
    );

    const generateContent = () => {
        return (
            <>
                <Divider
                    hidden
                    className={ "message-info-text" }/>
                <div>
                    { (content) }
                </div>
            </>
        );
    };

    const resolveMessage = () => {
        switch (type) {
            case "info":
                return (
                    <Message
                        className={ classes }
                        info
                        visible={ visible }
                        header={
                            header
                                ? (
                                    <Header as="h4">
                                        <Header.Content>
                                            <Icon name="info circle"/>
                                            { (header) }
                                        </Header.Content>
                                    </Header>
                                ) : undefined
                        }
                        content={
                            header
                                ? generateContent()
                                : (
                                    <div>
                                        <Icon name="info circle"/>
                                        { content }
                                    </div>
                                )
                        }
                        data-componentid={ componentId }
                        data-testid={ testId }
                    />
                );
            case "error":
                return (
                    <Message
                        error
                        visible={ visible }
                        header={
                            header
                                ? (
                                    <Header as="h4">
                                        <Header.Content>
                                            <Icon name="times circle"/>
                                            { (header) }
                                        </Header.Content>
                                    </Header>
                                ) : undefined
                        }
                        content={
                            header
                                ? generateContent()
                                : (
                                    <div>
                                        <Icon name="times circle"/>
                                        { content }
                                    </div>
                                )
                        }
                        data-componentid={ componentId }
                        data-testid={ testId }
                    />
                );
            case "success":
                return (
                    <Message
                        success
                        visible={ visible }
                        header={
                            header
                                ? (
                                    <Header as="h4">
                                        <Header.Content>
                                            <Icon name="check circle"/>
                                            { (header) }
                                        </Header.Content>
                                    </Header>
                                ) : undefined
                        }
                        content={
                            header
                                ? generateContent()
                                : (
                                    <div>
                                        <Icon name="check circle"/>
                                        { content }
                                    </div>
                                )
                        }
                        data-componentid={ componentId }
                        data-testid={ testId }
                    />
                );
            case "warning":
                return (
                    <Message
                        warning
                        visible={ visible }
                        header={
                            header
                                ? (
                                    <Header as="h4">
                                        <Header.Content>
                                            <Icon name="warning circle"/>
                                            { (header) }
                                        </Header.Content>
                                    </Header>
                                ) : undefined
                        }
                        content={
                            header
                                ? generateContent()
                                : (
                                    <div>
                                        <Icon name="warning circle"/>
                                        { content }
                                    </div>
                                )
                        }
                        data-componentid={ componentId }
                        data-testid={ testId }
                    />
                );
            default:
                return (
                    <Message
                        visible={ visible }
                        content={ generateContent() }
                        header={ header }
                        data-componentid={ componentId }
                        data-testid={ testId }
                    />
                );
        }
    };

    return (
        <>
            { resolveMessage() }
        </>
    );
};

/**
 * Default proptypes for the message with icon component.
 */
MessageWithIcon.defaultProps = {
    "data-componentid": "message-info",
    "data-testid": "message-info",
    visible: true
};
