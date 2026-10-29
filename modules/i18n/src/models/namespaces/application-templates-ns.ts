/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

export interface applicationTemplatesNS {
    categories: {
        default: {
            displayName: string;
            description: string;
        };
        technology: {
            displayName?: string;
            description: string;
        };
        ssoIntegration: {
            displayName: string;
            description: string;
        };
    };
    mcpKnownClients: {
        chooser: {
            heading: string;
            hint: string;
            knownClients: string;
            otherClients: string;
            metadataDocument: {
                label: string;
                description: string;
            };
            manual: {
                label: string;
                description: string;
            };
        };
        document: {
            heading: string;
            hint: string;
            url: string;
            urlInvalid: string;
            urlTooLong: string;
            fetch: string;
            placeholder: string;
            publishedBy: string;
            signInType: string;
            publicClient: string;
            privateKeyJwt: string;
            redirectUris: string;
            loopback: string;
            grants: string;
            applicationName: string;
        };
        previewError: {
            message: string;
            invalidClientId: string;
            documentNotRetrieved: string;
            invalidRedirectUri: string;
            invalidAuthentication: string;
            missingAuthorizationCode: string;
            valueTooLong: string;
            disabled: string;
            tooManyPreviews: string;
            generic: string;
        };
    };
    notifications: {
        fetchTemplateMetadata: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
        };
        fetchTemplate: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
        };
    };
    placeholders: {
        emptyApplicationTypeList: {
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
        };
    };
}
