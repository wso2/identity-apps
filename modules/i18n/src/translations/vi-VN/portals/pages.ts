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
import { pagesNS } from "../../../models";

/**
 * @deprecated Add the relevant page title and description in the respective feature's i18n file.
 */
export const pages: pagesNS = {
    actions: {
        subTitle: "Tạo action để mở rộng luồng đăng nhập & đăng ký.",
        title: "Actions"
    },
    addEmailTemplate: {
        backButton: "Quay lại template {{name}}",
        subTitle: null,
        title: "Thêm template mới"
    },
    agents: {
        subTitle: "Cấu hình và quản lý danh tính AI agent cho tổ chức của bạn",
        title: "Agents"
    },
    approvalWorkflows: {
        subTitle: "Tạo và quản lý quy trình phê duyệt.",
        title: "Quy trình phê duyệt"
    },
    approvalsPage: {
        subTitle: "Xem xét các tác vụ vận hành cần bạn phê duyệt",
        title: "Phê duyệt"
    },
    editTemplate: {
        backButton: "Quay lại template {{name}}",
        subTitle: null,
        title: "{{template}}"
    },
    emailDomainDiscovery: {
        subTitle: "Cấu hình khám phá miền email cho các tổ chức.",
        title: "Khám phá tổ chức"
    },
    emailLocaleAdd: {
        backButton: "Quay lại template {{name}}",
        subTitle: null,
        title: "Chỉnh sửa template - {{name}}"
    },
    emailLocaleAddWithDisplayName: {
        backButton: "Quay lại template {{name}}",
        subTitle: null,
        title: "Thêm template mới cho {{displayName}}"
    },
    emailTemplateTypes: {
        subTitle: "Tạo và quản lý các loại template.",
        title: "Các loại template email"
    },
    emailTemplates: {
        backButton: "Quay lại các loại template email",
        subTitle: null,
        title: "Template email"
    },
    emailTemplatesWithDisplayName: {
        backButton: "Quay lại ứng dụng",
        subTitle: null,
        title: "Template - {{displayName}}"
    },
    groups: {
        subTitle: "Tạo và quản lý nhóm, gán người dùng vào chúng.",
        title: "Nhóm"
    },
    groupsEdit: {
        backButton: "Quay lại {{type}}",
        subTitle: null,
        title: "Chỉnh sửa nhóm"
    },
    impersonation: {
        subTitle: "Cấu hình cài đặt mạo danh cho tổ chức.",
        title: "Mạo danh"
    },
    invite: {
        subTitle: "Mời và quản lý quản trị viên và nhà phát triển.",
        title: "Quản trị viên & Nhà phát triển"
    },
    issuerUsageScope: {
        subTitle: "Cấu hình cài đặt phạm vi sử dụng issuer cho tổ chức.",
        title: "Phạm vi sử dụng issuer"
    },
    fapiSecurityPolicy: {
        subTitle: "Cấu hình hồ sơ bảo mật FAPI được áp dụng trên các ứng dụng của tổ chức bạn.",
        title: "Chính sách bảo mật FAPI"
    },
    oidcScopes: {
        subTitle: "Tạo và quản lý các phạm vi OpenID Connect (OIDC) và các thuộc tính gắn với phạm vi.",
        title: "Phạm vi OpenID Connect"
    },
    verifiablePresentationSettings: {
        subTitle: "Quản lý cách tổ chức của bạn yêu cầu và xác minh thông tin xác thực từ ví kỹ thuật số.",
        title: "Cài đặt trình bày có thể xác minh"
    },
    oidcScopesEdit: {
        backButton: "Quay lại Phạm vi",
        title: "Chỉnh sửa phạm vi: {{ name }}"
    },
    organizations: {
        subTitle: "Tạo và quản lý các tổ chức.",
        title: "Tổ chức"
    },
    overview: {
        subTitle: "Cấu hình và quản lý người dùng, vai trò, dialect thuộc tính, cấu hình máy chủ, v.v." +
            "v.v.",
        title: "Chào mừng, {{firstName}}"
    },
    roles: {
        alternateSubTitle: "Xem và quản lý các vai trò.",
        subTitle: "Tạo và quản lý các vai trò, gán quyền cho chúng.",
        title: "Vai trò"
    },
    rolesEdit: {
        backButton: "Quay lại {{type}}",
        subTitle: null,
        title: "Chỉnh sửa vai trò"
    },
    serverConfigurations: {
        subTitle: "Quản lý các cấu hình chung của máy chủ.",
        title: "Cấu hình chung"
    },
    users: {
        subTitle: "Tạo và quản lý người dùng, quyền truy cập người dùng và hồ sơ người dùng.",
        title: "Người dùng"
    },
    usersEdit: {
        backButton: "Quay lại {{type}}",
        subTitle: "{{name}}",
        title: "{{email}}"
    },
    webhooks: {
        subTitle: "Tạo webhook để thông báo cho các dịch vụ bên ngoài khi một số sự kiện xảy ra.",
        title: "Webhooks"
    },
    workflowRequestsPage: {
        subTitle: "Xem và quản lý các yêu cầu quy trình công việc.",
        title: "Yêu cầu quy trình công việc"
    }
};
