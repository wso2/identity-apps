/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
 * Endpoints interface for the Secrets Management feature.
 * This basically a reference interface for endpoints and nothing else.
 */
export interface SecretsManagementEndpoints {
    /**
     * Secret Type Management API endpoints.
     */
    createSecretType: string;
    updateSecretType: string;
    getSecretType: string;
    deleteSecretType: string;
    /**
     * Secret Management API endpoints.
     */
    createSecret: string;
    updateSecret: string;
    getSecret: string;
    deleteSecret: string;
    getSecretList: string;
}
