/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export enum SupportedTraditionalSAMLAppTechnologyTypes {
    JAVA_EE = "Java EE"
}

/**
* Interface for the saml SDK integrate config.
*/
export interface SAMLIntegrateSDKConfigInterface {
    acsURL: string,
    baseUrl: string,
    certificate: string,
    enableAssertionEncryption: boolean,
    enableRequestSigning: boolean,
    enableResponseSigning: boolean,
    enableSLO: boolean,
    issuer: string,
    samlIssuer: string,
    ssoUrl: string
}

/**
* Interface for the saml sample tryout config.
*/
export interface SAMLTryoutSampleConfigInterface {
    certificate: string,
    enableAssertionEncryption: boolean,
    enableRequestSigning: boolean,
    enableResponseSigning: boolean,
    enableSLO: boolean,
    issuer: string,
    samlIssuer: string,
    ssoUrl: string,
    tomcatHost: string
}
