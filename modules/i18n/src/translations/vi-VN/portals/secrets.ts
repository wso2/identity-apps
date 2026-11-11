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
import { SecretsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const secrets: SecretsNS = {
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "Ví dụ: Name, Description, v.v."
                },
                filterCondition: {
                    placeholder: "Ví dụ: Starts with, v.v."
                },
                filterValue: {
                    placeholder: "Nhập giá trị để tìm kiếm"
                }
            }
        },
        placeholder: "Tìm kiếm theo tên secret"
    },
    alerts: {
        createdSecret: {
            description: "Đã tạo secret thành công.",
            message: "Tạo thành công."
        },
        deleteSecret: {
            description: "Đã xóa secret thành công.",
            message: "Xóa thành công."
        },
        updatedSecret: {
            description: "Đã cập nhật secret thành công.",
            message: "Cập nhật thành công."
        }
    },
    banners: {
        adaptiveAuthSecretType: {
            content: "Những secret này có thể được sử dụng trong script Xác thực có điều kiện của một " +
                "ứng dụng đã đăng ký khi truy cập các API bên ngoài.",
            title: "Secret xác thực có điều kiện"
        },
        secretIsHidden: {
            content: "Sau khi tạo, bạn sẽ không thể thấy lại giá trị của secret. " +
                "Bạn chỉ có thể xóa secret. ",
            title: "Tại sao tôi không thể thấy secret?"
        }
    },
    emptyPlaceholders: {
        buttons: {
            addSecret: {
                ariaLabel: "Thêm một Secret mới.",
                label: "Secret mới"
            },
            backToSecrets: {
                ariaLabel: "Điều hướng đến danh sách Secret.",
                label: "Đưa tôi trở lại danh sách Secret"
            }
        },
        emptyListOfSecrets: {
            messages: [
                "Hiện tại không có secret nào khả dụng."
            ]
        },
        resourceNotFound: {
            messages: [
                "Rất tiếc! chúng tôi không thể tìm thấy secret được yêu cầu!",
                "Có lẽ bạn đã truy cập một URL không hợp lệ..."
            ]
        }
    },
    errors: {
        generic: {
            description: "Chúng tôi không thể hoàn thành yêu cầu này. Vui lòng thử lại.",
            message: "Có gì đó không ổn."
        }
    },
    forms: {
        actions: {
            submitButton: {
                ariaLabel: "Cập nhật để lưu biểu mẫu",
                label: "Cập nhật"
            }
        },
        editSecret: {
            page: {
                description: "Chỉnh sửa secret"
            },
            secretDescriptionField: {
                ariaLabel: "Mô tả Secret",
                hint: "Cung cấp mô tả cho secret này (ví dụ: Khi nào sử dụng secret này).",
                label: "Mô tả secret",
                placeholder: "Nhập mô tả secret"
            },
            secretValueField: {
                ariaLabel: "Nhập giá trị Secret",
                cancelButton: "Hủy",
                editButton: "Thay đổi giá trị secret",
                hint: "Bạn có thể nhập giá trị có độ dài từ {{minLength}} đến {{maxLength}}.",
                label: "Giá trị secret",
                placeholder: "Nhập giá trị secret",
                updateButton: "Cập nhật giá trị secret"
            }
        }
    },
    modals: {
        deleteSecret: {
            assertionHint: "Có, tôi hiểu. Tôi muốn xóa nó.",
            content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn secret.",
            primaryActionButtonText: "Xác nhận",
            secondaryActionButtonText: "Hủy",
            title: "Bạn có chắc không?",
            warningMessage: "Nếu bạn xóa secret này, các script xác thực có điều kiện " +
                "phụ thuộc vào giá trị này sẽ ngừng hoạt động. Vui lòng tiếp tục một cách thận trọng."
        }
    },
    page: {
        description: "Tạo và quản lý secret cho xác thực có điều kiện",
        primaryActionButtonText: "Secret mới",
        subFeatureBackButton: "Quay lại danh sách Secret",
        title: "Secret"
    },
    routes: {
        category: "secrets",
        name: "Secret",
        sidePanelChildrenNames: [
            "Chỉnh sửa Secret"
        ]
    },
    wizards: {
        actions: {
            cancelButton: {
                ariaLabel: "Hủy và đóng hộp thoại",
                label: "Hủy"
            },
            createButton: {
                ariaLabel: "Tạo và gửi",
                label: "Tạo"
            }
        },
        addSecret: {
            form: {
                secretDescriptionField: {
                    ariaLabel: "Mô tả Secret",
                    hint: "Cung cấp mô tả cho secret này (ví dụ: Khi nào sử dụng secret này).",
                    label: "Mô tả secret",
                    placeholder: "Nhập mô tả secret"
                },
                secretNameField: {
                    alreadyPresentError: "Tên Secret này đã được thêm!",
                    ariaLabel: "Tên Secret cho loại Secret",
                    hint: "Cung cấp một tên có ý nghĩa cho secret này. Lưu ý rằng sau khi " +
                        "bạn tạo secret với tên ở trên, bạn không thể thay đổi nó nữa.",
                    label: "Tên secret",
                    placeholder: "Nhập tên secret"
                },
                secretTypeField: {
                    ariaLabel: "Chọn loại Secret",
                    hint: "Chọn một loại Secret mà Secret này thuộc về.",
                    label: "Chọn loại secret"
                },
                secretValueField: {
                    ariaLabel: "Nhập giá trị secret",
                    hint: "Đây là giá trị của secret. Bạn có thể nhập giá trị có độ dài" +
                        " từ {{minLength}} đến {{maxLength}}.",
                    label: "Giá trị secret",
                    placeholder: "Nhập giá trị secret"
                }
            },
            heading: "Tạo Secret",
            subheading: "Tạo một secret mới cho các script xác thực có điều kiện"
        }
    }
};
