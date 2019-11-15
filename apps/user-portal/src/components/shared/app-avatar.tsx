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
import * as ColorConstants from "../../constants/colors";
import { Avatar, AvatarProps } from "./avatar";

/**
 * App Avatar component.
 *
 * @param {AvatarProps} props - Props injected in to the app avatar component.
 * @return {JSX.Element}
 */
export const AppAvatar: FunctionComponent<AvatarProps> = (props: AvatarProps): JSX.Element => {
    const { image, name } = props;

    /**
     * Generates a color based on the ASCII values of
     * the characters in the App name.
     *
     * @return {string}
     */
    const generateBackgroundColor = (): string => {
        const MULTIPLIER: number = 5;
        let asciiValue: number = 0;
        let count: number = 0;

        for (const letter of name) {
            if (letter.toUpperCase().charCodeAt(0) < 100) {
                count++;
                asciiValue += letter.toUpperCase().charCodeAt(0);
            }
        }

        const generatedValue: number = Math.ceil((asciiValue / count) / MULTIPLIER) * MULTIPLIER;
        const colorArray: string[] = [];

        for (const [key, value] of Object.entries(ColorConstants)) {
            colorArray.push(value);
        }

        let checker: number = MULTIPLIER;
        let assignedColorIndex: number = colorArray.length;
        for (let i = 0; i <= 100; i++) {
            if (generatedValue < checker) {
                return colorArray[assignedColorIndex];
            }
            if (i === checker) {
                checker += MULTIPLIER;
                assignedColorIndex--;
            }
        }

        return colorArray[0];
    };

    if (image) {
        return (
            <Avatar
                avatarType="app"
                bordered
                image={ image }
                { ...props }
            />
        );
    }

    return (
        <Avatar
            avatarType="app"
            style={ { background: generateBackgroundColor() } }
            bordered
            avatar
            name={ name }
            { ...props }
        />
    );
};

/**
 * Default proptypes for the App avatar component.
 */
AppAvatar.defaultProps = {
    image: null,
    name: null
};
