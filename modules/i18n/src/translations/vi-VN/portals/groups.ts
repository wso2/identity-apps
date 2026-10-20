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
import { groupsNS } from "../../../models";

export const groups: groupsNS = {
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "Ví dụ: tên nhóm."
                },
                filterCondition: {
                    placeholder: "Ví dụ: Starts with, v.v."
                },
                filterValue: {
                    placeholder: "Nhập giá trị để tìm kiếm"
                }
            }
        },
        placeholder: "Tìm kiếm theo tên nhóm"
    },
    edit: {
        basics: {
            fields: {
                groupName: {
                    name: "Tên nhóm",
                    placeholder: "Nhập tên nhóm",
                    required: "Cần có tên nhóm"
                }
            }
        },
        roles: {
            addRolesModal: {
                heading: "Cập nhật vai trò nhóm",
                subHeading: "Thêm vai trò mới hoặc xóa các vai trò hiện có được gán cho nhóm."
            },
            heading: "Vai trò đã gán",
            placeHolders: {
                emptyListPlaceholder: {
                    subtitles: "Hiện tại không có vai trò nào được gán cho nhóm này.",
                    title: "Không có vai trò nào được gán"
                }
            },
            subHeading: "Xem các vai trò đã gán cho nhóm."
        },
        users: {
            addUsersModal: {
                heading: "Quản lý người dùng của nhóm",
                subHeading: "Thêm người dùng mới hoặc xóa người dùng hiện có được gán cho nhóm."
            },
            heading: "Người dùng đã gán",
            placeHolders: {
                emptyListPlaceholder: {
                    subtitles: "Hiện tại không có người dùng nào được gán cho nhóm này.",
                    title: "Không có người dùng nào được gán"
                }
            },
            searchUsers: "Tìm kiếm người dùng theo tên đăng nhập để có thêm kết quả",
            selectAllUsers: "Chọn tất cả người dùng",
            subHeading: "Xem các người dùng đã gán cho nhóm."
        }
    },
    groupCreateWizard: {
        groupNameRegexAlternativeHint: "Tên nhóm có thể chứa từ 3 đến 30 ký tự chữ và số, dấu gạch ngang (-), và dấu gạch dưới (_).",
        groupNameRegexCustomHint: "Tên nhóm phải khớp với mẫu regex sau {{regex}}",
        groupNameRegexHint: "Tên nhóm có thể chứa từ 3 đến 30 ký tự, không có dấu cách.",
        subHeading: "Tạo nhóm mới và thêm người dùng vào nhóm."
    },
    list: {
        columns: {
            actions: "Hành động",
            lastModified: "Thời gian sửa đổi",
            name: "Nhóm",
            source: "Kho người dùng"
        },
        storeOptions: "Chọn kho người dùng"
    },
    notifications: {
        apiLimitReachedError: {
            error: {
                description: "Bạn đã đạt số lượng nhóm tối đa được phép.",
                message: "Không thể tạo nhóm"
            }
        },
        createGroup: {
            error: {
                description: "{{description}}",
                message: "Đã xảy ra lỗi khi tạo nhóm."
            },
            genericError: {
                description: "Không thể tạo nhóm.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Nhóm đã được tạo thành công.",
                message: "Tạo nhóm thành công."
            }
        },
        createPermission: {
            error: {
                description: "{{description}}",
                message: "Đã xảy ra lỗi khi thêm quyền cho nhóm."
            },
            genericError: {
                description: "Không thể thêm quyền cho nhóm.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Quyền đã được thêm thành công cho nhóm.",
                message: "Tạo nhóm thành công."
            }
        },
        deleteGroup: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi xóa nhóm đã chọn."
            },
            genericError: {
                description: "Không thể xóa nhóm đã chọn.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Nhóm đã chọn đã được xóa thành công.",
                message: "Xóa nhóm thành công"
            }
        },
        fetchGroups: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy danh sách nhóm.",
                message: "Đã xảy ra lỗi"
            }
        },
        tierLimitReachedError: {
            emptyPlaceholder: {
                action: "Xem các gói",
                subtitles: "Bạn có thể liên hệ quản trị viên tổ chức hoặc (nếu bạn là " +
                    "quản trị viên) nâng cấp gói đăng ký để tăng giới hạn cho phép.",
                title: "Bạn đã đạt số lượng nhóm tối đa được phép " +
                    "cho tổ chức này."
            },
            heading: "Bạn đã đạt giới hạn tối đa cho nhóm"
        },
        updateGroup: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi cập nhật nhóm đã chọn."
            },
            genericError: {
                description: "Không thể cập nhật nhóm đã chọn.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Nhóm đã chọn đã được cập nhật thành công.",
                message: "Cập nhật nhóm thành công"
            }
        }
    },
    placeholders: {
        groupsError: {
            subtitles: [
                "Đã xảy ra lỗi khi cố lấy danh sách nhóm từ kho người dùng.",
                "Vui lòng đảm bảo rằng thông tin kết nối của kho người dùng là chính xác."
            ],
            title:"Không thể lấy danh sách nhóm từ kho người dùng"
        }
    }
};
