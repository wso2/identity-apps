import { FlowsResourceEndpointsInterface } from "../models/endpoints";

/**
 * Get the resource endpoints for the Flows feature.
 *
 * @param serverHost - Server host.
 * @returns Flows resource endpoints.
 */
export const getFlowsResourceEndpoints = (
    serverHost: string
): FlowsResourceEndpointsInterface => {
    return {
        flowConfiguration: `${ serverHost }/api/server/v1/flow/config`
    };
};
