/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
import {
    AuthReducerStateInterface,
    IdentifiableComponentInterface,
    ProfileInfoInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Avatar, AvatarPropsInterface } from "./avatar";
import GravatarLogo from "../../assets/images/gravatar-logo.png";
import DummyUser from "../../assets/images/user.png";
import { Popup } from "../popup";

/**
 * Prop types for the user avatar component.
 */
export interface UserAvatarPropsInterface extends AvatarPropsInterface, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Authenticated users basic information.
     */
    authState?: AuthReducerStateInterface;
    /**
     * Text to show on gravatar avatar hover.
     */
    gravatarInfoPopoverText?: React.ReactNode;
    /**
     * Profile information.
     */
    profileInfo?: ProfileInfoInterface;
    /**
     * If the gravatar label should be displayed or not.
     */
    showGravatarLabel?: boolean;
}

/**
 * User Avatar component.
 *
 * @param props - Props injected in to the user avatar component.
 *
 * @returns the User Avatar component
 */
export const UserAvatar: FunctionComponent<UserAvatarPropsInterface> = (
    props: UserAvatarPropsInterface
): ReactElement => {

    const {
        authState,
        children,
        className,
        gravatarInfoPopoverText,
        name,
        image,
        profileInfo,
        showGravatarLabel,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(className);

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
     * @returns whether the image is from Gravatar
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
     * @returns the resolved image
     */
    const resolveTopLabel = (): string => {
        if (isGravatarURL()) {
            return GravatarLogo;
        }

        return null;
    };

    /**
     * Resolves the user image for the avatar.
     * @returns the resolved user image for the avatar.
     */
    const resolveAvatarImage = (): any => {
        // If an image is directly passed, give prominence.
        if (image && !(image instanceof Promise)) {
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
     */
    const handleOnMouseOver = () => {
        setShowPopup(true);
    };

    /**
     * Handles the mouse out event.
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
                    shape="circular"
                    bordered={ false }
                    className={ classes }
                    image={ resolveAvatarImage() }
                    label={ showGravatarLabel ? resolveTopLabel() : null }
                    name={ profileInfo ? resolveUserDisplayName(profileInfo, authState) : name || "" }
                    onMouseOver={ handleOnMouseOver }
                    onMouseOut={ handleOnMouseOut }
                    data-componentid={ componentId }
                    data-testid={ testId }
                    { ...rest }
                >
                    { children }
                </Avatar>
            ) }
            data-componentid={ `${ componentId }-gravatar-disclaimer-popup` }
            data-testid={ `${ testId }-gravatar-disclaimer-popup` }
        />
    );
};

/**
 * Default prop types for the User avatar component.
 */
UserAvatar.defaultProps = {
    authState: null,
    "data-componentid": "user-avatar",
    "data-testid": "user-avatar",
    defaultIcon: DummyUser,
    gravatarInfoPopoverText: null,
    name: null,
    profileInfo: null,
    showGravatarLabel: false
};
