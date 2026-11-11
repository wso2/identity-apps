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

import { VerifiableCredentialsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const verifiableCredentials: VerifiableCredentialsNS = {
    page: {
        title: "Template thông tin xác thực",
        heading: "Template thông tin xác thực",
        description: "Tạo và quản lý các template để phát hành thông tin xác thực có thể xác minh cho người dùng."
    },
    buttons: {
        addTemplate: "Template thông tin xác thực mới"
    },
    placeholders: {
        emptyList: {
            title: "Chưa cấu hình template thông tin xác thực nào",
            subtitle: "Hiện tại chưa có template thông tin xác thực nào được cấu hình. Nhấn vào nút để thêm template thông tin xác thực mới."
        },
        emptySearch: {
            title: "Không tìm thấy kết quả",
            subtitle: "Chúng tôi không thể tìm thấy kết quả nào cho tìm kiếm của bạn. Vui lòng thử một từ khóa khác."
        }
    },
    list: {
        columns: {
            name: "Tên",
            identifier: "Định danh",
            actions: "Hành động"
        },
        search: {
            placeholder: "Tìm kiếm theo định danh hoặc tên hiển thị",
            filterAttributePlaceholder: "Chọn thuộc tính",
            filterConditionsPlaceholder: "Chọn điều kiện",
            filterValuePlaceholder: "Nhập giá trị",
            attributes: {
                identifier: "Định danh",
                displayName: "Tên hiển thị"
            }
        },
        confirmations: {
            deleteItem: {
                header: "Xóa template thông tin xác thực?",
                message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn template thông tin xác thực.",
                content: "Nếu bạn xóa template thông tin xác thực này, người dùng sẽ không còn có thể nhận được thông tin xác thực thuộc loại này. Vui lòng tiếp tục một cách thận trọng.",
                assertionHint: "Vui lòng xác nhận thao tác của bạn."
            }
        }
    },
    wizard: {
        title: "Tạo template thông tin xác thực",
        subtitle: "Cấu hình template thông tin xác thực có thể xác minh mới có thể được phát hành cho người dùng.",
        form: {
            identifier: {
                label: "Định danh",
                placeholder: "Nhập một định danh duy nhất",
                hint: "Định danh duy nhất cho template thông tin xác thực.",
                validation: "Định danh không được chứa dấu cách."
            },
            displayName: {
                label: "Tên hiển thị",
                placeholder: "Nhập tên hiển thị",
                hint: "Tên dễ đọc cho template thông tin xác thực."
            },
            attributes: {
                label: "Thuộc tính người dùng",
                placeholder: "Tìm kiếm và chọn thuộc tính người dùng",
                hint: "Chọn các thuộc tính người dùng để đưa vào thông tin xác thực có thể xác minh."
            },
            submitButton: "Tạo"
        }
    },
    editPage: {
        title: "Chỉnh sửa template thông tin xác thực",
        tabs: {
            general: "Chung",
            offer: "Offer"
        },
        backButton: "Quay lại Thông tin xác thực có thể xác minh",
        form: {
            displayName: {
                label: "Tên hiển thị",
                placeholder: "Nhập tên hiển thị"
            },
            identifier: {
                label: "Định danh"
            },
            format: {
                label: "Định dạng thông tin xác thực",
                placeholder: "Chọn định dạng thông tin xác thực",
                options: {
                    vcSdJwt: "dc+sd-jwt",
                    jwtVcJson: "jwt_vc_json"
                }
            },
            expiresIn: {
                label: "Thời hạn hiệu lực",
                placeholder: "Nhập thời hạn hiệu lực tính bằng ngày",
                hint: "Nhập thời hạn hiệu lực tính bằng ngày."
            },
            claims: {
                label: "Thuộc tính người dùng",
                placeholder: "Tìm kiếm và chọn thuộc tính người dùng",
                hint: "Chọn các thuộc tính người dùng để đưa vào thông tin xác thực có thể xác minh."
            },
            offer: {
                label: "Offer"
            }
        },
        dangerZone: {
            header: "Vùng nguy hiểm",
            delete: {
                header: "Xóa template thông tin xác thực",
                subheader: "Thao tác này không thể hoàn tác. Vui lòng tiếp tục một cách thận trọng.",
                actionTitle: "Xóa template thông tin xác thực"
            }
        },
        confirmations: {
            deleteTemplate: {
                header: "Bạn có chắc không?",
                message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn template thông tin xác thực.",
                content: "Nếu bạn xóa template thông tin xác thực này, người dùng sẽ không còn có thể nhận được thông tin xác thực thuộc loại này. Vui lòng tiếp tục một cách thận trọng.",
                assertionHint: "Vui lòng xác nhận thao tác của bạn."
            }
        }
    },
    offer: {
        title: "Offer",
        empty: "Không có offer đang hoạt động cho template thông tin xác thực này.",
        active: "Một credential offer hiện đang hoạt động. Bạn có thể tạo lại nó bằng tùy chọn bên dưới.",
        generate: "Tạo",
        regenerate: "Tạo lại",
        confirmation: {
            regenerate: {
                header: "Tạo lại credential offer",
                message: "Thao tác này sẽ thu hồi offer hiện đang hoạt động.",
                content: "Bạn có chắc muốn tạo lại credential offer không? Liên kết offer trước đó sẽ không còn hợp lệ.",
                assertionHint: "Xác nhận tạo lại"
            }
        },
        revoke: "Thu hồi",
        notifications: {
            generate: {
                success: {
                    message: "Đã tạo offer",
                    description: "Đã tạo credential offer thành công."
                },
                error: {
                    message: "Tạo thất bại",
                    description: "Không thể tạo credential offer."
                }
            },
            revoke: {
                success: {
                    message: "Đã thu hồi offer",
                    description: "Đã thu hồi credential offer thành công."
                },
                error: {
                    message: "Thu hồi thất bại",
                    description: "Không thể thu hồi credential offer."
                }
            }
        }
    },
    notifications: {
        fetchClaims: {
            error: {
                message: "Lỗi khi lấy thuộc tính",
                description: "Đã xảy ra lỗi khi lấy danh sách thuộc tính."
            }
        },
        deleteTemplate: {
            success: {
                message: "Xóa thành công",
                description: "Template thông tin xác thực đã được xóa thành công."
            },
            error: {
                message: "Xóa thất bại",
                description: "Đã xảy ra lỗi khi xóa template thông tin xác thực."
            }
        },
        fetchTemplates: {
            error: {
                message: "Lấy dữ liệu thất bại",
                description: "Đã xảy ra lỗi khi lấy các template thông tin xác thực."
            }
        },
        fetchTemplate: {
            error: {
                message: "Lấy dữ liệu thất bại",
                description: "Đã xảy ra lỗi khi lấy chi tiết template thông tin xác thực."
            }
        },
        createTemplate: {
            success: {
                message: "Tạo thành công",
                description: "Template thông tin xác thực đã được tạo thành công."
            },
            error: {
                message: "Tạo thất bại",
                description: "Đã xảy ra lỗi khi tạo template thông tin xác thực."
            },
            duplicateError: {
                message: "Định danh trùng lặp",
                description: "Đã tồn tại một template thông tin xác thực với định danh này. Vui lòng dùng định danh khác."
            }
        },
        updateTemplate: {
            success: {
                message: "Cập nhật thành công",
                description: "Template thông tin xác thực đã được cập nhật thành công."
            },
            error: {
                message: "Cập nhật thất bại",
                description: "Đã xảy ra lỗi khi cập nhật template thông tin xác thực."
            }
        }
    }
};
