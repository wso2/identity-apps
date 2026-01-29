/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
 * Class containing constants related to Administrator Onboarding.
 */
export class ConsoleAdministratorOnboardingConstants {
    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() {}

    public static readonly ADD_EXISTING_USER_FORM_ID: string = "add-existing-user-wizard-form";
    public static readonly INVITE_PARENT_USER_FORM_ID: string = "invite-parent-user-wizard-form";

    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("CONSOLE_SETTINGS_ADD_ADMINISTRATOR", "consoleSettings.addAdministrator");
}
