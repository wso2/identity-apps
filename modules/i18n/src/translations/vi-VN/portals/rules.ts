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

import { rulesNS } from "../../../models";

export const rules: rulesNS = {
    alerts: {
        resourceNotFound: {
            description: "Vui lòng cập nhật sang một tài nguyên hợp lệ.",
            title: "Tài nguyên liên kết với quy tắc này không còn khả dụng."
        }
    },
    buttons: {
        and: "Và",
        clearRule: "Xóa quy tắc",
        newRule: "Quy tắc mới",
        or: "Hoặc"
    },
    fields: {
        autocomplete: {
            clearFilterActionText: "Xóa giá trị tìm kiếm để xem thêm",
            inputPlaceholderText: "Vui lòng nhập để chọn một tài nguyên ...",
            moreItemsMessage: "Chỉ các tài nguyên gần đây được liệt kê. Nhập để tìm những tài nguyên khác ...",
            placeholderText: "Vui lòng chọn một tài nguyên hoặc nhập để tìm kiếm ...",
            selectPlaceholderText: "Vui lòng chọn một tài nguyên"
        }
    },
    texts: {
        execute: "Thực thi",
        if: "Nếu"
    }
};
