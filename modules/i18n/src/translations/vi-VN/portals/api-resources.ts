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
import { ApiResourcesNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const apiResources: ApiResourcesNS = {
    confirmations: {
        deleteAPIResource: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn {{ resourceType }}.",
            header: "Bạn có chắc không?",
            message: "Nếu bạn xóa {{ resourceType }} này, một số chức năng có thể không hoạt động đúng. " +
                "Vui lòng tiếp tục một cách thận trọng."
        },
        deleteAPIResourcePermission: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn phạm vi khỏi {{ resourceType }}.",
            header: "Bạn có chắc không?",
            message: "Nếu bạn xóa phạm vi này khỏi {{ resourceType }}, một số chức năng có thể không hoạt động đúng. " +
                "Vui lòng tiếp tục một cách thận trọng."
        }
    },
    notifications: {
        apiLimitReachedError: {
            error: {
                description: "Không thể tạo tài nguyên vì đã đạt giới hạn tạo.",
                message: "Đã đạt giới hạn tạo"
            }
        },
        tierLimitReachedError: {
            emptyPlaceholder: {
                action: "Xem các gói",
                subtitles: "Bạn có thể liên hệ quản trị viên tổ chức hoặc (nếu bạn là " +
                    "quản trị viên) nâng cấp gói đăng ký để tăng giới hạn cho phép.",
                title: "Bạn đã đạt số lượng tài nguyên API và máy chủ MCP tối đa được phép cho tổ chức này."
            },
            heading: "Bạn đã đạt giới hạn tối đa"
        }
    },
    tabs: {
        scopes: {
            button: "Thêm phạm vi",
            copiedPopupText: "Đã sao chép định danh",
            copyPopupText: "Sao chép định danh",
            empty: {
                subTitle: "Nhấn vào biểu tượng + để thêm phạm vi mới",
                title: "Không có phạm vi nào được gán"
            },
            emptySearch: {
                subTitle: {
                    0: "Chúng tôi không thể tìm thấy phạm vi bạn đã tìm kiếm.",
                    1: "Vui lòng thử sử dụng một tham số khác."
                },
                title: "Không tìm thấy kết quả",
                viewAll: "Xóa truy vấn tìm kiếm"
            },
            form: {
                button: "Phạm vi mới",
                cancelButton: "Hủy",
                fields: {
                    description: {
                        label: "Mô tả",
                        placeholder: "Nhập mô tả"
                    },
                    displayName: {
                        emptyValidate: "Tên hiển thị không được để trống",
                        label: "Tên hiển thị",
                        placeholder: "Đọc đặt chỗ"
                    },
                    scope: {
                        emptyValidate: "Phạm vi không được để trống",
                        label: "Phạm vi",
                        placeholder: "read_bookings"
                    }
                },
                subTitle: "Tạo một phạm vi mới",
                submitButton: "Tạo",
                title: "Tạo một phạm vi"
            },
            label: "Phạm vi",
            learnMore: "Tìm hiểu thêm",
            removeScopePopupText: "Xóa phạm vi",
            search: "Tìm kiếm phạm vi theo tên hiển thị",
            subTitle: "Danh sách các phạm vi được sử dụng bởi tài nguyên API.",
            title: "Danh sách phạm vi"
        }
    },
    wizard: {
        addApiResource: {
            steps: {
                scopes: {
                    empty: {
                        subTitle: "Nhấn vào biểu tượng + để thêm phạm vi mới",
                        title: "Không có phạm vi nào được gán"
                    },
                    form: {
                        button: "Thêm phạm vi",
                        fields: {
                            description: {
                                hint: "Cung cấp mô tả cho phạm vi của bạn. "+
                                "Mô tả này sẽ được hiển thị trên màn hình chấp thuận của người dùng.",
                                label: "Mô tả",
                                placeholder: "Nhập mô tả"
                            },
                            displayName: {
                                emptyValidate: "Tên hiển thị không được để trống",
                                hint: "Cung cấp một tên có ý nghĩa vì nó sẽ được hiển thị trên màn hình chấp thuận của người dùng.",
                                label: "Tên hiển thị",
                                placeholder: "Đọc đặt chỗ"
                            },
                            permission: {
                                emptyValidate: "Phạm vi không được để trống",
                                hint: "Một giá trị duy nhất đóng vai trò là phạm vi khi yêu cầu "+
                                "access token. <1>Lưu ý rằng phạm vi không thể sửa đổi sau khi tạo.</1>",
                                invalid: "Phạm vi không được chứa dấu cách",
                                label: "Phạm vi",
                                placeholder: "read_bookings",
                                uniqueValidate: "Phạm vi này đã tồn tại trong tổ chức. "+
                                "Vui lòng chọn một phạm vi khác.",
                                errorOccurred: "Đã xảy ra lỗi khi kiểm tra hợp lệ các phạm vi."
                            },
                            permissionList: {
                                label: "Phạm vi đã thêm"
                            }
                        }
                    },
                    removeScopePopupText: "Xóa phạm vi",
                    stepTitle: "Phạm vi"
                }
            }
        }
    },
    mcpServers: {
        newMcpServer: "Máy chủ MCP mới",
        wizards: {
            addMcpServer: {
                title: "Thêm máy chủ MCP mới",
                description: "Đăng ký một máy chủ MCP",
                steps: {
                    general: {
                        fields: {
                            displayName: {
                                hint: "Tên có ý nghĩa để nhận diện máy chủ MCP của bạn",
                                placeholder: "Máy chủ MCP của tôi"
                            },
                            identifier: {
                                placeholder: "mcp://my-mcp-server"
                            }
                        }
                    }
                }
            }
        },
        deleteMcpServer: {
            actionText: "Xóa máy chủ MCP",
            heading: "Xóa máy chủ MCP",
            subheading: "Thao tác này sẽ xóa vĩnh viễn máy chủ MCP. Vui lòng chắc chắn trước khi tiếp tục"
        },
        title: "Máy chủ MCP",
        description: "Định nghĩa các mô hình tài nguyên và phạm vi cho máy chủ MCP để bật kiểm soát truy cập chi tiết đối với tài nguyên máy chủ.",
        searchBarPlaceholder: "Tìm kiếm máy chủ MCP theo tên",
        backButtonText: "Quay lại Máy chủ MCP",
        scopes: {
            subHeading: "Các phạm vi mà máy chủ MCP sử dụng để xác minh quyền của người dùng truy cập " +
                "các công cụ, tài nguyên và prompt của nó."
        },
        editPageTitle: "Chỉnh sửa máy chủ MCP",
        emptyListPlaceholderText: "Không có máy chủ MCP nào khả dụng"
    }
};
