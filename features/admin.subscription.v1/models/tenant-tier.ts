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

export interface TenantTierRequestResponse {
    tierName: TenantTier;
}

export enum TenantTier {
    FREE = "Free",
    FREE_V2 = "FreeV2",
    ESSENTIALS = "Essentials",
    PROFESSIONAL = "Professional",
    ENTERPRISE = "Enterprise",
    PYG = "PYG",
    PYG_TRIAL = "PYG-Trial"
}

/**
 * Whether the given tier should receive Free-tier behavior.
 * Both `Free` and `FreeV2` are treated as free tiers.
 *
 * @param tierName - The tenant's subscription tier.
 * @returns `true` when the tier is a free tier.
 */
export const isFreeTier = (tierName: TenantTier): boolean =>
    tierName === TenantTier.FREE || tierName === TenantTier.FREE_V2;
