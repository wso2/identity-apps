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
import { Divider, Header, Icon, MessageProps, Message as SemanticMessage } from "semantic-ui-react";

/**
 * Proptypes for the message component.
 */
export interface MessageComponentPropsInterface extends MessageProps, IdentifiableComponentInterface,
    TestableComponentInterface { }

/**
 * Message component.
 *
 * @param {MessageComponentProps} props - Props injected in to the message component.
 *
 * @return {React.ReactElement}
 */
export const Message: FunctionComponent<MessageComponentPropsInterface> = (
    props: MessageComponentPropsInterface): ReactElement => {

    const {
        header,
        content,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ... rest
    } = props;

    const generateContent = () => {

        return (
            <>
                <div>
                    { (content) }
                </div>
            </>
        );
    };

    return (
        <SemanticMessage
            className={ props.onDismiss ? "with-close-button" : "" }
            { ...rest }
            header={
                header
                    ? (
                        <Header as="h4">
                            <Header.Content>
                                <Icon name="info circle"/>
                                { (header) }
                                <Divider hidden/>
                            </Header.Content>
                        </Header>
                    )
                    : null
            }
            content={ generateContent() }
            data-componentid={ componentId }
            data-testid={ testId }
        />
    );
};

/**
 * Default proptypes for the message component.
 */
Message.defaultProps = {
    content: null,
    "data-componentid": "message-component",
    "data-testid": "message-component",
    header: null
};
