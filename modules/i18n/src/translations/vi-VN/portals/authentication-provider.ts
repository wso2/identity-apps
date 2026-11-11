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

import { AuthenticationProviderNS } from "../../../models";
/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const authenticationProvider:AuthenticationProviderNS = {
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
        deleteCertificate: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Đây là chứng chỉ duy nhất khả dụng cho nhà phát hành token đáng tin cậy này. " +
                "Nếu chứng chỉ này bị xóa, {{productName}} sẽ không thể xác thực các token " +
                "được phát hành từ nhà phát hành này nữa.<1> Hãy tiếp tục một cách thận trọng.</1>",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn chứng chỉ."
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
        deleteIDPWithSharedOrganizations: {
            content: "Hủy chia sẻ kết nối này khỏi tất cả tổ chức bằng tab Truy cập được chia sẻ " +
                "trước khi xóa nó.",
            header: "Không thể xóa",
            message: "Kết nối này được chia sẻ với các tổ chức."
        },
        enableMultipleDeviceProgressiveEnrollment: {
            assertionHint: "Tôi hiểu rủi ro bảo mật và muốn bật tính năng này.",
            content: "Khi được bật, người dùng có thể đăng ký thêm thiết bị push trước khi hoàn thành " +
                "xác thực. Kẻ tấn công có thông tin xác thực chính của người dùng có thể đăng ký " +
                 "thiết bị của riêng chúng trong quá trình đăng nhập và sử dụng nó cho xác thực sau này. Chỉ bật tùy chọn này " +
                "nếu trường hợp sử dụng của bạn yêu cầu.",
            header: "Bạn có chắc không?",
            message: "Bật đăng ký tăng dần cho nhiều thiết bị gây ra rủi ro bảo mật."
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
                secretValidityPeriod: {
                    hint: "Thời hạn hiệu lực của client secret được tạo, tính bằng giây. Một client secret mới " +
                        "sẽ được tạo sau thời gian này.",
                    label: "Thời hạn hiệu lực Client Secret",
                    placeholder: "Nhập thời hạn hiệu lực cho Client Secret.",
                    validations: {
                        required: "Thời hạn hiệu lực Client Secret không phải là trường bắt buộc."
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
            dynamicOptions: {
                disabled: "{{value}} (đã tắt)",
                empty: "Không có kết nối nào phù hợp.",
                loading: "Đang tải các kết nối khả dụng...",
                unavailable: "{{value}} (không khả dụng)"
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
                        characters: "ký tự",
                        digits: "chữ số"
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
                    unit: "lần",
                    validations: {
                        invalid: "Số lần gửi lại OTP được phép phải là một số nguyên.",
                        range: "Số lần gửi lại OTP được phép phải trong khoảng 0 & 100.",
                        required: "Số lần gửi lại OTP được phép là trường bắt buộc."
                    }
                },
                resendBlockDuration: {
                    hint: "Khoảng thời gian chặn gửi lại OTP sau khi " +
                        "vượt quá số lần gửi lại được phép.",
                    label: "Thời gian chặn gửi lại",
                    placeholder: "Nhập thời gian chặn gửi lại.",
                    unit: "phút",
                    validations: {
                        invalid: "Thời gian chặn gửi lại phải là một số nguyên.",
                        range: "Thời gian chặn gửi lại phải trong khoảng 0 & 10000 phút.",
                        required: "Thời gian chặn gửi lại là trường bắt buộc."
                    }
                },
                useAlphanumericChars: {
                    hint: "Vui lòng chọn ô này để bật ký tự chữ và số. "+
                    "Nếu không, ký tự số sẽ được dùng.",
                    label: "Dùng ký tự chữ và số cho OTP",
                    validations: {
                        required: "Dùng ký tự chữ và số cho OTP là trường bắt buộc."
                    }
                },
                notifyEmailSendingFailure: {
                    hint: "Thông báo cho người dùng khi gửi OTP thất bại, thay vì tiếp tục âm thầm.",
                    label: "Thông báo cho người dùng khi gửi OTP thất bại",
                    validations: {
                        required: "Thông báo cho người dùng khi gửi OTP thất bại là trường bắt buộc."
                    }
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
            fido2: {
                allowProgressiveEnrollment: {
                    hint: "Vui lòng bỏ chọn ô này để tắt đăng ký passkey tăng dần.",
                    label: "Cho phép đăng ký passkey tăng dần"
                },
                allowUsernamelessAuthentication: {
                    hint: "Vui lòng bỏ chọn ô này để tắt xác thực không cần tên đăng nhập.",
                    label: "Cho phép xác thực passkey không cần tên đăng nhập"
                },
                trustedOrigins: {
                    hint: "Các origin mà từ đó các yêu cầu xác thực dựa trên FIDO được khởi tạo và cần được máy chủ tin cậy.",
                    label: "Origin tin cậy của Passkey",
                    placeholder: "https://mydomain.io/register",
                    validations: {
                        invalid: "Origin tin cậy đã nhập không hợp lệ."
                    }
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
            hypr: {
                apiToken: {
                    hint: "Access token của ứng dụng relying party được tạo trong control center.",
                    label: "API Token",
                    placeholder: "Nhập API token từ HYPR",
                    validations: {
                        required: "API token là trường bắt buộc."
                    }
                },
                appId: {
                    hint: "<1>Application ID</1> bạn nhận được từ HYPR cho ứng dụng OAuth của bạn.",
                    label: "Relying Party App ID",
                    placeholder: "Nhập App ID từ ứng dụng HYPR.",
                    validations: {
                        required: "Relying Party App ID là trường bắt buộc."
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
                baseUrl: {
                    hint: "URL cơ sở của iProov",
                    label: "URL cơ sở",
                    placeholder: "Nhập URL cơ sở.",
                    validations: {
                        required: "URL cơ sở là trường bắt buộc."
                    }
                },
                enableProgressiveEnrollment: {
                    hint: "Bật đăng ký tăng dần với iProov.",
                    label: "Bật đăng ký tăng dần"
                },
                oauthPassword: {
                    hint: "Mật khẩu OAuth từ nhà cung cấp danh tính đã tạo trong iProov.",
                    label: "Mật khẩu OAuth",
                    placeholder: "Nhập mật khẩu OAuth từ nhà cung cấp danh tính đã tạo trong iProov.",
                    validations: {
                        required: "Mật khẩu OAuth là trường bắt buộc."
                    }
                },
                oauthUsername: {
                    hint: "Tên đăng nhập OAuth từ nhà cung cấp danh tính đã tạo trong iProov.",
                    label: "Tên đăng nhập OAuth",
                    placeholder: "Nhập tên đăng nhập OAuth từ nhà cung cấp danh tính đã tạo trong iProov.",
                    validations: {
                        required: "Tên đăng nhập OAuth là trường bắt buộc."
                    }
                }
            },
            microsoft: {
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
                commonAuthQueryParams: {
                    ariaLabel: "Tham số truy vấn bổ sung cho phương thức xác thực Microsoft",
                    hint: "Các tham số truy vấn bổ sung sẽ được gửi đến Microsoft.",
                    label: "Tham số truy vấn bổ sung",
                    placeholder: "Nhập các tham số truy vấn bổ sung.",
                    validations: {
                        required: "Client secret không phải là trường bắt buộc."
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
                },
                tenant: {
                    guide: "Để nguyên <1>common</1> để cho phép người dùng từ bất kỳ tổ chức Microsoft nào đăng nhập. " +
                        "Để giới hạn đăng nhập vào một tổ chức, hãy nhập ID tenant hoặc miền đã xác minh " +
                        "của thư mục đó. Nếu đăng ký ứng dụng của bạn được đặt thành \"Chỉ tài khoản trong thư mục tổ chức này\" " +
                        "(single-tenant), bạn phải nhập ID tenant. <3>common</3> sẽ không hoạt động.",
                    guideHeading: "ID thư mục (tenant)",
                    hint: "Giữ <1>common</1> để cho phép đăng nhập từ bất kỳ tổ chức Microsoft nào, hoặc nhập " +
                        "ID thư mục (tenant) hoặc miền của bạn (ví dụ: <3>contoso.onmicrosoft.com</3>) để giới hạn " +
                        "đăng nhập vào một tổ chức duy nhất.",
                    info: "Nếu đăng ký ứng dụng Microsoft của bạn dùng \"Chỉ tài khoản trong thư mục tổ chức này\" " +
                        "(single-tenant), hãy nhập ID tenant của bạn tại đây. Để nguyên <1>common</1> sẽ khiến " +
                        "mọi lần đăng nhập qua kết nối này thất bại.",
                    label: "ID thư mục (tenant)",
                    placeholder: "common",
                    validations: {
                        invalid: "Nhập một ID thư mục (tenant) hợp lệ (GUID), một miền như " +
                            "contoso.onmicrosoft.com, hoặc một trong \"common\", \"organizations\", hoặc \"consumers\".",
                        required: "Cần có ID thư mục (tenant). Dùng \"common\" để cho phép bất kỳ " +
                            "tổ chức Microsoft nào."
                    }
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
                artifactResolveEndpointUrl: {
                    ariaLabel: "URL endpoint phân giải artifact",
                    hint: "Chỉ định URL endpoint phân giải artifact",
                    label: "URL endpoint phân giải artifact",
                    placeholder: "Nhập URL endpoint phân giải artifact"
                },
                attributeConsumingServiceIndex: {
                    ariaLabel: "Chỉ số dịch vụ tiêu thụ thuộc tính",
                    hint: "Chỉ định Chỉ số dịch vụ tiêu thụ thuộc tính",
                    label: "Chỉ số dịch vụ tiêu thụ thuộc tính",
                    placeholder: "Nhập chỉ số dịch vụ tiêu thụ thuộc tính"
                },
                authContextComparisonLevel: {
                    ariaLabel: "Mức so sánh ngữ cảnh xác thực",
                    hint: "Mức so sánh ngữ cảnh xác thực",
                    label: "Mức so sánh ngữ cảnh xác thực",
                    placeholder: ""
                },
                authenticationContextClass: {
                    ariaLabel: "Lớp ngữ cảnh xác thực",
                    hint: "Lớp ngữ cảnh xác thực",
                    label: "Lớp ngữ cảnh xác thực",
                    placeholder: "Tìm kiếm các lớp ngữ cảnh xác thực khả dụng"
                },
                commonAuthQueryParams: {
                    ariaLabel: "Tham số truy vấn bổ sung cho yêu cầu SAML",
                    label: "Tham số truy vấn bổ sung"
                },
                customAuthenticationContextClass: {
                    ariaLabel: "Lớp ngữ cảnh xác thực tùy chỉnh",
                    hint: "Chỉ định lớp ngữ cảnh xác thực tùy chỉnh",
                    label: "Lớp ngữ cảnh xác thực tùy chỉnh",
                    placeholder: "Nhập lớp ngữ cảnh xác thực tùy chỉnh"
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
                isArtifactBindingEnabled: {
                    ariaLabel: "Bật artifact binding",
                    hint: "Bật artifact binding",
                    label: "Bật artifact binding"
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
                isAssertionSigned: {
                    ariaLabel: "Bật ký assertion",
                    hint: "Chỉ định liệu phần tử SAMLAssertion có được ký không",
                    label: "Bật ký assertion"
                },
                isEnableAssertionEncryption: {
                    ariaLabel: "Bật mã hóa assertion",
                    hint: "Chỉ định liệu phần tử SAMLAssertion có được mã hóa không",
                    label: "Bật mã hóa assertion"
                },
                samlAuthnRequestProviderName: {
                    hint: "Tên dễ đọc của bên yêu cầu.",
                    label: "Tên nhà cung cấp yêu cầu xác thực",
                    placeholder: "Nhập tên nhà cung cấp yêu cầu xác thực",
                    ariaLabel: "Tên nhà cung cấp yêu cầu xác thực"
                }
            },
            smsOTP: {
                allowedResendAttemptCount: {
                    hint: "Số lần được phép gửi lại OTP.",
                    label: "Số lần gửi lại OTP được phép",
                    placeholder: "Nhập số lần gửi lại được phép.",
                    unit: "lần",
                    validations: {
                        invalid: "Số lần gửi lại OTP được phép phải là một số nguyên.",
                        range: "Số lần gửi lại OTP được phép phải trong khoảng 0 & 100.",
                        required: "Số lần gửi lại OTP được phép là trường bắt buộc."
                    }
                },
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
                hint: "Hãy đảm bảo rằng một <1>Nhà cung cấp SMS</1> đã được cấu hình để tính năng OTP hoạt động đúng.",
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
                },
                tokenLength: {
                    hint: "Số ký tự được phép trong OTP. Vui lòng " +
                        "chọn giá trị trong khoảng <1>4-10</1>.",
                    label: "Độ dài SMS OTP",
                    placeholder: "Nhập độ dài SMS OTP.",
                    unit: {
                        characters: "ký tự",
                        digits: "chữ số"
                    },
                    validations: {
                        invalid: "Độ dài SMS OTP phải là một số nguyên.",
                        range: {
                            characters: "Độ dài SMS OTP phải trong khoảng 4 & 10 ký tự.",
                            digits: "Độ dài SMS OTP phải trong khoảng 4 & 10 chữ số."
                        },
                        required: "Độ dài SMS OTP là trường bắt buộc."
                    }
                },
                useNumericChars: {
                    hint: "Vui lòng bỏ chọn ô này để bật ký tự chữ và số.",
                    label: "Chỉ dùng ký tự số cho OTP",
                    validations: {
                        required: "Chỉ dùng ký tự số cho token OTP là trường bắt buộc."
                    }
                },
                notifySmsSendingFailure: {
                    hint: "Thông báo cho người dùng khi gửi OTP thất bại, thay vì tiếp tục âm thầm.",
                    label: "Thông báo cho người dùng khi gửi OTP thất bại",
                    validations: {
                        required: "Thông báo cho người dùng khi gửi OTP thất bại là trường bắt buộc."
                    }
                }
            },
            push: {
                allowedResendAttemptsCount: {
                    hint: "Số lần được phép gửi lại thông báo đẩy.",
                    label: "Số lần gửi lại thông báo đẩy được phép",
                    placeholder: "Nhập số lần gửi lại được phép.",
                    validations: {
                        required: "Số lần gửi lại thông báo đẩy được phép là trường bắt buộc.",
                        invalid: "Số lần gửi lại thông báo đẩy được phép phải là một số nguyên.",
                        range: "Số lần gửi lại thông báo đẩy được phép phải trong khoảng 0 & 10."
                    },
                    unit: "lần"
                },
                hint: "Hãy đảm bảo rằng một <1>Nhà cung cấp Push</1> đã được cấu hình để thông báo đẩy được gửi đi.",
                resendInterval: {
                    hint: "Khoảng thời gian giữa các lần gửi lại thông báo đẩy.",
                    label: "Khoảng thời gian gửi lại thông báo đẩy",
                    placeholder: "Nhập khoảng thời gian gửi lại theo phút.",
                    validations: {
                        required: "Khoảng thời gian gửi lại thông báo đẩy là trường bắt buộc.",
                        invalid: "Khoảng thời gian gửi lại thông báo đẩy phải là một số nguyên.",
                        range: "Khoảng thời gian gửi lại thông báo đẩy phải trong khoảng 1 & 10 phút."
                    },
                    unit: "phút"
                },
                enableNumberChallenge: {
                    hint: "Khi được bật, người dùng phải xác nhận số hiển thị trong ứng dụng trên thiết bị xác thực push của họ để hoàn thành đăng nhập.",
                    label: "Bật thử thách số",
                    validations: {
                        required: "Bật thử thách số là trường bắt buộc."
                    }
                },
                enableProgressiveEnrollment: {
                    hint: "Khi được bật, người dùng có thể đăng ký thiết bị của họ cho xác thực push vào thời điểm họ đăng nhập vào ứng dụng.",
                    label: "Bật đăng ký thiết bị push tăng dần",
                    validations: {
                        required: "Cần bật đăng ký thiết bị thông báo đẩy tăng dần."
                    }
                },
                enableDeviceRegistrationNotification: {
                    hint: "Khi được bật, người dùng sẽ được thông báo khi một thiết bị mới được đăng ký " +
                        "cho xác thực push.",
                    label: "Bật thông báo đăng ký thiết bị"
                },
                deviceRegistrationNotificationType: {
                    options: {
                        email: "Thông báo qua email",
                        push: "Thông báo qua thông báo đẩy"
                    }
                },
                enableMultipleDeviceEnrollment: {
                    hint: "Khi được bật, người dùng có thể đăng ký nhiều thiết bị cho xác thực push.",
                    label: "Cho phép người dùng đăng ký nhiều thiết bị",
                    validations: {
                        required: "Cần bật đăng ký nhiều thiết bị."
                    }
                },
                maximumDeviceLimit: {
                    hint: "Số lượng thiết bị tối đa cho người dùng khi đăng ký nhiều thiết bị được bật.",
                    label: "Số thiết bị push tối đa",
                    placeholder: "Nhập số thiết bị tối đa.",
                    validations: {
                        required: "Số thiết bị tối đa là trường bắt buộc.",
                        invalid: "Số thiết bị tối đa phải là một số nguyên.",
                        range: "Số thiết bị tối đa phải trong khoảng {{min}} & {{max}}."
                    },
                    unit: "thiết bị"
                },
                enableMultipleDeviceProgressiveEnrollment: {
                    hint: "Khi được bật, người dùng có thể đăng ký tăng dần thêm thiết bị cho xác thực push " +
                        "khi đăng ký nhiều thiết bị được bật.",
                    label: "Cho phép đăng ký tăng dần cho nhiều thiết bị",
                    securityWarning: "Đăng ký tăng dần cho nhiều thiết bị được bật. Người dùng có thể đăng ký " +
                        "thêm thiết bị push trước khi hoàn thành xác thực, và kẻ tấn công có " +
                        "thông tin xác thực chính của người dùng có thể đăng ký thiết bị của riêng chúng trong quá trình đăng nhập và sử dụng nó cho " +
                        "xác thực sau này.",
                    validations: {
                        required: "Cần bật đăng ký tăng dần cho nhiều thiết bị."
                    }
                },
                deviceManagementSettings: {
                    label: "Cài đặt quản lý thiết bị"
                }
            },
            totp: {
                enrollUserInAuthenticationFlow: {
                    hint: "Khi được bật, người dùng có thể đăng ký thiết bị của họ cho TOTP vào thời điểm họ đăng nhập vào ứng dụng.",
                    label: "Bật đăng ký thiết bị TOTP tăng dần"
                }
            }
        },
        certificateSection: {
            certificateEditSwitch: {
                jwks: "Dùng endpoint JWKS",
                pem: "Cung cấp chứng chỉ",
                samlMetadataUri: "Dùng endpoint metadata SAML"
            },
            noCertificateAlert: "Không có chứng chỉ nào khả dụng cho nhà phát hành token đáng tin cậy này. " +
                "Do đó, {{productName}} sẽ không thể xác thực các token được phát hành từ nhà phát hành này nữa.",
            samlMetadataUrl: {
                hint: "URL metadata SAML phải trỏ đến một tài liệu metadata XML hợp lệ chứa " +
                    "chứng chỉ công khai của IdP. {{productName}} sẽ dùng URL này để lấy " +
                    "chứng chỉ nhằm xác minh việc ký phản hồi và ký yêu cầu đăng xuất từ IdP bên ngoài của bạn.",
                label: "URL metadata SAML",
                placeholder: "https://{ saml-provider-url }/saml/metadata"
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
            alias: {
                hint: "Giá trị alias cho {{productName}} trong {{idpType}}.",
                label: "Alias",
                placeholder: "Nhập alias."
            },
            description: {
                hint: "Mô tả dạng văn bản của kết nối.",
                label: "Mô tả",
                placeholder: "Nhập mô tả cho kết nối."
            },
            image: {
                hint: "URL hình ảnh của kết nối để hiển thị. Nếu không được cung cấp, " +
                    "một hình thu nhỏ được tạo sẽ được hiển thị. Kích thước khuyến nghị là 200x200 pixel.",
                label: "Logo",
                placeholder: "https://myapp-resources.io/my_app_image.png",
                validations: {
                    invalid: "Đây không phải là URL hình ảnh hợp lệ"
                }
            },
            issuer: {
                hint: "Giá trị issuer duy nhất của {{idpType}}.",
                label: "Issuer",
                placeholder: "Nhập issuer."
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
            idpType: {
                trustedTokenIssuer: "nhà phát hành token đáng tin cậy",
                externalIdP: "nhà cung cấp danh tính bên ngoài"
            }
        },
        jitProvisioning: {
            accountLinkingAttributes: {
                heading: "Liên kết tài khoản cục bộ",
                infoNotification: "Dropdown thuộc tính cục bộ hiển thị các thuộc tính đã bật " +
                    "ràng buộc tính duy nhất. Để cấu hình thêm thuộc tính cho việc liên kết, hãy cấu hình cài đặt tính duy nhất " +
                    "trong phần <1>thuộc tính cục bộ</1>.",
                linkAccountIf: "Liên kết tài khoản nếu",
                noneOption: {
                    label: "Không có",
                    description: "Đặt lại ánh xạ thuộc tính cục bộ"
                },
                matchRule: {
                    federatedAttribute: {
                        label: "Thuộc tính liên kết",
                        placeholder: "Nhập tên thuộc tính liên kết"
                    },
                    localAttribute: {
                        label: "Thuộc tính cục bộ ",
                        placeholder: "Chọn thuộc tính cục bộ"
                    }
                },
                equals: "bằng"
            },
            attributeSyncMethod: {
                hint: "Chọn phương thức được dùng để đồng bộ thuộc tính giữa tài khoản " +
                    "người dùng được cấp phát JIT và tài khoản người dùng cục bộ.",
                label: "Phương thức đồng bộ thuộc tính",
                options: {
                    overrideAll: {
                        label: "Ghi đè tất cả",
                        description: "Tất cả thuộc tính của tài khoản người dùng cục bộ sẽ bị ghi đè bởi " +
                            "các thuộc tính nhận được từ nhà cung cấp danh tính bên ngoài."
                    },
                    none: {
                        label: "Không có",
                        description: "Không thuộc tính nào nhận được từ nhà cung cấp danh tính sẽ " +
                            "được đồng bộ với tài khoản người dùng cục bộ."
                    },
                    preserveLocal: {
                        label: "Giữ cục bộ",
                        description: "Chỉ các thuộc tính nhận được từ nhà cung cấp danh tính sẽ được " +
                            "cập nhật trong khi các thuộc tính khác của tài khoản người dùng cục bộ được giữ nguyên."
                    }
                }
            },
            associateLocalUser: {
                hint: "Khi được bật, người dùng đăng nhập bằng nhà cung cấp danh tính này được liên kết với người dùng cục bộ hiện có. Nếu không có quy tắc liên kết nào được đặt, địa chỉ email được dùng mặc định.",
                label: "Bật liên kết tài khoản cục bộ"
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
            },
            skipJITForNoRuleMatch: {
                hint: "Khi được bật, nếu không tìm thấy tài khoản cục bộ bằng các quy tắc khớp thuộc tính, " +
                    "người dùng sẽ có thể đăng nhập mà không cấp phát JIT. Khi bị tắt, " +
                    "việc đăng nhập sẽ diễn ra cùng với cấp phát JIT.",
                label: "Bỏ qua cấp phát người dùng khi không tìm thấy tài khoản cục bộ",
                infoMessage: "Nếu không tìm thấy tài khoản cục bộ khớp, mặc định một tài khoản mới sẽ được tạo. " +
                    "Cấu hình này cho phép bạn ghi đè hành vi này."
            },
            idpGroupSyncMethod: {
                children: {
                    mergeWithExisting: "Hợp nhất với hiện có",
                    overrideAll: "Ghi đè tất cả"
                },
                checkboxLabel: "Ghi đè các vai trò hiện có bằng vai trò nhóm IDP bên ngoài",
                hint: "Khi được bật, các vai trò hiện có sẽ được thay thế bằng các vai trò nhóm IDP bên ngoài mới trong mỗi lần đăng nhập.",
                label: "Phương thức đồng bộ vai trò nhóm IDP"
            },
            homeRealmIdentifier: {
                hint: "Chỉ định một định danh cho kết nối này. Các ứng dụng có thể truyền giá trị này " +
                    "dưới dạng tham số truy vấn <1>fidp</1> (ví dụ: <3>?fidp=external-idp-identifier</3>) trong " +
                    "URL yêu cầu ủy quyền để chuyển hướng người dùng trực tiếp đến kết nối này, " +
                    "bỏ qua trang đăng nhập nhiều tùy chọn.",
                label: "Định danh Home Realm",
                placeholder: "vd: external-idp-identifier"
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
        outboundProvisioningGroups: {
            heading: "Nhóm cấp phát ra ngoài",
            hint: "Chọn các nhóm để tự động cấp phát người dùng khi họ được thêm vào, và hủy cấp phát khi họ bị xóa.",
            label: "Nhóm",
            placeHolder: "Chọn nhóm",
            popup: {
                content: "Thêm nhóm"
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
                mappedRolesAbsentMessage: "Với cấu hình hiện tại, <1>Thuộc tính nhóm</1> "+
                "chưa được cấu hình. " +
                    "Bạn có thể chọn một thuộc tính từ danh sách thả xuống.",
                mappedRolesPresentMessage: "Xin lưu ý rằng <1>{{ mappedRolesClaim }}</1> "+
                "được ánh xạ tới thuộc tính <1>{{ rolesClaim }}</1> " +
                    "sẽ được coi là <1>Thuộc tính nhóm</1> mặc định với cấu hình hiện tại. " +
                    "Bạn có thể chọn một thuộc tính từ danh sách thả xuống.",
                messageOIDC: "Xin lưu ý rằng thuộc tính OpenID Connect có tên "+
                "<1>{{ attribute }}</1> sẽ được coi là " +
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
            microsoftTenantError: {
                description: "Kết nối đã được tạo, nhưng việc áp dụng các " +
                    "endpoint theo tenant đã thất bại. Các endpoint mặc định sẽ được dùng.",
                message: "Cấu hình tenant thất bại"
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
        getLocalClaims: {
            error: {
                description: "{{ description }}",
                message: "Không thể lấy các claim cục bộ"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy các claim cục bộ cho ánh xạ thuộc tính tra cứu tài khoản.",
                message: "Không thể lấy các claim cục bộ"
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
        getFIDOConnectorConfigs: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy cấu hình connector Passkey.",
                message: "Lỗi lấy dữ liệu"
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
                description: "Đã xảy ra lỗi khi lấy template IDP.",
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
        updateFIDOConnectorConfigs: {
            error: {
                description: "{{ description }}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình connector Passkey.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật connector Passkey thành công.",
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
                description: "Đã xảy ra lỗi khi cập nhật cấu hình nhóm cấp phát ra ngoài.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật cấu hình nhóm cấp phát ra ngoài thành công.",
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
        updateHomeRealmIdentifier: {
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật định danh home realm.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật định danh home realm thành công.",
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
        updatePushAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình phương thức xác thực push.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật cấu hình phương thức xác thực Push thành công.",
                message: "Cập nhật thành công"
            }
        }
    },
    sharedConnection: {
        label: "Được chia sẻ"
    },
    sharedAccess: {
        modes: {
            doNotShare: "Không chia sẻ với bất kỳ tổ chức nào",
            shareWithAll: "Chia sẻ với tất cả tổ chức",
            shareWithSelected: "Chia sẻ với các tổ chức được chọn"
        },
        notifications: {
            fetchOrganizations: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy các tổ chức.",
                    message: "Không thể lấy các tổ chức"
                }
            },
            noOrganizationsSelected: {
                description: "Vui lòng chọn ít nhất một tổ chức để chia sẻ kết nối.",
                message: "Chưa chọn tổ chức nào"
            },
            share: {
                genericError: {
                    description: "Đã xảy ra lỗi khi cập nhật truy cập được chia sẻ của kết nối.",
                    message: "Không thể cập nhật truy cập được chia sẻ"
                },
                success: {
                    description: "Truy cập được chia sẻ của kết nối đã được cập nhật thành công.",
                    message: "Đã cập nhật truy cập được chia sẻ"
                }
            },
            unshare: {
                genericError: {
                    description: "Đã xảy ra lỗi khi hủy chia sẻ kết nối khỏi các tổ chức.",
                    message: "Không thể hủy chia sẻ kết nối"
                },
                success: {
                    description: "Kết nối đã được hủy chia sẻ khỏi tất cả tổ chức thành công.",
                    message: "Đã hủy chia sẻ kết nối"
                }
            }
        },
        selectAnOrganizationToManage: "Chọn một tổ chức để quản lý cài đặt chia sẻ của nó.",
        shareAllInfo: "Kết nối này sẽ được chia sẻ với tất cả tổ chức hiện có và bất kỳ " +
            "tổ chức nào được tạo trong tương lai.",
        shareAllWarningModal: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            description: "Thao tác này sẽ chia sẻ kết nối trên TẤT CẢ tổ chức hiện có và tương lai. " +
                "Thao tác này sẽ ảnh hưởng đến tất cả tổ chức hiện tại và tương lai trong hệ thống của bạn.",
            header: "Chia sẻ với tất cả tổ chức",
            message: "Bạn sắp chia sẻ kết nối này trên tất cả tổ chức."
        },
        shareTypeSwitchModal: {
            description: "Chọn cách bạn muốn tiếp tục:",
            header: "Chuyển sang chia sẻ có chọn lọc",
            message: "Bạn sắp chuyển từ chia sẻ với tất cả tổ chức sang chia sẻ có chọn lọc.",
            preserveStateLabel1: "Giữ nguyên chia sẻ hiện tại",
            preserveStateLabel2: "Giữ kết nối được chia sẻ với các tổ chức hiện có và chuyển sang " +
                "chế độ chọn lọc.",
            resetToDefaultLabel1: "Đặt lại về mặc định",
            resetToDefaultLabel2: "Hủy chia sẻ kết nối khỏi tất cả tổ chức và bắt đầu lại với " +
                "chia sẻ chọn lọc."
        },
        shareWithFutureChildOrgs: "Chia sẻ với các tổ chức con trong tương lai",
        sharingSettingsLabel: "Cài đặt chia sẻ cho ",
        subTitle: "Chia sẻ kết nối này với các tổ chức để họ có thể sử dụng nó cho xác thực.",
        tabName: "Truy cập được chia sẻ",
        title: "Chính sách chia sẻ",
        toManageOrganizationSelectLeftPanel: "Chọn tổ chức từ bảng bên trái để quản lý " +
            "cài đặt chia sẻ của nó."
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
                    heading: "Tên",
                    idpDescription: "Cung cấp một tên duy nhất cho kết nối."
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
            },
            wizard: {
                certificates: {
                    heading: "Chế độ cấu hình chứng chỉ",
                    jwksUrl: {
                        hint: "{{productName}} sẽ dùng URL này để lấy khóa nhằm xác minh các" +
                            " phản hồi đã ký từ IdP bên ngoài của bạn.",
                        label: "URL endpoint JWKS",
                        placeholder: "Nhập URL endpoint JWKS"
                    },
                    mode: {
                        jwks: "Endpoint JWKS",
                        pem: "Dùng chứng chỉ PEM",
                        samlMetadataUri: "URI metadata"
                    },
                    pem: {
                        dropzoneText: "Kéo và thả tệp chứng chỉ vào đây.",
                        hint: "{{productName}} sẽ dùng chứng chỉ này để xác minh các phản hồi đã ký" +
                            " từ IdP bên ngoài của bạn.",
                        pasteAreaPlaceholderText: "Dán chứng chỉ IdP ở định dạng PEM.",
                        uploadButtonText: "Tải lên tệp chứng chỉ"
                    },
                    samlMetadataUri: {
                        hint: "{{productName}} sẽ dùng URI này để lấy chứng chỉ nhằm" +
                            " xác minh các phản hồi đã ký từ IdP bên ngoài của bạn.",
                        label: "URI metadata SAML",
                        placeholder: "Nhập URI metadata SAML"
                    }
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
                    description: "Cung cấp <1>App ID</1> bạn nhận được từ Facebook khi bạn " +
                        "đăng ký ứng dụng OAuth.",
                    heading: "App ID"
                },
                clientSecret: {
                    description: "Cung cấp <1>App secret</1> bạn nhận được từ Facebook khi bạn " +
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
                    description: "Cung cấp <1>Client ID</1> bạn nhận được từ GitHub khi bạn " +
                        "đăng ký ứng dụng OAuth.",
                    heading: "Client ID"
                },
                clientSecret: {
                    description: "Cung cấp <1>Client secret</1> bạn nhận được từ GitHub khi bạn " +
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
                    description: "Cung cấp <1>Client ID</1> bạn nhận được từ Google khi bạn " +
                        "đăng ký ứng dụng OAuth.",
                    heading: "Client ID"
                },
                clientSecret: {
                    description: "Cung cấp <1>Client secret</1> bạn nhận được từ Google khi bạn " +
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
        hypr: {
            wizardHelp: {
                apiToken: {
                    description: "Cung cấp <1>API Token</1> lấy được từ "+
                    "HYPR. Token này sẽ được dùng để truy cập các API của HYPR.",
                    heading: "API Token"
                },
                appId: {
                    description: "Cung cấp <1>Application ID</1> của "+
                    "ứng dụng đã đăng ký trong control center của HYPR.",
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
                    heading: "Điều kiện tiên quyết",
                    rpDescription: "Trước khi bắt đầu, hãy tạo một ứng dụng relying party "+
                    "trong <1>control center của HYPR</1>, và lấy application ID.",
                    tokenDescription: "Bạn cũng cần lấy một <1>API token</1> cho ứng dụng của bạn "+
                    "đã tạo trên HYPR."
                }
            }
        },
        iproov: {
            wizardHelp: {
                apiKey: {
                    description: "Cung cấp <1>API Key</1> của ứng dụng "+
                    "đã đăng ký trong control center của iProov.",
                    heading: "API Key"
                },
                apiSecret: {
                    description: "Cung cấp <1>API Secret</1> của ứng dụng "+
                    "đã đăng ký trong control center của iProov.",
                    heading: "API Secret"
                },
                baseUrl: {
                    description: "Cung cấp <1>URL cơ sở</1> của triển khai máy chủ iProov của bạn.",
                    heading: "URL cơ sở"
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
                oauthPassword: {
                    description: "Cung cấp <1>Mật khẩu OAuth</1> của ứng dụng "+
                    "đã đăng ký trong control center của iProov.",
                    heading: "Mật khẩu OAUTH"
                },
                oauthUsername: {
                    description: "Cung cấp <1>Tên đăng nhập OAuth</1> của "+
                    "ứng dụng đã đăng ký trong control center của iProov.",
                    heading: "Tên đăng nhập OAUTH"
                },
                preRequisites: {
                    appDescription:
                    "Trước khi bắt đầu, hãy tạo một nhà cung cấp danh tính " +
                    "trong <1>iPortal</1>, và lấy API key, API Secret, tên đăng nhập OAuth và mật khẩu OAuth.",
                    heading: "Điều kiện tiên quyết"
                }
            }
        },
        manualSetup: {
            heading: "Thiết lập thủ công",
            subHeading: "Tạo kết nối với cấu hình tùy chỉnh."
        },
        microsoft: {
            wizardHelp: {
                clientId: {
                    description: "Cung cấp <1>Client ID</1> bạn nhận được từ Microsoft khi bạn " +
                        "đăng ký ứng dụng OAuth.",
                    heading: "Client ID"
                },
                clientSecret: {
                    description: "Cung cấp <1>Client secret</1> bạn nhận được từ Microsoft khi bạn " +
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
        organizationIDP: {
            wizardHelp: {
                description: {
                    description: "Cung cấp mô tả cho nhà cung cấp xác thực doanh nghiệp để" +
                    " giải thích rõ hơn về nó.",
                    example: "Ví dụ: Đây là phương thức xác thực cho MyOrg, đóng vai trò IdP cho MyApp.",
                    heading: "Mô tả"
                },
                name: {
                    description: "Cung cấp một tên duy nhất cho nhà cung cấp xác thực doanh nghiệp để" +
                        " có thể dễ dàng nhận diện.",
                    heading: "Tên"
                }
            }
        },
        quickSetup: {
            heading: "Thiết lập nhanh",
            subHeading: "Bộ template định nghĩa sẵn giúp tăng tốc việc tạo kết nối."
        },
        trustedTokenIssuer: {
            addWizard: {
                subtitle: "Đăng ký một nhà phát hành token đáng tin cậy để trao đổi token của nó lấy token do {{productName}} phát hành",
                title: "Nhà phát hành token đáng tin cậy"
            },
            forms: {
                alias: {
                    hint: "Giá trị alias cho {{productName}} trong nhà phát hành token đáng tin cậy.",
                    label: "Alias",
                    placeholder: "Nhập alias",
                    validation: {
                        notValid: "{{alias}} không phải là alias hợp lệ."
                    }
                },
                certificateType: {
                    label: "Chế độ cấu hình chứng chỉ",
                    requiredCertificate: "Cần có chứng chỉ để tạo nhà phát hành token đáng tin cậy."
                },
                issuer: {
                    hint: "Giá trị issuer duy nhất của nhà phát hành token đáng tin cậy.",
                    label: "Issuer",
                    placeholder: "Nhập issuer",
                    validation: {
                        notValid: "{{issuer}} không phải là issuer hợp lệ."
                    }
                },
                jwksUrl: {
                    hint: "{{productName}} sẽ dùng URL này để lấy khóa nhằm xác minh các phản hồi đã ký từ " +
                        "nhà phát hành token đáng tin cậy của bạn.",
                    label: "URL endpoint JWKS",
                    optionLabel: "Endpoint JWKS",
                    placeholder: "Nhập URL endpoint JWKS",
                    validation: {
                        notValid: "Vui lòng nhập một URL hợp lệ"
                    }
                },
                name: {
                    label: "Tên nhà phát hành token đáng tin cậy",
                    placeholder: "Nhập tên cho nhà phát hành token đáng tin cậy"
                },
                pem: {
                    dropzoneText: "Kéo và thả tệp chứng chỉ vào đây.",
                    hint: "{{productName}} sẽ dùng chứng chỉ này để xác minh các phản hồi đã ký từ " +
                        "nhà phát hành token đáng tin cậy của bạn.",
                    optionLabel: "Dùng chứng chỉ PEM",
                    pasteAreaPlaceholderText: "Dán chứng chỉ nhà phát hành token đáng tin cậy ở định dạng PEM.",
                    uploadCertificateButtonLabel: "Tải lên tệp chứng chỉ"
                },
                steps: {
                    certificate: "Chứng chỉ",
                    general: "Cài đặt chung"
                }
            }
        },
        digitalWallet: {
            title: "Ví kỹ thuật số",
            subTitle: "Cho phép người dùng đăng nhập hoặc đăng ký bằng thông tin xác thực có thể xác minh.",
            tabs: {
                general: "Chung",
                attributes: "Thuộc tính"
            },
            form: {
                name: {
                    label: "Tên",
                    placeholder: "Ví của tôi",
                    defaultValue: "Ví kỹ thuật số",
                    hint: "Một tên duy nhất cho kết nối ví kỹ thuật số này.",
                    validations: {
                        required: "Cần có tên kết nối.",
                        maxLength: "Tên kết nối không được vượt quá {{max}} ký tự.",
                        minLength: "Tên kết nối phải có ít nhất {{min}} ký tự."
                    }
                },
                description: {
                    defaultValue: "Cho phép người dùng đăng nhập hoặc đăng ký bằng thông tin xác thực có thể xác minh.",
                    hint: "Mô tả tùy chọn về mục đích của kết nối ví kỹ thuật số này."
                },
                presentationDefinition: {
                    label: "Định nghĩa trình bày",
                    placeholder: "Chọn một định nghĩa trình bày",
                    loadingPlaceholder: "Đang tải các định nghĩa trình bày...",
                    emptyPlaceholder: "Không có định nghĩa trình bày nào khả dụng",
                    hint: "Định nghĩa thông tin xác thực cần yêu cầu từ ví kỹ thuật số của người dùng."
                },
            },
            claimMapping: {
                form: {
                    credentialType: {
                        label: "Loại thông tin xác thực",
                        hint: "Loại thông tin xác thực do nhà phát hành định nghĩa. Giá trị này phải khớp chính xác với loại thông tin xác thực " +
                        "được chỉ định trong định nghĩa trình bày."
                    },
                    credentialFormat: {
                        label: "Định dạng thông tin xác thực",
                        hint: "Chỉ định định dạng của thông tin xác thực có thể xác minh cần yêu cầu.",
                        options: {
                            dcSdJwt: "dc+sd-jwt"
                        }
                    },
                    requestedAttributes: {
                        label: "Thuộc tính được yêu cầu",
                        hint: "Chọn các thuộc tính thông tin xác thực để ánh xạ tới thuộc tính người dùng cục bộ.",
                        emptyPlaceholder: "Không tìm thấy thuộc tính nào trong định nghĩa trình bày đã chọn."
                    }
                },
                notifications: {
                    fetchFailed: {
                        message: "Không thể tải thuộc tính",
                        description: "Đã xảy ra lỗi khi tải các thuộc tính từ định nghĩa trình bày."
                    },
                    updateSuccess: {
                        message: "Đã cập nhật định nghĩa trình bày",
                        description: "Định nghĩa trình bày đã được cập nhật thành công."
                    },
                    updateFailed: {
                        message: "Cập nhật thất bại",
                        description: "Đã xảy ra lỗi khi cập nhật định nghĩa trình bày."
                    },
                    missingCredentialType: {
                        message: "Cần có loại thông tin xác thực",
                        description: "Nhập một loại thông tin xác thực trước khi cập nhật định nghĩa trình bày."
                    },
                    noClaimPaths: {
                        header: "Chưa cấu hình đường dẫn thuộc tính",
                        description: "Không có đường dẫn thuộc tính nào được cấu hình trong Định nghĩa trình bày được liên kết.",
                        action: "Cấu hình thuộc tính"
                    }
                },
                heading: "Ánh xạ thuộc tính thông tin xác thực",
                subheading: "Ánh xạ các thuộc tính từ Định nghĩa trình bày được liên kết tới thuộc tính người dùng cục bộ.",
                pdClaimAttribute: {
                    label: "Thuộc tính định nghĩa trình bày",
                    tooltip: "Các thuộc tính được yêu cầu trong Định nghĩa trình bày. " +
                    "Hãy ánh xạ chúng tới các thuộc tính người dùng tương ứng."
                }
            },
            notifications: {
                noPresentationDefinition: {
                    message: "Cần có định nghĩa trình bày",
                    description: "Chọn một định nghĩa trình bày trước khi tạo kết nối."
                }
            },
            noPdModal: {
                heading: "Không tìm thấy định nghĩa trình bày nào",
                subHeading: "Cần có một định nghĩa trình bày để tạo kết nối Ví kỹ thuật số.",
                description: "Bạn chưa có định nghĩa trình bày nào. " +
                    "<1>Tạo một định nghĩa</1> để sử dụng kết nối Ví kỹ thuật số này."
            },
            wizardHelp: {
                heading: "Giới thiệu về kết nối Ví kỹ thuật số",
                subHeading: "Tìm hiểu thêm về kết nối này",
                name: {
                    heading: "Tên",
                    hint: "Cung cấp một tên duy nhất cho kết nối ví kỹ thuật số."
                },
                presentationDefinition: {
                    heading: "Định nghĩa trình bày",
                    hint: "Chọn một định nghĩa trình bày chỉ định thông tin xác thực cần yêu cầu từ ví kỹ thuật số của người dùng."
                },
            }
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
                    configureTitle: "Cấu hình connector {{connectorName}}",
                    title: "Chi tiết connector"
                },
                connectorSelection: {
                    defaultSetup: {
                        subTitle: "Chọn loại connector cấp phát ra ngoài mới",
                        title: "Các loại connector"
                    },
                    subTitle: "Chọn một loại kết nối cấp phát ra ngoài.",
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
    },
    overrides: {
        authenticators: {
            customAuthenticators: {
                pluginBased: {
                    name: "Phương thức xác thực tùy chỉnh (dựa trên plugin)"
                }
            }
        }
    }
};
