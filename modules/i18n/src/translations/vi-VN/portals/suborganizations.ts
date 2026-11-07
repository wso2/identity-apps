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
import { SuborganizationsNS } from "../../../models";
/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const suborganizations: SuborganizationsNS = {
    notifications: {
        duplicateOrgError: {
            description: "Tổ chức bạn đang cố tạo đã tồn tại.",
            message: "Đã tồn tại một tổ chức có cùng tên."
        },
        subOrgLevelsLimitReachedError: {
            emptyPlaceholder: {
                action: "Xem các gói",
                subtitles:
                    "Bạn có thể liên hệ quản trị viên tổ chức hoặc (nếu bạn là " +
                    "quản trị viên) nâng cấp gói đăng ký để tăng giới hạn cho phép.",
                title: "Bạn đã đạt số cấp tổ chức tối đa được phép."
            },
            heading: "Bạn đã đạt số cấp tổ chức tối đa được phép cho tổ chức."
        },
        tierLimitReachedError: {
            emptyPlaceholder: {
                action: "Xem các gói",
                subtitles:
                    "Bạn có thể liên hệ quản trị viên tổ chức hoặc (nếu bạn là " +
                    "quản trị viên) nâng cấp gói đăng ký để tăng giới hạn cho phép.",
                title: "Bạn đã đạt số lượng tổ chức tối đa được phép."
            },
            heading: "Bạn đã đạt giới hạn tối đa cho tổ chức"
        }
    }
};
