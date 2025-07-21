/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Fab from "@oxygen-ui/react/Fab";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Position } from "@xyflow/react";
import React, { FunctionComponent, ReactElement, memo } from "react";
import "./user-account-unlock.scss";

/**
 * Props interface of {@link UserUnlockIcon}
 */
interface UserUnlockIconPropsInterface extends IdentifiableComponentInterface {
    /**
     * Height of the icon.
     */
    height?: string | number;
    /**
     * Width of the icon.
     */
    width?: string | number;
}

/**
 * UserUnlockIcon component.
 *
 * @param props - Props injected to the component.
 * @returns UserUnlockIcon component.
 */
const UserUnlockIcon: FunctionComponent<UserUnlockIconPropsInterface> = ({
    height = "24",
    width = "24",
    ["data-componentid"]: componentId = "user-unlock-icon"
}: UserUnlockIconPropsInterface): ReactElement => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            height={ height }
            width={ width }
            data-componentid={ componentId }
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path
                    d={ "M16.584 6C15.8124 4.2341 14.0503 3 12 3C9.23858 3 7 5.23858 7 8V10.0288M12 " +
                         "14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C16.8802 10 17.7202 10 " +
                         "18.362 10.327C18.9265 10.6146 19.3854 11.0735 19.673 11.638C20 12.2798 20 " +
                         "13.1198 20 14.8V16.2C20 17.8802 20 18.7202 19.673 19.362C19.3854 19.9265 " +
                         "18.9265 20.3854 18.362 20.673C17.7202 21 16.8802 21 15.2 21H8.8C7.11984 21 " +
                         "6.27976 21 5.63803 20.673C5.07354 20.3854 4.6146 19.9265 4.32698 19.362C4 " +
                         "18.7202 4 17.8802 4 16.2V14.8C4 13.1198 4 12.2798 4.32698 11.638C4.6146 " +
                         "11.0735 5.07354 10.6146 5.63803 10.327C5.99429 10.1455 6.41168 10.0647 7 10.0288Z" }
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    );
};

/**
 * Props interface of {@link UserAccountUnlockNode}
 */
export type UserAccountUnlockNodePropsInterface = IdentifiableComponentInterface;

/**
 * UserAccountUnlockNode component.
 *
 * @param props - Props injected to the component.
 * @returns UserAccountUnlockNode component.
 */
const UserAccountUnlockNode: FunctionComponent<UserAccountUnlockNodePropsInterface> = memo(({
    ["data-componentid"]: componentId = "user-account-unlock"
}: UserAccountUnlockNodePropsInterface): ReactElement => {
    return (
        <div data-componentid={ componentId }>
            <Fab
                aria-label="user-account-unlock"
                className="user-account-unlock"
                variant="circular"
                data-componentid={ componentId }
            >
                <UserUnlockIcon
                    height="30"
                    width="30"
                    data-componentid={ `${componentId}-icon` }
                />
            </Fab>
            <Handle type="target" position={ Position.Left } />
        </div>
    );
}, () => true);

export default UserAccountUnlockNode;
