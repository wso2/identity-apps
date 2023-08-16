/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export enum SupportedTraditionalOIDCAppTechnologyTypes {
    JAVA_EE = "Java EE",
    DOT_NET = ".NET"
}

export interface OIDCIntegrateSDKConfigInterface {
    clientID: string,
    clientSecret: string,
    serverOrigin: string,
    signInRedirectURL: string,
    signOutRedirectURL: string,
    scope: string[],
}

export interface OIDCTryoutSampleConfigInterface {
    clientID: string,
    clientSecret: string,
    serverOrigin: string,
}

