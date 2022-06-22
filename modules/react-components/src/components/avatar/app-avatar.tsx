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
import { Avatar, AvatarPropsInterface } from "./avatar";
import OrangeAppIconBackground from "../../assets/images/app-icon-background.png";
import CodeIcon from "../../assets/images/code-icon.svg";

/**
 * Prop types for the App Avatar component.
 */
export interface AppAvatarPropsInterface extends AvatarPropsInterface, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * If the avatar is placed on a card.
     */
    onCard?: boolean;
}

/**
 * App Avatar component.
 *
 * @param {AvatarPropsInterface} props - Props injected in to the app avatar component.
 *
 * @return {React.ReactElement}
 */
export const AppAvatar: FunctionComponent<AppAvatarPropsInterface> = (
    props: AppAvatarPropsInterface
): ReactElement => {

    const {
        image,
        children,
        className,
        name,
        onCard,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const appAvatarClassNames = classNames(className);

    if (image) {
        return (
            <Avatar
                avatar
                image={ image }
                bordered={ false }
                initialsColor={ onCard ? "primary" : "white" }
                withBackgroundImage={ !onCard }
                data-componentid={ componentId }
                data-testid={ testId }
                { ...rest }
            >
                { children }
            </Avatar>
        );
    }

    return (
        <Avatar
            avatar
            bordered
            className={ appAvatarClassNames }
            style={ onCard ? {} : { backgroundImage: `url(${ OrangeAppIconBackground })` } }
            name={ name }
            initialsColor={ onCard ? "primary" : "white" }
            withBackgroundImage={ !onCard }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            { children }
        </Avatar>
    );
};

/**
 * Default proptypes for the App avatar component.
 */
AppAvatar.defaultProps = {
    "data-componentid": "app-avatar",
    "data-testid": "app-avatar",
    defaultIcon: CodeIcon,
    image: null,
    name: null,
    onCard: false,
    overflow: "hidden",
    rounded: true,
    shape: "square",
    width: "full"
};
