/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
