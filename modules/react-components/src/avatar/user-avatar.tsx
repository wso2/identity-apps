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

import { UIConstants } from "@wso2is/core/constants";
import { resolveUserDisplayName } from "@wso2is/core/helpers";
import { AuthReducerStateInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { GravatarLogo } from "@wso2is/theme";
import classNames from "classnames";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Icon, Popup } from "semantic-ui-react";
import { Avatar, AvatarPropsInterface } from "./avatar";

/**
 * Prop types for the user avatar component.
 */
export interface UserAvatarPropsInterface extends AvatarPropsInterface {
    /**
     * Authenticated users basic information.
     */
    authState?: AuthReducerStateInterface;
    /**
     * Text to show on gravatar avatar hover.
     */
    gravatarInfoPopoverText?: React.ReactNode;
    /**
     * Callback when avatar edit is clicked.
     * @param {React.SyntheticEvent} e - Click event.
     */
    onEditAvatarClicked?: (e: React.SyntheticEvent) => void;
    /**
     * Profile information.
     */
    profileInfo?: ProfileInfoInterface;
    /**
     * If the gravatar label should be displayed or not.
     */
    showGravatarLabel?: boolean;
    /**
     * If the avatar is editable or not.
     */
    isEditable?: boolean;
}

/**
 * User Avatar component.
 *
 * @param {UserAvatarPropsInterface} props - Props injected in to the user avatar component.
 * @return {JSX.Element}
 */
export const UserAvatar: FunctionComponent<UserAvatarPropsInterface> = (
    props: UserAvatarPropsInterface
): JSX.Element => {

    const {
        authState,
        gravatarInfoPopoverText,
        name,
        image,
        onEditAvatarClicked,
        profileInfo,
        showGravatarLabel,
        isEditable,
        ...rest
    } = props;

    const classes = classNames({
        [ "editable" ]: isEditable
    }, "");

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
    }, [ image ]);

    /**
     * Checks if the image is from `Gravatar`.
     *
     * @return {boolean}
     */
    const isGravatarURL = (): boolean => {
        return (userImage && userImage.includes(UIConstants.GRAVATAR_URL))
            || (profileInfo && profileInfo.userImage
                && profileInfo.userImage.includes(UIConstants.GRAVATAR_URL))
            || (profileInfo && profileInfo.profileUrl
                && profileInfo.profileUrl.includes(UIConstants.GRAVATAR_URL));
    };

    /**
     * Resolves the top label image.
     *
     * @return {string}
     */
    const resolveTopLabel = (): string => {
        if (isGravatarURL()) {
            return GravatarLogo;
        }

        return null;
    };

    /**
     * Resolves the user image for the avatar.
     * @return {any}
     */
    const resolveAvatarImage = (): any => {
        // If an image is directly passed, give prominence.
        if (image) {
            return image;
        }

        if (profileInfo) {
            if (profileInfo.profileUrl) {
                return profileInfo.profileUrl;
            } else if (profileInfo.userImage) {
                return profileInfo.userImage;
            }
        }

        return userImage;
    };

    /**
     * Handles the mouse over event.
     *
     * @param {MouseEvent} e - Mouse event.
     */
    const handleOnMouseOver = () => {
        setShowPopup(true);
    };

    /**
     * Handles the mouse out event.
     *
     * @param {MouseEvent} e - Mouse event.
     */
    const handleOnMouseOut = () => {
        setShowPopup(false);
    };

    return (
        <Popup
            content={ gravatarInfoPopoverText }
            position="top center"
            size="mini"
            disabled={ !(showGravatarLabel && isGravatarURL()) }
            inverted
            hoverable
            open={ showPopup }
            trigger={ (
                <Avatar
                    avatar
                    avatarType="user"
                    bordered={ false }
                    className={ classes }
                    image={ resolveAvatarImage() }
                    label={ showGravatarLabel ? resolveTopLabel() : null }
                    name={ profileInfo ? resolveUserDisplayName(profileInfo, authState) : name || "" }
                    onClick={ onEditAvatarClicked }
                    onMouseOver={ handleOnMouseOver }
                    onMouseOut={ handleOnMouseOut }
                    { ...rest }
                >
                    { isEditable && <Icon name="camera" className="edit-icon" size="large"/> }
                </Avatar>
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
    onEditAvatarClicked: () => null,
    name: null,
    profileInfo: null,
    showGravatarLabel: false,
    isEditable: false
};
