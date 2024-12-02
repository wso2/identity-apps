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

import { actionsNS } from "../../../models";

export const actions: actionsNS = {
    buttons: {
        cancel: "Cancel",
        changeAuthentication: "Change Authentication",
        create: "Create",
        update: "Update"
    },
    confirmationModal: {
        assertionHint: "Please confirm your action.",
        content: "If you delete this configuration, your service extending the flow will not be executed." +
        " Please proceed with caution.",
        header: "Are you sure?",
        message: "This action is irreversible and will permanently delete the Action configurations."
    },
    dangerZoneGroup: {
        header: "Danger Zone",
        revertConfig: {
            actionTitle: "Delete",
            heading: "Delete Action Configurations",
            subHeading: "Once the action is deleted, it cannot be recovered and configurations" +
            " of the external endpoint will be lost."
        }
    },
    fields: {
        authentication: {
            info: {
                message: "If you are changing the authentication, be aware that the authentication" +
                " secrets of the external endpoint need to be updated.",
                title: {
                    noneAuthType: "No authentication is configured.",
                    otherAuthType: "<strong>{{ authType }}</strong> authentication scheme is configured."
                }
            },
            label: "Authentication",
            types: {
                apiKey: {
                    name: "API Key",
                    properties: {
                        header: {
                            hint: "Must be a string containing only letters (a-z, A-Z), numbers (0-9), " +
                            "period (.) and hyphen (-), and should start with an alphanumeric character.",
                            label: "Header",
                            placeholder: "Header",
                            validations: {
                                empty: "Header is a required field.",
                                invalid: "Please choose a valid header name that adheres to the given guidelines."
                            }
                        },
                        value: {
                            label: "Value",
                            placeholder: "Value",
                            validations: {
                                empty: "Value is a required field."
                            }
                        }
                    }
                },
                basic: {
                    name: "Basic",
                    properties: {
                        password: {
                            label: "Password",
                            placeholder: "Password",
                            validations: {
                                empty: "Password is a required field."
                            }
                        },
                        username: {
                            label: "Username",
                            placeholder: "Username",
                            validations: {
                                empty: "Username is a required field."
                            }
                        }
                    }
                },
                bearer: {
                    name: "Bearer",
                    properties: {
                        accessToken: {
                            label: "Access Token",
                            placeholder: "Access Token",
                            validations: {
                                empty: "Access Token is a required field."
                            }
                        }
                    }
                },
                none: {
                    name: "None"
                }
            }
        },
        authenticationType: {
            hint: {
                create: "Once added, these secrets will not be displayed. You will only be able to reset them.",
                update: "Once updated, these secrets will not be displayed. You will only be able to reset them again."
            },
            label: "Authentication Scheme",
            placeholder: "Select Authentication Scheme",
            validations: {
                empty: "Authentication Scheme is a required field."
            }
        },
        endpoint: {
            hint: "The URL of the configured external endpoint to integrate with this action.",
            label: "Endpoint",
            placeholder: "https://www.mywebsite.com/extensions",
            validations: {
                empty: "Endpoint is a required field.",
                invalidUrl: "Please enter a valid URL.",
                notHttps: "The entered URL is not HTTPS. Please add a valid URL."
            }
        },
        name: {
            hint: "Must be a string containing only letters (a-z, A-Z), numbers (0-9), " +
            "spaces, underscore (_) and hyphen (-).",
            label: "Action Name",
            placeholder: "Sample Action",
            validations: {
                empty: "Action Name is a required field.",
                invalid: "Please choose a valid name that adheres to the given guidelines."
            }
        }
    },
    goBackActions: "Go back to Actions",
    notification: {
        error: {
            activate: {
                description: "{{description}}",
                message: "Error activating the new action."
            },
            create: {
                description: "{{description}}",
                message: "Error creating the new action."
            },
            deactivate: {
                description: "{{description}}",
                message: "Error deactivating the action."
            },
            delete: {
                description: "{{description}}",
                message: "Error deleting the action."
            },
            fetchById: {
                description: "{{description}}",
                message: "Error retrieving the action."
            },
            fetchByType: {
                description: "{{description}}",
                message: "Error retrieving actions."
            },
            typesFetch: {
                description: "{{description}}",
                message: "Error retrieving the action types."
            },
            update: {
                description: "{{description}}",
                message: "Error updating the action."
            }
        },
        genericError: {
            activate: {
                description: "Couldn't activate the new action.",
                message: "Something went wrong."
            },
            create: {
                description: "Couldn't add the new action.",
                message: "Something went wrong."
            },
            deactivate: {
                description: "Couldn't deactivate the new action.",
                message: "Something went wrong."
            },
            delete: {
                description: "Couldn't delete the action.",
                message: "Something went wrong."
            },
            fetchById: {
                description: "Couldn't retrieve the action.",
                message: "Something went wrong."
            },
            fetchByType: {
                description: "Couldn't retrieve actions.",
                message: "Something went wrong."
            },
            typesFetch: {
                description: "Couldn't retrieve the action types.",
                message: "Something went wrong."
            },
            update: {
                description: "Couldn't update the action.",
                message: "Something went wrong."
            }
        },
        success: {
            activate: {
                description: "The action was activated successfully.",
                message: "Action activated successfully."
            },
            create: {
                description: "The new action was added successfully.",
                message: "Action added successfully."
            },
            deactivate: {
                description: "The action was deactivated successfully.",
                message: "Action deactivated successfully."
            },
            delete: {
                description: "The action was deleted successfully.",
                message: "Action deleted successfully."
            },
            update: {
                description: "The action was updated successfully.",
                message: "Action updated successfully."
            }
        }
    },
    status: {
        active: "Active",
        configured: "Configured",
        inactive: "Inactive",
        notConfigured: "Not Configured"
    },
    types: {
        preIssueAccessToken: {
            description: {
                expanded:  "Use this action to update claims and scopes of the access token.",
                shortened: "This action is executed before issuing the access token to an application."
            },
            heading: "Pre Issue Access Token"
        },
        preRegistration: {
            description: {
                expanded: "This action is executed before registering a user. " +
                "Refer the documentation for the API definition to implement.",
                shortened: "This action is executed before registering a user."
            },
            heading: "Pre Registration"
        },
        preUpdatePassword: {
            description: {
                expanded: "This action is executed before updating the password of a user. " +
                "Refer the documentation for the API definition to implement.",
                shortened: "This action is executed before updating the password of a user."
            },
            heading: "Pre Update Password"
        },
        preUpdateProfile: {
            description: {
                expanded: "This action is executed before updating the profile of a user. " +
                "Refer the documentation for the API definition to implement.",
                shortened: "This action is executed before updating the profile of a user."
            },
            heading: "Pre Update Profile"
        }
    }
};
