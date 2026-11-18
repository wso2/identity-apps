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
import { HelpPanelNS } from "../../../models";

export const helpPanel: HelpPanelNS = {
    actions: {
        close: "Đóng",
        open: "Mở bảng trợ giúp",
        pin: "Ghim",
        unPin: "Bỏ ghim"
    },
    notifications: {
        pin: {
            success: {
                description: "Bảng trợ giúp sẽ luôn xuất hiện {{state}} trừ khi bạn thay đổi rõ ràng.",
                message: "Bảng trợ giúp {{state}}"
            }
        }
    }
};
