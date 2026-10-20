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

import { aiNS } from "../../../models";

export const ai: aiNS = {
    aiFlow: {
        disclaimer: "Flow AI có thể mắc lỗi. Hãy xác minh luồng được tạo để đảm bảo chính xác và tránh nhập dữ liệu cá nhân nhạy cảm.",
        notifications: {
            generateError: {
                description: "Đã xảy ra lỗi khi tạo luồng. Vui lòng thử lại.",
                message: "Đã xảy ra lỗi"
            },
            generateInputError: {
                description: "Đầu vào được cung cấp để tạo luồng không hợp lệ. Vui lòng thử lại.",
                message: "Đầu vào cung cấp không hợp lệ"
            },
            generateLimitError: {
                description: "Bạn đã vượt quá giới hạn tạo luồng. " +
                    "Vui lòng thử lại sau vài phút.",
                message: "Vượt quá giới hạn"
            },
            generateResultError: {
                description: "Đã xảy ra lỗi khi lấy kết quả tạo luồng. " +
                    "Vui lòng thử lại.",
                message: "Đã xảy ra lỗi"
            },
            generateResultFailed: {
                description: "Luồng được tạo không hợp lệ. Vui lòng thử lại với một prompt khác.",
                message: "Luồng được tạo không hợp lệ"
            },
            generateStatusError: {
                description: "Đã xảy ra lỗi khi lấy trạng thái tạo luồng. " +
                    "Vui lòng thử lại.",
                message: "Đã xảy ra lỗi"
            },
            generateSuccess: {
                description: "Luồng đã được tạo thành công.",
                message: "Tạo luồng thành công"
            },
            rateLimitError: {
                description: "Bạn đã vượt quá giới hạn tốc độ tạo luồng. Vui lòng thử lại sau vài phút.",
                message: "Vượt quá giới hạn tốc độ"
            }
        },
        promptsHistory: "Lịch sử",
        states: {
            0: "Bắt đầu khởi động",
            1: "Đang thu thập dữ liệu thiết yếu cho luồng của bạn...",
            2: "Đang hoàn thiện những bước cuối...",
            3: "Tạo luồng hoàn tất!"
        },
        termsAndConditions: "Điều khoản và điều kiện",
        title: "Flow AI"
    },
    aiLoginFlow: {
        banner: {
            collapsed: {
                button: "Thử Login Flow AI",
                heading: "Mô tả luồng đăng nhập của bạn và tạo nó bằng AI",
                subheading: "Mô tả yêu cầu luồng đăng nhập của bạn bằng ngôn ngữ tự nhiên và Login Flow AI sẽ cấu hình nó cho bạn."
            },
            full: {
                button: "Thử Login Flow AI",
                heading: "Mô tả luồng đăng nhập của bạn và tạo nó bằng AI",
                subheading: "Mô tả yêu cầu luồng đăng nhập của bạn bằng ngôn ngữ tự nhiên và Login Flow AI sẽ cấu hình nó cho bạn."
            },
            input: {
                button: "Tạo luồng đăng nhập",
                heading: "Mô tả luồng đăng nhập của bạn và tạo nó bằng AI",
                placeholder: "Nhập luồng đăng nhập của bạn. Ví dụ: có tên đăng nhập và mật khẩu làm bước đầu tiên,"+
                " và nhắc yếu tố thứ hai TOTP nếu người dùng có vai trò 'manager'.",
                subheading: "Mô tả yêu cầu luồng đăng nhập của bạn bằng ngôn ngữ tự nhiên và Login Flow AI sẽ cấu hình nó cho bạn."
            }
        },
        confirmations: {
            replacePrompt: {
                content: "Thao tác này không thể hoàn tác và sẽ xóa prompt hiện có.",
                header: "Thay thế prompt?",
                message: "Prompt bạn đã chọn sẽ thay thế prompt hiện có. Bạn có muốn tiếp tục không?"
            }
        },
        didYouKnow: "Bạn có biết?",
        disclaimer: "Login Flow AI có thể mắc lỗi. Hãy xác minh thông tin để đảm bảo chính xác. Không bao gồm bất kỳ "+
        "dữ liệu cá nhân nào như tên đăng nhập, số điện thoại, hoặc bất kỳ thông tin nhạy cảm nào khác.",
        notifications: {
            generateError: {
                description: "Đã xảy ra lỗi khi tạo luồng đăng nhập. Vui lòng thử lại.",
                message: "Đã xảy ra lỗi"
            },
            generateInputError: {
                description: "Đầu vào được cung cấp để tạo luồng đăng nhập không hợp lệ. Vui lòng thử lại.",
                message: "Đầu vào cung cấp không hợp lệ"
            },
            generateLimitError: {
                description: "Bạn đã vượt quá giới hạn tạo luồng đăng nhập. " +
                    "Vui lòng thử lại sau vài phút.",
                message: "Vượt quá giới hạn"
            },
            generateResultError: {
                description: "Đã xảy ra lỗi khi lấy kết quả tạo luồng đăng nhập. " +
                    "Vui lòng thử lại.",
                message: "Đã xảy ra lỗi"
            },
            generateResultFailed: {
                description: "Luồng đăng nhập được tạo không hợp lệ. Vui lòng thử lại với một prompt khác.",
                message: "Luồng đăng nhập được tạo không hợp lệ"
            },
            generateStatusError: {
                description: "Đã xảy ra lỗi khi lấy trạng thái tạo luồng đăng nhập. " +
                    "Vui lòng thử lại.",
                message: "Đã xảy ra lỗi"
            },
            noAuthenticators: {
                description: "Không tìm thấy phương thức xác thực nào cho đầu vào đã cho. Vui lòng thử lại.",
                message: "Không tìm thấy phương thức xác thực nào"
            },
            rateLimitError: {
                description: "Bạn đã vượt quá giới hạn tốc độ tạo luồng đăng nhập. Vui lòng thử lại sau vài phút.",
                message: "Vượt quá giới hạn tốc độ"
            }
        },
        promptsHistory: "Lịch sử",
        screens: {
            loading: {
                facts:{
                    0:"Asgardeo có trình chỉnh sửa trực quan giúp đơn giản hóa việc cấu hình luồng xác thực bằng cách cho phép"+
                    " đặt các phương thức xác thực và phần tử điều kiện một cách trực quan, nâng cao hiệu quả thiết kế.",
                    1:"Bạn có thể tạo các chuỗi xác thực động với script điều kiện cho "+
                    "luồng đăng nhập linh hoạt.",
                    2:"Bạn có thể dùng trình chỉnh sửa script xác thực của Asgardeo để tạo các script xác thực"+
                    " phù hợp với yêu cầu xác thực của bạn."
                },
                heading: "Đang tạo luồng đăng nhập của bạn",
                states: {
                    0: "Bắt đầu khởi động",
                    1: "Bắt đầu khởi động",
                    10: "Đang hoàn thiện những bước cuối...",
                    2: "Bắt đầu khởi động",
                    3: "Đang thu thập dữ liệu thiết yếu cho luồng đăng nhập của bạn...",
                    4: "Đang thu thập dữ liệu thiết yếu cho luồng đăng nhập của bạn...",
                    5: "Đang soạn script luồng đăng nhập...",
                    6: "Đang soạn script luồng đăng nhập...",
                    7: "Đang lắp ghép các bước xác thực...",
                    8: "Đang lắp ghép các bước xác thực...",
                    9: "Đang hoàn thiện những bước cuối..."
                }
            }
        },
        termsAndConditions: "Điều khoản và điều kiện",
        title: "Login Flow AI"
    },
    subscribeToAI: "Để tận hưởng quyền truy cập vào các tính năng do AI cung cấp, hãy đăng ký một tài khoản WSO2 AI miễn phí và lấy khóa đăng ký của bạn."
};
