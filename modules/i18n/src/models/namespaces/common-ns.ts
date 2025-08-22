/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Schema for the common namespace
 */
export interface CommonNS {
    access: string;
    actions: string;
    activate: string;
    active: string;
    add: string;
    addKey: string;
    addURL: string;
    all: string;
    applicationName: string;
    applications: string;
    approvalStatus: string;
    approve: string;
    approved: string;
    rejected: string;
    approvals: string;
    approvalsPage: {
        list: {
            columns: {
                actions: string;
                name: string;
            };
        };
        title: string;
        notifications: {
            fetchApprovalDetails: {
                error: {
                    message: string;
                    description: string;
                };
                genericError: {
                    message: string;
                    description: string;
                };
            };
            fetchPendingApprovals: {
                error: {
                    message: string;
                    description: string;
                };
                genericError: {
                    message: string;
                    description: string;
                };
            };
            updatePendingApprovals: {
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
                emptyApprovalList: {
                    action: string;
                    title: string;
                    subtitles: {
                        0: string;
                        1: string;
                        2: string;
                    };
                };
                emptyApprovalFilter: {
                    action: string;
                    title: string;
                    subtitles: {
                        0: string;
                        1: string;
                        2: string;
                    };
                };
                emptySearchResults: {
                    action: string;
                    title: string;
                    subtitles: {
                        0: string;
                        1: string;
                        2: string;
                    };
                };
                searchApprovals: string;
            };
        subTitle: string;
        modals: {
            header: string;
            subHeader: string;
            description: string;
        };
        propertyMessages: {
            assignedUsersDeleted: string;
            roleDeleted: string;
            selfRegistration: string;
            unassignedUsersDeleted: string;
        };
    }
    apps: string;
    assignee: string;
    assignees: string;
    authenticator: string;
    authentication: string;
    authenticator_plural: string;
    back: string;
    beta: string;
    browser: string;
    cancel: string;
    challengeQuestionNumber: string;
    change: string;
    chunkLoadErrorMessage: {
        heading: string;
        description: string;
        primaryActionText: string;
    }
    claim: string;
    clear: string;
    clientId: string;
    close: string;
    comingSoon: string;
    completed: string;
    configure: string;
    confirm: string;
    contains: string;
    continue: string;
    copyToClipboard: string;
    createdOn: string;
    create: string;
    dangerZone: string;
    darkMode: string;
    delete: string;
    deprecated: string;
    description: string;
    deviceModel: string;
    docs: string;
    documentation: string;
    done: string;
    download: string;
    drag: string;
    duplicateURLError: string;
    edit: string;
    endsWith: string;
    equals: string;
    exitFullScreen: string;
    experimental: string;
    explore: string;
    export: string;
    featureAvailable: string;
    filter: string;
    finish: string;
    goBackHome: string;
    goFullScreen: string;
    help: string;
    hide: string;
    hidePassword: string;
    identityProviders: string;
    import: string;
    initiator: string;
    ipAddress: string;
    issuer: string;
    lastAccessed: string;
    lastModified: string;
    lastSeen: string;
    lastUpdatedOn: string;
    learnMore: string;
    lightMode: string;
    loading: string;
    loginTime: string;
    logout: string;
    maximize: string;
    maxValidation: string;
    metaAttributes: string;
    minimize: string;
    minValidation: string;
    minutes: string;
    more: string;
    myAccount: string;
    name: string;
    new: string;
    next: string;
    organizationName: string;
    operatingSystem: string;
    operations: string;
    overview: string;
    personalInfo: string;
    pin: string;
    pinned: string;
    premium: string;
    preview: string;
    previous: string;
    priority: string;
    privacy: string;
    properties: string;
    publish: string;
    ready: string;
    regenerate: string;
    register: string;
    removeAll: string;
    reject: string;
    release: string;
    remove: string;
    reserved: string;
    resetFilters: string;
    retry: string;
    revoke: string;
    revokeAll: string;
    required: string;
    samples: string;
    save: string;
    services: string;
    sdks: string;
    search: string;
    searching: string;
    security: string;
    selectAll: string;
    selectNone: string;
    settings: string;
    setup: string;
    show: string;
    showAll: string;
    showLess: string;
    showMore: string;
    showPassword: string;
    skip: string;
    generatePassword: string;
    startsWith: string;
    step: string;
    submit: string;
    switch: string;
    technologies: string;
    terminate: string;
    terminateAll: string;
    terminateSession: string;
    type: string;
    unpin: string;
    unpinned: string;
    update: string;
    user: string;
    verify: string;
    view: string;
    weakPassword: string;
    good: string;
    strong: string;
    weak: string;
    tooShort: string;
    okay: string;
    enabled: string;
    disabled: string;
    enable: string;
    disable: string;
    networkErrorMessage: {
        heading: string;
        description: string;
        primaryActionText: string;
    },
    noResultsFound: string;
    pressEnterPrompt: string;
    verified: string;
    primary: string;
    makePrimary: string;
    asyncOperationErrorMessage: {
        description: string;
        message: string;
    },
    saveDraft: string;
}
