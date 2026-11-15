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
 * Constants used to register a new device through the device registration flow.
 */
export class DeviceRegistrationConstants {

    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() {}

    public static readonly FLOW_TYPE: string = "DEVICE_REGISTRATION";

    /**
     * Token type of the user verification step, which identifies the user from My Account's ID token.
     */
    public static readonly ID_TOKEN_TYPE: string = "urn:ietf:params:oauth:token-type:id_token";

    /**
     * Error code the flow execute API returns when the flow is disabled for the organization.
     */
    public static readonly FLOW_DISABLED_ERROR_CODE: string = "FE-60104";

    /**
     * Config store resource that holds whether the flow is enabled for the organization.
     */
    public static readonly FLOW_CONFIG_RESOURCE_TYPE: string = "flow-mgt-config";

    public static readonly FLOW_CONFIG_RESOURCE_NAME: string = "flow-mgt-config-DEVICE_REGISTRATION";

    public static readonly FLOW_CONFIG_IS_ENABLED_ATTRIBUTE: string = "isEnabled";

    /**
     * Session storage key set before handing off to the accounts portal, so the Devices section opens on return.
     */
    public static readonly IN_PROGRESS_STORAGE_KEY: string = "device_registration_in_progress";
}
