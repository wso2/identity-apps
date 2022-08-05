/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

export const SDKMeta = {
    dotNet: {
        readme: "https://github.com/asgardeo/asgardeo-dotnet-oidc-sdk/blob/master/README.md",
        sample: {
            artifact: "https://github.com/asgardeo/asgardeo-dotnet-oidc-sdk/releases/download/v0.1.1/" +
                "PickupManagerOIDC-v0.1.1.msi",
            repository: "https://github.com/asgardeo/asgardeo-dotnet-oidc-sdk/tree/master/Sample"
        }
    },
    tomcatOIDCAgent: {
        catalog: "https://github.com/asgardeo/asgardeo-tomcat-oidc-agent/blob/master/io.asgardeo.tomcat.oidc." +
            "sample/src/main/resources/configuration-catalog.md",
        readme: "https://github.com/asgardeo/asgardeo-tomcat-oidc-agent/blob/master/README.md",
        sample: {
            artifact: "https://github.com/asgardeo/asgardeo-tomcat-oidc-agent/releases/download/v0.1.21/oidc-sample" +
                "-app.war",
            home: "/oidc-sample-app/index.html",
            repository: "https://github.com/asgardeo/asgardeo-tomcat-oidc-agent/tree/master/io.asgardeo.tomcat." +
                "oidc.sample",
            sigInRedirectURL: "/oidc-sample-app/oauth2client"
        },
        integrate: {
            defaultCallbackContext: "/oauth2client"
        }
    }
};
