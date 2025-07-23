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

import { CommonNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const common: CommonNS = {
    access: "Access",
    actions: "Actions",
    activate: "Activate",
    active: "Active",
    add: "Add",
    addKey: "Add secret",
    addURL: "Add URL",
    all: "All",
    applicationName: "Application name",
    applications: "Applications",
    approvalStatus: "Approval Status",
    approvals: "Approvals",
    approvalsPage: {
        list: {
            columns: {
                actions: "Actions",
                name: "Name"
            }
        },
        modals: {
            description: "You can approve or reject the task from here.",
            header: "Approval Task",
            subHeader: "Review the details of the approval task."
        },
        notifications: {
            fetchApprovalDetails: {
                error: {
                    description: "{{description}}",
                    message: "Error fetching approval details"
                },
                genericError: {
                    description: "Couldn't retrieve the approval details.",
                    message: "Something went wrong"
                }
            },
            fetchPendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "Error fetching pending approvals"
                },
                genericError: {
                    description: "Couldn't retrieve the pending approvals.",
                    message: "Something went wrong"
                }
            },
            updatePendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "Error updating the approval"
                },
                genericError: {
                    description: "Couldn't update the pending approval.",
                    message: "Something went wrong"
                },
                success: {
                    description: "Successfully updated the approval.",
                    message: "Update successful"
                }
            }
        },
        placeholders: {
            emptyApprovalFilter: {
                action: "View all",
                subtitles: {
                    0: "There are currently no approvals in {{status}} state.",
                    1: "Please check if you have any tasks in {{status}} state to",
                    2: "view them here."
                },
                title: "No results found"
            },
            emptyApprovalList: {
                action: "",
                subtitles: {
                    0: "There are currently no approvals to review.",
                    1: "Please check if you have added a workflow to control the operations in the system.",
                    2: ""
                },
                title: "No Approvals"
            },
            emptySearchResults: {
                action: "View all",
                subtitles: {
                    0: "We couldn't find the workflow you searched for.",
                    1: "Please check if you have a workflow with that name in",
                    2: "the system."
                },
                title: "No Approvals"
            },
            searchApprovals: "Search by workflow name"
        },
        subTitle: "Review operational tasks that requires your approval",
        title: "Approvals"
    },
    approve: "Approve",
    apps: "Apps",
    assignee: "Assignee",
    assignees: "Assignees",
    asyncOperationErrorMessage: {
        description: "Something went wrong",
        message: "An unexpected error occured. Please check back later."
    },
    authentication: "Authentication",
    authenticator: "Authenticator",
    authenticator_plural: "Authenticators",
    back: "Back",
    beta: "Beta",
    browser: "Browser",
    cancel: "Cancel",
    challengeQuestionNumber: "Challenge Question {{number}}",
    change: "Change",
    chunkLoadErrorMessage: {
        description: "An error occurred when serving the requested application. Please try reloading the app.",
        heading: "Something went wrong",
        primaryActionText: "Reload the App"
    },
    claim: "Claim",
    clear: "Clear",
    clientId: "Client ID",
    close: "Close",
    comingSoon: "Coming soon",
    completed: "Completed",
    configure: "Configure",
    confirm: "Confirm",
    contains: "Contains",
    continue: "Continue",
    copyToClipboard: "Copy to clipboard",
    create: "Create",
    createdOn: "Created on",
    dangerZone: "Danger Zone",
    darkMode: "Dark mode",
    delete: "Delete",
    deprecated: "This configuration is deprecated and will be removed in a future release.",
    description: "Description",
    deviceModel: "Device model",
    disable: "Disable",
    disabled: "Disabled",
    docs: "Docs",
    documentation: "Documentation",
    done: "Done",
    download: "Download",
    drag: "Drag",
    duplicateURLError: "This value is already added",
    edit: "Edit",
    enable: "Enable",
    enabled: "Enabled",
    endsWith: "Ends with",
    equals: "Equals",
    exitFullScreen: "Exit full-screen",
    experimental: "Experimental",
    explore: "Explore",
    export: "Export",
    featureAvailable: "This feature will be available soon!",
    filter: "Filter",
    finish: "Finish",
    generatePassword: "Generate password",
    goBackHome: "Go back home",
    goFullScreen: "Go full-screen",
    good: "Good",
    help: "Help",
    hide: "Hide",
    hidePassword: "Hide password",
    identityProviders: "Identity Providers",
    import: "Import",
    initiator: "Initiator",
    ipAddress: "IP address",
    issuer: "Issuer",
    lastAccessed: "Last accessed",
    lastModified: "Last modified",
    lastSeen: "Last seen",
    lastUpdatedOn: "Last updated on",
    learnMore: "Learn More",
    lightMode: "Light mode",
    loading: "Loading",
    loginTime: "Login time",
    logout: "Logout",
    makePrimary: "Make primary",
    maxValidation: "This value should be less than or equal to {{max}}.",
    maximize: "Maximize",
    metaAttributes: "Meta Attributes",
    minValidation: "This value should be greater than or equal to {{min}}.",
    minimize: "Minimize",
    minutes: "mins",
    more: "More",
    myAccount: "My Account",
    name: "Name",
    networkErrorMessage: {
        description: "Please try signing in again.",
        heading: "Your session has expired",
        primaryActionText: "Sign In"
    },
    new: "New",
    next: "Next",
    noResultsFound: "No results found",
    okay: "Okay",
    operatingSystem: "Operating system",
    operations: "Operations",
    organizationName: "{{orgName}} organization",
    overview: "Overview",
    personalInfo: "Personal Info",
    pin: "Pin",
    pinned: "Pinned",
    premium: "Premium",
    pressEnterPrompt: "Press <1>Enter</1> to select",
    preview: "Preview",
    previous: "Previous",
    primary: "Primary",
    priority: "Priority",
    privacy: "Privacy",
    properties: "Properties",
    publish: "Publish",
    ready: "Ready",
    regenerate: "Regenerate",
    register: "Register",
    reject: "Reject",
    release: "Release",
    remove: "Remove",
    removeAll: "Remove all",
    required: "This is required.",
    reserved: "Reserved",
    resetFilters: "Reset filters",
    retry: "Retry",
    revoke: "Revoke",
    revokeAll: "Revoke all",
    samples: "Samples",
    save: "Save",
    saveDraft: "Save draft",
    sdks: "SDKs",
    search: "Search",
    searching: "Searching",
    security: "Security",
    services: "Services",
    settings: "Settings",
    setup: "Set up",
    show: "Show",
    showAll: "Show all",
    showLess: "Show less",
    showMore: "Show more",
    showPassword: "Show password",
    skip: "Skip",
    startsWith: "Starts with",
    step: "Step",
    strong: "Strong",
    submit: "Submit",
    switch: "Switch",
    technologies: "Technologies",
    terminate: "Terminate",
    terminateAll: "Terminate all",
    terminateSession: "Terminate session",
    tooShort: "Too short",
    type: "Type",
    unpin: "Unpin",
    unpinned: "Unpinned",
    update: "Update",
    user: "User",
    verified: "Verified",
    verify: "Verify",
    view: "View",
    weak: "Weak",
    weakPassword: "The password strength should at least be good."
};
