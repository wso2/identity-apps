/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { SDKMetaInterface } from "./models";

export const SDKMeta: SDKMetaInterface = {
    javascript: {
        apis: "https://github.com/asgardeo/asgardeo-auth-spa-sdk/blob/main/README.md#apis",
        artifact: "",
        cdn: "https://unpkg.com/@asgardeo/auth-spa@latest/dist/asgardeo-spa.production.min.js",
        npmInstallCommand: "npm install @asgardeo/auth-spa --save",
        readme: "https://github.com/asgardeo/asgardeo-auth-spa-sdk/blob/main/README.md",
        repository: undefined,
        samples: {
            javascript: {
                artifact:
                    "https://github.com/asgardeo/asgardeo-auth-spa-sdk/releases/download/v1.0.2/" +
                    "asgardeo-html-js-app.zip",
                repository: undefined
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
            authClientConfig: undefined,
            secureRoute: undefined,
            useContextDocumentation: undefined
        },
        npmInstallCommand: "npm install @asgardeo/auth-react react-router-dom --save",
        readme: "https://github.com/asgardeo/asgardeo-auth-react-sdk/blob/main/README.md",
        repository: undefined,
        samples: {
            basicUsage: {
                artifact:
                    "https://github.com/asgardeo/asgardeo-auth-react-sdk/releases/download/v2.0.5/" +
                    "asgardeo-react-app.zip",
                repository: undefined
            },
            root: undefined,
            routing: {
                artifact:
                    "https://github.com/asgardeo/asgardeo-auth-react-sdk/releases/download/v2.0.5/" +
                    "asgardeo-react-app.zip",
                repository: undefined
            }
        }
    }
};
