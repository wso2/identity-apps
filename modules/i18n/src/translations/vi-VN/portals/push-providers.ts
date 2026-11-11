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

import { pushProvidersNS } from "../../../models";

export const pushProviders: pushProvidersNS = {
    alerts: {
        create: {
            error: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình nhà cung cấp push.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cấu hình nhà cung cấp push thành công.",
                message: "Cập nhật thành công."
            }
        },
        delete: {
            error: {
                description: "Đã xảy ra lỗi khi xóa cấu hình nhà cung cấp push",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã xóa cấu hình nhà cung cấp push thành công",
                message: "Xóa thành công"
            }
        },
        updateDefault: {
            error: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình người gửi push mặc định.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cấu hình người gửi push mặc định thành công.",
                message: "Cập nhật thành công."
            }
        }
    },
    dangerZoneGroup: {
        header: "Vùng nguy hiểm",
        revertConfig: {
            actionTitle: "Xóa",
            heading: "Xóa cấu hình",
            subHeading: "Thao tác này sẽ xóa cấu hình nhà cung cấp push. " +
                "Sau khi xóa, người dùng sẽ không nhận được bất kỳ thông báo đẩy nào."
        }
    },
    description: "Cấu hình thông tin xác thực nhà cung cấp thông báo đẩy để bật gửi thông báo đẩy.",
    goBack: "Quay lại Nhà cung cấp thông báo",
    heading: "Nhà cung cấp Push",
    modals: {
        deleteConfirmation: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn",
            content: "Nếu bạn xóa nhà cung cấp push, người dùng sẽ không còn nhận được thông báo đẩy từ các ứng dụng được thiết lập với xác thực push. Hãy tiếp tục một cách thận trọng.",
            heading: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn cấu hình nhà cung cấp push hiện tại."
        }
    },
    pushProviderSettings: {
        defaultSender: "Đặt làm người gửi push mặc định",
        defaultSenderDescription: "Chọn nhà cung cấp này làm người gửi thông báo đẩy mặc định."
    },
    subHeading: "Cấu hình một nhà cung cấp push để gửi thông báo đẩy đến người dùng của bạn.",
    updateButton: "Cập nhật"
};
