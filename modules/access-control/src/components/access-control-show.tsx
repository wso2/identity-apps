/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Fragment,
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    useContext
} from "react";
import FeatureGateContext from "../context/feature-gate-context";
import { useRequiredScopes } from "../hooks";
import { FeatureGateContextPropsInterface, FeatureStatus } from "../models/feature-gate";

/**
 * Interface for show component.
 */
export interface AccessControlShowInterface {
    /**
     * Permissions needed to render child elements
     */
    when?: string[];
    /**
     * Permissions which will hide the child elemements
     */
    notWhen?: string[];
    /**
     * Fallback elements which will be rendered if permission is not matched.
     */
    fallback?: ReactNode;
    /**
     * Feature ID of the feature which is used to check the feature status.
     */
    featureId?: string;
}

/**
 * Show component which will render child elements based on the permissions received.
 *
 * @param props - props required for permissions based rendering.
 * @returns permission matched child elements
 */
export const Show: FunctionComponent<PropsWithChildren<AccessControlShowInterface>> = (
    props: PropsWithChildren<AccessControlShowInterface>
): ReactElement<any, any> | null => {

    const {
        when,
        notWhen,
        fallback,
        featureId,
        children
    } = props;

    const featureStatusPath: string = `${ featureId }.status`;
    const features: FeatureGateContextPropsInterface = useContext(FeatureGateContext);
    const isFeatureEnabledForThisPath: boolean = get(features?.features, featureStatusPath) === FeatureStatus.ENABLED;

    const hasScopesToShow: boolean = useRequiredScopes(when);
    const hasScopesToHide: boolean = useRequiredScopes(notWhen);

    let showOn: boolean = false;
    let hideOn: boolean = false;

    // If `when` is defined, use the hook to check if the user has the required scopes.
    if (when && when.length > 0) {
        showOn = hasScopesToShow;
    }

    // If `notWhen` is defined, use the hook to check if the user has the required scopes.
    if (notWhen && notWhen.length > 0) {
        hideOn = hasScopesToHide;
    }

    if ((isEmpty(featureId) || isFeatureEnabledForThisPath) && showOn) {
        if (hideOn) {
            return null;
        } else {
            return (
                <>
                    { children }
                </>
            );
        }
    }

    if (fallback) {
        return (
            <>
                { fallback }
            </>
        );
    }

    return null;
};
