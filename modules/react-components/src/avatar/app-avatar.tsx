/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { OrangeAppIconBackground } from "@wso2is/theme";
import classNames from "classnames";
import React, { FunctionComponent } from "react";
import { Avatar, AvatarPropsInterface } from "./avatar";

/**
 * Prop types for the App Avatar component.
 */
export interface AppAvatarPropsInterface extends AvatarPropsInterface {
    /**
     * If the avatar is placed on a card.
     */
    onCard?: boolean;
}

/**
 * App Avatar component.
 *
 * @param {AvatarPropsInterface} props - Props injected in to the app avatar component.
 * @return {JSX.Element}
 */
export const AppAvatar: FunctionComponent<AppAvatarPropsInterface> = (
    props: AppAvatarPropsInterface
): JSX.Element => {

    const { image, className, name, onCard } = props;

    const appAvatarClassNames = classNames({
        [ "default-app-icon" ]: onCard,
        [ "bg-image" ]: !onCard
    }, className);

    if (image) {
        return (
            <Avatar
                avatarType="app"
                avatar
                className="with-app-image"
                image={ image }
                bordered={ false }
                { ...props }
            />
        );
    }

    return (
        <Avatar
            avatarType="app"
            className={ appAvatarClassNames }
            style={ onCard ? {} : { backgroundImage: `url(${ OrangeAppIconBackground })` } }
            bordered
            avatar
            name={ name }
            { ...props }
        />
    );
};

/**
 * Default proptypes for the App avatar component.
 */
AppAvatar.defaultProps = {
    image: null,
    name: null,
    onCard: false
};
