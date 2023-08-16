/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Class containing OIDC scopes management constants.
 */
export class OIDCScopesManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */

    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    public static readonly OIDC_ATTRIBUTE_ID: string = "aHR0cDovL3dzbzIub3JnL29pZGMvY2xhaW0";
    public static readonly OPEN_ID_SCOPE: string = "openid";
    public static readonly GROUPS_SCOPE: string = "groups";
    public static readonly APPLICATION_ROLES_SCOPE: string = "app_roles";

    public static readonly OIDC_SCOPES_FETCH_ERROR: string = "An error occurred while fetching " +
        "the OIDC scopes.";

    public static readonly OIDC_SCOPE_DETAILS_FETCH_ERROR: string = "An error occurred while fetching " +
        "the details of the OIDC scope.";

    public static readonly OIDC_SCOPE_UPDATE_ERROR: string = "An error occurred while updating " +
        "the details of the OIDC scope.";

    public static readonly OIDC_SCOPE_CREATE_ERROR: string = "An error occurred while creating " +
        "the new OIDC scope.";

    public static readonly OIDC_SCOPE_DELETE_ERROR: string = "An error occurred while deleting " +
        "the OIDC scope.";

    public static readonly OIDC_READONLY_SCOPES: string[] = [
        OIDCScopesManagementConstants.APPLICATION_ROLES_SCOPE
    ];
}
