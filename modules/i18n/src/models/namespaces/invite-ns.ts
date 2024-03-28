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

export interface inviteNS {
    inviteButton: string;
    subSelection: {
        onBoard: string;
        invitees: string;
    };
    notifications: {
        deleteInvite: {
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
        resendInvite: {
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
        sendInvite: {
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
        updateInvite: {
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
    confirmationModal: {
        deleteInvite: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
        resendInvite: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
    };
    placeholder: {
        emptySearchResultPlaceholder: {
            clearButton: string;
            subTitle: {
                0: string;
                1: string;
            };
            title: string;
        };
        emptyResultPlaceholder: {
            addButton: string;
            subTitle: {
                0: string;
                1: string;
                2: string;
            };
            title: string;
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
    form: {
        sendmail: {
            title: string;
            subTitle: string;
        };
    };
    rolesUpdateModal: {
        header: string;
        subHeader: string;
        searchPlaceholder: string;
    };
}
