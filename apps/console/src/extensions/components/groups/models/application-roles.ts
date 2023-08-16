/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Interface to store basic role data.
 */
export interface RoleBasicInterface {
    name: string;
}

/**
 * Interface to store application role data grouped by application.
 */
export interface ApplicationRoleInterface {
    app: string;
    appName?: string;
    roles: RoleBasicInterface[];
}

/**
 * Interface for group role assignment payload.
 */
export interface GroupRoleAssignPayloadInterface {
    added_roles: ApplicationRoleInterface[];
    removed_roles: ApplicationRoleInterface[];
}
