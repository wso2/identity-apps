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
import { organizationsNS } from "../../../models";

export const organizations: organizationsNS = {
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "E.g. Name etc."
                },
                filterCondition: {
                    placeholder: "E.g. Starts With etc."
                },
                filterValue: {
                    placeholder: "Enter value to search"
                }
            }
        },
        placeholder: "Search by Name"
    },
    confirmations: {
        deleteOrganization: {
            assertionHint: "Please confirm your action.",
            content: "If you remove this organization, all the data associated with this" +
                " organization will be removed. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will remove the organization entirely."
        }
    },
    edit: {
        attributes: {
            hint: "Configure organization attributes",
            key: "Name",
            keyRequiredErrorMessage: "Name is required",
            value: "Value",
            valueRequiredErrorMessage: "Value is required"
        },
        back: "Back",
        dangerZone: {
            disableOrganization: {
                disableActionTitle: "Disable Organization",
                enableActionTitle: "Enable Organization",
                subheader: "Disabling an organization will make it unavailable for all users. " +
                    "Proceed with caution."
            },
            subHeader: "Are you sure you want to delete this organization?",
            title: "Delete Organization"
        },
        description: "Edit Organization",
        fields: {
            created: {
                ariaLabel: "Created",
                label: "Created"
            },
            description: {
                ariaLabel: "Organization Description",
                label: "Organization Description",
                placeholder: "Enter organization description"
            },
            domain: {
                ariaLabel: "Organization Domain",
                label: "Organization Domain"
            },
            id: {
                ariaLabel: "Organization ID",
                label: "Organization ID"
            },
            lastModified: {
                ariaLabel: "Last Modified",
                label: "Last Modified"
            },
            name: {
                ariaLabel: "Organization Name",
                label: "Organization Name",
                placeholder: "Enter organization name"
            },
            type: {
                ariaLabel: "Organization Type",
                label: "Organization Type"
            }
        },
        tabTitles: {
            attributes: "Attributes",
            overview: "Overview"
        }
    },
    forms: {
        addOrganization:{
            description: {
                label: "Description",
                placeholder: "Enter description"
            },
            domainName: {
                label: "Domain Name",
                placeholder: "Enter domain name",
                validation: {
                    duplicate: "Domain name already exists",
                    empty: "Domain name is required"
                }
            },
            name: {
                label: "Organization Name",
                placeholder: "Enter organization name",
                validation: {
                    duplicate: "Organization name already exists",
                    empty: "Organization name is required"
                }
            },
            structural: "Structural",
            tenant: "Tenant",
            type: "Type"
        }
    },
    homeList: {
        description: "View the list of all the available organizations.",
        name: "All Organizations"
    },
    list: {
        actions: {
            add: "New Organization"
        },
        columns: {
            actions: "Actions",
            name: "Name"
        }
    },
    modals: {
        addOrganization: {
            header: "Create an Organization",
            subtitle1: "Create a new organization in {{parent}}.",
            subtitle2: "Create a new organization."
        }
    },
    notifications: {
        addOrganization: {
            error: {
                description: "{{description}}",
                message: "Error while adding the organization"
            },
            genericError: {
                description: "An error occurred while adding the organization",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully added the organization",
                message: "Organization added successfully"
            }
        },
        deleteOrganization: {
            error: {
                description: "{{description}}",
                message: "Error while deleting the organization"
            },
            genericError: {
                description: "An error occurred while deleting the organization",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully deleted the organization",
                message: "Organization deleted successfully"
            }
        },
        deleteOrganizationWithSubOrganizationError: "Organization {{ organizationName }} cannot be " +
            "deleted since it has one or more organizations.",
        disableOrganization: {
            error: {
                description: "{{description}}",
                message: "Error while disabling the organization"
            },
            genericError: {
                description: "An error occurred while disabling the organization",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully disabled the organization",
                message: "Organization disabled successfully"
            }
        },
        disableOrganizationWithSubOrganizationError: "Organization {{ organizationName }} cannot be " +
            "disabled since it has one or more organizations.",
        enableOrganization: {
            error: {
                description: "{{description}}",
                message: "Error while enabling the organization"
            },
            genericError: {
                description: "An error occurred while enabling the organization",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully enabled the organization",
                message: "Organization enabled successfully"
            }
        },
        fetchOrganization: {
            error: {
                description: "{{description}}",
                message: "Error while fetching the organization"
            },
            genericError: {
                description: "An error occurred while fetching the organization",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully fetched the organization",
                message: "Organization fetched successfully"
            }
        },
        getOrganizationList: {
            error: {
                description: "{{description}}",
                message: "Error while getting the organization list"
            },
            genericError: {
                description: "An error occurred while getting the organization list",
                message: "Something went wrong"
            }
        },
        updateOrganization: {
            error: {
                description: "{{description}}",
                message: "Error while updating the organization"
            },
            genericError: {
                description: "An error occurred while updating the organization",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully updated the organization",
                message: "Organization updated successfully"
            }
        },
        updateOrganizationAttributes: {
            error: {
                description: "{{description}}",
                message: "Error while updating the organization attributes"
            },
            genericError: {
                description: "An error occurred while updating the organization attributes",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully updated the organization attributes",
                message: "Organization attributes updated successfully"
            }
        }
    },
    placeholders: {
        emptyList: {
            action: "New Organization",
            subtitles: {
                0: "There are no organizations at the moment.",
                1: "You can add a new organization easily by",
                2: "clicking on the button below.",
                3: "There are no organizations under {{parent}} at the moment."
            },
            title: "Add a new Organization"
        }
    },
    shareApplicationSubTitle: "Select one of the following options to share the application.",
    shareApplicationRadio: "Share with all organizations",
    shareApplicationInfo: "Select this to share the application with all the existing organizations " +
        "and all new organizations that you create under your current organization.",
    unshareApplicationRadio: "Do not share with any organization",
    shareWithSelectedOrgsRadio: "Share with only selected organizations",
    unshareApplicationInfo: "This will allow you to prevent sharing this application with any of the " +
        "existing organizations or new organizations that you create under this organization " +
        "in the future.",
    switching: {
        emptyList: "There are no organizations to show.",
        goBack: "Go back",
        search: {
            placeholder: "Search by Name"
        },
        subOrganizations: "Organizations",
        switchLabel: "Organization",
        switchButton: "Switch to Organization",
        notifications: {
            switchOrganization: {
                genericError: {
                    description: "Couldn't switch to the selected organization.",
                    message: "Something went wrong"
                }
            }
        }
    },
    title: "Organizations",
    view: {
        description: "View Organization"
    }
};
