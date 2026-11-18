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

import { SMSTemplatesNS } from "../../../models";

export const smsTemplates: SMSTemplatesNS = {
    dangerZone: {
        remove: {
            action: "Xóa template",
            heading: "Xóa template",
            message: "Thao tác này sẽ xóa template đã chọn và bạn " +
                "sẽ mất mọi thay đổi đã thực hiện với template này."
        },
        revert: {
            action: "Hoàn tác",
            heading: "Hoàn tác về mặc định",
            message: "Thao tác này sẽ hoàn tác template đã chọn về " +
                "mặc định và bạn sẽ mất mọi thay đổi đã thực hiện với template này."
        }
    },
    form: {
        inputs: {
            body: {
                charLengthWarning: "Hãy tham khảo nhà cung cấp dịch vụ SMS của bạn để biết giới hạn ký tự tối đa.",
                hint: "Bạn có thể sử dụng các biến placeholder trong nội dung SMS.",
                label: "Nội dung SMS",
                placeholder: "Nhập nội dung SMS"
            },
            template: {
                hint: "Chọn template SMS",
                label: "Template SMS",
                placeholder: "Chọn template SMS"
            }
        }
    },
    notifications: {
        deleteSmsTemplate: {
            error: {
                description: "Lỗi khi xóa template SMS. Vui lòng thử lại",
                message: "Lỗi khi xóa template SMS"
            },
            success: {
                description: "Xóa template SMS thành công",
                message: "Xóa template SMS thành công"
            }
        },
        getSmsTemplate: {
            error: {
                description: "Đã xảy ra lỗi khi lấy template SMS.",
                message: "Lỗi khi lấy template SMS."
            }
        },
        getSmsTemplateList: {
            error: {
                description: "Đã xảy ra lỗi khi lấy danh sách template SMS.",
                message: "Đã xảy ra lỗi khi lấy danh sách template SMS"
            }
        },
        updateSmsTemplate: {
            error: {
                description: "Lỗi khi cập nhật template SMS. " +
                    "Hãy đảm bảo bạn đã điền tất cả các trường bắt buộc và thử lại",
                message: "Lỗi khi cập nhật template SMS"
            },
            success: {
                description: "Cập nhật template SMS thành công",
                message: "Cập nhật template SMS thành công"
            }
        }
    },
    page: {
        description: "Tùy chỉnh các template sms được sử dụng trong tổ chức của bạn.",
        header: "Template SMS"
    },
    tabs: {
        content: {
            label: "Nội dung"
        },
        preview: {
            label: "Xem trước"
        }
    }
};
