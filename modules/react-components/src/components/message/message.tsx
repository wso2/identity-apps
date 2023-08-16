/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
