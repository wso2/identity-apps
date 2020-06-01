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
 * Interface for the portal documentation structure.
 */
export interface PortalDocumentationStructureInterface extends StrictPortalDocumentationStructureInterface {
    [ key: string ]: any;
}

/**
 * Strict interface for the portal documentation structure.
 */
interface StrictPortalDocumentationStructureInterface {
    "Developer Portal": {
        "Applications": {
            Overview: string;
            "Create New Application": {
                Overview: string;
                "Single Page Application": string;
                "OIDC Web Application": string;
                "SAML Web Application": string;
            };
            "Edit Application": {
                "Single Page Aplication": string;
                "OIDC Web Application": string;
                "SAML Web Application": string;
            };
        };
    };
    Samples: {
        Overview: string;
        Authentication: {
            Android: string;
            iOS: string;
            Angular: string;
            React: string;
            Java: string;
            NodeJs: string;
            "OpenID Connect": string;
            SAML: string;
        };
    };
}

/**
 * Interface for generic doc panel UI card.
 */
export interface DocPanelUICardInterface {
    name: string;
    displayName: string;
    image: string;
    docs: string;
}
