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
                placeholder: "Ex: groupId",
                validation: {
                    required: "Group ID mapping is required when read groups is enabled"
                }
            },
            groupnameMapping: {
                helperText: "Specify the attribute from the user store that stores the group name.",
                label: "Group Name",
                placeholder: "Ex: groupName",
                validation: {
                    required: "Group name mapping is required when read groups is enabled"
                }
            },
            name: {
                label: "User Store Name",
                placeholder: "ex: MY USER STORE",
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
                placeholder: "Ex: uid",
                validation: {
                    required: "User ID mapping is required"
                }
            },
            usernameMapping: {
                helperText: "Specify the attribute from the user store that represents the user's primary identifier.",
                label: "Username Mapping",
                placeholder: "Ex: un",
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
        typeFetchError: {
            description: "There was an error while fetching the user store types.",
            message: "Something went wrong!"
        }
    },
    pages: {
        create: {
            backButton: "Go back to user stores",
            description: "Onboard the users in your remote user store to {{ productName }}.",
            message: {
                classic: "If your requirement is only for authentication, we recommend using the <1>Optimized User Store Connection</1> for efficiency.",
                optimized: "This configuration supports Authentication Only. User and group management features are not available in this setup. If user management is an essential requirement, please use the <1>Classic User Store Connection</1> instead."
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
        }
    }
};
