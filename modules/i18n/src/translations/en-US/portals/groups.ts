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
import { groupsNS } from "../../../models";

export const groups:groupsNS ={
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "E.g. group name."
                },
                filterCondition: {
                    placeholder: "E.g. Starts with etc."
                },
                filterValue: {
                    placeholder: "Enter value to search"
                }
            }
        },
        placeholder: "Search by group name"
    },
    edit: {
        basics: {
            fields: {
                groupName: {
                    name: "Group Name",
                    placeholder: "Enter group name",
                    required: "Group name is required"
                }
            }
        },
        roles: {
            addRolesModal: {
                heading: "Update Group Roles",
                subHeading: "Add new roles or remove existing roles assigned to the group."
            },
            heading: "Assigned Roles",
            placeHolders: {
                emptyListPlaceholder: {
                    subtitles: "There are no roles assigned to this group at the moment.",
                    title: "No Roles Assigned"
                }
            },
            subHeading: "View assigned roles for the group."
        }
    },
    list: {
        columns: {
            actions: "Actions",
            lastModified: "Modified Time",
            name: "Group",
            source: "User Store"
        },
        storeOptions: "Select User Store"
    },
    notifications: {
        createGroup: {
            error: {
                description: "{{description}}",
                message: "Error occurred while creating the group."
            },
            genericError: {
                description: "Couldn't create the group.",
                message: "Something went wrong"
            },
            success: {
                description: "The group was created successfully.",
                message: "Group created successfully."
            }
        },
        createPermission: {
            error: {
                description: "{{description}}",
                message: "Error occurred while adding permission to group."
            },
            genericError: {
                description: "Couldn't add permissions to group.",
                message: "Something went wrong"
            },
            success: {
                description: "Permissions were successfully added to the group.",
                message: "Group created successfully."
            }
        },
        deleteGroup: {
            error: {
                description: "{{description}}",
                message: "Error deleting the selected group."
            },
            genericError: {
                description: "Couldn't remove the selected group.",
                message: "Something went wrong"
            },
            success: {
                description: "The selected group was deleted successfully.",
                message: "Group deleted successfully"
            }
        },
        fetchGroups: {
            genericError: {
                description: "An error occurred while fetching groups.",
                message: "Something went wrong"
            }
        },
        updateGroup: {
            error: {
                description: "{{description}}",
                message: "Error updating the selected group."
            },
            genericError: {
                description: "Couldn't update the selected group.",
                message: "Something went wrong"
            },
            success: {
                description: "The selected group was updated successfully.",
                message: "Group updated successfully"
            }
        }
    },
    placeholders: {
        groupsError: {
            subtitles: [
                "An error occurred while trying to fetch groups from the user store.",
                "Please make sure that the connection details of the user store are accurate."
            ],
            title:"Couldn't fetch groups from the user store"
        }
    }
};
