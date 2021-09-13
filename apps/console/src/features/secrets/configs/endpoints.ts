/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { SecretsManagementEndpoints } from "../models/endpoints";

/**
 * Get the resource endpoints for the IDP Management feature.
 *
 * @param {string} serverHost - Server Host.
 * @return {IDPResourceEndpointsInterface}
 */
export const getSecretsManagementEndpoints = (serverHost: string): SecretsManagementEndpoints => {
    return {
        createSecretType: `${ serverHost }/api/server/v1/secret-type`,
        getSecretType: `${ serverHost }/api/server/v1/secret-type`,
        updateSecretType: `${ serverHost }/api/server/v1/secret-type`,
        deleteSecretType: `${ serverHost }/api/server/v1/secret-type`,
        createSecret: `${ serverHost }/api/server/v1/secrets`,
        updateSecret: `${ serverHost }/api/server/v1/secrets`,
        deleteSecret: `${ serverHost }/api/server/v1/secrets`,
        getSecret: `${ serverHost }/api/server/v1/secrets`,
        getSecretList: `${ serverHost }/api/server/v1/secrets`
    };
};
