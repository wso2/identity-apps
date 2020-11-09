/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

/**
 * Class containing constants required for remote fetch feature.
 */
export class RemoteFetchConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    // API errors
    public static readonly GET_REPO_CONFIG_LIST_INVALID_STATUS_CODE_ERROR: string = "Received an invalid status " +
        "code while fetching remote repo config list.";
    public static readonly GET_REPO_CONFIG_LIST_ERROR: string = "Error occurred while fetching the repo config list.";
    public static readonly TRIGGER_CONFIG_DEPLOYMENT_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while deploying the remote repo config.";
    public static readonly TRIGGER_CONFIG_DEPLOYMENT_ERROR: string = "Error occurred while deploying the remote " +
        "repo config.";
    public static readonly GET_CONFIG_DEPLOYMENT_DETAILS_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching remote repo config deployment details.";
    public static readonly GET_CONFIG_DEPLOYMENT_DETAILS_ERROR: string = "Error occurred while fetching the remote " +
        "repo config deployment details.";
    public static readonly UPDATE_REPO_CONFIG_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while updating remote repo config.";
    public static readonly UPDATE_REPO_CONFIG_ERROR: string = "Error occurred while updating the remote " +
        "repo config.";
    public static readonly DELETE_REPO_CONFIG_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while deleting remote repo config.";
    public static readonly DELETE_REPO_CONFIG_ERROR: string = "Error occurred while deleting the remote " +
        "repo config.";
    public static readonly CREATE_REPO_CONFIG_INVALID_STATUS_CODE_ERROR: string = "Received an invalid status " +
        "code while creating a remote repo config.";
    public static readonly CREATE_REPO_CONFIG_CREATE_ERROR: string = "Error occurred while creating a repo config.";
    public static readonly GET_REPO_CONFIG_INVALID_STATUS_CODE_ERROR: string = "Received an invalid status " +
        "code while fetching remote repo config details.";
    public static readonly GET_REPO_CONFIG_ERROR: string = "Error occurred while fetching the repo config.";
}
