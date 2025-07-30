/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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
import { pagesNS } from "../../../models";

/**
 * @deprecated Add the relevant page title and description in the respective feature's i18n file.
 */
export const pages: pagesNS = {
    actions: {
        subTitle: "Create actions to extend login & registration flows.",
        title: "Actions"
    },
    addEmailTemplate: {
        backButton: "Go back to {{name}} template",
        subTitle: null,
        title: "Add New Template"
    },
    agents: {
        subTitle: "Configure and manage AI agent identities for your organizaton",
        title: "Agents"
    },
    approvalWorkflows: {
        subTitle: "Create and manage approval workflows.",
        title: "Approval Workflows"
    },
    approvalsPage: {
        subTitle: "Review operational tasks that requires your approval",
        title: "Approvals"
    },
    editTemplate: {
        backButton: "Go back to {{name}} template",
        subTitle: null,
        title: "{{template}}"
    },
    emailDomainDiscovery: {
        subTitle: "Configure email domain discovery for organizations.",
        title: "Organization Discovery"
    },
    emailLocaleAdd: {
        backButton: "Go back to {{name}} template",
        subTitle: null,
        title: "Edit template - {{name}}"
    },
    emailLocaleAddWithDisplayName: {
        backButton: "Go back to {{name}} template",
        subTitle: null,
        title: "Add new template for {{displayName}}"
    },
    emailTemplateTypes: {
        subTitle: "Create and manage templates types.",
        title: "Email Templates Types"
    },
    emailTemplates: {
        backButton: "Go back to email templates types",
        subTitle: null,
        title: "Email Templates"
    },
    emailTemplatesWithDisplayName: {
        backButton: "Go back to applications",
        subTitle: null,
        title: "Templates - {{displayName}}"
    },
    groups: {
        subTitle: "Create and manage groups, assign users to them.",
        title: "Groups"
    },
    groupsEdit: {
        backButton: "Go back to {{type}}",
        subTitle: null,
        title: "Edit Group"
    },
    impersonation: {
        subTitle: "Configure impersonation settings for organization.",
        title: "Impersonation"
    },
    invite: {
        subTitle: "Invite and manage admins and developers.",
        title: "Admins & Developers"
    },
    oidcScopes: {
        subTitle: "Create and manage OpenID Connect (OIDC) scopes and the attributes bound to the scopes.",
        title: "OpenID Connect Scopes"
    },
    oidcScopesEdit: {
        backButton: "Go back to Scopes",
        subTitle: "Add or remove OIDC attributes of the scope",
        title: "Edit scope: {{ name }}"
    },
    organizations: {
        subTitle: "Create and manage organizations.",
        title: "Organizations"
    },
    overview: {
        subTitle: "Configure and  manage users, roles, attribute dialects, server configurations etc." +
            "etc.",
        title: "Welcome, {{firstName}}"
    },
    roles: {
        alternateSubTitle: "View and manage roles.",
        subTitle: "Create and manage roles, assign permissions to them.",
        title: "Roles"
    },
    rolesEdit: {
        backButton: "Go back to {{type}}",
        subTitle: null,
        title: "Edit Role"
    },
    serverConfigurations: {
        subTitle: "Manage general configurations of the server.",
        title: "General Configurations"
    },
    users: {
        subTitle: "Create and manage users, user access, and user profiles.",
        title: "Users"
    },
    usersEdit: {
        backButton: "Go back to {{type}}",
        subTitle: "{{name}}",
        title: "{{email}}"
    },
    webhooks: {
        subTitle: "Create webhooks to notify external services when certain events happen.",
        title: "Webhooks"
    }
};
