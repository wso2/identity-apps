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

import React, { useReducer, useEffect, useState } from "react";
import { FeatureGateInterface } from "../models/feature-gate";
import { useAuthContext } from "@asgardeo/auth-react";
import { FeatureGateAction, FeatureGateActionTypes } from "../actions/feature-gate";
import { useGetUpdatedFeatureGateConfig } from "apps/console/src/extensions/configs/feature-gate";
import { FeatureGateContext } from "../context/feature-gate";

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
    const { getDecodedIDToken } = useAuthContext();
    const { state } = useAuthContext();
    const [orgId, setOrgId] = useState<string>();

    useEffect(() => {
      getDecodedIDToken().then((response)=>{
        const org_id = response.org_id;
        setOrgId(org_id);
      });
    }, [state]);

    const updatedFeatureGateConfig  = useGetUpdatedFeatureGateConfig(orgId);
    const [ features, dispatch ] = useReducer(featureGateReducer, updatedFeatureGateConfig);
    return (<FeatureGateContext.Provider value={ {  dispatch, features } }>{ children }</FeatureGateContext.Provider>);
};
