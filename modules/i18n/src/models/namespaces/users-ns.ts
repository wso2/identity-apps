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

export interface usersNS {
    addUserType: {
        createUser: {
            title: string;
            description: string;
        };
        inviteParentUser: {
            title: string;
            description: string;
        };
    };
    consumerUsers: {
        fields: {
            username: {
                label: string;
                placeholder: string;
                validations: {
                    empty: string;
                    invalid: string;
                    invalidCharacters: string;
                    regExViolation: string;
                };
            };
        };
    };
    guestUsers: {
        fields: {
            username: {
                label: string;
                placeholder: string;
                validations: {
                    empty: string;
                    invalid: string;
                    invalidCharacters: string;
                    regExViolation: string;
                };
            };
        };
    };
    confirmations: {
        terminateAllSessions: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
        terminateSession: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
        addMultipleUser: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
    };
    editUser: {
        tab: {
            menuItems: {
                0: string;
                1: string;
                2: string;
                3: string;
            };
        };
        placeholders: {
            undefinedUser: {
                action: string;
                title: string;
                subtitles: string;
            };
        };
    };
    userSessions: {
        components: {
            sessionDetails: {
                actions: {
                    terminateAllSessions: string;
                    terminateSession: string;
                };
                labels: {
                    browser: string;
                    deviceModel: string;
                    ip: string;
                    lastAccessed: string;
                    loggedInAs: string;
                    loginTime: string;
                    os: string;
                    recentActivity: string;
                    activeApplication: string;
                };
            };
        };
        dangerZones: {
            terminate: {
                actionTitle: string;
                header: string;
                subheader: string;
            };
        };
        notifications: {
            getUserSessions: {
                error: {
                    message: string;
                    description: string;
                };
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            terminateAllUserSessions: {
                error: {
                    message: string;
                    description: string;
                };
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            terminateUserSession: {
                error: {
                    message: string;
                    description: string;
                };
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            getAdminUser: {
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
            emptyListPlaceholder: {
                title: string;
                subtitles: string;
            };
        };
    };
    advancedSearch: {
        form: {
            dropdown: {
                filterAttributeOptions: {
                    username: string;
                    email: string;
                };
            };
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
    all: {
        heading: string;
        subHeading: string;
    };
    buttons: {
        addNewUserBtn: string;
        assignUserRoleBtn: string;
        metaColumnBtn: string;
    };
    addUserDropDown: {
        addNewUser: string;
        bulkImport: string;
    };
    forms: {
        validation: {
            formatError: string;
            dateFormatError: string;
            mobileFormatError: string;
            futureDateError: string;
        };
    };
    list: {
        columns: {
            actions: string;
            name: string;
        };
    };
    notifications: {
        addUser: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        addUserPendingApproval: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        bulkImportUser: {
            validation: {
                emptyRowError: {
                    message: string;
                    description: string;
                };
                columnMismatchError: {
                    message: string;
                    description: string;
                };
                emptyHeaderError: {
                    message: string;
                    description: string;
                };
                missingRequiredHeaderError: {
                    message: string;
                    description: string;
                };
                blockedHeaderError: {
                    message: string;
                    description: string;
                };
                duplicateHeaderError: {
                    message: string;
                    description: string;
                };
                invalidHeaderError: {
                    message: string;
                    description: string;
                };
                emptyDataField: {
                    message: string;
                    description: string;
                };
                invalidRole: {
                    message: string;
                    description: string;
                };
                invalidGroup: {
                    message: string;
                    description: string;
                };
            };
            submit: {
                error: {
                    message: string;
                    description: string;
                };
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            timeOut: {
                message: string;
                description: string;
            };
        };
        deleteUser: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchUsers: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        getAdminRole: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        impersonateUser: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        revokeAdmin: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
    };
    placeholders: {
        emptyList: {
            action: string;
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
        };
        userstoreError: {
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
        };
    };
    usersList: {
        list: {
            emptyResultPlaceholder: {
                addButton: string;
                emptyUsers: string;
                subTitle: {
                    0: string;
                    1: string;
                    2: string;
                };
                title: string;
            };
            iconPopups: {
                delete: string;
                edit: string;
            };
        };
        metaOptions: {
            heading: string;
            columns: {
                name: string;
                emails: string;
                id: string;
                userName: string;
                lastModified: string;
            };
        };
        search: {
            emptyResultPlaceholder: {
                clearButton: string;
                subTitle: {
                    0: string;
                    1: string;
                };
                title: string;
            };
        };
    };
    userstores: {
        userstoreOptions: {
            all: string;
            primary: string;
        };
    };
}
