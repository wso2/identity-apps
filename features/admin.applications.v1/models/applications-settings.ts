/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";

/**
 * Form values interface.
 */
export interface ApplicationsSettingsFormValuesInterface {
    /**
     * Is the mandateSSA enabled.
     */
    mandateSSA?: boolean;
    /**
     * Is the requireAuthentication enabled.
     */
    authenticationRequired?: boolean;
    /**
     * JWKS Endpoint Url.
     */
    ssaJwks?: string;
    /**
     * Is fapi complience enforced for the dcr apps.
     */
    enableFapiEnforcement?: boolean
}

/**
 * DCR Config update type.
 */
export interface DCRConfigUpdateType {
    /**
     * Operation type.
     */
    operation: string;
    /**
     * Path type.
     */
    path:  string;
    /**
     * Value type.
     */
    value:  string | boolean;
}

/**
 * Proptypes for the applications settings form component.
 */
export interface ApplicationsSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Is the SSA(Software Statement Assertion) mandated.
     */
    mandateSSA?: boolean;
    /**
     * Is the requireAuthentication enabled.
     */
    authenticationRequired?: boolean;
    /**
     * JWKS Endpoint Url to validate SSA(Software Statement Assertion).
     */
    ssaJwks?: string;
    /**
     * DCR Endpoint Url.
     */
    dcrEndpoint?: string;
    /**
     * Is fapi compliance enforced for the DCR apps.
     */
    enableFapiEnforcement?: boolean
}

/**
 * Proptypes for the applications settings form error messages.
 */
export interface ApplicationsSettingsFormErrorValidationsInterface {
    /**
     *  Error message for the JWKS URL.
     */
    ssaJwks?: string;
}
