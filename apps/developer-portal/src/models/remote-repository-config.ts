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

export interface InterfaceRemoteRepoListResponse {
    count: number;
    remotefetchConfigurations: InterfaceRemoteRepoConfig[];
}

export interface InterfaceRemoteRepoConfig {
    actionListenerType: string;
    configurationDeployerType: string;
    failedDeployments: number;
    id: string;
    isEnabled: boolean;
    name: string;
    repositoryManagerType: string;
    successfulDeployments: number;
}

export interface InterfaceRemoteRepoConfigDetails {
    remoteFetchName: string;
    isEnabled: boolean;
    repositoryManager: InterfaceRepositoryManagerDetails;
    actionListener: InterfaceRemoteActionListner;
    configurationDeployer: InterfaceRemoteConfigDeployer;
}

export interface InterfaceRepositoryManagerDetails {
    type: string;
    attributes: {
        accessToken: string;
        userName: string;
        uri: string;
        branch: string;
        directory: string;
    };
}

export interface InterfaceRemoteActionListner {
    type: string;
    attributes: {
        frequency: number;
    };
}

export interface InterfaceRemoteConfigDeployer {
    type: string;
    attributes: any;
}

export interface InterfaceRemoteConfigForm {
    configName: string;
    configEnabled: boolean;
    gitUrl: string;
    gitBranch: string;
    gitDirectory: string;
    accessToken: string;
    userName: string;
    pollingfreq: number;
}
