/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

export enum QuickStartModes {
    INTEGRATE = "INTEGRATE",
    SAMPLES = "SAMPLES"
}

export enum SupportedTechnologyTypes {
    ANGULAR = "Angular",
    REACT = "React",
    JAVASCRIPT = "JavaScript"
}

export enum SupportedSPATechnologyTypes {
    ANGULAR = "Angular",
    REACT = "React",
    JAVASCRIPT = "JavaScript"
}

export interface SDKMetaInterface {
    javascript: SDKMetaJavascriptInterface;
    react: SDKMetaReactInterface;
}

export interface SDKMetaReactInterface {
    links: {
        authClientConfig: string;
        secureRoute: string;
        useContextDocumentation: string;
    };
    npmInstallCommand: string;
    readme: string;
    repository: string;
    samples: {
        basicUsage: {
            artifact: string;
            repository: string;
        };
        root: string;
        routing: {
            artifact: string;
            repository: string;
        };
    };
}

export interface SDKMetaJavascriptInterface {
    apis: string;
    artifact: string;
    cdn: string;
    npmInstallCommand: string;
    readme: string;
    repository: string;
    samples: {
        javascript: {
            artifact: string;
            repository: string;
        };
        react: {
            artifact: string;
            repository: string;
        };
        root: string;
    };
}
