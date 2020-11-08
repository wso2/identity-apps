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

    public static readonly REMOTE_DEPLOYER_TYPE = "SP";

    public static readonly REMOTE_REPOSITORY_TYPE = "GIT";

    // API errors
    public static readonly CREATE_REPO_CONFIG_INVALID_STATUS_CODE_ERROR: string = "Received an invalid status " +
        "code creating a remote repo config.";
    public static readonly CREATE_REPO_CONFIG_CREATE_ERROR: string = "Error occured while creating a repo config.";
}
