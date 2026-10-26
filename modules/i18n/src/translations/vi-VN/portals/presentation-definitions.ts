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

import { PresentationDefinitionsInterface } from "../../../models";

/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const presentationDefinitions: PresentationDefinitionsInterface = {
    page: {
        title: "Định nghĩa trình bày",
        heading: "Định nghĩa trình bày",
        description:
            "Tạo và quản lý các định nghĩa trình bày chỉ định những thông tin xác thực có thể xác minh mà ví phải trình bày."
    },
    buttons: {
        addDefinition: "Định nghĩa trình bày mới"
    },
    placeholders: {
        emptyList: {
            subtitle: "Chưa có định nghĩa trình bày nào được cấu hình. Nhấn vào nút để tạo một định nghĩa."
        },
        emptySearch: {
            action: "Xóa tìm kiếm",
            title: "Không tìm thấy kết quả",
            subtitle1: "Không tìm thấy định nghĩa trình bày nào phù hợp.",
            subtitle2: "Thử một từ khóa tìm kiếm khác."
        }
    },
    list: {
        columns: {
            name: "Tên hiển thị",
            description: "Mô tả",
            actions: "Hành động"
        },
        confirmations: {
            deleteBlockedByConnections: {
                header: "Không thể xóa",
                message: "Có các kết nối đang sử dụng định nghĩa trình bày này.",
                content: "Hãy xóa các liên kết khỏi những kết nối này trước khi xóa:"
            },
            deleteItem: {
                header: "Xóa định nghĩa trình bày?",
                message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn định nghĩa trình bày.",
                content:
                    "Nếu bạn xóa định nghĩa trình bày này, nó không còn có thể được dùng để yêu cầu thông tin xác thực từ ví của người dùng.",
                assertionHint: "Vui lòng xác nhận thao tác của bạn."
            }
        },
        search: {
            placeholder: "Tìm kiếm theo tên hiển thị",
            filterAttributePlaceholder: "Lọc theo",
            filterConditionsPlaceholder: "Điều kiện",
            filterValuePlaceholder: "Nhập giá trị",
            attributes: {
                name: "Tên hiển thị"
            }
        }
    },
    wizard: {
        title: "Tạo định nghĩa trình bày",
        form: {
            displayName: {
                label: "Tên hiển thị",
                placeholder: "Nhập tên hiển thị cho định nghĩa trình bày này",
                hint: "Một mô tả cho định nghĩa trình bày."
            },
            identifier: {
                label: "Định danh",
                placeholder: "ví dụ: employee-id-verification",
                hint: "Định danh duy nhất cho định nghĩa trình bày.",
                validationError: "Chỉ cho phép chữ cái, số, dấu gạch ngang (-), và dấu gạch dưới (_)."
            },

            description: {
                label: "Mô tả",
                placeholder: "Nhập mô tả ngắn gọn"
            },
            credentialType: {
                label: "Loại thông tin xác thực",
                placeholder: "urn:eu:europa:ec:eudi:pid:1",
                hint:
                    "Giá trị Verifiable Credential Type (vct) xác định loại thông tin xác thực cần yêu cầu. Giá trị này phải khớp chính xác với giá trị vct trong thông tin xác thực."
            },
            format: {
                label: "Định dạng",
                hint: "Chỉ định định dạng của thông tin xác thực có thể xác minh cần yêu cầu."
            },
            submitButton: "Tạo"
        }
    },
    editPage: {
        title: "Chỉnh sửa định nghĩa trình bày",
        backButton: "Quay lại Định nghĩa trình bày",
        tabs: {
            general: "Chung",
            claims: "Thuộc tính",
            issuerTrust: "Nhà phát hành đáng tin cậy"
        },
        digitalWalletHint: "Tạo một kết nối <1>Ví kỹ thuật số</1> để cho phép người dùng đăng nhập hoặc " +
            "đăng ký bằng định nghĩa trình bày này.",
        quickCopy: {
            identifier: {
                label: "Định danh",
                hint: "Một định danh ổn định cho định nghĩa trình bày này."
            }
        },

        issuerTrust: {
            heading: "Nhà phát hành đáng tin cậy",
            hint: "Cấu hình những nhà phát hành thông tin xác thực bạn tin cậy và cách khóa ký của họ được xác thực.",
            keyResolutionMethod: {
                label: "Phương thức tin cậy",
                hint: "Chọn cách khóa ký và danh tính của nhà phát hành được tin cậy.",
                options: {
                    x5c: "Chứng chỉ gốc X.509 đáng tin cậy",
                    jwks_uri: "Endpoint JWKS",
                    pem: "Chứng chỉ PEM"
                },
                shortLabels: {
                    x5c: "Chứng chỉ gốc X.509 đáng tin cậy",
                    jwks_uri: "Endpoint JWKS",
                    pem: "Chứng chỉ PEM"
                },
                optionHints: {
                    x5c:
                        "Tin cậy các nhà phát hành có chuỗi chứng chỉ bắt nguồn từ một chứng chỉ gốc đã cấu hình. Nhà phát hành cung cấp chuỗi chứng chỉ của họ cùng với thông tin xác thực.",

                    jwks_uri:
                        "Tin cậy các khóa ký của nhà phát hành từ một endpoint JWKS đã cấu hình. Các khóa được lấy tự động trong quá trình xác minh.",

                    pem:
                        "Tin cậy một chứng chỉ nhà phát hành cụ thể. Chứng chỉ đã cấu hình được dùng trực tiếp để xác minh chữ ký thông tin xác thực."
                }
            },
            certificate: {
                infoUnavailable: "Chi tiết chứng chỉ không khả dụng",
                expiryDate: "Hết hạn: {{date}}",
                actions: {
                    change: "Thay đổi chứng chỉ",
                    view: "Xem chứng chỉ",
                    remove: "Xóa chứng chỉ"
                },
                modal: {
                    title: "Chi tiết chứng chỉ - {{alias}}",
                    serialNumber: "Số sê-ri: {{serialNumber}}",
                    unsupportedPrefix:
                        "Không thể hiển thị chi tiết chứng chỉ. Hiện tại chỉ hỗ trợ thông tin khóa công khai cho các",
                    unsupportedSuffix: "thuật toán khóa."
                }
            },
            jwksUri: {
                label: "URI JWKS",
                placeholder: "https://issuer.example.com/.well-known/jwks.json",
                hint:
                    "URL của endpoint JWKS của nhà phát hành được dùng để lấy khóa công khai nhằm xác minh chữ ký thông tin xác thực.",
                validationError: "Nhập một URL hợp lệ."
            },
            issuerConfig: {
                addTitle: "Thêm nhà phát hành đáng tin cậy",
                editTitle: "Chỉnh sửa nhà phát hành đáng tin cậy",
                modalSubtitle: "Cấu hình một nhà phát hành đáng tin cậy cho thông tin xác thực.",
                addButton: "Thêm nhà phát hành đáng tin cậy",
                emptyPlaceholder: "Chưa cấu hình nhà phát hành đáng tin cậy nào.",
                uploadCert: "Thêm chứng chỉ",

                keyResolutionMethod: {
                    label: "Phương thức tin cậy",
                    subheading: "Chọn cách thiết lập tin cậy với nhà phát hành"
                },

                sections: {
                    x5c: { subheading: "Cung cấp chứng chỉ gốc X.509 đáng tin cậy" },
                    jwksUri: { subheading: "Dùng endpoint JWKS" },
                    pem: { subheading: "Cung cấp chứng chỉ PEM" }
                },

                issuerUrl: {
                    label: "URL nhà phát hành",
                    placeholder: "https://issuer.example.com",
                    hint: "URL xác định nhà phát hành thông tin xác thực.",
                    validationError: "Nhập một URL hợp lệ."
                },

                keySource: {
                    x5cLabel: "Chứng chỉ gốc X.509 đáng tin cậy",
                    pemLabel: "Chứng chỉ PEM",
                    dropzone: {
                        description: "Kéo và thả tệp chứng chỉ vào đây.",
                        separator: "- hoặc -"
                    }
                },

                table: {
                    methodColumn: "Phương thức tin cậy",
                    issuerUrlColumn: "Nhà phát hành"
                }
            }
        },
        form: {
            displayName: {
                label: "Tên hiển thị",
                placeholder: "Nhập tên hiển thị",
                requiredError: "Cần có tên hiển thị."
            },
            description: {
                label: "Mô tả",
                placeholder: "Nhập mô tả ngắn gọn"
            },
            credentials: {
                type: {
                    label: "Loại thông tin xác thực",
                    placeholder: "urn:eu:europa:ec:eudi:pid:1"
                },
                format: {
                    label: "Định dạng",
                    hint: "Chỉ định định dạng của thông tin xác thực có thể xác minh cần yêu cầu."
                },
                claims: {
                    label: "Thuộc tính",
                    hint: "Chỉ định các thuộc tính cần yêu cầu từ thông tin xác thực.",
                    addTitle: "Thêm thuộc tính",
                    editTitle: "Chỉnh sửa thuộc tính",
                    claimPath: {
                        label: "Tên thuộc tính",
                        placeholder: "given_name",
                        hint:
                            "Tên của thuộc tính cần yêu cầu từ thông tin xác thực.",
                        validationError: "Thuộc tính này đã được thêm vào thông tin xác thực."
                    },
                    editClaim: "Chỉnh sửa thuộc tính",
                    emptyPlaceholder:
                        "Chưa thêm thuộc tính nào. Thêm một thuộc tính để chỉ định những thuộc tính cần yêu cầu.",
                    required: {
                        label: "Bắt buộc",
                        hint: "Khi được bật, ví phải bao gồm thuộc tính này trong phần trình bày."
                    },
                    addClaim: "Thêm thuộc tính",
                    modalSubtitle: "Cấu hình một thuộc tính cần yêu cầu từ thông tin xác thực."
                }
            }
        },
        dangerZone: {
            header: "Vùng nguy hiểm",
            delete: {
                header: "Xóa định nghĩa trình bày",
                subheader: "Việc xóa định nghĩa trình bày này là vĩnh viễn và không thể hoàn tác.",
                actionTitle: "Xóa định nghĩa trình bày"
            }
        },
        confirmations: {
            claimMappedInConnection: {
                editHeader: "Không thể chỉnh sửa thuộc tính",
                deleteHeader: "Không thể xóa thuộc tính",
                message: "Thuộc tính này được ánh xạ trong một hoặc nhiều kết nối.",
                content:
                    "Hãy xóa ánh xạ thuộc tính khỏi (các) kết nối sau" +
                    " trước khi {{action}} thuộc tính này:"
            },
            deleteDefinition: {
                header: "Xóa định nghĩa trình bày?",
                message: "Thao tác này là vĩnh viễn và không thể hoàn tác.",
                content:
                    "Việc xóa định nghĩa trình bày này sẽ khiến nó không còn khả dụng để yêu cầu thông tin xác thực từ ví của người dùng.",
                assertionHint: "Vui lòng xác nhận rằng bạn muốn tiếp tục."
            },
            deleteBlockedByConnections: {
                header: "Không thể xóa",
                message: "Định nghĩa trình bày này được liên kết với một hoặc nhiều kết nối.",
                content: "Hãy xóa các liên kết này trước khi xóa định nghĩa trình bày:"
            }
        }
    },
    notifications: {
        fetchDefinitions: {
            error: {
                message: "Tải thất bại",
                description: "Đã xảy ra lỗi khi tải các định nghĩa trình bày."
            }
        },
        fetchDefinition: {
            error: {
                message: "Tải thất bại",
                description: "Đã xảy ra lỗi khi tải chi tiết định nghĩa trình bày."
            }
        },
        createDefinition: {
            success: {
                message: "Đã tạo",
                description: "Định nghĩa trình bày đã được tạo thành công."
            },
            error: {
                message: "Tạo thất bại",
                description: "Đã xảy ra lỗi khi tạo định nghĩa trình bày."
            },

            duplicateError: {
                message: "Định danh đã tồn tại",
                description:
                    "Đã tồn tại một định nghĩa trình bày với định danh này. Vui lòng chọn một định danh khác."
            }
        },
        updateDefinition: {
            success: {
                message: "Đã cập nhật",
                description: "Định nghĩa trình bày đã được cập nhật thành công."
            },
            error: {
                message: "Cập nhật thất bại",
                description: "Đã xảy ra lỗi khi cập nhật định nghĩa trình bày."
            }
        },
        deleteDefinition: {
            success: {
                message: "Đã xóa",
                description: "Định nghĩa trình bày đã được xóa thành công."
            },
            error: {
                message: "Xóa thất bại",
                description: "Đã xảy ra lỗi khi xóa định nghĩa trình bày."
            }
        },
        saveIssuerConfig: {
            success: {
                message: "Đã lưu nhà phát hành",
                description: "Cấu hình nhà phát hành đáng tin cậy đã được lưu thành công."
            },
            error: {
                message: "Lưu thất bại",
                description: "Đã xảy ra lỗi khi lưu cấu hình nhà phát hành."
            },
            duplicateError: {
                message: "Cấu hình nhà phát hành trùng lặp",
                description: "Đã tồn tại một cấu hình nhà phát hành với cùng phương thức giải quyết khóa " +
                    "và nguồn khóa cho thông tin xác thực này."
            }
        },
        deleteIssuerConfig: {
            success: {
                message: "Đã xóa nhà phát hành",
                description: "Cấu hình nhà phát hành đáng tin cậy đã được xóa thành công."
            },
            error: {
                message: "Xóa thất bại",
                description: "Đã xảy ra lỗi khi xóa cấu hình nhà phát hành."
            }
        }
    }
};
