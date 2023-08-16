/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Interface for the resource endpoints of extended features.
 */
export interface ExtendedFeatureResourceEndpointsInterface {
    /**
     * Tenant Branding Preference API endpoint.
     */
    brandingPreference: string;
    /**
     * Remote user store agent connection API endpoint.
     */
    userStoreAgentConnection: string;
    /**
     * Remote user store agent token API endpoint.
     */
    userStoreAgentToken: string;

    /**
     * Get the resource endpoints for the Invitation Management feature.
     */
    userEndpoint: string;
    resendEndpoint: string;
    inviteEndpoint: string;
    inviteLinkEndpoint: string;
    organizationEndpoint: string;
    organizationPatchEndpoint: string;

    /**
     * Diagnostic logs API endpoint.
     */
    diagnosticLogsEndpoint: string;

    /**
     * Event Publishing API endpoint.
     */
    emailProviderEndpoint : string;
    
    /**
     * Event Publishing API endpoint.
     */
    eventsEndpoint : string;

    /**
     * Eventing endpoint in Choreo.
     */
    choreoEventingEndpoint : string;

    /**
     * Notification senders API endpoint.
     */
    notificationSendersEndPoint: string;
    
    /**
     * Authorization Service API endpoint.
     */
    authzEndpoint: string;

    /**
     * Email management API endpoint.
     */
    emailManagement: string;
}
