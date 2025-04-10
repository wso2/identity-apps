
import { WorkflowsResourceEndpointsInterface } from "../models/endpoints";

/**
 * Get the resource endpoints for the workflow management feature.
 *
 * @param {string} serverHost - Server Host.
 * @return {WorkflowsResourceEndpointsInterface}
 */
export const getWorkflowsResourceEndpoints = (serverHost: string): WorkflowsResourceEndpointsInterface => {
    return {
        workflows: `${ serverHost }/api/server/v1/workflows`
    };
};
