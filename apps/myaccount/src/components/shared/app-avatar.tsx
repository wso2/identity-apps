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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent } from "react";
import { Avatar, AvatarProps } from "./avatar";
import { getAppIconBackgrounds } from "../../configs";

/**
 * Prop types for the App Avatar component.
 */
export interface AppAvatarProps extends AvatarProps, TestableComponentInterface {
    onCard?: boolean;
}

/**
 * App Avatar component.
 *
 * @param {AvatarProps} props - Props injected in to the app avatar component.
 * @return {JSX.Element}
 */
export const AppAvatar: FunctionComponent<AppAvatarProps> = (props: AppAvatarProps): JSX.Element => {

    const {
        image,
        className,
        name,
        onCard,
        ["data-testid"]: testId
    } = props;

    const appAvatarClassNames = classNames({
        ["bg-image"]: !onCard,
        ["default-app-icon"]: onCard
    }, className);

    if (image) {
        return (
            <Avatar
                data-testid={ testId }
                avatarType="app"
                avatar
                className="with-app-image"
                image={ image }
                bordered={ false }
                { ...props }
            />
        );
    }

    return (
        <Avatar
            data-testid={ testId }
            avatarType="app"
            className={ appAvatarClassNames }
            style={ onCard ? {} : { backgroundImage: `url(${ getAppIconBackgrounds().orange })` } }
            bordered
            avatar
            name={ name }
            { ...props }
        />
    );
};

/**
 * Default proptypes for the App avatar component.
 * See type definitions in {@link AppAvatarProps}
 */
AppAvatar.defaultProps = {
    "data-testid": "app-avatar",
    image: null,
    name: null,
    onCard: false
};
