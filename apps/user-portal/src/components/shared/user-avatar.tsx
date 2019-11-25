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

import React, { FunctionComponent } from "react";
import { resolveUserDisplayName } from "../../helpers";
import { AuthStateInterface } from "../../models";
import { Avatar, AvatarProps } from "./avatar";

/**
 * Prop types for the user avatar component.
 */
interface UserAvatarProps extends AvatarProps {
    authState?: AuthStateInterface;
}

/**
 * User Avatar component.
 *
 * @param {UserAvatarProps} props - Props injected in to the user avatar component.
 * @return {JSX.Element}
 */
export const UserAvatar: FunctionComponent<UserAvatarProps> = (props: UserAvatarProps): JSX.Element => {
    const { authState, name } = props;

    if (authState && authState.profileInfo && authState.profileInfo.userimage) {
        return (
            <Avatar
                avatarType="user"
                bordered
                image={ authState.profileInfo && authState.profileInfo.userimage }
                { ...props }
            />
        );
    }

    return (
        <Avatar
            avatarType="user"
            bordered
            avatar
            name={ authState ? resolveUserDisplayName(authState) : name }
            { ...props }
        />
    );
};

/**
 * Default prop types for the User avatar component.
 */
UserAvatar.defaultProps = {
    authState: null,
    name: null
};
