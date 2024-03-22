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

import { CertificatesNS } from "../../../models";

export const certificates:CertificatesNS ={
    keystore: {
        advancedSearch: {
            error: "Filter query format incorrect",
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: "E.g. alias etc."
                    },
                    filterCondition: {
                        placeholder: "E.g. Starts with etc."
                    },
                    filterValue: {
                        placeholder: "E.g. wso2carbon etc."
                    }
                }
            },
            placeholder: "Search by alias"
        },
        attributes: {
            alias: "Alias"
        },
        certificateModalHeader: "View Certificate",
        confirmation: {
            content: "This action is irreversible and will permanently delete the certificate.",
            header: "Are you sure?",
            hint: "Please type <1>{{id}}</1> to confirm.",
            message: "This action is irreversible and will permanently delete the certificate.",
            primaryAction: "Confirm",
            tenantContent: "This will delete the tenant certificate permanently."
                + "Once deleted, unless you import a new tenant certificate,"
                + "you won't be able to access the portal applications."
                + "To continue deleting, enter the alias of the certificate and click delete."
        },
        errorCertificate: "An error occurred while decoding the certificate."
            + " Please ensure the certificate is valid.",
        errorEmpty: "Either add a certificate file or paste the content of a PEM-encoded certificate.",
        forms: {
            alias: {
                label: "Alias",
                placeholder: "Enter an alias",
                requiredErrorMessage: "Alias is required"
            }
        },
        list: {
            columns: {
                actions: "Actions",
                name: "Name"
            }
        },
        notifications: {
            addCertificate:{
                genericError: {
                    description: "An error occurred while importing the certificate.",
                    message: "Something went wrong!"
                },
                success: {
                    description: "The certificate has been imported successfully.",
                    message: "Certificate import success"
                }
            },
            deleteCertificate: {
                genericError: {
                    description: "There was an error while deleting the certificate.",
                    message: "Something went wrong!"
                },
                success: {
                    description: "The certificate has been successfully deleted.",
                    message: "Certificate deleted successfully"
                }
            },
            download: {
                success: {
                    description: "The certificate has started downloading.",
                    message: "Certificate download started"
                }
            },
            getAlias: {
                genericError: {
                    description: "An error occurred while fetching the certificate.",
                    message: "Something went wrong"
                }
            },
            getCertificate: {
                genericError: {
                    description: "There was an error while fetching ."
                        + "the certificate",
                    message: "Something went wrong!"
                }
            },
            getCertificates: {
                genericError: {
                    description: "An error occurred while fetching certificates.",
                    message: "Something went wrong"
                }
            },
            getPublicCertificate: {
                genericError: {
                    description: "There was an error while fetching the organization certificate.",
                    message: "Something went wrong!"
                }
            }
        },
        pageLayout: {
            description: "Manage certificates in the keystore.",
            primaryAction: "Import Certificate",
            title: "Certificates"
        },
        placeholders: {
            emptyList: {
                action: "Import Certificate",
                subtitle: "There are currently no certificates available."
                    + "You can import a new certificate by clicking on"
                    + "the button below.",
                title: "Import Certificate"
            },
            emptySearch: {
                action: "Clear search query",
                subtitle: "We couldn't find any results for {{searchQuery}},"
                    + "Please try a different search term.",
                title: "No results found"
            }
        },
        summary: {
            issuerDN: "Issuer DN",
            sn: "Serial Number:",
            subjectDN: "Subject DN",
            validFrom: "Not valid before",
            validTill: "Not valid after",
            version: "Version"
        },
        wizard: {
            dropZone: {
                action: "Upload Certificate",
                description: "Drag and drop a certificate file here."
            },
            header: "Import Certificate",
            panes: {
                paste: "Paste",
                upload: "Upload"
            },
            pastePlaceholder: "Paste the content of a PEM certificate",
            steps: {
                summary: "Summary",
                upload: "Upload certificate"
            }
        }
    },
    truststore: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: "E.g. alias, certificate etc."
                    },
                    filterCondition: {
                        placeholder: "E.g. Starts with etc."
                    },
                    filterValue: {
                        placeholder: "E.g. wso2carbon etc."
                    }
                }
            },
            placeholder: "Search by group name"
        }
    }
};
