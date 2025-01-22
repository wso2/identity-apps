/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsError } from "@wso2is/core/errors";
import { DropdownChild } from "@wso2is/forms";
import ActionType from "../models/action-type";
import {
    AuthenticationType,
    AuthenticationTypeDropdownOption,
    PasswordFormat
} from "../models/actions";

/**
 * Class containing Actions constants.
 */
export class ActionsConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    public static readonly ACTION_NAME_REGEX: RegExp = /^[a-zA-Z0-9-_][a-zA-Z0-9-_ ]*[a-zA-Z0-9-_]$/;
    public static readonly API_HEADER_REGEX: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9-.]+$/;

    public static readonly ACTIONS_DIR: string = "actions";
    public static readonly TYPES_DIR: string = "types";
    public static readonly ACTIVATE: string = "activate";
    public static readonly DEACTIVATE: string = "deactivate";
    public static readonly ACTIVE_STATUS: string = "ACTIVE";

    public static readonly CREATE_ACTION_ERROR_CODE: string = "ACTION-00001";
    public static readonly UPDATE_ACTION_ERROR_CODE: string = "ACTION-00002";
    public static readonly DELETE_ACTION_ERROR_CODE: string = "ACTION-00003";

    public static readonly CREATE: string = "create";
    public static readonly UPDATE: string = "update";
    public static readonly DELETE: string = "delete";
    public static readonly FETCH: string = "fetch";
    public static readonly FETCH_TYPES: string = "typesFetch";
    public static readonly DELETE_CERTIFICATE: string = "certificate.delete";
    public static readonly ADD_CERTIFICATE: string = "certificate.add";
    public static readonly CHANGE_CERTIFICATE: string = "certificate.change";

    public static readonly PRE_ISSUE_ACCESS_TOKEN_URL_PATH: string = "pre-issue-access-token";
    public static readonly PRE_UPDATE_PASSWORD_URL_PATH: string = "pre-update-password";
    public static readonly PRE_UPDATE_PROFILE_URL_PATH: string = "pre-update-profile";
    public static readonly PRE_REGISTRATION_URL_PATH: string = "pre-registration";

    public static readonly PRE_ISSUE_ACCESS_TOKEN_API_PATH: string = "preIssueAccessToken";
    public static readonly PRE_UPDATE_PASSWORD_API_PATH: string = "preUpdatePassword";
    public static readonly PRE_UPDATE_PROFILE_API_PATH: string = "preUpdateProfile";
    public static readonly PRE_REGISTRATION_API_PATH: string = "preRegistration";

    public static readonly ERROR_MESSAGES: {
        CREATE_ACTION_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
        DELETE_ACTION_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
        UPDATE_ACTION_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
    } = {
            CREATE_ACTION_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
                ActionsConstants.CREATE_ACTION_ERROR_CODE,
                "An error occurred while creating the action.",
                "Error while creating the action.",
                null
            ),
            DELETE_ACTION_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
                ActionsConstants.DELETE_ACTION_ERROR_CODE,
                "An error occurred while deleting the action.",
                "Error while deleting the action",
                null
            ),
            UPDATE_ACTION_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
                ActionsConstants.UPDATE_ACTION_ERROR_CODE,
                "An error occurred while updating the action.",
                "Error while updating the action",
                null
            )
        };

    public static readonly ACTION_TYPES: {
        PRE_ISSUE_ACCESS_TOKEN: ActionType;
        PRE_UPDATE_PASSWORD: ActionType;
        PRE_UPDATE_PROFILE: ActionType;
        PRE_REGISTRATION: ActionType;
    } = {
            PRE_ISSUE_ACCESS_TOKEN: new ActionType(
                ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_URL_PATH, ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_API_PATH),
            PRE_REGISTRATION: new ActionType(
                ActionsConstants.PRE_REGISTRATION_URL_PATH, ActionsConstants.PRE_REGISTRATION_API_PATH),
            PRE_UPDATE_PASSWORD: new ActionType(
                ActionsConstants.PRE_UPDATE_PASSWORD_URL_PATH, ActionsConstants.PRE_UPDATE_PASSWORD_API_PATH),
            PRE_UPDATE_PROFILE: new ActionType(
                ActionsConstants.PRE_UPDATE_PROFILE_URL_PATH, ActionsConstants.PRE_UPDATE_PROFILE_API_PATH)
        };

    public static readonly AUTH_TYPES: AuthenticationTypeDropdownOption[] = [
        {
            key: AuthenticationType.NONE,
            text: "actions:fields.authentication.types.none.name",
            value: AuthenticationType.NONE
        },
        {
            key: AuthenticationType.BASIC,
            text: "actions:fields.authentication.types.basic.name",
            value: AuthenticationType.BASIC
        },
        {
            key: AuthenticationType.BEARER,
            text: "actions:fields.authentication.types.bearer.name",
            value: AuthenticationType.BEARER
        },
        {
            key: AuthenticationType.API_KEY,
            text: "actions:fields.authentication.types.apiKey.name",
            value: AuthenticationType.API_KEY
        }
    ];

    public static readonly PASSWORD_SHARING_TYPES: DropdownChild[] = [
        {
            key: PasswordFormat.SHA_256_HASHED,
            text: "SHA 256 Hashed",
            value: PasswordFormat.SHA_256_HASHED
        },
        {
            key: PasswordFormat.PLAIN_TEXT,
            text: "Plain Text",
            value: PasswordFormat.PLAIN_TEXT
        }
    ];
}
