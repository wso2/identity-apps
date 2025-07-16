/**
 * Interface for the Flows management feature resource endpoints.
 */
export interface FlowsResourceEndpointsInterface {
    /**
     * API to update the flow configuration.
     * @example `https://{serverUrl}/t/{tenantDomain}/api/server/v1/flow/config`
     */
    flowConfiguration: string;
    /**
     * API to fetch the flow configurations.
     * @example `https://{serverUrl}/t/{tenantDomain}/api/server/v1/flow/configs`
     */
    flowConfigurations: string;
}
