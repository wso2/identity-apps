/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
 * @param props - Props injected in to the app avatar component.
 *
 * @returns the App Avatar component
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
