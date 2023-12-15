/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

export enum SupportedTraditionalOIDCAppTechnologyTypes {
    JAVA_EE = "Java EE",
    DOT_NET = ".NET"
}

export interface OIDCIntegrateSDKConfigInterface {
    clientID: string,
    clientSecret: string,
    serverOrigin: string,
    signInRedirectURL: string,
    signOutRedirectURL: string,
    scope: string[],
}

export interface OIDCTryoutSampleConfigInterface {
    clientID: string,
    clientSecret: string,
    serverOrigin: string,
}

export interface OIDCSDKMeta {
    dotNet: {
        readme: string,
        sample: {
            artifact: string,
            repository: string
        }
    },
    tomcatOIDCAgent: {
        catalog: string,
        integrate: {
            defaultCallbackContext: string
        },
        readme: string,
        sample: {
            artifact: string,
            home: string,
            repository: string,
            sigInRedirectURL: string
        }
    }
}

