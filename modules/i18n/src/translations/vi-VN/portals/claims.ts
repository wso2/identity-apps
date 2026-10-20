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
import { ClaimsNS } from "../../../models";

export const claims: ClaimsNS = {
    attributeMappings: {
        agent: {
            description: "Biểu diễn giao thức SCIM cho các thuộc tính AI agent dùng trong các API quản lý danh tính agent.",
            heading: "SCIM 2.0 cho AI Agents"
        },
        axschema: {
            description: "Biểu diễn Attribute Exchange Schema (axschema) "
                + "cho các thuộc tính người dùng.",
            heading: "Attribute Exchange Schema"
        },
        custom: {
            description: "Biểu diễn giao thức tùy chỉnh cho các thuộc tính "
                + "người dùng.",
            heading: "Thuộc tính tùy chỉnh"
        },
        eidas: {
            description: "Biểu diễn giao thức eIDAS cho các thuộc tính người dùng.",
            heading: "eIDAS"
        },
        oidc: {
            description: "Biểu diễn giao thức OpenID Connect (OIDC) cho các thuộc tính "
                + "người dùng.",
            heading: "OpenID Connect"
        },
        scim: {
            description: "Biểu diễn giao thức SCIM2 cho các "
                + "thuộc tính sẽ được dùng trong API SCIM2.",
            heading: "SCIM 2.0"
        },
        vc: {
            description: "Biểu diễn Verifiable Credentials cho các thuộc tính người dùng.",
            heading: "Thông tin xác thực có thể xác minh"
        }
    },
    dialects: {
        advancedSearch: {
            error: "Định dạng truy vấn lọc không đúng",
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: "Ví dụ: Attribute Mapping, v.v."
                    },
                    filterCondition: {
                        placeholder: "Ví dụ: Starts with, v.v."
                    },
                    filterValue: {
                        placeholder: "Ví dụ: http://wso2.org/oidc/claim"
                    }
                }
            },
            placeholder: "Tìm kiếm theo attribute mapping "
        },
        attributes: {
            dialectURI: "Attribute Mapping"
        },
        confirmations: {
            action: "Xác nhận",
            content: "Nếu bạn xóa attribute mapping này, tất cả các thuộc tính {{type}} liên kết sẽ "
                + "cũng bị xóa. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            hint: "Vui lòng xác nhận thao tác của bạn.",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn attribute " +
                "mapping đã chọn."
        },
        dangerZone: {
            actionTitle: "Xóa Attribute Mapping {{type}}",
            header: "Xóa Attribute Mapping {{type}}",
            subheader: "Sau khi bạn xóa attribute mapping {{type}} này, không thể hoàn tác. " +
                "Vui lòng chắc chắn."
        },
        forms: {
            dialectURI: {
                label: "Attribute Mapping {{type}}",
                placeholder: "Nhập một attribute mapping",
                requiredErrorMessage: "Nhập một attribute mapping"
            },
            fields: {
                attributeName: {
                    validation: {
                        alreadyExists: "Đã tồn tại một thuộc tính với tên thuộc tính đã cho.",
                        invalid: "Tên thuộc tính chỉ có thể chứa ký tự chữ và số "
                            +"và _. Và phải có độ dài từ 3 đến 30 ký tự."
                    }
                }
            },
            submit: "Cập nhật"
        },
        notifications: {
            addDialect: {
                error: {
                    description: "Đã xảy ra lỗi khi thêm attribute mapping",
                    message: "Đã xảy ra lỗi"
                },
                genericError: {
                    description: "Attribute mapping đã được thêm nhưng không phải tất cả thuộc tính {{type}} "
                        + "đều được thêm thành công",
                    message: "Không thể thêm thuộc tính {{type}}"
                },
                success: {
                    description: "Attribute mapping đã được thêm thành công",
                    message: "Thêm Attribute Mapping thành công"
                }
            },
            deleteDialect: {
                genericError: {
                    description: "Đã xảy ra lỗi khi xóa attribute mapping",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Attribute mapping đã được xóa thành công!",
                    message: "Xóa Attribute Mapping thành công"
                }
            },
            fetchADialect: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy attribute mapping",
                    message: "Đã xảy ra lỗi"
                }
            },
            fetchDialects: {
                error: {
                    description: "{{description}}",
                    message: "Lỗi lấy dữ liệu"
                },
                genericError: {
                    description: "Không thể lấy claim dialect.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Đã lấy claim dialect thành công.",
                    message: "Lấy dữ liệu thành công"
                }
            },
            fetchExternalClaims: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy các thuộc tính {{type}}",
                    message: "Đã xảy ra lỗi"
                }
            },
            fetchSCIMResource: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy tài nguyên SCIM.",
                    message: "Đã xảy ra lỗi"
                }
            },
            updateDialect: {
                genericError: {
                    description: "Đã xảy ra lỗi khi cập nhật attribute mapping",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Attribute mapping đã được cập nhật thành công.",
                    message: "Cập nhật Attribute Mapping thành công"
                }
            }
        },
        pageLayout: {
            edit: {
                back: "Quay lại Attribute Mappings",
                description: "Chỉnh sửa attribute mapping",
                updateDialectURI: "Cập nhật Attribute Mapping {{type}}",
                updateExternalAttributes: "Cập nhật Attribute Mapping {{type}}"
            },
            list: {
                description: "Xem và quản lý cách các thuộc tính người dùng được ánh xạ và " +
                    "biến đổi khi tương tác với API hoặc ứng dụng của bạn.",
                primaryAction: "Attribute Mapping mới",
                title: "Thuộc tính",
                view: "Xem thuộc tính"
            }
        },
        sections: {
            manageAttributeMappings: {
                agent: {
                    description: "Biểu diễn giao thức SCIM cho các thuộc tính AI agent dùng trong các API quản lý danh tính agent.",
                    heading: "SCIM 2.0 cho AI Agents"
                },
                custom: {
                    description: "Truyền đạt thông tin về người dùng thông qua ánh xạ tùy chỉnh.",
                    heading: "Attribute Mapping tùy chỉnh"
                },
                description: "Xem và quản lý cách các thuộc tính được ánh xạ và biến đổi "
                    + "khi tương tác với API hoặc ứng dụng của bạn.",
                heading: "Quản lý Attribute Mappings",
                oidc: {
                    description: "Truyền đạt thông tin về người dùng cho các ứng dụng sử dụng "
                        + "OpenID Connect để xác thực.",
                    heading: "OpenID Connect"
                },
                scim: {
                    description: "Truyền đạt thông tin về người dùng thông qua API "
                        + "tuân thủ tiêu chuẩn SCIM2.",
                    heading: "SCIM 2.0"
                }
            },
            manageAttributes: {
                attributes: {
                    description: "Mỗi thuộc tính chứa một phần dữ liệu người dùng được lưu trữ.",
                    heading: "Thuộc tính"
                },
                description: "Xem và quản lý thuộc tính.",
                heading: "Quản lý thuộc tính"
            }
        },
        wizard: {
            header: "Thêm Attribute Mapping",
            steps: {
                dialectURI: "Attribute Mapping",
                externalAttribute: "Thuộc tính {{type}}",
                summary: "Tóm tắt"
            },
            summary: {
                externalAttribute: "Thuộc tính {{type}}",
                mappedAttribute: "Thuộc tính đã ánh xạ",
                notFound: "Chưa thêm thuộc tính {{type}} nào."
            }
        }
    },
    external: {
        advancedSearch: {
            error: "Định dạng truy vấn lọc không đúng",
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: "Ví dụ: Thuộc tính {{type}}, v.v."
                    },
                    filterCondition: {
                        placeholder: "Ví dụ: Starts with, v.v."
                    },
                    filterValue: {
                        placeholder: "Ví dụ: http://axschema.org/namePerson/last"
                    }
                }
            },
            placeholder: "Tìm kiếm theo thuộc tính {{type}}"
        },
        attributes: {
            attributeURI: "Thuộc tính {{type}}",
            mappedClaim: "Thuộc tính đã ánh xạ"
        },
        forms: {
            attributeURI: {
                label: "Thuộc tính {{type}}",
                placeholder: "Nhập thuộc tính {{type}}",
                requiredErrorMessage: "Cần có thuộc tính {{type}}",
                validationErrorMessages: {
                    duplicateName: "Thuộc tính {{type}} đã tồn tại.",
                    invalidName: "Tên bạn nhập chứa ký tự không hợp lệ. " +
                        "Chỉ cho phép chữ cái, số, `#`, và `_`.",
                    scimInvalidName: "Ký tự bắt đầu của tên phải là chữ cái. " +
                        "Các ký tự còn lại có thể bao gồm chữ cái, số, dấu gạch ngang (-), " +
                        "và dấu gạch dưới (_)."
                }
            },
            emptyMessage: "Tất cả thuộc tính SCIM đã được ánh xạ tới claim cục bộ.",
            localAttribute: {
                label: "Thuộc tính người dùng để ánh xạ tới",
                placeholder: "Chọn một thuộc tính người dùng",
                requiredErrorMessage: "Chọn một thuộc tính người dùng để ánh xạ tới"
            },
            submit: "Thêm Attribute Mapping",
            warningMessage: "Không có thuộc tính cục bộ nào khả dụng để ánh xạ. " +
                "Thêm thuộc tính cục bộ mới từ"
        },
        notifications: {
            addExternalAttribute: {
                genericError: {
                    description: "Đã xảy ra lỗi khi thêm thuộc tính {{type}}.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Thuộc tính {{type}} đã được thêm vào attribute mapping" +
                        " thành công!",
                    message: "Đã thêm thuộc tính"
                }
            },
            deleteExternalClaim: {
                genericError: {
                    description: "Đã xảy ra lỗi khi xóa thuộc tính {{type}}",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Thuộc tính {{type}} đã được xóa thành công!",
                    message: "Đã xóa thuộc tính"
                }
            },
            fetchExternalClaims: {
                error: {
                    description: "{{description}}",
                    message: "Lỗi lấy dữ liệu"
                },
                genericError: {
                    description: "Không thể lấy thuộc tính {{type}}.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Đã lấy thuộc tính {{type}} thành công.",
                    message: "Lấy dữ liệu thành công"
                }
            },
            getExternalAttribute: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy thuộc tính {{type}}",
                    message: "Đã xảy ra lỗi"
                }
            },
            updateExternalAttribute: {
                genericError: {
                    description: "Đã xảy ra lỗi khi cập nhật" + " thuộc tính {{type}}",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Thuộc tính {{type}} đã được cập nhật thành công!",
                    message: "Đã cập nhật thuộc tính"
                }
            }
        },
        pageLayout: {
            edit: {
                attributeMappingPrimaryAction: "Thêm Attribute Mapping",
                attributePrimaryAction: "Thuộc tính mới",
                header: "Thêm thuộc tính {{type}}"
            }
        },
        placeholders: {
            empty: {
                subtitle: "Hiện tại, không có thuộc tính {{type}} nào khả dụng cho "
                    + "attribute mapping này.",
                title: "Không có thuộc tính {{type}}"
            }
        }
    },
    list: {
        columns: {
            actions: "Hành động",
            claimURI: "Thuộc tính SCIM",
            dialectURI: "Thuộc tính đã ánh xạ",
            name: "Tên"
        },
        confirmation: {
            action: "Xác nhận",
            content: "{{message}} Vui lòng tiếp tục một cách thận trọng.",
            dialect: {
                message: "Nếu bạn xóa attribute mapping này, tất cả"
                    + " thuộc tính {{type}} liên kết cũng sẽ bị xóa.",
                name: "attribute mapping"
            },
            external: {
                message: "Thao tác này sẽ xóa vĩnh viễn thuộc tính {{type}}.",
                name: "thuộc tính {{type}}"
            },
            header: "Bạn có chắc không?",
            hint: "Vui lòng xác nhận thao tác của bạn.",
            local: {
                message: "Nếu bạn xóa thuộc tính này, dữ liệu người dùng thuộc "
                    + "thuộc tính này cũng sẽ bị xóa.",
                name: "thuộc tính"
            },
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn {{name}} đã chọn."
        },
        placeholders: {
            emptyList: {
                action: {
                    dialect: "Thuộc tính {{type}} mới",
                    external: "Thuộc tính {{type}} mới",
                    local: "Thuộc tính mới"
                },
                subtitle: "Hiện tại không có kết quả nào khả dụng."
                    + "Bạn có thể thêm mục mới một cách dễ dàng bằng cách làm theo" + "các bước trong trình hướng dẫn tạo.",
                title: {
                    dialect: "Thêm một Attribute Mapping",
                    external: "Thêm một thuộc tính {{type}}",
                    local: "Thêm một thuộc tính",
                    readOnlyDialect: "Chưa thêm thuộc tính {{type}} nào"
                }
            },
            emptySearch: {
                action: "Xóa truy vấn tìm kiếm",
                subtitle: "Chúng tôi không thể tìm thấy kết quả nào cho {{searchQuery}}."
                    + "Vui lòng thử một từ khóa tìm kiếm khác.",
                title: "Không tìm thấy kết quả"
            }
        },
        warning: "Thuộc tính này chưa được ánh xạ tới một thuộc tính" +
            " trong các kho người dùng sau:"
    },
    local: {
        additionalProperties: {
            hint: "Dùng khi viết extension với các thuộc tính hiện có",
            isUniqueDeprecationMessage: {
                uniquenessDisabled: "Thuộc tính 'isUnique' không còn được dùng.",
                uniquenessEnabled: "Thuộc tính 'isUnique' không còn được dùng. Vui lòng dùng " +
                    "tùy chọn <1>Kiểm tra tính duy nhất</1> để cấu hình tính duy nhất của thuộc tính."
            },
            key: "Tên",
            keyRequiredErrorMessage: "Nhập một tên",
            value: "Giá trị",
            valueRequiredErrorMessage: "Nhập một giá trị"
        },
        advancedSearch: {
            error: "Định dạng truy vấn lọc không đúng",
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: "Ví dụ: name, attribute, v.v."
                    },
                    filterCondition: {
                        placeholder: "Ví dụ: Starts with, v.v."
                    },
                    filterValue: {
                        placeholder: "Ví dụ: address, gender, v.v."
                    }
                }
            },
            placeholder: "Tìm kiếm theo tên"
        },
        attributes: {
            attributeURI: "Thuộc tính"
        },
        confirmation: {
            content: "Nếu bạn xóa thuộc tính này, dữ liệu người dùng thuộc thuộc tính này "
                + "cũng sẽ bị xóa. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            hint: "Vui lòng xác nhận thao tác của bạn.",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn " +
                "thuộc tính đã chọn.",
            primaryAction: "Xác nhận"
        },
        dangerZone: {
            actionTitle: "Xóa thuộc tính",
            header: "Xóa thuộc tính",
            subheader: "Sau khi bạn xóa một thuộc tính, không thể hoàn tác. "
                + "Vui lòng chắc chắn."
        },
        forms: {
            attribute: {
                placeholder: "Nhập một thuộc tính người dùng để ánh xạ tới",
                requiredErrorMessage: "Tên thuộc tính là trường bắt buộc"
            },
            attributeHint: "ID duy nhất cho thuộc tính."
                + " ID sẽ được nối vào attribute mapping để tạo một thuộc tính",
            attributeID: {
                label: "Tên thuộc tính",
                placeholder: "Nhập một tên thuộc tính",
                requiredErrorMessage: "Cần có tên thuộc tính"
            },
            canonicalValues: {
                hint: "Cung cấp các giá trị được phép cho thuộc tính.",
                keyLabel: "Giá trị hiển thị",
                keyRequiredErrorMessage: "Cần có giá trị hiển thị",
                validationError: "Phải cung cấp ít nhất một tùy chọn.",
                validationErrorMessage: "Chưa cung cấp tùy chọn nào.",
                valueLabel: "Giá trị",
                valueRequiredErrorMessage: "Cần có giá trị"
            },
            dataType: {
                hint: "Loại dữ liệu của thuộc tính.",
                label: "Loại dữ liệu",
                options: {
                    boolean: "Boolean",
                    date: "Ngày",
                    dateTime: "DateTime",
                    decimal: "Số thập phân",
                    epoch: "Epoch",
                    integer: "Số nguyên",
                    object: "Đối tượng",
                    options: "Tùy chọn",
                    text: "Văn bản"
                }
            },
            description: {
                label: "Mô tả",
                placeholder: "Nhập một mô tả",
                requiredErrorMessage: "Cần có mô tả"
            },
            descriptionHint: "Mô tả có ý nghĩa cho thuộc tính.",
            displayOrder: {
                label: "Thứ tự hiển thị",
                placeholder: "Nhập thứ tự hiển thị"
            },
            displayOrderHint: "Điều này xác định vị trí mà thuộc tính này được "
                + "hiển thị trong hồ sơ người dùng và trang đăng ký người dùng",
            infoMessages: {
                configApplicabilityInfo: "Xin lưu ý rằng các cấu hình thuộc tính sau đây sẽ " +
                    "chỉ ảnh hưởng đến hồ sơ của người dùng khách hàng.",
                disabledConfigInfo: "Xin lưu ý rằng phần bên dưới bị vô hiệu hóa vì không có " +
                    "ánh xạ claim bên ngoài nào cho thuộc tính claim này."
            },
            inputFormat: {
                hint: "Định dạng nhập của thuộc tính.",
                label: "Định dạng nhập",
                options: {
                    checkBoxGroup: "Nhóm hộp kiểm",
                    checkbox: "Hộp kiểm",
                    datePicker: "Bộ chọn ngày",
                    dropdown: "Danh sách thả xuống",
                    multiSelectDropdown: "Danh sách thả xuống chọn nhiều",
                    numberInput: "Nhập số",
                    radioGroup: "Nhóm radio",
                    textArea: "Vùng văn bản",
                    textInput: "Nhập văn bản",
                    toggle: "Công tắc"
                }
            },
            managedInUserStore: {
                hint: "Cho biết liệu thuộc tính có nên được quản lý trong kho người dùng hay không.",
                label: "Quản lý trong kho người dùng",
                readOnlyUserStoreHint: "Một hoặc nhiều kho người dùng là chỉ đọc. Một số thuộc tính danh tính cần " +
                    "cập nhật, và việc quản lý chúng trong các kho chỉ đọc có thể gây ra vấn đề. Để tránh điều này, hãy loại trừ những " +
                    "thuộc tính đó khỏi các kho chỉ đọc trong phần <1>Attribute Mappings</1>."
            },
            multiValued: {
                label: "Cho phép nhiều giá trị cho thuộc tính này",
                placeholder: "Chọn một thuộc tính người dùng"
            },
            multiValuedHint: "Chọn tùy chọn này nếu thuộc tính có thể có nhiều giá trị.",
            multiValuedSystemClaimHint: "Cho biết liệu thuộc tính có hỗ trợ nhiều giá trị hay không.",
            name: {
                label: "Tên hiển thị thuộc tính",
                placeholder: "Nhập tên hiển thị",
                requiredErrorMessage: "Cần có tên",
                validationErrorMessages: {
                    invalidName: "Tên bạn nhập chứa ký tự không được phép. Tên chỉ có thể" +
                        " chứa tối đa 30 ký tự, bao gồm chữ và số, dấu chấm (.), dấu gạch ngang (-)," +
                        " dấu gạch dưới (_), dấu cộng (+), và dấu cách."
                }
            },
            nameHint: "Tên hiển thị của thuộc tính trong hồ sơ người dùng.",
            profiles: {
                administratorConsole: "Console quản trị viên",
                attributeConfigurations: {
                    description: "Định nghĩa cách các thuộc tính xuất hiện và hoạt động trong các luồng khác nhau. Những cài đặt này chỉ kiểm soát giao diện người dùng. Chúng không ảnh hưởng đến việc kiểm tra hợp lệ ở backend hoặc API.",
                    title: "Cấu hình thuộc tính"
                },
                displayByDefault: "Hiển thị",
                displayByDefaultHint: "Nếu được chọn, thuộc tính này sẽ được hiển thị mặc định trong hồ sơ. Các thuộc tính bắt buộc phải được hiển thị.",
                endUserProfile: "Hồ sơ người dùng cuối",
                readonly: "Chỉ đọc",
                readonlyHint: "Nếu được chọn, giá trị của thuộc tính này là chỉ đọc trong hồ sơ. Hãy đảm bảo chọn tùy chọn này nếu giá trị thuộc tính do hệ thống định nghĩa.",
                required: "Bắt buộc",
                requiredHint: "Nếu được chọn, người dùng phải chỉ định giá trị cho thuộc tính này trong hồ sơ. Các thuộc tính chỉ đọc không thể được đánh dấu là bắt buộc.",
                selfRegistration: "Tự đăng ký",
                selfRegistrationReadOnlyHint: "Cấu hình chỉ đọc không áp dụng trong hồ sơ tự đăng ký."
            },
            readOnly: {
                label: "Đặt thuộc tính này thành chỉ đọc trên hồ sơ người dùng"
            },
            readOnlyHint: "Nếu được chọn, giá trị của thuộc tính này là chỉ đọc trong hồ sơ" +
            " người dùng. Hãy đảm bảo chọn tùy chọn này nếu giá trị thuộc tính do hệ thống định nghĩa.",
            regEx: {
                label: "Biểu thức chính quy",
                placeholder: "Nhập một biểu thức chính quy"
            },
            regExHint: "Dùng mẫu regex để kiểm tra giá trị nhập của thuộc tính.",
            required: {
                label: "Đặt thuộc tính này thành bắt buộc trên hồ sơ người dùng"
            },
            requiredHint: "Nếu được chọn, người dùng được yêu cầu chỉ định giá trị cho " +
            "thuộc tính này trên hồ sơ.",
            requiredWarning: "Để thuộc tính email không hiển thị và không bắt buộc trên hồ sơ người dùng, " +
                "bạn cần tắt xác minh tài khoản cho tổ chức của mình.",
            sharedProfileValueResolvingMethod: {
                hint: "Khi hồ sơ của người dùng được chia sẻ giữa nhiều tổ chức, giá trị của thuộc tính này sẽ được lấy từ nguồn đã chọn.",
                label: "Chọn nguồn cho giá trị thuộc tính của người dùng được chia sẻ",
                options: {
                    fromFirstFoundInHierarchy: "Từ mục tìm thấy đầu tiên trong cấu trúc",
                    fromOrigin: "Từ nguồn gốc",
                    fromSharedProfile: "Từ hồ sơ được chia sẻ"
                }
            },
            subAttributes: {
                label: "Các thuộc tính con của thuộc tính",
                placeholder: "Chọn thuộc tính con",
                validationError: "Phải cung cấp ít nhất một thuộc tính con.",
                validationErrorMessage: "Thuộc tính con là bắt buộc cho loại dữ liệu Object."
            },
            supportedByDefault: {
                label: "Hiển thị thuộc tính này trên hồ sơ người dùng"
            },
            uniquenessScope: {
                label: "Kiểm tra tính duy nhất",
                options: {
                    acrossUserstores: "Trên tất cả kho người dùng",
                    none: "Không có",
                    withinUserstore: "Trong kho người dùng"
                }
            },
            uniquenessScopeHint: "Chọn phạm vi để kiểm tra tính duy nhất của giá trị thuộc tính."
        },
        mappedAttributes: {
            hint: "Nhập thuộc tính từ các kho người dùng tương ứng sẽ được ánh xạ tới thuộc tính này.",
            manageInUserStore: "Quản lý trong kho người dùng",
            mappedAttributeName: "Tên thuộc tính đã ánh xạ",
            readOnlyUserStore: "Chỉ đọc"
        },
        notifications: {
            addLocalClaim: {
                genericError: {
                    description: "Đã xảy ra lỗi khi thêm thuộc tính",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Thuộc tính đã được thêm thành công!",
                    message: "Thêm thuộc tính thành công"
                }
            },
            deleteClaim: {
                genericError: {
                    description: "Đã xảy ra lỗi khi xóa thuộc tính",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Thuộc tính đã được xóa thành công!",
                    message: "Xóa thuộc tính thành công"
                }
            },
            fetchLocalClaims: {
                error: {
                    description: "{{description}}",
                    message: "Lỗi lấy dữ liệu"
                },
                genericError: {
                    description: "Không thể lấy thuộc tính.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Đã lấy thuộc tính thành công.",
                    message: "Lấy dữ liệu thành công"
                }
            },
            getAClaim: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy thuộc tính",
                    message: "Đã xảy ra lỗi"
                }
            },
            getClaims: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy các thuộc tính",
                    message: "Đã xảy ra lỗi"
                }
            },
            getLocalDialect: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy các thuộc tính",
                    message: "Đã xảy ra lỗi"
                }
            },
            updateClaim: {
                genericError: {
                    description: "Đã xảy ra lỗi khi cập nhật" + " thuộc tính",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Thuộc tính này đã được "
                        + "cập nhật thành công!",
                    message: "Cập nhật thuộc tính thành công"
                }
            }
        },
        pageLayout: {
            edit: {
                back: "Quay lại Thuộc tính",
                description: "Chỉnh sửa thuộc tính",
                tabs: {
                    additionalProperties: "Thuộc tính bổ sung",
                    general: "Chung",
                    mappedAttributes: "Attribute Mappings"
                }
            },
            local: {
                action: "Thuộc tính mới",
                back: "Quay lại Thuộc tính và Ánh xạ",
                description: "Tạo và quản lý thuộc tính",
                title: "Thuộc tính"
            }
        },
        wizard: {
            header: "Thêm thuộc tính",
            steps: {
                general: "Chung",
                mapAttributes: "Ánh xạ thuộc tính",
                summary: "Tóm tắt"
            },
            summary: {
                attribute: "Thuộc tính",
                attributeURI: "Thuộc tính",
                displayOrder: "Thứ tự hiển thị",
                readOnly: "Thuộc tính này là chỉ đọc",
                regEx: "Biểu thức chính quy",
                required: "Thuộc tính này là bắt buộc trong quá trình đăng ký người dùng",
                supportedByDefault: "Thuộc tính này được hiển thị trên hồ sơ người dùng và trang đăng ký người dùng",
                userstore: "Kho người dùng"
            }
        }
    },
    scopeMappings: {
        deletionConfirmationModal: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn xóa claim này, nó sẽ không khả dụng trong token." +
                " Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn ánh xạ claim phạm vi"
        },
        saveChangesButton: "Lưu thay đổi"
    }
};
