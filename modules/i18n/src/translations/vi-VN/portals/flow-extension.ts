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

import { flowExtensionNS } from "../../../models";

export const flowExtension: flowExtensionNS = {
    createWizard: {
        steps: {
            endpointConfig: {
                certificate: {
                    hint: "Tải lên một chứng chỉ để mã hóa các giá trị trường được trao đổi với endpoint của tiện ích.",
                    title: "Chứng chỉ mã hóa",
                    uploaded: "Chứng chỉ đã được cấu hình. Xóa nó để tải lên chứng chỉ khác."
                },
                title: "Cấu hình endpoint"
            },
            generalSettings: {
                description: {
                    label: "Mô tả",
                    placeholder: "Nhập mô tả cho tiện ích luồng.",
                    validations: {
                        maxLength: "Mô tả không được vượt quá 255 ký tự."
                    }
                },
                iconUrl: {
                    hint: "URL trỏ đến một biểu tượng đại diện cho tiện ích luồng này.",
                    label: "URL biểu tượng",
                    placeholder: "https://example.com/icon.svg",
                    validations: {
                        invalid: "Vui lòng nhập một URL hợp lệ."
                    }
                },
                name: {
                    hint: "Nhập một tên duy nhất để nhận diện tiện ích luồng này.",
                    label: "Tên",
                    placeholder: "Nhập tên cho tiện ích luồng.",
                    validations: {
                        invalid: "Vui lòng nhập một tên hợp lệ. Tên phải bắt đầu bằng ký tự chữ và số và"
                            + " có thể chứa chữ cái, số, dấu cách, dấu gạch ngang và dấu gạch dưới (tối đa 255 ký tự)."
                    }
                },
                title: "Cài đặt chung"
            }
        }
    },
    edit: {
        accessConfig: {
            emptyInfo: "Chưa thiết lập cấu hình truy cập nào. Tiện ích sẽ không gửi bất kỳ dữ liệu nào và "
                + "sẽ không cho phép bất kỳ sửa đổi nào cho đến khi bạn cấu hình truy cập tại đây.",
            noCertificateInfo: "Chưa cung cấp chứng chỉ mã hóa. Các trường được gửi đến tiện ích (đọc) "
                + "không thể được đánh dấu là mã hóa cho đến khi bạn tải lên một chứng chỉ trong tab Cài đặt. "
                + "Các giá trị được tiện ích trả về (ghi) vẫn có thể được mã hóa.",
            resetButton: "Đặt lại",
            treeLoadError: "Không thể tải cây ngữ cảnh Flow Extension từ máy chủ. Làm mới "
                + "trang để thử lại. Nếu vấn đề vẫn tiếp diễn, hãy đảm bảo API flow-management có thể truy cập được."
        },
        backButton: "Quay lại Kết nối",
        confirmations: {
            delete: {
                assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                content: "Nếu bạn xóa tiện ích luồng này, bất kỳ luồng nào tham chiếu đến nó có thể ngừng hoạt động. "
                    + "Vui lòng tiếp tục một cách thận trọng.",
                header: "Bạn có chắc không?",
                message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn tiện ích luồng."
            },
            reset: {
                assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                content: "Tiện ích sẽ không còn gửi bất kỳ dữ liệu nào và sẽ không cho phép bất kỳ sửa đổi nào "
                    + "cho đến khi bạn cấu hình lại truy cập tại đây. Thao tác này không thể hoàn tác.",
                header: "Đặt lại cấu hình truy cập",
                message: "Thao tác này sẽ xóa tất cả chú thích expose và modify."
            }
        },
        dangerZone: {
            delete: {
                actionTitle: "Xóa",
                header: "Xóa tiện ích luồng",
                subheader: "Sau khi bạn xóa một tiện ích luồng, không thể khôi phục lại. Vui lòng chắc chắn."
            }
        },
        endpoint: {
            title: "Cấu hình endpoint"
        },
        general: {
            description: {
                label: "Mô tả",
                placeholder: "Nhập mô tả cho tiện ích luồng.",
                validations: {
                    maxLength: "Mô tả không được vượt quá 255 ký tự."
                }
            },
            iconUrl: {
                hint: "URL trỏ đến một biểu tượng đại diện cho tiện ích luồng này.",
                label: "URL biểu tượng",
                placeholder: "https://example.com/icon.svg",
                validations: {
                    invalid: "Vui lòng nhập một URL hợp lệ."
                }
            },
            name: {
                hint: "Nhập một tên duy nhất để nhận diện tiện ích luồng này.",
                label: "Tên",
                placeholder: "Nhập tên cho tiện ích luồng.",
                validations: {
                    invalid: "Vui lòng nhập một tên hợp lệ. Tên phải bắt đầu bằng ký tự chữ và số và"
                        + " có thể chứa chữ cái, số, dấu cách, dấu gạch ngang và dấu gạch dưới (tối đa 255 ký tự)."
                }
            }
        },
        pageTitle: "Chỉnh sửa tiện ích luồng",
        tabs: {
            accessConfig: {
                label: "Cấu hình truy cập"
            },
            endpoint: {
                label: "Endpoint"
            },
            general: {
                label: "Chung"
            }
        }
    },
    notifications: {
        createError: {
            description: "Đã xảy ra lỗi khi tạo tiện ích luồng.",
            message: "Lỗi tạo tiện ích luồng"
        },
        createSuccess: {
            description: "Đã tạo tiện ích luồng thành công.",
            message: "Tạo thành công"
        },
        deleteError: {
            description: "Đã xảy ra lỗi khi xóa tiện ích luồng.",
            message: "Lỗi xóa tiện ích luồng"
        },
        deleteSuccess: {
            description: "Đã xóa tiện ích luồng thành công.",
            message: "Xóa thành công"
        },
        fetchError: {
            description: "Đã xảy ra lỗi khi lấy tiện ích luồng.",
            message: "Lỗi lấy dữ liệu"
        },
        resetSuccess: {
            description: "Cấu hình truy cập đã được đặt lại thành công.",
            message: "Đặt lại thành công"
        },
        updateError: {
            description: "Đã xảy ra lỗi khi cập nhật tiện ích luồng.",
            message: "Lỗi cập nhật tiện ích luồng"
        },
        updateSuccess: {
            description: "Đã cập nhật tiện ích luồng thành công.",
            message: "Cập nhật thành công"
        }
    },
    contextTree: {
        addClaimModal: {
            addButton: "Thêm claim",
            cancelButton: "Hủy",
            fetchError: {
                description: "Không thể lấy các claim cục bộ.",
                message: "Lỗi khi lấy claim"
            },
            noOptions: "Không có claim nào khả dụng",
            readOnlyBadge: "Chỉ đọc",
            searchPlaceholder: "Tìm kiếm và chọn claim theo tên hoặc URI...",
            subtitle: "Chọn các claim để thêm vào claims map.",
            title: "Thêm claim"
        },
        addEntryModal: {
            attributes: {
                arrayTooltip: "Mảng của loại này",
                label: "Thuộc tính",
                namePlaceholder: "Tên thuộc tính"
            },
            cancelButton: "Hủy",
            dataType: {
                label: "Loại dữ liệu"
            },
            keyName: {
                label: "Tên khóa",
                placeholder: "ví dụ: risk-factor"
            },
            multivalued: "Đa giá trị",
            structurePreview: "Xem trước cấu trúc",
            submitButton: {
                create: "Thêm mục",
                edit: "Lưu thay đổi"
            },
            subtitle: {
                map: "Định nghĩa khóa sẽ được ghi vào map khi chạy",
                object: "Định nghĩa khóa, hình dạng giá trị và các thuộc tính của nó"
            },
            title: {
                createMap: "Thêm mục map",
                createObject: "Thêm mục đối tượng phức hợp",
                editMap: "Chỉnh sửa mục map",
                editObject: "Chỉnh sửa mục đối tượng phức hợp"
            }
        },
        fieldConfig: {
            deleteTooltip: "Xóa",
            editTooltip: "Chỉnh sửa",
            emptyHint: "Chọn một trường lá từ cây để cấu hình nó.",
            emptyTitle: "Chưa chọn trường nào",
            encryption: {
                formReadOnly: "Biểu mẫu này là chỉ đọc.",
                read: {
                    enabledDescription: "Trường này sẽ được gửi đến tiện ích dưới dạng mã hóa.",
                    markFirst: "Đánh dấu trường này là READ trong cây để bật mã hóa.",
                    needCertificate: "Thêm một chứng chỉ để bật mã hóa.",
                    notAllowed: "Đọc không được phép cho trường này.",
                    title: "Đọc mã hóa"
                },
                title: "Mã hóa",
                write: {
                    enabledDescription: "Tiện ích sẽ trả về giá trị của trường này dưới dạng mã hóa.",
                    markFirst: "Đánh dấu trường này là WRITE trong cây để bật mã hóa.",
                    notAllowed: "Ghi không được phép cho trường này.",
                    title: "Ghi mã hóa"
                }
            },
            identityClaimWriteWarning: "Việc sửa đổi thuộc tính do hệ thống duy trì này có thể gây ra hành vi không mong muốn.",
            readOnlyBadge: "Chỉ đọc",
            title: "Cấu hình trường",
            usernameWriteWarning: "Quyền ghi vào tên đăng nhập chỉ được áp dụng trong luồng Tự đăng ký."
        },
        node: {
            addEntryChip: "+ THÊM MỤC",
            noEntries: "Chưa có mục nào",
            readChip: "READ",
            readOnlyBadge: "Chỉ đọc",
            writeChip: "WRITE"
        }
    },
    properties: {
        connectionLabel: "Kết nối",
        connectionPlaceholder: "Chọn một kết nối",
        description: "Chọn một tiện ích luồng để liên kết với bước luồng này.",
        noConnectionsWarning: "Không có tiện ích luồng đang hoạt động nào. Bạn có thể tạo một kết nối tiện ích luồng bằng các API {{productName}}.",
        noConnectionsWarningWithSupport: "Không có tiện ích luồng đang hoạt động nào. Bạn có thể tạo một kết nối tiện ích luồng bằng các API {{productName}}. Vui lòng liên hệ <1>bộ phận hỗ trợ {{productName}}</1> để bắt đầu."
    }
};
