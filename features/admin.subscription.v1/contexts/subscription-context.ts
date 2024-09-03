/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Context, createContext } from "react";
import { TenantTier } from "../models/tenant-tier";

/**
 * Props interface of {@link SubscriptionContext}
 */
export interface SubscriptionContextPropsInterface {
    /**
     * Tenant Tier identifier.
     */
    tierName: TenantTier;
}

/**
 * Context object for managing the Subscription context.
 */
const SubscriptionContext: Context<SubscriptionContextPropsInterface> =
  createContext<null | SubscriptionContextPropsInterface>(null);

/**
 * Display name for the SubscriptionContext.
 */
SubscriptionContext.displayName = "SubscriptionContext";

export default SubscriptionContext;
