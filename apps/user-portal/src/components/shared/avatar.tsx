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

import classNames from "classnames";
import * as React from "react";
import { Image, SemanticSIZES } from "semantic-ui-react";
import { DefaultAppIcon } from "../../configs";
import { UserImageDummy } from "./ui";

/**
 * Prop types for the Avatar component.
 */
export interface AvatarProps {
    avatar?: boolean;
    avatarType?: "user" | "app";
    bordered?: boolean;
    className?: string;
    floated?: "left" | "right";
    image?: React.ReactNode;
    inline?: boolean;
    name?: string;
    relaxed?: boolean | "very";
    size?: AvatarSizes;
    spaced?: "left" | "right";
    style?: object;
    transparent?: boolean;
}

/**
 * Type to handle Avatar sizes.
 */
export type AvatarSizes = SemanticSIZES | "little";

/**
 * Avatar component.
 *
 * @param {React.PropsWithChildren<AvatarProps>} props - Props passed in to the Avatar component.
 * @return {JSX.Element}
 */
export const Avatar: React.FunctionComponent<AvatarProps> = (props): JSX.Element => {
    const {
        avatar,
        avatarType,
        bordered,
        className,
        floated,
        image,
        inline,
        name,
        relaxed,
        size,
        spaced,
        style,
        transparent,
    } = props;
    const relaxLevel = (relaxed && relaxed === true) ? "" : relaxed;

    const classes = classNames({
        bordered,
        [`floated-${floated}`]: floated,
        inline,
        relaxed,
        [`${size}`]: size, // Size is used as a class to support the custom size "little"
        [`spaced-${spaced}`]: spaced,
        transparent,
        [`${avatarType === "user" ? "user-avatar" : "app-avatar"}`]: avatar,
        [`${relaxLevel}`]: relaxLevel,
    }, className);

    /**
     * Generates the initials for the avatar. If the name
     * contains two or more words, two letter initial will
     * be generated using the first two words of the name.
     * i.e For the name "Brion Silva", "BS" will be generated.
     * If the name only has one word, then only a single initial
     * will be generated. i.e For "Brion", "B" will be generated.
     *
     * @return {string}
     */
    const generateInitials = (): string => {
        const nameParts = name.split(" ");

        // App avatar only requires one letter.
        if (avatarType === "app") {
            return name.charAt(0).toUpperCase();
        }

        if (nameParts.length >= 2) {
            return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    return (
        <>
            {
                image
                    ? (
                        <Image
                            className={ `${avatarType === "user" ? "user-image" : "app-image"} ${classes}` }
                            bordered={ bordered }
                            floated={ floated }
                            circular={ avatarType === "user" }
                            rounded={ avatarType === "app" }
                            style={ style }
                        >
                            <img alt="avatar" src={ image as string } />
                        </Image>
                    )
                    : null
            }
            {
                avatar
                    ? name
                        ? (
                            <Image
                                className={ `${avatarType === "user" ? "user-image" : "app-image"} ${classes}` }
                                bordered={ bordered }
                                floated={ floated }
                                verticalAlign="middle"
                                circular={ avatarType === "user" }
                                rounded={ avatarType === "app" }
                                centered
                                style={ style }
                            >
                                <span className="initials">{ generateInitials() }</span>
                            </Image>
                        )
                        : (

                            <Image
                                className={ `${avatarType === "user" ? "user-image" : "app-image"} ${classes}` }
                                src={ avatarType === "user" ? UserImageDummy : DefaultAppIcon.default }
                                bordered={ bordered }
                                floated={ floated }
                                verticalAlign="middle"
                                circular={ avatarType === "user" }
                                rounded={ avatarType === "app" }
                                centered
                                style={ style }
                            />
                        )
                    : null
            }
        </>
    );
};

/**
 * Default prop types for the Avatar component.
 */
Avatar.defaultProps = {
    avatar: false,
    avatarType: "user",
    bordered: true,
    className: "",
    inline: false,
    relaxed: false,
    size: "mini",
    spaced: null,
    style: {},
    transparent: false,
};
