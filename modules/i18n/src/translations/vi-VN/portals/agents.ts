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
import { AgentsNS } from "../../../models/namespaces/agents-ns";

export const agents: AgentsNS = {
    description: "Quản lý danh tính AI agent, quyền và kiểm soát truy cập cho các hệ thống tự động của tổ chức bạn.",
    edit: {
        credentials: {
            regenerate: {
                alerts: {
                    error: {
                        description: "Lỗi khi tạo lại secret của agent",
                        message: "Đã xảy ra lỗi"
                    }
                }
            },
            subtitle: "Thông tin xác thực để agent này truy cập an toàn vào các ứng dụng và tài nguyên API.",
            title: "Thông tin xác thực"
        },
        general: {
            fields: {
                description: {
                    label: "",
                    placeholder: ""
                },
                languageModal: {
                    label: ""
                },
                name: {
                    label: ""
                }
            },
            title: ""
        },
        roles: {
            subtitle: "Xem các vai trò được gán trực tiếp cho agent này",
            title: "Vai trò"

        },
        sections: {
            shareAgent: {
                addAsyncSharingNotification: {
                    description: "Quá trình chia sẻ agent đã bắt đầu. Bạn sẽ được thông báo khi quá trình hoàn tất.",
                    message: "Đang chia sẻ agent"
                },
                getSharedOrganizations: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy các tổ chức được chia sẻ.",
                        message: "Đã xảy ra lỗi khi lấy các tổ chức được chia sẻ"
                    }
                }
            },
            sharedAccess: {
                allAgentRolesSharingMessage: "Tất cả vai trò của agent trong tổ chức hiện tại sẽ được chia sẻ và gán.",
                allRolesAndOrgsSharingMessage: "Tất cả vai trò sẽ được chia sẻ với tất cả tổ chức hiện có và tương lai.",
                assignedRolesLabel: "Vai trò được gán",
                commonRoleSharingHint: "Cấu hình tập hợp các vai trò sẽ được gán cho agent được chia sẻ trong tất cả tổ chức hiện có và tương lai.",
                commonRoleSharingLabel: "Vai trò được gán",
                currentlyAssignedRolesLabel: "Vai trò hiện được gán",
                doNotShareAgent: "Không chia sẻ agent với bất kỳ tổ chức nào",
                individualRoleSharingHint: "Cấu hình chia sẻ vai trò cho từng tổ chức cụ thể một cách riêng lẻ.",
                individualRoleSharingLabel: "Vai trò được chia sẻ riêng lẻ",
                noRolesAndOrgsSharingMessage: "Không có vai trò nào sẽ được gán cho agent được chia sẻ trong tất cả tổ chức hiện có và tương lai.",
                notifications: {
                    fetchAgentRoles: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy các vai trò của agent.",
                            message: "Đã xảy ra lỗi khi lấy các vai trò của agent"
                        }
                    },
                    fetchOrganizations: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy các tổ chức.",
                            message: "Đã xảy ra lỗi khi lấy các tổ chức"
                        }
                    },
                    noOrganizationsSelected: {
                        description: "Vui lòng chọn ít nhất một tổ chức để chia sẻ agent.",
                        message: "Chưa chọn tổ chức nào"
                    },
                    share: {
                        error: {
                            description: "Đã xảy ra lỗi khi chia sẻ agent.",
                            message: "Đã xảy ra lỗi khi chia sẻ agent"
                        },
                        success: {
                            description: "Đã chia sẻ agent với tất cả tổ chức thành công.",
                            message: "Chia sẻ thành công"
                        }
                    },
                    unshare: {
                        error: {
                            description: "Đã xảy ra lỗi khi hủy chia sẻ agent.",
                            message: "Đã xảy ra lỗi khi hủy chia sẻ agent"
                        },
                        success: {
                            description: "Đã hủy chia sẻ agent thành công.",
                            message: "Hủy chia sẻ thành công"
                        }
                    }
                },
                roleAudience: {
                    application: "application/{{appName}}",
                    organization: "organization"
                },
                roleAvailabilityInfo: "Chỉ những vai trò đã có sẵn trong các tổ chức con mới được gán cho agent được chia sẻ.",
                searchAvailableRolesPlaceholder: "Tìm kiếm vai trò khả dụng",
                shareAgentWithFutureChildOrgs: "Chia sẻ agent với các tổ chức con trong tương lai",
                shareAllAgent: "Chia sẻ agent với tất cả tổ chức",
                shareAllRoles: "Gán tất cả vai trò",
                shareRoleSubsetWithAllOrgs: "Chỉ chia sẻ và gán một tập hợp con vai trò cho agent trong tất cả tổ chức",
                shareSelectedAgent: "Chia sẻ agent với các tổ chức được chọn",
                shareSelectedRoles: "Gán các vai trò được chọn",
                shareTypeSwitchModal: {
                    description: "Chọn cách bạn muốn tiếp tục:",
                    header: "Chuyển sang chia sẻ có chọn lọc",
                    message: "Bạn sắp chuyển từ chia sẻ với tất cả tổ chức sang chia sẻ có chọn lọc.",
                    preserveStateLabel1: "Giữ nguyên chia sẻ hiện tại",
                    preserveStateLabel2: "Giữ agent được chia sẻ với các tổ chức hiện có và chuyển sang chế độ chọn lọc.",
                    resetToDefaultLabel1: "Đặt lại về mặc định",
                    resetToDefaultLabel2: "Hủy chia sẻ agent khỏi tất cả tổ chức và bắt đầu lại với chia sẻ chọn lọc."
                },
                sharingSettingsLabel: "Cài đặt chia sẻ",
                showShareAllWarningModal: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    description: "Thao tác này sẽ chia sẻ agent trên TẤT CẢ tổ chức hiện có và tương lai. Thao tác này sẽ ảnh hưởng đến tất cả tổ chức hiện tại và tương lai trong hệ thống của bạn.",
                    header: "Chia sẻ với tất cả tổ chức",
                    message: "Bạn sắp chia sẻ agent này trên tất cả tổ chức."
                },
                subTitle: "Cấu hình cách agent này nên được chia sẻ giữa các tổ chức",
                title: "Chính sách chia sẻ"
            }
        }
    },
    list: {
        confirmations: {
            deleteItem: {
                assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                content: "Nếu bạn xóa agent này, một số chức năng có thể không hoạt động đúng. " +
                    "Vui lòng tiếp tục một cách thận trọng.",
                header: "Bạn có chắc không?",
                message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn agent đã chọn."
            }
        },
        featureUnavailable: {
            subtitle: {
                0: "Mỗi AI agent cần một danh tính duy nhất với các quyền, vai trò và chính sách truy cập cụ thể. Giám sát việc sử dụng, quản lý thông tin xác thực và đảm bảo tuân thủ trên tất cả hệ thống tự động.",
                1: {
                    onprem: "Cấu hình kho dữ liệu agent để bật và dùng thử tính năng này ngay bây giờ.",
                    saas: "Tạo một tổ chức mới để truy cập ngay, hoặc liên hệ với chúng tôi để được truy cập sớm tính năng đột phá này."
                }
            },
            title: "Quản lý AI agent sắp có mặt trong tổ chức của bạn!"
        }
    },
    new: {
        action: {
            title: "Agent mới"
        },
        alerts: {
            success: {
                description: "Tạo agent thành công",
                message: "Tạo thành công"
            }
        },
        fields: {
            description: {
                label: "Mô tả",
                placeholder: "Nhập mô tả cho agent"
            },
            name: {
                label: "Tên"
            }
        },
        title: "Tạo agent thành công"
    },
    pageTitle: "Agents",
    title: "Agents",
    wizard: {
        alerts: {
            clientIdFetchFailed: {
                description: "Không thể lấy OAuth Client ID",
                message: "Client ID không khả dụng"
            },
            configUpdateFailed: {
                description: "Không thể cập nhật cấu hình OAuth của agent",
                message: "Cập nhật cấu hình thất bại"
            },
            created: {
                description: "Tạo agent thành công",
                message: "Thành công"
            },
            error: {
                description: "Tạo agent thất bại",
                message: "Đã xảy ra lỗi"
            },
            limitReached: {
                description: "Tạo ứng dụng agent thất bại. Đã đạt giới hạn ứng dụng tối đa.",
                message: "Đã đạt giới hạn ứng dụng"
            }
        },
        buttons: {
            cancel: "Hủy",
            create: "Tạo",
            done: "Xong"
        },
        fields: {
            agentType: {
                label: "Loại AI Agent",
                options: {
                    background: {
                        label: "Agent chạy nền"
                    },
                    interactive: {
                        label: "Agent tương tác"
                    }
                },
                validations: {
                    required: "Vui lòng chọn một loại Agent"
                }
            },
            callbackUrl: {
                helperText: "URL mà mã ủy quyền sẽ được gửi đến sau khi xác thực người dùng",
                label: "URL callback",
                placeholder: "https://myapp.io/callback",
                validations: {
                    required: "Cần có URL callback"
                }
            },
            cibaAuthReqExpiryTime: {
                helperText: "Chỉ định thời gian hết hạn cho yêu cầu xác thực CIBA",
                label: "Thời gian hết hạn yêu cầu xác thực CIBA (giây)",
                placeholder: "300",
                validations: {
                    minimum: "Thời gian hết hạn phải ít nhất 1 giây",
                    required: "Cần có thời gian hết hạn CIBA"
                }
            },
            description: {
                label: "Mô tả (tùy chọn)",
                placeholder: "Nhập mô tả cho agent"
            },
            isUserServingAgent: {
                label: "Cho phép người dùng đăng nhập vào agent này"
            },
            name: {
                label: "Tên agent",
                placeholder: "Nhập tên agent",
                validations: {
                    required: "Cần có tên agent"
                }
            },
            notificationChannels: {
                hint: "Cấu hình những phương thức thông báo mà ứng dụng này hỗ trợ",
                label: "Phương thức gửi thông báo",
                options: {
                    email: "Email",
                    sms: "SMS"
                },
                validations: {
                    required: "Vui lòng chọn ít nhất một phương thức thông báo"
                }
            }
        },
        help: {
            agentType: {
                description: "Chọn cách agent của bạn sẽ tương tác với người dùng và xử lý xác thực.",
                title: "Loại Agent"
            },
            background: {
                description: "Một agent hoạt động độc lập ở chế độ nền, thực thi các tác vụ và quy trình công việc mà không cần sự hiện diện liên tục của người dùng, chỉ tương tác với người dùng khi cần thiết.",
                title: "Agent chạy nền"
            },
            callbackUrl: {
                description: "URI chuyển hướng nơi mã ủy quyền được gửi đến sau khi xác thực người dùng.",
                hint: "Ví dụ: https://myapp.io/callback",
                title: "URL callback"
            },
            description: {
                description: "Mô tả ngắn gọn về những gì agent của bạn làm.",
                title: "Mô tả"
            },
            interactive: {
                description: "Một agent hoạt động theo thời gian thực với sự hiện diện liên tục của người dùng, nơi người dùng tương tác trực tiếp với agent và nhận phản hồi ngay lập tức trong các phiên đang hoạt động.",
                title: "Agent tương tác"
            },
            isUserServingAgent: {
                description: "Bật tùy chọn này nếu agent của bạn cần người dùng đăng nhập vào agent để truy cập các tài nguyên dành riêng cho người dùng thay mặt người dùng. Điều này sẽ tạo một ứng dụng OAuth2/OIDC cho agent.",
                title: "Cho phép người dùng đăng nhập"
            },
            name: {
                description: "Tên được sử dụng cho agent của bạn.",
                title: "Tên agent"
            },
            success: {
                agentId: {
                    description: "Định danh duy nhất cho agent của bạn. Dùng giá trị này để tham chiếu agent trong ứng dụng của bạn.",
                    title: "ID Agent"
                },
                agentSecret: {
                    description: "Mật khẩu cho agent của bạn. Hãy giữ nó an toàn và không chia sẻ công khai.",
                    title: "Secret của Agent"
                },
                description: "Hãy đảm bảo sao chép và lưu trữ các thông tin xác thực này ở một nơi an toàn. Secret của agent không thể truy xuất lại sau khi đóng hộp thoại này.",
                oauthClientId: {
                    description: "Định danh client OAuth 2.0 cho ứng dụng agent của bạn. Dùng giá trị này cho các luồng xác thực OAuth. Chỉ khả dụng nếu bạn đã bật \"Cho phép người dùng đăng nhập vào agent này\".",
                    title: "OAuth Client ID"
                },
                title: "Quan trọng: Lưu thông tin xác thực của bạn"
            }
        },
        subtitle: "Tạo một AI agent mới với xác thực người dùng tùy chọn",
        success: {
            fields: {
                agentId: {
                    label: "ID Agent"
                },
                agentSecret: {
                    label: "Secret của Agent"
                },
                oauthClientId: {
                    label: "OAuth Client ID",
                    unavailable: "OAuth Client ID không khả dụng"
                }
            },
            subtitle: "Agent của bạn đã được tạo. Vui lòng lưu thông tin xác thực bên dưới.",
            title: "Tạo Agent thành công",
            warning: "Hãy đảm bảo sao chép secret của agent ngay bây giờ vì bạn sẽ không thể thấy lại nó."
        },
        title: "Agent mới"
    }
};
