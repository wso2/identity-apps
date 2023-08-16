/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
  * FIDO Device model
  */
export interface FIDODevice {
    signatureCount: number;
    userIdentity: {
        name: string;
        displayName: string;
        id: string;
    };
    credential: {
        credentialId: string;
        userHandle: string;
        publicKeyCose: string;
        signatureCount: number;
    };
    displayName: string;
    registrationTime: string;
}
