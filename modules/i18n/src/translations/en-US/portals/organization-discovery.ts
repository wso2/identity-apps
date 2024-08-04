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
import { organizationDiscoveryNS } from "../../../models";

export const organizationDiscovery: organizationDiscoveryNS = {
    advancedSearch: {
        form: {
            dropdown: {
                filterAttributeOptions: {
                    organizationName: "Organization Name"
                }
            },
            inputs: {
                filterAttribute: {
                    placeholder: "E.g. Organization Name etc."
                },
                filterCondition: {
                    placeholder: "E.g. Starts with etc."
                },
                filterValue: {
                    placeholder: "Enter value to search"
                }
            }
        },
        placeholder: "Search by Organization Name"
    },
    assign: {
        title: "Assign Email Domains",
        description: "Assign email domains for organizations.",
        form: {
            fields: {
                emailDomains: {
                    label : "Email Domains",
                    placeholder: "Enter email domains",
                    hint: "Type and enter email domains to map to the organization. (E.g. gmail.com etc.)",
                    validations: {
                        invalid: {
                            0: "Please enter a valid email domain.",
                            1: "Provided email domain is already mapped to a different organization."
                        }
                    }
                },
                organizationName: {
                    label: "Organization Name",
                    placeholder: "Select an organization",
                    emptyPlaceholder: {
                        0: "There are no organizations available.",
                        1: "All the organizations have assigned domains."
                    },
                    hint: "Enter the name of the organization you wish to add the domain mapping."
                }
            }
        },
        buttons: {
            assign: "Assign"
        }
    },
    emailDomains: {
        actions: {
            assign: "Assign Email Domain",
            enable: "Enable email domain discovery"
        }
    },
    edit: {
        back: "Back",
        description: "Edit Email Domains",
        form: {
            fields: {
                emailDomains: {
                    label : "Email Domains",
                    placeholder: "Enter email domains",
                    hint: "Type and enter email domains to map to the organization. (E.g. gmail.com etc.)",
                    validations: {
                        invalid: {
                            0: "Please enter a valid email domain.",
                            1: "Provided email domain is already mapped to a different organization."
                        }
                    }
                },
                organizationName: {
                    label: "Organization Name",
                    hint: "The name of the organization to which the domain mappings are added."
                }
            },
            message: "Changing email domain mappings may result in existing users being unable to log in."
        }
    },
    message: "Email domain discovery feature can only be used when email address is configured as the username.",
    notifications: {
        addEmailDomains: {
            error: {
                description: "Adding the email domains to the organization was unsuccessful.",
                message: "Adding unsuccessful"
            },
            success: {
                description: "Email domains added successfully.",
                message: "Added successfully"
            }
        },
        checkEmailDomain: {
            error: {
                description: "Validating the email domain existence was unsuccessful.",
                message: "Validating unsuccessful"
            }
        },
        disableEmailDomainDiscovery: {
            error: {
                description: "An error occurred while disabling email domain discovery.",
                message: "Disabling unsuccessful"
            },
            success: {
                description: "Successfully disabled email domain discovery.",
                message: "Disabled successfully"
            }
        },
        enableEmailDomainDiscovery: {
            error: {
                description: "An error occurred while enabling email domain discovery.",
                message: "Enabling unsuccessful"
            },
            success: {
                description: "Successfully enabled email domain discovery.",
                message: "Enabled successfully"
            }
        },
        fetchOrganizationDiscoveryAttributes: {
            error: {
                description: "An error occurred while fetching the organization discovery attributes.",
                message: "Retrieval unsuccessful"
            }
        },
        getEmailDomainDiscovery: {
            error: {
                description: "An error occurred while retrieving email domain discovery configuration.",
                message: "Retrieval unsuccessful"
            }
        },
        getOrganizationListWithDiscovery: {
            error: {
                description: "An error occurred while getting the organization list with discovery attributes.",
                message: "Retrieval unsuccessful"
            }
        },
        updateOrganizationDiscoveryAttributes: {
            error: {
                description: "An error occurred while updating the organization discovery attributes.",
                message: "Update unsuccessful"
            },
            success: {
                description: "Successfully updated the organization discovery attributes.",
                message: "Update successful"
            }
        }
    },
    placeholders: {
        emptyList: {
            action: "Assign Email Domain",
            subtitles: "There are no organizations with email domains assigned.",
            title: "Assign Email Domain"
        }
    },
    title: "Email Domain Discovery"
};
