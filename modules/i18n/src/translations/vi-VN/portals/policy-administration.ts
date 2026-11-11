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

import { policyAdministrationNS } from "../../../models";

export const policyAdministration: policyAdministrationNS = {
    activePoliciesPlaceholder: {
        subtitle: "Hiện tại không có chính sách đang hoạt động nào để hiển thị.",
        title: "Không tìm thấy chính sách đang hoạt động nào"
    },
    advancedSearch: {
        placeholder: "Tìm kiếm theo tên chính sách"
    },
    alerts: {
        activateFailure: {
            description: "Không thể kích hoạt chính sách. Vui lòng thử lại.",
            message: "Kích hoạt thất bại"
        },
        activateSuccess: {
            description: "Chính sách đã được kích hoạt thành công.",
            message: "Kích hoạt thành công"
        },
        createFailure: {
            description: "Không thể tạo chính sách. Vui lòng thử lại.",
            message: "Tạo thất bại"
        },
        createSuccess: {
            description: "Chính sách đã được tạo thành công.",
            message: "Tạo thành công"
        },
        deactivateFailure: {
            description: "Không thể vô hiệu hóa chính sách. Vui lòng thử lại.",
            message: "Vô hiệu hóa thất bại"
        },
        deactivateSuccess: {
            description: "Chính sách đã được vô hiệu hóa thành công.",
            message: "Vô hiệu hóa thành công"
        },
        deleteFailure: {
            description: "Không thể xóa chính sách. Vui lòng thử lại.",
            message: "Xóa thất bại"
        },
        deleteSuccess: {
            description: "Chính sách đã được xóa thành công.",
            message: "Xóa thành công"
        },
        updateAlgorithmFailure: {
            description: "Không thể cập nhật thuật toán chính sách. Vui lòng thử lại.",
            message: "Cập nhật thuật toán thất bại"
        },
        updateAlgorithmSuccess: {
            description: "Thuật toán chính sách đã được cập nhật thành công.",
            message: "Cập nhật thuật toán thành công"
        },
        updateFailure: {
            description: "Không thể cập nhật chính sách. Vui lòng thử lại.",
            message: "Cập nhật thất bại"
        },
        updateSuccess: {
            description: "Chính sách đã được cập nhật thành công.",
            message: "Cập nhật thành công"
        }
    },
    buttons: {
        newPolicy: "Chính sách mới",
        policyAlgorithm: "Thuật toán chính sách"
    },
    createPolicy: {
        description: "Định nghĩa các quy tắc kiểm soát truy cập cho việc ủy quyền tài nguyên an toàn và chi tiết.",
        title: "Tạo chính sách"
    },
    editPolicy: {
        backBtn: "Quay lại Quản trị chính sách ",
        disabledBtnTooltip: "Bạn cần vô hiệu hóa chính sách này để bật chỉnh sửa.",
        fields: {
            policyOrder: {
                hint: "Chỉ định thứ tự đánh giá cho chính sách này.",
                label: "Thứ tự"
            }
        }
    },
    inactivePoliciesPlaceholder: {
        subtitle: "Hiện tại không có chính sách không hoạt động nào để hiển thị.",
        title: "Không tìm thấy chính sách không hoạt động nào"
    },
    policyAlgorithm: {
        actionText: "Chọn thuật toán kết hợp chính sách",
        algorithmOptions: {
            denyOverrides: {
                description: "Thuật toán kết hợp deny-overrides dành cho những trường hợp quyết định \"Từ chối\" sẽ có ưu tiên cao hơn quyết định \"Cho phép\"."
            },
            denyUnlessPermit: {
                description: "Thuật toán này Từ chối trừ khi được cho phép rõ ràng. Nếu không có chính sách nào cho kết quả \"Cho phép\", quyết định cuối cùng là \"Từ chối\". Tuy nhiên, nếu bất kỳ chính sách nào cho kết quả \"Cho phép\", quyết định cuối cùng sẽ là \"Cho phép\"."
            },
            firstApplicable: {
                description: "Chính sách đầu tiên tạo ra kết quả dứt khoát (\"Cho phép\" hoặc \"Từ chối\") sẽ quyết định kết quả cuối cùng."
            },
            onlyOneApplicable: {
                description: "Thuật toán này đảm bảo rằng chính xác một chính sách được áp dụng và trả về quyết định từ chính sách đó. Nếu nhiều chính sách có thể áp dụng hoặc không có chính sách nào, kết quả là \"Không xác định\"."
            },
            orderedDenyOverrides: {
                description: "Các chính sách được đánh giá theo thứ tự và nếu gặp \"Từ chối\", quyết định là \"Từ chối\"."
            },
            orderedPermitOverrides: {
                description: "Các chính sách được đánh giá theo thứ tự và nếu gặp \"Cho phép\", quyết định là \"Cho phép\"."
            },
            permitOverrides: {
                description: "Thuật toán kết hợp permit-overrides dành cho những trường hợp quyết định \"Cho phép\" sẽ có ưu tiên cao hơn quyết định \"Từ chối\"."
            },
            permitUnlessDeny: {
                description: "Thuật toán này Cho phép trừ khi bị từ chối rõ ràng. Nếu không có chính sách nào cho kết quả \"Từ chối\", quyết định cuối cùng là \"Cho phép\". Tuy nhiên, nếu bất kỳ chính sách nào cho kết quả \"Từ chối\", quyết định cuối cùng sẽ là \"Từ chối\"."
            }
        },
        primaryBtn: "Cập nhật",
        title: "Thuật toán chính sách"
    },
    popup:{
        activate: "Kích hoạt",
        deactivate: "Vô hiệu hóa",
        policyOrder: "Thứ tự chính sách"
    },
    subtitle: "Tạo và quản lý các chính sách của bạn tại đây.",
    title: "Quản trị chính sách"
};
