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
 * Class containing Attributes Management routing constants.
 */
export class RoutingConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    private constructor() { }

    /**
     * Claim routing paths.
     * @constant
     * @type {Map<string, string>}
     */
    public static readonly PATHS: Map<string, string> = new Map<string, string>()
        .set("CLAIM_DIALECTS", "/claim-dialects")
        .set("EXTERNAL_DIALECT_EDIT", "/edit-external-dialect/:id")
        .set("LOCAL_CLAIMS", "/local-claims")
        .set("LOCAL_CLAIMS_EDIT", "/edit-local-claims/:id")
}
