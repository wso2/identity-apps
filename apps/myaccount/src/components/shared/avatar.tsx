/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import * as React from "react";
import { Image, Placeholder, SemanticSIZES } from "semantic-ui-react";
import { DefaultAppIcon, UserImage } from "../../configs";

/**
 * Prop types for the Avatar component.
 * Also see {@link Avatar.defaultProps}
 */
export interface AvatarProps extends TestableComponentInterface {
    avatar?: boolean;
    avatarInitialsLimit?: 1 | 2;
    avatarType?: "user" | "app";
    bordered?: boolean;
    className?: string;
    floated?: "left" | "right";
    image?: React.ReactNode | Promise<string>;
    inline?: boolean;
    isLoading?: boolean;
    label?: string;
    name?: string;
    onMouseOut?: (e: MouseEvent) => void;
    onMouseOver?: (e: MouseEvent) => void;
    relaxed?: boolean | "very";
    showTopLabel?: boolean;
    size?: AvatarSizes;
    spaced?: "left" | "right";
    style?: Record<string, unknown>;
    transparent?: boolean;
}

/**
 * Type to handle Avatar sizes.
 */
export type AvatarSizes = SemanticSIZES | "little";

/**
 * Avatar component.
 *
 * @param props - Props passed in to the Avatar component.
 * @returns Avatar component.
 */
export const Avatar: React.FunctionComponent<AvatarProps> = (props: AvatarProps): JSX.Element => {
    const {
        avatar,
        avatarInitialsLimit,
        avatarType,
        bordered,
        className,
        floated,
        image,
        inline,
        isLoading,
        label,
        name,
        onMouseOver,
        onMouseOut,
        relaxed,
        size,
        spaced,
        style,
        transparent,
        ["data-testid"]: testId
    } = props;
    const relaxLevel = (relaxed && relaxed === true) ? "" : relaxed;

    const classes = classNames({
        bordered,
        [ `floated-${ floated }` ]: floated,
        inline,
        relaxed,
        [ `${ size }` ]: size, // Size is used as a class to support the custom size "little"
        [ `spaced-${ spaced }` ]: spaced,
        transparent,
        [ `${ avatarType === "user" ? "user-avatar" : "app-avatar" }` ]: avatar,
        [ `${ relaxLevel }` ]: relaxLevel
    }, className);

    // If loading, show the placeholder.
    if (isLoading) {
        return (
            <Image
                data-testid={ `${testId}-placeholder` }
                className={ `${ avatarType === "user" ? "user-image" : "app-image" } ${ classes }` }
                bordered={ bordered }
                floated={ floated }
                circular={ avatarType === "user" }
                rounded={ avatarType === "app" }
                style={ style }
            >
                <Placeholder>
                    <Placeholder.Image square />
                </Placeholder>
            </Image>
        );
    }

    /**
     * Generates the initials for the avatar. If the name
     * contains two or more words, two letter initial will
     * be generated using the first two words of the name.
     * i.e For the name "Brion Silva", "BS" will be generated.
     * If the name only has one word, then only a single initial
     * will be generated. i.e For "Brion", "B" will be generated.
     *
     * @returns Generated initials.
     */
    const generateInitials = (): string => {
        // App avatar only requires one letter.
        if (avatarType === "app") {
            return name.charAt(0).toUpperCase();
        }

        const nameParts = name.split(" ");

        if (avatarInitialsLimit === 2 && nameParts.length >= 2) {
            return (nameParts[ 0 ].charAt(0) + nameParts[ 1 ].charAt(0)).toUpperCase();
        }

        return name.charAt(0).toUpperCase();
    };

    if (image) {
        return (
            <>
                <Image
                    data-testid={ testId }
                    className={ `${ avatarType === "user" ? "user-image" : "app-image" } ${ classes }` }
                    bordered={ bordered }
                    floated={ floated }
                    circular={ avatarType === "user" }
                    rounded={ avatarType === "app" }
                    style={ style }
                    onMouseOver={ onMouseOver }
                    onMouseOut={ onMouseOut }
                >
                    <div className="wrapper pref-background"><img alt="avatar" src={ image as string } /></div>
                </Image>
                {
                    label
                        ? (
                            <div className="custom-label">
                                <Image
                                    avatar
                                    circular
                                    size="mini"
                                    src={ label }
                                />
                            </div>
                        )
                        : null
                }
            </>
        );
    }

    if (avatar && name) {
        return (
            <Image
                data-testid={ testId }
                className={ `${ avatarType === "user" ? "user-image" : "app-image" } ${ classes }` }
                bordered={ bordered }
                floated={ floated }
                verticalAlign="middle"
                circular={ avatarType === "user" }
                rounded={ avatarType === "app" }
                centered
                style={ style }
                onMouseOver={ onMouseOver }
                onMouseOut={ onMouseOut }
            >
                <span className="initials">{ generateInitials() }</span>
            </Image>
        );
    }

    return (
        <Image
            data-testid={ testId }
            className={ `${ avatarType === "user" ? "user-image" : "app-image" } ${ classes }` }
            src={ avatarType === "user" ? UserImage : DefaultAppIcon }
            bordered={ bordered }
            floated={ floated }
            verticalAlign="middle"
            circular={ avatarType === "user" }
            rounded={ avatarType === "app" }
            centered
            style={ style }
            onMouseOver={ onMouseOver }
            onMouseOut={ onMouseOut }
        />
    );
};

/**
 * Default prop types for the Avatar component.
 * See type definitions in {@link AvatarProps}
 */
Avatar.defaultProps = {
    avatar: false,
    avatarInitialsLimit: 1,
    avatarType: "user",
    bordered: true,
    className: "",
    ["data-testid"]: "avatar",
    inline: false,
    isLoading: false,
    label: null,
    onMouseOut: null,
    onMouseOver: null,
    relaxed: false,
    size: "mini",
    spaced: null,
    style: {},
    transparent: false
};
