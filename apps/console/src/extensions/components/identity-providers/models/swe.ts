/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Interface for the Sign In With Ethereum registration API response.
 */
export interface SIWERegistrationAPIResponseInterface {
    /**
     * Client ID of the created OIDC application.
     */
    client_id: string;
    /**
     * Client secret of the created OIDC application.
     */
    client_secret: string;
}
