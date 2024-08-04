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

export enum SupportedTraditionalSAMLAppTechnologyTypes {
    JAVA_EE = "Java EE"
}

/**
* Interface for the saml SDK integrate config.
*/
export interface SAMLIntegrateSDKConfigInterface {
    acsURL: string,
    baseUrl: string,
    certificate: string,
    enableAssertionEncryption: boolean,
    enableRequestSigning: boolean,
    enableResponseSigning: boolean,
    enableSLO: boolean,
    issuer: string,
    samlIssuer: string,
    ssoUrl: string
}

/**
* Interface for the saml sample tryout config.
*/
export interface SAMLTryoutSampleConfigInterface {
    certificate: string,
    enableAssertionEncryption: boolean,
    enableRequestSigning: boolean,
    enableResponseSigning: boolean,
    enableSLO: boolean,
    issuer: string,
    samlIssuer: string,
    ssoUrl: string,
    tomcatHost: string
}

export interface SAMLSDKMeta {
    tomcatSAMLAgent: {
        catalog: string,
        readme: string,
        sample: {
            acsURLSuffix: string,
            artifact: string,
            home: string,
            repository: string
        }
    }
}
