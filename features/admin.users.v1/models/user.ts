/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { UserRoleInterface } from "@wso2is/admin.core.v1/models/users";
import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import { GroupsInterface, GroupsMemberInterface } from "@wso2is/admin.groups.v1/models/groups";
import { LinkInterface, MultiValueAttributeInterface, NameInterface, RolesInterface } from "@wso2is/core/models";
import React, { ReactElement } from "react";
import { BulkImportResponseOperationTypes, BulkUserImportStatus } from "../constants";

/**
 * Captures meta details of the user.
 */
export interface UserMetaInterface {
    created: string;
    location: string;
    lastModified: string;
    resourceType: string;
}

/**
 *  Captures the basic details of the user.
 */
export interface UserBasicInterface {
    /**
     * Display name of the user.
     */
    displayName?: string;
    /**
     * ID of the user.
     */
    id?: string;
    /**
     * Username of the user.
     */
    userName: string;
    /**
     * Emails of the user.
     */
    emails?: string[] | MultiValueAttributeInterface[];
    /**
     * Name of the user.
     */
    name?: NameInterface;
    /**
     * Meta information of the user.
     */
    meta?: UserMetaInterface;
    /**
     * Profile URL of the user.
     */
    profileUrl?: string;
    /**
     * Groups of the user.
     */
    groups?: GroupsMemberInterface[];
}

/**
 *  Captures application list properties.
 */
export interface UserListInterface {
    /**
     * Number of results that match the listing operation.
     */
    totalResults?: number;
    /**
     * Index of the first element of the page, which will be equal to offset + 1.
     */
    startIndex?: number;
    /**
     * Number of elements in the returned page.
     */
    itemsPerPage?: number;
    /**
     * Set of applications.
     */
    Resources?: UserBasicInterface[];
    /**
     * Useful links for pagination.
     */
    links?: LinkInterface[];
}

/**
 *  Captures Internal user list properties.
 */
export interface InternalAdminUserListInterface {
    /**
     * Number of results that match the listing operation.
     */
    totalResults?: number;
    /**
     * Index of the first element of the page, which will be equal to offset + 1.
     */
    startIndex?: number;
    /**
     * Number of elements in the returned page.
     */
    itemsPerPage?: number;
    /**
     * Set of applications.
     */
    Resources?: UserRoleInterface[];
    /**
     * Useful links for pagination.
     */
    links?: LinkInterface[];
}

/**
 * Basic user details for add user wizard
 */
export interface BasicUserDetailsInterface {
    userName?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    domain?: string;
    newPassword?: string;
    confirmPassword?: string;
    passwordOption?: string;
}

/**
 *  User details for add user wizard.
 */
export interface AddUserWizardStateInterface {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    profileUrl: string;
    domain: string;
    newPassword: string;
    confirmPassword: string;
    passwordOption: string;
    groups: GroupsInterface[];
    roles: RolesInterface[];
    emails?: (EmailsInterface | string | MultiValueAttributeInterface)[];
}

/**
 * Interface for emails in user details
 */
export interface EmailsInterface {
    primary: boolean;
    value: string;
}

/**
 * Captures user details
 */
export interface UserDetailsInterface {
    emails: (EmailsInterface | string | MultiValueAttributeInterface)[];
    name?: NameInterface;
    userName: string;
    password?: string;
    /*
     * This wildcard declaration is done due to the issue of
     * property name in an interface must directly refer to a built-in literal in ts.
     * issue - https://github.com/Microsoft/TypeScript/issues/21000
     */
    [key: string]: {
        askPassword: string;
    } | any;
    profileUrl?: string;
}

/**
 * The following function creates an empty user details object
 */
export const createEmptyUserDetails = (): UserDetailsInterface => ({
    emails: [ {
        primary: false,
        value: ""
    } ],
    name: {
        familyName: "",
        givenName: ""
    },
    password: "",
    profileUrl: "",
    [SCIMConfigs.scim.systemSchema]: {
        askPassword: ""
    },
    userName: ""
});

/**
 * The following function creates an empty add user wizard object
 */
export const createEmptyUserBasicWizard = (): AddUserWizardStateInterface => ({
    confirmPassword: "",
    domain: "",
    email: "",
    firstName: "",
    groups: [],
    lastName: "",
    newPassword: "",
    passwordOption: "",
    profileUrl: "",
    roles: [],
    userName: ""
});

/**
 * Interface for User Sessions response.
 */
export interface UserSessionsInterface {
    /**
     * Id of the user.
     * @example 00000001
     */
    userId: string;
    /**
     * List of active sessions.
     */
    sessions: UserSessionInterface[];
}

/**
 * Interface for a User Session.
 */
export interface UserSessionInterface {
    /**
     * List of applications in the session.
     */
    applications: ApplicationSessionInterface[];
    /**
     * User agent of the session.
     * @example Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1
     */
    userAgent: string;
    /**
     * IP address of the session.
     * @example 172.95.192.63
     */
    ip: string;
    /**
     * Login time of the session.
     * @example 1560412617
     */
    loginTime: string;
    /**
     * Last access time of the session.
     * @example 1560416196
     */
    lastAccessTime: string;
    /**
     * ID of the session.
     * @example 8d9806d1-4efc-483e-a96a-a0fa77d4328b
     */
    id: string;
}

/**
 * Interface for the Application Session.
 */
export interface ApplicationSessionInterface {
    /**
     *  Username of the logged in user for the application.
     *  @example apiuser01
     */
    subject: string;
    /**
     * Name of the application.
     * @example sampleApp
     */
    appName: string;
    /**
     * ID of the application.
     * @example 012
     */
    appId: string;
}

/**
 * Interface for the Account Configurations.
 */
export interface AccountConfigSettingsInterface {
    accountDisable: string;
    accountLock: string;
    forcePasswordReset: string;
    isEmailVerificationEnabled?: string;
    isMobileVerificationEnabled?: string;
    isMobileVerificationByPrivilegeUserEnabled?: string;
}

/**
 * Interface for the User Schema Sub Value.
 */
export interface SubValueInterface {
    formatted?: string;
    value?: string;
}

/**
 * Interface for the Schema Attribute Value.
 */
export interface SchemaAttributeValueInterface {
    type?: string;
    value?: string | string[];
}

/**
 * Interface for the wizard step.
 */
export interface WizardStepInterface {
    content: ReactElement;
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    title: string;
    name?: string;
}

/**
 * Interface for the role and group data.
 */
export interface PayloadInterface {
    Operations: {
        op: string;
        value: {
          users?: {
            display: string;
            value: string;
          }[];
          members?: {
            display: string;
            value: string;
          }[];
        };
      }[];
      schemas: string[];
}

/**
 * Interface for the SCIM2 Roles V3 API payload.
 */
export interface PayloadRolesV3Interface {
    Operations: {
        op: string;
        value: {
            display: string;
            value: string;
        }[];
      }[];
      schemas: string[];
}

/**
 * Interface for the bulk user import operation response.
 */
export interface BulkUserImportOperationResponse {
    resourceIdentifier: string;
    status: string;
    message: string;
    statusCode: BulkUserImportStatus;
    operationType?: BulkImportResponseOperationTypes;
}

/**
 * Interface for the bulk user import operation summary.
 */
export interface BulkResponseSummary {
    successUserCreation: number;
    failedUserCreation: number;
    successUserAssignment: number;
    failedUserAssignment: number;
}

export interface PatchBulkUserDataInterface {
    schemas: string[];
    Operations: PatchUserOpInterface[];
    failOnErrors?: number;
}

export interface PatchUserOpInterface {
    data: {
        Operations: (PatchUserRemoveOpInterface | PatchUserAddOpInterface)[];
    };
    method: string;
    path: string;
}

export interface PatchUserRemoveOpInterface {
    op: string;
    path: string;
}

export interface PatchUserAddOpInterface {
    op: string;
    value: {
        users: { value: string }[]
    }
}

/**
 * Interface for the user patch operation value.
 */
export type PatchUserOperationValue = Record<string, string
    | Record<string, string | string[]>
    | Array<string | Record<string, string>>
    | Array<Record<string, string>>>;

/**
 * Enum for the multiple invites modes.
 *
 */
export enum MultipleInviteMode {
    MANUAL = "manualConfiguration",
    META_FILE = "metadataFile"
}

/**
 * Multiple Invites mode display name mapping.
 */
export const MultipleInvitesDisplayNames: { manualConfiguration: string; metadataFile: string; } = {
    [ MultipleInviteMode.MANUAL ]: "Manual",
    [ MultipleInviteMode.META_FILE ]: "File Based"
};

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
 * Interface for the resend code request payload.
 */
export interface ResendCodeRequestData {
    user: {
        username: string;
        realm: string;
    };
    properties: Array<{
        key: string;
        value: string;
    }>;
}

/**
 * Enum for Invite User Status.
 *
 * @readonly
 */
export enum InviteUserStatus {
    PENDING = "PENDING",
    EXPIRED = "EXPIRED"
}

/**
 * Enum for invitation status types.
 *
 * @readonly
 */
export enum InvitationStatus {
    ACCEPTED = "Accepted",
    PENDING = "Pending",
    EXPIRED = "Expired"
}
