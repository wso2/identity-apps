/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
