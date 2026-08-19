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

import { MainApplicationInterface } from "@wso2is/admin.applications.v1/models/application";

/**
 * Enum for the CLI Settings page tabs. The values are used as URL hash fragments.
 */
export enum CLISettingsTabIds {
    USERS = "users"
}

/**
 * Class containing CLI Settings constants.
 */
export class CLISettingsConstants {

    private constructor() { }

    /**
     * Builds the filter used to look up the CLI application via the applications listing API.
     *
     * @param applicationName - Name of the CLI application.
     * @returns The applications listing filter.
     */
    public static getCLIApplicationListFilter(applicationName: string): string {
        return `name eq ${ applicationName }`;
    }

    /**
     * Name of the role that grants access to the CLI tool. Users assigned to this
     * role are the users allowed to access the CLI. It is an application-audience
     * role scoped to the CLI application.
     */
    public static readonly CLI_ADMINISTRATOR_ROLE_NAME: string = "Administrator";

    /**
     * Builds the filter used to look up the CLI Administrator role via the roles listing API.
     * The role is scoped to the CLI application via its audience.
     *
     * @param applicationId - ID of the CLI application.
     * @returns The roles listing filter.
     */
    public static getCLIAdministratorRoleFilter(applicationId: string): string {
        return `displayName eq ${ CLISettingsConstants.CLI_ADMINISTRATOR_ROLE_NAME } `
            + `and audience.value eq ${ applicationId }`;
    }

    /**
     * Builds the payload used to create the CLI application.
     *
     * @param applicationName - Name of the CLI application.
     * @param clientId - OAuth client ID of the CLI application.
     * @returns The application creation payload.
     */
    public static getCLIApplicationCreatePayload(
        applicationName: string,
        clientId: string
    ): MainApplicationInterface {
        return {
            inboundProtocolConfiguration: {
                oidc: {
                    clientId,
                    grantTypes: [
                        "urn:ietf:params:oauth:grant-type:device_code",
                        "refresh_token",
                        "organization_switch"
                    ],
                    publicClient: true
                }
            },
            name: applicationName
        } as unknown as MainApplicationInterface;
    }
}
