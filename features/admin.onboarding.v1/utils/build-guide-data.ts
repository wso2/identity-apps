/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import {
    OIDCApplicationConfigurationInterface
} from "@wso2is/admin.applications.v1/models/application";
import { OIDCDataInterface } from "@wso2is/admin.applications.v1/models/application-inbound";
import set from "lodash-es/set";
import { CreatedApplicationResultInterface } from "../models";

/**
 * Parameters for building the onboarding guide data object.
 */
export interface BuildGuideDataParamsInterface {
    /** Created application result from the wizard */
    createdApplication?: CreatedApplicationResultInterface;
    /** OIDC inbound protocol config (from useGetApplicationInboundConfigs) */
    inboundProtocolConfig?: OIDCDataInterface;
    /** OIDC endpoint metadata (from Redux state.application.oidcConfigurations) */
    oidcConfigurations?: OIDCApplicationConfigurationInterface;
    /** Server origin URL */
    serverOrigin?: string;
    /** Custom server host (tenant-qualified, preferred over serverOrigin) */
    customServerHost?: string;
    /** Tenant domain */
    tenantDomain?: string;
    /** Client origin URL */
    clientOrigin?: string;
    /** Product name */
    productName?: string;
    /** Account app URL */
    accountAppURL?: string;
    /** Documentation site URL */
    docSiteURL?: string;
    /** Redirect URLs configured in the wizard */
    redirectUrls?: string[];
}

/**
 * Build a lightweight data object for MarkdownGuide variable substitution.
 *
 * Mirrors the shape of `MarkdownGuideDataInterface` from ApplicationMarkdownGuide
 * so that the same guide markdown templates work with the same `${path.to.property}` syntax.
 *
 * @see features/admin.application-templates.v1/components/application-markdown-guide.tsx
 * @param params - Data sources from the onboarding context
 * @returns Data object compatible with MarkdownGuide's lodash.get() substitution
 */
export const buildOnboardingGuideData = (params: BuildGuideDataParamsInterface): Record<string, unknown> => {
    const data: Record<string, unknown> = {};

    set(data, "general.name", params.createdApplication?.name || "");

    if (params.inboundProtocolConfig) {
        set(data, "protocol.oidc", params.inboundProtocolConfig);
    } else {
        set(data, "protocol.oidc", {
            callbackURLs: params.redirectUrls,
            clientId: params.createdApplication?.clientId || "",
            clientSecret: params.createdApplication?.clientSecret || ""
        });
    }

    if (params.oidcConfigurations) {
        set(data, "metadata.oidc", params.oidcConfigurations);
    }

    data.serverOrigin = params.customServerHost || params.serverOrigin || "";
    data.tenantDomain = params.tenantDomain || "";
    data.clientOrigin = params.clientOrigin || "";
    data.productName = params.productName || "";
    data.accountAppURL = params.accountAppURL || "";
    data.docSiteURL = params.docSiteURL || "";

    set(data, "moderatedData.scopes", {
        commaSeperatedList: "'openid', 'profile'",
        spaceSeperatedList: "openid profile"
    });

    return data;
};
