/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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
 * Class containing multi factor authentication constants.
 */
export class MultiFactorAuthenticationConstants {

    // API errors
    public static readonly MFA_BACKUP_CODE_RETRIEVE_ERROR: string = "Received an invalid status " + 
        "code while retrieving backup codes.";

    public static readonly MFA_BACKUP_CODE_INIT_ERROR: string = "Received an invalid status " + 
        "code while initializing backup codes.";

    public static readonly MFA_BACKUP_CODE_REFRESH_ERROR: string = "Received an invalid status " + 
        "code while refreshing backup codes.";
    
    public static readonly MFA_BACKUP_CODE_DELETE_ERROR: string = "Received an invalid status " + 
        "code while deleting backup codes.";

    public static readonly MFA_ENABLED_AUTHENTICATOR_RETREIVE_ERROR: string = "Received an invalid status " + 
        "code while retreiving enabled authenticators.";

    public static readonly MFA_ENABLED_AUTHENTICATOR_UPDATE_ERROR: string = "Received an invalid status " + 
        "code while updating enabled authenticators.";
}
