/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { UsersResourceEndpointsInterface } from "../models";

/**
 * Get the resource endpoints for the Users feature.
 *
 * @param serverHost - Server Host.
 * @returns UsersResourceEndpointsInterface
 */
export const getUsersResourceEndpoints = (serverHost: string): UsersResourceEndpointsInterface => {
    return {
        bulk: `${ serverHost }/scim2/Bulk`,
        groups: `${ serverHost }/scim2/Groups`,
        guests: `${ serverHost }/api/server/v1/guests/invite`,
        guestsList: `${ serverHost }/api/server/v1/guests/invitations`,
        me: `${serverHost}/scim2/Me`,
        schemas: `${ serverHost }/scim2/Schemas`,
        userSessions: `${ serverHost }/api/users/v1/{0}/sessions`,
        userStores: `${ serverHost }/api/server/v1/userstores`,
        users: `${ serverHost }/scim2/Users`
    };
};
