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
import { usersNS } from "../../../models";

export const users: usersNS = {
    addUserDropDown: {
        addNewUser:  "Single User",
        bulkImport: "Multiple Users"
    },
    addUserType: {
        createUser: {
            description: "Create a user in your organization.",
            title: "Create user"
        },
        inviteParentUser: {
            description: "Invite user from the parent organization.",
            title: "Invite parent user"
        }
    },
    advancedSearch: {
        form: {
            dropdown: {
                filterAttributeOptions: {
                    email: "Email",
                    username: "Username"
                }
            },
            inputs: {
                filterAttribute: {
                    placeholder: "E.g. Username, Email etc."
                },
                filterCondition: {
                    placeholder: "E.g. Starts with etc."
                },
                filterValue: {
                    placeholder: "Enter value to search"
                }
            }
        },
        placeholder: "Search by Username"
    },
    all: {
        heading: "Users",
        subHeading: "Add and manage user accounts, assign roles to the users and maintain user identities."
    },
    buttons: {
        addNewUserBtn: "New User",
        assignUserRoleBtn: "Assign roles",
        metaColumnBtn: "Columns"
    },
    confirmations: {
        addMultipleUser: {
            assertionHint: "Please confirm your action.",
            content: "Invite User to Set Password should be enabled to add multiple users. " +
                "Please enable email invitations for user password setup from <1>Login & Registration settings</1>.",
            header: "Before you proceed",
            message: "Invite users option is disabled"
        },
        terminateAllSessions: {
            assertionHint: "Please confirm your action.",
            content: "If you proceed with this action, the user will be logged out of all active " +
                "sessions. They will loose the progress of any ongoing tasks. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently terminate all the active sessions."
        },
        terminateSession: {
            assertionHint: "Please confirm your action.",
            content: "If you proceed with this action, the user will be logged out of the selected " +
                "session. They will loose the progress of any ongoing tasks. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently terminate the session."
        }
    },
    consumerUsers: {
        fields: {
            username: {
                label: "Username",
                placeholder: "Enter the username",
                validations: {
                    empty: "Username is a required field",
                    invalid: "A user already exists with this username.",
                    invalidCharacters: "Username seems to contain invalid characters.",
                    regExViolation: "Please enter a valid email address."
                }
            }
        }
    },
    editUser: {
        placeholders: {
            undefinedUser: {
                action: "Go back to users",
                subtitles: "It looks like the requested user does not exist.",
                title: "User not found"
            }
        },
        tab: {
            menuItems: {
                0: "Profile",
                1: "Groups",
                2: "Roles",
                3: "Active Sessions"
            }
        }
    },
    forms: {
        validation: {
            dateFormatError: "The format of the {{field}} entered is incorrect. Valid format is " +
                "YYYY-MM-DD.",
            formatError: "The format of the {{field}} entered is incorrect.",
            futureDateError: "The date you entered for the {{field}} field is invalid.",
            mobileFormatError: "The format of the {{field}} entered is incorrect.  Valid format is " +
                "[+][country code][area code][local phone number]."
        }
    },
    guestUsers: {
        fields: {
            username: {
                label: "Username",
                placeholder: "Enter the username",
                validations: {
                    empty: "Username is a required field",
                    invalid: "A user already exists with this username.",
                    invalidCharacters: "Username seems to contain invalid characters.",
                    regExViolation: "Please enter a valid email address."
                }
            }
        }
    },
    list: {
        columns: {
            actions: "Actions",
            name: "Name"
        }
    },
    notifications: {
        addUser: {
            error: {
                description: "{{description}}",
                message: "Error adding the new user"
            },
            genericError: {
                description: "Couldn't add the new user",
                message: "Something went wrong"
            },
            success: {
                description: "The new user was added successfully.",
                message: "User added successfully"
            }
        },
        addUserPendingApproval: {
            error: {
                description: "{{description}}",
                message: "Error adding the new user"
            },
            genericError: {
                description: "Couldn't add the new user",
                message: "Something went wrong"
            },
            success: {
                description: "The new user was accepted and pending approval.",
                message: "User accepted for creation"
            }
        },
        bulkImportUser: {
            submit: {
                error: {
                    description: "{{description}}",
                    message: "Error occured while importing users"
                },
                genericError: {
                    description: "Unable to import users",
                    message: "Error occured while importing users"
                },
                success: {
                    description: "The users were imported successfully.",
                    message: "Users Imported Successfully"
                }
            },
            timeOut: {
                description: "Some users may not have been created.",
                message: "The request has timed out"
            },validation: {
                blockedHeaderError: {
                    description: "The following header(s) are not allowed: {{headers}}.",
                    message: "Blocked Column Headers"
                },
                columnMismatchError: {
                    description: "Some data rows of the file does not match the required column count. " +
                        "Please review and correct the data.",
                    message: "Column Count Mismatch"
                },
                duplicateHeaderError: {
                    description: "The following headers are duplicated: {{headers}}.",
                    message: "Duplicate Column Headers"
                },
                emptyDataField: {
                    description: "The data field '{{dataField}}' must not be empty.",
                    message: "Empty Data Field"
                },
                emptyHeaderError: {
                    description: "Ensure that the first row contains the headers for each column.",
                    message: "Missing Column Headers"
                },
                emptyRowError: {
                    description: "Selected file contains no data.",
                    message: "Empty File"
                },
                invalidGroup: {
                    description: "{{group}} does not exist.",
                    message: "Group Not Found"
                },
                invalidHeaderError: {
                    description: "The following headers are invalid: {{headers}}.",
                    message: "Invalid Column Headers"
                },

                invalidRole: {
                    description: "{{role}} does not exist.",
                    message: "Role Not Found"
                },
                missingRequiredHeaderError: {
                    description: "The following header(s) are required but are missing in the CSV file: " +
                    "{{ headers }}.",
                    message: "Missing Required Column Headers"
                }
            }
        },
        deleteUser: {
            error: {
                description: "{{description}}",
                message: "Error deleting the user"
            },
            genericError: {
                description: "Couldn't delete the user",
                message: "Something went wrong"
            },
            success: {
                description: "The user was deleted successfully.",
                message: "User deleted successfully"
            }
        },
        fetchUsers: {
            error: {
                description: "{{description}}",
                message: "Error retrieving users"
            },
            genericError: {
                description: "Couldn't retrieve users",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved the users.",
                message: "Users retrieval successful"
            }
        },
        getAdminRole: {
            error: {
                description: "{{description}}",
                message: "Error retrieving the admin role"
            },
            genericError: {
                description: "Couldn't retrieve the admin roles.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved the admin roles.",
                message: "Role retrieval successful"
            }
        },
        impersonateUser: {
            error: {
                description: "Couldn't impersonate user.",
                message: "Error impersonating user"
            },
            genericError: {
                description: "Couldn't impersonate user.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully impersonated the user.",
                message: "User impersonation successful"
            }
        },
        revokeAdmin: {
            error: {
                description: "{{description}}",
                message: "Error revoking the admin privileges"
            },
            genericError: {
                description: "Couldn't revoke the admin privileges.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully revoked the admin privileges.",
                message: "Privileges revoked successfully"
            }
        }
    },
    placeholders: {
        emptyList: {
            action: "Refresh list",
            subtitles: {
                0: "The users list returned empty.",
                1: "Something went wrong while fetching the user list"
            },
            title: "No Users Found"
        },
        userstoreError: {
            subtitles: {
                0: "Couldn't fetch users from the user store",
                1: "Please try again"
            },
            title: "Something went wrong"
        }
    },
    userSessions: {
        components: {
            sessionDetails: {
                actions: {
                    terminateAllSessions: "Terminate All",
                    terminateSession: "Terminate Session"
                },
                labels: {
                    activeApplication: "Active Applications",
                    browser: "Browser",
                    deviceModel: "Device Model",
                    ip: "IP Address",
                    lastAccessed: "Last Accessed {{ date }}",
                    loggedInAs: "Logged in on <1>{{ app }}</1> as <3>{{ user }}</3>",
                    loginTime: "Login Time",
                    os: "Operating System",
                    recentActivity: "Recent Activity"
                }
            }
        },
        dangerZones: {
            terminate: {
                actionTitle: "Terminate",
                header: "Terminate session",
                subheader: "You will be logged out of the session on the particular device."
            }
        },
        notifications: {
            getAdminUser: {
                error: {
                    description: "{{ description }}",
                    message: "Retrieval Error"
                },
                genericError: {
                    description: "An error occurred while retrieving the current user type.",
                    message: "Retrieval Error"
                }
            },
            getUserSessions: {
                error: {
                    description: "{{ description }}",
                    message: "Retrieval Error"
                },
                genericError: {
                    description: "An error occurred while retrieving user sessions.",
                    message: "Retrieval Error"
                },
                success: {
                    description: "Successfully retrieved user sessions.",
                    message: "Retrieval Successful"
                }
            },
            terminateAllUserSessions: {
                error: {
                    description: "{{ description }}",
                    message: "Termination Error"
                },
                genericError: {
                    description: "An error occurred while terminating the user sessions.",
                    message: "Termination Error"
                },
                success: {
                    description: "Successfully terminated all the user sessions.",
                    message: "Termination Successful"
                }
            },
            terminateUserSession: {
                error: {
                    description: "{{ description }}",
                    message: "Termination Error"
                },
                genericError: {
                    description: "An error occurred while terminating the user session.",
                    message: "Termination Error"
                },
                success: {
                    description: "Successfully terminated the user session.",
                    message: "Termination Successful"
                }
            }
        },
        placeholders: {
            emptyListPlaceholder: {
                subtitles: "There are no active sessions for this user.",
                title: "No active sessions"
            }
        }
    },
    usersList: {
        list: {
            emptyResultPlaceholder: {
                addButton: "New User",
                emptyUsers: "No users found",
                subTitle: {
                    0: "There are currently no users available.",
                    1: "You can add a new user easily by following the",
                    2: "steps in the user creation wizard."
                },
                title: "Add a new User"
            },
            iconPopups: {
                delete: "Delete",
                edit: "Edit"
            }
        },
        metaOptions: {
            columns: {
                emails: "Email",
                id: "User id",
                lastModified: "Last modified",
                name: "Name",
                userName: "Username"
            },
            heading: "Show Columns"
        },
        search: {
            emptyResultPlaceholder: {
                clearButton: "Clear search query",
                subTitle: {
                    0: "We couldn't find any results for {{query}}",
                    1: "Please try a different search term."
                },
                title: "No results found"
            }
        }
    },
    userstores: {
        userstoreOptions: {
            all: "All user stores",
            primary: "Primary"
        }
    }
};
