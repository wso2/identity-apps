/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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

import { ExtendedFeatureResourceEndpointsInterface } from "./models";
import { DeploymentConfigInterface, store } from "../../admin.core.v1";

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
        auditLogsEndpoint: `${ serverHost }/api/asgardeo/v2/logs/audit/search`,
        authzEndpoint: `${ authzServiceHost }/o/${ orgId }`,
        choreoEventingEndpoint: deploymentConfig.extensions?.choreoEventingEndpoint as string,
        diagnosticLogsEndpoint: `${ serverHost }/api/asgardeo/v2/logs/diagnostics/search`,
        emailManagement: `${ serverHost }/api/server/v1/email`,
        emailProviderEndpoint: `${ serverHost }/api/server/v1/notification-senders/email`,
        eventsEndpoint: `${ serverHost }/api/event-configurations/v1/events`,
        inviteEndpoint: `${ serverHost }/api/asgardeo-guest/v1/users/invite`,
        inviteLinkEndpoint: "/api/users/v1/offline-invite-link",
        notificationSendersEndPoint: `${ serverHost }/api/server/v1/notification-senders`,
        organizationEndpoint: `${ serverHost }/api/asgardeo-enterprise-login/v1/business-user-login/{organization}`,
        organizationPatchEndpoint: `${ serverHost }/api/asgardeo-enterprise-login/v1/business-user-login`,
        resendEndpoint: `${ serverHost }/api/asgardeo-guest/v1/users/invite/{}/resend`,
        smsProviderEndpoint: `${ serverHost }/api/server/v1/notification-senders/sms`,
        userEndpoint: `${ serverHost }/api/asgardeo-guest/v1/users`,
        userStoreAgentConnection: `${ serverHost }/api/onprem-userstore/v1/connection`,
        userStoreAgentToken: `${ serverHost }/api/onprem-userstore/v1/token`
    };
};
