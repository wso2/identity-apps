/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { FeatureGateAction } from "../actions/feature-gate";

export interface FeatureGateShowInterface {
    /**
     * Permissions needed to render child elements
     */
    ifAllowed: string;
}

export interface FeatureGateContextInterface {
    features: FeatureGateInterface;
    dispatch: React.Dispatch<FeatureGateAction>;
}

export interface FeatureGateEndpoints {
    allFeatures: string,
    allowedFeatures: string
}

export interface AllFeatureInterface {
    featureUUID: string,
    featureName: string,
    featureDescription: string,
    featureStatus: string,
    featureTags: string[],
    featureIdentifier: string
}

export enum FeatureStatus {
    DEFAULT = "ENABLED",
    ENABLED = "ENABLED",
    DISABLED = "DISABLED",
    HIDDEN = "HIDDEN",
    BLOCKED = "BLOCKED"
}

export enum FeatureTags {
    PREMIUM = "premium",
}

export interface FeatureGateInterface {
    console:  {
        application: {
            signIn: {
                adaptiveAuth : {
                    status: FeatureStatus
                    tags : string []
                },
                status: FeatureStatus
            },
            status: FeatureStatus
        },
        saasFeatures: {
            status: FeatureStatus
        },
        status: FeatureStatus
    }
}
