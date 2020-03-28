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

import { CodeIcon, DummyUser } from "@wso2is/theme";
import classNames from "classnames";
import React, { PropsWithChildren, SyntheticEvent } from "react";
import { Image, Placeholder, SemanticSIZES } from "semantic-ui-react";

/**
 * Prop types for the Avatar component.
 */
export interface AvatarPropsInterface {
    /**
     * To determine if avatar with initials should be displayed.
     */
    avatar?: boolean;
    /**
     * The number of initials that should be displayed.
     */
    avatarInitialsLimit?: 1 | 2;
    /**
     * Type of the avatar.
     */
    avatarType?: "user" | "app";
    /**
     * If a border should be displayed.
     */
    bordered?: boolean;
    /**
     * Custom class for the component.
     */
    className?: string;
    /**
     * Floated direction of the avatar.
     */
    floated?: "left" | "right";
    /**
     * Image to be displayed as an avatar.
     */
    image?: React.ReactNode;
    /**
     * If the avatar should be displayed inline.
     */
    inline?: boolean;
    /**
     * If the avatar is in a loading state.
     */
    isLoading?: boolean;
    /**
     * A label for the avatar.
     */
    label?: string;
    /**
     * User's name.
     */
    name?: string;
    /**
     * On click callback.
     * @param {React.SyntheticEvent} e - Click event.
     */
    onClick?: (e: SyntheticEvent) => void;
    /**
     * Fired on mouse out.
     * @param {MouseEvent} e - Mouse event.
     */
    onMouseOut?: (e: MouseEvent) => void;
    /**
     * Fired on mouse over.
     * @param {MouseEvent} e - Mouse event.
     */
    onMouseOver?: (e: MouseEvent) => void;
    /**
     * Adds padding to the avatar content.
     */
    relaxed?: boolean | "very";
    /**
     * Size of the avatar.
     */
    size?: AvatarSizes;
    /**
     * Adds a space to the specified direction.
     */
    spaced?: "left" | "right";
    /**
     * Custom CSS styles.
     */
    style?: object;
    /**
     * Makes the avatar transparent.
     */
    transparent?: boolean;
}

/**
 * Type to handle Avatar sizes.
 */
export type AvatarSizes = SemanticSIZES | "little";

/**
 * Avatar component.
 *
 * @param {AvatarPropsInterface} props - Props passed in to the Avatar component.
 * @return {JSX.Element}
 * @constructor
 */
export const Avatar: React.FunctionComponent<PropsWithChildren<AvatarPropsInterface>> = (
    props: PropsWithChildren<AvatarPropsInterface>
): JSX.Element => {

    const {
        avatar,
        avatarInitialsLimit,
        avatarType,
        bordered,
        children,
        className,
        floated,
        image,
        inline,
        isLoading,
        label,
        name,
        onClick,
        onMouseOver,
        onMouseOut,
        relaxed,
        size,
        spaced,
        style,
        transparent
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
        [ `${ relaxLevel }` ]: relaxLevel,
    }, className);

    // If loading, show the placeholder.
    if (isLoading) {
        return (
            <Image
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
     * @return {string}
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

    if (React.isValidElement(image)){
        return (
            <Image
                className={ `${ avatarType === "user" ? "user-image" : "app-image" } ${ classes }` }
                bordered={ bordered }
                floated={ floated }
                circular={ avatarType === "user" }
                rounded={ avatarType === "app" }
                style={ style }
                onClick={ onClick }
                onMouseOver={ onMouseOver }
                onMouseOut={ onMouseOut }
            >
                <div className="wrapper">
                    {
                        image
                    }
                </div>
            </Image>
        )
    }

    if (image) {
        return (
            <>
                <Image
                    className={ `${ avatarType === "user" ? "user-image" : "app-image" } ${ classes }` }
                    bordered={ bordered }
                    floated={ floated }
                    circular={ avatarType === "user" }
                    rounded={ avatarType === "app" }
                    style={ style }
                    onClick={ onClick }
                    onMouseOver={ onMouseOver }
                    onMouseOut={ onMouseOut }
                >
                    <div className="wrapper">
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
                        { children }
                        <img className="inner-image" alt="avatar" src={ image as string } />
                    </div>
                </Image>
            </>
        );
    }

    if (avatar && name) {
        return (
            <Image
                className={ `${ avatarType === "user" ? "user-image" : "app-image" } ${ classes }` }
                bordered={ bordered }
                floated={ floated }
                verticalAlign="middle"
                circular={ avatarType === "user" }
                rounded={ avatarType === "app" }
                centered
                style={ style }
                onClick={ onClick }
                onMouseOver={ onMouseOver }
                onMouseOut={ onMouseOut }
            >
                { children }
                <span className="initials">{ generateInitials() }</span>
            </Image>
        );
    }

    return (
        <Image
            className={ `${ avatarType === "user" ? "user-image" : "app-image" } ${ classes }` }
            bordered={ bordered }
            floated={ floated }
            verticalAlign="middle"
            circular={ avatarType === "user" }
            rounded={ avatarType === "app" }
            centered
            style={ style }
            onClick={ onClick }
            onMouseOver={ onMouseOver }
            onMouseOut={ onMouseOut }
        >
            <div className="wrapper">
                { children }
                <img className="inner-image" alt="avatar" src={ avatarType === "user" ? DummyUser : CodeIcon.default } />
            </div>
        </Image>
    );
};

/**
 * Default prop types for the Avatar component.
 */
Avatar.defaultProps = {
    avatar: false,
    avatarInitialsLimit: 1,
    avatarType: "user",
    bordered: true,
    className: "",
    inline: false,
    isLoading: false,
    label: null,
    onClick: null,
    onMouseOut: null,
    onMouseOver: null,
    relaxed: false,
    size: "mini",
    spaced: null,
    style: {},
    transparent: false
};
