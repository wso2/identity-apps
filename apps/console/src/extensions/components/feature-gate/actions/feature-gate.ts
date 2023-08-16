/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FeatureGateInterface } from "../models/feature-gate";

export enum FeatureGateActionTypes {
    SET_FEATURE_STATE = "SET_FEATURE_STATE",
}

export interface SetTierFeaturesActionInterface {
    payload: FeatureGateInterface; // we rely on this payload and update all actions bases
    type: FeatureGateActionTypes.SET_FEATURE_STATE;
}

export type FeatureGateAction = SetTierFeaturesActionInterface
