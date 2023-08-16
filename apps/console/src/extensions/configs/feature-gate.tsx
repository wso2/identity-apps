/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
