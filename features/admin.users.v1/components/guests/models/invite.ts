/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { GroupsInterface } from "@wso2is/admin.groups.v1";
import { ReactNode } from "react";
import { InviteUserStatus } from "../../../models/user";

/**
  * Enum for role types.
  */
export enum RoleType {
    EVERYONE = "everyone",
    SYSTEM = "system",
    SELFSIGNUP = "selfsignup"
}

/**
  * Interface to store data for create group api.
  */
export interface UserInviteInterface {
    id?: string;
    roles?: string[];
    email?: string;
    status?: InviteUserStatus;
    expiredAt?: string;
    username?: string;
}

/**
 * Interface to represent invite for parent org user.
 */
export interface ParentOrgUserInviteInterface {
    id?: string;
    groups?: string[];
    email?: string;
    status?: InviteUserStatus;
    expiredAt?: string;
    usernames?: string[];
}

/**
 * Interface to represent invite for administrator.
 */
export interface AdministratorInviteInterface {
    id?: string;
    roles?: string[];
    email?: string;
    status?: InviteUserStatus;
    expiredAt?: string;
    usernames?: string[];
}

/**
 * Interface to represent the result of an invitation for a parent org user.
 */
export interface ParentOrgUserInvitationResult {
    username: string;
    result: {
        status: ParentOrgUserInviteResultStatus
        errorCode?: string;
        errorMessage?: string;
        errorDescription?: string;
    }
}

/**
 * Enum for the result status of a parent org user invite.
 */
export enum ParentOrgUserInviteResultStatus {
    SUCCESS = "Successful",
    FAIL = "Failed"
}

/**
 * Interface to store invitations list.
 */
export interface InvitationsInterface {
    invitations?: UserInviteInterface[];
}

/**
 * Interface to store data for create group api.
 */
export interface UserInviteInterface {
    id?: string;
    roles?: string[];
    email?: string;
    status?: InviteUserStatus;
    username?: string;
}

export interface GroupsAutoCompleteOption {
    key: string;
    label: ReactNode;
    group: GroupsInterface;
}

export interface InviteParentOrgUserFormValuesInterface {
    username: string[];
    groups: GroupsAutoCompleteOption[];
}

export enum ParentOrgUserInviteErrorCode {
    ERROR_CODE_USER_NOT_FOUND = "OUI-10011",
    ERROR_CODE_ACTIVE_INVITATION_EXISTS = "OUI-10018",
    ERROR_CODE_INVITED_USER_EMAIL_NOT_FOUND = "OUI-10030",
    ERROR_CODE_USER_ALREADY_EXISTS_INVITED_ORGANIZATION = "OUI-10032"
}
