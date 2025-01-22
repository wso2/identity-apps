/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
 * Constants for feature flags.
 */
class FeatureFlagConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() {}

    /**
     * Key map for feature flags.
     */
    public static readonly FEATURE_FLAG_KEY_MAP: { [key: string]: string } = {
        ACTIONS: "actions",
        ACTIONS_TYPES_PRE_ISSUE_ACCESS_TOKEN: "actions.create.types.list.preIssueAccessToken",
        ACTIONS_TYPES_PRE_REGISTRATION: "actions.create.types.list.preRegistration",
        ACTIONS_TYPES_PRE_UPDATE_PASSWORD: "actions.create.types.list.preUpdatePassword",
        ACTIONS_TYPES_PRE_UPDATE_PROFILE: "actions.create.types.list.preUpdateProfile",
        APPLICATIONS: "application",
        APPLICATION_BRANDING_TEXT: "branding.stylesAndText.application.text",
        APPLICATION_TEMPLATES: "application.templates",
        BRANDING: "branding",
        BRANDING_STYLES_AND_TEXT_TITLE: "branding.stylesAndText.application.title",
        INSIGHTS: "insights",
        LOGIN_AND_REGISTRATION: "loginAndRegistration",
        LOGIN_AND_REGISTRATION_ORGANIZATION_DISCOVERY: "loginAndRegistration.organizationSettings.discovery",
        LOGIN_AND_REGISTRATION_ORGANIZATION_IMPERSONATION: "loginAndRegistration.organizationSettings.impersonation",
        ORGANIZATION_BRANDING_TEXT: "branding.stylesAndText.organization.text",
        SMS_TEMPLATES: "smsTemplates",
        USER_ROLES: "userRoles"
    };
}

export default FeatureFlagConstants;
