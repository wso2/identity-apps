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
import { organizationsNS } from "../../../models";

export const organizations: organizationsNS = {
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "Ví dụ: Name, v.v."
                },
                filterCondition: {
                    placeholder: "Ví dụ: Starts With, v.v."
                },
                filterMetaAttribute: {
                    label: "Lọc thuộc tính meta",
                    placeholder: "Tìm kiếm theo tên thuộc tính meta",
                    validations: {
                        empty: "Thuộc tính meta lọc là trường bắt buộc."
                    }
                },
                filterValue: {
                    placeholder: "Nhập giá trị để tìm kiếm"
                }
            }
        },
        placeholder: "Tìm kiếm tổ chức theo tên hoặc thuộc tính meta"
    },
    confirmations: {
        deleteOrganization: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn xóa tổ chức này, tất cả dữ liệu liên quan đến tổ chức này" +
                " sẽ bị xóa. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa toàn bộ tổ chức."
        }
    },
    edit: {
        attributes: {
            hint: "Cấu hình thuộc tính tổ chức",
            key: "Tên",
            keyRequiredErrorMessage: "Cần có tên",
            value: "Giá trị",
            valueRequiredErrorMessage: "Cần có giá trị"
        },
        back: "Quay lại",
        dangerZone: {
            disableOrganization: {
                disableActionTitle: "Vô hiệu hóa tổ chức",
                enableActionTitle: "Bật tổ chức",
                subheader: "Vô hiệu hóa một tổ chức sẽ khiến nó không khả dụng cho tất cả người dùng. " +
                    "Hãy tiếp tục một cách thận trọng."
            },
            subHeader: "Bạn có chắc muốn xóa tổ chức này không?",
            title: "Xóa tổ chức"
        },
        description: "Chỉnh sửa tổ chức",
        fields: {
            created: {
                ariaLabel: "Đã tạo",
                label: "Đã tạo"
            },
            description: {
                ariaLabel: "Mô tả tổ chức",
                label: "Mô tả tổ chức",
                placeholder: "Nhập mô tả tổ chức"
            },
            domain: {
                ariaLabel: "Miền tổ chức",
                label: "Miền tổ chức"
            },
            id: {
                ariaLabel: "ID tổ chức",
                label: "ID tổ chức"
            },
            lastModified: {
                ariaLabel: "Sửa đổi lần cuối",
                label: "Sửa đổi lần cuối"
            },
            name: {
                ariaLabel: "Tên tổ chức",
                label: "Tên tổ chức",
                placeholder: "Nhập tên tổ chức"
            },
            orgHandle: {
                ariaLabel: "Handle tổ chức",
                label: "Handle tổ chức",
                placeholder: "Nhập handle tổ chức"
            },
            type: {
                ariaLabel: "Loại tổ chức",
                label: "Loại tổ chức"
            }
        },
        tabTitles: {
            attributes: "Thuộc tính",
            overview: "Tổng quan"
        }
    },
    forms: {
        addOrganization:{
            description: {
                label: "Mô tả",
                placeholder: "Nhập mô tả"
            },
            domainName: {
                label: "Tên miền",
                placeholder: "Nhập tên miền",
                validation: {
                    duplicate: "Tên miền đã tồn tại",
                    empty: "Cần có tên miền"
                }
            },
            name: {
                label: "Tên tổ chức",
                placeholder: "Nhập tên tổ chức",
                validation: {
                    duplicate: "Tên tổ chức đã tồn tại",
                    empty: "Cần có tên tổ chức"
                }
            },
            orgHandle: {
                errors: {
                    generationFailed: "Không thể tạo một handle tổ chức khả dụng."
                },
                label: "Handle tổ chức",
                placeholder: "Nhập handle tổ chức",
                tooltip: "Một định danh duy nhất dễ đọc được dùng để khám phá tổ chức trong các ứng dụng B2B của bạn. Để trống trường này để dùng ID tổ chức làm handle.\nXin lưu ý rằng handle tổ chức không thể chỉnh sửa sau khi tạo tổ chức.",
                validation: {
                    duplicate: "Handle tổ chức đã nhập đã tồn tại.",
                    empty: "Cần có handle tổ chức.",
                    invalidFirstCharacter: "Handle tổ chức phải bắt đầu bằng ký tự chữ và số.",
                    invalidLength: "Handle tổ chức phải dài hơn 4 ký tự, ít hơn 30 ký tự.",
                    invalidPattern: "Handle tổ chức đã nhập chứa ký tự không hợp lệ. Ký tự hợp lệ bao gồm chữ cái thường (a-z), số (0-9), dấu chấm (.), dấu gạch ngang (-), và dấu gạch dưới (_).",
                    mandatoryExtension: "Handle tổ chức nên bao gồm phần mở rộng miền, như .com (Ví dụ: abc.com)."
                }
            },
            structural: "Cấu trúc",
            tenant: "Tenant",
            type: "Loại"
        }
    },
    homeList: {
        description: "Xem danh sách tất cả các tổ chức khả dụng.",
        name: "Tất cả tổ chức"
    },
    list: {
        actions: {
            add: "Tổ chức mới"
        },
        columns: {
            actions: "Hành động",
            name: "Tên"
        }
    },
    modals: {
        addOrganization: {
            header: "Tạo một tổ chức",
            subtitle1: "Tạo một tổ chức mới trong {{parent}}.",
            subtitle2: "Tạo một tổ chức mới."
        }
    },
    notifications: {
        addOrganization: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi thêm tổ chức"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi thêm tổ chức",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã thêm tổ chức thành công",
                message: "Thêm tổ chức thành công"
            }
        },
        deleteOrganization: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi xóa tổ chức"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi xóa tổ chức",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã xóa tổ chức thành công",
                message: "Xóa tổ chức thành công"
            }
        },
        deleteOrganizationWithSubOrganizationError: "Không thể xóa tổ chức {{ organizationName }} " +
            "vì nó có một hoặc nhiều tổ chức con.",
        disableOrganization: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi vô hiệu hóa tổ chức"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi vô hiệu hóa tổ chức",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã vô hiệu hóa tổ chức thành công",
                message: "Vô hiệu hóa tổ chức thành công"
            }
        },
        disableOrganizationWithSubOrganizationError: "Không thể vô hiệu hóa tổ chức {{ organizationName }} " +
            "vì nó có một hoặc nhiều tổ chức con.",
        enableOrganization: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi bật tổ chức"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi bật tổ chức",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã bật tổ chức thành công",
                message: "Bật tổ chức thành công"
            }
        },
        fetchOrganization: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi lấy tổ chức"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy tổ chức",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy tổ chức thành công",
                message: "Lấy tổ chức thành công"
            }
        },
        getConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi lấy thông tin tổ chức",
                message: "Đã xảy ra lỗi"
            }
        },
        getMetaAttributesList: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi lấy danh sách thuộc tính meta của tổ chức"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy danh sách thuộc tính meta của tổ chức",
                message: "Đã xảy ra lỗi"
            }
        },
        getOrganizationList: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi lấy danh sách tổ chức"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy danh sách tổ chức",
                message: "Đã xảy ra lỗi"
            }
        },
        updateOrganization: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi cập nhật tổ chức"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật tổ chức",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật tổ chức thành công",
                message: "Cập nhật tổ chức thành công"
            }
        },
        updateOrganizationAttributes: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi cập nhật thuộc tính tổ chức"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật thuộc tính tổ chức",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật thuộc tính tổ chức thành công",
                message: "Cập nhật thuộc tính tổ chức thành công"
            }
        }
    },
    placeholders: {
        emptyList: {
            action: "Tổ chức mới",
            subtitles: {
                0: "Hiện tại không có tổ chức nào.",
                1: "Bạn có thể thêm tổ chức mới một cách dễ dàng bằng cách",
                2: "nhấn vào nút bên dưới.",
                3: "Hiện tại không có tổ chức nào dưới {{parent}}."
            },
            title: "Thêm một tổ chức mới"
        }
    },
    shareApplicationInfo: "Chọn tùy chọn này để chia sẻ ứng dụng với tất cả tổ chức hiện có " +
        "và tất cả tổ chức mới mà bạn tạo dưới tổ chức hiện tại của mình.",
    shareApplicationRadio: "Chia sẻ với tất cả tổ chức",
    shareApplicationSubTitle: "Chọn một trong các tùy chọn sau để chia sẻ ứng dụng.",
    shareWithSelectedOrgsRadio: "Chỉ chia sẻ với các tổ chức được chọn",
    switching: {
        emptyList: "Không có tổ chức nào để hiển thị.",
        goBack: "Quay lại",
        notifications: {
            switchOrganization: {
                genericError: {
                    description: "Không thể chuyển sang tổ chức đã chọn.",
                    message: "Đã xảy ra lỗi"
                }
            }
        },
        search: {
            placeholder: "Tìm kiếm theo tên"
        },
        subOrganizations: "Tổ chức",
        switchButton: "Chuyển sang tổ chức",
        switchLabel: "Tổ chức gốc",
        switchLabelAlt: "Tổ chức"
    },
    title: "Tổ chức",
    unshareApplicationInfo: "Điều này cho phép bạn ngăn chia sẻ ứng dụng này với bất kỳ " +
        "tổ chức hiện có nào hoặc tổ chức mới mà bạn tạo dưới tổ chức này " +
        "trong tương lai.",
    unshareApplicationRadio: "Không chia sẻ với bất kỳ tổ chức nào",
    view: {
        description: "Xem tổ chức"
    }
};
