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
import { IdpNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const idp: IdpNS = {
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "Ví dụ: Name, Enabled, v.v."
                },
                filterCondition: {
                    placeholder: "Ví dụ: Starts with, v.v."
                },
                filterValue: {
                    placeholder: "Nhập giá trị để tìm kiếm"
                }
            }
        },
        placeholder: "Tìm kiếm theo tên kết nối"
    },
    buttons: {
        addAttribute: "Thêm thuộc tính",
        addAuthenticator: "Phương thức xác thực mới",
        addCertificate: "Chứng chỉ mới",
        addConnector: "Connector mới",
        addIDP: "Kết nối mới"
    },
    confirmations: {
        deleteAuthenticator: {
            assertionHint: "Vui lòng nhập <1>{{ name }}</1> để xác nhận.",
            content: "Nếu bạn xóa phương thức xác thực này, bạn sẽ không thể khôi phục lại. Tất cả các " +
                "ứng dụng phụ thuộc vào nó cũng có thể ngừng hoạt động. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn phương thức xác thực."
        },
        deleteConnector: {
            assertionHint: "Vui lòng nhập <1>{{ name }}</1> để xác nhận.",
            content: "Nếu bạn xóa connector này, bạn sẽ không thể khôi phục lại. Vui lòng " +
                "tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn connector."
        },
        deleteIDP: {
            assertionHint: "Vui lòng nhập <1>{{ name }}</1> để xác nhận.",
            content: "Nếu bạn xóa kết nối này, bạn sẽ không thể khôi phục lại. " +
                "Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn kết nối."
        },
        deleteIDPWithConnectedApps: {
            assertionHint: "",
            content: "Hãy xóa các liên kết khỏi những ứng dụng này trước khi xóa:",
            header: "Không thể xóa",
            message: "Có các ứng dụng đang sử dụng kết nối này. "
        }
    },
    connectedApps: {
        action: "Đi đến Luồng đăng nhập",
        applicationEdit: {
            back: "Quay lại {{idpName}}"
        },
        genericError: {
            description: "Đã xảy ra lỗi khi cố lấy các ứng dụng đã kết nối.",
            message: "Đã xảy ra lỗi."
        },
        header: "(Các) ứng dụng đã kết nối với {{idpName}}.",
        placeholders: {
            emptyList: "Hiện tại không có ứng dụng nào được kết nối với {{idpName}}.",
            search: "Tìm kiếm theo tên ứng dụng"
        },
        subHeader: "Các ứng dụng được kết nối với {{idpName}} được liệt kê tại đây."
    },
    dangerZoneGroup: {
        deleteIDP: {
            actionTitle: "Xóa kết nối",
            header: "Xóa kết nối",
            subheader: "Sau khi bạn xóa kết nối, không thể khôi phục lại. Vui lòng chắc chắn."
        },
        disableIDP: {
            actionTitle: "Vô hiệu hóa kết nối",
            header: "Vô hiệu hóa kết nối",
            subheader: "Sau khi bạn vô hiệu hóa kết nối, nó không thể được sử dụng cho đến " +
                "khi bạn bật lại.",
            subheader2: "Bật kết nối để sử dụng với các ứng dụng của bạn."
        },
        header: "Vùng nguy hiểm"
    },
    forms: {
        advancedConfigs: {
            alias: {
                hint: "Nếu kết nối cục bộ được biết đến bằng một alias tại nhà cung cấp danh tính " +
                    "liên kết, hãy chỉ định tại đây.",
                label: "Alias"
            },
            certificateType: {
                certificateJWKS: {
                    label: "Dùng endpoint JWKS",
                    placeholder: "Giá trị phải là chứng chỉ ở định dạng JWKS.",
                    validations: {
                        empty: "Cần có giá trị chứng chỉ",
                        invalid: "Endpoint JWKS phải là một URI hợp lệ."
                    }
                },
                certificatePEM: {
                    label: "Cung cấp chứng chỉ",
                    placeholder: "Giá trị phải là một URL PEM.",
                    validations: {
                        empty: "Cần có giá trị chứng chỉ"
                    }
                },
                hint: "Nếu loại là JWKS, giá trị phải là URL JWKS. Nếu loại là PEM, " +
                    "giá trị phải là chứng chỉ ở định dạng PEM.",
                label: "Chọn loại chứng chỉ"
            },
            federationHub: {
                hint: "Chọn nếu đối tượng này trỏ đến một kết nối trung tâm liên kết",
                label: "Trung tâm liên kết"
            },
            homeRealmIdentifier: {
                hint: "Nhập định danh home realm cho kết nối này",
                label: "Định danh Home Realm"
            },
            implicitAssociation: {
                enable: {
                    hint: "Trong quá trình trao đổi token nếu tìm thấy một tài khoản cục bộ khớp," +
                    " nó sẽ được liên kết ngầm",
                    label: "Liên kết tài khoản ngầm"
                },
                primaryAttribute: {
                    hint: "Chọn thuộc tính chính sẽ được dùng để kiểm tra xem" +
                    " có tài khoản người dùng cục bộ khớp hay không",
                    label: "Thuộc tính tra cứu chính",
                    placeholder: "Chưa chọn thuộc tính nào"
                },
                secondaryAttribute: {
                    hint: "Thuộc tính phụ sẽ được dùng nếu không tìm thấy người dùng duy nhất bằng thuộc tính chính",
                    label: "Thuộc tính tra cứu phụ",
                    placeholder: "Chưa chọn thuộc tính nào"
                },
                nonUniqueClaimWarning: "Claim này không duy nhất trên các kho người dùng. " +
                    "Để tránh bỏ sót liên kết ngầm, " +
                    "vui lòng đặt claim này thành duy nhất trên các kho người dùng.",
                warning: "Hãy đảm bảo rằng các thuộc tính đã chọn được nhà phát hành token xác minh"
            }
        },
        attributeSettings: {
            attributeListItem: {
                validation: {
                    empty: "Vui lòng nhập một giá trị"
                }
            },
            attributeMapping: {
                addAttributeButtonLabel: "Thêm Attribute Mapping",
                attributeColumnHeader: "Thuộc tính",
                attributeDropdown: {
                    label: "Ánh xạ tới",
                    noResultsMessage: "Hãy thử tìm thuộc tính khác.",
                    placeHolder: "Chọn thuộc tính ánh xạ"
                },
                attributeMapColumnHeader: "Thuộc tính kết nối",
                attributeMapInputPlaceholderPrefix: "vd: thuộc tính của Kết nối cho ",
                attributeMapTable: {
                    externalAttributeColumnHeader: "Thuộc tính kết nối bên ngoài",
                    mappedAttributeColumnHeader: "Thuộc tính đã ánh xạ"
                },
                componentHeading: "Ánh xạ thuộc tính",
                externalAttributeInput: {
                    existingErrorMessage: "Đã tồn tại một thuộc tính được ánh xạ với tên này.",
                    label: "Thuộc tính IdP bên ngoài",
                    placeHolder: "Nhập thuộc tính IdP bên ngoài"
                },
                heading: "Ánh xạ thuộc tính kết nối",
                hint: "Thêm các thuộc tính được kết nối hỗ trợ",
                modal: {
                    header: "Thêm Attribute Mappings",
                    placeholder: {
                        subtitle: "Ánh xạ các thuộc tính và nhấn Thêm Attribute Mapping để bắt đầu.",
                        title: "Bạn chưa chọn thuộc tính nào"
                    }
                },
                placeHolder: {
                    action: "Thêm Attribute Mapping",
                    subtitle: "Hiện tại không có thuộc tính được ánh xạ nào cho kết nối này.",
                    title: "Không tìm thấy thuộc tính được ánh xạ nào"
                },
                search: {
                    placeHolder: "Tìm kiếm thuộc tính đã ánh xạ"
                },
                subheading: "Thêm và ánh xạ các thuộc tính được hỗ trợ từ kết nối bên ngoài."
            },
            attributeProvisioning: {
                attributeColumnHeader: {
                    0: "Thuộc tính",
                    1: "Thuộc tính kết nối"
                },
                attributeMapColumnHeader: "Giá trị mặc định",
                attributeMapInputPlaceholderPrefix: "vd: giá trị mặc định cho ",
                componentHeading: "Chọn thuộc tính cấp phát",
                hint: "Chỉ định các thuộc tính bắt buộc để cấp phát"
            },
            attributeSelection: {
                searchAttributes: {
                    placeHolder: "Tìm kiếm thuộc tính"
                }
            }
        },
        authenticatorAccordion: {
            default: {
                0: "Mặc định",
                1: "Đặt làm mặc định"
            },
            enable: {
                0: "Đã bật",
                1: "Đã tắt"
            }
        },
        common: {
            customProperties: "Thuộc tính tùy chỉnh",
            internetResolvableErrorMessage: "URL phải có thể phân giải qua internet.",
            invalidQueryParamErrorMessage: "Đây không phải là các tham số truy vấn hợp lệ",
            invalidURLErrorMessage: "Nhập một URL hợp lệ",
            requiredErrorMessage: "Trường này là bắt buộc"
        },
        generalDetails: {
            description: {
                hint: "Mô tả có ý nghĩa về kết nối.",
                label: "Mô tả",
                placeholder: "Nhập mô tả cho kết nối."
            },
            image: {
                hint: "URL để truy vấn hình ảnh của kết nối.",
                label: "URL hình ảnh kết nối",
                placeholder: "Ví dụ: https://example.com/image.png"
            },
            name: {
                hint: "Nhập một tên duy nhất cho kết nối này.",
                label: "Tên kết nối",
                placeholder: "Nhập tên cho kết nối.",
                validations: {
                    duplicate: "Đã tồn tại một kết nối với tên này",
                    empty: "Cần có tên kết nối",
                    maxLengthReached: "Tên kết nối không được vượt quá {{ maxLength }} ký tự."
                }
            }
        },
        jitProvisioning: {
            enableJITProvisioning: {
                disabledMessageContent: {
                    1: "Bạn không thể sửa đổi cài đặt Chế độ Proxy vì nhiều ứng dụng" +
                        " phụ thuộc vào kết nối này. Để giải quyết xung đột này, bạn cần" +
                        " xóa kết nối này khỏi các tài nguyên được liệt kê.",
                    2: "Bạn không được phép sửa đổi cài đặt Chế độ Proxy vì một ứng dụng" +
                        " phụ thuộc vào kết nối này. Để giải quyết xung đột này, bạn cần xóa" +
                        " kết nối này khỏi tài nguyên được liệt kê."
                },
                disabledMessageHeader: "Thao tác không được phép",
                hint: "Chỉ định liệu người dùng được liên kết từ nhà cung cấp danh tính này có cần được proxy không.",
                label: "Cấp phát người dùng Just-in-Time (JIT)"
            },
            provisioningScheme: {
                children: {
                    0: "Nhắc nhập tên đăng nhập, mật khẩu và chấp thuận",
                    1: "Nhắc nhập mật khẩu và chấp thuận",
                    2: "Nhắc nhập chấp thuận",
                    3: "Cấp phát âm thầm"
                },
                hint: "Chọn phương án được sử dụng khi người dùng được cấp phát.",
                label: "Phương án cấp phát"
            },
            provisioningUserStoreDomain: {
                hint: "Chọn tên miền kho người dùng để cấp phát người dùng.",
                label: "Miền kho người dùng luôn dùng để cấp phát người dùng"
            }
        },
        outboundConnectorAccordion: {
            default: {
                0: "Mặc định",
                1: "Đặt làm mặc định"
            },
            enable: {
                0: "Đã bật",
                1: "Đã tắt"
            }
        },
        outboundProvisioningConnector: {
            authentication: {
                label: "Xác thực",
                modes: {
                    none: {
                        name: "Không có",
                        description: "Không xác thực"
                    },
                    basic: {
                        name: "Xác thực cơ bản",
                        description: "Xác thực bằng tên đăng nhập và mật khẩu"
                    },
                    bearer: {
                        name: "Bearer Token",
                        description: "Xác thực dựa trên token"
                    },
                    apiKey: {
                        name: "API Key",
                        description: "Xác thực dựa trên tiêu đề API key"
                    },
                    clientCredential: {
                        name: "Client Credential",
                        description: "Xác thực bằng grant client credentials OAuth 2.0"
                    }
                },
                placeholder: "Chọn chế độ xác thực",
                info: {
                    title: {
                        noneAuthType: "Đã cấu hình xác thực <strong>Không có</strong>",
                        otherAuthType: "Đã cấu hình <strong>{{authType}}</strong>"
                    },
                    message: "Nếu bạn đang thay đổi xác thực, hãy lưu ý rằng thông tin xác thực của endpoint bên ngoài cần được cập nhật."
                },
                buttons: {
                    changeAuthentication: "Thay đổi xác thực",
                    cancel: "Hủy"
                }
            },
            fields: {
                confidential: {
                    helperText: "Nhập giá trị mới để cập nhật, hoặc để nguyên để giữ giá trị hiện có."
                },
                placeholder: {
                    default: "Mặc định: {{defaultValue}}",
                    enter: "Nhập {{displayName}}"
                }
            },
            validations: {
                invalidURL: "Vui lòng nhập một URL hợp lệ"
            },
            warnings: {
                insecureURL: "URL không an toàn (HTTP). Dùng HTTPS để có kết nối an toàn."
            }
        },
        outboundProvisioningRoles: {
            heading: "Vai trò cấp phát ra ngoài",
            hint: "Chọn và thêm làm vai trò cấp phát ra ngoài của kết nối",
            label: "Vai trò",
            placeHolder: "Chọn vai trò",
            popup: {
                content: "Thêm vai trò"
            }
        },
        outboundProvisioningTitle: "Connector cấp phát ra ngoài",
        outboundProvisioningSharedConnector: {
            hint: "Connector cấp phát này được cấu hình trong tổ chức cha và không thể " +
                "sửa đổi tại đây."
        },
        roleMapping: {
            heading: "Ánh xạ vai trò",
            hint: "Ánh xạ các vai trò cục bộ với các vai trò của nhà cung cấp danh tính",
            keyName: "Vai trò cục bộ",
            validation: {
                duplicateKeyErrorMsg: "Vai trò này đã được ánh xạ. Vui lòng chọn vai trò khác",
                keyRequiredMessage: "Vui lòng nhập vai trò cục bộ",
                valueRequiredErrorMessage: "Vui lòng nhập một vai trò IdP để ánh xạ tới"
            },
            valueName: "Vai trò kết nối"
        },
        uriAttributeSettings: {
            role: {
                heading: "Vai trò",
                hint: "Chỉ định thuộc tính xác định các vai trò tại kết nối",
                label: "Thuộc tính vai trò",
                placeHolder: "Chọn thuộc tính",
                validation: {
                    empty: "Vui lòng chọn một thuộc tính cho vai trò"
                }
            },
            subject: {
                heading: "Subject",
                hint: "Chỉ định thuộc tính xác định người dùng tại kết nối",
                label: "Thuộc tính Subject",
                placeHolder: "Chọn thuộc tính",
                validation: {
                    empty: "Vui lòng chọn một thuộc tính cho subject"
                }
            }
        }
    },
    identityProviderGroups: {
        claimConfigs: {
            groupAttributeLabel: "Thuộc tính nhóm",
            groupAttributeHint: "Thuộc tính từ kết nối sẽ được ánh xạ tới thuộc tính nhóm của tổ chức.",
            groupAttributePlaceholder: "Nhập thuộc tính đã ánh xạ",
            groupAttributeMessage1: "Xin lưu ý rằng thuộc tính được chọn trong <1>tab Thuộc tính</1> làm thuộc tính nhóm được dùng để nhận diện các nhóm tại Kết nối.",
            groupAttributeMessage2: "Để sửa đổi thuộc tính nhóm, vui lòng truy cập <1>tab Thuộc tính</1>.",
            groupAttributeMessageOIDC: "Xin lưu ý rằng thuộc tính OpenID Connect có tên <1>{{attribute}}</1> sẽ được coi là " +
                "<1>Thuộc tính nhóm</1> mặc định vì bạn chưa thêm thuộc tính tùy chỉnh.",
            groupAttributeMessageSAML: "Xin lưu ý rằng thuộc tính <1>{{attribute}}</1> sẽ được coi là " +
                "<1>Thuộc tính nhóm</1> mặc định vì bạn chưa thêm thuộc tính tùy chỉnh.",
            notifications: {
                fetchConfigs: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi lấy cấu hình claim"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy cấu hình claim.",
                        message: "Đã xảy ra lỗi"
                    }
                }
            }
        },
        createGroupWizard: {
            groupNameLabel: "Tên nhóm",
            groupNamePlaceHolder: "Nhập tên nhóm",
            groupNameHint: "Tên này phải tương ứng với tên của các nhóm sẽ được trả về " +
                "từ kết nối của bạn.",
            subHeading: "Tạo một nhóm kết nối mới.",
            notifications: {
                createIdentityProviderGroup: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi tạo nhóm kết nối"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi tạo nhóm kết nối.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Nhóm kết nối đã được tạo thành công.",
                        message: "Tạo thành công"
                    }
                },
                duplicateGroupError: {
                    error: {
                        description: "Đã tồn tại một nhóm có cùng tên.",
                        message: "Đã xảy ra lỗi"
                    }
                }
            }
        },
        groupsList: {
            confirmation: {
                deleteGroup: {
                    message: "Thao tác này không thể hoàn tác.",
                    content: "Thao tác này sẽ xóa vĩnh viễn nhóm nhà cung cấp danh tính {{groupName}}. " +
                        "Vui lòng tiếp tục một cách thận trọng"
                }
            },
            newGroup: "Nhóm mới",
            noGroupsAvailable: "Không có nhóm nào khả dụng",
            notifications: {
                fetchGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi lấy các nhóm nhà cung cấp danh tính"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy các nhóm nhà cung cấp danh tính.",
                        message: "Đã xảy ra lỗi"
                    }
                },
                deleteGroup: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi xóa nhóm nhà cung cấp danh tính"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi xóa nhóm nhà cung cấp danh tính.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Nhóm nhà cung cấp danh tính đã được xóa thành công.",
                        message: "Xóa thành công"
                    }
                }
            },
            searchByName: "Tìm kiếm theo tên"
        },
        sharedGroupsInfo: {
            description: "Các nhóm cho kết nối này được kế thừa từ tổ chức cha và " +
                "không thể sửa đổi ở cấp tổ chức con.",
            header: "Các nhóm được kế thừa từ tổ chức cha"
        }
    },
    helpPanel: {
        tabs: {
            samples: {
                content: {
                    docs: {
                        goBack: "Quay lại",
                        hint: "Nhấn vào các loại kết nối sau để xem " +
                            "tài liệu tương ứng.",
                        title: "Chọn một loại template"
                    }
                },
                heading: "Tài liệu"
            }
        }
    },
    list: {
        actions: "Hành động",
        name: "Tên"
    },
    modals: {
        addAuthenticator: {
            subTitle: "Thêm phương thức xác thực mới vào kết nối: {{ idpName }}",
            title: "Thêm phương thức xác thực mới"
        },
        addCertificate: {
            subTitle: "Thêm chứng chỉ mới vào kết nối: {{ idpName }}",
            title: "Cấu hình chứng chỉ"
        },
        addProvisioningConnector: {
            subTitle: "Thực hiện theo các bước để thêm connector cấp phát ra ngoài mới",
            title: "Tạo connector cấp phát ra ngoài"
        },
        attributeSelection: {
            content: {
                searchPlaceholder: "Tìm kiếm thuộc tính"
            },
            subTitle: "Thêm thuộc tính mới hoặc xóa các thuộc tính hiện có.",
            title: "Cập nhật lựa chọn thuộc tính"
        }
    },
    notifications: {
        addFederatedAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Lỗi tạo"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi thêm phương thức xác thực.",
                message: "Lỗi tạo"
            },
            success: {
                description: "Đã thêm phương thức xác thực thành công.",
                message: "Tạo thành công"
            }
        },
        addIDP: {
            error: {
                description: "{{ description }}",
                message: "Lỗi tạo"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi tạo kết nối.",
                message: "Lỗi tạo"
            },
            success: {
                description: "Đã tạo kết nối thành công.",
                message: "Tạo thành công"
            }
        },
        apiLimitReachedError: {
            error: {
                description: "Bạn đã đạt số lượng kết nối tối đa được phép.",
                message: "Không thể tạo kết nối"
            }
        },
        changeCertType: {
            jwks: {
                description: "Xin lưu ý rằng các chứng chỉ sẽ bị ghi đè " +
                    "bởi endpoint JWKS.",
                message: "Cảnh báo!"
            },
            pem: {
                description: "Xin lưu ý rằng endpoint JWKS sẽ bị ghi đè " +
                    "bởi các chứng chỉ.",
                message: "Cảnh báo!"
            }
        },
        deleteCertificate: {
            error: {
                description: "{{ description }}",
                message: "Lỗi xóa chứng chỉ"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi xóa chứng chỉ.",
                message: "Lỗi xóa chứng chỉ"
            },
            success: {
                description: "Đã xóa chứng chỉ thành công.",
                message: "Xóa thành công"
            }
        },
        deleteDefaultAuthenticator: {
            error: {
                description: "Không thể xóa phương thức xác thực liên kết mặc định.",
                message: "Lỗi xóa phương thức xác thực liên kết"
            },
            genericError: null,
            success: null
        },
        deleteDefaultConnector: {
            error: {
                description: "Không thể xóa connector cấp phát ra ngoài mặc định.",
                message: "Lỗi xóa connector cấp phát ra ngoài"
            },
            genericError: null,
            success: null
        },
        deleteIDP: {
            error: {
                description: "{{ description }}",
                message: "Lỗi xóa kết nối"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi xóa kết nối.",
                message: "Lỗi xóa kết nối"
            },
            success: {
                description: "Đã xóa kết nối thành công.",
                message: "Xóa thành công"
            }
        },
        disableAuthenticator: {
            error: {
                description: "Bạn không thể vô hiệu hóa phương thức xác thực mặc định.",
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
        disableOutboundProvisioningConnector: {
            error: {
                description: "Bạn không thể vô hiệu hóa connector cấp phát ra ngoài mặc định.",
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
        duplicateCertificateUpload: {
            error: {
                description: "Chứng chỉ đã tồn tại cho IDP: {{idp}}",
                message: "Lỗi trùng lặp chứng chỉ "
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
        getAllLocalClaims: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy các thuộc tính.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getFederatedAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getFederatedAuthenticatorMetadata: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy siêu dữ liệu phương thức xác thực.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getFederatedAuthenticatorsList: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getIDP: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy chi tiết kết nối.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getIDPList: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy danh sách kết nối.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getIDPTemplate: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy template kết nối.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getIDPTemplateList: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy danh sách template kết nối.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getOutboundProvisioningConnector: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy chi tiết connector cấp phát ra ngoài.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getOutboundProvisioningConnectorMetadata: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy siêu dữ liệu connector cấp phát ra ngoài.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getOutboundProvisioningConnectorsList: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy danh sách connector cấp phát ra ngoài.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getRolesList: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy danh sách vai trò.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "",
                message: ""
            }
        },
        submitAttributeSettings: {
            error: {
                description: "Cần cấu hình tất cả các thuộc tính bắt buộc.",
                message: "Không thể thực hiện cập nhật"
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
        tierLimitReachedError: {
            emptyPlaceholder: {
                action: "Xem các gói",
                subtitles: "Bạn có thể liên hệ quản trị viên tổ chức hoặc (nếu bạn là " +
                    "quản trị viên) nâng cấp gói đăng ký để tăng giới hạn cho phép.",
                title: "Bạn đã đạt số lượng IdP tối đa được phép " +
                    "cho tổ chức này."
            },
            heading: "Bạn đã đạt giới hạn tối đa cho IdP"
        },
        updateClaimsConfigs: {
            error: {
                description: "{{ description }}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình claim.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật cấu hình claim thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateFederatedAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật phương thức xác thực liên kết.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật phương thức xác thực liên kết thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateFederatedAuthenticators: {
            error: {
                description: "{{ description }}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật các phương thức xác thực liên kết.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật các phương thức xác thực liên kết thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateIDP: {
            error: {
                description: "{{ description }}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật kết nối.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật kết nối thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateIDPCertificate: {
            error: {
                description: "{{ description }}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật chứng chỉ kết nối.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật chứng chỉ kết nối thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateIDPRoleMappings: {
            error: {
                description: "{{ description }}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình vai trò cấp phát ra ngoài.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật cấu hình vai trò cấp phát ra ngoài thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateJITProvisioning: {
            error: {
                description: "",
                message: ""
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình cấp phát JIT.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật cấu hình cấp phát JIT thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateOutboundProvisioningConnector: {
            error: {
                description: "{{ description }}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật connector cấp phát ra ngoài.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật connector cấp phát ra ngoài thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateOutboundProvisioningConnectors: {
            error: {
                description: "{{ description }}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật các connector cấp phát ra ngoài.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật các connector cấp phát ra ngoài thành công.",
                message: "Cập nhật thành công"
            }
        }
    },
    placeHolders: {
        emptyAuthenticatorList: {
            subtitles: {
                0: "Hiện tại không có phương thức xác thực nào khả dụng.",
                1: "Bạn có thể thêm phương thức xác thực mới một cách dễ dàng bằng cách sử dụng",
                2: "các template định nghĩa sẵn."
            },
            title: "Thêm phương thức xác thực"
        },
        emptyCertificateList: {
            subtitles: {
                0: "Kết nối này chưa có chứng chỉ nào được thêm.",
                1: "Thêm một chứng chỉ để xem tại đây."
            },
            title: "Không có chứng chỉ"
        },
        emptyConnectorList: {
            subtitles: {
                0: "Kết nối này chưa cấu hình connector cấp phát ra ngoài nào.",
                1: "Thêm một connector để xem tại đây."
            },
            title: "Không có connector cấp phát ra ngoài"
        },
        emptyIDPList: {
            subtitles: {
                0: "Hiện tại không có kết nối nào khả dụng.",
                1: "Bạn có thể thêm kết nối mới một cách dễ dàng bằng cách làm theo",
                2: "các bước trong trình hướng dẫn tạo kết nối."
            },
            title: "Thêm kết nối mới"
        },
        emptyIDPSearchResults: {
            subtitles: {
                0: "Chúng tôi không thể tìm thấy kết quả nào cho '{{ searchQuery }}'",
                1: "Vui lòng thử một từ khóa tìm kiếm khác."
            },
            title: "Không tìm thấy kết quả"
        },
        noAttributes: {
            subtitles: {
                0: "Hiện tại không có thuộc tính nào được chọn."
            },
            title: "Chưa thêm thuộc tính"
        }
    },
    templates: {
        manualSetup: {
            heading: "Thiết lập thủ công",
            subHeading: "Tạo kết nối với cấu hình tùy chỉnh."
        },
        quickSetup: {
            heading: "Thiết lập nhanh",
            subHeading: "Bộ template định nghĩa sẵn giúp tăng tốc việc tạo kết nối."
        }
    },
    wizards: {
        addAuthenticator: {
            header: "Điền thông tin cơ bản về phương thức xác thực.",
            steps: {
                authenticatorConfiguration: {
                    title: "Cấu hình phương thức xác thực"
                },
                authenticatorSelection: {
                    manualSetup: {
                        subTitle: "Thêm phương thức xác thực mới với cấu hình tùy chỉnh.",
                        title: "Thiết lập thủ công"
                    },
                    quickSetup: {
                        subTitle: "Các template phương thức xác thực định nghĩa sẵn giúp tăng tốc quá trình.",
                        title: "Thiết lập nhanh"
                    },
                    title: "Chọn phương thức xác thực"
                },
                summary: {
                    title: "Tóm tắt"
                }
            }
        },
        addIDP: {
            header: "Điền thông tin cơ bản về kết nối.",
            steps: {
                authenticatorConfiguration: {
                    title: "Cấu hình phương thức xác thực"
                },
                generalSettings: {
                    title: "Cài đặt chung"
                },
                provisioningConfiguration: {
                    title: "Cấu hình cấp phát"
                },
                summary: {
                    title: "Tóm tắt"
                }
            }
        },
        addProvisioningConnector: {
            header: "Điền thông tin cơ bản về connector cấp phát.",
            steps: {
                connectorConfiguration: {
                    title: "Cấu hình"
                },
                connectorSelection: {
                    defaultSetup: {
                        subTitle: "Chọn loại connector cấp phát ra ngoài mới",
                        title: "Các loại connector"
                    },
                    title: "Chọn connector"
                },
                summary: {
                    title: "Tóm tắt"
                }
            }
        },
        buttons: {
            finish: "Hoàn tất",
            next: "Tiếp theo",
            previous: "Trước"
        }
    }
};
