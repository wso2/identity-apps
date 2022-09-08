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
import { ImageUtils } from "@wso2is/core/utils";
import classNames from "classnames";
import React, {
    CSSProperties,
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { Image, ImageProps, Placeholder, SemanticSIZES } from "semantic-ui-react";
import { ReactComponent as CameraIcon } from "../../assets/images/icons/camera-icon.svg";
import { GenericIcon, GenericIconProps } from "../icon";

/**
 * Prop types for the Avatar component.
 */
export interface AvatarPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface,
    Omit<ImageProps, "size"> {

    /**
     * To determine if avatar with initials should be displayed.
     */
    avatar?: boolean;
    /**
     * The number of initials that should be displayed.
     */
    avatarInitialsLimit?: 1 | 2;
    /**
     * Default icon.
     */
    defaultIcon?: any;
    /**
     * If the avatar is editable or not.
     */
    editable?: boolean;
    /**
     * Edit icon.
     */
    editIcon?: GenericIconProps["icon"];
    /**
     * Edit icon size.
     */
    editIconSize?: GenericIconProps["size"];
    /**
     * Show hovering effect.
     */
    hoverable?: boolean;
    /**
     * Image to be displayed as an avatar.
     */
    image?: React.ReactNode | Promise<string>;
    /**
     * If the avatar should be displayed inline.
     */
    inline?: boolean;
    /**
     * Color of the avatar initials.
     */
    initialsColor?: "white" | "primary";
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
     * On Edit Icon click callback.
     * @param e - Click event.
     */
    onEditIconClick?: (e: SyntheticEvent) => void;
    /**
     * On click callback.
     * @param e - Click event.
     */
    onClick?: (e: SyntheticEvent) => void;
    /**
     * Fired on mouse out.
     * @param e - Mouse event.
     */
    onMouseOut?: (e: MouseEvent) => void;
    /**
     * Fired on mouse over.
     * @param e - Mouse event.
     */
    onMouseOver?: (e: MouseEvent) => void;
    /**
     * Set overflow attribute to the wrapper.
     */
    overflow?: "auto" | "hidden";
    /**
     * Adds padding to the avatar content.
     */
    relaxed?: boolean | "very";
    /**
     * Shape of the avatar.
     */
    shape?: "circular" | "square";
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
    style?: CSSProperties | undefined;
    /**
     * Makes the avatar transparent.
     */
    transparent?: boolean;
    /**
     * Width of the inner image.
     */
    width?: "auto" | "full";
    /**
     * Adjust styling to enable background images.
     */
    withBackgroundImage?: boolean;
}

/**
 * Type to handle Avatar sizes.
 */
export type AvatarSizes = SemanticSIZES | "x30" | "x50" | "x60" | "little";

const AVATAR_MODULE_CSS_CLASS = "ui-avatar";

/**
 * Avatar component.
 *
 * @param props - Props passed in to the Avatar component.
 * @returns Avatar component.
 */
export const Avatar: FunctionComponent<PropsWithChildren<AvatarPropsInterface>> = (
    props: PropsWithChildren<AvatarPropsInterface>
): ReactElement => {

    const {
        avatar,
        avatarInitialsLimit,
        children,
        className,
        defaultIcon,
        editable,
        editIcon,
        editIconSize,
        hoverable,
        image,
        initialsColor,
        inline,
        isLoading,
        label,
        name,
        onEditIconClick,
        onClick,
        onMouseOver,
        onMouseOut,
        overflow,
        relaxed,
        rounded,
        shape,
        size,
        spaced,
        transparent,
        width,
        withBackgroundImage,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const [ isImageValidUrl, setIsImageValidUrl ] = useState<boolean>(false);

    const relaxLevel = (relaxed && relaxed === true) ? "" : relaxed;

    const wrapperClasses = classNames(`${ AVATAR_MODULE_CSS_CLASS }-wrapper`,
        {
            inline
        },
        className
    );

    const containerClasses = classNames(`${ AVATAR_MODULE_CSS_CLASS }-container`,
        {
            [ shape ]: shape
        }
    );

    const imgElementClasses = classNames(AVATAR_MODULE_CSS_CLASS,
        {
            "hoverable": hoverable !== false && onClick !== undefined,
            [ `initials-color-${ initialsColor }` ]: initialsColor,
            relaxed,
            rounded,
            [ `${ size }` ]: size, // Size is used as a class to support the custom size "little"
            [ `spaced-${ spaced }` ]: spaced,
            [ shape ]: shape,
            transparent,
            [ `${ relaxLevel }` ]: relaxLevel,
            "with-background-image": withBackgroundImage,
            [ `overflow-${ overflow }` ]: overflow
        }
    );

    const innerImageClasses = classNames("inner-image",
        {
            [ `width-${ width }` ]: width
        }
    );

    /**
     * Check if `image` is a valid image URL.
     */
    useEffect(() => {
        if (image) {
            if (React.isValidElement(image)) {
                setIsImageValidUrl(false);
            } else {
                ImageUtils.isValidImageURL(image as string, (isValid: boolean) => {
                    setIsImageValidUrl(isValid);
                });
            }
        }
    }, [ image ]);

    // If loading, show the placeholder.
    if (isLoading) {
        return (
            <Image
                className={ imgElementClasses }
                circular={ shape === "circular" }
                data-componentid={ `${ componentId }-loading` }
                data-testid={ `${ testId }-loading` }
            >
                <Placeholder
                    data-componentid={ `${ componentId }-loading-placeholder` }
                    data-testid={ `${ testId }-loading-placeholder` }
                >
                    <Placeholder.Image square/>
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
     * @returns Initials based on the name.
     */
    const generateInitials = (): string => {

        const nameParts = name.split(" ");

        if (avatarInitialsLimit === 2 && nameParts.length >= 2) {
            return (nameParts[ 0 ].charAt(0) + nameParts[ 1 ].charAt(0)).toUpperCase();
        }

        return name.charAt(0).toUpperCase();
    };

    /**
     * Renders a floating edit icon.
     *
     * @returns Edit bubble component.
     */
    const renderEditBubble = (): ReactElement => (
        editable && (
            <div className="edit-icon-container">
                <GenericIcon
                    link
                    inline
                    hoverable
                    shape="circular"
                    fill="default"
                    icon={ editIcon ?? CameraIcon }
                    size={ editIconSize }
                    onClick={ onEditIconClick ?? onClick }
                />
            </div>
        )
    );

    /**
     * Renders a floating custom label.
     *
     * @returns Custom label.
     */
    const renderCustomLabel = (): ReactElement => (
        label && (
            <div className="custom-label">
                <Image
                    avatar
                    circular
                    size="mini"
                    src={ label }
                />
            </div>
        )
    );

    if (React.isValidElement(image)) {
        return (
            <div className={ wrapperClasses }>
                <div className={ containerClasses }>
                    <Image
                        className={ imgElementClasses }
                        circular={ shape === "circular" }
                        onClick={ onClick }
                        onMouseOver={ onMouseOver }
                        onMouseOut={ onMouseOut }
                        data-componentid={ componentId }
                        data-testid={ testId }
                        { ...rest }
                    >
                        <div
                            className="inner-content"
                            data-componentid={ `${ componentId }-inner-content` }
                            data-testid={ `${ testId }-inner-content` }
                        >
                            { image }
                        </div>
                    </Image>
                    { renderEditBubble() }
                </div>
            </div>
        );
    }

    if (image && isImageValidUrl) {
        return (
            <div className={ wrapperClasses }>
                <div className={ containerClasses }>
                    { renderCustomLabel() }
                    <Image
                        className={ imgElementClasses }
                        circular={ shape === "circular" }
                        onClick={ onClick }
                        onMouseOver={ onMouseOver }
                        onMouseOut={ onMouseOut }
                        data-componentid={ componentId }
                        data-testid={ testId }
                        { ...rest }
                    >
                        <div
                            className="inner-content"
                            data-componentid={ `${ componentId }-inner-content` }
                            data-testid={ `${ testId }-inner-content` }
                        >
                            { children }
                            <img className={ innerImageClasses } alt="avatar" src={ image as string }/>
                        </div>
                    </Image>
                    { renderEditBubble() }
                </div>
            </div>
        );
    }

    if (avatar && name) {
        return (
            <div className={ wrapperClasses }>
                <div className={ containerClasses }>
                    <Image
                        centered
                        className={ imgElementClasses }
                        verticalAlign="middle"
                        circular={ shape === "circular" }
                        onClick={ onClick }
                        onMouseOver={ onMouseOver }
                        onMouseOut={ onMouseOut }
                        data-componentid={ componentId }
                        data-testid={ testId }
                        { ...rest }
                    >
                        { children }
                        <span
                            className="initials"
                            data-componentid={ `${ componentId }-initials` }
                            data-testid={ `${ testId }-initials` }
                        >
                            { generateInitials() }
                        </span>
                    </Image>
                    { renderEditBubble() }
                </div>
            </div>
        );
    }

    return (
        <div className={ wrapperClasses }>
            <div className={ containerClasses }>
                <Image
                    centered
                    className={ imgElementClasses }
                    verticalAlign="middle"
                    circular={ shape === "circular" }
                    onClick={ onClick }
                    onMouseOver={ onMouseOver }
                    onMouseOut={ onMouseOut }
                    data-componentid={ componentId }
                    data-testid={ testId }
                    { ...rest }
                >
                    <div
                        className="content-wrapper"
                        data-componentid={ `${ componentId }-image-content-wrapper` }
                        data-testid={ `${ testId }-image-content-wrapper` }
                    >
                        { children }
                        <img
                            className={ innerImageClasses }
                            alt="avatar"
                            src={ defaultIcon }
                            data-componentid={ `${ componentId }-image` }
                            data-testid={ `${ testId }-image` }
                        />
                    </div>
                </Image>
                { renderEditBubble() }
            </div>
        </div>
    );
};

/**
 * Default prop types for the Avatar component.
 */
Avatar.defaultProps = {
    avatar: false,
    avatarInitialsLimit: 1,
    bordered: true,
    className: "",
    "data-componentid": "avatar",
    "data-testid": "avatar",
    editIconSize: "micro",
    initialsColor: "white",
    inline: true,
    isLoading: false,
    label: null,
    onClick: null,
    onMouseOut: null,
    onMouseOver: null,
    relaxed: false,
    shape: "circular",
    size: "mini",
    spaced: null,
    style: {},
    transparent: false
};
