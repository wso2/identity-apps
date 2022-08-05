/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the License); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * AS IS BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Interface to store data for create group api.
 */
export interface UserInviteInterface {
    id?: string;
    roles?: string[];
    email: string;
    status?: InviteUserStatus;
}

/**
 * Enum for Invite User Status.
 *
 * @readonly
 * @enum {string}
 */
export enum InviteUserStatus {
    PENDING = "PENDING",
    EXPIRED = "EXPIRED"
}

export interface InviteValidationInterface {
    email: string;
    code: string;
}

export interface InviteValidationResponseInterface {
    id?: string;
    email?: string;
    tenant?: string;
    roles?: string[];
    status: InviteValidationStatus;
}

/**
 * Enum for Invite Validation Status.
 *
 * @readonly
 * @enum {string}
 */
export enum InviteValidationStatus {
    ACCEPTED = "ACCEPTED",
    EXPIRED = "EXPIRED",
    REJECTED = "REJECTED"
}

export interface InviteResourceEndpointsInterface {
    userEndpoint: string;
    resendEndpoint: string;
    inviteEndpoint: string;
}
