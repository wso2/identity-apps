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
import { BrandingNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const branding: BrandingNS = {
    brandingCustomText: {
        revertScreenConfirmationModal: {
            content: "Sau khi bạn xác nhận, người dùng của bạn sẽ bắt đầu thấy mặc định của {{productName}} và thao tác này không thể hoàn tác. Vui lòng tiếp tục một cách thận trọng.",
            heading: "Bạn có chắc không?",
            message: "Đang hoàn tác văn bản tùy chỉnh của màn hình <1>{{screen}}</1> cho ngôn ngữ <3>{{locale}}</3>."
        },
        revertUnsavedConfirmationModal: {
            content: "Nếu bạn chuyển màn hình, các thay đổi chưa lưu của bạn sẽ bị mất. Nhấn <1>Xác nhận</1> để tiếp tục.",
            heading: "Bạn có chắc không?",
            message: "Lưu các thay đổi chưa lưu của bạn"
        },
        form: {
            genericFieldResetTooltip: "Đặt lại về mặc định",
            genericFieldPlaceholder: "Nhập văn bản của bạn",
            fields: {
                copyright: {
                    hint: "Văn bản xuất hiện ở chân trang của màn hình đăng nhập. Bạn có thể dùng placeholder `{{currentYear}}` để tự động hiển thị năm hiện tại."
                },
                "email.link.expiry.message": {
                    hint: "Thông báo xuất hiện khi liên kết email hết hạn. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "privacy.policy": {
                    hint: "Văn bản chính sách quyền riêng tư xuất hiện ở chân trang của màn hình đăng nhập. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "site.title": {
                    hint: "Tiêu đề trang có thể xuất hiện trong tab trình duyệt, kết quả công cụ tìm kiếm, chia sẻ mạng xã hội, v.v. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "terms.of.service": {
                    hint: "Văn bản điều khoản dịch vụ xuất hiện ở chân trang của màn hình đăng nhập. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "login.button": {
                    hint: "Văn bản xuất hiện trên nút hành động chính của hộp đăng nhập. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "login.heading": {
                    hint: "Tiêu đề của hộp đăng nhập. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "login.identifier.input.label": {
                    hint: "Nhãn của trường nhập định danh trong hộp đăng nhập. Nếu không đặt, mặc định của {{productName}} sẽ được dùng.",
                    warning: "<0>QUAN TRỌNG</0>: Việc tùy chỉnh nhãn định danh đăng nhập sẽ thay thế nhãn động khi {{feature}} được <1>cấu hình</1>."
                },
                "sms.otp.heading": {
                    hint: "Tiêu đề của hộp SMS OTP. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "email.otp.heading": {
                    hint: "Tiêu đề của hộp Email OTP. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "totp.heading": {
                    hint: "Tiêu đề của hộp TOTP. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "sign.up.button": {
                    hint: "Văn bản xuất hiện trên nút hành động chính của hộp đăng ký. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "sign.up.heading": {
                    hint: "Tiêu đề của hộp đăng ký. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "password.recovery.body": {
                    hint: "Nội dung văn bản của hộp khôi phục mật khẩu. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "password.recovery.identifier.input.placeholder": {
                    hint: "Placeholder của trường nhập định danh trong hộp khôi phục mật khẩu. Nếu không đặt, mặc định của {{productName}} sẽ được dùng.",
                    warning: "<0>QUAN TRỌNG</0>: Việc tùy chỉnh placeholder định danh khôi phục mật khẩu sẽ thay thế placeholder động khi {{feature}} được <1>cấu hình</1>."
                },
                "password.recovery.button.email.link": {
                    hint: "Văn bản xuất hiện trên nút hành động chính của hộp khôi phục mật khẩu. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "password.recovery.heading": {
                    hint: "Tiêu đề của hộp khôi phục mật khẩu. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "password.reset.button": {
                    hint: "Văn bản xuất hiện trên nút hành động chính của hộp đặt lại mật khẩu. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "password.reset.heading": {
                    hint: "Tiêu đề của hộp đặt lại mật khẩu. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "password.reset.success.action": {
                    hint: "Văn bản xuất hiện trên liên kết hành động chính của hộp đặt lại mật khẩu thành công. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "password.reset.success.body": {
                    hint: "Nội dung văn bản của hộp đặt lại mật khẩu thành công. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                },
                "password.reset.success.heading": {
                    hint: "Tiêu đề của hộp đặt lại mật khẩu thành công. Nếu không đặt, mặc định của {{productName}} sẽ được dùng."
                }
            }
        },
        localeSelectDropdown: {
            label: "Ngôn ngữ",
            placeholder: "Chọn ngôn ngữ"
        },
        modes: {
            text: {
                label: "Trường văn bản"
            },
            json: {
                label: "JSON"
            }
        },
        notifications: {
            getPreferenceError: {
                description: "Không thể lấy văn bản tùy chỉnh của màn hình {{screen}} cho {{locale}}.",
                message: "Không thể lấy văn bản tùy chỉnh"
            },
            revertError: {
                description: "Không thể hoàn tác văn bản tùy chỉnh của màn hình {{screen}} cho {{locale}}.",
                message: "Không thể hoàn tác văn bản tùy chỉnh"
            },
            resetSuccess: {
                description: "Đã hoàn tác văn bản tùy chỉnh của màn hình {{screen}} cho {{locale}} thành công.",
                message: "Hoàn tác thành công"
            },
            updateError: {
                description: "Không thể cập nhật văn bản tùy chỉnh của màn hình {{screen}} cho {{locale}}.",
                message: "Không thể cập nhật văn bản tùy chỉnh"
            },
            updateSuccess: {
                description: "Đã cập nhật văn bản tùy chỉnh của màn hình {{screen}} cho {{locale}} thành công.",
                message: "Cập nhật thành công"
            }
        },
        screenSelectDropdown: {
            label: "Màn hình",
            placeholder: "Chọn màn hình"
        },
        screenSelectVariationDropdown: {
            label: "Biến thể",
            placeholder: "Chọn biến thể"
        }
    },
    connectors: {
        multiAttributeLogin: "Định danh đăng nhập đa thuộc tính",
        alternativeLoginIdentifier: "Định danh đăng nhập thay thế"
    },
    form: {
        actions: {
            resetAll: "Đặt lại về mặc định",
            save: "Lưu & Xuất bản"
        }
    },
    screens: {
        common: "Chung",
        "email-link-expiry": "Hết hạn liên kết email",
        "email-otp": "Email OTP",
        "email-template": "Template email",
        login: "Đăng nhập",
        myaccount: "My Account",
        "password-recovery": "Khôi phục mật khẩu",
        "password-reset": "Đặt lại mật khẩu",
        "password-reset-success": "Đã gửi liên kết đặt lại mật khẩu",
        "push-auth": "Xác thực push",
        "sign-up": "Đăng ký",
        "sms-otp": "SMS OTP",
        "totp": "TOTP",
        "username-recovery-claim": "Claim khôi phục tên đăng nhập",
        "username-recovery-channel-selection": "Chọn kênh khôi phục tên đăng nhập",
        "username-recovery-success": "Khôi phục tên đăng nhập thành công"
    },
    variations: {
        "sms-otp": "SMS OTP",
        "email-otp": "Email OTP",
        "email-link": "Liên kết email",
        "base": "Cơ bản",
        "multi": "Nhiều tùy chọn",
        "sms": "SMS",
        "email": "Email"
    },
    ai: {
        banner: {
            full: {
                heading: "Tạo kiểu thương hiệu của bạn bằng AI",
                subHeading: "Nhập URL website của bạn và Branding AI sẽ điều chỉnh cài đặt thương hiệu để khớp với chủ đề của bạn.",
                button: "Thử Branding AI"
            },
            input: {
                heading: "Tạo kiểu thương hiệu của bạn bằng AI",
                subHeading: "Nhập URL website của bạn và Branding AI sẽ điều chỉnh cài đặt thương hiệu để khớp với chủ đề của bạn.",
                placeholder: "Nhập URL website",
                button: "Tạo thương hiệu"
            },
            collapsed: {
                heading: "Tạo kiểu thương hiệu của bạn bằng AI",
                subHeading: "Nhập URL website của bạn và Branding AI sẽ điều chỉnh cài đặt thương hiệu để khớp với chủ đề của bạn.",
                button: "Thử Branding AI"
            }
        },
        disclaimer: "Branding AI có thể mắc lỗi. Hãy xác minh thông tin để đảm bảo chính xác. Không bao gồm bất kỳ dữ liệu cá nhân nào "+
        "như tên đăng nhập, số điện thoại, hoặc bất kỳ thông tin nhạy cảm nào khác.",
        notifications: {
            generateError: {
                description: "Đã xảy ra lỗi khi tạo thương hiệu.",
                message: "Tạo thương hiệu thất bại"
            },
            generateLimitError: {
                description: "Bạn đã vượt quá giới hạn tạo thương hiệu. " +
                    "Vui lòng thử lại sau vài phút.",
                message: "Vượt quá giới hạn"
            },
            regenerateError: {
                description: "Đã xảy ra lỗi khi tạo lại thương hiệu.",
                message: "Tạo lại thương hiệu thất bại"
            },
            resetSuccess: {
                description: "Đã đặt lại thương hiệu do AI tạo thành công.",
                message: "Đặt lại thương hiệu AI thành công"
            },
            renderingError: {
                description: "Đã xảy ra lỗi khi hiển thị website.",
                message: "Hiển thị website thất bại"
            }
        },
        screens: {
            loading: {
                heading: "Đang tạo thương hiệu của bạn",
                didYouKnow: "Bạn có biết?",
                facts: {
                    0: "Các khả năng theming nâng cao của {{productName}} cho phép bạn tùy chỉnh tiêu đề trang, thông tin bản quyền và email hỗ trợ trên các trang đăng nhập để khớp với bản sắc thương hiệu của bạn.",
                    1: "Bạn có thể nâng cao cổng đăng nhập của mình bằng cách cập nhật liên kết đến chính sách quyền riêng tư, điều khoản dịch vụ và chính sách cookie để tuân thủ rõ ràng với {{productName}}.",
                    2: "Với các tính năng thương hiệu của {{productName}}, bạn có thể đảm bảo trải nghiệm thương hiệu nhất quán trên tất cả ứng dụng của mình."
                },
                states: {
                    0: "Bắt đầu khởi động",
                    1: "Đang phân tích trang web của bạn...",
                    2: "Đang thu thập các yếu tố hình ảnh...",
                    3: "Đang thu thập các yếu tố hình ảnh...",
                    4: "Đang tạo chủ đề thương hiệu của bạn...",
                    5: "Đang tạo chủ đề thương hiệu của bạn...",
                    6: "Đang tạo chủ đề thương hiệu của bạn...",
                    7: "Đang hoàn thiện những bước cuối...",
                    8: "Tạo thương hiệu hoàn tất!"
                }
            }
        },
        title: "Branding AI",
        termsAndConditions: "Điều khoản và điều kiện"
    },
    tabs: {
        preview: {
            label: "Xem trước"
        },
        text: {
            label: "Văn bản"
        }
    },
    customLayout: {
        dangerModal: {
            assertionHint: "Tôi hiểu các rủi ro và muốn tiếp tục.",
            heading: "Bật layout tùy chỉnh dựa trên tệp?",
            message: "Kích hoạt layout tùy chỉnh mà không có tệp layout ở cấp máy chủ sẽ làm hỏng tất cả " +
                "việc hiển thị trang đăng nhập, bao gồm ứng dụng Console.",
            content: "Tùy chọn layout tùy chỉnh dựa trên các template layout được triển khai ở cấp máy chủ dưới " +
                "<1>extensions/layouts/custom/{{tenant}}</1>. Nếu không có tệp như vậy cho tổ chức này, tất cả " +
                "trang đăng nhập sẽ không hiển thị được. Hãy đảm bảo các tệp layout của bạn được triển khai trước khi lưu. " +
                "Tham khảo tài liệu chính thức để biết thêm chi tiết: " +
                "<3>Tùy chỉnh > Tùy chỉnh thương hiệu > Tùy chỉnh layout > Bằng cách cập nhật tệp máy chủ</3>."
        }
    },
    customPageEditor: {
        backButton: "Quay lại",
        brandingNotConfiguredTooltip: "Thương hiệu chưa được bật. Vui lòng cấu hình và lưu cài đặt thương hiệu để " +
            "bật trình chỉnh sửa layout tùy chỉnh.",
        tabs: {
            html: {
                label: "HTML"
            },
            css: {
                label: "CSS"
            },
            js: {
                label: "JavaScript"
            }
        },
        notifications: {
            successContentUpdate: {
                description: "Các thay đổi của bạn đã được lưu và xuất bản.",
                message: "Cập nhật nội dung layout tùy chỉnh thành công"
            },
            errorContentUpdate: {
                description: "Đã xảy ra lỗi khi lưu. Vui lòng thử lại.",
                message: "Cập nhật nội dung layout tùy chỉnh thất bại"
            },
            errorContentSizeLimit: {
                description: "Kích thước nội dung vượt quá giới hạn cho phép. Vui lòng giảm kích thước nội dung " +
                    "và thử lại.",
                message: "Vượt quá giới hạn kích thước nội dung"
            }
        }
    }
};
