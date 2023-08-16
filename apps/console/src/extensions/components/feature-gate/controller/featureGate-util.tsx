/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import get from "lodash-es/get";
import  {
    useContext
} from "react";
import { FeatureGateContext } from "../context/feature-gate";
import { FeatureGateContextInterface, FeatureStatus } from "../models/feature-gate";


export const useCheckIfEnabled = (path: string): boolean => {
    const featureStatusPath: string = `${ path }.status`;
    const features: FeatureGateContextInterface = useContext(FeatureGateContext);
    // obtain the status path and see if the value is enabled.

    return get(features?.features, featureStatusPath) === FeatureStatus.ENABLED;
};

export const useCheckFeatureStatus = (path: string): FeatureStatus => {
    const featureStatusPath: string = `${ path }.status`;
    const features: FeatureGateContextInterface = useContext(FeatureGateContext);
    // obtain the status path and return the status.

    return get(features?.features, featureStatusPath);
};

export const useCheckFeatureTags = (path: string): string[] => {
    const featureTagsPath: string = `${ path }.tags`;
    const features: FeatureGateContextInterface = useContext(FeatureGateContext);

    return get(features?.features, featureTagsPath);
};
