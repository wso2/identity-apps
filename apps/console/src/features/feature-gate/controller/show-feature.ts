/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import React, {
    createElement,
    Fragment,
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    useContext
} from "react";
import { useAccess } from "react-access-control";
import { FeatureGateContext } from "../context/feature-gate";
import { FeatureGateShowInterface } from "../model/feature-gate";

/**
 * Interface for show component.
 */
export interface AccessControlShowInterface {
    
    /**
     * Granular level resource permissions.
     */
    ifAllowed?: string;
}

/**
 * Show component which will render child elements based on the permissions received.
 *
 * @param props - props required for permissions based rendering.
 * @returns permission matched child elements
 */
export const Show: FunctionComponent<PropsWithChildren<FeatureGateShowInterface>> = (
    props: PropsWithChildren<AccessControlShowInterface>
): ReactElement<any, any> | null => {
    const featurePath = props.ifAllowed+".enabled";
    const { children } = props;
    const features = useContext(FeatureGateContext); 
    const getFeatureValue = (keys: string [], featureGateConfig: any) => {
    
        for (const key of keys) {
            featureGateConfig = featureGateConfig[key];
          }  
          return featureGateConfig;
    }
    
      const isFeatureEnabled = (featurePath: string): boolean => {
        console.log("path"+featurePath);
        const featureValue = getFeatureValue(featurePath.split('.'), features.features);
        return featureValue !== undefined ? featureValue : false;
      };

      const isFeatureEnabledForThisPath = isFeatureEnabled(featurePath);
      if (isFeatureEnabledForThisPath) {
        console.log("here: "+ isFeatureEnabledForThisPath)
            return (createElement(Fragment, null, children));
        } else {
            return null;
        }
    };
