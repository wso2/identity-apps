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
        ACTIONS_TYPES_PRE_ISSUE_ACCESS_TOKEN: "actions.types.list.preIssueAccessToken",
        ACTIONS_TYPES_PRE_REGISTRATION: "actions.types.list.preRegistration",
        ACTIONS_TYPES_PRE_UPDATE_PASSWORD: "actions.types.list.preUpdatePassword",
        ACTIONS_TYPES_PRE_UPDATE_PROFILE: "actions.types.list.preUpdateProfile",
        AGENTS: "agents",
        AI_APPLICATION_LOGIN_FLOW_BANNER: "ai.application.loginFlow.banner",
        AI_BRANDING_BANNER: "ai.branding.banner",
        AI_FLOWS_TYPES_REGISTRATION: "ai.flows.types.list.registration",
        APPLICATIONS: "application",
        APPLICATION_BRANDING_TEXT: "branding.stylesAndText.application.text",
        APPLICATION_EDIT_BRANDING_LINK: "applications.edit.general.branding",
        APPLICATION_TEMPLATES: "applications.templates",
        ATTRIBUTE_DIALECTS: "attributeDialects",
        BRANDING: "branding",
        BRANDING_STYLES_AND_TEXT_TITLE: "branding.stylesAndText.application.title",
        CUSTOM_PAGE_EDITOR_FEATURE_ID: "console.branding.design.layout.custom",
        FLOWS: "flows",
        FLOWS_TYPES_REGISTRATION: "flows.types.list.registration",
        INSIGHTS: "insights",
        LOGIN_AND_REGISTRATION: "loginAndRegistration",
        LOGIN_AND_REGISTRATION_FRAUD_DETECTION: "loginAndRegistration.loginSecurity.fraudDetection",
        LOGIN_AND_REGISTRATION_ORGANIZATION_DISCOVERY: "loginAndRegistration.organizationSettings.discovery",
        LOGIN_AND_REGISTRATION_ORGANIZATION_IMPERSONATION: "loginAndRegistration.organizationSettings.impersonation",
        LOGIN_AND_REGISTRATION_SELF_REGISTRATION_FLOW_BUILDER:
            "loginAndRegistration.userOnboarding.registrationFlowBuilder",
        MCP_SERVERS: "mcpServers",
        ORGANIZATION_BRANDING_TEXT: "branding.stylesAndText.organization.text",
        PUSH_PROVIDERS: "pushProviders",
        PUSH_PROVIDER_TEMPLATES: "pushProviders.templates",
        REMOTE_LOG_PUBLISH: "remote.log.publish",
        SMS_TEMPLATES: "smsTemplates",
        USER_ROLES: "userRoles",
        USER_STORES: "userStores",
        WEBHOOKS: "webhooks"
    };
}

export default FeatureFlagConstants;
