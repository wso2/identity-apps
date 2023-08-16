/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
