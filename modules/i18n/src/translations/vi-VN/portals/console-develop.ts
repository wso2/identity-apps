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
export const develop: ConsoleNS["develop"] = {
    componentExtensions: {
        component: {
            application: {
                quickStart: {
                    title: "Bắt đầu nhanh"
                }
            }
        }
    },
    features: {
        authenticationProvider: {
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
                placeholder: "Tìm kiếm theo tên"
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
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Nếu bạn xóa kết nối này, bạn sẽ không thể khôi phục lại. " +
                        "Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn kết nối."
                },
                deleteIDPWithConnectedApps: {
                    assertionHint: "",
                    content: "Hãy xóa các liên kết khỏi những ứng dụng này trước khi xóa:",
                    header: "Không thể xóa",
                    message: "Có các ứng dụng đang sử dụng kết nối này."
                },
                deleteCertificate: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Đây là chứng chỉ duy nhất khả dụng cho nhà phát hành token đáng tin cậy này. " +
                        "Nếu chứng chỉ này bị xóa, {{productName}} sẽ không thể xác thực các token " +
                        "được phát hành từ nhà phát hành này nữa.<1> Hãy tiếp tục một cách thận trọng.</1>",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn chứng chỉ."
                }
            },
            dangerZoneGroup: {
                deleteIDP: {
                    actionTitle: "Xóa",
                    header: "Xóa kết nối",
                    subheader: "Sau khi xóa, không thể khôi phục lại. Vui lòng chắc chắn."
                },
                disableIDP: {
                    actionTitle: "{{ state }} kết nối",
                    header: "{{ state }} kết nối",
                    subheader: "Sau khi vô hiệu hóa, kết nối không thể được sử dụng cho đến khi bạn bật lại.",
                    subheader2: "Bật kết nối để sử dụng với các ứng dụng của bạn."
                },
                header: "Vùng nguy hiểm"
            },
            edit: {
                common: {
                    settings: {
                        tabName: "Cài đặt"
                    }
                },
                emailOTP: {
                    emailTemplate: {
                        tabName: "Mẫu email <1>(Sắp ra mắt)</1>"
                    }
                },
                smsOTP: {
                    smsProvider:{
                        tabName: "Nhà cung cấp SMS <1>(Sắp ra mắt)</1>"
                    }
                }
            },
            forms: {
                advancedConfigs: {
                    alias: {
                        hint: "Nếu nhà cung cấp danh tính cục bộ được biết đến bằng một alias tại nhà cung cấp " +
                            "danh tính liên kết, hãy chỉ định tại đây.",
                        label: "Alias",
                        placeholder: "Nhập giá trị cho Alias."
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
                        hint: "Chọn nếu đối tượng này trỏ đến một nhà cung cấp danh tính trung tâm liên kết",
                        label: "Trung tâm liên kết"
                    },
                    homeRealmIdentifier: {
                        hint: "Nhập định danh home realm cho nhà cung cấp danh tính này",
                        label: "Định danh Home Realm",
                        placeholder: "Nhập giá trị cho Định danh Home Realm."
                    }
                },
                attributeSettings: {
                    attributeListItem: {
                        validation: {
                            empty: "Vui lòng nhập một giá trị"
                        }
                    },
                    attributeMapping: {
                        attributeColumnHeader: "Thuộc tính",
                        attributeMapColumnHeader: "Thuộc tính nhà cung cấp danh tính",
                        attributeMapInputPlaceholderPrefix: "vd: thuộc tính của IdP cho ",
                        componentHeading: "Ánh xạ thuộc tính",
                        hint: "Thêm các thuộc tính được nhà cung cấp danh tính hỗ trợ"
                    },
                    attributeProvisioning: {
                        attributeColumnHeader: {
                            0: "Thuộc tính",
                            1: "Thuộc tính nhà cung cấp danh tính"
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
                authenticatorSettings: {
                    apple: {
                        additionalQueryParameters: {
                            hint: "Các tham số truy vấn bổ sung sẽ được gửi đến Apple.",
                            label: "Tham số truy vấn bổ sung",
                            placeholder: "Nhập các tham số truy vấn bổ sung.",
                            validations: {
                                required: "Tham số truy vấn bổ sung không phải là trường bắt buộc."
                            }
                        },
                        callbackUrl: {
                            hint: "URI chuyển hướng được ủy quyền dùng để lấy thông tin xác thực từ Apple.",
                            label: "URI chuyển hướng được ủy quyền",
                            placeholder: "Nhập URI chuyển hướng được ủy quyền.",
                            validations: {
                                required: "URI chuyển hướng được ủy quyền là trường bắt buộc."
                            }
                        },
                        clientId: {
                            hint: "Định danh duy nhất được cung cấp khi tạo Apple Services ID.",
                            label: "Services ID",
                            placeholder: "Nhập Services ID đã đăng ký cho ứng dụng Apple.",
                            validations: {
                                required: "Services ID là trường bắt buộc."
                            }
                        },
                        keyId: {
                            hint: "Định danh khóa được tạo khi đăng ký khóa riêng cho " +
                                "ứng dụng Apple.",
                            label: "Key ID",
                            placeholder: "Nhập Key ID của khóa riêng của ứng dụng.",
                            validations: {
                                required: "Key ID là trường bắt buộc."
                            }
                        },
                        privateKey: {
                            hint: "Khóa riêng được tạo cho ứng dụng Apple.",
                            label: "Khóa riêng",
                            placeholder: "Nhập khóa riêng được tạo cho ứng dụng Apple.",
                            validations: {
                                required: "Khóa riêng là trường bắt buộc."
                            }
                        },
                        secretValidityPeriod: {
                            hint: "Thời hạn hiệu lực của client secret được tạo, tính bằng giây. Một client secret mới " +
                                "sẽ được tạo sau thời gian này.",
                            label: "Thời hạn hiệu lực Client Secret",
                            placeholder: "Nhập thời hạn hiệu lực cho Client Secret.",
                            validations: {
                                required: "Thời hạn hiệu lực Client Secret không phải là trường bắt buộc."
                            }
                        },
                        scopes: {
                            heading: "Phạm vi",
                            hint: "Loại quyền truy cập được cấp cho các ứng dụng đã kết nối để truy cập dữ liệu " +
                                "từ Apple. Nhấn <1>tại đây</1> để tìm hiểu thêm.",
                            list: {
                                email: {
                                    description: "Cấp quyền đọc địa chỉ email của người dùng."
                                },
                                name: {
                                    description: "Cấp quyền đọc các trường tên của người dùng."
                                }
                            }
                        },
                        teamId: {
                            hint: "ID duy nhất được tạo và gán cho nhóm nhà phát triển Apple.",
                            label: "Team ID",
                            placeholder: "Nhập Team ID của nhóm nhà phát triển Apple.",
                            validations: {
                                required: "Team ID là trường bắt buộc."
                            }
                        }
                    },
                    emailOTP: {
                        enableBackupCodes: {
                            hint: "Cho phép người dùng xác thực bằng mã dự phòng.",
                            label: "Bật xác thực bằng mã dự phòng",
                            validations: {
                                required: "Bật xác thực bằng mã dự phòng là trường bắt buộc."
                            }
                        },
                        expiryTime: {
                            hint: "Vui lòng chọn giá trị trong khoảng <1>1 phút</1> & <3>1440 phút (1 ngày)</3>.",
                            label: "Thời gian hết hạn Email OTP",
                            placeholder: "Nhập thời gian hết hạn Email OTP.",
                            unit: "phút",
                            validations: {
                                invalid: "Thời gian hết hạn Email OTP phải là một số nguyên.",
                                range: "Thời gian hết hạn Email OTP phải trong khoảng 1 phút & 1440 phút (1 ngày).",
                                required: "Thời gian hết hạn Email OTP là trường bắt buộc."
                            }
                        },
                        tokenLength: {
                            hint: "Số ký tự được phép trong OTP. Vui lòng " +
                                "chọn giá trị trong khoảng <1>4-10</1>.",
                            label: "Độ dài Email OTP",
                            placeholder: "Nhập độ dài Email OTP.",
                            unit: {
                                digits: "chữ số",
                                characters: "ký tự"
                            },
                            validations: {
                                invalid: "Độ dài Email OTP phải là một số nguyên.",
                                range: {
                                    characters: "Độ dài Email OTP phải trong khoảng 4 & 10 ký tự.",
                                    digits: "Độ dài Email OTP phải trong khoảng 4 & 10 chữ số."
                                },
                                required: "Độ dài Email OTP là trường bắt buộc."
                            }
                        },
                        allowedResendAttemptCount: {
                            hint: "Số lần được phép gửi lại OTP.",
                            label: "Số lần gửi lại OTP được phép",
                            placeholder: "Nhập số lần gửi lại được phép.",
                            validations: {
                                required: "Số lần gửi lại OTP được phép là trường bắt buộc.",
                                invalid: "Số lần gửi lại OTP được phép phải là một số nguyên.",
                                range: "Số lần gửi lại OTP được phép phải trong khoảng 0 & 100."
                            }
                        },
                        resendBlockDuration: {
                            hint: "Khoảng thời gian người dùng bị chặn yêu cầu OTP mới " +
                                "sau khi đạt số lần gửi lại tối đa được phép.",
                            label: "Thời gian chặn gửi lại OTP",
                            placeholder: "Nhập thời gian chặn gửi lại OTP.",
                            validations: {
                                required: "Thời gian chặn gửi lại OTP là trường bắt buộc.",
                                invalid: "Thời gian chặn gửi lại OTP phải là một số nguyên.",
                                range: "Thời gian chặn gửi lại OTP phải trong khoảng 0 & 10000 phút."
                            }
                        },
                        useAlphanumericChars: {
                            hint: "Vui lòng chọn ô này để bật ký tự chữ và số. Nếu không, ký tự số sẽ được dùng.",
                            label: "Dùng ký tự chữ và số cho OTP",
                            validations: {
                                required: "Dùng ký tự chữ và số cho OTP là trường bắt buộc."
                            }
                        }
                    },
                    smsOTP: {
                        hint: "Hãy đảm bảo rằng một <1>Nhà cung cấp SMS</1> đã được cấu hình để tính năng OTP hoạt động đúng.",
                        expiryTime: {
                            hint: "Vui lòng chọn giá trị trong khoảng <1>1 phút</1> & <3> 1440 phút (1 ngày)</3>.",
                            label: "Thời gian hết hạn SMS OTP",
                            placeholder: "Nhập thời gian hết hạn SMS OTP.",
                            unit: "phút",
                            validations: {
                                invalid: "Thời gian hết hạn SMS OTP phải là một số nguyên.",
                                range: "Thời gian hết hạn SMS OTP phải trong khoảng 1 phút & 1440 phút (1 ngày).",
                                required: "Thời gian hết hạn SMS OTP là trường bắt buộc."
                            }
                        },
                        tokenLength: {
                            hint: "Số ký tự được phép trong OTP. Vui lòng " +
                                "chọn giá trị trong khoảng <1>4-10</1>.",
                            label: "Độ dài SMS OTP",
                            placeholder: "Nhập độ dài SMS OTP.",
                            validations: {
                                invalid: "Độ dài SMS OTP phải là một số nguyên.",
                                range: {
                                    digits: "Độ dài SMS OTP phải trong khoảng 4 & 10 chữ số.",
                                    characters: "Độ dài SMS OTP phải trong khoảng 4 & 10 ký tự."
                                },
                                required: "Độ dài SMS OTP là trường bắt buộc."
                            },
                            unit: {
                                digits: "chữ số",
                                characters: "ký tự"
                            }
                        },
                        useNumericChars: {
                            hint: "Vui lòng bỏ chọn ô này để bật ký tự chữ và số.",
                            label: "Chỉ dùng ký tự số cho OTP",
                            validations: {
                                required: "Chỉ dùng ký tự số cho token OTP là trường bắt buộc."
                            }
                        },
                        allowedResendAttemptCount: {
                            hint: "Số lần được phép gửi lại OTP.",
                            label: "Số lần gửi lại OTP được phép",
                            placeholder: "Nhập số lần gửi lại được phép.",
                            validations: {
                                required: "Số lần gửi lại OTP được phép là trường bắt buộc.",
                                invalid: "Số lần gửi lại OTP được phép phải là một số nguyên.",
                                range: "Số lần gửi lại OTP được phép phải trong khoảng 0 & 100."
                            }
                        },
                        resendBlockDuration: {
                            hint: "Khoảng thời gian chặn các yêu cầu gửi lại OTP sau khi đạt số lần gửi lại tối đa được phép",
                            label: "Thời gian chặn gửi lại OTP",
                            placeholder: "Nhập thời gian chặn gửi lại theo phút.",
                            unit: "phút",
                            validations: {
                                required: "Thời gian chặn gửi lại OTP là trường bắt buộc.",
                                invalid: "Thời gian chặn gửi lại OTP phải là một số nguyên.",
                                range: "Thời gian chặn gửi lại OTP phải trong khoảng 1 phút & 1440 phút (1 ngày)."
                            }
                        }
                    },
                    fido2: {
                        allowProgressiveEnrollment: {
                            label: "Cho phép đăng ký passkey tăng dần",
                            hint: "Vui lòng bỏ chọn ô này để tắt đăng ký passkey tăng dần."
                        },
                        allowUsernamelessAuthentication: {
                            label: "Cho phép xác thực passkey không cần tên đăng nhập",
                            hint: "Vui lòng bỏ chọn ô này để tắt xác thực không cần tên đăng nhập."
                        }
                    },
                    facebook: {
                        callbackUrl: {
                            hint: "URI chuyển hướng được chỉ định là hợp lệ trong ứng dụng Facebook OAuth.",
                            label: "URI chuyển hướng OAuth hợp lệ",
                            placeholder: "Nhập URI chuyển hướng OAuth hợp lệ.",
                            validations: {
                                required: "URI chuyển hướng OAuth hợp lệ là trường bắt buộc."
                            }
                        },
                        clientId: {
                            hint: "ID duy nhất được tạo khi ứng dụng Facebook OAuth " +
                                "được tạo.",
                            label: "App ID",
                            placeholder: "Nhập App ID từ ứng dụng Facebook.",
                            validations: {
                                required: "App ID là trường bắt buộc."
                            }
                        },
                        clientSecret: {
                            hint: "Giá trị <1>App secret</1> của ứng dụng Facebook OAuth.",
                            label: "App secret",
                            placeholder: "Nhập App secret từ ứng dụng Facebook.",
                            validations: {
                                required: "App secret là trường bắt buộc."
                            }
                        },
                        scopes: {
                            heading: "Quyền",
                            hint: "Quyền được cấp cho các ứng dụng đã kết nối để truy cập dữ liệu từ Facebook. " +
                                "Nhấn <1>tại đây</> để tìm hiểu thêm.",
                            list: {
                                email: {
                                    description: "Cấp quyền đọc địa chỉ email chính của người dùng."
                                },
                                profile: {
                                    description: "Cấp quyền đọc các trường hồ sơ công khai mặc định của người dùng."
                                }
                            }
                        },
                        userInfo: {
                            heading: "Các trường thông tin người dùng",
                            hint: "Các trường hồ sơ công khai mặc định được yêu cầu của người dùng. Những thông tin này có thể " +
                                "mang lại cho người dùng ứng dụng đã xác thực trải nghiệm trong ứng dụng được cá nhân hóa. Nhấn " +
                                "<1>tại đây</1> để tìm hiểu thêm.",
                            list: {
                                ageRange: {
                                    description: "Phân khúc độ tuổi của người này được biểu diễn bằng độ tuổi tối thiểu và " +
                                        "tối đa."
                                },
                                email: {
                                    description: "Địa chỉ email chính của người dùng được liệt kê trên hồ sơ của họ."
                                },
                                firstName: {
                                    description: "Tên của người này."
                                },
                                gender: {
                                    description: "Giới tính do người này chọn, nam hoặc nữ."
                                },
                                id: {
                                    description: "App-Scoped User ID của người dùng ứng dụng."
                                },
                                lastName: {
                                    description: "Họ của người này."
                                },
                                link: {
                                    description: "Liên kết đến Dòng thời gian của người này."
                                },
                                name: {
                                    description: "Tên đầy đủ của người này."
                                }
                            },
                            placeholder: "Nhập các trường cần trích xuất từ hồ sơ người dùng."
                        }
                    },
                    github: {
                        callbackUrl: {
                            hint: "Tập hợp các URI chuyển hướng được chỉ định là hợp lệ trong GitHub cho ứng dụng OAuth của bạn.",
                            label: "URL callback ủy quyền",
                            placeholder: "Nhập URL callback ủy quyền.",
                            validations: {
                                required: "URL callback ủy quyền là trường bắt buộc."
                            }
                        },
                        clientId: {
                            hint: "<1>Client ID</1> bạn nhận được từ GitHub cho ứng dụng OAuth của bạn.",
                            label: "Client ID",
                            placeholder: "Nhập Client ID từ ứng dụng Github.",
                            validations: {
                                required: "Client ID là trường bắt buộc."
                            }
                        },
                        clientSecret: {
                            hint: "<1>Client secret</1> bạn nhận được từ GitHub cho ứng dụng OAuth của bạn.",
                            label: "Client secret",
                            placeholder: "Nhập Client secret từ ứng dụng Github.",
                            validations: {
                                required: "Client secret là trường bắt buộc."
                            }
                        },
                        scopes: {
                            heading: "Phạm vi",
                            hint: "Loại quyền truy cập được cấp cho các ứng dụng đã kết nối để truy cập dữ liệu " +
                                "từ GitHub. Nhấn <1>tại đây</1> để tìm hiểu thêm.",
                            list: {
                                email: {
                                    description: "Cấp quyền đọc các địa chỉ email của người dùng."
                                },
                                profile: {
                                    description: "Cấp quyền đọc dữ liệu hồ sơ của người dùng."
                                }
                            }
                        }
                    },
                    google: {
                        AdditionalQueryParameters: {
                            ariaLabel: "Tham số truy vấn bổ sung cho phương thức xác thực Google",
                            hint: "Các tham số truy vấn bổ sung sẽ được gửi đến Google.",
                            label: "Tham số truy vấn bổ sung",
                            placeholder: "Nhập các tham số truy vấn bổ sung.",
                            validations: {
                                required: "Client secret không phải là trường bắt buộc."
                            }
                        },
                        callbackUrl: {
                            hint: "URI chuyển hướng được ủy quyền dùng để lấy thông tin xác thực từ Google.",
                            label: "URI chuyển hướng được ủy quyền",
                            placeholder: "Nhập URI chuyển hướng được ủy quyền.",
                            validations: {
                                required: "URI chuyển hướng được ủy quyền là trường bắt buộc."
                            }
                        },
                        clientId: {
                            hint: "<1>Client ID</1> bạn nhận được từ Google cho ứng dụng OAuth của bạn.",
                            label: "Client ID",
                            placeholder: "Nhập Client ID từ ứng dụng Google.",
                            validations: {
                                required: "Client ID là trường bắt buộc."
                            }
                        },
                        clientSecret: {
                            hint: "<1>Client secret</1> bạn nhận được từ Google cho ứng dụng OAuth của bạn.",
                            label: "Client secret",
                            placeholder: "Nhập Client secret từ ứng dụng Google.",
                            validations: {
                                required: "Client secret là trường bắt buộc."
                            }
                        },
                        enableGoogleOneTap: {
                            hint: "Bật Google One Tap như một tùy chọn đăng nhập",
                            label: "Google One Tap",
                            placeholder: "Google one tap như một tùy chọn đăng nhập"
                        },
                        scopes: {
                            heading: "Phạm vi",
                            hint: "Loại quyền truy cập được cấp cho các ứng dụng đã kết nối để truy cập dữ liệu " +
                                "từ Google. Nhấn <1>tại đây</1> để tìm hiểu thêm.",
                            list: {
                                email: {
                                    description: "Cho phép xem địa chỉ email của người dùng."
                                },
                                openid: {
                                    description: "Cho phép xác thực bằng OpenID Connect."
                                },
                                profile: {
                                    description: "Cho phép xem dữ liệu hồ sơ cơ bản của người dùng."
                                }
                            }
                        }
                    },
                    microsoft: {
                        commonAuthQueryParams: {
                            ariaLabel: "Tham số truy vấn bổ sung cho phương thức xác thực Microsoft",
                            hint: "Các tham số truy vấn bổ sung sẽ được gửi đến Microsoft.",
                            label: "Tham số truy vấn bổ sung",
                            placeholder: "Nhập các tham số truy vấn bổ sung.",
                            validations: {
                                required: "Client secret không phải là trường bắt buộc."
                            }
                        },
                        callbackUrl: {
                            hint: "URI chuyển hướng được ủy quyền dùng để lấy thông tin xác thực từ Microsoft.",
                            label: "URI chuyển hướng được ủy quyền",
                            placeholder: "Nhập URI chuyển hướng được ủy quyền.",
                            validations: {
                                required: "URI chuyển hướng được ủy quyền là trường bắt buộc."
                            }
                        },
                        clientId: {
                            hint: "<1>Client ID</1> bạn nhận được từ Microsoft cho ứng dụng OAuth của bạn.",
                            label: "Client ID",
                            placeholder: "Nhập Client ID từ ứng dụng Microsoft.",
                            validations: {
                                required: "Client ID là trường bắt buộc."
                            }
                        },
                        clientSecret: {
                            hint: "<1>Client secret</1> bạn nhận được từ Microsoft cho ứng dụng OAuth của bạn.",
                            label: "Client secret",
                            placeholder: "Nhập Client secret từ ứng dụng Microsoft.",
                            validations: {
                                required: "Client secret là trường bắt buộc."
                            }
                        },
                        scopes: {
                            ariaLabel: "Các phạm vi do Microsoft Authenticator cung cấp",
                            heading: "Phạm vi",
                            hint: "Loại quyền truy cập được cấp cho các ứng dụng đã kết nối để truy cập dữ liệu " +
                                "từ Microsoft. Nhấn <1>tại đây</1> để tìm hiểu thêm.",
                            label: "Phạm vi",
                            list: {
                                email: {
                                    description: "Cho phép xem địa chỉ email của người dùng."
                                },
                                openid: {
                                    description: "Cho phép xác thực bằng OpenID Connect."
                                },
                                profile: {
                                    description: "Cho phép xem dữ liệu hồ sơ cơ bản của người dùng."
                                }
                            },
                            placeholder: "vd: openid"
                        }
                    },
                    hypr: {
                        appId: {
                            hint: "<1>Application ID</1> bạn nhận được từ HYPR cho ứng dụng OAuth của bạn.",
                            label: "Relying Party App ID",
                            placeholder: "Nhập App ID từ ứng dụng HYPR.",
                            validations: {
                                required: "Relying Party App ID là trường bắt buộc."
                            }
                        },
                        apiToken: {
                            hint: "Access token của ứng dụng relying party được tạo trong control center.",
                            label: "API Token",
                            placeholder: "Nhập API token từ HYPR",
                            validations: {
                                required: "API token là trường bắt buộc."
                            }
                        },
                        baseUrl: {
                            hint: "URL cơ sở của triển khai máy chủ HYPR của bạn.",
                            label: "URL cơ sở",
                            placeholder: "Nhập URL cơ sở của máy chủ HYPR",
                            validations: {
                                required: "URL cơ sở là trường bắt buộc."
                            }
                        }
                    },
                    iproov: {
                        baseUrl: {
                            hint: "URL cơ sở của iProov",
                            label: "URL cơ sở",
                            placeholder: "Nhập URL cơ sở.",
                            validations: {
                                required: "URL cơ sở là trường bắt buộc."
                            }
                        },
                        oauthUsername: {
                            hint: "Tên đăng nhập OAuth từ nhà cung cấp danh tính đã tạo trong iProov.",
                            label: "Tên đăng nhập OAuth",
                            placeholder: "Nhập tên đăng nhập OAuth từ nhà cung cấp danh tính đã tạo trong iProov.",
                            validations: {
                                required: "Tên đăng nhập OAuth là trường bắt buộc."
                            }
                        },
                        oauthPassword: {
                            hint: "Mật khẩu OAuth từ nhà cung cấp danh tính đã tạo trong iProov.",
                            label: "Mật khẩu OAuth",
                            placeholder: "Nhập mật khẩu OAuth từ nhà cung cấp danh tính đã tạo trong iProov.",
                            validations: {
                                required: "Mật khẩu OAuth là trường bắt buộc."
                            }
                        },
                        apiKey: {
                            hint: "API Key từ nhà cung cấp danh tính đã tạo trong iProov.",
                            label: "API Key",
                            placeholder: "Nhập API Key từ nhà cung cấp danh tính đã tạo trong iProov.",
                            validations: {
                                required: "API Key là trường bắt buộc."
                            }
                        },
                        apiSecret: {
                            hint: "API Secret từ nhà cung cấp danh tính đã tạo trong iProov.",
                            label: "API Secret",
                            placeholder: "Nhập API Secret từ nhà cung cấp danh tính đã tạo trong iProov.",
                            validations: {
                                required: "API Secret là trường bắt buộc."
                            }
                        },
                        enableProgressiveEnrollment: {
                            hint: "Bật đăng ký tăng dần với iProov.",
                            label: "Bật đăng ký tăng dần"
                        }
                    },
                    saml: {
                        AuthRedirectUrl: {
                            ariaLabel: "URL dịch vụ tiêu thụ SAML assertion",
                            hint: "URL Assertion Consumer Service (ACS) xác định nơi" +
                                " {{productName}} mong đợi nhà cung cấp danh tính bên ngoài gửi" +
                                " phản hồi SAML.",
                            label: "URL Assertion Consumer Service (ACS)",
                            placeholder: "URL Assertion Consumer Service (ACS)"
                        },
                        DigestAlgorithm: {
                            ariaLabel: "Chọn thuật toán digest cho mô tả.",
                            label: "Chọn thuật toán digest",
                            placeholder: "Chọn thuật toán digest"
                        },
                        ISAuthnReqSigned: {
                            ariaLabel: "Yêu cầu xác thực có được ký không?",
                            hint: "Khi được bật, {{productName}} sẽ ký yêu cầu xác thực" +
                                " SAML2 gửi đến IdP bên ngoài.",
                            label: "Ký yêu cầu xác thực"
                        },
                        IdPEntityId: {
                            ariaLabel: "ID thực thể nhà cung cấp danh tính",
                            hint: "Đây là giá trị <1>&lt;saml2:Issuer&gt;</1> được chỉ định trong" +
                                " các phản hồi SAML do IdP bên ngoài phát hành. Ngoài ra, giá trị này cần" +
                                " là duy nhất để xác định IdP bên ngoài trong tổ chức của bạn.",
                            label: "ID thực thể nhà cung cấp danh tính",
                            placeholder: "Nhập ID thực thể nhà cung cấp danh tính"
                        },
                        IncludeProtocolBinding: {
                            ariaLabel: "Bao gồm protocol binding trong yêu cầu",
                            hint: "Chỉ định liệu cơ chế vận chuyển có được bao gồm trong" +
                                " yêu cầu xác thực hay không.",
                            label: "Bao gồm protocol binding trong yêu cầu"
                        },
                        IsAuthnRespSigned: {
                            ariaLabel: "Phản hồi xác thực luôn phải được ký?",
                            hint: "Chỉ định liệu phản hồi xác thực SAML2 từ" +
                                " IdP bên ngoài có phải được ký hay không.",
                            label: "Xác minh nghiêm ngặt thông tin chữ ký phản hồi xác thực"
                        },
                        IsLogoutEnabled: {
                            ariaLabel: "Chỉ định liệu đăng xuất có được bật cho IdP không",
                            hint: "Chỉ định liệu đăng xuất có được IdP bên ngoài hỗ trợ không.",
                            label: "Đã bật đăng xuất nhà cung cấp danh tính"
                        },
                        IsLogoutReqSigned: {
                            ariaLabel: "Chỉ định liệu đăng xuất có được bật cho IdP không",
                            hint: "Khi được bật, {{productName}} sẽ ký yêu cầu" +
                                " đăng xuất SAML2 gửi đến IdP bên ngoài.",
                            label: "Ký yêu cầu đăng xuất",
                            placeholder: ""
                        },
                        IsSLORequestAccepted: {
                            ariaLabel: "Chỉ định liệu đăng xuất có được bật cho IdP không",
                            hint: "Chỉ định liệu yêu cầu đăng xuất đơn từ" +
                                " IdP có phải được {{productName}} chấp nhận không.",
                            label: "Chấp nhận yêu cầu đăng xuất của nhà cung cấp danh tính"
                        },
                        IsUserIdInClaims: {
                            ariaLabel: "Dùng Name ID làm định danh người dùng.",
                            hint: "Để chỉ định một thuộc tính từ SAML 2.0 assertion làm định danh" +
                                " người dùng, hãy cấu hình thuộc tính subject từ phần thuộc tính.",
                            label: "Tìm ID người dùng từ các thuộc tính"
                        },
                        LogoutReqUrl: {
                            ariaLabel: "Chỉ định URL đăng xuất SAML 2.0 IdP",
                            hint: "Nhập giá trị URL đăng xuất của IdP nếu nó khác với URL đăng nhập một lần (Single Sign-On)" +
                                " đã đề cập ở trên.",
                            label: "URL đăng xuất IdP",
                            placeholder: "Nhập URL đăng xuất"
                        },
                        NameIDType: {
                            ariaLabel: "Chọn NameIDFormat cho SAML 2.0 assertion",
                            hint: "Điều này chỉ định định dạng định danh tên được dùng để " +
                                "trao đổi thông tin về người dùng trong SAML " +
                                "assertion được gửi từ IdP bên ngoài.",
                            label: "Định dạng NameID của nhà cung cấp danh tính",
                            placeholder: "Chọn NameIDFormat của nhà cung cấp danh tính"
                        },
                        RequestMethod: {
                            ariaLabel: "Giao thức HTTP cho các binding SAML 2.0",
                            hint: "Điều này chỉ định các cơ chế vận chuyển thông điệp SAML" +
                                " trong các giao thức truyền thông.",
                            label: "Binding giao thức HTTP",
                            placeholder: "Chọn binding giao thức HTTP"
                        },
                        SPEntityId: {
                            ariaLabel: "ID thực thể nhà cung cấp dịch vụ",
                            hint: "Giá trị này sẽ được dùng làm <1><saml2:Issuer></1> trong các" +
                                " yêu cầu SAML được khởi tạo từ {{productName}} đến" +
                                " nhà cung cấp danh tính bên ngoài (IdP). Bạn cần cung cấp" +
                                " một giá trị duy nhất làm ID thực thể nhà cung cấp dịch vụ (SP).",
                            label: "ID thực thể nhà cung cấp dịch vụ",
                            placeholder: "Nhập ID thực thể nhà cung cấp dịch vụ"
                        },
                        SSOUrl: {
                            ariaLabel: "URL đăng nhập một lần",
                            hint: "URL đăng nhập một lần của IdP bên ngoài. Đây là " +
                                "nơi {{productName}} sẽ gửi các yêu cầu xác thực của mình.",
                            label: "URL đăng nhập một lần của nhà cung cấp danh tính",
                            placeholder: "https://ENTERPRISE_IDP/samlsso"
                        },
                        SignatureAlgorithm: {
                            ariaLabel: "Chọn thuật toán chữ ký để ký yêu cầu.",
                            label: "Thuật toán chữ ký",
                            placeholder: "Chọn thuật toán chữ ký."
                        },
                        commonAuthQueryParams: {
                            ariaLabel: "Tham số truy vấn bổ sung cho yêu cầu SAML",
                            label: "Tham số truy vấn bổ sung"
                        },
                        isAssertionSigned: {
                            ariaLabel: "Bật ký assertion",
                            hint: "Chỉ định liệu phần tử SAMLAssertion có được ký không",
                            label: "Bật ký assertion"
                        },
                        includeCert:  {
                            ariaLabel: "Bao gồm chứng chỉ công khai",
                            hint: "Bao gồm chứng chỉ công khai trong yêu cầu",
                            label: "Bao gồm chứng chỉ công khai"
                        },
                        includeNameIDPolicy: {
                            ariaLabel: "Bao gồm Name ID Policy",
                            hint: "Bao gồm NameIDPolicy trong yêu cầu",
                            label: "Bao gồm Name ID Policy"
                        },
                        isEnableAssertionEncryption: {
                            ariaLabel: "Bật mã hóa assertion",
                            hint: "Chỉ định liệu phần tử SAMLAssertion có được mã hóa không",
                            label: "Bật mã hóa assertion"
                        },
                        authenticationContextClass: {
                            ariaLabel: "Lớp ngữ cảnh xác thực",
                            hint: "Lớp ngữ cảnh xác thực",
                            label: "Lớp ngữ cảnh xác thực",
                            placeholder: "Tìm kiếm các lớp ngữ cảnh xác thực khả dụng"
                        },
                        customAuthenticationContextClass: {
                            ariaLabel: "Lớp ngữ cảnh xác thực tùy chỉnh",
                            hint: "Chỉ định lớp ngữ cảnh xác thực tùy chỉnh",
                            label: "Lớp ngữ cảnh xác thực tùy chỉnh",
                            placeholder: "Nhập lớp ngữ cảnh xác thực tùy chỉnh"
                        },
                        attributeConsumingServiceIndex: {
                            ariaLabel: "Chỉ số dịch vụ tiêu thụ thuộc tính",
                            hint: "Chỉ định Chỉ số dịch vụ tiêu thụ thuộc tính",
                            label: "Chỉ số dịch vụ tiêu thụ thuộc tính",
                            placeholder: "Nhập chỉ số dịch vụ tiêu thụ thuộc tính"
                        },
                        isArtifactBindingEnabled: {
                            ariaLabel: "Bật artifact binding",
                            hint: "Bật artifact binding",
                            label: "Bật artifact binding"
                        },
                        artifactResolveEndpointUrl: {
                            ariaLabel: "URL endpoint phân giải artifact",
                            hint: "Chỉ định URL endpoint phân giải artifact",
                            label: "URL endpoint phân giải artifact",
                            placeholder: "Nhập URL endpoint phân giải artifact"
                        },
                        isArtifactResolveReqSigned: {
                            ariaLabel: "Ký yêu cầu phân giải artifact",
                            hint: "Ký yêu cầu phân giải artifact",
                            label: "Ký yêu cầu phân giải artifact"
                        },
                        isArtifactResponseSigned: {
                            ariaLabel: "Ký phản hồi artifact",
                            hint: "Ký phản hồi artifact",
                            label: "Ký phản hồi artifact"
                        },
                        authContextComparisonLevel: {
                            ariaLabel: "Mức so sánh ngữ cảnh xác thực",
                            hint: "Mức so sánh ngữ cảnh xác thực",
                            label: "Mức so sánh ngữ cảnh xác thực",
                            placeholder: ""
                        }
                    }
                },
                common: {
                    customProperties: "Thuộc tính tùy chỉnh",
                    invalidQueryParamErrorMessage: "Đây không phải là các tham số truy vấn hợp lệ",
                    invalidScopesErrorMessage: "Phạm vi phải chứa 'openid'",
                    invalidURLErrorMessage: "Nhập một URL hợp lệ",
                    requiredErrorMessage: "Trường này không được để trống"
                },
                generalDetails: {
                    description: {
                        hint: "Mô tả dạng văn bản của kết nối.",
                        label: "Mô tả",
                        placeholder: "Nhập mô tả cho kết nối."
                    },
                    image: {
                        hint: "URL hình ảnh của kết nối để hiển thị. Nếu không được cung cấp, " +
                            "một hình thu nhỏ được tạo sẽ được hiển thị. Kích thước khuyến nghị là 200x200 pixel.",
                        label: "Logo",
                        placeholder: "https://myapp-resources.io/my_app_image.png"
                    },
                    name: {
                        hint: "Nhập một tên duy nhất cho kết nối này.",
                        label: "Tên",
                        placeholder: "Nhập tên cho kết nối.",
                        validations: {
                            duplicate: "Đã tồn tại một kết nối với tên này",
                            empty: "Cần có tên kết nối",
                            maxLengthReached: "Tên kết nối không được vượt quá {{ maxLength }} ký tự.",
                            required: "Cần có tên kết nối"
                        }
                    },
                    issuer: {
                        hint: "Giá trị issuer duy nhất của nhà phát hành token đáng tin cậy.",
                        label: "Issuer",
                        placeholder: "Nhập issuer."
                    },
                    alias: {
                        hint: "Giá trị alias cho {{productName}} trong nhà phát hành token đáng tin cậy.",
                        label: "Alias",
                        placeholder: "Nhập alias."
                    }
                },
                jitProvisioning: {
                    associateLocalUser: {
                        label: "Liên kết người dùng được cấp phát với người dùng cục bộ hiện có",
                        hint: "Khi được bật, người dùng được cấp phát với nhà cung cấp danh tính " +
                            "này sẽ được liên kết với người dùng cục bộ đã được đăng ký " +
                            "với cùng địa chỉ email."
                    },
                    enableJITProvisioning: {
                        disabledMessageContent: "Bạn không thể tắt thiết lập cấp phát người dùng Just-in-Time " +
                            "vì các ứng dụng sau đây yêu cầu nó phải được bật.",
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
                outboundProvisioningRoles: {
                    heading: "Vai trò cấp phát ra ngoài",
                    hint: "Chọn và thêm làm vai trò cấp phát ra ngoài của nhà cung cấp danh tính",
                    label: "Vai trò",
                    placeHolder: "Chọn vai trò",
                    popup: {
                        content: "Thêm vai trò"
                    }
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
                    valueName: "Vai trò nhà cung cấp danh tính"
                },
                uriAttributeSettings: {
                    group: {
                        heading: "Nhóm",
                        hint: "Chỉ định thuộc tính xác định các nhóm tại kết nối.",
                        label: "Thuộc tính nhóm",
                        mappedRolesAbsentMessage: "Với cấu hình hiện tại, <1>Thuộc tính nhóm</1> chưa được cấu hình. " +
                            "Bạn có thể chọn một thuộc tính từ danh sách thả xuống.",
                        mappedRolesPresentMessage: "Xin lưu ý rằng <1>{{ mappedRolesClaim }}</1> được ánh xạ tới thuộc tính <1>{{ rolesClaim }}</1> " +
                            "sẽ được coi là <1>Thuộc tính nhóm</1> mặc định với cấu hình hiện tại. " +
                            "Bạn có thể chọn một thuộc tính từ danh sách thả xuống.",
                        messageOIDC: "Xin lưu ý rằng thuộc tính OpenID Connect có tên <1>{{ attribute }}</1> sẽ được coi là " +
                            "<1>Thuộc tính nhóm</1> mặc định vì bạn chưa thêm ánh xạ thuộc tính tùy chỉnh.",
                        messageSAML: "Xin lưu ý rằng thuộc tính <1>{{ attribute }}</1> sẽ được coi là " +
                            "<1>Thuộc tính nhóm</1> mặc định vì bạn chưa thêm ánh xạ thuộc tính tùy chỉnh.",
                        placeHolder: "Chọn thuộc tính",
                        roleMappingDisabledMessage: "<1>Ánh xạ thuộc tính tùy chỉnh</1> đã bị tắt trong " +
                            "cấu hình hệ thống của bạn. Điều này có thể ảnh hưởng đến một số luồng liên quan đến " +
                            "kết nối. Hãy tiếp tục một cách thận trọng.",
                        validation: {
                            empty: "Vui lòng chọn một thuộc tính cho các nhóm"
                        }
                    },
                    subject: {
                        heading: "Subject",
                        hint: "Thuộc tính xác định người dùng tại kết nối doanh nghiệp. " +
                            "Khi các thuộc tính được cấu hình dựa trên phản hồi xác thực của " +
                            "kết nối này, bạn có thể dùng một trong số chúng làm subject. " +
                            "Nếu không, <1>saml2:Subject</1> mặc định trong phản hồi SAML sẽ được dùng " +
                            "làm thuộc tính subject.",
                        label: "Thuộc tính Subject",
                        placeHolder: "Subject mặc định",
                        validation: {
                            empty: "Vui lòng chọn một thuộc tính cho subject"
                        }
                    }
                },
                certificateSection: {
                    heading: "Chứng chỉ",
                    description: "Thông tin chứng chỉ được cung cấp tại đây được dùng để xác minh các phản hồi đã ký từ nhà cung cấp danh tính bên ngoài (IdP).",
                    info: "Việc xác minh này chỉ áp dụng cho đăng xuất do IdP liên kết khởi tạo và các luồng xác thực liên kết " +
                    "sử dụng xác thực app-native dựa trên SDK gốc.",
                    certificateEditSwitch: {
                        jwks: "Dùng endpoint JWKS",
                        pem: "Cung cấp chứng chỉ"
                    },
                    noCertificateAlert: "Không có chứng chỉ nào khả dụng cho nhà phát hành token đáng tin cậy này. " +
                        "Do đó, {{productName}} sẽ không thể xác thực các token được phát hành từ nhà phát hành này nữa."
                }
            },
            helpPanel: {
                tabs: {
                    samples: {
                        content: {
                            docs: {
                                goBack: "Quay lại",
                                hint: "Nhấn vào các loại nhà cung cấp danh tính sau để xem " +
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
                    subTitle: "Thêm phương thức xác thực mới vào kết nối",
                    title: "Thêm phương thức xác thực mới"
                },
                addCertificate: {
                    subTitle: "Thêm chứng chỉ mới vào kết nối",
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
            placeHolders: {
                emptyAuthenticatorList: {
                    subtitles: {
                        0: "Hiện tại không có phương thức xác thực nào khả dụng.",
                        1: "Bạn có thể thêm phương thức xác thực mới một cách dễ dàng bằng cách sử dụng",
                        2: "các template được định nghĩa sẵn."
                    },
                    title: "Thêm phương thức xác thực"
                },
                emptyCertificateList: {
                    subtitles: {
                        0: "IdP này chưa có chứng chỉ nào được thêm.",
                        1: "Thêm một chứng chỉ để xem tại đây."
                    },
                    title: "Không có chứng chỉ"
                },
                emptyConnectionTypeList: {
                    subtitles: {
                        0: "Hiện tại không có loại kết nối nào khả dụng.",
                        1: "để cấu hình."
                    },
                    title: "Không tìm thấy loại kết nối nào"
                },
                emptyConnectorList: {
                    subtitles: {
                        0: "IdP này chưa cấu hình connector cấp phát ra ngoài nào.",
                        1: "Thêm một connector để xem tại đây."
                    },
                    title: "Không có connector cấp phát ra ngoài"
                },
                emptyIDPList: {
                    subtitles: {
                        0: "Hiện tại không có kết nối nào khả dụng.",
                        1: "Bạn có thể thêm kết nối mới bằng cách làm theo",
                        2: "các bước trong trình hướng dẫn tạo."
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
            popups: {
                appStatus: {
                    disabled: {
                        content: "Kết nối đã bị vô hiệu hóa. Vui lòng bật nhà cung cấp " +
                            "xác thực để sử dụng các dịch vụ của nó.",
                        header: "Đã vô hiệu hóa",
                        subHeader: ""
                    },
                    enabled: {
                        content: "Kết nối đã được bật.",
                        header: "Đã bật",
                        subHeader: ""
                    }
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
                deleteConnection: {
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
                deleteIDPWithConnectedApps: {
                    "error": {
                        "description": "Có các ứng dụng đang sử dụng kết nối này.",
                        "message": "Không thể xóa"
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
                disableIDPWithConnectedApps: {
                    "error": {
                        "description": "Có các ứng dụng đang sử dụng kết nối này.",
                        "message": "Không thể vô hiệu hóa"
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
                getConnectionDetails: {
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
                        description: "Đã xảy ra lỗi khi lấy template IdP.",
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
                updateAttributes: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi cập nhật"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật thuộc tính kết nối.",
                        message: "Lỗi cập nhật"
                    },
                    success: {
                        description: "Đã cập nhật thuộc tính kết nối thành công.",
                        message: "Cập nhật thành công"
                    }
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
                updateEmailOTPAuthenticator: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi cập nhật"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật connector Email OTP.",
                        message: "Lỗi cập nhật"
                    },
                    success: {
                        description: "Đã cập nhật connector Email OTP thành công.",
                        message: "Cập nhật thành công"
                    }
                },
                updateSMSOTPAuthenticator: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi cập nhật"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật connector SMS OTP.",
                        message: "Lỗi cập nhật"
                    },
                    success: {
                        description: "Đã cập nhật connector SMS OTP thành công.",
                        message: "Cập nhật thành công"
                    }
                },
                updateGenericAuthenticator: {
                    error: {
                        description: "{{ description }}",
                        message: "Lỗi cập nhật"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật connector.",
                        message: "Lỗi cập nhật"
                    },
                    success: {
                        description: "Đã cập nhật connector thành công.",
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
            templates: {
                apple: {
                    wizardHelp: {
                        clientId: {
                            description: "Cung cấp <1>Services ID</1> đã tạo tại Apple.",
                            heading: "Services ID"
                        },
                        heading: "Trợ giúp",
                        keyId: {
                            description: "Cung cấp <1>Key Identifier</1> của khóa riêng đã tạo.",
                            heading: "Key ID"
                        },
                        name: {
                            connectionDescription: "Cung cấp một tên duy nhất cho kết nối.",
                            idpDescription: "Cung cấp một tên duy nhất cho kết nối.",
                            heading: "Tên"
                        },
                        preRequisites: {
                            configureAppleSignIn: "Xem hướng dẫn của Apple về cấu hình môi trường cho" +
                            " Sign in with Apple.",
                            configureReturnURL: "Thêm URL sau làm <1>Return URL</1>.",
                            configureWebDomain: "Dùng giá trị sau làm <1>Web Domain</1>.",
                            getCredentials: "Trước khi bắt đầu, hãy tạo một ứng dụng bật <1>Sign in With Apple</1>" +
                                " trên <3>Apple Developer Portal</3> với một <5>Services ID</5> và một" +
                                " <5>khóa riêng</5>.",
                            heading: "Điều kiện tiên quyết"
                        },
                        privateKey: {
                            description: "Cung cấp <1>khóa riêng</1> được tạo cho ứng dụng.",
                            heading: "Khóa riêng"
                        },
                        subHeading: "Sử dụng hướng dẫn bên dưới",
                        teamId: {
                            description: "Cung cấp <1>Team ID</1> của nhà phát triển Apple.",
                            heading: "Team ID"
                        }
                    }
                },
                enterprise: {
                    addWizard: {
                        subtitle: "Cấu hình một IdP để kết nối bằng các giao thức xác thực tiêu chuẩn.",
                        title: "Kết nối dựa trên tiêu chuẩn"
                    },
                    saml: {
                        preRequisites: {
                            configureIdp: "Xem hướng dẫn của Asgardeo về cấu hình SAML IdP",
                            configureRedirectURL: "Dùng URL sau làm " +
                                "<1>URL Assertion Consumer Service (ACS)</1>.",
                            heading: "Điều kiện tiên quyết",
                            hint: "URL Assertion Consumer Service (ACS) xác định" +
                                " nơi {{productName}} mong đợi nhà cung cấp danh tính" +
                                " bên ngoài gửi phản hồi SAML."
                        }
                    },
                    validation: {
                        invalidName: "{{idpName}} không phải là tên hợp lệ. Tên không được chứa bất kỳ ký tự" +
                            " chữ và số nào khác ngoài dấu chấm (.), dấu gạch ngang (-), dấu gạch dưới (_) và dấu cách.",
                        name: "Tên nhà cung cấp xác minh danh tính không hợp lệ"
                    }
                },
                trustedTokenIssuer: {
                    addWizard: {
                        title: "Nhà phát hành token đáng tin cậy",
                        subtitle: "Đăng ký một nhà phát hành token đáng tin cậy để trao đổi token của nó lấy token do {{productName}} phát hành"
                    },
                    forms: {
                        steps: {
                            general: "Cài đặt chung",
                            certificate: "Chứng chỉ"
                        },
                        name: {
                            label: "Tên nhà phát hành token đáng tin cậy",
                            placeholder: "Nhập tên cho nhà phát hành token đáng tin cậy"
                        },
                        issuer: {
                            label: "Issuer",
                            placeholder: "Nhập issuer",
                            hint: "Giá trị issuer duy nhất của nhà phát hành token đáng tin cậy.",
                            validation: {
                                notValid: "{{issuer}} không phải là issuer hợp lệ."
                            }
                        },
                        alias: {
                            label: "Alias",
                            placeholder: "Nhập alias",
                            hint: "Giá trị alias cho {{productName}} trong nhà phát hành token đáng tin cậy.",
                            validation: {
                                notValid: "{{alias}} không phải là alias hợp lệ."
                            }
                        },
                        certificateType: {
                            label: "Chế độ cấu hình chứng chỉ",
                            requiredCertificate: "Cần có chứng chỉ để tạo nhà phát hành token đáng tin cậy."
                        },
                        jwksUrl: {
                            optionLabel: "Endpoint JWKS",
                            placeholder: "Nhập URL endpoint JWKS",
                            label: "URL endpoint JWKS",
                            hint: "{{productName}} sẽ dùng URL này để lấy khóa nhằm xác minh các phản hồi đã ký từ " +
                                "nhà phát hành token đáng tin cậy của bạn.",
                            validation: {
                                notValid: "Vui lòng nhập một URL hợp lệ"
                            }
                        },
                        pem: {
                            optionLabel: "Dùng chứng chỉ PEM",
                            hint: "{{productName}} sẽ dùng chứng chỉ này để xác minh các phản hồi đã ký từ " +
                                "nhà phát hành token đáng tin cậy của bạn.",
                            uploadCertificateButtonLabel: "Tải lên tệp chứng chỉ",
                            dropzoneText: "Kéo và thả tệp chứng chỉ vào đây.",
                            pasteAreaPlaceholderText: "Dán chứng chỉ nhà phát hành token đáng tin cậy ở định dạng PEM."
                        }
                    }
                },
                expert: {
                    wizardHelp: {
                        description: {
                            connectionDescription: "Cung cấp một tên duy nhất cho kết nối.",
                            heading: "Tên",
                            idpDescription: "Cung cấp một tên duy nhất cho kết nối."
                        },
                        heading: "Trợ giúp",
                        name: {
                            connectionDescription: "Cung cấp mô tả cho kết nối để giải thích rõ hơn về nó.",
                            heading: "Mô tả",
                            idpDescription: "Cung cấp mô tả cho kết nối để giải thích rõ hơn về nó."
                        },
                        subHeading: "Sử dụng hướng dẫn bên dưới"
                    }
                },
                facebook: {
                    wizardHelp: {
                        clientId: {
                            description: "Cung cấp <1>App ID</1> bạn nhận được từ Facebook khi " +
                                "đăng ký ứng dụng OAuth.",
                            heading: "App ID"
                        },
                        clientSecret: {
                            description: "Cung cấp <1>App secret</1> bạn nhận được từ Facebook khi " +
                                "đăng ký ứng dụng OAuth.",
                            heading: "App secret"
                        },
                        heading: "Trợ giúp",
                        name: {
                            connectionDescription: "Cung cấp một tên duy nhất cho kết nối.",
                            heading: "Tên",
                            idpDescription: "Cung cấp một tên duy nhất cho kết nối."
                        },
                        preRequisites: {
                            configureOAuthApps: "Xem hướng dẫn của Facebook về cấu hình ứng dụng.",
                            configureRedirectURL: "Thêm URL sau làm <1>URI chuyển hướng OAuth hợp lệ</1>.",
                            configureSiteURL: "Dùng giá trị sau làm <1>Site URL</1>.",
                            getCredentials: "Trước khi bắt đầu, hãy tạo một <1>ứng dụng</1> " +
                                "<3>trên Facebook</3>, và lấy <5>App ID & secret</5>.",
                            heading: "Điều kiện tiên quyết"
                        },
                        subHeading: "Sử dụng hướng dẫn bên dưới"
                    }
                },
                github: {
                    wizardHelp: {
                        clientId: {
                            description: "Cung cấp <1>Client ID</1> bạn nhận được từ GitHub khi " +
                                "đăng ký ứng dụng OAuth.",
                            heading: "Client ID"
                        },
                        clientSecret: {
                            description: "Cung cấp <1>Client secret</1> bạn nhận được từ GitHub khi " +
                                "đăng ký ứng dụng OAuth.",
                            heading: "Client secret"
                        },
                        heading: "Trợ giúp",
                        name: {
                            connectionDescription: "Cung cấp một tên duy nhất cho kết nối.",
                            heading: "Tên",
                            idpDescription: "Cung cấp một tên duy nhất cho kết nối."
                        },
                        preRequisites: {
                            configureHomePageURL: "Dùng giá trị sau làm <1>HomePage URL</1>.",
                            configureOAuthApps: "Xem hướng dẫn của GitHub về cấu hình OAuth Apps.",
                            configureRedirectURL: "Thêm URL sau làm <1>URL callback ủy quyền</1>.",
                            getCredentials: "Trước khi bắt đầu, hãy tạo một <1>ứng dụng OAuth</1> " +
                                "<3>trên GitHub</3>, và lấy <5>client ID & secret</5>.",
                            heading: "Điều kiện tiên quyết"
                        },
                        subHeading: "Sử dụng hướng dẫn bên dưới"
                    }
                },
                google: {
                    wizardHelp: {
                        clientId: {
                            description: "Cung cấp <1>Client ID</1> bạn nhận được từ Google khi " +
                                "đăng ký ứng dụng OAuth.",
                            heading: "Client ID"
                        },
                        clientSecret: {
                            description: "Cung cấp <1>Client secret</1> bạn nhận được từ Google khi " +
                                "đăng ký ứng dụng OAuth.",
                            heading: "Client secret"
                        },
                        heading: "Trợ giúp",
                        name: {
                            connectionDescription: "Cung cấp một tên duy nhất cho kết nối.",
                            heading: "Tên",
                            idpDescription: "Cung cấp một tên duy nhất cho kết nối."
                        },
                        preRequisites: {
                            configureOAuthApps: "Xem hướng dẫn của Google về cấu hình OAuth Apps.",
                            configureRedirectURL: "Thêm URL sau làm <1>URI chuyển hướng được ủy quyền</1>.",
                            getCredentials: "Trước khi bắt đầu, hãy tạo một <1>ứng dụng OAuth</1> " +
                                "<3>trên Google Console</3>, và lấy <5>client ID & secret</5>.",
                            heading: "Điều kiện tiên quyết"
                        },
                        subHeading: "Sử dụng hướng dẫn bên dưới"
                    }
                },
                organizationIDP: {
                    wizardHelp: {
                        name: {
                            description: "Cung cấp một tên duy nhất cho nhà cung cấp xác thực doanh nghiệp để" +
                                " có thể dễ dàng nhận diện.",
                            heading: "Tên"
                        },
                        description: {
                            description: "Cung cấp mô tả cho nhà cung cấp xác thực doanh nghiệp để" +
                                " giải thích rõ hơn về nó.",
                            heading: "Mô tả",
                            example: "Ví dụ: Đây là phương thức xác thực cho MyOrg, đóng vai trò IdP cho MyApp."
                        }
                    }
                },
                microsoft: {
                    wizardHelp: {
                        clientId: {
                            description: "Cung cấp <1>Client ID</1> bạn nhận được từ Microsoft khi " +
                                "đăng ký ứng dụng OAuth.",
                            heading: "Client ID"
                        },
                        clientSecret: {
                            description: "Cung cấp <1>Client secret</1> bạn nhận được từ Microsoft khi " +
                                "đăng ký ứng dụng OAuth.",
                            heading: "Client secret"
                        },
                        heading: "Trợ giúp",
                        name: {
                            connectionDescription: "Cung cấp một tên duy nhất cho kết nối.",
                            heading: "Tên",
                            idpDescription: "Cung cấp một tên duy nhất cho kết nối."
                        },
                        preRequisites: {
                            configureOAuthApps: "Xem hướng dẫn của Microsoft về cấu hình OAuth Apps.",
                            configureRedirectURL: "Thêm URL sau làm <1>URI chuyển hướng được ủy quyền</1>.",
                            getCredentials: "Trước khi bắt đầu, hãy tạo một <1>ứng dụng OAuth</1> " +
                                "<3>trên Microsoft</3>, và lấy <5>client ID & secret</5>.",
                            heading: "Điều kiện tiên quyết"
                        },
                        subHeading: "Sử dụng hướng dẫn bên dưới"
                    }
                },
                hypr: {
                    wizardHelp: {
                        apiToken: {
                            description: "Cung cấp <1>API Token</1> lấy được từ HYPR. Token này sẽ được dùng để truy cập các API của HYPR.",
                            heading: "API Token"
                        },
                        appId: {
                            description: "Cung cấp <1>Application ID</1> của ứng dụng đã đăng ký trong control center của HYPR.",
                            heading: "App ID"
                        },
                        baseUrl: {
                            description: "Cung cấp <1>URL cơ sở</1> của triển khai máy chủ HYPR của bạn.",
                            heading: "URL cơ sở"
                        },
                        heading: "Trợ giúp",
                        name: {
                            connectionDescription: "Cung cấp một tên duy nhất cho kết nối.",
                            heading: "Tên",
                            idpDescription: "Cung cấp một tên duy nhất cho kết nối."
                        },
                        preRequisites: {
                            rpDescription: "Trước khi bắt đầu, hãy tạo một ứng dụng relying party trong <1>control center của HYPR</1>, và lấy application ID.",
                            tokenDescription: "Bạn cũng cần lấy một <1>API token</1> cho ứng dụng đã tạo trên HYPR.",
                            heading: "Điều kiện tiên quyết"
                        }
                    }
                },
                iproov: {
                    wizardHelp: {
                        baseUrl: {
                            description: "Cung cấp <1>URL cơ sở</1> của triển khai máy chủ iProov của bạn.",
                            heading: "URL cơ sở"
                        },
                        oauthUsername: {
                            description: "Cung cấp <1>Tên đăng nhập OAuth</1> của ứng dụng đã đăng ký trong control center của iProov.",
                            heading: "Tên đăng nhập OAUTH"
                        },
                        oauthPassword: {
                            description: "Cung cấp <1>Mật khẩu OAuth</1> của ứng dụng đã đăng ký trong control center của iProov.",
                            heading: "Mật khẩu OAUTH"
                        },
                        apiKey: {
                            description: "Cung cấp <1>API Key</1> của ứng dụng đã đăng ký trong control center của iProov.",
                            heading: "API Key"
                        },
                        apiSecret: {
                            description: "Cung cấp <1>API Secret</1> của ứng dụng đã đăng ký trong control center của iProov.",
                            heading: "API Secret"
                        },
                        enableProgressiveEnrollment: {
                            description: "Bật đăng ký tăng dần với iProov.",
                            heading: "Bật đăng ký tăng dần"
                        },
                        heading: "Trợ giúp",
                        name: {
                            connectionDescription: "Cung cấp một tên duy nhất cho kết nối.",
                            heading: "Tên",
                            idpDescription: "Cung cấp một tên duy nhất cho kết nối."
                        },
                        preRequisites: {
                            appDescription: "Trước khi bắt đầu, hãy tạo một nhà cung cấp danh tính trong <1>iPortal</1>, và lấy API key, API Secret, tên đăng nhập OAuth và mật khẩu OAuth.",
                            heading: "Điều kiện tiên quyết"
                        }
                    }
                },
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
                        authenticatorSettings: {
                            emptyPlaceholder: {
                                subtitles: [
                                    "Phương thức xác thực này không có cài đặt nào để",
                                    "cấu hình ở cấp độ này. Chỉ cần nhấn <1>Hoàn tất</1>."
                                ],
                                title: "Không có cài đặt nào khả dụng cho phương thức xác thực này."
                            }
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
                            title: "Chi tiết connector"
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
        },
        suborganizations: {
            notifications: {
                tierLimitReachedError: {
                    emptyPlaceholder: {
                        action: "Xem các gói",
                        subtitles: "Bạn có thể liên hệ quản trị viên tổ chức hoặc (nếu bạn là " +
                            "quản trị viên) nâng cấp gói đăng ký để tăng giới hạn cho phép.",
                        title: "Bạn đã đạt số lượng tổ chức tối đa được phép."
                    },
                    heading: "Bạn đã đạt giới hạn tối đa cho tổ chức"
                },
                subOrgLevelsLimitReachedError: {
                    emptyPlaceholder: {
                        action: "Xem các gói",
                        subtitles: "Bạn có thể liên hệ quản trị viên tổ chức hoặc (nếu bạn là " +
                            "quản trị viên) nâng cấp gói đăng ký để tăng giới hạn cho phép.",
                        title: "Bạn đã đạt số cấp tổ chức tối đa được phép."
                    },
                    heading: "Bạn đã đạt số cấp tổ chức tối đa được phép cho tổ chức."
                },
                duplicateOrgError: {
                    message: "Đã tồn tại một tổ chức có cùng tên.",
                    description: "Tổ chức bạn đang cố tạo đã tồn tại."
                }
            }
        },
        footer: {
            copyright: "WSO2 Identity Server © {{year}}"
        },
        header: {
            links: {
                adminPortalNav: "Cổng quản trị",
                userPortalNav: "My Account"
            }
        },
        overview: {
            banner: {
                heading: "WSO2 Identity Server cho nhà phát triển",
                subHeading: "Tận dụng SDK & các công cụ nhà phát triển khác để xây dựng trải nghiệm tùy chỉnh",
                welcome: "Chào mừng, {{username}}"
            },
            quickLinks: {
                cards: {
                    applications: {
                        heading: "Ứng dụng",
                        subHeading: "Tạo ứng dụng bằng các template định nghĩa sẵn và quản lý cấu hình."
                    },
                    authenticationProviders: {
                        heading: "Kết nối",
                        subHeading: "Tạo và quản lý các kết nối để sử dụng trong luồng đăng nhập của ứng dụng."
                    },
                    idps: {
                        heading: "Kết nối",
                        subHeading: "Tạo và quản lý các kết nối dựa trên template và cấu hình xác thực."
                    },
                    remoteFetch: {
                        heading: "Remote Fetch",
                        subHeading: "Cấu hình một kho lưu trữ từ xa để hoạt động liền mạch với WSO2 Identity Server."
                    }
                }
            }
        },
        sidePanel: {
            applicationEdit: "Chỉnh sửa ứng dụng",
            applicationTemplates: "Template ứng dụng",
            applications: "Ứng dụng",
            authenticationProviderEdit: "Chỉnh sửa kết nối",
            authenticationProviderTemplates: "Template kết nối",
            authenticationProviders: "Kết nối",
            categories: {
                application: "Ứng dụng",
                authenticationProviders: "Kết nối",
                general: "Chung",
                gettingStarted: "Bắt đầu",
                identityProviders: "Kết nối",
                identityVerificationProviders: "Nhà cung cấp xác minh danh tính",
                extensions: "Tiện ích mở rộng"
            },
            customize: "Tùy chỉnh",
            flowExtensionEdit: "Chỉnh sửa tiện ích luồng",
            identityProviderEdit: "Chỉnh sửa kết nối",
            identityProviderTemplates: "Template kết nối",
            identityProviders: "Kết nối",
            oidcScopes: "Phạm vi",
            oidcScopesEdit: "Chỉnh sửa phạm vi",
            overview: "Tổng quan",
            remoteRepo: "Cấu hình kho từ xa",
            remoteRepoEdit: "Chỉnh sửa cấu hình kho từ xa"
        },
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
        applicationTemplate: {
            backButton: "Quay lại Ứng dụng",
            subTitle: "Tạo ứng dụng bằng một trong các template bên dưới. Nếu không có template nào phù hợp với " +
                "loại ứng dụng của bạn, hãy bắt đầu với template Ứng dụng dựa trên tiêu chuẩn.",
            title: "Tạo ứng dụng mới"
        },
        applications: {
            alternateSubTitle: "Quản lý các ứng dụng của bạn và tùy chỉnh luồng đăng nhập.",
            subTitle: "Tạo và quản lý các ứng dụng của bạn và cấu hình đăng nhập.",
            title: "Ứng dụng"
        },
        applicationsEdit: {
            backButton: "Quay lại Ứng dụng",
            subTitle: null,
            title: null
        },
        applicationsSettings: {
            backButton: "Quay lại Ứng dụng",
            subTitle: "Dynamic Client Registration (DCR) có thể được dùng để tạo ứng dụng bằng API DCR.",
            title: "Dynamic Client Registration",
            learnMore: "Tìm hiểu thêm",
            notifications: {
                error: {
                    description: "{{description}}",
                    message: "Lỗi cập nhật"
                },
                genericError: {
                    description: "Không thể cập nhật cấu hình DCR.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Đã cập nhật cấu hình DCR thành công.",
                    message: "Cập nhật thành công"
                }
            }
        },
        authenticationProvider: {
            subTitle: "Tạo và quản lý các kết nối để sử dụng trong luồng đăng nhập của ứng dụng.",
            title: "Kết nối"
        },
        authenticationProviderTemplate: {
            backButton: "Quay lại Kết nối",
            disabledHint: {
                apple: "Tính năng Sign in with Apple không thể được cấu hình với localhost hoặc 127.0.0.1. Việc thử thiết lập này sẽ dẫn đến lỗi miền không hợp lệ từ bước cấu hình của Apple. Để thử nghiệm, hãy dùng một tên miền thật hoặc có thể phân giải DNS. Với phát triển cục bộ, có thể dùng ánh xạ miền trong tệp `etc/hosts`."
            },
            search: {
                placeholder: "Tìm kiếm theo tên"
            },
            subTitle: "Chọn một loại kết nối và tạo một kết nối mới.",
            supportServices: {
                authenticationDisplayName: "Xác thực",
                provisioningDisplayName: "Cấp phát"
            },
            title: "Tạo kết nối mới"
        },
        idp: {
            subTitle: "Quản lý các kết nối để cho phép người dùng đăng nhập vào ứng dụng của bạn thông qua chúng.",
            title: "Kết nối"
        },
        idpTemplate: {
            backButton: "Quay lại kết nối",
            subTitle: "Chọn một trong các kết nối sau.",
            supportServices: {
                authenticationDisplayName: "Xác thực",
                provisioningDisplayName: "Cấp phát"
            },
            title: "Chọn kết nối"
        },
        idvp: {
            subTitle: "Quản lý các nhà cung cấp xác minh danh tính để cho phép người dùng xác minh danh tính " +
                "của họ thông qua chúng.",
            title: "Nhà cung cấp xác minh danh tính"
        },
        idvpTemplate: {
            backButton: "Quay lại Nhà cung cấp xác minh danh tính",
            subTitle: "Chọn một trong các nhà cung cấp xác minh danh tính sau.",
            title: "Chọn nhà cung cấp xác minh danh tính",
            search: {
                placeholder: "Tìm kiếm theo tên"
            }
        },
        overview: {
            subTitle: "Cấu hình và quản lý ứng dụng, kết nối, người dùng và vai trò, dialect " +
                "thuộc tính, v.v.",
            title: "Chào mừng, {{firstName}}"
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
    },
    technologies: {
        android: "Android",
        angular: "Angular",
        ios: "iOS",
        java: "Java",
        python: "Python",
        react: "React",
        windows: "Windows"
    }
};
