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

/* eslint-disable max-len */

import { RemoteUserStoresNS } from "../../../models/namespaces/remote-user-stores-ns";

export const remoteUserStores: RemoteUserStoresNS = {
    form: {
        fields: {
            accessType: {
                label: "Access Type",
                placeholder: "Select access type",
                validation: {
                    required: "Access type is required"
                }
            },
            attributes: {
                validation: {
                    required: "Attribute mapping is required"
                }
            },
            connectedUserStoreType: {
                label: "Remote User Store Type",
                placeholder: "Select the type of remote user store",
                validation: {
                    required: "User store type is required"
                }
            },
            description: {
                label: "Description",
                placeholder: "Describe the purpose or scope of this user store"
            },
            groupIdMapping: {
                helperText: "Specify the attribute from the user store that stores the group ID.",
                label: "Group ID",
                placeholder: "e.g. groupId",
                validation: {
                    readGroupsEnabled: "Group ID mapping is required when read groups is enabled",
                    required: "Group ID mapping is required"
                }
            },
            groupnameMapping: {
                helperText: "Specify the attribute from the user store that stores the group name.",
                label: "Group Name",
                placeholder: "e.g. groupName",
                validation: {
                    readGroupsEnabled: "Group name mapping is required when read groups is enabled",
                    required: "Group name mapping is required"
                }
            },
            name: {
                label: "User Store Name",
                placeholder: "MY USER STORE",
                validation: {
                    required: "User store name is required"
                }
            },
            readGroups: {
                helperText: "Enable this option to retrieve group information from the user store.",
                label: "Read Groups"
            },
            userIdMapping: {
                helperText: "Specify the attribute from the user store that represents the unique ID for the user.",
                label: "User ID Mapping",
                placeholder: "e.g. uid",
                validation: {
                    required: "User ID mapping is required"
                }
            },
            usernameMapping: {
                helperText: "Specify the attribute from the user store that represents the user's primary identifier.",
                label: "Username Mapping",
                placeholder: "e.g. un",
                validation: {
                    required: "Username mapping is required"
                }
            }
        },
        sections: {
            groupAttributes: "Group Attributes",
            userAttributes: "User Attributes"
        }
    },
    notifications: {
        checkSumError: {
            description: "There was an error while retrieving the validation information.",
            message: "Something went wrong!"
        },
        connectionStatusCheckError: {
            description: "There was an error while checking the connection status.",
            message: "Something went wrong!"
        },
        disconnectError: {
            description: "There was an error while disconnecting the user store.",
            message: "Disconnection failed!"
        },
        tokenGenerateError: {
            description: "There was an error while generating the installation token.",
            message: "Token generation failed!"
        },
        typeFetchError: {
            description: "There was an error while getting the user store types.",
            message: "Something went wrong!"
        }
    },
    pages: {
        create: {
            backButton: "Go back to user stores",
            description: "Onboard the users in your remote user store to {{ productName }}.",
            message: {
                classic:
                    "If your requirement is only for authentication, we recommend using the <1>Optimized User Store Connection</1> for efficiency.",
                optimized:
                    "This configuration supports Authentication Only. User and group management features are not available in this setup. If user management is an essential requirement, please use the <1>Classic User Store Connection</1> instead."
            },
            notifications: {
                createUserStore: {
                    genericError: {
                        description: "There was an error while creating the user store.",
                        message: "Something went wrong!"
                    },
                    success: {
                        description: "The user store has been added successfully!",
                        message: "User store added successfully!"
                    }
                }
            },
            stepper: {
                step1: {
                    description: "Provide the basic details to identify and connect your user store.",
                    title: "General Details"
                },
                step2: {
                    description:
                        "Complete the required settings to integrate your connected user store, enabling smooth user access to applications.",
                    title: "Configurations"
                }
            },
            title: "Create User Store"
        },
        edit: {
            configurations: {
                attributes: {
                    custom: {
                        emptyPlaceholder: {
                            description: "There are no custom attributes created in the system.",
                            heading: "No Custom Attributes"
                        },
                        heading: "Custom Attributes"
                    },
                    heading: "Attribute Mappings",
                    local: {
                        heading: "Local Attributes"
                    }
                },
                groupAttributes: {
                    heading: "Group attributes"
                },
                userAttributes: {
                    heading: "User attributes"
                }
            },
            generalSettings: {
                connections: {
                    actions: {
                        disconnect: "Disconnect",
                        generate: "Generate token",
                        regenerate: "Regenerate token"
                    },
                    emptyPlaceholder: {
                        description1: "There are no user store agent connections.",
                        description2: "Please go through the setup guide to configure the user store agent(s).",
                        heading: "No User Store Agent Connections"
                    },
                    heading: "User Store Agent Connection(s)"
                }
            },
            guide: {
                heading: "Connect the remote user store",
                steps: {
                    attributeMapping: {
                        description:
                            "Update the <1>attribute mappings</1> to match the connected remote user store. Please review the mapped attributes carefully to avoid errors when retrieving users from the user store.",
                        heading: "Attribute mappings"
                    },
                    configure: {
                        description:
                            "Update the properties in the deployment.toml file located in the root directory of the user store agent to match the remote user store settings. Add additional properties according to your requirements.",
                        docsDescription:
                            "See the <1>Asgardeo documentation</1> for more details on configuring the user store agent.",
                        heading: "Configure the agent"
                    },
                    download: {
                        heading: "Download the agent",
                        onPrem: {
                            action: "Download the agent",
                            description: "Download and unzip the user store agent."
                        },
                        remote: {
                            description: "Select your platform and download the corresponding user store agent:",
                            verification: {
                                description: "Follow the steps below to verify the downloaded file using SHA256 checksum.",
                                heading: "Verify the downloaded file",
                                step1: "Execute the following command in the command line. Replace the <1>FILE_PATH</1> with the path of the downloaded agent zip file.",
                                step2: "Compare the generated checksum with the one provided below."
                            }
                        }
                    },
                    run: {
                        checkConnection: {
                            action: "Check Connections",
                            errorAction: "Try again",
                            errorHeading: "Not connected",
                            errorMessage:
                                "A user store is not connected, please make sure that you have followed all the steps of the setup guide properly.",
                            successAction: "Successfully Connected"
                        },
                        commands: {
                            unix: "On Linux/Mac OS",
                            windows: "On Windows"
                        },
                        description: {
                            onPrem:
                                "Execute one of the following commands based on your operating system. Enter the installation token on prompt.",
                            remote: "Execute one of the following commands based on your operating system."
                        },
                        heading: "Run the agent",
                        successMessage: {
                            onPrem:
                                "Once the user store agent is connected successfully, the message <3>Agent successfully connected to {{productName}}</3> will be displayed in the terminal.",
                            remote:
                                "Once the user store agent is connected successfully, the message <3>Successfully connected with the server</3> will be displayed in the terminal."
                        }
                    },
                    token: {
                        action: "Generate token",
                        description:
                            "Generate a new installation token which will be required when you try to connect your remote user store through the user store agent.",
                        generatedToken: {
                            label: "Installation token",
                            message:
                                "Make sure to note down the installation token as it will be required when running the user store agent. You won't be able to see it again!"
                        },
                        heading: "Generate a token"
                    }
                },
                subHeading:
                    "Follow the steps given below to configure the user store agent, which connects the remote user store to Asgardeo"
            },
            tabs: {
                configurations: "Configurations",
                general: "General",
                guide: "Setup Guide"
            }
        }
    }
};
