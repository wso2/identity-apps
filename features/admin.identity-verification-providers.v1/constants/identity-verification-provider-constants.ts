/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

export class IdentityVerificationProviderConstants {

    // data-tabIds of the panes in the IDVP settings
    public static readonly ATTRIBUTES_TAB_ID: string  = "attributes";
    public static readonly GENERAL_TAB_ID: string  = "general";
    public static readonly SETTINGS_TAB_ID: string  = "settings";

    // Input field constraints of IDVP General settings
    public static readonly  IDVP_NAME_MIN_LENGTH: number = 3;
    public static readonly  IDVP_NAME_MAX_LENGTH: number = 50;
    public static readonly  IDVP_DESCRIPTION_MIN_LENGTH: number = 3;
    public static readonly  IDVP_DESCRIPTION_MAX_LENGTH: number = 300;

    // Keys of IDVP route paths
    public static readonly IDVP_TEMPLATE_PATH: string = "IDVP_TEMPLATES";
    public static readonly IDVP_EDIT_PATH: string = "IDVP_EDIT";
    public static readonly IDVP_PATH: string = "IDVP";
}
