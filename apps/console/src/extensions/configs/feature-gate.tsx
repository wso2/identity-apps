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

import { DecodedIDTokenPayload, useAuthContext } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import set from "lodash-es/set";
import { useEffect, useState } from "react";
import { store } from "../../features/core/store";
import { OrganizationUtils } from "../../features/organizations/utils/organization";
import { useGetAllFeatures } from "../components/feature-gate/api/feature-gate";
import { featureGateConfig } from "../components/feature-gate/configs/feature-gate";
import { AllFeatureInterface, FeatureGateInterface } from "../components/feature-gate/models/feature-gate";

/**
 * Hook to get the updated feature gate configuration.
 *
 * @returns The updated feature gate configuration.
 */
export const useGetUpdatedFeatureGateConfig = (): FeatureGateInterface | null => {

    const featureGateConfigUpdated : FeatureGateInterface = { ...featureGateConfig };
    const { state, getDecodedIDToken } = useAuthContext();
    const [ orgId, setOrgId ] = useState<string>();
    const [ featureGateConfigData, setFeatureGateConfigData ] = 
        useState<FeatureGateInterface | null>(featureGateConfigUpdated);

    const { 
        data: allFeatures,
        error: featureGateAPIException 
    } = useGetAllFeatures(orgId, state.isAuthenticated);

    useEffect(() => {
        if(state.isAuthenticated) {

            if (OrganizationUtils.isRootOrganization(store.getState().organization.organization)
            || store.getState().organization.isFirstLevelOrganization) {
                getDecodedIDToken().then((response: DecodedIDTokenPayload)=>{
                    const orgName: string = response.org_name;
                    // Set org_name instead of org_uuid as the API expects org_name
                    // as it resolves tenant uuid from it.
    
                    setOrgId(orgName);
                });
            } else {
                // Set the sub org id to the current organization id.

                setOrgId(store.getState().organization.organization.id);
            }
            
        }
    }, [ state ]);

    useEffect(() => {
        if (allFeatures instanceof IdentityAppsApiException || featureGateAPIException) {
            return;
        }

        if (!allFeatures) {
            return;
        }

        if (allFeatures?.length > 0) {
            allFeatures.forEach((feature: AllFeatureInterface )=> {
                // converting the identifier to path.
                const path: string = feature.featureIdentifier.replace(/-/g, ".");
                // Obtain the status and set it to the feature gate config.
                const featureStatusPath: string = `${ path }.status`;
    
                set(featureGateConfigUpdated,featureStatusPath, feature.featureStatus);
    
                const featureTagPath: string = `${ path }.tags`;
                
                set(featureGateConfigUpdated,featureTagPath, feature.featureTags);
                
                setFeatureGateConfigData(featureGateConfigUpdated);
            });
        }
    }, [ allFeatures ]);

    return featureGateConfigData;
};
