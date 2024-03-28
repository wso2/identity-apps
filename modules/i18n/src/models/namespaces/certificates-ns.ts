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
export interface CertificatesNS {
    keystore: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: string;
                    };
                    filterCondition: {
                        placeholder: string;
                    };
                    filterValue: {
                        placeholder: string;
                    };
                };
            };
            error: string;
            placeholder: string;
        };
        attributes: {
            alias: string;
        };
        list: {
            columns: {
                actions: string;
                name: string;
            };
        };
        notifications: {
            addCertificate: {
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            getCertificates: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
            getAlias: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
            getPublicCertificate: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
            getCertificate: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
            deleteCertificate: {
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            download: {
                success: {
                    message: string;
                    description: string;
                };
            };
        };
        certificateModalHeader: string;
        placeholders: {
            emptySearch: {
                action: string;
                title: string;
                subtitle: string;
            };
            emptyList: {
                action: string;
                title: string;
                subtitle: string;
            };
        };
        confirmation: {
            hint: string;
            primaryAction: string;
            header: string;
            content: string;
            message: string;
            tenantContent: string;
        };
        pageLayout: {
            title: string;
            description: string;
            primaryAction: string;
        };
        summary: {
            sn: string;
            validFrom: string;
            validTill: string;
            issuerDN: string;
            subjectDN: string;
            version: string;
        };
        wizard: {
            panes: {
                upload: string;
                paste: string;
            };
            steps: {
                upload: string;
                summary: string;
            };
            header: string;
            dropZone: {
                description: string;
                action: string;
            };
            pastePlaceholder: string;
        };
        forms: {
            alias: {
                label: string;
                placeholder: string;
                requiredErrorMessage: string;
            };
        };
        errorEmpty: string;
        errorCertificate: string;
    };
    truststore: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: string;
                    };
                    filterCondition: {
                        placeholder: string;
                    };
                    filterValue: {
                        placeholder: string;
                    };
                };
            };
            placeholder: string;
        };
    };
}

