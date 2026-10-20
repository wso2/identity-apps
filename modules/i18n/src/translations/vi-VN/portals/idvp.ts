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
/* eslint-disable max-len */

import { IdvpNS } from "../../../models";

export const idvp: IdvpNS = {
    create: {
        notifications: {
            create: {
                genericError: {
                    description: "Đã xảy ra lỗi khi tạo nhà cung cấp xác minh danh tính.",
                    message: "Lỗi tạo"
                },
                success: {
                    description: "Đã tạo nhà cung cấp xác minh danh tính thành công.",
                    message: "Tạo thành công"
                }
            }
        }
    },
    delete: {
        confirmation: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn xóa nhà cung cấp xác minh danh tính này, bạn sẽ không thể " +
                "khôi phục lại. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn nhà cung cấp xác minh danh tính."
        },
        notifications: {
            delete: {
                genericError: {
                    description: "Đã xảy ra lỗi khi xóa nhà cung cấp xác minh danh tính.",
                    message: "Lỗi xóa"
                },
                success: {
                    description: "Đã xóa nhà cung cấp xác minh danh tính thành công.",
                    message: "Xóa thành công"
                }
            }
        }
    },
    edit: {
        attributeSettings: {
            addButton: "Thêm Attribute Mapping",
            heading: "Ánh xạ thuộc tính nhà cung cấp xác minh danh tính",
            hint: "Thêm và ánh xạ các thuộc tính được hỗ trợ từ nhà cung cấp xác minh danh tính bên ngoài.",
            modal: {
                addButton: "Thêm Attribute Mapping",
                emptyPlaceholder:{
                    description: "Ánh xạ các thuộc tính và nhấn <1>Thêm Attribute Mapping</1> để bắt đầu.",
                    title: "Bạn chưa ánh xạ thuộc tính nào"
                },
                header: "Thêm Attribute Mappings",
                labels: {
                    localClaim: "Ánh xạ tới",
                    mappedValue: "Thuộc tính IDVP bên ngoài"
                },
                placeholders: {
                    localClaim: "Chọn thuộc tính ánh xạ",
                    mappedValue: "Nhập thuộc tính IDVP bên ngoài"
                },
                validation: {
                    duplicate: "Đã tồn tại một thuộc tính được ánh xạ với tên này.",
                    invalid: "Vui lòng nhập một giá trị hợp lệ.",
                    required: "Trường này không được để trống."
                }
            }
        },
        backButton: "Quay lại Kết nối",
        dangerZone: {
            delete: {
                description: "Đây là thao tác không thể hoàn tác, hãy tiếp tục một cách thận trọng.",
                header: "Xóa nhà cung cấp xác minh danh tính"
            },
            disable: {
                disabledDescription: "Bật nhà cung cấp xác minh danh tính để sử dụng với các ứng dụng của bạn.",
                enabledDescription: "Sau khi bạn vô hiệu hóa một nhà cung cấp xác minh danh tính, nó không thể được sử dụng cho đến khi được bật lại.",
                header: "{{ state }} nhà cung cấp xác minh danh tính"
            }
        },
        notifications: {
            update: {
                genericError: {
                    description: "Đã xảy ra lỗi khi cập nhật nhà cung cấp xác minh danh tính.",
                    message: "Lỗi cập nhật"
                },
                success: {
                    description: "Đã cập nhật nhà cung cấp xác minh danh tính thành công.",
                    message: "Cập nhật thành công"
                }
            }
        },
        status: {
            disabled: "Đã vô hiệu hóa",
            enabled: "Đã bật",
            notConfigured: {
                description: "Webhook Token chưa được cấu hình đúng. Điều hướng đến tab Hướng dẫn thiết lập để biết thêm thông tin.",
                heading: "Chưa được cấu hình"
            }
        }
    },
    fetch: {
        notifications: {
            idVP: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy chi tiết nhà cung cấp xác minh danh tính.",
                    message: "Lỗi lấy dữ liệu"
                }
            },
            metadata: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy siêu dữ liệu cho nhà cung cấp xác minh danh tính.",
                    message: "Lỗi lấy dữ liệu"
                }
            }
        }
    }
};
