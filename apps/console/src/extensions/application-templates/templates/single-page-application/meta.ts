/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { SDKMetaInterface } from "./models";

export const SDKMeta: SDKMetaInterface = {
    javascript: {
        apis: "https://github.com/asgardeo/asgardeo-auth-spa-sdk/blob/main/README.md#apis",
        artifact: "",
        cdn: "https://unpkg.com/@asgardeo/auth-spa@latest/dist/asgardeo-spa.production.min.js",
        npmInstallCommand: "npm install @asgardeo/auth-spa --save",
        readme: "https://github.com/asgardeo/asgardeo-auth-spa-sdk/blob/main/README.md",
        repository: "https://github.com/asgardeo/asgardeo-auth-spa-sdk",
        samples: {
            javascript: {
                artifact:
                    "https://github.com/asgardeo/asgardeo-auth-spa-sdk/releases/download/v1.0.2/" +
                    "asgardeo-html-js-app.zip",
                repository: "https://github.com/asgardeo/asgardeo-auth-spa-sdk/tree/main/samples/asgardeo-html-js-app"
            },
            react: {
                artifact:
                    "https://github.com/asgardeo/asgardeo-auth-spa-sdk/releases/download/v1.0.2/" +
                    "asgardeo-react-js-app.zip",
                repository: "https://github.com/asgardeo/asgardeo-auth-spa-sdk/tree/main/samples/asgardeo-react-js-app"
            },
            root: "https://github.com/asgardeo/asgardeo-auth-spa-sdk/tree/main/samples"
        }
    },
    react: {
        links: {
            authClientConfig: "https://github.com/asgardeo/asgardeo-auth-react-sdk#authclientconfigconfig",
            secureRoute: "https://github.com/asgardeo/asgardeo-auth-react-sdk#secureroute",
            useContextDocumentation: "https://github.com/asgardeo/asgardeo-auth-react-sdk#useAuthContext"
        },
        npmInstallCommand: "npm install @asgardeo/auth-react react-router-dom --save",
        readme: "https://github.com/asgardeo/asgardeo-auth-react-sdk/blob/main/README.md",
        repository: "https://github.com/asgardeo/asgardeo-auth-react-sdk",
        samples: {
            basicUsage: {
                artifact:
                    "https://github.com/asgardeo/asgardeo-auth-react-sdk/releases/download/v2.0.5/" +
                    "asgardeo-react-app.zip",
                repository:
                    "https://github.com/asgardeo/asgardeo-auth-react-sdk/tree/main/samples/asgardeo-react-app"
            },
            root: "https://github.com/asgardeo/asgardeo-auth-react-sdk/tree/main/samples",
            routing: {
                artifact:
                    "https://github.com/asgardeo/asgardeo-auth-react-sdk/releases/download/v2.0.5/" +
                    "asgardeo-react-app.zip",
                repository:
                    "https://github.com/asgardeo/asgardeo-auth-react-sdk/tree/main/samples/asgardeo-react-app"
            }
        }
    }
};
