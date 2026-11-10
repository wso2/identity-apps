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

/**
 * Checks whether the unified Customer Data Profile view is enabled.
 *
 * Reads the optional `extensions.cdsUnifiedProfileView` deployment config.
 * When `true`, the Console renders CDS as a single "Customer Data Profile"
 * page (enable toggle + configuration cards + profile list). Any other
 * value — including unset — keeps the legacy grouped three-page view.
 *
 * @returns Whether the unified Customer Data Profile view is enabled.
 */
export const isCDSUnifiedProfileViewEnabled = (): boolean => {
    return window["AppUtils"]?.getConfig()?.extensions?.cdsUnifiedProfileView === true;
};

/**
 * Checks whether the Console uses the server configuration API to get and set the CDS status.
 *
 * Reads the optional `extensions.cdsTenantConfigEnabled` deployment config. When `true`, the
 * Console uses `/api/server/v1/configs/cds` of the Identity Server for the CDS status. Any other
 * value — including unset — keeps the `cds_enabled` field of the CDS configuration API. Turn it on
 * after the CDS status of each organization is migrated to the Identity Server.
 *
 * @returns Whether the server configuration API is used for the CDS status.
 */
export const isCDSServerConfigEnabled = (): boolean => {
    return window["AppUtils"]?.getConfig()?.extensions?.cdsTenantConfigEnabled === true;
};
