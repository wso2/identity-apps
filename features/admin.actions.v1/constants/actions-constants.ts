/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { AuthTypeDropdownOption, AuthenticationType } from "../models";

/**
 * Model for action type.
 * This class will hold the values for the URL path and the API path.
 */
class ActionType {
    urlPath: string;
    apiPath: string;

    constructor(path: string, name: string) {
        this.urlPath = path;
        this.apiPath = name;
    }

    getUrlPath(): string {
        return this.urlPath;
    }

    getApiPath(): string {
        return this.apiPath;
    }
}

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

    public static readonly ACTIONS_DIR: string = "actions";
    public static readonly TYPES_DIR: string = "types";
    public static readonly ACTIONS_ACTIVATE: string = "activate";
    public static readonly ACTIONS_DEACTIVATE: string = "deactivate";
    public static readonly ACTIVE_STATUS: string = "ACTIVE";
    public static readonly ACTION_UPDATE_ERROR_CODE: string = "ACTION-00001";

    public static readonly CREATE: string = "create";
    public static readonly UPDATE: string = "update";
    public static readonly DELETE: string = "delete";
    public static readonly FETCH: string = "fetch";
    public static readonly FETCH_TYPES: string = "typesFetch";

    public static readonly PRE_ISSUE_ACCESS_TOKEN_FROM_PATH: string = "pre-issue-access-token";
    public static readonly PRE_ISSUE_ACCESS_TOKEN_TYPE: string = "preIssueAccessToken";
    public static readonly PRE_UPDATE_PASSWORD_TYPE: string = "preUpdatePassword";
    public static readonly PRE_UPDATE_PROFILE_TYPE: string = "preUpdateProfile";
    public static readonly PRE_REGISTRATION_TYPE: string = "preRegistration";

    public static ErrorMessages: {
        ACTION_UPDATE_ERROR_CODE: IdentityAppsError;
    } = {
            ACTION_UPDATE_ERROR_CODE: new IdentityAppsError(
                ActionsConstants.ACTION_UPDATE_ERROR_CODE,
                "An error occurred while updating the Action.",
                "Error while updating the Action configurations",
                null
            )
        };

    public static ActionTypes: {
        PRE_ISSUE_ACCESS_TOKEN: ActionType;
        PRE_UPDATE_PASSWORD: ActionType;
        PRE_UPDATE_PROFILE: ActionType;
        PRE_REGISTRATION: ActionType;
    } = {
            PRE_ISSUE_ACCESS_TOKEN: new ActionType("pre-issue-access-token", "preIssueAccessToken"),
            PRE_REGISTRATION: new ActionType("pre-registration", "preRegistration"),
            PRE_UPDATE_PASSWORD: new ActionType("pre-update-password", "preUpdatePassword"),
            PRE_UPDATE_PROFILE: new ActionType("pre-update-profile", "preUpdateProfile")
        };

    public static readonly AUTH_TYPES: AuthTypeDropdownOption[] = [
        {
            key: AuthenticationType.NONE,
            text: "console:manage.features.actions.fields.authentication.types.none.name",
            value: AuthenticationType.NONE
        },
        {
            key: AuthenticationType.BASIC,
            text: "console:manage.features.actions.fields.authentication.types.basic.name",
            value: AuthenticationType.BASIC
        },
        {
            key: AuthenticationType.BEARER,
            text: "console:manage.features.actions.fields.authentication.types.bearer.name",
            value: AuthenticationType.BEARER
        },
        {
            key: AuthenticationType.API_KEY,
            text: "console:manage.features.actions.fields.authentication.types.apiKey.name",
            value: AuthenticationType.API_KEY
        }
    ];
}
