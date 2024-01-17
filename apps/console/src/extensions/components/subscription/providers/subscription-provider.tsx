/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import React, { PropsWithChildren, ReactElement } from "react";
import { SubscriptionContext } from "../contexts/subscription-context";
import { TenantTier } from "../models/subscription";

/**
 * Subscription provider props interface.
 */
export interface SubscriptionProviderPropsInterface {
    /**
     * Initial reducer state.
     */
    tierName?: TenantTier;
}

/**
 * SubscriptionContext Provider.
 *
 * @param props - Wrap content/elements.
 * @returns SubscriptionContext Provider.
 */
export const SubscriptionProvider = (
    props: PropsWithChildren<SubscriptionProviderPropsInterface>
): ReactElement => {

    const {
        children,
        tierName
    } = props;

    /**
     * Render state, dispatch and special case actions.
     */
    return (
        <SubscriptionContext.Provider value={ { tierName } }>
            { children }
        </SubscriptionContext.Provider>
    );
};
