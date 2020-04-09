/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

/**
 * Help panel metadata interface.
 */
export interface HelpPanelMetadataInterface {
    applications: ApplicationsHelpPanelMetadataInterface;
}

/**
 * Application management help panel metadata.
 */
export interface ApplicationsHelpPanelMetadataInterface {
    docs: any;
    samples: {
        oidc?: ApplicationSampleInterface[];
        saml?: ApplicationSampleInterface[];
    };
    sdks: {
        oidc?: ApplicationSDKInterface[];
        saml?: ApplicationSDKInterface[];
    };
}

/**
 * Service provider sample usage section metadata interface.
 */
export interface ApplicationSampleInterface {
    name: string;
    displayName: string;
    image: string;
    repo: GithubRepoInterface;
    docs: string;
}

/**
 * Type for SDKs.
 */
export type ApplicationSDKInterface = GithubRepoInterface;

/**
 * Github repo metadata interface.
 */
export interface GithubRepoInterface {
    category: GithubRepoCategoryTypes[];
    owner: {
        login: string;
        avatar: string;
    };
    name: string;
    description: string;
    language: "C#" | "JavaScript" | "Swift" | "Java" | "TypeScript" | "HTML";
    languageLogo: any;
    topics: string[];
    stars: number;
    watchers: number;
    forks: number;
    url: string;
}

export type GithubRepoCategoryTypes = "SAML Web Application"
    | "Single Page Application"
    | "OIDC Web Application"
    | "Windows Application"
    | "Mobile Application";
