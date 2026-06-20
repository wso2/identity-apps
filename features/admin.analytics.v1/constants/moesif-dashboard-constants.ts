/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { TenantTier } from "@wso2is/admin.subscription.v1/models/tenant-tier";
import essentialsDashboardTemplate from "../assets/moesif-dashboard-essentials.json";
import freeDashboardTemplate from "../assets/moesif-dashboard-free.json";
import premiumDashboardTemplate from "../assets/moesif-dashboard-premium.json";

/**
 * Constants for the tier-aware Moesif Canvas dashboard templates.
 */
export class MoesifDashboardConstants {

    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() { }

    /**
     * Canvas template per subscription tier.
     *
     * - Free / FreeV2   — minimal set aligned with the legacy Org Insights page
     *                     (active users, login success vs failures, registrations, M2M tokens).
     * - Essentials      — the standard dashboard set (Overview, Login, Registration, Token).
     * - Professional /
     *   Enterprise /
     *   PYG / PYG-Trial — extended dashboard set (currently identical to Essentials;
     *                     kept as a separate file so it can diverge without code changes).
     */
    public static readonly TEMPLATES: Record<TenantTier, Record<string, unknown>> = {
        [ TenantTier.ENTERPRISE ]: premiumDashboardTemplate,
        [ TenantTier.ESSENTIALS ]: essentialsDashboardTemplate,
        [ TenantTier.FREE ]: freeDashboardTemplate,
        [ TenantTier.FREE_V2 ]: freeDashboardTemplate,
        [ TenantTier.PROFESSIONAL ]: premiumDashboardTemplate,
        [ TenantTier.PYG ]: premiumDashboardTemplate,
        [ TenantTier.PYG_TRIAL ]: premiumDashboardTemplate
    };

    /**
     * Resolves the Canvas template for a given subscription tier.
     *
     * @param tierName - Subscription tier of the tenant.
     * @returns The Canvas template. Falls back to the Free tier template
     *          when the tier is unknown.
     */
    public static getTemplate(tierName: TenantTier): Record<string, unknown> {
        return MoesifDashboardConstants.TEMPLATES[tierName]
            ?? MoesifDashboardConstants.TEMPLATES[TenantTier.FREE];
    }
}
