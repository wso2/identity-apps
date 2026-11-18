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
import { smsProvidersNS } from "../../../models";

export const smsProviders: smsProvidersNS = {
    confirmationModal: {
        assertionHint: "Vui lòng xác nhận thao tác của bạn.",
        content: "Xóa cấu hình nhà cung cấp SMS này có thể làm gián đoạn xác thực SMS OTP cho " +
            "các ứng dụng hiện đang sử dụng nó. Bạn có thể không còn nhận được OTP qua SMS, điều này có thể " +
            "ảnh hưởng đến việc đăng nhập của người dùng. Vui lòng tiếp tục một cách thận trọng.",
        header: "Bạn có chắc không?",
        message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn cấu hình nhà cung cấp SMS."
    },
    dangerZoneGroup: {
        header: "Vùng nguy hiểm",
        revertConfig: {
            actionTitle: "Xóa",
            heading: "Xóa cấu hình",
            subHeading: "Thao tác này sẽ xóa cấu hình nhà cung cấp sms. " +
                "Sau khi xóa, bạn sẽ không nhận được SMS."
        }
    },
    description: "Cấu hình thông tin xác thực nhà cung cấp SMS để bật gửi thông báo SMS.",
    form: {
        custom: {
            authentication: {
                updateRequired: "Vui lòng cấu hình lại thông tin xác thực trước khi tiếp tục."
            },
            contentType: {
                hint: "Content type của yêu cầu API. Giá trị được chấp nhận là 'FORM' hoặc 'JSON'",
                label: "Content Type",
                placeholder: "JSON"
            },
            headers: {
                hint: "Danh sách tiêu đề HTTP phân tách bằng dấu phẩy sẽ được đưa vào yêu cầu API SMS.",
                label: "Tiêu đề",
                placeholder: "authorisation: Bearer {{token}}"
            },
            httpMethod: {
                hint: "Phương thức HTTP của yêu cầu API. (Mặc định là POST)",
                label: "Phương thức HTTP",
                placeholder: "POST"
            },
            key: {
                hint: "Bất kỳ khóa xác thực nào cần được gửi dưới dạng tiêu đề HTTP.",
                label: "Khóa xác thực nhà cung cấp SMS",
                placeholder: "Nhập khóa xác thực nhà cung cấp SMS"
            },
            payload: {
                hint: "Template payload của yêu cầu API. Dùng {{body}} để đại diện cho nội dung " +
                        "SMS được tạo. Dùng {{mobile}} để đại diện cho số điện thoại.",
                label: "Template payload",
                placeholder: "{\"content\": {{body}}, \"to\": {{mobile}} }"
            },
            providerName: {
                hint: "Tên của nhà cung cấp SMS.",
                label: "Tên nhà cung cấp SMS",
                placeholder: "Nhập tên nhà cung cấp SMS"
            },
            providerUrl: {
                hint: "URL của nhà cung cấp SMS.",
                label: "URL nhà cung cấp SMS",
                placeholder: "Nhập URL nhà cung cấp sms"
            },
            secret: {
                hint: "Bất kỳ secret xác thực nào cần được gửi dưới dạng tiêu đề HTTP.",
                label: "Secret xác thực nhà cung cấp SMS",
                placeholder: "Nhập secret xác thực nhà cung cấp SMS"
            },
            sender: {
                hint: "Định danh người gửi SMS (số điện thoại hoặc tên).",
                label: "Người gửi",
                placeholder: "Nhập người gửi"
            },
            subHeading: "Cài đặt tùy chỉnh",
            validations: {
                contentTypeInvalid: "Content type không hợp lệ",
                methodInvalid: "Phương thức HTTP không hợp lệ",
                required: "Trường này không được để trống"
            }
        },
        twilio: {
            accountSID: {
                hint: "Định danh chuỗi tài khoản Twilio đóng vai trò tên đăng nhập cho tài khoản",
                label: "Twilio Account SID",
                placeholder: "Nhập Twilio account SID"
            },
            authToken: {
                hint: "Access token được tạo bởi máy chủ xác thực Twilio ",
                label: "Twilio Auth Token",
                placeholder: "Nhập Twilio auth token"
            },
            sender: {
                hint: "Giá trị chữ và số để nhận diện người gửi (Tham khảo tài liệu nhà cung cấp).",
                label: "ID người gửi",
                placeholder: "Nhập ID người gửi"
            },
            subHeading: "Cài đặt Twilio",
            validations: {
                required: "Trường này không được để trống"
            }
        },
        vonage: {
            accountSID: {
                hint: "Vonage API Key đóng vai trò tên đăng nhập cho tài khoản.",
                label: "Vonage API Key",
                placeholder: "Nhập Vonage API key"
            },
            authToken: {
                hint: "API Secret được tạo bởi máy chủ xác thực Vonage.",
                label: "Vonage API Secret",
                placeholder: "Nhập Vonage API Secret"
            },
            sender: {
                hint: "Giá trị chữ và số để nhận diện người gửi (Tham khảo tài liệu nhà cung cấp).",
                label: "ID người gửi",
                placeholder: "Nhập ID người gửi"
            },
            subHeading: "Cài đặt Vonage",
            validations: {
                required: "Trường này không được để trống"
            }
        }
    },
    goBack: "Quay lại Nhà cung cấp thông báo",
    heading: "Nhà cung cấp SMS",
    info: "Bạn có thể tùy chỉnh nội dung SMS bằng <1>Template SMS</1>.",
    notifications: {
        deleteConfiguration: {
            error: {
                description: "Lỗi khi xóa cấu hình nhà cung cấp sms.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã khôi phục cấu hình nhà cung cấp sms thành công.",
                message: "Khôi phục thành công"
            }
        },
        getConfiguration: {
            error: {
                description: "Lỗi khi lấy cấu hình nhà cung cấp sms.",
                message: "Đã xảy ra lỗi"
            }
        },
        updateConfiguration: {
            error: {
                description: "Lỗi khi cập nhật cấu hình nhà cung cấp sms.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cấu hình nhà cung cấp sms thành công.",
                message: "Cập nhật thành công"
            }
        }
    },
    sendTestSMSButton: "Gửi SMS thử",
    subHeading: "Cấu hình một nhà cung cấp SMS để gửi SMS đến người dùng của bạn.",
    updateButton: "Cập nhật"
};
