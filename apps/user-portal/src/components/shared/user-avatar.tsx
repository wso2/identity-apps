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

import React, { FunctionComponent, useEffect, useState } from "react";
import { Popup } from "semantic-ui-react";
import { ThirdPartyLogos } from "../../configs";
import * as UIConstants from "../../constants/ui-constants";
import { resolveUserDisplayName } from "../../helpers";
import { AuthStateInterface } from "../../models";
import { Avatar, AvatarProps } from "./avatar";

/**
 * Prop types for the user avatar component.
 */
interface UserAvatarProps extends AvatarProps {
    authState?: AuthStateInterface;
    gravatarInfoPopoverText?: React.ReactNode;
    showGravatarLabel?: boolean;
}

/**
 * User Avatar component.
 *
 * @param {UserAvatarProps} props - Props injected in to the user avatar component.
 * @return {JSX.Element}
 */
export const UserAvatar: FunctionComponent<UserAvatarProps> = (props: UserAvatarProps): JSX.Element => {
    const { authState, gravatarInfoPopoverText, name, image, showGravatarLabel } = props;
    const [ userImage, setUserImage ] = useState(null);
    const [ showPopup, setShowPopup ] = useState(false);

    // Check if the image is a promise, and resolve.
    useEffect(() => {
        if (image instanceof Promise) {
            image
                .then((response) => {
                    setUserImage(response);
                })
                .catch(() => {
                    setUserImage(null);
                });
        }
    }, [image]);

    /**
     * Resolves the top label image.
     *
     * @return {string}
     */
    const resolveTopLabel = (): string => {
        if (isGravatarURL()) {
            return ThirdPartyLogos.gravatar;
        }

        return null;
    };

    /**
     * Checks if the image is from `Gravatar`.
     *
     * @return {boolean}
     */
    const isGravatarURL = (): boolean => {
        return (userImage && userImage.includes(UIConstants.GRAVATAR_URL))
            || (authState && authState.profileInfo && authState.profileInfo.userImage
                && authState.profileInfo.userImage.includes(UIConstants.GRAVATAR_URL))
            || (authState && authState.profileInfo && authState.profileInfo.profileUrl
                && authState.profileInfo.profileUrl.includes(UIConstants.GRAVATAR_URL));
    };

    /**
     * Handles the mouse over event.
     *
     * @param {MouseEvent} e - Mouse event.
     */
    const handleOnMouseOver = (e: MouseEvent) => {
        setShowPopup(true);
    };

    /**
     * Handles the mouse out event.
     *
     * @param {MouseEvent} e - Mouse event.
     */
    const handleOnMouseOut = (e: MouseEvent) => {
        setShowPopup(false);
    };

    // Avatar for the authenticated user.
    if (authState && authState.profileInfo && (authState.profileInfo.profileUrl || authState.profileInfo.userImage)) {
        return (
            <Popup
                content={ gravatarInfoPopoverText }
                position="bottom center"
                size="mini"
                disabled={ !(showGravatarLabel && isGravatarURL()) }
                inverted
                hoverable
                open={ showPopup }
                trigger={ (
                    <Avatar
                        { ...props }
                        avatarType="user"
                        bordered={ false }
                        image={
                            authState.profileInfo.profileUrl
                                ? authState.profileInfo.profileUrl
                                : authState.profileInfo.userImage
                        }
                        label={ showGravatarLabel ? resolveTopLabel() : null }
                        onMouseOver={ handleOnMouseOver }
                        onMouseOut={ handleOnMouseOut }
                    />
                ) }
            />
        );
    }

    return (
        <Popup
            content={ gravatarInfoPopoverText }
            position="bottom center"
            size="mini"
            disabled={ !(showGravatarLabel && isGravatarURL()) }
            inverted
            hoverable
            open={ showPopup }
            trigger={ (
                <Avatar
                    { ...props }
                    image={ userImage }
                    avatarType="user"
                    bordered={ false }
                    avatar
                    name={ authState ? resolveUserDisplayName(authState) : name }
                    label={ showGravatarLabel ? resolveTopLabel() : null }
                    onMouseOver={ handleOnMouseOver }
                    onMouseOut={ handleOnMouseOut }
                />
            ) }
        />
    );
};

/**
 * Default prop types for the User avatar component.
 */
UserAvatar.defaultProps = {
    authState: null,
    gravatarInfoPopoverText: null,
    name: null,
    showGravatarLabel: false
};
