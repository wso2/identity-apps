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
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import {
    Container,
    Message, MessageProps,
    SemanticCOLORS
} from "semantic-ui-react";
import { ReactComponent as CrossIcon } from "../../assets/images/cross-icon.svg";
import { GenericIcon } from "../icon";

/**
 * Announcement component prop types.
 */
export interface AnnouncementPropsInterface extends StrictAnnouncementPropsInterface, Omit<MessageProps, "color">,
    IdentifiableComponentInterface, TestableComponentInterface {

    [ key: string ]: any;
}

/**
 * Announcement component strict prop types.
 */
export interface StrictAnnouncementPropsInterface {
    /**
     * Main message for the announcement.
     */
    message?: ReactNode;
    /**
     * Background color.
     */
    color: SemanticCOLORS | "primary" | "secondary" | string;
    /**
     * Is fluid layout.
     */
    fluid?: boolean;
    /**
     * Show close icon.
     */
    showCloseIcon?: boolean;
}

/**
 * Announcement component.
 *
 * @param {AnnouncementPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const Announcement: FunctionComponent<AnnouncementPropsInterface> = (
    props: AnnouncementPropsInterface
): ReactElement => {

    const {
        color,
        className,
        fluid,
        message,
        onDismiss,
        showCloseIcon,
        visible,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "announcement",
        {
            [ color ]: color
        }
        , className
    );

    return (
        visible
            ? (
                <Message
                    className={ classes }
                    data-testid={ testId }
                    data-componentid={ componentId }
                    { ...rest }
                >
                    <Container fluid={ fluid }>
                        <p>
                            { message }
                            {
                                showCloseIcon && (
                                    <GenericIcon
                                        icon={ CrossIcon }
                                        size="nano"
                                        floated="right"
                                        onClick={ (e: React.MouseEvent<HTMLDivElement>) => onDismiss(e) }
                                        fill="white"
                                        inline
                                        link
                                        transparent
                                    />
                                )
                            }
                        </p>
                    </Container>
                </Message>
            )
            : null
    );
};

/**
 * Default prop types for the component.
 */
Announcement.defaultProps = {
    color: "primary",
    "data-componentid": "announcement",
    "data-testid": "announcement",
    fluid: false,
    showCloseIcon: true,
    visible: true
};
