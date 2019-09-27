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

import { AuthenticateSessionUtil, AuthenticateUserKeys } from "@wso2is/authenticate";
import classNames from "classnames";
import * as React from "react";
import { Container, Image, SemanticSIZES } from "semantic-ui-react";

/**
 * Proptypes for the user image component.
 */
interface UserImageProps {
    avatar?: boolean;
    bordered?: boolean;
    className?: string;
    floated?: "left" | "right";
    image?: React.ReactNode;
    inline?: boolean;
    relaxed?: boolean | "very";
    size?: SemanticSIZES;
    spaced?: "left" | "right";
    style?: object;
    transparent?: boolean;
}

/**
 * User image component.
 *
 * @param {React.PropsWithChildren<UserImageProps>} props - Props passed in to the user image component.
 * @return {JSX.Element}
 */
export const UserImage: React.FunctionComponent<UserImageProps> = (props): JSX.Element => {
    const {
        avatar,
        bordered,
        className,
        floated,
        image,
        inline,
        relaxed,
        size,
        spaced,
        style,
        transparent,
    } = props;
    const relaxLevel = (relaxed && relaxed === true) ? "" : relaxed;

    const classes = classNames({
        bordered,
        [`floated-${ floated }`]: floated,
        inline,
        relaxed,
        [`${ size }`]: size,
        [`spaced-${ spaced }`]: spaced,
        transparent,
        "user-avatar": avatar,
        [`${ relaxLevel }`]: relaxLevel,
    }, className);

    /**
     * Generates the initials for the avatar.
     *
     * @return {string}
     */
    const generateInitials = (): string => {
        return AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME).charAt(0).toUpperCase();
    };

    return (
        <>
            {
                image
                    ? (
                        <Image
                            src={ image }
                            size={ size }
                            bordered={ bordered }
                            floated={ floated }
                            circular
                        />
                    )
                    : null
            }
            {
                avatar
                    ? (
                        <Container
                            as={ Image }
                            className={ `user-image ${ classes }` }
                            size={ size }
                            bordered={ bordered }
                            floated={ floated }
                            verticalAlign="middle"
                            circular
                            centered
                            style={ style }
                        >
                            <span className="initials">{ generateInitials() }</span>
                        </Container>
                    )
                    : null
            }
        </>
    );
};

/**
 * Default proptypes for the User image component.
 */
UserImage.defaultProps = {
    bordered: true,
    className: "",
    inline: false,
    relaxed: false,
    size: "mini",
    spaced: null,
    style: {},
    transparent: false
};
