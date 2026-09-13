/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

class FeatureGateConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() {}

    /**
     * Tail of the feature gate "all features" endpoint. Used to locate the request's SWR
     * cache entry when it needs to be revalidated.
     */
    public static readonly ALL_FEATURES_ENDPOINT_SUFFIX: string = "/allFeatures";

    public static readonly SAAS_FEATURES_IDENTIFIER: string = "console.saasFeatures";
    public static readonly PREVIEW_FEATURES_IDENTIFIER: string = "console.previewFeatures";
}

export default FeatureGateConstants;
