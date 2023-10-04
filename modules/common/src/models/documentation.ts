/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Interface for the common documentation structure.
 */
interface CommonDocumentationLinksInterface {
    docsHomePage: string;
}

/**
 * Interface for the connections section documentation structure.
 */
interface ConnectionsDocumentationLinksInterface {
    learnMore: string;
    newConnection: {
        learnMore: string;
        apple: {
            learnMore: string;
        };
        enterprise: {
            oidcLearnMore: string;
            samlLearnMore: string;
        };
        facebook: {
            learnMore: string;
        };
        github: {
            learnMore: string;
        };
        google: {
            learnMore: string;
        };
        hypr: {
            learnMore: string;
        };
        microsoft: {
            learnMore: string;
        };
        siwe: {
            learnMore: string;
        };
    };
    edit: {
        advancedSettings: {
            jit: string;
        };
        quickStart: {
            fido: {
                learnMore: string;
            };
        };
    }
}

/**
 * Interface for the console documentation structure.
 */
export interface DocumentationLinksExtensionInterface {
    /**
     * Documentation links for common elements.
     */
    common: CommonDocumentationLinksInterface;
    /**
     * Documentation links for develop section elements.
     */
    develop: {
        /**
         * Documentation links for connections section elements.
         */
        connections: ConnectionsDocumentationLinksInterface;
    }
}

export type DocumentationLinksInterface = DocumentationLinksExtensionInterface;
