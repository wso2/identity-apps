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

import { webhooksNS } from "../../../models";

export const webhooks: webhooksNS = {
    advancedSearch: {
        filterAttribute: {
            placeholder: "Ví dụ: Name, Endpoint"
        },
        filterAttributeOptions: {
            endpoint: { label: "Endpoint" },
            name: { label: "Tên" }
        },
        filterCondition: {
            placeholder: "Ví dụ: Contains, Starts with, v.v."
        },
        filterValue: {
            placeholder: "Nhập giá trị để tìm kiếm"
        },
        placeholder: "Tìm kiếm webhook theo tên hoặc endpoint"
    },
    common: {
        status: {
            active: "Đang hoạt động",
            inactive: "Không hoạt động"
        }
    },
    configForm: {
        buttons: {
            cancel: "Hủy",
            changeSecret: "Thay đổi secret",
            create: "Tạo",
            update: "Cập nhật"
        },
        channels: {
            heading: "Chọn sự kiện",
            status: {
                subscriptionAccepted: "đã gửi yêu cầu đăng ký",
                subscriptionError: "lỗi yêu cầu đăng ký",
                unsubscriptionAccepted: "đã gửi yêu cầu hủy đăng ký",
                unsubscriptionError: "lỗi yêu cầu hủy đăng ký"
            },
            subHeading: "Chọn các sự kiện bạn muốn nhận thông báo webhook.",
            validations: {
                empty: "Phải chọn ít nhất một sự kiện."
            }
        },
        fields: {
            endpoint: {
                hint: "URL của endpoint bên ngoài tích hợp như một webhook.",
                label: "Endpoint",
                placeholder: "https://myservice.com/webhook",
                validations: {
                    empty: "Endpoint là trường bắt buộc.",
                    invalid: "Vui lòng nhập một URL hợp lệ.",
                    notHttps: "URL không an toàn (HTTP). Dùng HTTPS để có kết nối an toàn."
                }
            },
            name: {
                hint: "Phải là chuỗi chỉ chứa chữ cái (a-z, A-Z), số (0-9), " +
                    "dấu cách, dấu gạch dưới (_) và dấu gạch ngang (-).",
                label: "Tên",
                placeholder: "Webhook mẫu",
                validations: {
                    empty: "Tên là trường bắt buộc.",
                    invalid: "Vui lòng nhập một tên hợp lệ tuân theo các hướng dẫn đã cho."
                }
            },
            secret: {
                hint: {
                    common: "Phải là chuỗi chỉ chứa chữ cái (a-z, A-Z), số (0-9), ký hiệu, và dấu cách. ",
                    create: "Secret này được dùng để tạo chữ ký HMAC để endpoint của bạn có thể xác minh rằng các sự kiện là an toàn và không bị thay đổi. Sau khi thêm, secret sẽ không được hiển thị. Bạn chỉ có thể đặt lại nó.",
                    createWebSubHubMode: "Secret này được dùng để tạo chữ ký HMAC (tiêu đề X-Hub-Signature) để endpoint của bạn có thể xác minh rằng các sự kiện là an toàn và không bị thay đổi. Bạn không thể xem hoặc thay đổi secret sau khi tạo.",
                    update: "Secret này được dùng để tạo chữ ký HMAC để endpoint của bạn có thể xác minh rằng các sự kiện là an toàn và không bị thay đổi. Sau khi cập nhật, secret sẽ không được hiển thị. Bạn chỉ có thể đặt lại nó một lần nữa."
                },
                info: {
                    message: "Secret này được dùng để tạo chữ ký HMAC để endpoint của bạn có thể xác minh rằng các sự kiện là an toàn và không bị thay đổi. Nếu bạn đang thay đổi secret, hãy nhớ cập nhật nó trong endpoint dịch vụ bên ngoài của bạn để duy trì kết nối.",
                    messageWebSubHubMode: "Secret này được dùng để tạo chữ ký HMAC (tiêu đề X-Hub-Signature) để endpoint của bạn có thể xác minh rằng các sự kiện là an toàn và không bị thay đổi. Bạn không thể xem hoặc thay đổi secret sau khi tạo.",
                    title: "Một <strong>secret</strong> đã được cấu hình cho webhook này."
                },
                label: "Secret",
                placeholder: "Secret",
                validations: {
                    empty: "Secret là trường bắt buộc.",
                    invalid: "Vui lòng nhập một secret hợp lệ tuân theo các hướng dẫn đã cho."
                }
            }
        }
    },
    confirmations: {
        delete: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn xóa cấu hình webhook này, endpoint dịch vụ được định nghĩa sẽ không còn nhận thông báo sự kiện." +
                " Vui lòng tiếp tục một cách thận trọng.",
            heading: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn webhook đã cấu hình."
        }
    },
    dangerZone: {
        delete: {
            actionTitle: "Xóa",
            heading: "Xóa webhook",
            subHeading: "Sau khi webhook bị xóa, không thể khôi phục lại và endpoint dịch vụ được định nghĩa sẽ không còn nhận thông báo sự kiện."
        },
        heading: "Vùng nguy hiểm"
    },
    goBackToWebhooks: "Quay lại Webhooks",
    heading: "Thêm Webhook",
    notifications: {
        createWebhook: {
            error: {
                description: "{{description}}",
                message: "Không thể tạo webhook."
            },
            success: {
                description: "Webhook đã được tạo thành công.",
                message: "Đã tạo webhook"
            }
        },
        deleteWebhook: {
            error: {
                description: "{{description}}",
                message: "Không thể xóa webhook."
            },
            success: {
                description: "Webhook đã được xóa thành công.",
                message: "Đã xóa webhook"
            }
        },
        fetchEventProfile: {
            error: {
                description: "{{description}}",
                genericDescription: "Đã xảy ra lỗi khi lấy hồ sơ sự kiện.",
                message: "Không thể lấy hồ sơ sự kiện."
            }
        },
        fetchWebhook: {
            error: {
                description: "{{description}}",
                genericDescription: "Đã xảy ra lỗi khi lấy webhook.",
                message: "Không thể lấy webhook."
            }
        },
        fetchWebhooks: {
            error: {
                description: "{{description}}",
                genericDescription: "Đã xảy ra lỗi khi lấy các webhook.",
                message: "Không thể lấy các webhook."
            }
        },
        retryWebhookState: {
            error: {
                description: "{{description}}",
                message: "Không thể gửi lại yêu cầu"
            },
            success: {
                description: "Đã gửi lại các yêu cầu {{requestType}}.",
                message: "Đã gửi lại yêu cầu."
            }
        },
        updateWebhook: {
            error: {
                description: "{{description}}",
                message: "Không thể cập nhật webhook."
            },
            success: {
                description: "Webhook đã được cập nhật thành công.",
                message: "Đã cập nhật webhook"
            }
        },
        updateWebhookSettings: {
            error: {
                description: "{{description}}",
                genericDescription: "Đã xảy ra lỗi khi cập nhật cài đặt webhook.",
                message: "Không thể cập nhật cài đặt webhook."
            },
            success: {
                description: "Cài đặt webhook đã được cập nhật thành công.",
                message: "Đã cập nhật cài đặt webhook"
            }
        },
        updateWebhookStatus: {
            error: {
                description: "{{description}}",
                message: "Không thể thay đổi trạng thái webhook."
            },
            success: {
                description: "Trạng thái webhook đã được thay đổi thành công thành {{status}}.",
                message: "Đã thay đổi trạng thái webhook"
            }
        }
    },
    pages: {
        create: {
            heading: "Thêm Webhook",
            subHeading: "Cấu hình một webhook mới để nhận thông báo sự kiện."
        },
        edit: {
            heading: "Cập nhật Webhook",
            headingWebSubHubMode: "Quản lý Webhook",
            subHeading: "Cập nhật cấu hình webhook.",
            subHeadingWebSubHubMode: "Kích hoạt, vô hiệu hóa hoặc xóa webhook."
        },
        list: {
            buttons: {
                add: "Thêm Webhook",
                settings: "Cài đặt Webhook"
            },
            columns: {
                status: "Trạng thái",
                webhook: "Webhook"
            },
            emptyList: {
                subHeading: "Hiện tại không có webhook nào khả dụng."
            },
            heading: "Webhooks",
            subHeading: "Tạo và quản lý webhook để thông báo cho các dịch vụ bên ngoài khi một số sự kiện xảy ra."
        },
        settings: {
            backButton: "Quay lại Webhooks",
            heading: "Cài đặt Webhook",
            organizationPolicy: {
                heading: "Chọn tổ chức nào nên xuất bản sự kiện đến webhook.",
                radioOptions: {
                    currentOrgAndImmediateChild: "Tổ chức này và các tổ chức con trực tiếp của nó.",
                    currentOrgOnly: "Chỉ tổ chức này."
                }
            },
            subHeading: "Cài đặt liên quan đến cấu hình webhook."
        }
    },
    sidePanel: {
        name: "Webhooks"
    },
    statusBanner: {
        buttons: {
            retry: "Gửi lại yêu cầu"
        },
        pendingActivation: {
            message: "Hãy đảm bảo endpoint của bạn đã nhận và phản hồi thử thách. Bạn có thể gửi lại yêu cầu để thử đăng ký lại. Các sự kiện sẽ chỉ được gửi cho các kênh đã được xác minh thành công.",
            title: "Đã gửi yêu cầu đăng ký."
        },
        pendingDeactivation: {
            message: "Hãy đảm bảo endpoint của bạn đã nhận và phản hồi thử thách. Bạn có thể gửi lại yêu cầu để thử hủy đăng ký lại. Các sự kiện vẫn có thể được gửi đến các kênh chưa được hủy đăng ký.",
            title: "Đã gửi yêu cầu hủy đăng ký."
        }
    },
    subHeading: "Đăng ký một webhook cho các sự kiện bạn quan tâm."
};
