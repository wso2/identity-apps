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

import { DeploymentConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { CustomerDataServiceEndpointsInterface } from "../models/endpoints";

/**
 * Resolve the host to use for Customer Data Service (CDS) endpoints.
 *
 * @param serverHost - Resolved (tenant/org-qualified) server host.
 * @param cdsHost - Optional dedicated CDS host origin.
 * @returns The host to prefix CDS endpoints with.
 */
const resolveCustomerDataServiceHost = (serverHost: string, cdsHost?: string): string => {
    if (!cdsHost) {
        return serverHost;
    }

    try {
        const tenantedPath: string = new URL(serverHost).pathname;
        const sanitizedPath: string = tenantedPath === "/" ? "" : tenantedPath;

        return `${ cdsHost.replace(/\/+$/, "") }${ sanitizedPath }`;
    } catch {
        return cdsHost.replace(/\/+$/, "");
    }
};

/**
 * Get the resource endpoints for Customer Data Service (CDS) related operations.
 *
 * @param serverHost - Resolved (tenant/org-qualified) server host.
 * @param deploymentConfig - Deployment configuration (used to read an optional dedicated CDS host).
 * @returns Customer Data Service resource endpoints.
 */
export const getCustomerDataServiceEndpoints = (
    serverHost: string,
    deploymentConfig?: DeploymentConfigInterface
): CustomerDataServiceEndpointsInterface => {
    const cdsHost: string = resolveCustomerDataServiceHost(
        serverHost,
        deploymentConfig?.extensions?.cdsHost as string
    );

    return {
        cdsConfig: `${ cdsHost }/cds/api/v1/config`,
        cdsProfileSchema: `${ cdsHost }/cds/api/v1/profile-schema`,
        cdsProfiles: `${ cdsHost }/cds/api/v1/profiles`,
        cdsUnificationRules: `${ cdsHost }/cds/api/v1/unification-rules`
    };
};
