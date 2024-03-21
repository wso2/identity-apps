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
import { inviteNS } from "../../../models";

export const invite: inviteNS = {
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
                    placeholder: "E.g. Email etc."
                },
                filterCondition: {
                    placeholder: "E.g. Starts with etc."
                },
                filterValue: {
                    placeholder: "Enter value to search"
                }
            }
        },
        placeholder: "Search by Email"
    },
    confirmationModal: {
        deleteInvite: {
            assertionHint: "Please confirm your action.",
            content: "If you revoke this invite, the user will not be able to onboard your organization. " +
                "Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently revoke the invite."
        },
        resendInvite: {
            assertionHint: "Please confirm your action.",
            content: "If you resend the invitation, the previous invitation link will be revoked. " +
                "Please proceed with caution.",
            header: "Are you sure?",
            message: "This action will permanently revoke the previous invitation."
        }
    },
    form: {
        sendmail: {
            subTitle: "Send an email invite to add a new admin or developer to your organization",
            title: "Invite Admin/Developer"
        }
    },
    inviteButton: "New Invitation",
    notifications: {
        deleteInvite: {
            error: {
                description: "{{description}}",
                message: "Error while deleting the invitation"
            },
            genericError: {
                description: "Couldn't delete the invitation",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully deleted the user's invitation.",
                message: "Invitation deletion successful"
            }
        },
        resendInvite: {
            error: {
                description: "{{description}}",
                message: "Error while resending the invitation"
            },
            genericError: {
                description: "Couldn't resend the invitation",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully resent the invitation via email.",
                message: "Invitation resent"
            }
        },
        sendInvite: {
            error: {
                description: "{{description}}",
                message: "Error while sending the invitation"
            },
            genericError: {
                description: "Couldn't send the invitation",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully sent the invitation via email.",
                message: "Invitation sent"
            }
        },
        updateInvite: {
            error: {
                description: "{{description}}",
                message: "Error while updating the invite"
            },
            genericError: {
                description: "Couldn't update the invite",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully updated the invite.",
                message: "Invitation update successful"
            }
        }
    },
    placeholder: {
        emptyResultPlaceholder: {
            addButton: "New Invitation",
            subTitle: {
                0: "There are currently no invitations available.",
                1: "You can create an organization and invite users",
                2: "to get onboarded to you organization."
            },
            title: "Send a New Invite"
        },
        emptySearchResultPlaceholder: {
            clearButton: "Clear search query",
            subTitle: {
                0: "We couldn't find any results for {{query}}",
                1: "Please try a different search term."
            },
            title: "No results found"
        }
    },
    rolesUpdateModal: {
        header: "Update Invitee Roles",
        searchPlaceholder: "Search by role name",
        subHeader: "Add or remove roles from the user that you have invited."
    },
    subSelection: {
        invitees: "Invitees",
        onBoard: "Onboarded Users"
    }
};
