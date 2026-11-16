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

import { getApplicationList } from "@wso2is/admin.applications.v1/api/application";
import { ApplicationListInterface } from "@wso2is/admin.applications.v1/models/application";
import { CDSApplicationIdentifierType } from "../models/config";

/**
 * Resolves the application identifier type to use when communicating with CDS APIs.
 *
 * Reads the optional `extensions.cdsApplicationIdentifierType` deployment config.
 * Any value other than `app_id` — including unset — selects the legacy
 * `client_id` mode to match the CDS server default.
 *
 * @returns The configured CDS application identifier type.
 */
export const getCDSApplicationIdentifierType = (): CDSApplicationIdentifierType => {
    const configuredType: string =
        window["AppUtils"]?.getConfig()?.extensions?.cdsApplicationIdentifierType as string;

    return configuredType === CDSApplicationIdentifierType.APP_ID
        ? CDSApplicationIdentifierType.APP_ID
        : CDSApplicationIdentifierType.CLIENT_ID;
};

/**
 * Console system application client ID (reserved consumer key). Also the
 * identifier registered with CDS in legacy `client_id` mode.
 */
export const CDS_CONSOLE_APP: string = "CONSOLE";

/**
 * Resolves the identifier used to register the Console as a CDS system application,
 * honoring the configured CDS application identifier type.
 *
 * In `client_id` mode this is the Console client ID (`CONSOLE`). In `app_id` mode
 * the Console application UUID is looked up via the application list API.
 *
 * @returns The Console system application identifier for the configured mode.
 * @throws If the Console application UUID cannot be resolved in `app_id` mode.
 */
export const resolveConsoleSystemApplicationIdentifier = async (): Promise<string> => {
    if (getCDSApplicationIdentifierType() !== CDSApplicationIdentifierType.APP_ID) {
        return CDS_CONSOLE_APP;
    }

    // Console is a system portal, so system portals must NOT be excluded from the lookup.
    const response: ApplicationListInterface = await getApplicationList(
        1,
        0,
        `clientId eq ${CDS_CONSOLE_APP}`,
        false
    );
    const consoleApplicationId: string | undefined = response?.applications?.[0]?.id;

    if (!consoleApplicationId) {
        throw new Error("Unable to resolve the Console application UUID for the CDS system application list.");
    }

    return consoleApplicationId;
};
