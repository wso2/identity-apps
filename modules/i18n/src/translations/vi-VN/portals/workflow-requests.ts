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
import { workflowRequestsNS } from "../../../models";

export const workflowRequests: workflowRequestsNS = {
    activeFiltersBar: {
        clearAll: "Xóa tất cả",
        noActiveFilters: "Không có bộ lọc đang hoạt động",
        removeFilter: "Xóa bộ lọc {{filter}}"
    },
    details: {
        backButton: "Quay lại Yêu cầu quy trình công việc",
        dangerZone: {
            abort: {
                action: "Hủy bỏ",
                actionTitle: "Hủy bỏ yêu cầu quy trình công việc",
                confirm: "Bạn có chắc muốn hủy bỏ yêu cầu quy trình công việc này không? Thao tác này không thể hoàn tác.",
                header: "Hủy bỏ yêu cầu quy trình công việc",
                subheader: "Sau khi bạn hủy bỏ một yêu cầu quy trình công việc, không thể hoàn tác. Vui lòng chắc chắn."
            },
            header: "Vùng nguy hiểm"
        },
        error: {
            content: "Không thể tải chi tiết yêu cầu quy trình công việc.",
            header: "Lỗi"
        },
        fields: {
            createdAt: "Tạo lúc",
            eventType: "Loại sự kiện",
            id: "ID",
            requestInitiator: "Người khởi tạo yêu cầu",
            requestParams: "Tham số yêu cầu",
            status: "Trạng thái",
            updatedAt: "Cập nhật lúc"
        },
        header: "Chi tiết yêu cầu quy trình công việc",
        loading: "Đang tải..."
    },
    eventType: {
        all: "Tất cả tác vụ",
        myTasks: "Tác vụ của tôi"
    },
    filters: {
        createdTimeRange: "Khoảng thời gian tạo",
        disabledTimeRange: "Không thể chọn khi '{{label}}' được chọn.",
        operationType: "Loại tác vụ",
        requestType: "Loại yêu cầu",
        status: "Trạng thái",
        updatedTimeRange: "Khoảng thời gian cập nhật"
    },
    list: {
        columns: {
            actions: "Hành động",
            createdAt: "Tạo lúc",
            requestInitiator: "Người khởi tạo yêu cầu",
            status: "Trạng thái",
            updatedAt: "Cập nhật lúc",
            workflowInstanceId: "Loại tác vụ"
        }
    },
    notifications: {
        abortWorkflowRequest: {
            genericError: {
                description: "Đã xảy ra lỗi khi hủy bỏ yêu cầu quy trình công việc",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Hủy bỏ yêu cầu quy trình công việc thành công.",
                message: "Hủy bỏ yêu cầu quy trình công việc thành công!"
            }
        },
        fetchWorkflowRequestDetails: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy chi tiết yêu cầu quy trình công việc",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Lấy chi tiết yêu cầu quy trình công việc thành công.",
                message: "Lấy chi tiết yêu cầu quy trình công việc thành công!"
            }
        },
        fetchWorkflowRequests: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy các yêu cầu quy trình công việc",
                message: "Đã xảy ra lỗi"
            }
        },
        searchWorkflowRequests: {
            genericError: {
                description: "Đã xảy ra lỗi khi tìm kiếm các yêu cầu quy trình công việc",
                message: "Đã xảy ra lỗi"
            }
        }
    },
    operationType: {
        all: "Tất cả tác vụ",
        createRole: "Tạo vai trò",
        createUser: "Tạo người dùng",
        deleteRole: "Xóa vai trò",
        deleteUser: "Xóa người dùng",
        deleteUserClaims: "Xóa claim người dùng",
        selfRegisterUser: "Người dùng tự đăng ký",
        updateRoleName: "Cập nhật tên vai trò",
        updateRoleUsers: "Cập nhật người dùng của vai trò",
        updateUserClaims: "Cập nhật claim người dùng",
        updateUserRoles: "Cập nhật vai trò người dùng"
    },
    placeholders: {
        emptyListReadOnly: {
            subtitles: {
                0: "Hiện tại không có yêu cầu quy trình công việc nào khả dụng."
            },
            title: "Không có yêu cầu quy trình công việc"
        },
        emptySearch: {
            action: "Xóa truy vấn tìm kiếm",
            subtitles: {
                0: "Chúng tôi không thể tìm thấy kết quả nào cho {{searchQuery}}. Vui lòng thử một từ khóa tìm kiếm khác."
            },
            title: "Không tìm thấy kết quả"
        },
        workflowRequestError: {
            subtitles: {
                0: "Không thể lấy các yêu cầu quy trình công việc",
                1: "Vui lòng thử lại"
            },
            title: "Đã xảy ra lỗi"
        }
    },
    status: {
        aborted: "Đã hủy bỏ",
        all: "Tất cả tác vụ",
        approved: "Đã chấp thuận",
        failed: "Thất bại",
        pending: "Đang chờ",
        rejected: "Đã từ chối"
    },
    timeRanges: {
        all: "Tất cả",
        customRange: "Khoảng tùy chỉnh",
        customRangeTitle: "{{label}} tùy chỉnh",
        last12Hours: "12 giờ qua",
        last14Days: "14 ngày qua",
        last15Minutes: "15 phút qua",
        last1Hour: "1 giờ qua",
        last24Hours: "24 giờ qua",
        last2Days: "2 ngày qua",
        last30Days: "30 ngày qua",
        last30Minutes: "30 phút qua",
        last6Hours: "6 giờ qua",
        last7Days: "7 ngày qua",
        range: "Khoảng"
    }
};
