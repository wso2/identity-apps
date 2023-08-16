/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useReducer } from "react";
import { useGetUpdatedFeatureGateConfig } from "../../../configs/feature-gate";
import { FeatureGateAction, FeatureGateActionTypes } from "../actions/feature-gate";
import { featureGateConfig } from "../configs/feature-gate";
import { FeatureGateContext } from "../context/feature-gate";
import { FeatureGateInterface } from "../models/feature-gate";

export const featureGateReducer = (
    state: FeatureGateInterface,
    action: FeatureGateAction
): FeatureGateInterface => {
    switch (action.type) {
        case FeatureGateActionTypes.SET_FEATURE_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export const FeatureGateProvider = (props: React.PropsWithChildren<any>): React.ReactElement => {
    const { children } = props;
    const defaultFeatureGateConfig: FeatureGateInterface  = { ...featureGateConfig };
    const [ features, dispatch ] = useReducer(featureGateReducer, defaultFeatureGateConfig);

    const updatedFeatureGateConfig: FeatureGateInterface = useGetUpdatedFeatureGateConfig();

    useEffect (() => {
        if (JSON.stringify(features) !== JSON.stringify(updatedFeatureGateConfig)) {
            dispatch({ payload: updatedFeatureGateConfig, type: FeatureGateActionTypes.SET_FEATURE_STATE });
        }
    }, [ updatedFeatureGateConfig ]);

    return (<FeatureGateContext.Provider value={ {  dispatch, features } }>{ children }</FeatureGateContext.Provider>);
};
