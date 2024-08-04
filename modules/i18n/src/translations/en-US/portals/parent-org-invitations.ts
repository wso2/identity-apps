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
import { parentOrgInvitationsNS } from "../../../models";

export const parentOrgInvitations: parentOrgInvitationsNS = {
    addUserWizard: {
        heading: "Invite Parent Users",
        description: "Invite users from the parent organization.",
        hint: "Invited users are managed by the parent organization.",
        username: {
            label: "Usernames",
            placeholder: "Enter the usernames",
            hint: "Add the username of a parent user and press enter. Repeat to include multiple users.",
            validations: {
                required: "At least one user should be selected."
            }
        },
        groups: {
            label: "Groups",
            placeholder: "Select groups",
            hint: "Assign groups for the user that is being invited.",
            validations: {
                required: "Groups is a required field."
            }
        },
        inviteButton: "Invite"
    },
    tab: {
        usersTab: "Users",
        invitationsTab: "Invitations"
    },
    searchPlaceholder: "Search by Username",
    searchdropdown: {
        pendingLabel: "Pending",
        expiredLabel: "Expired"
    },
    createDropdown: {
        createLabel: "Create User",
        inviteLabel: "Invite Parent User"
    },
    filterLabel: "Filter by: ",
    emptyPlaceholder: {
        noPendingInvitations: "There are no pending invitations at the moment.",
        noExpiredInvitations: "There are expired invitations at the moment.",
        noInvitations: "There are no invitations at the moment.",
        noCollaboratorUserInvitations: "There are no collaborator users with expired invitations at the moment."
    },
    invitedUserLabel: "Managed by parent organization"
};
