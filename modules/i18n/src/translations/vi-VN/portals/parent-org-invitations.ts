/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
        heading: "Mời người dùng tổ chức cha",
        description: "Mời người dùng từ tổ chức cha.",
        hint: "Người dùng được mời được quản lý bởi tổ chức cha.",
        username: {
            label: "Tên đăng nhập",
            placeholder: "Nhập tên đăng nhập",
            hint: "Thêm tên đăng nhập của một người dùng tổ chức cha và nhấn enter. Lặp lại để thêm nhiều người dùng.",
            validations: {
                required: "Cần chọn ít nhất một người dùng."
            }
        },
        groups: {
            label: "Nhóm",
            placeholder: "Chọn nhóm",
            hint: "Gán nhóm cho người dùng đang được mời.",
            validations: {
                required: "Nhóm là trường bắt buộc."
            }
        },
        inviteButton: "Mời"
    },
    tab: {
        usersTab: "Người dùng",
        invitationsTab: "Lời mời"
    },
    searchPlaceholder: "Tìm kiếm theo tên đăng nhập",
    searchdropdown: {
        pendingLabel: "Đang chờ",
        expiredLabel: "Đã hết hạn"
    },
    createDropdown: {
        createLabel: "Tạo người dùng",
        inviteLabel: "Mời người dùng tổ chức cha"
    },
    filterLabel: "Lọc theo: ",
    emptyPlaceholder: {
        noPendingInvitations: "Hiện tại không có lời mời nào đang chờ xử lý.",
        noExpiredInvitations: "Hiện tại có các lời mời đã hết hạn.",
        noInvitations: "Hiện tại không có lời mời nào.",
        noCollaboratorUserInvitations: "Hiện tại không có người dùng cộng tác nào với lời mời đã hết hạn."
    },
    invitedUserLabel: "Được quản lý bởi tổ chức cha"
};
