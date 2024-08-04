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

module.exports = {
    config: {},
    data: {
        actionListenerAttributes: {
            frequency: 60
        },
        configurationDeployerType: "SP",
        id: "bd216d32-3d49-4e6f-a971-31045d1379f8",
        isEnabled: true,
        remoteFetchName: "ApplicationConfigurationRepository",
        repositoryManagerAttributes: {
            accessToken: "sample access token",
            branch: "master",
            directory: "restDemo/",
            uri: "https://github.com/Thumimku/TestGit.git",
            username: "John"
        },
        repositoryManagerType: "GIT",
        status:{
            "count": 0
        }
    },
    headers: {},
    status: 200,
    statusText: "OK"
};
