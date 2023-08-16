/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/*
 * Application roles constants.
 */
export class ApplicationRolesConstants {

    /**
     * Application role name regex pattern.
     */
    public static readonly APPLICATION_ROLE_NAME_REGEX_PATTERN: string = "^[a-zA-Z][a-zA-Z0-9-_]{2,29}$";
    /**
     * Choreo application template ID.
     */
    public static readonly CHOREO_APP_TEMPLATE_ID: string = "choreo-apim-application-oidc";
    /**
     * Choreo application SP property.
     */
    public static readonly IS_CHOREO_APP_SP_PROPERTY: string = "isChoreoApp";
    /**
     * Organization Login authenticator name
     */
    public static readonly ORGANIZATION_LOGIN: string = "Organization Login";
}
