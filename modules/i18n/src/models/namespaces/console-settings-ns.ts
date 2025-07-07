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
export interface ConsoleSettingsNS {
    administrators: {
        add: {
            action: string;
            options: {
                addExistingUser: string;
                addExternalUser: string;
                inviteParentUser: string;
            };
        };
        edit: {
            backButton: string;
        };
        tabLabel: string;
    };
    invitations: {
        filterOptions: {
            accepted: string;
            pending: string;
            expired: string;
        }
    };
    loginFlow: {
        tabLabel: string;
    };
    protocol: {
        tabLabel: string;
    };
    roles: {
        add: {
            organizationPermissions: {
                label: string;
            };
            tenantPermissions: {
                label: string;
            };
        };
        tabLabel: string;
        permissionLevels: {
            edit: string;
            view: string;
        };
    };
    sharedAccess: {
        description: string;
        selectRolesForOrganization: string;
        searchAvailableRolesPlaceholder: string;
        organizations: string;
        availableRoles: string;
        tabLabel: string;
        modes: {
            doNotShare: string;
            shareWithAll: string;
            shareWithSelected: string;
            shareAllRolesWithAllOrgs: string;
        };
        notifications: {
            fetchRoles: {
                error: {
                    description: string;
                    message: string;
                };
            };
            fetchOrgTree: {
                error: {
                    description: string;
                    message: string;
                };
            };
            shareRoles: {
                error: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
        };
    };
}
