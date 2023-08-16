/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

/**
 * Class containing Application constants.
 */
export class ApplicationConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    // Environment variable file for docker samples
    public static readonly DOCKER_ENV_FILE_NAME: string = "sample-app.env";

}

export enum SampleAppsEnum {
    TOMCAT_SAML_AGENT = "Tomcat SAML Agent",
    ANGULAR= "Angular",
    REACT = "React"
}

export enum ApplicationTemplatesEnum {
    OIDC = "OpenID Connect",
    SAML = "SAML"
}
