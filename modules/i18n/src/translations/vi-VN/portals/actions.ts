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

import { actionsNS } from "../../../models";

export const actions: actionsNS = {
    buttons: {
        addCertificate: "Thêm chứng chỉ",
        cancel: "Hủy",
        changeAuthentication: "Thay đổi xác thực",
        create: "Tạo",
        update: "Cập nhật"
    },
    certificateDeleteConfirmationModal: {
        assertionHint: "Vui lòng xác nhận thao tác của bạn.",
        content: "N/A",
        header: "Bạn có chắc không?",
        message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn chứng chỉ.",
        primaryAction: "Xóa",
        secondaryAction: "Hủy"
    },
    certificateWizard: {
        add : {
            heading: "Add New Certificate",
            subHeading: "Add new certificate to the action"
        },
        change : {
            heading: "Thay đổi chứng chỉ",
            subHeading: "Thay đổi chứng chỉ của action"
        }
    },
    confirmationModal: {
        assertionHint: "Vui lòng xác nhận thao tác của bạn.",
        content: "Nếu bạn xóa cấu hình này, dịch vụ mở rộng luồng của bạn sẽ không được thực thi." +
        " Vui lòng tiếp tục một cách thận trọng.",
        header: "Bạn có chắc không?",
        message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn cấu hình Action."
    },
    dangerZoneGroup: {
        header: "Vùng nguy hiểm",
        revertConfig: {
            actionTitle: "Xóa",
            heading: "Xóa cấu hình Action",
            subHeading: "Sau khi action bị xóa, không thể khôi phục lại và các cấu hình" +
            " của endpoint bên ngoài sẽ bị mất."
        }
    },
    fields: {
        allowedHeaders: {
            hint: "Các tiêu đề yêu cầu trong luồng liên quan sẽ được chia sẻ với dịch vụ bên ngoài.",
            label: "Tiêu đề được phép",
            placeholder: "Tên tiêu đề",
            tooltip: "Thêm tiêu đề",
            validations: {
                invalid: "Vui lòng nhập một tên tiêu đề hợp lệ."
            }
        },
        allowedParameters: {
            hint: "Các tham số yêu cầu trong luồng liên quan sẽ được chia sẻ với dịch vụ bên ngoài.",
            label: "Tham số được phép",
            placeholder: "Tên tham số",
            tooltip: "Thêm tham số",
            validations: {
                invalid: "Vui lòng nhập một tên tham số hợp lệ."
            }
        },
        authentication: {
            info: {
                message: "Nếu bạn đang thay đổi xác thực, hãy lưu ý rằng các secret xác thực" +
                " của endpoint bên ngoài cần được cập nhật.",
                title: {
                    noneAuthType: "Chưa cấu hình xác thực nào.",
                    otherAuthType: "Đã cấu hình cơ chế xác thực <strong>{{ authType }}</strong>."
                }
            },
            label: "Xác thực",
            types: {
                apiKey: {
                    name: "API Key",
                    properties: {
                        header: {
                            hint: "Phải là chuỗi chỉ chứa chữ cái (a-z, A-Z), số (0-9), " +
                            "dấu chấm (.) và dấu gạch ngang (-), và phải bắt đầu bằng ký tự chữ và số.",
                            label: "Tiêu đề",
                            placeholder: "Tiêu đề",
                            validations: {
                                empty: "Tiêu đề là trường bắt buộc.",
                                invalid: "Vui lòng chọn một tên tiêu đề hợp lệ tuân theo các hướng dẫn đã cho."
                            }
                        },
                        value: {
                            label: "Giá trị",
                            placeholder: "Giá trị",
                            validations: {
                                empty: "Giá trị là trường bắt buộc."
                            }
                        }
                    }
                },
                basic: {
                    name: "Cơ bản",
                    properties: {
                        password: {
                            label: "Mật khẩu",
                            placeholder: "Mật khẩu",
                            validations: {
                                empty: "Mật khẩu là trường bắt buộc."
                            }
                        },
                        username: {
                            label: "Tên đăng nhập",
                            placeholder: "Tên đăng nhập",
                            validations: {
                                empty: "Tên đăng nhập là trường bắt buộc."
                            }
                        }
                    }
                },
                bearer: {
                    name: "Bearer",
                    properties: {
                        accessToken: {
                            label: "Access Token",
                            placeholder: "Access Token",
                            validations: {
                                empty: "Access Token là trường bắt buộc."
                            }
                        }
                    }
                },
                clientCredential: {
                    name: "Client Credential",
                    properties: {
                        clientId: {
                            label: "Client ID",
                            placeholder: "Client ID",
                            validations: {
                                empty: "Client ID là trường bắt buộc."
                            }
                        },
                        clientSecret: {
                            label: "Client Secret",
                            placeholder: "Client Secret",
                            validations: {
                                empty: "Client Secret là trường bắt buộc."
                            }
                        },
                        scopes: {
                            label: "Phạm vi",
                            placeholder: "Phạm vi"
                        },
                        tokenEndpoint: {
                            label: "Token Endpoint",
                            placeholder: "Token Endpoint",
                            validations: {
                                empty: "Token Endpoint là trường bắt buộc.",
                                invalidUrl: "Vui lòng nhập một URL hợp lệ."
                            }
                        }
                    }
                },
                passwordCredential: {
                    name: "Password Credential",
                    properties: {
                        clientId: {
                            label: "Client ID",
                            placeholder: "Client ID",
                            validations: {
                                empty: "Client ID là trường bắt buộc."
                            }
                        },
                        clientSecret: {
                            label: "Client Secret",
                            placeholder: "Client Secret",
                            validations: {
                                empty: "Client Secret là trường bắt buộc."
                            }
                        },
                        password: {
                            label: "Mật khẩu",
                            placeholder: "Mật khẩu",
                            validations: {
                                empty: "Mật khẩu là trường bắt buộc."
                            }
                        },
                        scopes: {
                            label: "Phạm vi",
                            placeholder: "Phạm vi"
                        },
                        tokenEndpoint: {
                            label: "Token Endpoint",
                            placeholder: "Token Endpoint",
                            validations: {
                                empty: "Token Endpoint là trường bắt buộc.",
                                invalidUrl: "Vui lòng nhập một URL hợp lệ."
                            }
                        },
                        username: {
                            label: "Tên đăng nhập",
                            placeholder: "Tên đăng nhập",
                            validations: {
                                empty: "Tên đăng nhập là trường bắt buộc."
                            }
                        }
                    }
                },
                none: {
                    name: "Không có"
                }
            }
        },
        authenticationType: {
            hint: {
                create: "Sau khi thêm, các secret này sẽ không được hiển thị. Bạn chỉ có thể đặt lại chúng.",
                update: "Sau khi cập nhật, các secret này sẽ không được hiển thị. Bạn chỉ có thể đặt lại chúng một lần nữa."
            },
            label: "Cơ chế xác thực",
            placeholder: "Chọn cơ chế xác thực",
            validations: {
                empty: "Cơ chế xác thực là trường bắt buộc."
            }
        },
        endpoint: {
            hint: "URL của endpoint bên ngoài đã cấu hình để tích hợp với action này.",
            label: "Endpoint",
            placeholder: "https://www.mywebsite.com/extensions",
            validations: {
                empty: "Endpoint là trường bắt buộc.",
                invalidUrl: "Vui lòng nhập một URL hợp lệ.",
                notHttps: "URL không an toàn (HTTP). Dùng HTTPS để có kết nối an toàn."
            }
        },
        name: {
            hint: "Phải là chuỗi chỉ chứa chữ cái (a-z, A-Z), số (0-9), " +
            "dấu cách, dấu gạch dưới (_) và dấu gạch ngang (-).",
            label: "Tên Action",
            placeholder: "Action mẫu",
            validations: {
                empty: "Tên Action là trường bắt buộc.",
                invalid: "Vui lòng chọn một tên hợp lệ tuân theo các hướng dẫn đã cho."
            }
        },
        passwordSharing: {
            certificate: {
                icon: {
                    changecertificate : "Thay đổi chứng chỉ",
                    deletecertificate: "Xóa chứng chỉ",
                    viewcertificate: "Xem chứng chỉ"
                },
                info: {
                    description: "Để giảm thiểu rủi ro lộ thông tin xác thực, rất khuyến nghị mã hóa " +
                        "mọi thông tin xác thực được chia sẻ. Chứng chỉ này sẽ được dùng để mã hóa mật khẩu khi " +
                        "chia sẻ tới dịch vụ bên ngoài.",
                    header: "Xử lý thông tin xác thực an toàn"
                },
                label: "Chứng chỉ"
            },
            format: {
                label: "Định dạng",
                placeholder: "Chọn định dạng",
                validations: "Định dạng chia sẻ mật khẩu là trường bắt buộc"
            },
            label: "Chia sẻ mật khẩu"
        },
        rules: {
            button: "Cấu hình quy tắc",
            info: {
                message: {
                    preIssueAccessToken: "Thực thi cho các yêu cầu token JWT từ bất kỳ ứng dụng nào với các loại grant <0>authorization_code</0>, " +
                    "<1>client_credentials</1>, <2>password</2>, và <3>refresh_token</3>.",
                    preUpdatePassword: "Thực thi cho bất kỳ luồng cập nhật/đặt lại mật khẩu do người dùng hoặc quản trị viên khởi tạo."
                },
                title: "Chưa cấu hình quy tắc thực thi nào."
            },
            label: "Quy tắc thực thi"
        },
        userAttributes: {
            error: {
                limitReached: "Bạn chỉ có thể chọn tối đa 10 thuộc tính."
            },
            heading: "Thuộc tính",
            hint: "Chọn các thuộc tính người dùng cần được chia sẻ với dịch vụ bên ngoài.",
            search: {
                clearButton: "Xóa tất cả",
                placeholder: "Tìm kiếm thuộc tính người dùng"
            }
        }
    },
    goBackActions: "Quay lại Actions",
    notification: {
        error: {
            activate: {
                description: "{{description}}",
                message: "Lỗi khi kích hoạt action mới."
            },
            certificate: {
                add : {
                    description: "{{description}}",
                    message: "Lỗi khi thêm chứng chỉ"
                },
                change: {
                    description: "{{description}}",
                    message : "Lỗi khi thay đổi chứng chỉ"
                },
                delete: {
                    description: "{{description}}",
                    message: "Lỗi khi xóa chứng chỉ"
                }
            },
            create: {
                description: "{{description}}",
                message: "Lỗi khi tạo action mới."
            },
            deactivate: {
                description: "{{description}}",
                message: "Lỗi khi vô hiệu hóa action."
            },
            delete: {
                description: "{{description}}",
                message: "Lỗi khi xóa action."
            },
            fetchById: {
                description: "{{description}}",
                message: "Lỗi khi lấy action."
            },
            fetchByType: {
                description: "{{description}}",
                message: "Lỗi khi lấy danh sách action."
            },
            typesFetch: {
                description: "{{description}}",
                message: "Lỗi khi lấy các loại action."
            },
            update: {
                description: "{{description}}",
                message: "Lỗi khi cập nhật action."
            }
        },
        genericError: {
            activate: {
                description: "Không thể kích hoạt action mới.",
                message: "Đã xảy ra lỗi."
            },
            certificate: {
                add : {
                    description: "Không thể thêm chứng chỉ.",
                    message: "Đã xảy ra lỗi."
                },
                change: {
                    description: "Không thể thay đổi chứng chỉ",
                    message : "Đã xảy ra lỗi."
                },
                delete: {
                    description: "Không thể xóa chứng chỉ",
                    message: "Đã xảy ra lỗi."
                }
            },
            create: {
                description: "Không thể thêm action mới.",
                message: "Đã xảy ra lỗi."
            },
            deactivate: {
                description: "Không thể vô hiệu hóa action mới.",
                message: "Đã xảy ra lỗi."
            },
            delete: {
                description: "Không thể xóa action.",
                message: "Đã xảy ra lỗi."
            },
            fetchById: {
                description: "Không thể lấy action.",
                message: "Đã xảy ra lỗi."
            },
            fetchByType: {
                description: "Không thể lấy danh sách action.",
                message: "Đã xảy ra lỗi."
            },
            typesFetch: {
                description: "Không thể lấy các loại action.",
                message: "Đã xảy ra lỗi."
            },
            update: {
                description: "Không thể cập nhật action.",
                message: "Đã xảy ra lỗi."
            },
            userAttributes: {
                getAttributes: {
                    description: "Không thể lấy các thuộc tính người dùng.",
                    message: "Đã xảy ra lỗi"
                }
            }
        },
        success: {
            activate: {
                description: "Action đã được kích hoạt thành công.",
                message: "Kích hoạt action thành công."
            },
            certificate: {
                add : {
                    description: "Chứng chỉ đã được thêm thành công",
                    message: "Thêm chứng chỉ thành công."
                },
                change: {
                    description: "Chứng chỉ đã được thay đổi thành công",
                    message : "Thay đổi chứng chỉ thành công."
                },
                delete: {
                    description: "Chứng chỉ đã được xóa thành công",
                    message: "Xóa chứng chỉ thành công"
                }
            },
            create: {
                description: "Action mới đã được thêm thành công.",
                message: "Thêm action thành công."
            },
            deactivate: {
                description: "Action đã được vô hiệu hóa thành công.",
                message: "Vô hiệu hóa action thành công."
            },
            delete: {
                description: "Action đã được xóa thành công.",
                message: "Xóa action thành công."
            },
            update: {
                description: "Action đã được cập nhật thành công.",
                message: "Cập nhật action thành công."
            }
        }
    },
    status: {
        active: "Đang hoạt động",
        configured: "Đã cấu hình",
        inactive: "Không hoạt động",
        notConfigured: "Chưa được cấu hình"
    },
    types: {
        preIssueAccessToken: {
            description: {
                expanded:  "Dùng action này để cập nhật claim và phạm vi của access token.",
                shortened: "Action này được thực thi trước khi phát hành access token cho một ứng dụng."
            },
            heading: "Cấp phát access token trước"
        },
        preIssueIdToken: {
            description: {
                expanded: "Dùng action này để cập nhật claim của ID token.",
                shortened: "Action này được thực thi trước khi phát hành ID token cho một ứng dụng."
            },
            heading: "Cấp phát ID token trước"
        },
        preRegistration: {
            description: {
                expanded: "Action này được thực thi trước khi đăng ký một người dùng." +
                "Tham khảo tài liệu về định nghĩa API để triển khai.",
                shortened: "Action này được thực thi trước khi đăng ký một người dùng."
            },
            heading: "Đăng ký trước"
        },
        preUpdatePassword: {
            description: {
                expanded: "Dùng action này để kiểm tra hợp lệ mật khẩu của người dùng.",
                shortened: "Action này được thực thi trước khi cập nhật mật khẩu của người dùng."
            },
            heading: "Cập nhật mật khẩu trước"
        },
        preUpdateProfile: {
            description: {
                expanded: "Dùng action này để kiểm tra hợp lệ thuộc tính người dùng khi cập nhật hồ sơ.",
                shortened: "Action này được thực thi trước khi cập nhật hồ sơ của người dùng."
            },
            heading: "Cập nhật hồ sơ trước"
        }
    },
    versioning: {
        notifications: {
            updateVersion: {
                genericError: {
                    description: "Không thể cập nhật phiên bản action.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Đã cập nhật phiên bản action thành công.",
                    message: "Cập nhật thành công"
                }
            }
        },
        outdated: {
            warning: {
                confirmationModal: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn",
                    content: "Thao tác này không thể hoàn tác và sẽ dẫn đến việc cập nhật vĩnh viễn chức năng của action.",
                    header: "Bạn đã thực hiện các thay đổi liên quan chưa?",
                    message: "Tiếp tục mà không thực hiện các thay đổi cần thiết sẽ khiến hành vi của dịch vụ bên ngoài bị hỏng."
                },
                details: {
                    preRequisite: "Trước khi cập nhật, vui lòng đảm bảo rằng bạn đã đọc <1>tài liệu</1> về bất kỳ thay đổi phá vỡ nào.",
                    title: "Bạn hiện đang sử dụng <1>phiên bản {{currentVersion}}</1> của action này, phiên bản này sẽ sớm không còn được dùng. Vui lòng cập nhật lên <3>phiên bản {{latestVersion}}</3> mới nhất để tiếp tục nhận hỗ trợ và cập nhật."
                },
                hideDetailsButton: "Ẩn chi tiết",
                message: "Một <1>phiên bản {{latestVersion}}</1> mới của action này hiện đã khả dụng. Vui lòng cập nhật lên phiên bản mới nhất.",
                title: "Cần cập nhật.",
                updateButton: "Cập nhật",
                viewDetailsButton: "Xem chi tiết"
            }
        },
        outdatedLabel: "Lỗi thời",
        versionLabel: "Phiên bản {{version}}"
    }
};
