/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ExtendedFeatureResourceEndpointsInterface } from "./models";
import { DeploymentConfigInterface, store } from "../../features/core";

/**
 * Get the resource endpoints for the extended features.
 *
 * @param serverHost - Server Host.
 * @returns Interface for the resource endpoints of extended features.
 */
export const getExtendedFeatureResourceEndpoints = (serverHost: string,
    deploymentConfig: DeploymentConfigInterface): ExtendedFeatureResourceEndpointsInterface => {

    const orgId: string = store.getState().organization.organization.id;
    const authzServiceHost: string = deploymentConfig.extensions?.authzServiceHost as string;

    return {
        authzEndpoint: `${ authzServiceHost }/o/${ orgId }`,
        brandingPreference: `${ serverHost }/api/server/v1/branding-preference`,
        choreoEventingEndpoint: deploymentConfig.extensions?.choreoEventingEndpoint as string,
        diagnosticLogsEndpoint: `${ serverHost }/api/asgardeo/v1/logs/diagnostics/search`,
        emailManagement: `${ serverHost }/api/server/v1/email`,
        emailProviderEndpoint: `${ serverHost }/api/server/v1/notification-senders/email`,
        eventsEndpoint: `${ serverHost }/api/event-configurations/v1/events`,
        inviteEndpoint: `${ serverHost }/api/asgardeo-guest/v1/users/invite`,
        inviteLinkEndpoint: "/api/asgardeo-onboard/v1/users/invite-link",
        notificationSendersEndPoint: `${ serverHost }/api/server/v1/notification-senders`,
        organizationEndpoint: `${ serverHost }/api/asgardeo-enterprise-login/v1/business-user-login/{organization}`,
        organizationPatchEndpoint: `${ serverHost }/api/asgardeo-enterprise-login/v1/business-user-login`,
        resendEndpoint: `${ serverHost }/api/asgardeo-guest/v1/users/invite/{}/resend`,
        userEndpoint: `${ serverHost }/api/asgardeo-guest/v1/users`,
        userStoreAgentConnection: `${ serverHost }/api/onprem-userstore/v1/connection`,
        userStoreAgentToken: `${ serverHost }/api/onprem-userstore/v1/token`
    };
};
