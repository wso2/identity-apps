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
