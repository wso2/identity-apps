/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
        integrate: {
            defaultCallbackContext: "/oauth2client"
        },
        readme: "https://github.com/asgardeo/asgardeo-tomcat-oidc-agent/blob/master/README.md",
        sample: {
            artifact: "https://github.com/asgardeo/asgardeo-tomcat-oidc-agent/releases/latest/download/oidc-sample" +
                "-app.war",
            home: "/oidc-sample-app/index.html",
            repository: "https://github.com/asgardeo/asgardeo-tomcat-oidc-agent/tree/master/io.asgardeo.tomcat." +
                "oidc.sample",
            sigInRedirectURL: "/oidc-sample-app/oauth2client"
        }
    }
};
