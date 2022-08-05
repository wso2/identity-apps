/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */
import { RolesInterface } from "@wso2is/core/models";
import { UserBasicInterface } from "../../../../features/core";

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

/**
 * Enum for invitation status types.
 *
 * @readonly
 * @enum {string}
 */
export enum InvitationStatus {
    ACCEPTED = "Accepted",
    PENDING = "Pending",
    EXPIRED = "Expired"
}

/**
 * Proptypes for the internal admin form response.
 */
export interface InternalAdminFormDataInterface {
    checkedUsers: UserBasicInterface[],
    selectedRoles: RolesInterface[]
}
