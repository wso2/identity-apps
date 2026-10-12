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

import { CommonNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const common: CommonNS = {
    access: "Truy cập",
    actions: "Hành động",
    activate: "Kích hoạt",
    active: "Đang hoạt động",
    add: "Thêm",
    addKey: "Thêm secret",
    addURL: "Thêm URL",
    all: "Tất cả",
    applicationName: "Tên ứng dụng",
    applications: "Ứng dụng",
    approvalStatus: "Trạng thái phê duyệt",
    approvals: "Phê duyệt",
    approvalsPage: {
        list: {
            columns: {
                actions: "Hành động",
                name: "Tên"
            }
        },
        modals: {
            description: "Bạn có thể phê duyệt hoặc từ chối tác vụ tại đây.",
            header: "Tác vụ phê duyệt",
            subHeader: "Xem xét chi tiết của tác vụ phê duyệt."
        },
        notifications: {
            fetchApprovalDetails: {
                error: {
                    description: "{{description}}",
                    message: "Lỗi khi tải chi tiết phê duyệt"
                },
                genericError: {
                    description: "Không thể lấy chi tiết phê duyệt.",
                    message: "Đã xảy ra lỗi"
                }
            },
            fetchPendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "Lỗi khi tải các phê duyệt đang chờ xử lý"
                },
                genericError: {
                    description: "Không thể lấy các phê duyệt đang chờ xử lý.",
                    message: "Đã xảy ra lỗi"
                }
            },
            statusUpdate: {
                approved: {
                    description: "Yêu cầu phê duyệt đã được chấp thuận.",
                    message: "Đã chấp thuận yêu cầu phê duyệt"
                },
                claimed: {
                    description: "Yêu cầu phê duyệt đã được nhận xử lý.",
                    message: "Đã nhận yêu cầu phê duyệt"
                },
                rejected: {
                    description: "Yêu cầu phê duyệt đã bị từ chối.",
                    message: "Đã từ chối yêu cầu phê duyệt"
                },
                released: {
                    description: "Yêu cầu phê duyệt đã được giải phóng.",
                    message: "Đã giải phóng yêu cầu phê duyệt"
                }
            },
            updatePendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "Lỗi khi cập nhật phê duyệt"
                },
                genericError: {
                    description: "Không thể cập nhật phê duyệt đang chờ xử lý.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Đã cập nhật phê duyệt thành công.",
                    message: "Cập nhật thành công"
                }
            }
        },
        operationTypes: {
            addRole: "Thêm vai trò",
            addUser: "Thêm người dùng",
            all: "Tất cả tác vụ",
            deleteRole: "Xóa vai trò",
            deleteUser: "Xóa người dùng",
            selfRegisterUser: "Người dùng tự đăng ký",
            updateRolesOfUser: "Cập nhật vai trò của người dùng"
        },
        placeholders: {
            emptyApprovalFilter: {
                action: "Xem tất cả",
                subtitle: "Hiện tại không có phê duyệt nào ở trạng thái {{status}}.",
                title: "Không tìm thấy kết quả"
            },
            emptyApprovalList: {
                action: "",
                subtitle: "Hiện tại không có phê duyệt nào để xem xét.",
                title: "Không có phê duyệt"
            },
            emptySearchResults: {
                action: "Xem tất cả",
                subtitles: {
                    0: "Chúng tôi không thể tìm thấy quy trình bạn đã tìm kiếm.",
                    1: "Vui lòng kiểm tra xem bạn có quy trình với tên đó trong",
                    2: "hệ thống hay không."
                },
                title: "Không có phê duyệt"
            },
            searchApprovals: "Tìm kiếm theo tên quy trình"
        },
        propertyMessages: {
            assignedUsersDeleted: "Người dùng được chỉ định đã bị xóa.",
            roleDeleted: "Vai trò đã bị xóa.",
            selfRegistration: "Tự đăng ký",
            unassignedUsersDeleted: "Người dùng chưa được chỉ định đã bị xóa."
        },
        search: {
            placeholder: "Tìm kiếm theo ID yêu cầu"
        },
        subTitle: "Xem xét các tác vụ vận hành cần bạn phê duyệt",
        title: "Phê duyệt"
    },
    approve: "Chấp thuận",
    approved: "Đã chấp thuận",
    apps: "Ứng dụng",
    assignYourself: "Tự nhận xử lý",
    assignee: "Người xử lý",
    assignees: "Người xử lý",
    asyncOperationErrorMessage: {
        description: "Đã xảy ra lỗi",
        message: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."
    },
    authentication: "Xác thực",
    authenticator: "Phương thức xác thực",
    authenticator_plural: "Các phương thức xác thực",
    back: "Quay lại",
    beta: "Beta",
    browser: "Trình duyệt",
    cancel: "Hủy",
    challengeQuestionNumber: "Câu hỏi bảo mật {{number}}",
    change: "Thay đổi",
    chunkLoadErrorMessage: {
        description: "Đã xảy ra lỗi khi phục vụ ứng dụng được yêu cầu. Vui lòng thử tải lại ứng dụng.",
        heading: "Đã xảy ra lỗi",
        primaryActionText: "Tải lại ứng dụng"
    },
    clear: "Xóa",
    clientId: "Client ID",
    close: "Đóng",
    comingSoon: "Sắp ra mắt",
    completed: "Đã hoàn thành",
    configure: "Cấu hình",
    confirm: "Xác nhận",
    consents: "Chấp thuận",
    contains: "Chứa",
    continue: "Tiếp tục",
    copied: "Đã sao chép!",
    copyToClipboard: "Sao chép vào clipboard",
    create: "Tạo",
    createdOn: "Tạo ngày",
    dangerZone: "Vùng nguy hiểm",
    darkMode: "Chế độ tối",
    default: "Mặc định",
    delete: "Xóa",
    deprecated: "Cấu hình này không còn được dùng và sẽ bị xóa trong bản phát hành tương lai.",
    description: "Mô tả",
    deviceModel: "Model thiết bị",
    disable: "Vô hiệu hóa",
    disabled: "Đã vô hiệu hóa",
    docs: "Tài liệu",
    documentation: "Tài liệu",
    done: "Xong",
    download: "Tải xuống",
    drag: "Kéo",
    duplicateURLError: "Giá trị này đã được thêm",
    edit: "Chỉnh sửa",
    enable: "Bật",
    enabled: "Đã bật",
    endsWith: "Kết thúc bằng",
    equals: "Bằng",
    exitFullScreen: "Thoát toàn màn hình",
    experimental: "Thử nghiệm",
    explore: "Khám phá",
    export: "Xuất",
    featureAvailable: "Tính năng này sẽ sớm khả dụng!",
    filter: "Lọc",
    finish: "Hoàn tất",
    generatePassword: "Tạo mật khẩu",
    goBackHome: "Quay về trang chủ",
    goFullScreen: "Toàn màn hình",
    good: "Tốt",
    greaterThanOrEqual: "Lớn hơn hoặc bằng",
    help: "Trợ giúp",
    hide: "Ẩn",
    hidePassword: "Ẩn mật khẩu",
    identityProviders: "Nhà cung cấp danh tính",
    import: "Nhập",
    initiator: "Người khởi tạo",
    ipAddress: "Địa chỉ IP",
    issuer: "Issuer",
    lastAccessed: "Truy cập lần cuối",
    lastModified: "Sửa đổi lần cuối",
    lastSeen: "Nhìn thấy lần cuối",
    lastUpdatedOn: "Cập nhật lần cuối ngày",
    learnMore: "Tìm hiểu thêm",
    lessThanOrEqual: "Nhỏ hơn hoặc bằng",
    lightMode: "Chế độ sáng",
    loading: "Đang tải",
    localeDropdown: {
        groups: {
            default: {
                heading: "Ngôn ngữ tích hợp sẵn",
                hint: "Các ngôn ngữ này được hỗ trợ trên tất cả màn hình xác thực, khôi phục tài khoản dành cho người dùng và cổng My Account.",
                subHeading: "Ngôn ngữ được hỗ trợ mặc định"
            },
            other: {
                heading: "Ngôn ngữ bổ sung",
                subHeading: "Các ngôn ngữ khác khả dụng cho template này"
            }
        },
        label: "Ngôn ngữ",
        placeholder: "Chọn ngôn ngữ"
    },
    loginTime: "Thời gian đăng nhập",
    logout: "Đăng xuất",
    makePrimary: "Đặt làm chính",
    maxValidation: "Giá trị này phải nhỏ hơn hoặc bằng {{max}}.",
    maximize: "Phóng to",
    metaAttributes: "Thuộc tính meta",
    minValidation: "Giá trị này phải lớn hơn hoặc bằng {{min}}.",
    minimize: "Thu nhỏ",
    minutes: "phút",
    more: "Thêm",
    myAccount: "My Account",
    name: "Tên",
    networkErrorMessage: {
        description: "Vui lòng thử đăng nhập lại.",
        heading: "Phiên của bạn đã hết hạn",
        primaryActionText: "Đăng nhập"
    },
    new: "Mới",
    next: "Tiếp theo",
    noResultsFound: "Không tìm thấy kết quả",
    none: "Không có",
    okay: "Đồng ý",
    operatingSystem: "Hệ điều hành",
    operationType: "Loại tác vụ",
    operations: "Tác vụ",
    organizationName: "tổ chức {{orgName}}",
    overview: "Tổng quan",
    parameter: "Tham số",
    pending: "Đang chờ",
    personalInfo: "Thông tin cá nhân",
    pin: "Ghim",
    pinned: "Đã ghim",
    premium: "Cao cấp",
    pressEnterPrompt: "Nhấn <1>Enter</1> để chọn",
    preview: "Xem trước",
    previous: "Trước",
    primary: "Chính",
    priority: "Độ ưu tiên",
    privacy: "Quyền riêng tư",
    properties: "Thuộc tính",
    publish: "Xuất bản",
    ready: "Sẵn sàng",
    regenerate: "Tạo lại",
    register: "Đăng ký",
    reject: "Từ chối",
    rejected: "Đã từ chối",
    remove: "Xóa bỏ",
    removeAll: "Xóa tất cả",
    required: "Trường này là bắt buộc.",
    reserved: "Đã đặt trước",
    resetFilters: "Đặt lại bộ lọc",
    retry: "Thử lại",
    revert: "Hoàn tác",
    revoke: "Thu hồi",
    revokeAll: "Thu hồi tất cả",
    samples: "Mẫu",
    save: "Lưu",
    saveDraft: "Lưu bản nháp",
    sdks: "SDK",
    search: "Tìm kiếm",
    searching: "Đang tìm kiếm",
    security: "Bảo mật",
    selectAll: "Chọn tất cả",
    selectNone: "Bỏ chọn tất cả",
    services: "Dịch vụ",
    settings: "Cài đặt",
    setup: "Thiết lập",
    show: "Hiện",
    showAll: "Hiện tất cả",
    showLess: "Thu gọn",
    showMore: "Xem thêm",
    showPassword: "Hiện mật khẩu",
    skip: "Bỏ qua",
    startsWith: "Bắt đầu bằng",
    step: "Bước",
    strong: "Mạnh",
    submit: "Gửi",
    switch: "Chuyển",
    technologies: "Công nghệ",
    terminate: "Kết thúc",
    terminateAll: "Kết thúc tất cả",
    terminateSession: "Kết thúc phiên",
    tooShort: "Quá ngắn",
    type: "Loại",
    unassign: "Bỏ chỉ định",
    unpin: "Bỏ ghim",
    unpinned: "Đã bỏ ghim",
    update: "Cập nhật",
    user: "Người dùng",
    verified: "Đã xác minh",
    verify: "Xác minh",
    view: "Xem",
    viewDetails: "Xem chi tiết",
    weak: "Yếu",
    weakPassword: "Độ mạnh mật khẩu tối thiểu phải đạt mức Tốt."
};
