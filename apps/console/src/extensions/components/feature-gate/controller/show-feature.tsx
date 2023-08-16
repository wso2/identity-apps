/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import get from "lodash-es/get";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    useContext
} from "react";
import { FeatureGateContext } from "../context/feature-gate";
import { FeatureGateContextInterface, FeatureGateShowInterface, FeatureStatus } from "../models/feature-gate";

/**
 * Show component which will render child elements based on the permissions received.
 *
 * @param props - props required for permissions based rendering.
 * @returns permission matched child elements
 */
export const ShowFeature: FunctionComponent<PropsWithChildren<FeatureGateShowInterface>> = (
    props: PropsWithChildren<FeatureGateShowInterface>
): ReactElement => {
    const { children, ifAllowed } = props;
    const featureStatusPath: string = `${ ifAllowed }.status`;
    const features: FeatureGateContextInterface = useContext(FeatureGateContext);
    const isFeatureEnabledForThisPath:boolean = get(features?.features, featureStatusPath) === FeatureStatus.ENABLED;
   
    if (isFeatureEnabledForThisPath) {
        return <>{ children }</>;
    } else {
        return null;
    }
};
