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
