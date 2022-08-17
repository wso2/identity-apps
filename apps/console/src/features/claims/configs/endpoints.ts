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

import { ClaimResourceEndpointsInterface } from "../models";

/**
 * Get the resource endpoints for the Claim Management feature.
 *
 * @param {string} serverHost - Server Host.
 * @param {string }serverHostWithOrgPath - Server Host with the Organization Path.
 * @return {ClaimResourceEndpointsInterface}
 */
export const getClaimResourceEndpoints = (
    serverHost: string
): ClaimResourceEndpointsInterface => {
    return {
        claims: `${ serverHost }/api/server/v1/claim-dialects`,
        externalClaims:`${ serverHost }/api/server/v1/claim-dialects/{0}/claims`,
        localClaims: `${ serverHost }/api/server/v1/claim-dialects/local/claims`
    };
};
