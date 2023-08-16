/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FeatureGateInterface } from "../../models/feature-gate";
import { FeatureGateActionTypes, SetTierFeaturesActionInterface } from "../feature-gate";

/**
 * This action sets features of an organization in the redux store based on tier information.
 *
 * @param organization - An organization object.
 *
 * @returns - A set of features for the organization.
 */
export const setTierFeatuers = (featureGate: FeatureGateInterface): SetTierFeaturesActionInterface => {
    return {
        payload: featureGate,
        type: FeatureGateActionTypes.SET_FEATURE_STATE
    };
};
