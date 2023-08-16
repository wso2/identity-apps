/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Divider, Header, Icon, Message } from "semantic-ui-react";
import { MessageHeaderProps } from "semantic-ui-react/dist/commonjs/collections/Message/MessageHeader";
import { SemanticShorthandContent, SemanticShorthandItem } from "semantic-ui-react/dist/commonjs/generic";

/**
 * Prop-types for the messageInfo component.
 */
export interface MessageInfoProps extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Shorthand for MessageHeader.
     * */
    header?: SemanticShorthandItem<MessageHeaderProps>;
    /**
     * Shorthand for primary content.
     * */
    content?: SemanticShorthandContent;
}

/**
 * MessageInfo component.
 *
 * @deprecated Use the new `Message` component from `@wso2is/react-components` instead.
 * @param props - Props injected in to the messageInfo component.
 * @returns Message info component.
 */
export const MessageInfo: FunctionComponent<MessageInfoProps> = (props: MessageInfoProps): ReactElement => {

    const {
        header,
        content,
        [ "data-componentid" ]: componentid,
        [ "data-testid" ]: testId
    } = props;

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

    return (
        <Message
            info
            header={ (
                <Header as="h4">
                    <Header.Content>
                        <>
                            <Icon name="info circle"/>
                            { header }
                        </>
                    </Header.Content>
                </Header>
            ) }
            content={ generateContent() }
            data-componentid={ componentid }
            data-testid={ testId }
        />
    );
};

/**
 * Default proptypes for the message info component.
 */
MessageInfo.defaultProps = {
    content: null,
    "data-componentid": "message-info",
    "data-testid": "message-info",
    header: null
};
