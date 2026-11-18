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
import { insightsNS } from "../../../models";

export const insights: insightsNS = {
    activityType: {
        login: {
            filters: {
                authenticator: {
                    attributeName: "Loại kết nối",
                    values: {
                        apple: "Apple",
                        backupCodes: "Mã dự phòng",
                        basic: "Tên đăng nhập & Mật khẩu",
                        emailOtp: "Email OTP",
                        facebook: "Facebook",
                        fido2: "FIDO2",
                        github: "GitHub",
                        google: "Google",
                        hypr: "HYPR",
                        identifierFirst: "Định danh trước",
                        iproov: "IPROOV",
                        magicLink: "Magic Link",
                        oidc: "OIDC IdP",
                        organizationLogin: "Đăng nhập tổ chức",
                        saml: "SAML IdP",
                        smsOtp: "SMS OTP",
                        totp: "TOTP"
                    }
                },
                identityProvider: "ID kết nối",
                serviceProvider: "Ứng dụng",
                userStore: "Kho người dùng"
            }
        },
        m2m: {
            filters: {
                clientId: "Client ID",
                tenantDomain: "Tổ chức",
                tenantDomainPlaceholder: "Tìm kiếm tổ chức"
            }
        },
        registration: {
            filters: {
                onboardingMethod: {
                    attributeName: "Phương thức onboarding",
                    values: {
                        adminInitiated: "Bởi quản trị viên",
                        selfSignUp: "Tự đăng ký",
                        userInvited: "Lời mời qua email"
                    }
                }
            }
        }
    },
    advancedAnalytics: {
        card: {
            dataRetentionHint: "Sau khi bật, hành trình thống kê của bạn bắt đầu mới; lịch sử thống kê " +
                "của bạn bắt đầu lại từ đầu và dữ liệu hiện có sẽ không được chuyển sang.",
            description: "Có cái nhìn rõ ràng hơn về cách người dùng đăng nhập, đăng ký và sử dụng token, " +
                "với các bảng điều khiển trực tiếp cập nhật khi hoạt động diễn ra.",
            enableButton: "Bật thống kê nâng cao",
            title: "Chuyển sang thống kê nâng cao"
        },
        dialog: {
            agreement: "Tôi hiểu những thay đổi này áp dụng cho toàn bộ tổ chức của tôi và muốn bật " +
                "thống kê nâng cao.",
            dataRetentionPoint: "Lịch sử thống kê của bạn bắt đầu lại từ đầu kể từ thời điểm bạn chuyển " +
                "đổi; dữ liệu hiện có sẽ không được chuyển sang.",
            enableButton: "Bật",
            intro: "Thống kê nâng cao cung cấp cho bạn các bảng điều khiển phong phú hơn về đăng nhập, xác thực và " +
                "token. Một vài điều cần biết trước khi chuyển đổi:",
            irreversiblePoint: "Không thể chuyển ngược từ bảng điều khiển, vì vậy nên chắc chắn " +
                "trước khi bật. Điều này áp dụng cho mọi người trong tổ chức của bạn.",
            privacyPoint: "Thống kê nâng cao được cung cấp bởi <1>Moesif</1>, một công ty thuộc sở hữu của WSO2. Để " +
                "tạo ra các thống kê này, một số PII của người dùng cuối, như định danh người dùng và địa chỉ IP, có thể " +
                "được chia sẻ với Moesif. Xem <3>Điều khoản dịch vụ</3> và <5>Điều khoản dịch vụ của Moesif</5>.",
            title: "Chuyển sang thống kê nâng cao"
        },
        notifications: {
            enableError: {
                description: "Không thể bật thống kê nâng cao. Vui lòng thử lại.",
                message: "Thao tác thất bại"
            },
            enableSuccess: {
                description: "Thống kê nâng cao đã được bật cho tổ chức của bạn.",
                message: "Đã bật thống kê nâng cao"
            }
        }
    },
    advancedFilter: {
        filterAttribute: "Thuộc tính lọc",
        filterCondition: "Điều kiện lọc",
        filterValue: "Giá trị lọc"
    },
    commonFilters: {
        userId: "ID người dùng"
    },
    compareToLastPeriodMessage: "So sánh với kỳ trước",
    description: "Hiểu rõ hơn về hành vi người dùng qua thống kê sử dụng.",
    durationMessage: "Đang hiển thị kết quả từ <1>{{ startTimestamp }}</1> đến <1>{{ endTimestamp }}</1>",
    durationOption: "{{ duration }} ngày qua",
    graphs: {
        activeUsers: {
            title: "Người dùng đang hoạt động",
            titleHint: "Số lượng người dùng duy nhất đã đăng nhập vào tổ chức của bạn trong khoảng thời gian đã chọn"
        },
        failedLogins: {
            title: "Đăng nhập thất bại"
        },
        m2mAuthentications: {
            title: "Xác thực M2M",
            titleHint: "Số lượng yêu cầu token M2M được thực hiện đến tổ chức của bạn trong khoảng thời gian đã chọn"
        },
        signups: {
            title: "Đăng ký người dùng",
            titleHint: "Tổng số lượt đăng ký người dùng xảy ra trong khoảng thời gian đã chọn"
        },
        successLogins: {
            title: "Tổng số lần đăng nhập",
            titleHint: "Số lần đăng nhập thành công vào tổ chức của bạn trong khoảng thời gian đã chọn"
        }
    },
    lastFetchedMessage: {
        label: "Lấy lần cuối lúc {{ time }}",
        tooltipText: "Thống kê cho hoạt động mới nhất sẽ mất vài phút để được phản ánh trên biểu đồ"
    },
    notifications: {
        fetchInsights: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy thống kê cho khoảng thời gian đã chọn.",
                message: "Đã xảy ra lỗi"
            }
        }
    },
    pageTitle: "Thống kê chi tiết",
    title: "Thống kê chi tiết"
};
