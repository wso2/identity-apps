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
import { ConsoleSettingsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const consoleSettings: ConsoleSettingsNS = {
    administrators: {
        add: {
            action: "Thêm quản trị viên",
            options: {
                addExistingUser: "Thêm người dùng hiện có",
                addExternalUser: "Mời quản trị viên đến Asgardeo",
                inviteParentUser: "Mời người dùng tổ chức cha"
            },
            wizard: {
                users: {
                    moreItemsMessage: "Chỉ những người dùng gần đây được liệt kê. Nhập để tìm những người khác ..."
                }
            }
        },
        edit: {
            backButton: "Quay lại Quản trị viên"
        },
        tabLabel: "Quản trị viên"
    },
    invitations: {
        filterOptions: {
            accepted: "Đã chấp nhận",
            pending: "Đang chờ",
            expired: "Đã hết hạn"
        }
    },
    loginFlow: {
        tabLabel: "Luồng đăng nhập"
    },
    protocol: {
        tabLabel: "Giao thức"
    },
    roles: {
        add: {
            organizationPermissions: {
                label: "Quyền tổ chức"
            },
            permissionsCount: "Quyền: {{count}}",
            tenantPermissions: {
                label: "Quyền tổ chức gốc"
            }
        },
        tabLabel: "Vai trò",
        permissionLevels: {
            view: "Xem",
            edit: "Chỉnh sửa",
            selectAll: "Chọn tất cả quyền {{label}}",
            selectAllTenant: "Chọn tất cả quyền tenant",
            selectAllOrganization: "Chọn tất cả quyền tổ chức",
            selectCollection: "Chọn quyền {{collection}} {{label}}",
            selectRowPermission: "Chọn quyền {{collection}}",
            read: "Xem",
            create: "Tạo",
            update: "Cập nhật",
            delete: "Xóa",
            viewRequiredWarning: "Cần có quyền Xem khi các quyền khác đang hoạt động.",
            viewLockedRow: "Không thể tắt quyền Xem khi các quyền khác đang hoạt động.",
            viewSelectAllLocked: "Một số hàng vẫn còn các quyền khác đang hoạt động. Hãy xóa chúng trước.",
            toggleGroupAriaLabel: "Mức quyền",
            toggleViewAriaLabel: "Xem",
            toggleEditAriaLabel: "Chỉnh sửa",
            tenantTableAriaLabel: "Bảng quyền tenant",
            organizationTableAriaLabel: "Bảng quyền tổ chức"
        }
    },
    enterpriseLogin: {
        banner: {
            action: "Liên hệ với chúng tôi",
            description: "Liên hệ với chúng tôi để cấu hình đăng nhập doanh nghiệp cho thiết lập console của bạn.",
            title: "Cấu hình đăng nhập doanh nghiệp"
        },
        configured: {
            connectionLabel: "Kết nối doanh nghiệp",
            description: "Đăng nhập doanh nghiệp đã được cấu hình cho console. Người dùng có thể đăng nhập bằng kết nối doanh nghiệp đã cấu hình.",
            heading: "Cấu hình đăng nhập doanh nghiệp",
            mappingsHeading: "Ánh xạ nhóm-vai trò",
            noMappings: "Chưa cấu hình ánh xạ nhóm-vai trò nào."
        },
        confirmations: {
            removeConfiguration: {
                assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                content: "Thao tác này sẽ xóa kết nối doanh nghiệp khỏi luồng đăng nhập console và xóa tất cả ánh xạ nhóm-vai trò liên kết. Người dùng dựa vào phương thức đăng nhập này sẽ không còn có thể đăng nhập vào console.",
                header: "Bạn có chắc không?",
                message: "Thao tác này không thể hoàn tác và sẽ xóa cấu hình đăng nhập doanh nghiệp.",
                primaryAction: "Xác nhận",
                secondaryAction: "Hủy"
            },
            removeMapping: {
                content: "Ánh xạ nhóm-vai trò này sẽ bị xóa. Nhóm của kết nối sẽ không còn cấp vai trò console liên kết nữa.",
                header: "Xóa ánh xạ nhóm-vai trò?",
                primaryAction: "Xóa",
                secondaryAction: "Hủy"
            }
        },
        form: {
            addMapping: "Thêm ánh xạ",
            connectionLabel: "Kết nối doanh nghiệp",
            createGroup: "Tạo \"{{name}}\" như một nhóm mới'",

            connectionPlaceholder: "Chọn một kết nối doanh nghiệp",
            idpGroupLabel: "Nhóm của kết nối",
            idpGroupPlaceholder: "Chọn hoặc nhập tên nhóm của kết nối",
            mappingDescription: "Ánh xạ các nhóm của kết nối với các vai trò console để cấp cho người dùng mức truy cập phù hợp.",
            roleLabel: "Vai trò console",
            rolePlaceholder: "Chọn một vai trò console",
            sectionHeading: "Cấu hình đăng nhập doanh nghiệp",
            sectionDescription: "Chọn một kết nối doanh nghiệp và ánh xạ các nhóm của nó với các vai trò console. Cần có ít nhất một ánh xạ."
        },
        learnMore: "Tìm hiểu thêm",
        notifications: {
            createGroup: {
                error: {
                    description: "Đã xảy ra lỗi khi tạo nhóm của kết nối.",
                    message: "Lỗi tạo nhóm"
                },
                success: {
                    description: "Nhóm của kết nối đã được tạo thành công.",
                    message: "Đã tạo nhóm"
                }
            },
            deleteConfiguration: {
                error: {
                    description: "Đã xảy ra lỗi khi xóa cấu hình đăng nhập doanh nghiệp.",
                    message: "Lỗi xóa cấu hình"
                },
                success: {
                    description: "Cấu hình đăng nhập doanh nghiệp đã được xóa thành công.",
                    message: "Đã xóa cấu hình"
                }
            },
            fetchConfiguration: {
                error: {
                    description: "Đã xảy ra lỗi khi tải cấu hình đăng nhập doanh nghiệp.",
                    message: "Lỗi tải cấu hình"
                }
            },
            updateConfiguration: {
                error: {
                    description: "Đã xảy ra lỗi khi lưu cấu hình đăng nhập doanh nghiệp.",
                    message: "Lỗi lưu cấu hình"
                },
                success: {
                    description: "Cấu hình đăng nhập doanh nghiệp đã được lưu thành công.",
                    message: "Đã lưu cấu hình"
                }
            }
        },
        actions: {
            configure: "Cấu hình",
            remove: "Xóa đăng nhập doanh nghiệp",
            save: "Lưu",
            update: "Cập nhật"
        },
        tabLabel: "Đăng nhập doanh nghiệp",
        validations: {
            atLeastOneMapping: "Cần có ít nhất một ánh xạ nhóm-vai trò.",
            connectionRequired: "Vui lòng chọn một kết nối doanh nghiệp.",
            duplicateMapping: "Ánh xạ nhóm-vai trò này đã tồn tại.",
            incompleteMapping: "Vui lòng hoàn thành tất cả ánh xạ nhóm-vai trò trước khi lưu."
        }
    },
    sharedAccess: {
        description: "Chọn các tùy chọn sau để chia sẻ các vai trò ứng dụng với các tổ chức.",
        sharingRolesTakeTimeMessage: "Việc chia sẻ vai trò có thể mất một lúc để phản ánh trên toàn tổ chức.",
        selectRolesForOrganization: "Chọn vai trò cho tổ chức",
        organizations: "Tổ chức",
        availableRoles: "Vai trò khả dụng",
        searchAvailableRolesPlaceholder: "Tìm kiếm vai trò khả dụng",
        tabLabel: "Truy cập được chia sẻ",
        modes: {
            doNotShare: "Không chia sẻ bất kỳ vai trò nào",
            shareWithAll: "Chia sẻ một bộ vai trò chung với tất cả tổ chức",
            shareWithSelected: "Chia sẻ bộ vai trò khác nhau với mỗi tổ chức",
            shareAllRolesWithAllOrgs: "Chia sẻ tất cả vai trò với tất cả tổ chức"
        },
        notifications: {
            fetchRoles: {
                error: {
                    description: "Đã xảy ra lỗi khi lấy các vai trò.",
                    message: "Lỗi khi lấy vai trò"
                }
            },
            fetchOrgTree: {
                error: {
                    description: "Đã xảy ra lỗi khi lấy cây tổ chức.",
                    message: "Lỗi khi lấy cây tổ chức"
                }
            },
            shareRoles: {
                error: {
                    description: "Đã xảy ra lỗi khi chia sẻ các vai trò.",
                    message: "Lỗi khi chia sẻ vai trò"
                },
                success: {
                    description: "Các vai trò đã được chia sẻ thành công.",
                    message: "Chia sẻ vai trò thành công"
                }
            }
        }
    }
};
