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

import { ConsoleNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const manage: ConsoleNS["manage"] = {
    features: {
        approvals: {
            list: {
                columns: {
                    actions: "Hành động",
                    name: "Tên"
                }
            },
            modals: {
                approvalProperties: {
                    Claims: "Claim",
                    "REQUEST ID": "ID yêu cầu",
                    Roles: "Vai trò",
                    "User Store Domain": "Miền kho người dùng",
                    Username: "Tên đăng nhập",
                    "Role Name": "Tên vai trò",
                    Groups: "Nhóm",
                    "Tenant Domain": "Miền tenant",
                    Permissions: "Quyền",
                    Users: "Người dùng",
                    Audience: "Đối tượng",
                    "Audience ID": "ID đối tượng",
                    "Users to be Added": "Người dùng sẽ được thêm",
                    "Users to be Deleted": "Người dùng sẽ bị xóa",
                    "Role ID": "ID vai trò"
                },
                taskDetails: {
                    description: "Bạn có một yêu cầu phê duyệt một tác vụ vận hành của người dùng.",
                    header: "Tác vụ phê duyệt"
                }
            },
            notifications: {
                fetchApprovalDetails: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi lấy chi tiết phê duyệt"
                    },
                    genericError: {
                        description: "Không thể cập nhật chi tiết phê duyệt",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy chi tiết phê duyệt thành công.",
                        message: "Lấy chi tiết phê duyệt thành công"
                    }
                },
                fetchPendingApprovals: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi lấy các phê duyệt đang chờ xử lý"
                    },
                    genericError: {
                        description: "Không thể lấy các phê duyệt đang chờ xử lý",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy các phê duyệt đang chờ xử lý thành công.",
                        message: "Lấy phê duyệt đang chờ xử lý thành công"
                    }
                },
                updatePendingApprovals: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi cập nhật phê duyệt"
                    },
                    genericError: {
                        description: "Không thể cập nhật phê duyệt",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã cập nhật phê duyệt thành công.",
                        message: "Cập nhật thành công"
                    }
                }
            },
            placeholders: {
                emptyApprovalFilter: {
                    action: "Xem tất cả",
                    subtitle: "Hiện tại không có phê duyệt nào ở trạng thái {{status}}.",
                    title: "Không tìm thấy kết quả"
                },
                emptyApprovalList: {
                    action: "",
                    subtitle: "Hiện tại không có phê duyệt nào để xem xét.",
                    title: "Không có phê duyệt"
                },
                emptySearchResults: {
                    action: "Xem tất cả",
                    subtitles: {
                        0: "Chúng tôi không thể tìm thấy quy trình bạn đã tìm kiếm.",
                        1: "Vui lòng kiểm tra xem bạn có quy trình với tên đó trong",
                        2: "hệ thống hay không."
                    },
                    title: "Không có phê duyệt"
                }
            }
        },
        businessGroups: {
            fields: {
                groupName: {
                    label: "Tên {{type}}",
                    placeholder: "Nhập Tên {{type}}",
                    validations: {
                        duplicate: "Đã tồn tại một {{type}} với tên {{type}} đã cho.",
                        empty: "Cần có Tên {{type}} để tiếp tục.",
                        invalid: "Tên {{type}} chỉ có thể chứa ký tự chữ và số, -, và _. "
                            + "Và phải có độ dài từ 3 đến 30 ký tự."
                    }
                }
            }
        },
        certificates: {
            keystore: {
                advancedSearch: {
                    error: "Định dạng truy vấn lọc không đúng",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Ví dụ: alias, v.v."
                            },
                            filterCondition: {
                                placeholder: "Ví dụ: Starts with, v.v."
                            },
                            filterValue: {
                                placeholder: "Ví dụ: wso2carbon, v.v."
                            }
                        }
                    },
                    placeholder: "Tìm kiếm theo alias"
                },
                attributes: {
                    alias: "Alias"
                },
                certificateModalHeader: "Xem chứng chỉ",
                confirmation: {
                    content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn chứng chỉ.",
                    header: "Bạn có chắc không?",
                    hint: "Vui lòng nhập <1>{{id}}</1> để xác nhận.",
                    message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn chứng chỉ.",
                    primaryAction: "Xác nhận",
                    tenantContent: "Thao tác này sẽ xóa vĩnh viễn chứng chỉ tenant."
                        + "Sau khi xóa, trừ khi bạn nhập một chứng chỉ tenant mới,"
                        + "bạn sẽ không thể truy cập các ứng dụng cổng."
                        + "Để tiếp tục xóa, hãy nhập alias của chứng chỉ và nhấn xóa."
                },
                errorCertificate: "Đã xảy ra lỗi khi giải mã chứng chỉ."
                    + " Vui lòng đảm bảo chứng chỉ hợp lệ.",
                errorEmpty: "Hãy thêm một tệp chứng chỉ hoặc dán nội dung của một chứng chỉ mã hóa PEM.",
                forms: {
                    alias: {
                        label: "Alias",
                        placeholder: "Nhập một alias",
                        requiredErrorMessage: "Cần có alias"
                    }
                },
                list: {
                    columns: {
                        actions: "Hành động",
                        name: "Tên"
                    }
                },
                notifications: {
                    addCertificate:{
                        genericError: {
                            description: "Đã xảy ra lỗi khi nhập chứng chỉ.",
                            message: "Đã xảy ra lỗi!"
                        },
                        success: {
                            description: "Chứng chỉ đã được nhập thành công.",
                            message: "Nhập chứng chỉ thành công"
                        }
                    },
                    deleteCertificate: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi xóa chứng chỉ.",
                            message: "Đã xảy ra lỗi!"
                        },
                        success: {
                            description: "Chứng chỉ đã được xóa thành công.",
                            message: "Xóa chứng chỉ thành công"
                        }
                    },
                    download: {
                        success: {
                            description: "Chứng chỉ đã bắt đầu tải xuống.",
                            message: "Đã bắt đầu tải chứng chỉ"
                        }
                    },
                    getAlias: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy chứng chỉ.",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    getCertificate: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy "
                                + "chứng chỉ",
                            message: "Đã xảy ra lỗi!"
                        }
                    },
                    getCertificates: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy các chứng chỉ.",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    getPublicCertificate: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy chứng chỉ của tổ chức.",
                            message: "Đã xảy ra lỗi!"
                        }
                    }
                },
                pageLayout: {
                    description: "Quản lý các chứng chỉ trong keystore.",
                    primaryAction: "Nhập chứng chỉ",
                    title: "Chứng chỉ"
                },
                placeholders: {
                    emptyList: {
                        action: "Nhập chứng chỉ",
                        subtitle: "Hiện tại không có chứng chỉ nào khả dụng."
                            + "Bạn có thể nhập một chứng chỉ mới bằng cách nhấn vào"
                            + "nút bên dưới.",
                        title: "Nhập chứng chỉ"
                    },
                    emptySearch: {
                        action: "Xóa truy vấn tìm kiếm",
                        subtitle: "Chúng tôi không thể tìm thấy kết quả nào cho {{searchQuery}}."
                            + "Vui lòng thử một từ khóa tìm kiếm khác.",
                        title: "Không tìm thấy kết quả"
                    }
                },
                summary: {
                    issuerDN: "DN nhà phát hành",
                    sn: "Số sê-ri:",
                    subjectDN: "DN chủ thể",
                    validFrom: "Không hợp lệ trước",
                    validTill: "Không hợp lệ sau",
                    version: "Phiên bản"
                },
                wizard: {
                    dropZone: {
                        action: "Tải lên chứng chỉ",
                        description: "Kéo và thả tệp chứng chỉ vào đây."
                    },
                    header: "Nhập chứng chỉ",
                    panes: {
                        paste: "Dán",
                        upload: "Tải lên"
                    },
                    pastePlaceholder: "Dán nội dung của chứng chỉ PEM",
                    steps: {
                        summary: "Tóm tắt",
                        upload: "Tải lên chứng chỉ"
                    }
                }
            },
            truststore: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Ví dụ: alias, certificate, v.v."
                            },
                            filterCondition: {
                                placeholder: "Ví dụ: Starts with, v.v."
                            },
                            filterValue: {
                                placeholder: "Ví dụ: wso2carbon, v.v."
                            }
                        }
                    },
                    placeholder: "Tìm kiếm theo tên nhóm"
                }
            }
        },
        claims: {
            attributeMappings: {
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
                    hint: "Vui lòng nhập <1>{{confirm}}</1> để xác nhận.",
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
                    updateDialect: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi cập nhật attribute mapping",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Attribute mapping đã được cập nhật thành công.",
                            message: "Cập nhật Attribute Mapping thành công"
                        }
                    },
                    fetchSCIMResource: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy tài nguyên SCIM.",
                            message: "Đã xảy ra lỗi"
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
                        header: "Thêm thuộc tính {{type}}",
                        primaryAction: "Thuộc tính mới"
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
                            local: "Thêm một thuộc tính"
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
                    supportedByDefault: {
                        label: "Hiển thị thuộc tính này trên hồ sơ người dùng"
                    }
                },
                mappedAttributes: {
                    hint: "Nhập thuộc tính từ mỗi kho người dùng mà bạn muốn ánh xạ tới thuộc tính này."
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
                            mappedAttributes: "Thuộc tính đã ánh xạ"
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
        },
        emailLocale: {
            buttons: {
                addLocaleTemplate: "Thêm template ngôn ngữ",
                saveChanges: "Lưu thay đổi"
            },
            forms: {
                addLocale: {
                    fields: {
                        bodyEditor: {
                            label: "Nội dung",
                            validations: {
                                empty: "Nội dung email không được để trống."
                            }
                        },
                        locale: {
                            label: "Ngôn ngữ",
                            placeholder: "Chọn ngôn ngữ",
                            validations: {
                                empty: "Chọn ngôn ngữ"
                            }
                        },
                        signatureEditor: {
                            label: "Chữ ký thư",
                            validations: {
                                empty: "Chữ ký email không được để trống."
                            }
                        },
                        subject: {
                            label: "Tiêu đề",
                            placeholder: "Nhập tiêu đề email của bạn",
                            validations: {
                                empty: "Cần có tiêu đề email"
                            }
                        }
                    }
                }
            }
        },
        emailTemplateTypes: {
            advancedSearch: {
                error: "Định dạng truy vấn lọc không đúng",
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "Ví dụ: Name, v.v."
                        },
                        filterCondition: {
                            placeholder: "Ví dụ: Starts with, v.v."
                        },
                        filterValue: {
                            placeholder: "Ví dụ: TOTP, passwordResetSuccess, v.v."
                        }
                    }
                },
                placeholder: "Tìm kiếm theo loại template email"
            },
            buttons: {
                createTemplateType: "Tạo loại template",
                deleteTemplate: "Xóa template",
                editTemplate: "Chỉnh sửa template",
                newType: "Loại template mới"
            },
            confirmations: {
                deleteTemplateType: {
                    assertionHint: "Vui lòng nhập <1>{{ id }}</1> để xác nhận.",
                    content: "Nếu bạn xóa loại template email này, tất cả luồng công việc liên kết sẽ không còn " +
                        "có template email hợp lệ để hoạt động và thao tác này sẽ xóa tất cả template ngôn ngữ " +
                        "liên kết với loại template này. Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn loại template email " +
                        "đã chọn."
                }
            },
            forms: {
                addTemplateType: {
                    fields: {
                        type: {
                            label: "Tên loại template",
                            placeholder: "Nhập tên loại template",
                            validations: {
                                empty: "Cần có tên loại template để tiếp tục."
                            }
                        }
                    }
                }
            },
            list: {
                actions: "Hành động",
                name: "Tên"
            },
            notifications: {
                createTemplateType: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi tạo loại template email."
                    },
                    genericError: {
                        description: "Không thể tạo loại template email.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã tạo loại template email thành công.",
                        message: "Tạo loại template email thành công"
                    }
                },
                deleteTemplateType: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi xóa loại template email."
                    },
                    genericError: {
                        description: "Không thể xóa loại template email.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã xóa loại template email thành công.",
                        message: "Xóa loại template email thành công"
                    }
                },
                getTemplateTypes: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi lấy dữ liệu"
                    },
                    genericError: {
                        description: "Không thể lấy các loại template email.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy các loại template email thành công.",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                updateTemplateType: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi cập nhật loại template email."
                    },
                    genericError: {
                        description: "Không thể cập nhật loại template email.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã cập nhật loại template email thành công.",
                        message: "Cập nhật loại template email thành công"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "Loại template mới",
                    subtitles: {
                        0: "Hiện tại không có loại template nào khả dụng.",
                        1: "Bạn có thể thêm loại template mới bằng cách ",
                        2: "nhấn vào nút bên dưới."
                    },
                    title: "Thêm loại template mới"
                },
                emptySearch: {
                    action: "Xóa truy vấn tìm kiếm",
                    subtitles: "Chúng tôi không thể tìm thấy kết quả nào cho {{searchQuery}}. "
                        + "Vui lòng thử một từ khóa tìm kiếm khác.",
                    title: "Không tìm thấy kết quả"
                }
            },
            wizards: {
                addTemplateType: {
                    heading: "Tạo loại template email",
                    steps: {
                        templateType: {
                            heading: "Loại template"
                        }
                    },
                    subHeading: "Tạo loại template mới để liên kết với các yêu cầu email."
                }
            }
        },
        emailTemplates: {
            buttons: {
                deleteTemplate: "Xóa template",
                editTemplate: "Chỉnh sửa template",
                newTemplate: "Template mới",
                viewTemplate: "Xem template"
            },
            confirmations: {
                deleteTemplate: {
                    assertionHint: "Vui lòng nhập <1>{{ id }}</1> để xác nhận.",
                    content: "Nếu bạn xóa template email này, tất cả luồng công việc liên kết sẽ không còn " +
                        "có template email hợp lệ để hoạt động. Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn template email đã chọn."
                }
            },
            editor: {
                tabs: {
                    code: {
                        tabName: "Mã HTML"
                    },
                    preview: {
                        tabName: "Xem trước"
                    }
                }
            },
            list: {
                actions: "Hành động",
                name: "Tên"
            },
            notifications: {
                createTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi tạo template email."
                    },
                    genericError: {
                        description: "Không thể tạo template email.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã tạo template email thành công.",
                        message: "Tạo template email thành công"
                    }
                },
                deleteTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi xóa template email."
                    },
                    genericError: {
                        description: "Không thể xóa template email.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã xóa template email thành công.",
                        message: "Xóa template email thành công"
                    }
                },
                getTemplateDetails: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi lấy dữ liệu"
                    },
                    genericError: {
                        description: "Không thể lấy chi tiết template email.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy chi tiết template email thành công.",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                getTemplates: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi lấy dữ liệu"
                    },
                    genericError: {
                        description: "Không thể lấy các template email.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy các template email thành công.",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                iframeUnsupported: {
                    genericError: {
                        description: "Trình duyệt của bạn không hỗ trợ iframe.",
                        message: "Không được hỗ trợ"
                    }
                },
                updateTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi cập nhật template email."
                    },
                    genericError: {
                        description: "Không thể cập nhật template email.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã cập nhật template email thành công.",
                        message: "Cập nhật template email thành công"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "Template mới",
                    subtitles: {
                        0: "Hiện tại không có template nào khả dụng cho loại template",
                        1: "email đã chọn. Bạn có thể thêm template mới bằng cách ",
                        2: "nhấn vào nút bên dưới."
                    },
                    title: "Thêm template"
                }
            },
            viewTemplate: {
                heading: "Xem trước template email"
            }
        },
        footer: {
            copyright: "WSO2 Identity Server © {{year}}"
        },
        governanceConnectors: {
            goBackLoginAndRegistration: "Quay lại đăng nhập & đăng ký",
            categories: "Danh mục",
            connectorSubHeading: "Cấu hình cài đặt {{ name }}.",
            connectorCategories: {
                passwordPolicies : {
                    name: "Chính sách mật khẩu",
                    description: "Cấu hình chính sách mật khẩu để tăng cường độ mạnh mật khẩu người dùng.",
                    connectors: {
                        passwordExpiry: {
                            friendlyName: "Hết hạn mật khẩu"
                        },
                        passwordHistory: {
                            friendlyName: "Lịch sử mật khẩu",
                            properties: {
                                passwordHistoryEnable: {
                                    hint: "Người dùng sẽ không được phép sử dụng lại các mật khẩu đã dùng trước đó.",
                                    label: "Kiểm tra lịch sử mật khẩu"
                                },
                                passwordHistoryCount: {
                                    hint: "Hạn chế sử dụng số lượng mật khẩu dùng gần nhất này khi cập nhật mật khẩu.",
                                    label: "Số lượng mật khẩu kiểm tra trong lịch sử"
                                }
                            }
                        },
                        passwordPolicy: {
                            friendlyName: "Mẫu mật khẩu",
                            properties: {
                                passwordPolicyEnable: {
                                    hint: "Kiểm tra mật khẩu người dùng theo một chính sách",
                                    label: "Kiểm tra mật khẩu dựa trên một mẫu chính sách"
                                },
                                passwordPolicyMinLength: {
                                    hint: "Số ký tự tối thiểu trong mật khẩu.",
                                    label: "Số ký tự tối thiểu"
                                },
                                passwordPolicyMaxLength: {
                                    hint: "Số ký tự tối đa trong mật khẩu.",
                                    label: "Số ký tự tối đa"
                                },
                                passwordPolicyPattern: {
                                    hint: "Mẫu biểu thức chính quy để kiểm tra mật khẩu.",
                                    label: "Regex mẫu mật khẩu"
                                },
                                passwordPolicyErrorMsg: {
                                    hint: "Thông báo lỗi này sẽ được hiển thị khi phát hiện vi phạm mẫu.",
                                    label: "Thông báo lỗi khi vi phạm mẫu"
                                }
                            }
                        }
                    }
                },
                userOnboarding : {
                    name: "Onboarding người dùng",
                    description: "Cấu hình cài đặt onboarding người dùng.",
                    connectors: {
                        askPassword: {
                            friendlyName: "Mời người dùng đặt mật khẩu"
                        },
                        selfSignUp: {
                            friendlyName: "Tự đăng ký",
                            properties: {
                                selfRegistrationEnable: {
                                    hint: "Cho phép người dùng tự đăng ký vào hệ thống.",
                                    label: "Tự đăng ký của người dùng"
                                },
                                selfRegistrationLockOnCreation: {
                                    hint: "Khóa tài khoản người dùng tự đăng ký cho đến khi xác minh email.",
                                    label: "Khóa tài khoản người dùng khi tạo"
                                },
                                selfRegistrationSendConfirmationOnCreation: {
                                    hint: "Bật xác nhận tài khoản người dùng khi tài khoản người dùng không bị khóa khi tạo",
                                    label: "Bật xác nhận tài khoản khi tạo"
                                },
                                selfRegistrationNotificationInternallyManage: {
                                    hint: "Tắt nếu ứng dụng khách tự xử lý việc gửi thông báo",
                                    label: "Quản lý việc gửi thông báo nội bộ"
                                },
                                selfRegistrationReCaptcha: {
                                    hint: "Bật xác minh reCaptcha trong quá trình tự đăng ký.",
                                    label: "Nhắc reCaptcha"
                                },
                                selfRegistrationVerificationCodeExpiryTime: {
                                    hint: "Chỉ định thời gian hết hạn tính bằng phút cho liên kết xác minh.",
                                    label: "Thời gian hết hạn liên kết xác minh tự đăng ký của người dùng"
                                },
                                selfRegistrationVerificationCodeSmsotpExpiryTime: {
                                    hint: "Chỉ định thời gian hết hạn tính bằng phút cho SMS OTP.",
                                    label: "Thời gian hết hạn SMS OTP tự đăng ký của người dùng"
                                },
                                selfRegistrationSmsotpRegex: {
                                    hint: "Regex cho SMS OTP ở định dạng [ký tự được phép]{độ dài}. Các dải ký tự được hỗ trợ là a-z, A-Z, 0-9. Độ dài OTP tối thiểu là 4",
                                    label: "Regex SMS OTP tự đăng ký của người dùng"
                                },
                                selfRegistrationCallbackRegex: {
                                    hint: "Tiền tố này sẽ được dùng để kiểm tra URL callback.",
                                    label: "Regex URL callback tự đăng ký của người dùng"
                                },
                                urlListPurposeSelfSignUp: {
                                    hint: "Nhấn vào đây để quản lý các mục đích Tự đăng ký",
                                    label: "Quản lý các mục đích Tự đăng ký"
                                },
                                selfRegistrationNotifyAccountConfirmation: {
                                    hint: "Bật gửi thông báo cho xác nhận tự đăng ký.",
                                    label: "Gửi email xác nhận đăng ký"
                                },
                                selfRegistrationResendConfirmationReCaptcha: {
                                    hint: "Nhắc xác minh reCaptcha khi gửi lại xác nhận",
                                    label: "Nhắc reCaptcha khi gửi lại xác nhận"
                                },
                                selfRegistrationAutoLoginEnable: {
                                    hint: "Người dùng sẽ được đăng nhập tự động sau khi hoàn thành Xác nhận tài khoản",
                                    label: "Bật tự động đăng nhập sau khi xác nhận tài khoản"
                                },
                                selfRegistrationAutoLoginAliasName: {
                                    hint: "Alias của khóa dùng để ký cookie. Khóa công khai phải được nhập vào keystore.",
                                    label: "Alias của khóa dùng để ký cookie"
                                }
                            }
                        },
                        liteUserSignUp: {
                            friendlyName: "Đăng ký người dùng rút gọn",
                            properties: {
                                liteRegistrationEnable: {
                                    hint: "Cho phép người dùng tự đăng ký vào hệ thống mà không cần mật khẩu.",
                                    label: "Đăng ký người dùng rút gọn"
                                },
                                liteRegistrationLockOnCreation: {
                                    hint: "Khóa tài khoản người dùng tự đăng ký cho đến khi xác minh email.",
                                    label: "Khóa tài khoản người dùng khi tạo"
                                },
                                liteRegistrationNotificationInternallyManage: {
                                    hint: "Tắt nếu ứng dụng khách tự xử lý việc gửi thông báo",
                                    label: "Quản lý việc gửi thông báo nội bộ"
                                },
                                liteRegistrationReCaptcha: {
                                    hint: "Bật xác minh reCaptcha trong quá trình tự đăng ký.",
                                    label: "Nhắc reCaptcha"
                                },
                                liteRegistrationVerificationCodeExpiryTime: {
                                    hint: "Chỉ định thời gian hết hạn tính bằng phút cho liên kết xác minh.",
                                    label: "Thời gian hết hạn liên kết xác minh đăng ký người dùng rút gọn"
                                },
                                liteRegistrationVerificationCodeSmsotpExpiryTime: {
                                    hint: "Chỉ định thời gian hết hạn tính bằng phút cho SMS OTP.",
                                    label: "Thời gian hết hạn SMS OTP đăng ký người dùng rút gọn"
                                },
                                liteRegistrationSmsotpRegex: {
                                    hint: "Regex cho SMS OTP ở định dạng [ký tự được phép]{độ dài}. Các dải ký tự được hỗ trợ là a-z, A-Z, 0-9. Độ dài OTP tối thiểu là 4",
                                    label: "Regex SMS OTP đăng ký người dùng rút gọn"
                                },
                                liteRegistrationCallbackRegex: {
                                    hint: "Tiền tố này sẽ được dùng để kiểm tra URL callback.",
                                    label: "Regex URL callback đăng ký người dùng rút gọn"
                                },
                                urlListPurposeLiteUserSignUp: {
                                    hint: "Nhấn vào đây để quản lý các mục đích Đăng ký rút gọn",
                                    label: "Quản lý các mục đích Đăng ký rút gọn"
                                }
                            }
                        },
                        userEmailVerification: {
                            friendlyName: "Yêu cầu đặt mật khẩu",
                            properties: {
                                emailVerificationEnable: {
                                    hint: "Một email sẽ được gửi đến người dùng để đặt mật khẩu sau khi tạo người dùng.",
                                    label: "Bật lời mời qua email để thiết lập mật khẩu người dùng"
                                },
                                emailVerificationLockOnCreation: {
                                    hint: "Tài khoản người dùng sẽ bị khóa trong quá trình tạo người dùng.",
                                    label: "Bật khóa tài khoản khi tạo"
                                },
                                emailVerificationNotificationInternallyManage: {
                                    hint: "Tắt nếu ứng dụng khách tự xử lý việc gửi thông báo.",
                                    label: "Quản lý việc gửi thông báo nội bộ"
                                },
                                emailVerificationExpiryTime: {
                                    hint: "Đặt khoảng thời gian email xác minh còn hiệu lực, tính bằng phút. (Để thời hạn vô hạn, đặt -1)",
                                    label: "Thời gian hết hạn mã xác minh email"
                                },
                                emailVerificationAskPasswordExpiryTime: {
                                    hint: "Đặt khoảng thời gian email yêu cầu mật khẩu còn hiệu lực, tính bằng phút. (Để thời hạn vô hạn, đặt -1)",
                                    label: "Thời gian hết hạn mã yêu cầu mật khẩu"
                                },
                                emailVerificationAskPasswordPasswordGenerator: {
                                    hint: "Điểm mở rộng tạo mật khẩu tạm thời trong tính năng yêu cầu mật khẩu.",
                                    label: "Lớp mở rộng tạo mật khẩu tạm thời"
                                },
                                urlListPurposeJitProvisioning: {
                                    hint: "Nhấn vào đây để quản lý các mục đích cấp phát just in time.",
                                    label: "Quản lý các mục đích cấp phát JIT"
                                }
                            }
                        }
                    }
                },
                loginAttemptsSecurity : {
                    name: "Bảo mật lần đăng nhập",
                    description: "Cấu hình cài đặt bảo mật cho các lần đăng nhập.",
                    connectors: {
                        accountLockHandler: {
                            friendlyName: "Khóa tài khoản",
                            properties: {
                                accountLockHandlerLockOnMaxFailedAttemptsEnable: {
                                    hint: "Khóa tài khoản người dùng khi đăng nhập thất bại",
                                    label: "Khóa tài khoản người dùng khi đạt số lần thất bại tối đa"
                                },
                                accountLockHandlerOnFailureMaxAttempts: {
                                    hint: "Số lần đăng nhập thất bại được phép trước khi khóa tài khoản.",
                                    label: "Số lần đăng nhập thất bại tối đa"
                                },
                                accountLockHandlerTime: {
                                    hint: "Thời gian khóa tài khoản ban đầu tính bằng phút. Tài khoản sẽ tự động được mở khóa sau khoảng thời gian này.",
                                    label: "Thời gian khóa tài khoản ban đầu"
                                },
                                accountLockHandlerLoginFailTimeoutRatio: {
                                    hint: "Thời gian khóa tài khoản sẽ được tăng theo hệ số này. Ví dụ: Thời gian ban đầu: 5 phút; Hệ số tăng: 2; Thời gian khóa tiếp theo: 5 x 2 = 10 phút",
                                    label: "Hệ số tăng thời gian khóa tài khoản"
                                },
                                accountLockHandlerNotificationManageInternally: {
                                    hint: "Tắt nếu ứng dụng khách tự xử lý việc gửi thông báo",
                                    label: "Quản lý việc gửi thông báo nội bộ"
                                },
                                accountLockHandlerNotificationNotifyOnLockIncrement: {
                                    hint: "Thông báo cho người dùng khi thời gian khóa tài khoản tăng do đăng nhập thất bại liên tục.",
                                    label: "Thông báo cho người dùng khi thời gian khóa tăng"
                                }
                            }
                        },
                        ssoLoginRecaptcha: {
                            friendlyName: "reCaptcha cho đăng nhập SSO",
                            properties: {
                                ssoLoginRecaptchaEnableAlways: {
                                    hint: "Luôn nhắc xác minh reCaptcha trong luồng đăng nhập SSO.",
                                    label: "Luôn nhắc reCaptcha"
                                },
                                ssoLoginRecaptchaEnable: {
                                    hint: "Chỉ nhắc xác minh reCaptcha trong luồng đăng nhập SSO sau khi vượt quá số lần thất bại tối đa.",
                                    label: "Nhắc reCaptcha sau số lần thất bại tối đa"
                                },
                                ssoLoginRecaptchaOnMaxFailedAttempts: {
                                    hint: "Số lần thất bại được phép mà không nhắc xác minh reCaptcha.",
                                    label: "Số lần thất bại tối đa cho reCaptcha"
                                }
                            }
                        }
                    }
                },
                accountManagement : {
                    name: "Quản lý tài khoản",
                    description: "Cấu hình cài đặt quản lý tài khoản.",
                    connectors: {
                        suspensionNotification: {
                            friendlyName: "Tạm ngưng tài khoản không hoạt động",
                            properties: {
                                suspensionNotificationEnable: {
                                    hint: "Khóa tài khoản người dùng sau một khoảng thời gian không hoạt động.",
                                    label: "Tạm ngưng tài khoản người dùng không hoạt động"
                                },
                                suspensionNotificationAccountDisableDelay: {
                                    hint: "Khoảng thời gian tính bằng ngày trước khi khóa tài khoản người dùng.",
                                    label: "Thời gian không hoạt động được phép tính bằng ngày"
                                },
                                suspensionNotificationDelays: {
                                    hint: "Gửi cảnh báo cho người dùng trước khi khóa tài khoản, sau mỗi khoảng thời gian. Chấp nhận nhiều giá trị phân tách bằng dấu phẩy.",
                                    label: "Các khoảng thời gian gửi cảnh báo tính bằng ngày"
                                }
                            }
                        },
                        accountDisableHandler: {
                            friendlyName: "Vô hiệu hóa tài khoản",
                            properties: {
                                accountDisableHandlerEnable: {
                                    hint: "Cho phép người dùng quản trị vô hiệu hóa tài khoản người dùng",
                                    label: "Bật vô hiệu hóa tài khoản"
                                },
                                accountDisableHandlerNotificationManageInternally: {
                                    hint: "Tắt, nếu ứng dụng khách tự xử lý việc gửi thông báo",
                                    label: "Quản lý việc gửi thông báo nội bộ"
                                }
                            }
                        },
                        multiattributeLoginHandler: {
                            friendlyName: "Đăng nhập đa thuộc tính",
                            properties: {
                                accountMultiattributeloginHandlerEnable: {
                                    hint: "Bật sử dụng nhiều thuộc tính làm định danh đăng nhập",
                                    label: "Bật đăng nhập đa thuộc tính"
                                },
                                accountMultiattributeloginHandlerAllowedattributes: {
                                    hint: "Danh sách claim được phép phân tách bằng dấu phẩy",
                                    label: "Danh sách claim thuộc tính được phép"
                                }
                            }
                        },
                        accountRecovery: {
                            friendlyName: "Quản lý tài khoản",
                            properties: {
                                recoveryNotificationPasswordEnable: {
                                    label: "Khôi phục mật khẩu dựa trên thông báo"
                                },
                                recoveryReCaptchaPasswordEnable: {
                                    label: "Bật reCaptcha cho khôi phục mật khẩu"
                                },
                                recoveryQuestionPasswordEnable: {
                                    label: "Khôi phục mật khẩu dựa trên câu hỏi bảo mật"
                                },
                                recoveryQuestionPasswordMinAnswers: {
                                    label: "Số câu hỏi cần thiết cho khôi phục mật khẩu"
                                },
                                recoveryQuestionAnswerRegex: {
                                    hint: "Regex cho câu trả lời câu hỏi bảo mật",
                                    label: "Regex cho câu trả lời câu hỏi bảo mật"
                                },
                                recoveryQuestionAnswerUniqueness: {
                                    hint: "Bắt buộc tính duy nhất của câu trả lời câu hỏi bảo mật",
                                    label: "Bắt buộc tính duy nhất của câu trả lời câu hỏi bảo mật"
                                },
                                recoveryQuestionPasswordReCaptchaEnable: {
                                    hint: "Nhắc reCaptcha cho khôi phục mật khẩu dựa trên câu hỏi bảo mật",
                                    label: "Bật reCaptcha cho khôi phục mật khẩu dựa trên câu hỏi bảo mật"
                                },
                                recoveryQuestionPasswordReCaptchaMaxFailedAttempts: {
                                    label: "Số lần thất bại tối đa cho reCaptcha"
                                },
                                recoveryNotificationUsernameEnable: {
                                    label: "Khôi phục tên đăng nhập"
                                },
                                recoveryReCaptchaUsernameEnable: {
                                    label: "Bật reCaptcha cho khôi phục tên đăng nhập"
                                },
                                recoveryNotificationInternallyManage: {
                                    hint: "Tắt nếu ứng dụng khách tự xử lý việc gửi thông báo",
                                    label: "Quản lý việc gửi thông báo nội bộ"
                                },
                                recoveryNotifySuccess: {
                                    label: "Thông báo khi khôi phục thành công"
                                },
                                recoveryQuestionPasswordNotifyStart: {
                                    label: "Thông báo khi bắt đầu khôi phục dựa trên câu hỏi bảo mật"
                                },
                                recoveryExpiryTime: {
                                    label: "Thời gian hết hạn liên kết khôi phục tính bằng phút"
                                },
                                recoveryNotificationPasswordExpiryTimeSmsOtp: {
                                    hint: "Thời gian hết hạn của mã SMS OTP cho khôi phục mật khẩu",
                                    label: "Thời gian hết hạn SMS OTP"
                                },
                                recoveryNotificationPasswordSmsOtpRegex: {
                                    hint: "Regex cho SMS OTP ở định dạng [ký tự được phép]{độ dài}. Các dải ký tự được hỗ trợ là a-z, A-Z, 0-9. Độ dài OTP tối thiểu là 4",
                                    label: "Regex SMS OTP"
                                },
                                recoveryQuestionPasswordForcedEnable: {
                                    hint: "Buộc người dùng cung cấp câu trả lời cho câu hỏi bảo mật khi đăng nhập",
                                    label: "Bật câu hỏi bảo mật bắt buộc"
                                },
                                recoveryQuestionMinQuestionsToAnswer: {
                                    hint: "Buộc người dùng cung cấp câu trả lời cho câu hỏi bảo mật khi đăng nhập nếu người dùng đã trả lời ít hơn giá trị này",
                                    label: "Số câu hỏi bảo mật bắt buộc tối thiểu phải trả lời"
                                },
                                recoveryCallbackRegex: {
                                    hint: "Regex URL callback khôi phục",
                                    label: "Regex URL callback khôi phục"
                                },
                                recoveryAutoLoginEnable: {
                                    hint: "Người dùng sẽ được đăng nhập tự động sau khi hoàn thành trình hướng dẫn Đặt lại mật khẩu",
                                    label: "Bật tự động đăng nhập sau khi đặt lại mật khẩu"
                                }
                            }
                        },
                        adminForcedPasswordReset: {
                            friendlyName: "Đặt lại mật khẩu",
                            properties: {
                                recoveryAdminPasswordResetRecoveryLink: {
                                    hint: "Người dùng được thông báo bằng một liên kết để đặt lại mật khẩu",
                                    label: "Bật đặt lại mật khẩu qua email khôi phục"
                                },
                                recoveryAdminPasswordResetOtp: {
                                    hint: "Người dùng được thông báo bằng mật khẩu dùng một lần để thử đăng nhập SSO",
                                    label: "Bật đặt lại mật khẩu qua OTP"
                                },
                                recoveryAdminPasswordResetOffline: {
                                    hint: "Một OTP được tạo và lưu trong claim của người dùng",
                                    label: "Bật đặt lại mật khẩu ngoại tuyến"
                                },
                                recoveryAdminPasswordResetExpiryTime: {
                                    hint: "Thời gian hiệu lực của mã đặt lại mật khẩu do quản trị viên buộc, tính bằng phút",
                                    label: "Thời gian hết hạn mã đặt lại mật khẩu do quản trị viên buộc"
                                }
                            }
                        }
                    }
                },
                otherSettings : {
                    name: "Cài đặt khác",
                    description: "Cấu hình các cài đặt khác.",
                    connectors: {
                        piiController: {
                            friendlyName: "Bộ điều khiển thông tin chấp thuận",
                            properties: {
                                piiController: {
                                    hint: "Tên của Bộ điều khiển đầu tiên thu thập dữ liệu",
                                    label: "Tên bộ điều khiển"
                                },
                                contact: {
                                    hint: "Tên liên hệ của Bộ điều khiển",
                                    label: "Tên liên hệ"
                                },
                                email: {
                                    hint: "Địa chỉ email liên hệ của Bộ điều khiển",
                                    label: "Địa chỉ email"
                                },
                                phone: {
                                    hint: "Số điện thoại liên hệ của Bộ điều khiển",
                                    label: "Số điện thoại"
                                },
                                onBehalf: {
                                    hint: "Một Bộ xử lý thông tin người dùng (PII) hành động thay mặt cho Bộ điều khiển hoặc Bộ xử lý PII",
                                    label: "Thay mặt"
                                },
                                piiControllerUrl: {
                                    hint: "URL để liên hệ với Bộ điều khiển",
                                    label: "Url"
                                },
                                addressCountry: {
                                    hint: "Quốc gia của Bộ điều khiển",
                                    label: "Quốc gia"
                                },
                                addressLocality: {
                                    hint: "Địa phương của Bộ điều khiển",
                                    label: "Địa phương"
                                },
                                addressRegion: {
                                    hint: "Vùng của Bộ điều khiển",
                                    label: "Vùng"
                                },
                                postOfficeBoxNumber: {
                                    hint: "Số hộp thư bưu điện của Bộ điều khiển",
                                    label: "Số hộp thư bưu điện"
                                },
                                postalCode: {
                                    hint: "Mã bưu chính của Bộ điều khiển",
                                    label: "Mã bưu chính"
                                },
                                streetAddress: {
                                    hint: "Địa chỉ đường phố của Bộ điều khiển",
                                    label: "Địa chỉ đường phố"
                                }
                            }
                        },
                        analyticsEngine: {
                            friendlyName: "[Không còn dùng] Identity Server Analytics",
                            messages: {
                                deprecation: {
                                    description: "WSO2 Identity Server Analytics hiện không còn được dùng. Hãy dùng <1>ELK Analytics</1> thay thế.",
                                    heading: "Không còn được dùng"
                                }
                            },
                            properties: {
                                adaptiveAuthenticationAnalyticsReceiver: {
                                    hint: "Máy chủ đích",
                                    label: "Máy chủ đích"
                                },
                                adaptiveAuthenticationAnalyticsBasicAuthEnabled: {
                                    hint: "Bật xác thực cơ bản",
                                    label: "Bật xác thực cơ bản"
                                },
                                adaptiveAuthenticationAnalyticsBasicAuthUsername: {
                                    hint: "ID người dùng được bảo vệ của máy chủ đích",
                                    label: "ID người dùng"
                                },
                                secretAdaptiveAuthenticationAnalyticsBasicAuthPassword: {
                                    hint: "Secret được bảo vệ của máy chủ đích",
                                    label: "Secret"
                                },
                                adaptiveAuthenticationAnalyticsHttpConnectionTimeout: {
                                    hint: "Thời gian chờ kết nối HTTP tính bằng mili giây",
                                    label: "Thời gian chờ kết nối HTTP"
                                },
                                adaptiveAuthenticationAnalyticsHttpReadTimeout: {
                                    hint: "Thời gian chờ đọc HTTP tính bằng mili giây",
                                    label: "Thời gian chờ đọc HTTP"
                                },
                                adaptiveAuthenticationAnalyticsHttpConnectionRequestTimeout: {
                                    hint: "Thời gian chờ yêu cầu kết nối HTTP tính bằng mili giây",
                                    label: "Thời gian chờ yêu cầu kết nối HTTP"
                                },
                                adaptiveAuthenticationAnalyticsHostnameVerfier: {
                                    hint: "Xác minh tên máy chủ. (STRICT, ALLOW_ALL)",
                                    label: "Xác minh tên máy chủ"
                                }
                            }
                        },
                        elasticAnalyticsEngine: {
                            friendlyName: "ELK Analytics",
                            warningModal: {
                                configure: "<1>Cấu hình</1> cài đặt ELK Analytics để hoạt động đúng.",
                                reassure: "Bạn có thể cập nhật cài đặt của mình bất cứ lúc nào."
                            },
                            properties: {
                                adaptiveAuthenticationElasticReceiver: {
                                    hint: "Máy chủ Elasticsearch",
                                    label: "Máy chủ Elasticsearch"
                                },
                                adaptiveAuthenticationElasticBasicAuthEnabled: {
                                    hint: "Bật xác thực cơ bản",
                                    label: "Bật xác thực cơ bản"
                                },
                                adaptiveAuthenticationElasticBasicAuthUsername: {
                                    hint: "Tên đăng nhập Elasticsearch",
                                    label: "Tên đăng nhập Elasticsearch"
                                },
                                secretAdaptiveAuthenticationElasticBasicAuthPassword: {
                                    hint: "Mật khẩu người dùng Elasticsearch",
                                    label: "Mật khẩu Elasticsearch"
                                },
                                adaptiveAuthenticationElasticHttpConnectionTimeout: {
                                    hint: "Thời gian chờ kết nối HTTP tính bằng mili giây",
                                    label: "Thời gian chờ kết nối HTTP"
                                },
                                adaptiveAuthenticationElasticHttpReadTimeout: {
                                    hint: "Thời gian chờ đọc HTTP tính bằng mili giây",
                                    label: "Thời gian chờ đọc HTTP"
                                },
                                adaptiveAuthenticationElasticHttpConnectionRequestTimeout: {
                                    hint: "Thời gian chờ yêu cầu kết nối HTTP tính bằng mili giây",
                                    label: "Thời gian chờ yêu cầu kết nối HTTP"
                                },
                                adaptiveAuthenticationElasticHostnameVerfier: {
                                    hint: "Xác minh tên máy chủ. (STRICT, ALLOW_ALL)",
                                    label: "Xác minh tên máy chủ"
                                }
                            }
                        },
                        userClaimUpdate: {
                            friendlyName: "Xác minh thuộc tính người dùng",
                            properties: {
                                userClaimUpdateEmailEnableVerification: {
                                    hint: "Kích hoạt thông báo xác minh khi địa chỉ email của người dùng được cập nhật.",
                                    label: "Bật xác minh email người dùng khi cập nhật"
                                },
                                userClaimUpdateEmailVerificationCodeExpiryTime: {
                                    hint: "Thời gian hiệu lực của liên kết xác nhận email tính bằng phút.",
                                    label: "Thời gian hết hạn liên kết xác minh email khi cập nhật"
                                },
                                userClaimUpdateEmailEnableNotification: {
                                    hint: "Kích hoạt thông báo đến địa chỉ email hiện có khi người dùng cố cập nhật địa chỉ email hiện có.",
                                    label: "Bật thông báo email người dùng khi cập nhật"
                                },
                                userClaimUpdateMobileNumberEnableVerification: {
                                    hint: "Kích hoạt SMS OTP xác minh khi số điện thoại của người dùng được cập nhật.",
                                    label: "Bật xác minh số điện thoại người dùng khi cập nhật"
                                },
                                userClaimUpdateMobileNumberVerificationCodeExpiryTime: {
                                    hint: "Thời gian hiệu lực của OTP xác nhận số điện thoại tính bằng phút.",
                                    label: "Thời gian hết hạn SMS OTP xác minh số điện thoại khi cập nhật"
                                },
                                userClaimUpdateMobileNumberEnableVerificationByPrivilegedUser: {
                                    hint: "Cho phép người dùng có đặc quyền khởi tạo xác minh số điện thoại khi cập nhật.",
                                    label: "Bật xác minh số điện thoại bởi người dùng có đặc quyền"
                                }
                            }
                        }
                    }
                },
                multiFactorAuthenticators : {
                    name: "Phương thức xác thực đa yếu tố",
                    friendlyName: "Cài đặt phương thức xác thực",
                    description: "Cấu hình cài đặt phương thức xác thực đa yếu tố.",
                    connectors: {
                        backupCodeAuthenticator: {
                            friendlyName: "Phương thức xác thực mã dự phòng",
                            properties: {
                                backupCodeBackupCodeLength: {
                                    hint: "Độ dài của một mã dự phòng",
                                    label: "Độ dài mã dự phòng"
                                },
                                backupCodeBackupCodeSize: {
                                    hint: "Số lượng mã dự phòng tối đa",
                                    label: "Số lượng mã dự phòng"
                                }
                            }
                        }
                    }
                },
                sessionManagement: {
                    description: "Quản lý các cài đặt liên quan đến phiên của người dùng."
                },
                saml2WebSsoConfiguration: {
                    description: "Cấu hình SAML2 Web SSO cho các ứng dụng của bạn."
                },
                wsFederationConfiguration: {
                    description: "Cấu hình giao thức WS-Federation cho các ứng dụng của bạn."
                }
            },
            disabled: "Đã vô hiệu hóa",
            enabled: "Đã bật",
            form: {
                errors: {
                    format: "Định dạng không đúng.",
                    positiveIntegers: "Số không được nhỏ hơn 0."
                }
            },
            genericDescription: "Cấu hình cài đặt liên quan đến connector {{ name }}.",
            notifications: {
                getConnector: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi lấy dữ liệu"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy governance connector.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getConnectorCategories: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi lấy dữ liệu"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy danh mục governance connector.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                updateConnector: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi cập nhật"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật governance connector.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Cấu hình {{ name }} đã được cập nhật thành công.",
                        message: "Cập nhật thành công."
                    }
                }
            },
            pageSubHeading: "Cấu hình và quản lý {{ name }}."
        },
        groups: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "Ví dụ: tên nhóm."
                        },
                        filterCondition: {
                            placeholder: "Ví dụ: Starts with, v.v."
                        },
                        filterValue: {
                            placeholder: "Nhập giá trị để tìm kiếm"
                        }
                    }
                },
                placeholder: "Tìm kiếm theo tên nhóm"
            },
            edit: {
                basics: {
                    fields: {
                        groupName: {
                            name: "Tên nhóm",
                            placeholder: "Nhập tên nhóm",
                            required: "Cần có tên nhóm"
                        }
                    }
                },
                roles: {
                    placeHolders: {
                        emptyListPlaceholder: {
                            subtitles: "Hiện tại không có vai trò nào được gán cho nhóm này.",
                            title: "Không có vai trò nào được gán"
                        }
                    },
                    heading: "Vai trò đã gán",
                    addRolesModal: {
                        heading: "Cập nhật vai trò nhóm",
                        subHeading: "Thêm vai trò mới hoặc xóa các vai trò hiện có được gán cho nhóm."
                    },
                    subHeading: "Xem các vai trò đã gán cho nhóm."
                }
            },
            list: {
                columns: {
                    actions: "Hành động",
                    lastModified: "Thời gian sửa đổi",
                    name: "Nhóm",
                    source: "Kho người dùng"
                },
                storeOptions: "Chọn kho người dùng"
            },
            notifications: {
                createGroup: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi tạo nhóm."
                    },
                    genericError: {
                        description: "Không thể tạo nhóm.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Nhóm đã được tạo thành công.",
                        message: "Tạo nhóm thành công."
                    }
                },
                createPermission: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi thêm quyền cho nhóm."
                    },
                    genericError: {
                        description: "Không thể thêm quyền cho nhóm.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Quyền đã được thêm thành công cho nhóm.",
                        message: "Tạo nhóm thành công."
                    }
                },
                deleteGroup: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi xóa nhóm đã chọn."
                    },
                    genericError: {
                        description: "Không thể xóa nhóm đã chọn.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Nhóm đã chọn đã được xóa thành công.",
                        message: "Xóa nhóm thành công"
                    }
                },
                fetchGroups: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy danh sách nhóm.",
                        message: "Đã xảy ra lỗi"
                    }
                },
                updateGroup: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi cập nhật nhóm đã chọn."
                    },
                    genericError: {
                        description: "Không thể cập nhật nhóm đã chọn.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Nhóm đã chọn đã được cập nhật thành công.",
                        message: "Cập nhật nhóm thành công"
                    }
                }
            },
            placeholders: {
                groupsError: {
                    subtitles: [
                        "Đã xảy ra lỗi khi cố lấy danh sách nhóm từ kho người dùng.",
                        "Vui lòng đảm bảo rằng thông tin kết nối của kho người dùng là chính xác."
                    ],
                    title:"Không thể lấy danh sách nhóm từ kho người dùng"
                }
            }
        },
        header: {
            links: {
                devPortalNav: "Cổng nhà phát triển",
                userPortalNav: "My Account"
            }
        },
        helpPanel: {
            notifications: {
                pin: {
                    success: {
                        description: "Bảng trợ giúp sẽ luôn xuất hiện {{state}} trừ khi bạn thay đổi rõ ràng.",
                        message: "Bảng trợ giúp {{state}}"
                    }
                }
            }
        },
        invite: {
            advancedSearch: {
                form: {
                    dropdown: {
                        filterAttributeOptions: {
                            email: "Email",
                            username: "Tên đăng nhập"
                        }
                    },
                    inputs: {
                        filterAttribute: {
                            placeholder: "Ví dụ: Email, v.v."
                        },
                        filterCondition: {
                            placeholder: "Ví dụ: Starts with, v.v."
                        },
                        filterValue: {
                            placeholder: "Nhập giá trị để tìm kiếm"
                        }
                    }
                },
                placeholder: "Tìm kiếm theo Email"
            },
            confirmationModal: {
                deleteInvite: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Nếu bạn thu hồi lời mời này, người dùng sẽ không thể tham gia tổ chức của bạn. " +
                        "Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác và sẽ thu hồi vĩnh viễn lời mời."
                },
                resendInvite: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Nếu bạn gửi lại lời mời, liên kết mời trước đó sẽ bị thu hồi. " +
                        "Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này sẽ thu hồi vĩnh viễn lời mời trước đó."
                }
            },
            form: {
                sendmail: {
                    subTitle: "Gửi email mời để thêm quản trị viên hoặc nhà phát triển mới vào tổ chức của bạn",
                    title: "Mời quản trị viên/nhà phát triển"
                }
            },
            inviteButton: "Lời mời mới",
            notifications: {
                deleteInvite: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi xóa lời mời"
                    },
                    genericError: {
                        description: "Không thể xóa lời mời",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã xóa lời mời của người dùng thành công.",
                        message: "Xóa lời mời thành công"
                    }
                },
                resendInvite: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi gửi lại lời mời"
                    },
                    genericError: {
                        description: "Không thể gửi lại lời mời",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã gửi lại lời mời qua email thành công.",
                        message: "Đã gửi lại lời mời"
                    }
                },
                sendInvite: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi gửi lời mời"
                    },
                    genericError: {
                        description: "Không thể gửi lời mời",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã gửi lời mời qua email thành công.",
                        message: "Đã gửi lời mời"
                    }
                },
                updateInvite: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi cập nhật lời mời"
                    },
                    genericError: {
                        description: "Không thể cập nhật lời mời",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã cập nhật lời mời thành công.",
                        message: "Cập nhật lời mời thành công"
                    }
                }
            },
            placeholder: {
                emptyResultPlaceholder: {
                    addButton: "Lời mời mới",
                    subTitle: {
                        0: "Hiện tại không có lời mời nào khả dụng.",
                        1: "Bạn có thể tạo một tổ chức và mời người dùng",
                        2: "tham gia tổ chức của bạn."
                    },
                    title: "Gửi lời mời mới"
                },
                emptySearchResultPlaceholder: {
                    clearButton: "Xóa truy vấn tìm kiếm",
                    subTitle: {
                        0: "Chúng tôi không thể tìm thấy kết quả nào cho {{query}}",
                        1: "Vui lòng thử một từ khóa tìm kiếm khác."
                    },
                    title: "Không tìm thấy kết quả"
                }
            },
            rolesUpdateModal: {
                header: "Cập nhật vai trò người được mời",
                searchPlaceholder: "Tìm kiếm theo tên vai trò",
                subHeader: "Thêm hoặc xóa vai trò khỏi người dùng bạn đã mời."
            },
            subSelection: {
                invitees: "Người được mời",
                onBoard: "Người dùng đã tham gia"
            }
        },
        parentOrgInvitations: {
            addUserWizard: {
                heading: "Mời người dùng tổ chức cha",
                description: "Mời người dùng từ tổ chức cha.",
                hint: "Người dùng được mời được quản lý bởi tổ chức cha.",
                username: {
                    label: "Tên đăng nhập",
                    placeholder: "Nhập tên đăng nhập",
                    hint: "Thêm tên đăng nhập của một người dùng tổ chức cha và nhấn enter. Lặp lại để thêm nhiều người dùng.",
                    validations: {
                        required: "Cần chọn ít nhất một người dùng."
                    }
                },
                groups: {
                    label: "Nhóm",
                    placeholder: "Chọn nhóm",
                    hint: "Gán nhóm cho người dùng đang được mời.",
                    validations: {
                        required: "Nhóm là trường bắt buộc."
                    }
                },
                inviteButton: "Mời"
            },
            tab: {
                usersTab: "Người dùng",
                invitationsTab: "Lời mời"
            },
            searchPlaceholder: "Tìm kiếm theo tên đăng nhập",
            searchdropdown: {
                pendingLabel: "Đang chờ",
                expiredLabel: "Đã hết hạn"
            },
            createDropdown: {
                createLabel: "Tạo người dùng",
                inviteLabel: "Mời người dùng tổ chức cha"
            },
            filterLabel: "Lọc theo: ",
            emptyPlaceholder: {
                noPendingInvitations: "Hiện tại không có lời mời nào đang chờ xử lý.",
                noExpiredInvitations: "Hiện tại có các lời mời đã hết hạn.",
                noInvitations: "Hiện tại không có lời mời nào.",
                noCollaboratorUserInvitations: "Hiện tại không có người dùng cộng tác nào với lời mời đã hết hạn."
            },
            invitedUserLabel: "Được quản lý bởi tổ chức cha"
        },
        oidcScopes: {
            back: "Quay lại Ánh xạ thuộc tính OpenID Connect",
            viewAttributes: "Xem thuộc tính",
            manageAttributes: "Quản lý thuộc tính",
            addAttributes: {
                description: "Chọn những thuộc tính người dùng bạn muốn liên kết với phạm vi {{name}}."
            },
            buttons: {
                addScope: "Phạm vi OIDC mới"
            },
            confirmationModals: {
                deleteClaim: {
                    assertionHint: "Vui lòng nhập <1>{{ name }}</1> để xác nhận.",
                    content: "Nếu bạn xóa claim này, bạn sẽ không thể khôi phục lại." +
                        "Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn claim OIDC."
                },
                deleteScope: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Nếu bạn xóa phạm vi này, bạn sẽ không thể khôi phục lại. " +
                        "Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn phạm vi OIDC."
                }
            },
            editScope: {
                claimList: {
                    addClaim:  "Thuộc tính mới",
                    emptyPlaceholder: {
                        action: "Thêm thuộc tính",
                        subtitles: {
                            0: "Không có thuộc tính nào được thêm cho phạm vi OIDC này.",
                            1: "Vui lòng thêm các thuộc tính cần thiết để xem chúng tại đây."
                        },
                        title: "Không có thuộc tính OIDC"
                    },
                    emptySearch: {
                        action: "Xem tất cả",
                        subtitles: {
                            0: "Chúng tôi không thể tìm thấy thuộc tính bạn đã tìm kiếm.",
                            1: "Vui lòng thử một tên khác."
                        },
                        title: "Không tìm thấy kết quả"
                    },
                    popupDelete: "Xóa thuộc tính",
                    searchClaims: "tìm kiếm thuộc tính",
                    subTitle: "Thêm hoặc xóa thuộc tính của một phạm vi OIDC",
                    title: "{{ name }}"
                }
            },
            forms: {
                addScopeForm: {
                    inputs: {
                        description: {
                            label: "Mô tả",
                            placeholder: "Nhập mô tả cho phạm vi"
                        },
                        displayName: {
                            label: "Tên hiển thị",
                            placeholder: "Nhập tên hiển thị",
                            validations: {
                                empty: "Trường này không được để trống"
                            }
                        },
                        scopeName: {
                            label: "Phạm vi",
                            placeholder: "Nhập phạm vi",
                            validations: {
                                duplicate: "Phạm vi này đã tồn tại.",
                                empty: "Trường này không được để trống.",
                                invalid: "Phạm vi chỉ có thể chứa ký tự chữ và số và _. " +
                                "Và phải có độ dài từ 3 đến 40 ký tự."
                            }
                        }
                    }
                }
            },
            list: {
                columns: {
                    actions: "Hành động",
                    name: "Tên"
                },
                empty: {
                    action: "Thêm phạm vi OIDC",
                    subtitles: {
                        0: "Không có phạm vi OIDC nào trong hệ thống.",
                        1: "Vui lòng thêm phạm vi OIDC mới để xem chúng tại đây."
                    },
                    title: "Không có phạm vi OIDC"
                },
                searchPlaceholder: "Tìm kiếm theo phạm vi"
            },
            notifications: {
                addOIDCClaim: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi tạo"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi thêm thuộc tính OIDC.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã thêm thuộc tính OIDC mới thành công.",
                        message: "Tạo thành công"
                    }
                },
                addOIDCScope: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi tạo"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi tạo phạm vi OIDC.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã tạo phạm vi OIDC mới thành công.",
                        message: "Tạo thành công"
                    }
                },
                claimsMandatory: {
                    error: {
                        description: "Để thêm một phạm vi, bạn cần đảm bảo rằng phạm vi " +
                            "có ít nhất một thuộc tính.",
                        message: "Bạn cần chọn ít nhất một thuộc tính."
                    }
                },
                deleteOIDCScope: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi xóa"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi xóa phạm vi OIDC.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã xóa phạm vi OIDC thành công.",
                        message: "Xóa thành công"
                    }
                },
                deleteOIDClaim: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi xóa"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi xóa thuộc tính OIDC.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã xóa thuộc tính OIDC thành công.",
                        message: "Xóa thành công"
                    }
                },
                fetchOIDCScope: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi lấy dữ liệu"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy chi tiết phạm vi OIDC.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy chi tiết phạm vi OIDC thành công.",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                fetchOIDCScopes: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi lấy dữ liệu"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy các phạm vi OIDC.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy danh sách phạm vi OIDC thành công.",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                fetchOIDClaims: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi lấy dữ liệu"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy các thuộc tính OIDC.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy danh sách phạm vi OIDC thành công.",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                updateOIDCScope: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi cập nhật"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật phạm vi OIDC.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã cập nhật phạm vi OIDC {{ scope }} thành công.",
                        message: "Cập nhật thành công"
                    }
                }
            },
            placeholders:{
                emptyList: {
                    action: "Phạm vi OIDC mới",
                    subtitles: {
                        0: "Hiện tại không có phạm vi OIDC nào.",
                        1: "Bạn có thể thêm phạm vi OIDC mới một cách dễ dàng bằng cách làm theo",
                        2: "các bước trong trình hướng dẫn tạo."
                    },
                    title: "Thêm một phạm vi OIDC mới"
                },
                emptySearch: {
                    action: "Xóa truy vấn tìm kiếm",
                    subtitles: {
                        0: "Chúng tôi không thể tìm thấy phạm vi bạn đã tìm kiếm.",
                        1: "Vui lòng thử một tên khác."
                    },
                    title: "Không tìm thấy kết quả"
                }
            },
            wizards: {
                addScopeWizard: {
                    buttons: {
                        next: "Tiếp theo",
                        previous: "Trước"
                    },
                    claimList: {
                        searchPlaceholder: "Tìm kiếm thuộc tính",
                        table: {
                            emptyPlaceholders: {
                                assigned: "Tất cả thuộc tính khả dụng đã được gán cho phạm vi OIDC này.",
                                unAssigned: "Không có thuộc tính nào được gán cho phạm vi OIDC này."
                            },
                            header: "Thuộc tính"
                        }
                    },
                    steps: {
                        basicDetails: "Chi tiết cơ bản",
                        claims: "Thêm thuộc tính"
                    },
                    subTitle: "Tạo một phạm vi OpenID Connect (OIDC) mới với các thuộc tính cần thiết",
                    title: "Tạo phạm vi OpenID Connect"
                }
            }
        },
        onboarded: {
            confirmationModal: {
                removeUser: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Nếu bạn xóa người dùng này, người dùng sẽ không thể truy cập console " +
                        "trong tổ chức của bạn. Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác và sẽ xóa người dùng khỏi tổ chức của bạn."
                }
            },
            notifications: {
                removeUser: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi xóa người dùng"
                    },
                    genericError: {
                        description: "Không thể xóa người dùng khỏi tổ chức {{tenant}}",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã xóa người dùng khỏi tổ chức {{tenant}} thành công",
                        message: "Xóa người dùng thành công"
                    }
                }
            }
        },
        organizationDiscovery: {
            advancedSearch: {
                form: {
                    dropdown: {
                        filterAttributeOptions: {
                            organizationName: "Tên tổ chức"
                        }
                    },
                    inputs: {
                        filterAttribute: {
                            placeholder: "Ví dụ: Tên tổ chức, v.v."
                        },
                        filterCondition: {
                            placeholder: "Ví dụ: Starts with, v.v."
                        },
                        filterValue: {
                            placeholder: "Nhập giá trị để tìm kiếm"
                        }
                    }
                },
                placeholder: "Tìm kiếm theo tên tổ chức"
            },
            assign: {
                title: "Gán miền email",
                description: "Gán miền email cho các tổ chức.",
                form: {
                    fields: {
                        emailDomains: {
                            label : "Miền email",
                            placeholder: "Nhập miền email",
                            hint: "Nhập và enter miền email để ánh xạ tới tổ chức. (Ví dụ: gmail.com, v.v.)",
                            validations: {
                                invalid: {
                                    0: "Vui lòng nhập một miền email hợp lệ.",
                                    1: "Miền email đã cung cấp đã được ánh xạ tới một tổ chức khác."
                                }
                            }
                        },
                        organizationName: {
                            label: "Tên tổ chức",
                            placeholder: "Chọn một tổ chức",
                            emptyPlaceholder: {
                                0: "Không có tổ chức nào khả dụng.",
                                1: "Tất cả tổ chức đều đã được gán miền."
                            },
                            hint: "Nhập tên tổ chức mà bạn muốn thêm ánh xạ miền."
                        }
                    }
                },
                buttons: {
                    assign: "Gán"
                }
            },
            emailDomains: {
                actions: {
                    assign: "Gán miền email",
                    enable: "Bật khám phá miền email"
                }
            },
            edit: {
                back: "Quay lại",
                description: "Chỉnh sửa miền email",
                form: {
                    fields: {
                        emailDomains: {
                            label : "Miền email",
                            placeholder: "Nhập miền email",
                            hint: "Nhập và enter miền email để ánh xạ tới tổ chức. (Ví dụ: gmail.com, v.v.)",
                            validations: {
                                invalid: {
                                    0: "Vui lòng nhập một miền email hợp lệ.",
                                    1: "Miền email đã cung cấp đã được ánh xạ tới một tổ chức khác."
                                }
                            }
                        },
                        organizationName: {
                            label: "Tên tổ chức",
                            hint: "Tên tổ chức mà các ánh xạ miền được thêm vào."
                        }
                    },
                    message: "Thay đổi ánh xạ miền email có thể khiến người dùng hiện có không thể đăng nhập."
                }
            },
            message: "Tính năng khám phá miền email chỉ có thể được sử dụng khi địa chỉ email được cấu hình làm tên đăng nhập.",
            notifications: {
                addEmailDomains: {
                    error: {
                        description: "Việc thêm miền email vào tổ chức không thành công.",
                        message: "Thêm không thành công"
                    },
                    success: {
                        description: "Đã thêm miền email thành công.",
                        message: "Thêm thành công"
                    }
                },
                checkEmailDomain: {
                    error: {
                        description: "Việc xác thực sự tồn tại của miền email không thành công.",
                        message: "Xác thực không thành công"
                    }
                },
                disableEmailDomainDiscovery: {
                    error: {
                        description: "Đã xảy ra lỗi khi tắt khám phá miền email.",
                        message: "Tắt không thành công"
                    },
                    success: {
                        description: "Đã tắt khám phá miền email thành công.",
                        message: "Tắt thành công"
                    }
                },
                enableEmailDomainDiscovery: {
                    error: {
                        description: "Đã xảy ra lỗi khi bật khám phá miền email.",
                        message: "Bật không thành công"
                    },
                    success: {
                        description: "Đã bật khám phá miền email thành công.",
                        message: "Bật thành công"
                    }
                },
                fetchOrganizationDiscoveryAttributes: {
                    error: {
                        description: "Đã xảy ra lỗi khi lấy các thuộc tính khám phá tổ chức.",
                        message: "Lấy dữ liệu không thành công"
                    }
                },
                getEmailDomainDiscovery: {
                    error: {
                        description: "Đã xảy ra lỗi khi lấy cấu hình khám phá miền email.",
                        message: "Lấy dữ liệu không thành công"
                    }
                },
                getOrganizationListWithDiscovery: {
                    error: {
                        description: "Đã xảy ra lỗi khi lấy danh sách tổ chức với các thuộc tính khám phá.",
                        message: "Lấy dữ liệu không thành công"
                    }
                },
                updateOrganizationDiscoveryAttributes: {
                    error: {
                        description: "Đã xảy ra lỗi khi cập nhật các thuộc tính khám phá tổ chức.",
                        message: "Cập nhật không thành công"
                    },
                    success: {
                        description: "Đã cập nhật các thuộc tính khám phá tổ chức thành công.",
                        message: "Cập nhật thành công"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "Gán miền email",
                    subtitles: "Không có tổ chức nào được gán miền email.",
                    title: "Gán miền email"
                }
            },
            title: "Khám phá miền email"
        },
        organizations: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "Ví dụ: Name, v.v."
                        },
                        filterCondition: {
                            placeholder: "Ví dụ: Starts With, v.v."
                        },
                        filterValue: {
                            placeholder: "Nhập giá trị để tìm kiếm"
                        }
                    }
                },
                placeholder: "Tìm kiếm theo tên"
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
            shareApplicationSubTitle: "Chọn một trong các tùy chọn sau để chia sẻ ứng dụng.",
            shareApplicationRadio: "Chia sẻ với tất cả tổ chức",
            shareApplicationInfo: "Chọn tùy chọn này để chia sẻ ứng dụng với tất cả tổ chức hiện có " +
                "và tất cả tổ chức mới mà bạn tạo dưới tổ chức hiện tại của mình.",
            unshareApplicationRadio: "Không chia sẻ với bất kỳ tổ chức nào",
            shareWithSelectedOrgsRadio: "Chỉ chia sẻ với các tổ chức được chọn",
            unshareApplicationInfo: "Điều này cho phép bạn ngăn chia sẻ ứng dụng này với bất kỳ " +
                "tổ chức hiện có nào hoặc tổ chức mới mà bạn tạo dưới tổ chức này " +
                "trong tương lai.",
            switching: {
                emptyList: "Không có tổ chức nào để hiển thị.",
                goBack: "Quay lại",
                search: {
                    placeholder: "Tìm kiếm theo tên"
                },
                subOrganizations: "Tổ chức",
                switchLabel: "Tổ chức",
                switchButton: "Chuyển sang tổ chức",
                notifications: {
                    switchOrganization: {
                        genericError: {
                            description: "Không thể chuyển sang tổ chức đã chọn.",
                            message: "Đã xảy ra lỗi"
                        }
                    }
                }
            },
            title: "Tổ chức",
            view: {
                description: "Xem tổ chức"
            }
        },
        overview: {
            widgets: {
                insights: {
                    groups: {
                        heading: "Nhóm",
                        subHeading: "Tổng quan về Nhóm"
                    },
                    users: {
                        heading: "Người dùng",
                        subHeading: "Tổng quan về Người dùng"
                    }
                },
                overview: {
                    cards: {
                        groups: {
                            heading: "Nhóm"
                        },
                        users: {
                            heading: "Người dùng"
                        },
                        userstores: {
                            heading: "Kho người dùng"
                        }
                    },
                    heading: "Tổng quan",
                    subHeading: "Bộ thống kê cơ bản để hiểu trạng thái của instance."
                },
                quickLinks: {
                    cards: {
                        certificates: {
                            heading: "Chứng chỉ",
                            subHeading: "Quản lý các chứng chỉ trong keystore."
                        },
                        dialects: {
                            heading: "Dialect thuộc tính",
                            subHeading: "Quản lý dialect thuộc tính."
                        },
                        emailTemplates: {
                            heading: "Template email",
                            subHeading: "Quản lý template email."
                        },
                        generalConfigs: {
                            heading: "Cấu hình chung",
                            subHeading: "Quản lý cấu hình, chính sách, v.v."
                        },
                        groups: {
                            heading: "Nhóm",
                            subHeading: "Quản lý nhóm người dùng và quyền."
                        },
                        roles: {
                            heading: "Vai trò",
                            subHeading: "Quản lý vai trò người dùng và quyền."
                        }
                    },
                    heading: "Liên kết nhanh",
                    subHeading: "Liên kết để nhanh chóng điều hướng đến các tính năng."
                }
            }
        },
        remoteFetch: {
            components: {
                status: {
                    details: "Chi tiết",
                    header: "Cấu hình từ xa",
                    hint: "Hiện tại không có ứng dụng nào được triển khai.",
                    linkPopup: {
                        content: "",
                        header: "URL kho lưu trữ Github",
                        subHeader: ""
                    },
                    refetch: "Tải lại"
                }
            },
            forms: {
                getRemoteFetchForm: {
                    actions: {
                        remove: "Xóa cấu hình",
                        save: "Lưu cấu hình"
                    },
                    fields: {
                        accessToken: {
                            label: "Github Personal Access Token",
                            placeholder: "Personal Access Token"
                        },
                        connectivity: {
                            children: {
                                polling: {
                                    label: "Polling"
                                },
                                webhook: {
                                    label: "Webhook"
                                }
                            },
                            label: "Cơ chế kết nối"
                        },
                        enable: {
                            hint: "Bật cấu hình để lấy ứng dụng",
                            label: "Bật cấu hình lấy dữ liệu"
                        },
                        gitBranch: {
                            hint: "Bật cấu hình để lấy ứng dụng",
                            label: "Nhánh Github",
                            placeholder: "Ví dụ: Main",
                            validations: {
                                required: "Cần có nhánh Github."
                            }
                        },
                        gitFolder: {
                            hint: "Bật cấu hình để lấy ứng dụng",
                            label: "Thư mục GitHub",
                            placeholder: "Ví dụ: SampleConfigFolder/",
                            validations: {
                                required: "Cần có thư mục cấu hình Github."
                            }
                        },
                        gitURL: {
                            label: "URL kho lưu trữ GitHub",
                            placeholder: "Ví dụ: https://github.com/samplerepo/sample-project",
                            validations: {
                                required: "Cần có URL kho lưu trữ Github."
                            }
                        },
                        pollingFrequency: {
                            label: "Tần suất polling"
                        },
                        sharedKey: {
                            label: "Khóa chia sẻ GitHub"
                        },
                        username: {
                            label: "Tên đăng nhập Github",
                            placeholder: "Ví dụ: John Doe"
                        }
                    },
                    heading: {
                        subTitle: "Cấu hình kho lưu trữ để lấy ứng dụng",
                        title: "Kho lưu trữ cấu hình ứng dụng"
                    }
                }
            },
            modal: {
                appStatusModal: {
                    description: "",
                    heading: "Trạng thái lấy ứng dụng",
                    primaryButton: "Tải lại ứng dụng",
                    secondaryButton: ""
                }
            },
            notifications: {
                createRepoConfig: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi tạo"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi tạo cấu hình kho từ xa.",
                        message: "Lỗi tạo"
                    },
                    success: {
                        description: "Đã tạo cấu hình kho từ xa thành công.",
                        message: "Tạo thành công"
                    }
                },
                deleteRepoConfig: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi xóa"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi xóa cấu hình kho từ xa.",
                        message: "Lỗi xóa"
                    },
                    success: {
                        description: "Đã xóa cấu hình kho từ xa thành công.",
                        message: "Xóa thành công"
                    }
                },
                getConfigDeploymentDetails: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi lấy dữ liệu"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy chi tiết triển khai.",
                        message: "Lỗi lấy dữ liệu"
                    },
                    success: {
                        description: "Đã lấy chi tiết triển khai thành công.",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                getConfigList: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi lấy dữ liệu"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy danh sách cấu hình triển khai.",
                        message: "Lỗi lấy dữ liệu"
                    },
                    success: {
                        description: "Đã lấy danh sách cấu hình triển khai thành công.",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                getRemoteRepoConfig: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi lấy dữ liệu"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy cấu hình kho lưu trữ.",
                        message: "Lỗi lấy dữ liệu"
                    },
                    success: {
                        description: "Đã lấy cấu hình kho lưu trữ thành công.",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                triggerConfigDeployment: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi triển khai"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi triển khai cấu hình kho lưu trữ.",
                        message: "Lỗi triển khai"
                    },
                    success: {
                        description: "Đã triển khai cấu hình kho lưu trữ thành công.",
                        message: "Triển khai thành công"
                    }
                }
            },
            pages: {
                listing: {
                    subTitle: "Cấu hình kho lưu trữ github để hoạt động liền mạch với identity server.",
                    title: "Cấu hình từ xa"
                }
            },
            placeholders: {
                emptyListPlaceholder: {
                    action: "Cấu hình kho lưu trữ",
                    subtitles: "Hiện tại không có kho lưu trữ nào được cấu hình. Bạn có thể thêm cấu hình mới.",
                    title: "Thêm cấu hình"
                }
            }
        },
        roles: {
            addRoleWizard: {
                buttons: {
                    finish: "Hoàn tất",
                    next: "Tiếp theo",
                    previous: "Trước"
                },
                forms: {
                    roleBasicDetails: {
                        domain: {
                            label: {
                                group: "Kho người dùng",
                                role: "Loại vai trò"
                            },
                            placeholder: "Miền",
                            validation: {
                                empty: {
                                    group: "Chọn kho người dùng",
                                    role: "Chọn loại vai trò"
                                }
                            }
                        },
                        roleName: {
                            hint: "Một tên cho {{type}}.",
                            label: "Tên {{type}}",
                            placeholder: "Nhập tên {{type}}",
                            validations: {
                                duplicate: "Đã tồn tại một {{type}} với tên {{type}} đã cho.",
                                duplicateInAudience: "Đã tồn tại một vai trò với tên này trong đối tượng đã chọn.",
                                empty: "Cần có tên {{type}} để tiếp tục.",
                                invalid: "Tên {{type}} chỉ có thể chứa ký tự chữ và số, -, và _. "
                                    + "Và phải có độ dài từ 3 đến 30 ký tự."
                            }
                        },
                        roleAudience: {
                            hint: "Đặt đối tượng của vai trò. <1>Lưu ý rằng đối tượng của vai trò không thể thay đổi.</1>",
                            label: "Chọn đối tượng của vai trò",
                            values: {
                                organization: "Tổ chức",
                                application: "Ứng dụng"
                            }
                        },
                        notes: {
                            orgNote: "Khi đối tượng của vai trò là tổ chức, bạn có thể liên kết vai trò với một ứng dụng cho phép vai trò có đối tượng là tổ chức.",
                            appNote: "Khi đối tượng của vai trò là ứng dụng, bạn có thể liên kết vai trò với một ứng dụng cho phép vai trò có đối tượng là ứng dụng.",
                            cannotCreateRole: "Bạn không thể tạo vai trò với đối tượng là ứng dụng vì hiện tại không có ứng dụng nào hỗ trợ vai trò có đối tượng là ứng dụng. Vui lòng <1>tạo một ứng dụng</1> hỗ trợ vai trò có đối tượng là ứng dụng để tiếp tục."
                        },
                        assignedApplication: {
                            hint: "Gán một ứng dụng cho vai trò. Lưu ý rằng ứng dụng được gán cho vai trò này không thể chỉnh sửa sau khi vai trò được tạo.",
                            label: "Ứng dụng được gán",
                            placeholder: "Chọn ứng dụng để gán vai trò",
                            applicationSubTitle: {
                                application: "Hỗ trợ vai trò theo phạm vi ứng dụng.",
                                organization: "Hỗ trợ vai trò theo phạm vi tổ chức. ",
                                changeAudience: "Thay đổi đối tượng"
                            },
                            validations: {
                                empty: "Cần có ứng dụng được gán để tạo vai trò theo phạm vi ứng dụng."
                            },
                            note: "Lưu ý rằng ứng dụng được gán cho vai trò này không thể chỉnh sửa sau khi vai trò được tạo."
                        }
                    },
                    rolePermission: {
                        apiResource: {
                            label: "Chọn tài nguyên API",
                            placeholder: "Chọn một tài nguyên API để gán quyền(phạm vi)",
                            hint: {
                                empty: "Không có tài nguyên API nào được ủy quyền cho ứng dụng đã chọn. Tài nguyên API có thể được ủy quyền thông qua <1>tại đây</1>."
                            }
                        },
                        permissions: {
                            label: "Chọn quyền(phạm vi) từ các tài nguyên API đã chọn",
                            placeholder: "Chọn quyền(phạm vi)",
                            tooltips: {
                                noScopes: "Không có phạm vi nào khả dụng cho tài nguyên API đã chọn",
                                selectAllScopes: "Chọn tất cả quyền(phạm vi)",
                                removeAPIResource: "Xóa tài nguyên API"
                            },
                            validation: {
                                empty: "Danh sách quyền(phạm vi) không được để trống. Chọn ít nhất một quyền(phạm vi)."
                            },
                            permissionsLabel: "Quyền (phạm vi)"
                        },
                        notes: {
                            applicationRoles: "Chỉ các API và quyền(phạm vi) được ủy quyền trong ứng dụng đã chọn(<1>{{applicationName}}</1>) mới được liệt kê để chọn."
                        },
                        notifications: {
                            fetchAPIResourceError: {
                                error: {
                                    description: "Đã xảy ra lỗi khi lấy tài nguyên API. Vui lòng thử lại.",
                                    message: "Đã xảy ra lỗi"
                                }
                            }
                        }
                    }
                },
                heading: "Tạo {{type}}",
                permissions: {
                    buttons: {
                        collapseAll: "Thu gọn tất cả",
                        expandAll: "Mở rộng tất cả",
                        update: "Cập nhật"
                    }
                },
                subHeading: "Tạo một {{type}} mới trong hệ thống.",
                back: "Quay lại",
                summary: {
                    labels: {
                        domain: {
                            group: "Kho người dùng",
                            role: "Loại vai trò"
                        },
                        groups: "Nhóm được gán",
                        permissions: "Quyền",
                        roleName: "Tên {{type}}",
                        roles: "Vai trò được gán",
                        users: "Người dùng được gán"
                    }
                },
                users: {
                    assignUserModal: {
                        heading: "Quản lý người dùng",
                        hint: "Chọn người dùng để thêm họ vào nhóm người dùng.",
                        list: {
                            listHeader: "Tên",
                            searchPlaceholder: "Tìm kiếm người dùng",
                            searchByEmailPlaceholder: "Tìm kiếm người dùng theo địa chỉ email"
                        },
                        subHeading: "Thêm người dùng mới hoặc xóa người dùng hiện có được gán cho {{type}}."
                    }
                },
                wizardSteps: {
                    0: "Chi tiết cơ bản",
                    1: "Chọn quyền",
                    2: "Gán người dùng",
                    3: "Tóm tắt",
                    4: "Nhóm & Người dùng",
                    5: "Gán vai trò"
                }
            },
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "Ví dụ: tên vai trò."
                        },
                        filterCondition: {
                            placeholder: "Ví dụ: Starts with, v.v."
                        },
                        filterValue: {
                            placeholder: "Nhập giá trị để tìm kiếm"
                        }
                    }
                },
                placeholder: "Tìm kiếm theo tên vai trò"
            },
            edit: {
                placeholders: {
                    errorPlaceHolder: {
                        action: "Quay lại",
                        subtitles: {
                            0: "Đã xảy ra lỗi khi lấy vai trò được yêu cầu, có thể do vai trò không tồn tại.",
                            1: "Vui lòng thử lại."
                        },
                        title: "Đã xảy ra lỗi"
                    }
                },
                basics: {
                    buttons: {
                        update: "Cập nhật"
                    },
                    confirmation: {
                        assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                        content: "Nếu bạn xóa {{type}} này, các quyền gắn với nó sẽ " +
                            "bị xóa và những người dùng gắn với nó sẽ không còn có thể thực hiện các hành động " +
                            "mong muốn mà trước đây đã được phép. Vui lòng tiếp tục một cách thận trọng",
                        header: "Bạn có chắc không?",
                        message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn {{type}} đã chọn"
                    },
                    dangerZone: {
                        actionTitle: "Xóa {{type}}",
                        buttonDisableHint: "Tùy chọn xóa bị vô hiệu hóa vì {{type}} này được quản lý trong một" +
                            " kho người dùng từ xa.",
                        header: "Xóa {{type}}",
                        subheader: "Sau khi bạn xóa {{type}}, không thể khôi phục lại."
                    },
                    fields: {
                        roleName: {
                            name: "Tên vai trò",
                            placeholder: "Nhập tên vai trò",
                            required: "Cần có tên vai trò"
                        }
                    }
                },
                groups: {
                    addGroupsModal: {
                        heading: "Cập nhật nhóm của vai trò",
                        subHeading: "Thêm nhóm mới hoặc xóa nhóm hiện có được gán cho vai trò."
                    },
                    placeholders: {
                        emptyPlaceholder: {
                            action: "Gán nhóm",
                            subtitles: {
                                0: "Hiện tại không có nhóm nào được gán cho vai trò này."
                            },
                            title: "Không có nhóm nào được gán cho vai trò."
                        },
                        errorPlaceholder: {
                            action: "Làm mới",
                            subtitles: {
                                0: "Đã xảy ra lỗi khi lấy các nhóm được gán cho vai trò này.",
                                1: "Vui lòng thử lại."
                            },
                            title: "Đã xảy ra lỗi"
                        }
                    },
                    notifications: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi cập nhật các nhóm được gán cho vai trò."
                        },
                        success: {
                            message: "Cập nhật vai trò thành công",
                            description: "Các nhóm được gán cho vai trò đã được cập nhật thành công."
                        },
                        genericError: {
                            message: "Đã xảy ra lỗi",
                            description: "Chúng tôi không thể cập nhật các nhóm được gán cho vai trò."
                        },
                        fetchError: {
                            message: "Đã xảy ra lỗi",
                            description: "Chúng tôi không thể lấy các nhóm được gán cho vai trò."
                        }
                    },
                    externalGroupsHeading: "Nhóm bên ngoài",
                    heading: "Nhóm được gán",
                    localGroupsHeading: "Nhóm cục bộ",
                    subHeading: "Thêm hoặc xóa các nhóm được gán cho vai trò này. Lưu ý rằng điều này "
                        + "sẽ ảnh hưởng đến việc thực hiện một số tác vụ.",
                    actions: {
                        search: {
                            placeholder: "Tìm kiếm nhóm"
                        },
                        assign: {
                            placeholder: "Gán nhóm"
                        },
                        remove: {
                            label: "Đang xóa nhóm",
                            placeholder: "Khôi phục nhóm"
                        }
                    }

                },
                menuItems: {
                    basic: "Cơ bản",
                    connectedApps: "Ứng dụng đã kết nối",
                    groups: "Nhóm",
                    permissions: "Quyền",
                    roles: "Vai trò",
                    users: "Người dùng"
                },
                users: {
                    heading: "Người dùng được gán",
                    subHeading: "Thêm hoặc xóa người dùng được gán cho vai trò này. Lưu ý rằng điều này sẽ ảnh hưởng đến việc thực hiện một số tác vụ.",
                    actions: {
                        search: {
                            placeholder: "Tìm kiếm người dùng"
                        },
                        assign: {
                            placeholder: "Nhập tên đăng nhập để tìm và gán người dùng"
                        },
                        remove: {
                            label: "Đang xóa người dùng",
                            placeholder: "Khôi phục người dùng"
                        }
                    },
                    placeholders: {
                        emptyPlaceholder: {
                            action: "Gán người dùng",
                            subtitles: {
                                0: "Hiện tại không có người dùng nào được gán cho vai trò này."
                            },
                            title: "Không có người dùng nào được gán cho vai trò."
                        },
                        errorPlaceholder: {
                            action: "Làm mới",
                            subtitles: {
                                0: "Đã xảy ra lỗi khi lấy người dùng được gán cho vai trò này.",
                                1: "Vui lòng thử lại."
                            },
                            title: "Đã xảy ra lỗi"
                        }
                    },
                    notifications: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi cập nhật người dùng được gán cho vai trò."
                        },
                        success: {
                            message: "Cập nhật vai trò thành công",
                            description: "Người dùng được gán cho vai trò đã được cập nhật thành công."
                        },
                        genericError: {
                            message: "Đã xảy ra lỗi",
                            description: "Chúng tôi không thể cập nhật người dùng được gán cho vai trò."
                        },
                        fetchError: {
                            message: "Đã xảy ra lỗi",
                            description: "Chúng tôi không thể lấy người dùng được gán cho vai trò."
                        }
                    },
                    list: {
                        emptyPlaceholder: {
                            action: "Gán người dùng",
                            subtitles: "Hiện tại không có người dùng nào được gán cho {{type}}.",
                            title: "Không có người dùng nào được gán"
                        },
                        user: "Người dùng",
                        organization: "Được quản lý bởi"
                    }
                },
                permissions: {
                    heading: "Quyền được gán",
                    readOnlySubHeading: "Xem các quyền được gán của vai trò.",
                    removedPermissions: "Quyền đã xóa",
                    subHeading: "Quản lý các quyền được gán trong vai trò."
                }
            },
            list: {
                buttons: {
                    addButton: "{{type}} mới",
                    filterDropdown: "Lọc theo"
                },
                columns: {
                    actions: "Hành động",
                    audience: "Đối tượng",
                    lastModified: "Thời gian sửa đổi",
                    managedByApp: {
                        label: "Chỉ có thể được sử dụng trong ứng dụng: ",
                        header: "Được quản lý bởi"
                    },
                    managedByOrg: {
                        label: "Có thể được sử dụng trong tổ chức: ",
                        header: "Được quản lý bởi"
                    },
                    name: "Vai trò"
                },
                confirmations: {
                    deleteItem: {
                        assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                        content: "Nếu bạn xóa {{type}} này, các quyền gắn với nó sẽ " +
                            "bị xóa và những người dùng gắn với nó sẽ không còn có thể thực hiện " +
                            "các hành động mong muốn mà trước đây đã được phép. Vui lòng tiếp tục một cách thận trọng.",
                        header: "Bạn có chắc không?",
                        message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn {{type}} đã chọn"
                    },
                    deleteItemError: {
                        content: "Hãy xóa các liên kết khỏi ứng dụng sau trước khi xóa:",
                        header: "Không thể xóa",
                        message: "Có một ứng dụng đang sử dụng vai trò này."
                    }
                },
                emptyPlaceholders: {
                    emptyRoleList: {
                        action: "{{type}} mới",
                        emptyRoles: "Không tìm thấy {{type}} nào",
                        subtitles: {
                            0: "Hiện tại không có {{type}} nào khả dụng.",
                            1: "Bạn có thể thêm {{type}} mới một cách dễ dàng bằng cách làm theo",
                            2: "các bước trong trình hướng dẫn tạo {{type}}."
                        },
                        title: "Thêm một {{type}} mới"
                    },
                    search: {
                        action: "Xóa truy vấn tìm kiếm",
                        subtitles: {
                            0: "Chúng tôi không thể tìm thấy kết quả nào cho {{searchQuery}}",
                            1: "Vui lòng thử một từ khóa tìm kiếm khác."
                        },
                        title: "Không tìm thấy kết quả"
                    }
                },
                popups: {
                    delete: "Xóa {{type}}",
                    edit: "Chỉnh sửa {{type}}"
                },
                filterOptions: {
                    all: "Hiển thị tất cả",
                    applicationRoles: "Vai trò ứng dụng",
                    organizationRoles: "Vai trò tổ chức"
                },
                filterAttirbutes: {
                    name: "Tên",
                    audience: "Đối tượng vai trò"
                }
            },
            readOnlyList: {
                emptyPlaceholders: {
                    searchAndFilter: {
                        subtitles: {
                            0: "Chúng tôi không thể tìm thấy kết quả nào cho tổ hợp tên vai trò và đối tượng đã chỉ định.",
                            1: "Vui lòng thử một tổ hợp khác."
                        },
                        title: "Không tìm thấy kết quả"
                    }
                }
            },
            notifications: {
                createPermission: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi thêm quyền cho vai trò."
                    },
                    genericError: {
                        description: "Không thể thêm quyền cho vai trò.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Quyền đã được thêm thành công cho vai trò.",
                        message: "Tạo vai trò thành công."
                    }
                },
                createRole: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi tạo vai trò."
                    },
                    genericError: {
                        description: "Không thể tạo vai trò.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Vai trò đã được tạo thành công.",
                        message: "Tạo vai trò thành công."
                    }
                },
                deleteRole: {
                    error: {
                        description: "{{description}}",
                        message: "Không thể xóa vai trò đã chọn."
                    },
                    genericError: {
                        description: "Không thể xóa vai trò đã chọn.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Vai trò đã chọn đã được xóa thành công.",
                        message: "Xóa vai trò thành công"
                    }
                },
                fetchRoles: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy danh sách vai trò.",
                        message: "Đã xảy ra lỗi"
                    }
                },
                fetchRole: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy vai trò.",
                        message: "Đã xảy ra lỗi"
                    }
                },
                updateRole: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi cập nhật vai trò đã chọn."
                    },
                    genericError: {
                        description: "Không thể cập nhật vai trò đã chọn.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Vai trò đã chọn đã được cập nhật thành công.",
                        message: "Cập nhật vai trò thành công"
                    }
                }
            }
        },
        serverConfigs: {
            adminAdvisory: {
                configurationEditSection: {
                    backButtonLabel: "Quay lại Banner tư vấn quản trị",
                    pageHeading: "Banner tư vấn quản trị",
                    pageSubheading: "Cấu hình và tùy chỉnh banner tư vấn quản trị hiển thị trên trang đăng nhập.",
                    form: {
                        bannerContent: {
                            label: "Nội dung banner",
                            hint: "Đây là nội dung sẽ được hiển thị trong banner trên trang đăng nhập.",
                            placeholder: "Cảnh báo - nghiêm cấm sử dụng trái phép công cụ này."
                        }
                    }
                },
                configurationSection: {
                    disabled: "Đã vô hiệu hóa",
                    description: "Bật và cấu hình banner tư vấn quản trị.",
                    enabled: "Đã bật",
                    heading: "Banner tư vấn quản trị"
                },
                notifications: {
                    disbleAdminAdvisoryBanner: {
                        error: {
                            description: "{{ description }}",
                            message: "Lỗi khi vô hiệu hóa banner tư vấn quản trị."
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi vô hiệu hóa banner tư vấn quản trị.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Đã vô hiệu hóa banner tư vấn quản trị thành công.",
                            message: "Đã vô hiệu hóa banner tư vấn quản trị"
                        }
                    },
                    enableAdminAdvisoryBanner: {
                        error: {
                            description: "{{ description }}",
                            message: "Lỗi khi bật banner tư vấn quản trị."
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi bật banner tư vấn quản trị.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Đã bật banner tư vấn quản trị thành công.",
                            message: "Đã bật banner tư vấn quản trị"
                        }
                    },
                    getConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Lỗi khi lấy cấu hình banner tư vấn quản trị."
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy cấu hình banner tư vấn quản trị.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    updateConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Lỗi khi cập nhật cấu hình banner tư vấn quản trị."
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cập nhật cấu hình banner tư vấn quản trị.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Đã cập nhật cấu hình banner tư vấn quản trị thành công.",
                            message: "Cập nhật banner thành công"
                        }
                    }
                },
                pageHeading: "Banner tư vấn quản trị",
                pageSubheading: "Cấu hình banner tư vấn quản trị hiển thị trên trang đăng nhập."
            },
            remoteLogPublishing: {
                title: "Xuất bản log từ xa",
                pageTitle: "Xuất bản log từ xa",
                description: "Cấu hình cài đặt ghi log từ xa cho các log trong tổ chức.",
                descriptionWithLogType: "Cấu hình cài đặt ghi log từ xa cho " +
                    "log {{logType}} trong tổ chức.",
                backButtonText: "Quay lại",
                testButtonText: "Kiểm tra",
                logTypes: {
                    audit: {
                        name: "Log kiểm toán",
                        description: "Cấu hình xuất bản Log kiểm toán"
                    },
                    diagnostics: {
                        name: "Log chẩn đoán",
                        description: "Cấu hình xuất bản Log chẩn đoán"
                    }
                },
                fields: {
                    logTypes: {
                        label: "Các loại log sẽ được xuất bản",
                        values: {
                            carbonLogs: "Log Carbon",
                            auditLogs: "Log kiểm toán",
                            allLogs: "Tất cả log"
                        }
                    },
                    remoteURL: {
                        label: "URL đích",
                        placeholder: "https://yourdomain.com",
                        error: {
                            required: "Cần có URL endpoint ghi log từ xa",
                            invalid: "Vui lòng nhập một URL hợp lệ"
                        }
                    },
                    publishInterval: {
                        label: "Khoảng thời gian xuất bản log (phút)",
                        placeholder: "15",
                        error: {
                            required: "Cần có khoảng thời gian xuất bản log",
                            invalid: "Khoảng thời gian xuất bản không được nhỏ hơn 15 phút"
                        }
                    },
                    advanced: {
                        title: "Cài đặt nâng cao",
                        connectionTimeout: {
                            label: "Thời gian chờ kết nối (ms)",
                            placeholder: "1000",
                            error: {
                                invalid: "Khoảng thời gian xuất bản phải trong khoảng 1000 đến 60000"
                            }
                        },
                        verifyHostname: {
                            label: "Xác minh tên máy chủ",
                            hint: "Bật xác minh tên máy chủ của máy chủ từ xa với chứng chỉ SSL của nó."
                        },
                        basicAuthConfig: {
                            title: "Cấu hình xác thực",
                            info: {
                                message: "Nếu bạn đang thay đổi xác thực, hãy lưu ý rằng các secret xác thực" +
                                " của máy chủ từ xa cần được cập nhật.",
                                title: {
                                    noneAuthType: "Chưa cấu hình xác thực nào.",
                                    otherAuthType: "Đã cấu hình cơ chế xác thực <strong>{{ authType }}</strong>."
                                }
                            },
                            types: {
                                none: {
                                    name: "Không có"
                                },
                                basic: {
                                    name: "Cơ bản"
                                }
                            },
                            authenticationType: {
                                hint: {
                                    create: "Sau khi thêm, secret này sẽ không được hiển thị. Bạn chỉ có thể cập nhật chúng.",
                                    update: "Sau khi cập nhật, secret này sẽ không được hiển thị. Bạn chỉ có thể cập nhật chúng."
                                },
                                label: "Cơ chế xác thực",
                                placeholder: "Chọn cơ chế xác thực"
                            },
                            buttons: {
                                changeAuthentication: "Thay đổi xác thực"
                            },
                            serverUsername: {
                                label: "Tên đăng nhập máy chủ từ xa",
                                placeholder: "tên đăng nhập",
                                error: {
                                    required: "Cần có tên đăng nhập máy chủ từ xa"
                                }
                            },
                            serverPassword: {
                                label: "Mật khẩu máy chủ từ xa",
                                placeholder: "*****",
                                error: {
                                    required: "Cần có mật khẩu máy chủ từ xa"
                                }
                            }
                        },
                        sslConfig: {
                            title: "Cấu hình SSL",
                            info: {
                                sslConfigured: {
                                    message: "Các kết nối sẽ được bảo mật bằng SSL",
                                    title: "SSL đã được cấu hình"
                                },
                                notConfigured: {
                                    message: "SSL hiện chưa được cấu hình. Vui lòng thiết lập để bảo mật các kết nối của bạn.",
                                    title: "SSL chưa được cấu hình"
                                }
                            },
                            buttons: {
                                addSslConfig: "Thêm cấu hình SSL",
                                changeSslConfig: "Cập nhật cấu hình SSL",
                                clearSslConfig: "Xóa cấu hình SSL"
                            },
                            keystorePath: {
                                label: "Vị trí keystore",
                                placeholder: "Đường dẫn đến tệp keystore",
                                error: {
                                    required: "Cần có vị trí keystore"
                                }
                            },
                            keystorePassword: {
                                label: "Mật khẩu keystore",
                                placeholder: "*****",
                                error: {
                                    required: "Cần có mật khẩu keystore"
                                }
                            },
                            truststorePath: {
                                label: "Vị trí truststore",
                                placeholder: "Đường dẫn đến tệp truststore",
                                error: {
                                    required: "Cần có vị trí truststore"
                                }
                            },
                            truststorePassword: {
                                label: "Mật khẩu truststore",
                                placeholder: "*****",
                                error: {
                                    required: "Cần có mật khẩu truststore"
                                }
                            }
                        }
                    }
                },
                dangerZone: {
                    button: "Khôi phục",
                    title: "Khôi phục cấu hình mặc định",
                    header: "Khôi phục cấu hình mặc định",
                    subheader: "Thao tác này sẽ xóa cấu hình hiện có cho log {{logType}}. Vui lòng chắc chắn trước khi tiếp tục.",
                    confirmation: {
                        hint: "Vui lòng xác nhận thao tác của bạn.",
                        header: "Bạn có chắc không?",
                        message: "Nếu bạn khôi phục cấu hình mặc định, việc xuất bản log từ xa cho log {{logType}} có thể không hoạt động đúng. " +
                        "Vui lòng tiếp tục một cách thận trọng.",
                        content: "Thao tác này sẽ khôi phục cấu hình xuất bản log mặc định cho log {{logType}}."
                    }
                },
                notification: {
                    success: {
                        description: "Cập nhật cấu hình xuất bản log từ xa thành công.",
                        message: "Cập nhật thành công."
                    },
                    error: {
                        updateError: {
                            description: "Đã xảy ra lỗi khi cập nhật cấu hình xuất bản log từ xa.",
                            message: "Đã xảy ra lỗi"
                        },
                        fetchError: {
                            description: "Đã xảy ra lỗi khi lấy cấu hình xuất bản log từ xa.",
                            message: "Không thể lấy cấu hình xuất bản log từ xa."
                        }
                    }
                }
            },
            realmConfiguration: {
                actionTitles: {
                    config: "Thêm"
                },
                confirmation: {
                    heading: "Xác nhận",
                    message: "Bạn có muốn lưu các cấu hình liên quan đến realm không?"
                },
                description: "Cấu hình các cài đặt cơ bản liên quan đến realm.",
                form: {
                    homeRealmIdentifiers: {
                        hint: "Nhập định danh home realm. Cho phép nhiều định danh.",
                        label: "Các định danh home realm",
                        placeholder: "localhost"
                    },
                    idleSessionTimeoutPeriod: {
                        hint: "Nhập thời gian chờ phiên không hoạt động tính bằng phút",
                        label: "Thời gian chờ phiên không hoạt động"
                    },
                    rememberMePeriod: {
                        hint: "Nhập khoảng thời gian ghi nhớ đăng nhập tính bằng phút",
                        label: "Khoảng thời gian ghi nhớ đăng nhập"
                    }
                },
                heading: "Cấu hình realm",
                notifications: {
                    emptyHomeRealmIdentifiers: {
                        error: {
                            description: "Bạn phải khai báo ít nhất một định danh home realm.",
                            message: "Lỗi xác thực dữ liệu"
                        },
                        genericError: {
                            description: "",
                            message: ""
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Lỗi lấy dữ liệu"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy cấu hình realm.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    updateConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Lỗi cập nhật"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cập nhật cấu hình realm.",
                            message: "Lỗi cập nhật"
                        },
                        success: {
                            description: "Đã cập nhật cấu hình realm thành công.",
                            message: "Cập nhật thành công"
                        }
                    }
                }
            },
            server: {
                title: "Máy chủ",
                description: "Cấu hình cài đặt máy chủ."
            }
        },
        sidePanel: {
            accountManagement: "Quản lý tài khoản",
            addEmailTemplate: "Thêm template email",
            addEmailTemplateLocale: "Thêm ngôn ngữ template email",
            approvals: "Phê duyệt",
            approvalWorkflows: "Quy trình phê duyệt",
            attributeDialects: "Thuộc tính",
            categories: {
                attributes: "Thuộc tính người dùng",
                certificates: "Chứng chỉ",
                configurations: "Cấu hình",
                general: "Chung",
                organizations: "Quản lý tổ chức",
                users: "Người dùng",
                userstores: "Kho người dùng"
            },
            certificates: "Chứng chỉ",
            configurations: "Cấu hình",
            createApprovalWorkflows: "Tạo quy trình phê duyệt",
            editEmailTemplate: "Template email",
            editExternalDialect: "Chỉnh sửa Attribute Mapping",
            editGroups: "Chỉnh sửa nhóm",
            editLocalClaims: "Chỉnh sửa thuộc tính",
            editRoles: "Chỉnh sửa vai trò",
            editUsers: "Chỉnh sửa người dùng",
            editApprovalWorkflow: "Chỉnh sửa quy trình phê duyệt",
            editUserstore: "Chỉnh sửa kho người dùng",
            emailDomainDiscovery: "Khám phá miền email",
            emailTemplateTypes: "",
            emailTemplates: "Template email",
            generalConfigurations: "Chung",
            groups: "Nhóm",
            localDialect: "Thuộc tính",
            loginAttemptsSecurity: "Bảo mật lần đăng nhập",
            multiFactorAuthenticators: "Phương thức xác thực đa yếu tố",
            organizations: "Tổ chức",
            otherSettings: "Cài đặt khác",
            overview: "Tổng quan",
            passwordPolicies: "Chính sách mật khẩu",
            remoteFetchConfig: "Cấu hình từ xa",
            roles: "Vai trò",
            userOnboarding: "Onboarding người dùng",
            users: "Người dùng",
            userstoreTemplates: "Template kho người dùng",
            userstores: "Kho người dùng"
        },
        transferList: {
            list: {
                emptyPlaceholders: {
                    default: "Hiện tại không có mục nào trong danh sách này.",
                    groups: {
                        selected: "Không có {{type}} nào được gán cho nhóm này.",
                        unselected: "Không có {{type}} nào khả dụng để gán cho nhóm này.",
                        common: "Không tìm thấy {{type}} nào"
                    },
                    roles: {
                        selected: "Không có {{type}} nào được gán với vai trò này.",
                        unselected: "Không có {{type}} nào khả dụng để gán cho nhóm này.",
                        common: "Không tìm thấy {{type}} nào"
                    },
                    users: {
                        roles: {
                            selected: "Không có {{type}} nào được gán cho người dùng này.",
                            unselected: "Không có {{type}} nào khả dụng để gán cho người dùng này."
                        }
                    }
                },
                headers: {
                    0: "Miền",
                    1: "Tên",
                    2: "Đối tượng"
                }
            },
            searchPlaceholder: "Tìm kiếm {{type}}"
        },
        user: {
            deleteJITUser: {
                confirmationModal: {
                    content: "Nếu bạn xóa người dùng này, người dùng sẽ không thể đăng nhập vào My Account hoặc bất kỳ " +
                        "ứng dụng nào khác mà người dùng đã đăng ký cho đến lần tiếp theo người dùng " +
                        "đăng nhập bằng tùy chọn đăng nhập mạng xã hội."
                }
            },
            deleteUser: {
                confirmationModal: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Nếu bạn xóa người dùng này, người dùng sẽ không thể đăng nhập vào My Account hoặc " +
                        "bất kỳ ứng dụng nào khác mà người dùng đã đăng ký trước đó. Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn người dùng."
                }
            },
            disableUser: {
                confirmationModal: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Nếu bạn vô hiệu hóa người dùng này, người dùng sẽ không thể đăng nhập vào My Account hoặc " +
                        "bất kỳ ứng dụng nào khác mà người dùng đã đăng ký trước đó.",
                    header: "Bạn có chắc không?",
                    message: "Hãy đảm bảo rằng người dùng không còn cần quyền truy cập vào hệ thống."
                }
            },
            editUser: {
                dateOfBirth: {
                    placeholder: {
                        part1:"Nhập",
                        part2: "theo định dạng YYYY-MM-DD"
                    }
                }
            },
            forms: {
                addUserForm: {
                    buttons: {
                        radioButton: {
                            label: "Chọn phương thức đặt mật khẩu người dùng",
                            options: {
                                askPassword: "Mời người dùng tự đặt mật khẩu",
                                createPassword: "Đặt mật khẩu cho người dùng"

                            }
                        }
                    },
                    inputs: {
                        confirmPassword: {
                            label: "Xác nhận mật khẩu",
                            placeholder: "Nhập mật khẩu mới",
                            validations: {
                                empty: "Xác nhận mật khẩu là trường bắt buộc",
                                mismatch: "Mật khẩu xác nhận không khớp"
                            }
                        },
                        domain: {
                            label: "Kho người dùng",
                            placeholder: "Chọn kho người dùng",
                            validations: {
                                empty: "Tên kho người dùng không được để trống."
                            }
                        },
                        email: {
                            label: "Địa chỉ email",
                            placeholder: "Nhập địa chỉ email",
                            validations: {
                                empty: "Địa chỉ email không được để trống",
                                invalid: "Vui lòng nhập một địa chỉ email hợp lệ. Bạn có thể sử dụng ký tự " +
                                    "chữ và số, ký tự unicode, dấu gạch dưới (_), dấu gạch ngang (-), dấu chấm (.), " +
                                    "và ký tự a còng (@)."
                            }
                        },
                        firstName: {
                            label: "Tên",
                            placeholder: "Nhập tên",
                            validations: {
                                empty: "Tên là trường bắt buộc"
                            }
                        },
                        lastName: {
                            label: "Họ",
                            placeholder: "Nhập họ",
                            validations: {
                                empty: "Họ là trường bắt buộc"
                            }
                        },
                        newPassword: {
                            label: "Mật khẩu",
                            placeholder: "Nhập mật khẩu",
                            validations: {
                                empty: "Mật khẩu là trường bắt buộc",
                                regExViolation: "Vui lòng nhập một mật khẩu hợp lệ"
                            }
                        },
                        username: {
                            label: "Tên đăng nhập",
                            placeholder: "Nhập tên đăng nhập",
                            validations: {
                                empty: "Tên đăng nhập là trường bắt buộc",
                                invalid: "Đã tồn tại một người dùng với tên đăng nhập này.",
                                invalidCharacters: "Tên đăng nhập có vẻ chứa ký tự không hợp lệ.",
                                regExViolation: "Vui lòng nhập một tên đăng nhập hợp lệ."
                            }
                        }
                    },
                    validations: {
                        genericError: {
                            description: "Đã xảy ra lỗi. Vui lòng thử lại",
                            message: "Lỗi đổi mật khẩu"
                        },
                        invalidCurrentPassword: {
                            description: "Mật khẩu hiện tại bạn nhập có vẻ không hợp lệ. Vui lòng thử lại",
                            message: "Lỗi đổi mật khẩu"
                        },
                        submitError: {
                            description: "{{description}}",
                            message: "Lỗi đổi mật khẩu"
                        },
                        submitSuccess: {
                            description: "Mật khẩu đã được đổi thành công.",
                            message: "Đặt lại mật khẩu thành công"
                        }
                    }
                }
            },
            lockUser: {
                confirmationModal: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Nếu bạn khóa tài khoản này, người dùng sẽ không thể đăng nhập vào " +
                        "bất kỳ ứng dụng doanh nghiệp nào. Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này khóa tài khoản người dùng."
                }
            },
            modals: {
                addUserWarnModal: {
                    heading: "Cảnh báo",
                    message: "Xin lưu ý rằng người dùng được tạo này sẽ không được gán vai trò. Nếu bạn " +
                        "muốn gán vai trò cho người dùng này, vui lòng nhấn vào nút bên dưới."
                },
                addUserWizard: {
                    askPassword: {
                        alphanumericUsernameEnabled: "Để mời người dùng đặt mật khẩu, hãy tắt " +
                            "tính năng tên đăng nhập chữ và số.",
                        emailInvalid: "Để mời người dùng đặt mật khẩu, vui lòng nhập một địa chỉ email hợp lệ.",
                        emailVerificationDisabled: "Để mời người dùng đặt mật khẩu, hãy bật lời mời qua email để thiết lập mật khẩu người dùng từ <1>Cài đặt đăng nhập & đăng ký</1>.",
                        mobileNumberAlreadyExists: "Số điện thoại là bắt buộc cho SMS OTP, vui lòng bật thuộc tính số điện thoại từ <1>Thuộc tính</1>.",
                        inviteOffline: "Mời ngoại tuyến",
                        inviteViaEmail: "Mời qua email",
                        inviteViaSMS: "Mời qua SMS"
                    },
                    buttons: {
                        next: "Tiếp theo",
                        previous: "Trước",
                        saveAndContinue: "Lưu & Tiếp tục"
                    },
                    steps: {
                        basicDetails: "Chi tiết cơ bản",
                        groups: "Nhóm người dùng",
                        roles: "Vai trò người dùng",
                        invitation: "Lời mời",
                        method: "Phương thức"
                    },
                    subTitle: "Thực hiện theo các bước để tạo người dùng mới",
                    title: "Tạo người dùng",
                    wizardSummary: {
                        domain: "Kho người dùng",
                        groups: "Nhóm",
                        name: "Tên",
                        passwordOption: {
                            label: "Tùy chọn mật khẩu",
                            message: {
                                0: "Một email sẽ được gửi đến {{email}} kèm liên kết để đặt mật khẩu.",
                                1: "Mật khẩu đã được quản trị viên đặt."
                            }
                        },
                        roles: "Vai trò",
                        username: "Tên đăng nhập"
                    }
                },
                bulkImportUserWizard: {
                    title: "Thêm nhiều người dùng",
                    subTitle: "Thêm nhiều người dùng thủ công hoặc bằng tệp CSV.",
                    wizardSummary: {
                        inviteEmailInfo: "Một email kèm liên kết xác nhận sẽ được gửi đến địa chỉ email đã cung cấp để người dùng tự đặt mật khẩu.",
                        successCount: "Nhập thành công",
                        failedCount: "Nhập thất bại",
                        totalUserCreationCount: "Tổng số người dùng đã tạo",
                        totalUserAssignmentCount: "Tổng số lượt gán nhóm ",
                        tableHeaders: {
                            username: "Tên đăng nhập",
                            status: "Trạng thái",
                            message: "Thông báo"
                        },
                        tableMessages: {
                            userCreatedMessage: "Nhập người dùng thành công",
                            invalidDataMessage: "Dữ liệu cung cấp không hợp lệ",
                            invalidUserNameFormatMessage: "Tên đăng nhập không khớp với định dạng đã chỉ định",
                            userAlreadyExistsMessage: "Người dùng đã tồn tại",
                            userCreationAcceptedMessage: "Đã chấp nhận tạo người dùng",
                            internalErrorMessage: "Đã xảy ra lỗi khi nhập người dùng",
                            userAssignmentSuccessMessage: "Người dùng đã được gán thành công vào {{resource}}",
                            userAssignmentFailedMessage: "Gán người dùng vào {{resource}} thất bại",
                            userAssignmentInternalErrorMessage: "Đã xảy ra lỗi khi gán người dùng vào " +
                                "{{resource}}"
                        },
                        tableStatus: {
                            success: "Thành công",
                            warning: "Cảnh báo",
                            failed: "Thất bại"
                        },
                        alerts: {
                            importSuccess: {
                                description: "Các tài khoản người dùng đã được nhập thành công.",
                                message: "Nhập thành công"
                            },
                            importFailed: {
                                userCreation: "Gặp vấn đề trong <1>{{failedUserCreationCount}} thao tác tạo " +
                                    "người dùng</1>",
                                groupAssignment: "Gặp vấn đề trong <1>{{failedUserAssignmentCount}} thao tác gán " +
                                    "nhóm</1>. Người dùng trong các nhóm bị ảnh hưởng đã được tạo nhưng chưa được gán. " +
                                    "Vui lòng điều hướng đến phần Quản lý người dùng để xem xét và gán nhóm cho " +
                                    "người dùng.",
                                message: "Cần xem xét"
                            }
                        },
                        advanceSearch: {
                            searchByUsername: "Tìm kiếm theo tên đăng nhập",
                            searchByGroup: "Tìm kiếm theo nhóm",
                            roleGroupFilterAttributePlaceHolder: "Tên nhóm"
                        },
                        manualCreation: {
                            alerts: {
                                creationSuccess: {
                                    description: "Các tài khoản người dùng đã được tạo thành công.",
                                    message: "Tạo người dùng thành công"
                                }
                            },
                            hint: "Thêm địa chỉ email của người dùng bạn muốn mời và nhấn enter.",
                            emailsLabel: "Email",
                            emailsPlaceholder: "Nhập địa chỉ email",
                            disabledHint: "Tùy chọn thủ công bị vô hiệu hóa do việc sử dụng tên đăng nhập chữ và số trong tổ chức của bạn.",
                            upload: {
                                buttonText: "Tải lên tệp CSV",
                                description: "Kéo và thả tệp CSV vào đây."
                            },
                            primaryButton: "Thêm",
                            groupsLabel: "Nhóm",
                            groupsPlaceholder: "Nhập nhóm",
                            warningMessage: "Tùy chọn này chỉ có thể được sử dụng khi địa chỉ email được cấu hình " +
                                "làm tên đăng nhập."
                        },
                        fileBased: {
                            hint: "Mời hàng loạt nhiều người dùng bằng tệp CSV."
                        },
                        responseOperationType: {
                            userCreation: "Tạo người dùng",
                            roleAssignment: "Gán nhóm"
                        },
                        userstoreMessage: "Những người dùng được tạo sẽ được thêm vào kho người dùng <1>{{ userstore }}</1>."
                    },
                    buttons: {
                        import: "Nhập"
                    },
                    sidePanel: {
                        manual: "Thủ công",
                        fileBased: "Dựa trên tệp",
                        fileFormatTitle: "Định dạng tệp CSV",
                        fileFormatContent: "Tiêu đề của tệp CSV phải là các thuộc tính người dùng được " +
                                "ánh xạ tới <1>thuộc tính cục bộ</1>.",
                        fileFormatSampleHeading: "Định dạng tệp CSV mẫu:"
                    }
                },
                inviteParentUserWizard: {
                    totalInvitations: "Tổng số lời mời",
                    successAlert: {
                        description: "Đã mời (các) người dùng thành công.",
                        message: "Đã gửi lời mời"
                    },
                    errorAlert: {
                        description: "Đã xảy ra lỗi khi mời {{ failedCount }} người dùng.",
                        message: "Cần xem xét"
                    },
                    tableMessages: {
                        userNotFound: "Không tìm thấy người dùng",
                        activeInvitationExists: "Đã tồn tại một lời mời đang hoạt động cho người dùng",
                        userEmailNotFound: "Không thể tìm thấy email của người dùng được mời",
                        userAlreadyExist: "Người dùng đã tồn tại"
                    }
                },
                changePasswordModal: {
                    button: "Đặt lại mật khẩu",
                    header: "Đặt lại mật khẩu người dùng",
                    hint: {
                        forceReset: "CẢNH BÁO: Xin lưu ý rằng sau khi mời người dùng đổi mật khẩu, " +
                            "người dùng sẽ không còn có thể đăng nhập vào bất kỳ ứng dụng nào bằng mật khẩu " +
                            "hiện tại. Liên kết đặt lại mật khẩu sẽ có hiệu lực trong {{codeValidityPeriod}} phút.",
                        setPassword: "CẢNH BÁO: Xin lưu ý rằng sau khi đổi mật khẩu, người dùng sẽ " +
                            "không còn có thể đăng nhập vào bất kỳ ứng dụng nào bằng mật khẩu hiện tại."
                    },
                    message: "CẢNH BÁO: Xin lưu ý rằng sau khi đổi mật khẩu, người dùng sẽ không còn " +
                        "có thể đăng nhập vào bất kỳ ứng dụng nào bằng mật khẩu hiện tại.",
                    passwordOptions: {
                        forceReset: "Mời người dùng đặt lại mật khẩu",
                        setPassword: "Đặt mật khẩu mới cho người dùng"
                    }
                }
            },
            profile: {
                fields: {
                    createdDate: "Ngày tạo",
                    emails: "Email",
                    generic: {
                        default: "Thêm {{fieldName}}"
                    },
                    modifiedDate: "Ngày sửa đổi",
                    name_familyName: "Họ",
                    name_givenName: "Tên",
                    oneTimePassword: "Mật khẩu dùng một lần",
                    phoneNumbers: "Số điện thoại",
                    photos: "Ảnh",
                    profileUrl: "URL",
                    userId: "ID người dùng",
                    userName: "Tên đăng nhập"
                },
                forms: {
                    emailChangeForm: {
                        inputs: {
                            email: {
                                label: "Email",
                                note: "LƯU Ý: Thao tác này sẽ thay đổi địa chỉ email trong hồ sơ của bạn",
                                placeholder: "Nhập địa chỉ email của bạn",
                                validations: {
                                    empty: "Địa chỉ email là trường bắt buộc",
                                    invalidFormat: "Địa chỉ email không đúng định dạng"
                                }
                            }
                        }
                    },
                    generic: {
                        inputs: {
                            placeholder: "Nhập {{fieldName}} của bạn",
                            dropdownPlaceholder: "Chọn {{fieldName}} của bạn",
                            validations: {
                                empty: "{{fieldName}} là trường bắt buộc",
                                invalidFormat: "{{fieldName}} không đúng định dạng"
                            }
                        }
                    },
                    mobileChangeForm: {
                        inputs: {
                            mobile: {
                                label: "Số điện thoại",
                                note: "LƯU Ý: Thao tác này sẽ thay đổi số điện thoại trong hồ sơ của bạn",
                                placeholder: "Nhập số điện thoại của bạn",
                                validations: {
                                    empty: "Số điện thoại là trường bắt buộc",
                                    invalidFormat: "Số điện thoại không đúng định dạng"
                                }
                            }
                        }
                    },
                    nameChangeForm: {
                        inputs: {
                            firstName: {
                                label: "Tên",
                                placeholder: "Nhập tên",
                                validations: {
                                    empty: "Tên là trường bắt buộc"
                                }
                            },
                            lastName: {
                                label: "Họ",
                                placeholder: "Nhập họ",
                                validations: {
                                    empty: "Họ là trường bắt buộc"
                                }
                            }
                        }
                    },
                    organizationChangeForm: {
                        inputs: {
                            organization: {
                                label: "Tổ chức",
                                placeholder: "Nhập tổ chức của bạn",
                                validations: {
                                    empty: "Tổ chức là trường bắt buộc"
                                }
                            }
                        }
                    }
                },
                notifications: {
                    changeUserPassword: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi đổi mật khẩu người dùng."
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi đổi mật khẩu người dùng.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Mật khẩu của người dùng đã được đổi thành công.",
                            message: "Đổi mật khẩu thành công"
                        }
                    },
                    disableUserAccount: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi vô hiệu hóa tài khoản người dùng."
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi vô hiệu hóa tài khoản người dùng.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Tài khoản người dùng đã được vô hiệu hóa thành công.",
                            genericMessage: "Tài khoản đã bị vô hiệu hóa",
                            message: "Tài khoản của {{name}} đã bị vô hiệu hóa"
                        }
                    },
                    enableUserAccount: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi bật tài khoản người dùng."
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi bật tài khoản người dùng.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Tài khoản người dùng đã được bật thành công.",
                            genericMessage: "Tài khoản đã được bật",
                            message: "Tài khoản của {{name}} đã được bật"
                        }
                    },
                    forcePasswordReset: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi kích hoạt luồng đặt lại mật khẩu."
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi kích hoạt luồng đặt lại mật khẩu.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Đặt lại mật khẩu đã được khởi tạo thành công cho tài khoản người dùng.",
                            message: "Đã khởi tạo đặt lại mật khẩu"
                        }
                    },
                    getProfileInfo: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi lấy chi tiết hồ sơ"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy chi tiết hồ sơ.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Các chi tiết hồ sơ người dùng yêu cầu đã được lấy thành công.",
                            message: "Lấy hồ sơ người dùng thành công"
                        }
                    },
                    lockUserAccount: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi khóa tài khoản người dùng."
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi khóa tài khoản người dùng.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Tài khoản người dùng đã được khóa thành công.",
                            genericMessage: "Tài khoản đã bị khóa",
                            message: "Tài khoản của {{name}} đã bị khóa"
                        }
                    },
                    noPasswordResetOptions: {
                        error: {
                            description: "Không có tùy chọn buộc đặt lại mật khẩu nào được bật.",
                            message: "Không thể kích hoạt buộc đặt lại mật khẩu"
                        }
                    },
                    unlockUserAccount: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi mở khóa tài khoản người dùng."
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi mở khóa tài khoản người dùng.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Tài khoản người dùng đã được mở khóa thành công.",
                            genericMessage: "Tài khoản đã được mở khóa",
                            message: "Tài khoản của {{name}} đã được mở khóa"
                        }
                    },
                    updateProfileInfo: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi cập nhật chi tiết hồ sơ"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cập nhật chi tiết hồ sơ.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Các chi tiết hồ sơ người dùng yêu cầu đã được cập nhật thành công.",
                            message: "Cập nhật hồ sơ người dùng thành công"
                        }
                    }
                },
                placeholders: {
                    SCIMDisabled: {
                        heading: "Tính năng này không khả dụng cho tài khoản của bạn"
                    },
                    userProfile: {
                        emptyListPlaceholder: {
                            subtitles: "Thông tin hồ sơ không khả dụng cho người dùng này.",
                            title: "Không có thông tin hồ sơ"
                        }
                    }
                }
            },
            revokeAdmin: {
                confirmationModal: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Nếu bạn thu hồi quyền quản trị của người dùng này, người dùng sẽ không thể " +
                        "đăng nhập vào console Asgardeo và " +
                        "sẽ không thể thực hiện các tác vụ quản trị. Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này sẽ thu hồi quyền quản trị của người dùng."
                }
            },
            updateUser: {
                groups: {
                    addGroupsModal: {
                        heading: "Cập nhật nhóm người dùng",
                        subHeading: "Thêm nhóm mới hoặc xóa nhóm hiện có được gán cho người dùng."
                    },
                    editGroups: {
                        groupList: {
                            emptyListPlaceholder: {
                                subTitle: {
                                    0: "Hiện tại không có nhóm nào được gán cho người dùng.",
                                    1: "Điều này có thể hạn chế người dùng thực hiện một số",
                                    2: "tác vụ như truy cập một số ứng dụng."
                                },
                                title: "Không có nhóm nào được gán"
                            },
                            headers: {
                                0: "Miền",
                                1: "Tên"
                            }
                        },
                        heading: "Nhóm được gán",
                        popups: {
                            viewPermissions: "Xem quyền"
                        },
                        searchPlaceholder: "Tìm kiếm nhóm",
                        subHeading: "Thêm hoặc xóa các nhóm mà người dùng được gán và lưu ý rằng điều này sẽ " +
                            "ảnh hưởng đến việc thực hiện một số tác vụ."
                    },
                    notifications: {
                        addUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Đã xảy ra lỗi khi cập nhật nhóm người dùng"
                            },
                            genericError: {
                                description: "Đã xảy ra lỗi khi cập nhật nhóm người dùng.",
                                message: "Đã xảy ra lỗi"
                            },
                            success: {
                                description: "Gán nhóm mới cho người dùng thành công.",
                                message: "Cập nhật nhóm người dùng thành công"
                            }
                        },
                        fetchUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Đã xảy ra lỗi khi lấy danh sách nhóm"
                            },
                            genericError: {
                                description: "Đã xảy ra lỗi khi lấy danh sách nhóm.",
                                message: "Đã xảy ra lỗi"
                            },
                            success: {
                                description: "Danh sách nhóm đã được lấy thành công.",
                                message: "Lấy danh sách nhóm người dùng thành công"
                            }
                        },
                        removeUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Đã xảy ra lỗi khi cập nhật nhóm của người dùng"
                            },
                            genericError: {
                                description: "Đã xảy ra lỗi khi cập nhật nhóm người dùng.",
                                message: "Đã xảy ra lỗi"
                            },
                            success: {
                                description: "Xóa nhóm được gán cho người dùng thành công.",
                                message: "Cập nhật nhóm người dùng thành công"
                            }
                        },
                        updateUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Đã xảy ra lỗi khi cập nhật nhóm người dùng"
                            },
                            genericError: {
                                description: "Đã xảy ra lỗi khi cập nhật nhóm người dùng.",
                                message: "Đã xảy ra lỗi"
                            },
                            success: {
                                description: "Cập nhật nhóm được gán cho người dùng thành công.",
                                message: "Cập nhật nhóm người dùng thành công"
                            }
                        }
                    }
                },
                roles: {
                    addRolesModal: {
                        heading: "Cập nhật vai trò người dùng",
                        subHeading: "Thêm vai trò mới hoặc xóa vai trò hiện có được gán cho người dùng."
                    },
                    editRoles: {
                        confirmationModal: {
                            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                            content: "Việc sửa đổi vai trò sẽ khiến người dùng mất " +
                                "hoặc có thêm quyền truy cập vào một số tính năng. Vui lòng tiếp tục một cách thận trọng.",
                            header: "Bạn có chắc không?",
                            message: "Thao tác này sẽ sửa đổi vai trò của người dùng này."
                        },
                        infoMessage: "Các vai trò được kế thừa qua nhóm không được hiển thị tại đây.",
                        placeholders: {
                            emptyPlaceholder: {
                                title: "Không có vai trò nào được gán",
                                subtitles: "Hiện tại không có vai trò nào được gán cho người dùng."
                            }
                        },
                        heading: "Vai trò được gán",
                        popups: {
                            viewPermissions: "Xem quyền"
                        },
                        roleList: {
                            emptyListPlaceholder: {
                                subTitle: {
                                    0: "Hiện tại không có vai trò nào được gán cho người dùng.",
                                    1: "Điều này có thể hạn chế người dùng thực hiện một số",
                                    2: "tác vụ như truy cập một số ứng dụng."
                                },
                                title: "Không có vai trò nào được gán"
                            },
                            headers: {
                                0: "Miền",
                                1: "Tên"
                            }
                        },
                        searchPlaceholder: "Tìm kiếm vai trò",
                        subHeading: "Xem các vai trò được gán trực tiếp cho người dùng."
                    },
                    notifications: {
                        addUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Đã xảy ra lỗi khi cập nhật vai trò người dùng"
                            },
                            genericError: {
                                description: "Đã xảy ra lỗi khi cập nhật vai trò người dùng.",
                                message: "Đã xảy ra lỗi"
                            },
                            success: {
                                description: "Gán vai trò mới cho người dùng thành công.",
                                message: "Cập nhật vai trò người dùng thành công"
                            }
                        },
                        fetchUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Đã xảy ra lỗi khi lấy danh sách vai trò"
                            },
                            genericError: {
                                description: "Đã xảy ra lỗi khi lấy danh sách vai trò.",
                                message: "Đã xảy ra lỗi"
                            },
                            success: {
                                description: "Danh sách vai trò đã được lấy thành công.",
                                message: "Lấy danh sách vai trò người dùng thành công"
                            }
                        },
                        removeUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Đã xảy ra lỗi khi cập nhật vai trò của người dùng"
                            },
                            genericError: {
                                description: "Đã xảy ra lỗi khi cập nhật vai trò người dùng.",
                                message: "Đã xảy ra lỗi"
                            },
                            success: {
                                description: "Xóa vai trò được gán cho người dùng thành công.",
                                message: "Cập nhật vai trò người dùng thành công"
                            }
                        },
                        updateUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Đã xảy ra lỗi khi cập nhật vai trò của người dùng"
                            },
                            genericError: {
                                description: "Đã xảy ra lỗi khi cập nhật vai trò người dùng.",
                                message: "Đã xảy ra lỗi"
                            },
                            success: {
                                description: "Cập nhật vai trò được gán cho người dùng thành công.",
                                message: "Cập nhật vai trò người dùng thành công"
                            }
                        }
                    },
                    viewPermissionModal: {
                        backButton: "Quay lại danh sách",
                        editButton: "Chỉnh sửa quyền",
                        heading: "Quyền cho {{role}}"
                    }
                }
            }
        },
        users: {
            addUserType: {
                createUser: {
                    title: "Tạo người dùng",
                    description: "Tạo một người dùng trong tổ chức của bạn."
                },
                inviteParentUser: {
                    title: "Mời người dùng tổ chức cha",
                    description: "Mời người dùng từ tổ chức cha."
                }
            },
            advancedSearch: {
                form: {
                    dropdown: {
                        filterAttributeOptions: {
                            email: "Email",
                            username: "Tên đăng nhập"
                        }
                    },
                    inputs: {
                        filterAttribute: {
                            placeholder: "Ví dụ: Tên đăng nhập, Email, v.v."
                        },
                        filterCondition: {
                            placeholder: "Ví dụ: Starts with, v.v."
                        },
                        filterValue: {
                            placeholder: "Nhập giá trị để tìm kiếm"
                        }
                    }
                },
                placeholder: "Tìm kiếm theo tên đăng nhập"
            },
            all: {
                heading: "Người dùng",
                subHeading: "Thêm và quản lý tài khoản người dùng, gán vai trò cho người dùng và duy trì danh tính người dùng."
            },
            buttons: {
                addNewUserBtn: "Người dùng mới",
                assignUserRoleBtn: "Gán vai trò",
                metaColumnBtn: "Cột"
            },
            addUserDropDown: {
                addNewUser:  "Một người dùng",
                bulkImport: "Nhiều người dùng"
            },
            confirmations: {
                terminateAllSessions: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Nếu bạn tiếp tục thao tác này, người dùng sẽ bị đăng xuất khỏi tất cả các phiên " +
                        "đang hoạt động. Họ sẽ mất tiến trình của bất kỳ tác vụ nào đang thực hiện. Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác và sẽ kết thúc vĩnh viễn tất cả các phiên đang hoạt động."
                },
                terminateSession: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Nếu bạn tiếp tục thao tác này, người dùng sẽ bị đăng xuất khỏi phiên " +
                        "đã chọn. Họ sẽ mất tiến trình của bất kỳ tác vụ nào đang thực hiện. Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác và sẽ kết thúc vĩnh viễn phiên."
                },
                addMultipleUser: {
                    header: "Trước khi bạn tiếp tục",
                    message: "Tùy chọn mời người dùng bị vô hiệu hóa",
                    content: "Tùy chọn Mời người dùng đặt mật khẩu phải được bật để thêm nhiều người dùng. " +
                        "Vui lòng bật lời mời qua email để thiết lập mật khẩu người dùng từ cài đặt Đăng nhập & Đăng ký.",
                    assertionHint: "Vui lòng xác nhận thao tác của bạn."
                }
            },
            consumerUsers: {
                fields: {
                    username: {
                        label: "Tên đăng nhập",
                        placeholder: "Nhập tên đăng nhập",
                        validations: {
                            empty: "Tên đăng nhập là trường bắt buộc",
                            invalid: "Đã tồn tại một người dùng với tên đăng nhập này.",
                            invalidCharacters: "Tên đăng nhập có vẻ chứa ký tự không hợp lệ.",
                            regExViolation: "Vui lòng nhập một địa chỉ email hợp lệ."
                        }
                    }
                }
            },
            editUser: {
                tab: {
                    menuItems: {
                        0: "Hồ sơ",
                        1: "Nhóm",
                        2: "Vai trò",
                        3: "Phiên đang hoạt động"
                    }
                },
                placeholders: {
                    undefinedUser: {
                        action: "Quay lại danh sách người dùng",
                        subtitles: "Có vẻ như người dùng được yêu cầu không tồn tại.",
                        title: "Không tìm thấy người dùng"
                    }
                }
            },
            forms: {
                validation: {
                    dateFormatError: "Định dạng của {{field}} đã nhập không đúng. Định dạng hợp lệ là " +
                        "YYYY-MM-DD.",
                    formatError: "Định dạng của {{field}} đã nhập không đúng.",
                    futureDateError: "Ngày bạn nhập cho trường {{field}} không hợp lệ.",
                    mobileFormatError: "Định dạng của {{field}} đã nhập không đúng. Định dạng hợp lệ là " +
                        "[+][mã quốc gia][mã vùng][số điện thoại cục bộ]."
                }
            },
            guestUsers: {
                fields: {
                    username: {
                        label: "Tên đăng nhập",
                        placeholder: "Nhập tên đăng nhập",
                        validations: {
                            empty: "Tên đăng nhập là trường bắt buộc",
                            invalid: "Đã tồn tại một người dùng với tên đăng nhập này.",
                            invalidCharacters: "Tên đăng nhập có vẻ chứa ký tự không hợp lệ.",
                            regExViolation: "Vui lòng nhập một địa chỉ email hợp lệ."
                        }
                    }
                }
            },
            list: {
                columns: {
                    actions: "Hành động",
                    name: "Tên"
                }
            },
            notifications: {
                addUser: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi thêm người dùng mới"
                    },
                    genericError: {
                        description: "Không thể thêm người dùng mới",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Người dùng mới đã được thêm thành công.",
                        message: "Thêm người dùng thành công"
                    }
                },
                addUserPendingApproval: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi thêm người dùng mới"
                    },
                    genericError: {
                        description: "Không thể thêm người dùng mới",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Người dùng mới đã được chấp nhận và đang chờ phê duyệt.",
                        message: "Người dùng đã được chấp nhận để tạo"
                    }
                },
                bulkImportUser: {
                    validation: {
                        emptyRowError: {
                            description: "Tệp đã chọn không chứa dữ liệu.",
                            message: "Tệp trống"
                        },
                        columnMismatchError: {
                            description: "Một số hàng dữ liệu của tệp không khớp với số cột yêu cầu. " +
                                "Vui lòng xem xét và sửa lại dữ liệu.",
                            message: "Số cột không khớp"
                        },
                        emptyHeaderError: {
                            description: "Hãy đảm bảo rằng hàng đầu tiên chứa tiêu đề cho mỗi cột.",
                            message: "Thiếu tiêu đề cột"
                        },
                        missingRequiredHeaderError: {
                            description: "Các tiêu đề sau là bắt buộc nhưng bị thiếu trong tệp CSV: " +
                            "{{ headers }}.",
                            message: "Thiếu tiêu đề cột bắt buộc"
                        },
                        blockedHeaderError: {
                            description: "Các tiêu đề sau không được phép: {{headers}}.",
                            message: "Tiêu đề cột bị chặn"
                        },
                        duplicateHeaderError: {
                            description: "Các tiêu đề sau bị trùng lặp: {{headers}}.",
                            message: "Tiêu đề cột trùng lặp"
                        },
                        invalidHeaderError: {
                            description: "Các tiêu đề sau không hợp lệ: {{headers}}.",
                            message: "Tiêu đề cột không hợp lệ"
                        },
                        emptyDataField: {
                            description: "Trường dữ liệu '{{dataField}}' không được để trống.",
                            message: "Trường dữ liệu trống"
                        },
                        invalidRole: {
                            description: "{{role}} không tồn tại.",
                            message: "Không tìm thấy vai trò"
                        },
                        invalidGroup: {
                            description: "{{group}} không tồn tại.",
                            message: "Không tìm thấy nhóm"
                        }
                    },
                    submit: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi nhập người dùng"
                        },
                        genericError: {
                            description: "Không thể nhập người dùng",
                            message: "Đã xảy ra lỗi khi nhập người dùng"
                        },
                        success: {
                            description: "Người dùng đã được nhập thành công.",
                            message: "Nhập người dùng thành công"
                        }
                    },
                    timeOut: {
                        description: "Một số người dùng có thể chưa được tạo.",
                        message: "Yêu cầu đã hết thời gian chờ"
                    }
                },
                deleteUser: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi xóa người dùng"
                    },
                    genericError: {
                        description: "Không thể xóa người dùng",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Người dùng đã được xóa thành công.",
                        message: "Xóa người dùng thành công"
                    }
                },
                fetchUsers: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi lấy danh sách người dùng"
                    },
                    genericError: {
                        description: "Không thể lấy danh sách người dùng",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy danh sách người dùng thành công.",
                        message: "Lấy danh sách người dùng thành công"
                    }
                },
                getAdminRole: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi lấy vai trò quản trị"
                    },
                    genericError: {
                        description: "Không thể lấy vai trò quản trị.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy vai trò quản trị thành công.",
                        message: "Lấy vai trò thành công"
                    }
                },
                revokeAdmin: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi thu hồi quyền quản trị"
                    },
                    genericError: {
                        description: "Không thể thu hồi quyền quản trị.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã thu hồi quyền quản trị thành công.",
                        message: "Thu hồi quyền thành công"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "Làm mới danh sách",
                    subtitles: {
                        0: "Danh sách người dùng trả về rỗng.",
                        1: "Đã xảy ra lỗi khi lấy danh sách người dùng"
                    },
                    title: "Không tìm thấy người dùng nào"
                },
                userstoreError: {
                    subtitles: {
                        0: "Không thể lấy người dùng từ kho người dùng",
                        1: "Vui lòng thử lại"
                    },
                    title: "Đã xảy ra lỗi"
                }
            },
            userSessions: {
                components: {
                    sessionDetails: {
                        actions: {
                            terminateAllSessions: "Kết thúc tất cả",
                            terminateSession: "Kết thúc phiên"
                        },
                        labels: {
                            activeApplication: "Ứng dụng đang hoạt động",
                            browser: "Trình duyệt",
                            deviceModel: "Model thiết bị",
                            ip: "Địa chỉ IP",
                            lastAccessed: "Truy cập lần cuối {{ date }}",
                            loggedInAs: "Đã đăng nhập trên <1>{{ app }}</1> với tư cách <3>{{ user }}</3>",
                            loginTime: "Thời gian đăng nhập",
                            os: "Hệ điều hành",
                            recentActivity: "Hoạt động gần đây"
                        }
                    }
                },
                dangerZones: {
                    terminate: {
                        actionTitle: "Kết thúc",
                        header: "Kết thúc phiên",
                        subheader: "Bạn sẽ bị đăng xuất khỏi phiên trên thiết bị cụ thể đó."
                    }
                },
                notifications: {
                    getAdminUser: {
                        error: {
                            description: "{{ description }}",
                            message: "Lỗi lấy dữ liệu"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy loại người dùng hiện tại.",
                            message: "Lỗi lấy dữ liệu"
                        }
                    },
                    getUserSessions: {
                        error: {
                            description: "{{ description }}",
                            message: "Lỗi lấy dữ liệu"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy các phiên người dùng.",
                            message: "Lỗi lấy dữ liệu"
                        },
                        success: {
                            description: "Đã lấy các phiên người dùng thành công.",
                            message: "Lấy dữ liệu thành công"
                        }
                    },
                    terminateAllUserSessions: {
                        error: {
                            description: "{{ description }}",
                            message: "Lỗi kết thúc"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi kết thúc các phiên người dùng.",
                            message: "Lỗi kết thúc"
                        },
                        success: {
                            description: "Đã kết thúc tất cả các phiên người dùng thành công.",
                            message: "Kết thúc thành công"
                        }
                    },
                    terminateUserSession: {
                        error: {
                            description: "{{ description }}",
                            message: "Lỗi kết thúc"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi kết thúc phiên người dùng.",
                            message: "Lỗi kết thúc"
                        },
                        success: {
                            description: "Đã kết thúc phiên người dùng thành công.",
                            message: "Kết thúc thành công"
                        }
                    }
                },
                placeholders: {
                    emptyListPlaceholder: {
                        subtitles: "Không có phiên đang hoạt động nào cho người dùng này.",
                        title: "Không có phiên đang hoạt động"
                    }
                }
            },
            usersList: {
                list: {
                    emptyResultPlaceholder: {
                        addButton: "Người dùng mới",
                        emptyUsers: "Không tìm thấy người dùng nào",
                        subTitle: {
                            0: "Hiện tại không có người dùng nào khả dụng.",
                            1: "Bạn có thể thêm người dùng mới một cách dễ dàng bằng cách làm theo",
                            2: "các bước trong trình hướng dẫn tạo người dùng."
                        },
                        title: "Thêm một người dùng mới"
                    },
                    iconPopups: {
                        delete: "Xóa",
                        edit: "Chỉnh sửa"
                    }
                },
                metaOptions: {
                    columns: {
                        emails: "Email",
                        id: "ID người dùng",
                        lastModified: "Sửa đổi lần cuối",
                        name: "Tên",
                        userName: "Tên đăng nhập"
                    },
                    heading: "Hiển thị cột"
                },
                search: {
                    emptyResultPlaceholder: {
                        clearButton: "Xóa truy vấn tìm kiếm",
                        subTitle: {
                            0: "Chúng tôi không thể tìm thấy kết quả nào cho {{query}}",
                            1: "Vui lòng thử một từ khóa tìm kiếm khác."
                        },
                        title: "Không tìm thấy kết quả"
                    }
                }
            },
            userstores: {
                userstoreOptions: {
                    all: "Tất cả kho người dùng",
                    primary: "Chính"
                }
            }
        },
        userstores: {
            advancedSearch: {
                error: "Định dạng truy vấn lọc không đúng",
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "Ví dụ: Name, Description, v.v."
                        },
                        filterCondition: {
                            placeholder: "Ví dụ: Starts with, v.v."
                        },
                        filterValue: {
                            placeholder: "Ví dụ: PRIMARY, SECONDARY, v.v."
                        }
                    }
                },
                placeholder: "Tìm kiếm theo tên kho người dùng"
            },
            confirmation: {
                confirm: "Xác nhận",
                content: "Nếu bạn xóa kho người dùng này, dữ liệu người dùng trong kho người dùng này cũng sẽ bị xóa. "
                    + "Vui lòng tiếp tục một cách thận trọng.",
                header: "Bạn có chắc không?",
                hint: "Vui lòng xác nhận thao tác của bạn.",
                message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn "
                    + "kho người dùng đã chọn và dữ liệu trong đó."
            },
            dangerZone: {
                delete: {
                    actionTitle: "Xóa kho người dùng",
                    header: "Xóa kho người dùng",
                    subheader: "Sau khi bạn xóa một kho người dùng, không thể hoàn tác. "
                        + "Vui lòng chắc chắn."
                },
                disable: {
                    actionTitle: "Bật kho người dùng",
                    header: "Bật kho người dùng",
                    subheader: "Vô hiệu hóa một kho người dùng có thể khiến bạn mất quyền truy cập vào người dùng trong kho người dùng đó. " +
                        "Hãy tiếp tục một cách thận trọng."
                }
            },
            forms: {
                connection: {
                    updatePassword: "Cập nhật mật khẩu kết nối",
                    connectionErrorMessage: "Vui lòng đảm bảo rằng URL kết nối, tên, "
                        + "mật khẩu và tên driver được cung cấp là chính xác",
                    testButton: "Kiểm tra kết nối"
                },
                custom: {
                    placeholder: "Nhập một {{name}}",
                    requiredErrorMessage: "Cần có {{name}}"
                },
                general: {
                    description: {
                        label: "Mô tả",
                        placeholder: "Nhập một mô tả",
                        validationErrorMessages: {
                            invalidInputErrorMessage: "Mô tả không được chứa mẫu {{invalidString}}."
                        }
                    },
                    name: {
                        label: "Tên",
                        placeholder: "Nhập một tên",
                        requiredErrorMessage: "Tên là trường bắt buộc",
                        validationErrorMessages: {
                            alreadyExistsErrorMessage: "Đã tồn tại một kho người dùng với tên này.",
                            maxCharLimitErrorMessage: "Tên kho người dùng không được vượt quá {{maxLength}} ký tự.",
                            invalidInputErrorMessage: "Tên kho người dùng không được chứa mẫu {{invalidString}}."
                        }
                    },
                    type: {
                        label: "Loại",
                        requiredErrorMessage: "Chọn một loại"
                    }
                }
            },
            notifications: {
                addUserstore: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi tạo kho người dùng.",
                        message: "Đã xảy ra lỗi!"
                    },
                    success: {
                        description: "Kho người dùng đã được thêm thành công!",
                        message: "Thêm kho người dùng thành công!"
                    }
                },
                apiLimitReachedError: {
                    error: {
                        description: "Bạn đã đạt số lượng kho người dùng tối đa được phép.",
                        message: "Không thể tạo kho người dùng"
                    }
                },
                delay: {
                    description: "Có thể mất một lúc để danh sách kho người dùng được cập nhật. "
                        + "Làm mới sau vài giây để có danh sách kho người dùng đã cập nhật.",
                    message: "Cập nhật danh sách kho người dùng mất thời gian"
                },
                deleteUserstore: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi xóa kho người dùng.",
                        message: "Đã xảy ra lỗi!"
                    },
                    success: {
                        description: "Kho người dùng đã được xóa thành công!",
                        message: "Xóa kho người dùng thành công!"
                    }
                },
                fetchUserstoreMetadata: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy siêu dữ liệu loại.",
                        message: "Đã xảy ra lỗi"
                    }
                },
                fetchUserstoreTemplates: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy chi tiết loại kho người dùng.",
                        message: "Đã xảy ra lỗi"
                    }
                },
                fetchUserstoreTypes: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy các loại kho người dùng.",
                        message: "Đã xảy ra lỗi"
                    }
                },
                fetchUserstores: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy danh sách kho người dùng.",
                        message: "Đã xảy ra lỗi"
                    }
                },
                testConnection: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi kiểm tra kết nối đến kho người dùng",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Kết nối đang hoạt động tốt.",
                        message: "Kết nối thành công!"
                    }
                },
                updateDelay: {
                    description: "Có thể mất một chút thời gian để các thuộc tính đã cập nhật xuất hiện.",
                    message: "Cập nhật thuộc tính mất thời gian"
                },
                updateUserstore: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật kho người dùng.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Kho người dùng này đã được cập nhật thành công!",
                        message: "Cập nhật kho người dùng thành công!"
                    }
                }
            },
            pageLayout: {
                edit: {
                    back: "Quay lại kho người dùng",
                    description: "Chỉnh sửa kho người dùng",
                    tabs: {
                        connection: "Kết nối",
                        general: "Chung",
                        group: "Nhóm",
                        user: "Người dùng"
                    }
                },
                list: {
                    description: "Tạo và quản lý kho người dùng.",
                    primaryAction: "Kho người dùng mới",
                    title: "Kho người dùng"
                },
                templates: {
                    back: "Quay lại kho người dùng",
                    description: "Vui lòng chọn một trong các loại kho người dùng sau.",
                    templateHeading: "Thiết lập nhanh",
                    templateSubHeading: "Bộ template định nghĩa sẵn giúp tăng tốc việc tạo kho người dùng.",
                    title: "Chọn loại kho người dùng"
                }
            },
            placeholders: {
                emptyList: {
                    action: "Kho người dùng mới",
                    subtitles: "Hiện tại không có kho người dùng nào khả dụng. "
                        + "Bạn có thể thêm kho người dùng mới một cách dễ dàng bằng cách làm theo "
                        + "các bước trong trình hướng dẫn tạo kho người dùng.",
                    title: "Thêm một kho người dùng mới"
                },
                emptyListReadOnly: {
                    subtitles: "Hiện tại không có kho người dùng nào khả dụng.",
                    title: "Không có kho người dùng"
                },
                emptySearch: {
                    action: "Xóa truy vấn tìm kiếm",
                    subtitles: "Chúng tôi không thể tìm thấy kết quả nào cho {{searchQuery}}. "
                        + "Vui lòng thử một từ khóa tìm kiếm khác.",
                    title: "Không tìm thấy kết quả"
                }
            },
            sqlEditor: {
                create: "Tạo",
                darkMode: "Chế độ tối",
                delete: "Xóa",
                read: "Đọc",
                reset: "Đặt lại thay đổi",
                title: "Các loại truy vấn SQL",
                update: "Cập nhật"
            },
            wizard: {
                header: "Thêm kho người dùng {{type}}",
                steps: {
                    general: "Chung",
                    group: "Nhóm",
                    summary: "Tóm tắt",
                    user: "Người dùng"
                }
            }
        },
        validation: {
            fetchValidationConfigData: {
                error: {
                    description: "{{description}}",
                    message: "Lỗi lấy dữ liệu"
                },
                genericError: {
                    description: "Không thể lấy dữ liệu cấu hình kiểm tra hợp lệ.",
                    message: "Đã xảy ra lỗi"
                }
            },
            validationError: {
                minMaxMismatch: "Độ dài tối thiểu phải nhỏ hơn độ dài tối đa.",
                uniqueChrMismatch: "Số ký tự khác nhau phải nhỏ hơn độ dài tối thiểu của " +
                    "mật khẩu.",
                consecutiveChrMismatch: "Số ký tự liên tiếp phải nhỏ hơn độ dài tối thiểu " +
                    "của mật khẩu.",
                invalidConfig: "Không thể tạo mật khẩu với các cấu hình trên.",
                minLimitError: "Độ dài tối thiểu không được nhỏ hơn 8.",
                maxLimitError: "Độ dài tối đa không được lớn hơn 30.",
                wrongCombination: "Tổ hợp không được phép"
            },
            notifications: {
                error: {
                    description: "{{description}}",
                    message: "Lỗi cập nhật"
                },
                genericError: {
                    description: "Không thể cập nhật cấu hình kiểm tra hợp lệ mật khẩu.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Đã cập nhật cấu hình kiểm tra hợp lệ mật khẩu thành công.",
                    message: "Cập nhật thành công"
                }
            },
            pageTitle: "Kiểm tra hợp lệ mật khẩu",
            description: "Tùy chỉnh quy tắc kiểm tra hợp lệ mật khẩu cho người dùng của bạn.",
            goBackToApplication: "Quay lại ứng dụng",
            goBackToValidationConfig: "Quay lại Bảo mật tài khoản"
        },
        insights: {
            pageTitle: "Thống kê chi tiết",
            title: "Thống kê chi tiết",
            description: "Hiểu rõ hơn về hành vi người dùng qua thống kê sử dụng.",
            durationMessage: "Đang hiển thị kết quả từ <1>{{ startTimestamp }}</1> đến <1>{{ endTimestamp }}</1>",
            durationOption: "{{ duration }} ngày qua",
            lastFetchedMessage: {
                label: "Lấy lần cuối lúc {{ time }}",
                tooltipText: "Thống kê chi tiết cho hoạt động mới nhất sẽ mất vài phút để được phản ánh trên biểu đồ"
            },
            advancedFilter: {
                filterAttribute: "Thuộc tính lọc",
                filterCondition: "Điều kiện lọc",
                filterValue: "Giá trị lọc"
            },
            commonFilters: {
                userId: "ID người dùng"
            },
            activityType: {
                login: {
                    filters: {
                        userStore: "Kho người dùng",
                        serviceProvider: "Ứng dụng",
                        authenticator: {
                            attributeName: "Loại kết nối",
                            values: {
                                basic: "Tên đăng nhập & Mật khẩu",
                                identifierFirst: "Định danh trước",
                                fido2: "FIDO2",
                                magicLink: "Magic Link",
                                emailOtp: "Email OTP",
                                smsOtp: "SMS OTP",
                                totp: "TOTP",
                                backupCodes: "Mã dự phòng",
                                google: "Google",
                                facebook: "Facebook",
                                github: "GitHub",
                                apple: "Apple",
                                oidc: "OIDC IdP",
                                saml: "SAML IdP",
                                hypr: "HYPR",
                                iproov: "IPROOV",
                                organizationLogin: "Đăng nhập tổ chức"
                            }
                        },
                        identityProvider: "ID kết nối"
                    }
                },
                registration: {
                    filters: {
                        onboardingMethod: {
                            attributeName: "Phương thức onboarding",
                            values: {
                                adminInitiated: "Bởi quản trị viên",
                                userInvited: "Lời mời qua email",
                                selfSignUp: "Tự đăng ký"
                            }
                        }
                    }
                }
            },
            graphs: {
                activeUsers: {
                    title: "Người dùng đang hoạt động",
                    titleHint: "Số lượng người dùng duy nhất đã đăng nhập vào tổ chức của bạn trong khoảng thời gian đã chọn"
                },
                successLogins: {
                    title: "Tổng số lần đăng nhập",
                    titleHint: "Số lần đăng nhập thành công vào tổ chức của bạn trong khoảng thời gian đã chọn"
                },
                failedLogins: {
                    title: "Đăng nhập thất bại"
                },
                signups: {
                    title: "Đăng ký người dùng",
                    titleHint: "Tổng số lượt đăng ký người dùng xảy ra trong khoảng thời gian đã chọn"
                }
            },
            notifications: {
                fetchInsights: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy thống kê chi tiết cho khoảng thời gian đã chọn.",
                        message: "Đã xảy ra lỗi"
                    }
                }
            },
            compareToLastPeriodMessage: "So sánh với kỳ trước"
        },
        pushProviders: {
            heading: "Nhà cung cấp Push",
            subHeading: "Cấu hình một nhà cung cấp push để gửi thông báo đẩy đến người dùng của bạn.",
            description: "Cấu hình cài đặt nhà cung cấp push theo nhà cung cấp push của bạn."
        },
        smsProviders: {
            heading: "Nhà cung cấp SMS",
            subHeading: "Cấu hình một nhà cung cấp SMS để gửi SMS đến người dùng của bạn.",
            description: "Cấu hình cài đặt nhà cung cấp SMS theo nhà cung cấp SMS của bạn.",
            info: "Bạn có thể tùy chỉnh nội dung SMS bằng <1>Template SMS</1>.",
            updateButton: "Cập nhật",
            sendTestSMSButton: "Gửi SMS thử",
            goBack: "Quay lại Nhà cung cấp thông báo",
            confirmationModal: {
                assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                content: "Xóa cấu hình nhà cung cấp SMS này có thể làm gián đoạn xác thực SMS OTP cho " +
                    "các ứng dụng hiện đang sử dụng nó. Bạn có thể không còn nhận được OTP qua SMS, điều này có thể " +
                    "ảnh hưởng đến việc đăng nhập của người dùng. Vui lòng tiếp tục một cách thận trọng.",
                header: "Bạn có chắc không?",
                message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn cấu hình nhà cung cấp SMS."
            },
            dangerZoneGroup: {
                header: "Vùng nguy hiểm",
                revertConfig: {
                    heading: "Xóa cấu hình",
                    subHeading: "Thao tác này sẽ xóa cấu hình nhà cung cấp sms. " +
                        "Sau khi xóa, bạn sẽ không nhận được SMS.",
                    actionTitle: "Xóa"
                }
            },
            form: {
                twilio: {
                    subHeading: "Cài đặt Twilio",
                    accountSID: {
                        label: "Twilio Account SID",
                        placeholder: "Nhập Twilio account SID",
                        hint: "Định danh chuỗi tài khoản Twilio đóng vai trò tên đăng nhập cho tài khoản"
                    },
                    authToken: {
                        label: "Twilio Auth Token",
                        placeholder: "Nhập Twilio auth token",
                        hint: "Access token được tạo bởi máy chủ xác thực Twilio "
                    },
                    sender: {
                        label: "Người gửi",
                        placeholder: "Nhập số điện thoại người gửi",
                        hint: "Số điện thoại của người gửi."
                    },
                    validations: {
                        required: "Trường này không được để trống"
                    }
                },
                vonage: {
                    subHeading: "Cài đặt Vonage",
                    accountSID: {
                        label: "Vonage API Key",
                        placeholder: "Nhập Vonage API key",
                        hint: "Vonage API Key đóng vai trò tên đăng nhập cho tài khoản."
                    },
                    authToken: {
                        label: "Vonage API Secret",
                        placeholder: "Nhập Vonage API Secret",
                        hint: "API Secret được tạo bởi máy chủ xác thực Vonage."
                    },
                    sender: {
                        label: "Người gửi",
                        placeholder: "Nhập số điện thoại người gửi",
                        hint: "Số điện thoại của người gửi."
                    },
                    validations: {
                        required: "Trường này không được để trống"
                    }
                },
                custom: {
                    subHeading: "Cài đặt tùy chỉnh",
                    providerName: {
                        label: "Tên nhà cung cấp SMS",
                        placeholder: "Nhập tên nhà cung cấp SMS",
                        hint: "Tên của nhà cung cấp SMS."
                    },
                    providerUrl: {
                        label: "URL nhà cung cấp SMS",
                        placeholder: "Nhập URL nhà cung cấp sms",
                        hint: "URL của nhà cung cấp SMS."
                    },
                    httpMethod: {
                        label: "Phương thức HTTP",
                        placeholder: "POST",
                        hint: "Phương thức HTTP của yêu cầu API. (Mặc định là POST)"
                    },
                    contentType: {
                        label: "Content Type",
                        placeholder: "JSON",
                        hint: "Content type của yêu cầu API. Giá trị được chấp nhận là 'FORM' hoặc 'JSON'"
                    },
                    headers: {
                        label: "Tiêu đề",
                        placeholder: "authorisation: Bearer {{token}}",
                        hint: "Danh sách tiêu đề HTTP phân tách bằng dấu phẩy sẽ được đưa vào yêu cầu API SMS."
                    },
                    payload: {
                        label: "Template payload",
                        placeholder: "{\"content\": {{body}}, \"to\": {{mobile}} }",
                        hint: "Template payload của yêu cầu API. Dùng {{body}} để đại diện cho nội dung SMS được tạo. Dùng {{mobile}} để đại diện cho số điện thoại."
                    },
                    key: {
                        label: "Khóa xác thực nhà cung cấp SMS",
                        placeholder: "Nhập khóa xác thực nhà cung cấp SMS",
                        hint: "Bất kỳ khóa xác thực nào cần được gửi dưới dạng tiêu đề HTTP."
                    },
                    secret: {
                        label: "Secret xác thực nhà cung cấp SMS",
                        placeholder: "Nhập secret xác thực nhà cung cấp SMS",
                        hint: "Bất kỳ secret xác thực nào cần được gửi dưới dạng tiêu đề HTTP."
                    },
                    sender: {
                        label: "Người gửi",
                        placeholder: "Nhập người gửi",
                        hint: "Định danh người gửi SMS (số điện thoại hoặc tên)."
                    },
                    validations: {
                        required: "Trường này không được để trống",
                        methodInvalid: "Phương thức HTTP không hợp lệ",
                        contentTypeInvalid: "Content type không hợp lệ"
                    }
                }
            },
            notifications: {
                getConfiguration: {
                    error: {
                        message: "Đã xảy ra lỗi",
                        description: "Lỗi khi lấy cấu hình nhà cung cấp sms."
                    }
                },
                deleteConfiguration: {
                    error: {
                        message: "Đã xảy ra lỗi",
                        description: "Lỗi khi xóa cấu hình nhà cung cấp sms."
                    },
                    success: {
                        message: "Khôi phục thành công",
                        description: "Đã khôi phục cấu hình nhà cung cấp sms thành công."
                    }
                },
                updateConfiguration: {
                    error: {
                        message: "Đã xảy ra lỗi",
                        description: "Lỗi khi cập nhật cấu hình nhà cung cấp sms."
                    },
                    success: {
                        message: "Cập nhật thành công",
                        description: "Đã cập nhật cấu hình nhà cung cấp sms thành công."
                    }
                }
            }
        },
        approvalWorkflows: {
            advancedSearch: {
                placeholder: "Tìm kiếm theo tên quy trình phê duyệt"
            },
            confirmation: {
                confirm: "Xác nhận",
                content: "Nếu bạn xóa quy trình phê duyệt này, dữ liệu trong quy trình phê duyệt này cũng sẽ bị xóa. "
                    + "Vui lòng tiếp tục một cách thận trọng.",
                header: "Bạn có chắc không?",
                hint: "Vui lòng xác nhận thao tác của bạn.",
                message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn "
                    + "quy trình phê duyệt đã chọn và dữ liệu trong đó."
            },
            dangerZone: {
                delete: {
                    actionTitle: "Xóa quy trình phê duyệt",
                    header: "Xóa quy trình phê duyệt",
                    subheader: "Sau khi bạn xóa một quy trình phê duyệt, không thể hoàn tác. "
                        + "Vui lòng chắc chắn."
                }
            },
            forms: {
                general: {
                    description: {
                        label: "Mô tả",
                        placeholder: "Mô tả mục đích của quy trình phê duyệt này",
                        validationErrorMessages: {
                            invalidInputErrorMessage: "Mô tả không được chứa mẫu {{invalidString}}."
                        }
                    },
                    name: {
                        label: "Tên",
                        placeholder: "Quy trình phê duyệt mẫu",
                        requiredErrorMessage: "Tên là trường bắt buộc",
                        validationErrorMessages: {
                            alreadyExistsErrorMessage: "Đã tồn tại một quy trình phê duyệt với tên này.",
                            maxCharLimitErrorMessage: "Tên quy trình phê duyệt không được vượt quá {{maxLength}} ký tự.",
                            invalidInputErrorMessage: "Tên quy trình phê duyệt không được chứa mẫu {{invalidString}}."
                        }
                    }
                }
            },
            notifications: {
                apiLimitReachedError: {
                    error: {
                        description: "Bạn đã đạt số lượng quy trình phê duyệt tối đa được phép.",
                        message: "Không thể tạo quy trình phê duyệt"
                    }
                },
                delay: {
                    description: "Có thể mất một lúc để danh sách quy trình phê duyệt được cập nhật. "
                        + "Làm mới sau vài giây để có danh sách quy trình phê duyệt đã cập nhật.",
                    message: "Cập nhật danh sách quy trình phê duyệt mất thời gian"
                },
                testConnection: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi kiểm tra kết nối đến quy trình phê duyệt",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Kết nối đang hoạt động tốt.",
                        message: "Kết nối thành công!"
                    }
                },
                updateDelay: {
                    description: "Có thể mất một chút thời gian để các thuộc tính đã cập nhật xuất hiện.",
                    message: "Cập nhật thuộc tính mất thời gian"
                }
            },
            pageLayout: {
                edit: {
                    back: "Quay lại quy trình phê duyệt",
                    description: "Chỉnh sửa quy trình phê duyệt",
                    tabs: {
                        connection: "Kết nối",
                        general: "Chung",
                        group: "Nhóm",
                        user: "Người dùng"
                    }
                },
                list: {
                    description: "Tạo và quản lý quy trình phê duyệt.",
                    primaryAction: "Quy trình phê duyệt mới",
                    title: "Quy trình phê duyệt"
                },
                templates: {
                    back: "Quay lại quy trình phê duyệt",
                    description: "Vui lòng chọn một trong các loại quy trình phê duyệt sau.",
                    templateHeading: "Thiết lập nhanh",
                    templateSubHeading: "Bộ template định nghĩa sẵn giúp tăng tốc việc tạo quy trình phê duyệt.",
                    title: "Chọn loại quy trình phê duyệt"
                }
            },
            placeholders: {
                emptyList: {
                    action: "Quy trình phê duyệt mới",
                    subtitles: "Hiện tại không có quy trình phê duyệt nào khả dụng. "
                        + "Bạn có thể thêm quy trình phê duyệt mới một cách dễ dàng bằng cách làm theo "
                        + "các bước trong trình hướng dẫn tạo quy trình phê duyệt.",
                    title: "Thêm một quy trình phê duyệt mới"
                },
                emptyListReadOnly: {
                    subtitles: "Hiện tại không có quy trình phê duyệt nào khả dụng.",
                    title: "Không có quy trình phê duyệt"
                },
                emptySearch: {
                    action: "Xóa truy vấn tìm kiếm",
                    subtitles: "Chúng tôi không thể tìm thấy kết quả nào cho {{searchQuery}}. "
                        + "Vui lòng thử một từ khóa tìm kiếm khác.",
                    title: "Không tìm thấy kết quả"
                }
            },
            sqlEditor: {
                create: "Tạo",
                darkMode: "Chế độ tối",
                delete: "Xóa",
                read: "Đọc",
                reset: "Đặt lại thay đổi",
                title: "Các loại truy vấn SQL",
                update: "Cập nhật"
            }
        }
    },
    notifications: {
        endSession: {
            error: {
                description: "{{description}}",
                message: "Lỗi kết thúc"
            },
            genericError: {
                description: "Không thể kết thúc phiên hiện tại.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã kết thúc phiên hiện tại thành công.",
                message: "Kết thúc thành công"
            }
        },
        getProfileInfo: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Không thể lấy chi tiết hồ sơ người dùng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy chi tiết hồ sơ người dùng thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        getProfileSchema: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Không thể lấy schema hồ sơ người dùng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy schema hồ sơ người dùng thành công.",
                message: "Lấy dữ liệu thành công"
            }
        }
    },
    pages: {
        addEmailTemplate: {
            backButton: "Quay lại template {{name}}",
            subTitle: null,
            title: "Thêm template mới"
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
            title: "Khám phá miền email"
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
        invite: {
            subTitle: "Mời và quản lý quản trị viên và nhà phát triển.",
            title: "Quản trị viên & Nhà phát triển"
        },
        oidcScopes: {
            subTitle: "Tạo và quản lý các phạm vi OpenID Connect (OIDC) và các thuộc tính gắn với phạm vi.",
            title: "Phạm vi OpenID Connect"
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
        rolesEdit: {
            backButton: "Quay lại {{type}}",
            subTitle: null,
            title: "Chỉnh sửa vai trò"
        },
        groupsEdit: {
            backButton: "Quay lại {{type}}",
            subTitle: null,
            title: "Chỉnh sửa nhóm"
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
        }
    },
    placeholders: {
        emptySearchResult: {
            action: "Xóa truy vấn tìm kiếm",
            subtitles: {
                0: "Chúng tôi không thể tìm thấy kết quả nào cho \"{{query}}\"",
                1: "Vui lòng thử một từ khóa tìm kiếm khác."
            },
            title: "Không tìm thấy kết quả"
        },
        underConstruction: {
            action: "Về trang chủ",
            subtitles: {
                0: "Chúng tôi đang thực hiện một số công việc trên trang này.",
                1: "Vui lòng thông cảm và quay lại sau. Cảm ơn sự kiên nhẫn của bạn."
            },
            title: "Trang đang được xây dựng"
        }
    }
};
