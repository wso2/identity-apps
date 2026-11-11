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
import { onboardedNS } from "../../../models";

export const onboarded: onboardedNS = {
    confirmationModal: {
        removeUser: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn xóa người dùng này, người dùng sẽ không thể truy cập console " +
                "trong tổ chức của bạn. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa người dùng khỏi tổ chức của bạn."
        }
    },
    notifications: {
        removeUser: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi xóa người dùng"
            },
            genericError: {
                description: "Không thể xóa người dùng khỏi tổ chức {{tenant}}",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã xóa người dùng khỏi tổ chức {{tenant}} thành công",
                message: "Xóa người dùng thành công"
            }
        }
    }
};
