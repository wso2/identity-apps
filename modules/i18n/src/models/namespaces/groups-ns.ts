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
export interface groupsNS {
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
    edit: {
        basics: {
            fields: {
                groupName: {
                    name: string;
                    required: string;
                    placeholder: string;
                };
            };
        };
        roles: {
            addRolesModal: {
                heading: string;
                subHeading: string;
            };
            heading: string;
            subHeading: string;
            placeHolders: {
                emptyListPlaceholder: {
                    title: string;
                    subtitles: string;
                };
            };
        };
    };
    list: {
        columns: {
            actions: string;
            lastModified: string;
            name: string;
            source: string;
        };
        storeOptions: string;
    };
    notifications: {
        deleteGroup: {
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
        updateGroup: {
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
        createGroup: {
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
        createPermission: {
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
        fetchGroups: {
            genericError: {
                message: string;
                description: string;
            };
        };
    };
    placeholders: {
        groupsError: {
            title: string;
            subtitles: string[];
        };
    };
}
