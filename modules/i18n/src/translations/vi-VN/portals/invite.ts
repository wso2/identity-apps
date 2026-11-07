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
import { inviteNS } from "../../../models";

export const invite: inviteNS = {
    advancedSearch: {
        form: {
            dropdown: {
                filterAttributeOptions: {
                    email: "Email",
                    username: "Tên đăng nhập"
                }
            },
            inputs: {
                filterAttribute: {
                    placeholder: "Ví dụ: Email, v.v."
                },
                filterCondition: {
                    placeholder: "Ví dụ: Starts with, v.v."
                },
                filterValue: {
                    placeholder: "Nhập giá trị để tìm kiếm"
                }
            }
        },
        placeholder: "Tìm kiếm theo Email"
    },
    confirmationModal: {
        deleteInvite: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn thu hồi lời mời này, người dùng sẽ không thể tham gia tổ chức của bạn. " +
                "Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ thu hồi vĩnh viễn lời mời."
        },
        resendInvite: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn gửi lại lời mời, liên kết mời trước đó sẽ bị thu hồi. " +
                "Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này sẽ thu hồi vĩnh viễn lời mời trước đó."
        }
    },
    form: {
        sendmail: {
            subTitle: "Gửi email mời để thêm quản trị viên hoặc nhà phát triển mới vào tổ chức của bạn",
            title: "Mời quản trị viên/nhà phát triển"
        }
    },
    inviteButton: "Lời mời mới",
    notifications: {
        deleteInvite: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi xóa lời mời"
            },
            genericError: {
                description: "Không thể xóa lời mời",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã xóa lời mời của người dùng thành công.",
                message: "Xóa lời mời thành công"
            }
        },
        resendInvite: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi gửi lại lời mời"
            },
            genericError: {
                description: "Không thể gửi lại lời mời",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã gửi lại lời mời qua email thành công.",
                message: "Đã gửi lại lời mời"
            }
        },
        sendInvite: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi gửi lời mời"
            },
            genericError: {
                description: "Không thể gửi lời mời",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã gửi lời mời qua email thành công.",
                message: "Đã gửi lời mời"
            }
        },
        updateInvite: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi cập nhật lời mời"
            },
            genericError: {
                description: "Không thể cập nhật lời mời",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật lời mời thành công.",
                message: "Cập nhật lời mời thành công"
            }
        }
    },
    placeholder: {
        emptyResultPlaceholder: {
            addButton: "Lời mời mới",
            subTitle: {
                0: "Hiện tại không có lời mời nào khả dụng.",
                1: "Bạn có thể tạo một tổ chức và mời người dùng",
                2: "tham gia tổ chức của bạn."
            },
            title: "Gửi lời mời mới"
        },
        emptySearchResultPlaceholder: {
            clearButton: "Xóa truy vấn tìm kiếm",
            subTitle: {
                0: "Chúng tôi không thể tìm thấy kết quả nào cho {{query}}",
                1: "Vui lòng thử một từ khóa tìm kiếm khác."
            },
            title: "Không tìm thấy kết quả"
        }
    },
    rolesUpdateModal: {
        header: "Cập nhật vai trò người được mời",
        searchPlaceholder: "Tìm kiếm theo tên vai trò",
        subHeader: "Thêm hoặc xóa vai trò khỏi người dùng bạn đã mời."
    },
    subSelection: {
        invitees: "Người được mời",
        onBoard: "Người dùng đã tham gia"
    }
};
