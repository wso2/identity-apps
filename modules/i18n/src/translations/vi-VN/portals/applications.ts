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
import { ApplicationsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const applications: ApplicationsNS = {
    quickStart: {
        addUserOption: {
            description: "Bạn cần một <1>tài khoản người dùng</1> để đăng nhập vào ứng dụng.",
            hint:
                "Nếu bạn chưa có tài khoản người dùng, hãy nhấn vào nút bên dưới để tạo một tài khoản. " +
                "Hoặc, đi đến <1>Quản lý người dùng > Người dùng</1><3></3> và tạo người dùng.",
            message:
                "Nếu bạn chưa có tài khoản người dùng, hãy liên hệ quản trị viên " +
                "tổ chức của bạn."
        },
        spa: {
            customConfig: {
                heading: "Bạn có thể triển khai đăng nhập bằng <1>Authorization Code flow với PKCE</1> " +
                    "với Asgardeo cho bất kỳ công nghệ SPA nào.",
                anySPATechnology: "hoặc bất kỳ công nghệ SPA nào",
                configurations: "Cấu hình",
                protocolConfig: "Dùng các cấu hình sau để tích hợp ứng dụng của bạn với Asgardeo. " +
                    "Để biết thêm chi tiết về cấu hình, đi đến tab <1>Giao thức</1>.",
                clientId: "Client ID",
                baseUrl: "URL cơ sở",
                redirectUrl: "URL chuyển hướng",
                scope: "Phạm vi",
                serverEndpoints: "Chi tiết về các endpoint máy chủ có trong tab <1>Thông tin</1>."
            },
            techSelection: {
                heading: "Sử dụng các SDK được Asgardeo tuyển chọn và các tích hợp bên thứ ba."
            }
        },
        technologySelectionWrapper: {
            subHeading:
                "Dùng <1>chi tiết endpoint " +
                "máy chủ</1> và bắt đầu tích hợp ứng dụng của riêng bạn hoặc đọc <3>tài liệu</3> của chúng tôi " +
                "để tìm hiểu thêm.",
            otherTechnology: "hoặc bất kỳ công nghệ di động nào"
        },
        twa: {
            common: {
                orAnyTechnology: "hoặc bất kỳ công nghệ nào"
            },
            oidc: {
                customConfig: {
                    clientSecret: "Client Secret",
                    heading: "Bạn có thể triển khai đăng nhập bằng <1>Authorization Code flow</1> " +
                        "với Asgardeo cho bất kỳ ứng dụng web truyền thống nào."
                }
            },
            saml: {
                customConfig: {
                    heading: "Khám phá <1>cấu hình SAML</1> để tích hợp Asgardeo với" +
                        " bất kỳ ứng dụng web truyền thống nào.",
                    issuer: "Issuer",
                    acsUrl: "URL dịch vụ tiêu thụ assertion",
                    idpEntityId: "ID thực thể IdP",
                    idpUrl: "URL IdP"
                }
            }
        },
        m2m: {
            customConfig: {
                tokenEndpoint: "Token Endpoint",
                tokenRequest: "Yêu cầu token",
                configurations: "Cấu hình"
            }
        }
    },
    URLInput: {
        withLabel: {
            negative: {
                content: "Bạn cần bật CORS cho origin của URL này để thực hiện yêu cầu" +
                    " đến {{productName}} từ trình duyệt.",
                detailedContent: {
                    0: "",
                    1: ""
                },
                header: "CORS không được phép cho",
                leftAction: "Cho phép"
            },
            positive: {
                content: "Origin của URL này được phép thực hiện yêu cầu đến " +
                    "các API {{productName}} từ trình duyệt.",
                detailedContent: {
                    0: "",
                    1: ""
                },
                header: "CORS được phép cho"
            }
        }
    },
    addWizard: {
        steps: {
            generalSettings: {
                heading: "Cài đặt chung"
            },
            protocolConfig: {
                heading: "Cấu hình giao thức"
            },
            protocolSelection: {
                heading: "Chọn giao thức"
            },
            summary: {
                heading: "Tóm tắt",
                sections: {
                    accessURL: {
                        heading: "URL truy cập"
                    },
                    applicationQualifier: {
                        heading: "Bộ định danh ứng dụng"
                    },
                    assertionURLs: {
                        heading: "URL dịch vụ tiêu thụ assertion"
                    },
                    audience: {
                        heading: "Đối tượng"
                    },
                    callbackURLs: {
                        heading: "URI chuyển hướng được ủy quyền"
                    },
                    certificateAlias: {
                        heading: "Alias chứng chỉ"
                    },
                    discoverable: {
                        heading: "Có thể khám phá"
                    },
                    grantType: {
                        heading: "Loại grant"
                    },
                    issuer: {
                        heading: "Issuer"
                    },
                    metaFile: {
                        heading: "Tệp meta (mã hóa Base64)"
                    },
                    metadataURL: {
                        heading: "URL metadata"
                    },
                    public: {
                        heading: "Công khai"
                    },
                    realm: {
                        heading: "Realm"
                    },
                    renewRefreshToken: {
                        heading: "Gia hạn RefreshToken"
                    },
                    replyTo: {
                        heading: "Trả lời tới"
                    }
                }
            }
        }
    },
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
        placeholder: "Tìm kiếm ứng dụng theo tên, client ID hoặc issuer"
    },
    clientSecrets: {
        confirmations: {
            deleteSecret: {
                assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                content: "Nếu bạn xóa client secret này, các client đang sử dụng nó sẽ không còn có thể " +
                    "xác thực bằng nó. Bất kỳ client secret nào khác của ứng dụng vẫn hợp lệ, và " +
                    "các token đang hoạt động sẽ không bị thu hồi.",
                header: "Bạn có chắc không?",
                message: "Thao tác này không thể hoàn tác và xóa vĩnh viễn client secret. " +
                    "Vui lòng tiếp tục một cách thận trọng."
            }
        },
        dangerZone: {
            revokeAll: {
                actionTitle: "Thu hồi tất cả",
                confirmation: {
                    assertionHint: "Tôi hiểu thao tác này không thể hoàn tác.",
                    content: "Mọi token được phát hành bằng các secret cũ cũng sẽ bị thu hồi, và các " +
                        "luồng xác thực đang hoạt động sẽ thất bại. Hãy đảm bảo cập nhật ứng dụng của bạn với " +
                        "client secret mới.",
                    header: "Thu hồi tất cả client secret và tạo một cái mới?",
                    message: "Thao tác này không thể hoàn tác. Tất cả client secret hiện có bị thu hồi vĩnh viễn " +
                        "và được thay thế bằng một client secret mới duy nhất."
                },
                header: "Thu hồi tất cả & tạo client secret mới",
                subheader: "Thu hồi vĩnh viễn mọi client secret hiện có và tạo một cái mới duy nhất. " +
                    "Các luồng xác thực vẫn dùng secret cũ sẽ thất bại cho đến khi bạn cập nhật ứng dụng."
            }
        },
        expiry: {
            expired: "Đã hết hạn",
            expiredAgo: "Đã hết hạn {{duration}} trước",
            expiredOn: "Hết hạn vào {{date}}",
            expiresIn: "Hết hạn trong {{duration}}",
            expiresOn: "Hết hạn vào {{date}}",
            neverExpires: "Không bao giờ hết hạn"
        },
        expiryBanner: {
            description: "Ít nhất một client secret sắp hết hạn. Hãy xoay secret của bạn để " +
                "tránh lỗi xác thực và gián đoạn ứng dụng.",
            title: "Client Secret sắp hết hạn",
            viewSecrets: "Xem secret"
        },
        generateButton: "Tạo secret mới",
        hashedDisclaimer: "Client secret được băm và không thể xem. Nếu bạn cần giá trị mới, " +
            "hãy tạo một client secret mới.",
        hidePreviousSecret: "Ẩn client secret trước đó",
        hidePreviousSecrets: "Ẩn các client secret trước đó",
        maxCountReachedHint: "Bạn đã đạt số lượng client secret tối đa là {{count}}. Xóa một " +
            "secret hiện có để tạo một cái mới.",
        notifications: {
            deleteSecret: {
                genericError: {
                    description: "Đã xảy ra lỗi khi xóa client secret.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Client secret đã được xóa thành công.",
                    message: "Đã xóa client secret"
                }
            },
            generateSecret: {
                error: {
                    message: "Lỗi tạo"
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi tạo client secret.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Client secret mới đã được tạo thành công.",
                    message: "Đã tạo client secret"
                }
            },
            getSecrets: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy các client secret.",
                    message: "Đã xảy ra lỗi"
                }
            },
            revokeAll: {
                genericError: {
                    description: "Đã xảy ra lỗi khi thu hồi các client secret.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Tất cả client secret đã bị thu hồi và một secret mới đã được tạo.",
                    message: "Đã thu hồi client secret"
                }
            }
        },
        rotationWarning: "Nhiều client secret cho phép xoay vòng liền mạch, nhưng giữ các secret cũ " +
            "hoạt động lâu hơn mức cần thiết làm tăng rủi ro bảo mật. Hãy xóa các secret cũ sau khi hoàn tất " +
            "xoay vòng.",
        viewPreviousSecret: "Xem client secret trước đó",
        viewPreviousSecrets: "Xem các client secret trước đó",
        wizard: {
            customExpiry: {
                label: "Thời gian hết hạn tùy chỉnh (ngày)",
                placeholder: "Nhập số ngày",
                validations: {
                    invalid: "Nhập một số ngày hợp lệ.",
                    required: "Nhập số ngày cho đến khi secret hết hạn."
                }
            },
            expiration: {
                label: "Hết hạn",
                options: {
                    custom: "Tùy chỉnh",
                    days: "{{count}} ngày",
                    neverExpire: "Không bao giờ hết hạn"
                }
            },
            expiryWarning: "Bạn không thể thay đổi thời gian hết hạn của client secret sau khi nó được tạo, vì vậy hãy chọn " +
                "thời gian hết hạn cẩn thận.",
            generateButton: "Tạo",
            heading: "Tạo client secret",
            subHeading: "Tạo một client secret mới cho ứng dụng này. Các secret hiện có vẫn hợp lệ."
        }
    },
    confirmations: {
        addSocialLogin: {
            content : "Để thêm một đăng nhập mạng xã hội mới, chúng tôi cần chuyển bạn đến một trang khác và " +
                "mọi thay đổi chưa lưu trên trang này sẽ bị mất. Vui lòng xác nhận.",
            header: "Bạn có muốn tiếp tục không?",
            subHeader: "Bạn sẽ mất mọi thay đổi chưa lưu."
        },
        certificateDelete: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "N/A",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn chứng chỉ.",
            primaryAction: "Xóa",
            secondaryAction: "Hủy"
        },
        changeProtocol: {
            assertionHint: "Vui lòng nhập <1>{{ name }}</1> để xác nhận.",
            content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn " +
                "các cấu hình giao thức hiện tại",
            header: "Bạn có chắc không?",
            message: "Nếu bạn thay đổi sang một giao thức khác, các cấu hình {{ name }} " +
                "sẽ bị xóa. Vui lòng tiếp tục một cách thận trọng."
        },
        clientSecretHashDisclaimer: {
            forms: {
                clientIdSecretForm: {
                    clientId: {
                        hide: "Ẩn ID",
                        label: "Client ID",
                        placeholder: "Client ID",
                        show: "Hiện ID",
                        validations: {
                            empty: "Đây là trường bắt buộc."
                        }
                    },
                    clientSecret: {
                        hide: "Ẩn secret",
                        label: "Client secret",
                        placeholder: "Client secret",
                        show: "Hiện secret",
                        validations: {
                            empty: "Đây là trường bắt buộc."
                        }
                    }
                }
            },
            modal: {
                assertionHint: "",
                content: "",
                header: "Thông tin xác thực ứng dụng OAuth",
                message: "Giá trị client secret sẽ chỉ được hiển thị dưới dạng văn bản thuần một lần. " +
                    "Hãy đảm bảo sao chép và lưu nó ở nơi an toàn."
            }
        },
        deleteApplication: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn ứng dụng.",
            header: "Bạn có chắc không?",
            message: "Nếu bạn xóa ứng dụng này, các luồng xác thực cho ứng dụng này sẽ " +
                "ngừng hoạt động. Vui lòng tiếp tục một cách thận trọng."
        },
        deleteChoreoApplication: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Việc xóa ứng dụng này sẽ phá vỡ các luồng xác thực và khiến ứng dụng " +
                "Choreo liên kết không thể sử dụng được với thông tin xác thực của nó. " +
                "<1>Hãy tiếp tục với rủi ro của riêng bạn.</1>",
            header: "Bạn có chắc không?",
            message: "Nếu bạn xóa ứng dụng này, các luồng xác thực cho ứng dụng này sẽ " +
                "ngừng hoạt động. Vui lòng tiếp tục một cách thận trọng."
        },
        disableApplication: {
            header: "Bạn có chắc không?",
            content: {
                0: "Điều này có thể ngăn người tiêu dùng truy cập ứng dụng, nhưng có thể được giải quyết bằng cách " +
                "bật lại ứng dụng.",
                1: "Hãy đảm bảo rằng các tham chiếu đến ứng dụng trong <1>template email</1> " +
                "và các vị trí liên quan khác được cập nhật để phản ánh trạng thái ứng dụng cho phù hợp."
            },
            message: "Nếu bạn vô hiệu hóa ứng dụng này, người tiêu dùng sẽ không thể truy cập ứng dụng. "+
            "Ứng dụng cũng sẽ mất quyền truy cập vào dữ liệu người dùng. Vui lòng tiếp tục một cách thận trọng.",
            assertionHint: "Vui lòng xác nhận thao tác của bạn."
        },
        enableApplication: {
            header: "Bạn có chắc không?",
            content: "Điều này có thể khiến người tiêu dùng truy cập ứng dụng. Thao tác này có thể hoàn tác.",
            message: "Nếu bạn bật ứng dụng này, người tiêu dùng sẽ có quyền truy cập vào ứng dụng. "+
            "Ứng dụng cũng sẽ có quyền truy cập vào dữ liệu người dùng. Vui lòng tiếp tục một cách thận trọng.",
            assertionHint: "Vui lòng xác nhận thao tác của bạn."
        },
        deleteOutboundProvisioningIDP: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn xóa kết nối cấp phát ra ngoài này, việc cấp phát ra ngoài sẽ không được " +
                "kích hoạt từ ứng dụng này. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa kết nối cấp phát."
        },
        deleteProtocol: {
            assertionHint: "Vui lòng nhập <1>{{ name }}</1> để xác nhận.",
            content: "Nếu bạn xóa giao thức này, bạn sẽ không thể khôi phục lại. Tất cả các " +
                "ứng dụng phụ thuộc vào nó cũng có thể ngừng hoạt động. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn giao thức."
        },
        handlerAuthenticatorAddition: {
            assertionHint: "Vui lòng nhập <1>{{ name }}</1> để xác nhận.",
            content: "Phương thức xác thực bạn đang cố thêm là một handler. Hãy đảm bảo bạn thêm " +
                "các phương thức xác thực ở các bước khác.",
            header: "Bạn đang thêm một Handler",
            message: "Đây là một handler."
        },
        backupCodeAuthenticatorDelete: {
            assertionHint: "Nhấn Tiếp tục để xóa chức năng mã dự phòng.",
            content: "Nếu bạn tiếp tục, chức năng mã dự phòng cũng sẽ bị xóa khỏi " +
                "bước xác thực hiện tại của bạn. Bạn có muốn tiếp tục không?",
            header: "Xác nhận xóa",
            message: "Thao tác này sẽ xóa chức năng mã dự phòng khỏi bước xác thực hiện tại."
        },
        lowOIDCExpiryTimes: {
            assertionHint: "Nhấn Xác nhận để tiếp tục với các giá trị của bạn.",
            content: "Điều này có nghĩa là token của bạn có thể hết hạn quá sớm. Vui lòng kiểm tra lại các giá trị của bạn " +
                "cho (các) cấu hình sau.",
            header: "Bạn có chắc không?",
            message: "Bạn đã nhập giá trị nhỏ hơn 60 giây cho thời gian hết hạn token."
        },
        reactivateOIDC: {
            assertionHint: "Vui lòng nhập <1>{{ id }}</1> để kích hoạt lại ứng dụng.",
            content: "Nếu bạn kích hoạt lại ứng dụng, một client secret mới sẽ được tạo. " +
                "Vui lòng cập nhật client secret của ứng dụng trên ứng dụng khách của bạn.",
            header: "Bạn có chắc không?",
            message: ""
        },
        reactivateSPA: {
            assertionHint: "Vui lòng nhập <1>{{ id }}</1> để kích hoạt lại ứng dụng.",
            content: "Nếu bạn kích hoạt lại ứng dụng, các luồng xác thực cho " +
                "ứng dụng này sẽ bắt đầu hoạt động. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này có thể được hoàn tác bằng cách thu hồi client id sau này."
        },
        regenerateSecret: {
            assertionHint: "Vui lòng nhập <1>{{ id }}</1> để tạo lại client secret.",
            content: "Nếu bạn tạo lại client secret, các luồng xác thực dùng client secret cũ " +
                "cho ứng dụng này sẽ ngừng hoạt động. Vui lòng cập nhật client secret của ứng dụng trên " +
                "ứng dụng khách của bạn.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và thay đổi vĩnh viễn client secret. " +
                "Vui lòng tiếp tục một cách thận trọng."
        },
        removeApplicationUserAttribute: {
            content : "Nếu bạn xác nhận thao tác này, thuộc tính subject sẽ được đặt về thuộc tính " +
                "mặc định: <1>{{ default }}</1>",
            header: "Bạn có chắc không?",
            subHeader: "Thuộc tính bạn đang cố xóa hiện đang được chọn làm " +
                "thuộc tính subject."
        },
        removeApplicationUserAttributeMapping: {
            content : "Nếu bạn xác nhận thao tác này, bạn phải chọn một thuộc tính subject mới",
            header: "Bạn có chắc không?",
            subHeader: "Thuộc tính bạn đang cố xóa hiện đang được chọn làm " +
                "thuộc tính subject."
        },
        revokeApplication: {
            assertionHint: "Vui lòng nhập <1>{{ id }}</1> để xác nhận.",
            content: "Thao tác này có thể được hoàn tác bằng cách kích hoạt ứng dụng sau này.",
            header: "Bạn có chắc không?",
            message: "Nếu bạn thu hồi ứng dụng này, các luồng xác thực cho ứng dụng này sẽ " +
                "ngừng hoạt động. Vui lòng tiếp tục một cách thận trọng."
        },
        inProgressReshare: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Thao tác này không thể hoàn tác và sẽ hủy bỏ các tác vụ chia sẻ ứng dụng đang diễn ra",
            header: "Bạn có chắc không?",
            message: "Việc chia sẻ ứng dụng với các tổ chức đang diễn ra. Việc hủy sẽ kết thúc tác vụ."
        }
    },
    dangerZoneGroup: {
        deleteApplication: {
            actionTitle: "Xóa",
            header: "Xóa ứng dụng",
            subheader: "Sau khi ứng dụng bị xóa, không thể khôi phục lại và các client " +
                "sử dụng ứng dụng này sẽ không còn hoạt động."
        },
        disableApplication: {
            actionTitle: "Vô hiệu hóa ứng dụng",
            header: "Vô hiệu hóa ứng dụng",
            subheader: "Sau khi ứng dụng bị vô hiệu hóa, người tiêu dùng sẽ không thể truy cập nó." +
                " Và ứng dụng cũng không thể truy cập dữ liệu của người tiêu dùng."
        },
        header: "Vùng nguy hiểm"
    },
    edit: {
        sections: {
            access: {
                addProtocolWizard: {
                    heading: "Thêm giao thức",
                    steps: {
                        protocolSelection: {
                            manualSetup: {
                                emptyPlaceholder: {
                                    subtitles: "Tất cả giao thức đã được cấu hình",
                                    title: "Không có template nào khả dụng"
                                },
                                heading: "Thiết lập thủ công",
                                subHeading: "Thêm một giao thức với cấu hình tùy chỉnh"
                            },
                            quickSetup: {
                                emptyPlaceholder: {
                                    subtitles: "Tất cả giao thức đã được cấu hình",
                                    title: "Không có template nào khả dụng"
                                },
                                heading: "Thiết lập nhanh",
                                subHeading: "Lấy cấu hình giao thức từ một template"
                            }
                        }
                    },
                    subHeading: "Thêm giao thức mới vào ứng dụng {{appName}}"
                },
                protocolLanding: {
                    heading: "Bạn đang sử dụng giao thức nào?",
                    subHeading: "Chọn giao thức cho ứng dụng của bạn để kết nối."
                },
                tabName: "Giao thức"
            },
            advanced: {
                tabName: "Nâng cao"
            },
            attributes: {
                attributeMappingChange: {
                    error: {
                        description: "Các thuộc tính người dùng đã được ánh xạ đã bị thay đổi về giá trị mặc định.",
                        message: "Ánh xạ thuộc tính người dùng đã thay đổi"
                    }
                },
                emptySearchResults: {
                    subtitles: {
                        0: "Chúng tôi không thể tìm thấy kết quả nào cho '{{ searchQuery }}'",
                        1: "Vui lòng thử một từ khóa tìm kiếm khác."
                    },
                    title: "Không tìm thấy kết quả"
                },
                forms: {
                    fields: {
                        dynamic: {
                            applicationRole: {
                                label: "Vai trò ứng dụng",
                                validations: {
                                    duplicate: "Vai trò này đã được ánh xạ. Vui lòng chọn vai trò khác",
                                    empty: "Vui lòng nhập một thuộc tính để ánh xạ tới"
                                }
                            },
                            localRole: {
                                label: "Vai trò cục bộ",
                                validations: {
                                    empty: "Vui lòng nhập vai trò cục bộ"
                                }
                            }
                        }
                    }
                },
                roleMapping: {
                    heading: "Ánh xạ vai trò"
                },
                selection: {
                    addWizard: {
                        header: "Chọn thuộc tính người dùng",
                        steps: {
                            select: {
                                transfer: {
                                    headers: {
                                        attribute: "Chọn tất cả thuộc tính người dùng"
                                    },
                                    searchPlaceholders: {
                                        attribute: "Tìm kiếm thuộc tính người dùng",
                                        role: "Tìm kiếm vai trò"
                                    }
                                }
                            }
                        },
                        subHeading: "Chọn những thuộc tính người dùng bạn muốn chia sẻ với ứng dụng.",
                        note: "Xin lưu ý rằng các thuộc tính người dùng được thêm từ phần này sẽ chỉ được "
                            + "đưa vào ID token."
                    },
                    attributeComponentHint: "Dùng <1>Phạm vi OpenID Connect</1> để quản lý thuộc tính người dùng trong một phạm vi. " +
                        "Bạn có thể thêm thuộc tính mới bằng cách điều hướng đến <3>Thuộc tính.</3>",
                    attributeComponentHintAlt: "Quản lý các thuộc tính người dùng bạn muốn chia sẻ với " +
                        "ứng dụng này. Bạn có thể thêm thuộc tính và ánh xạ mới bằng cách điều hướng đến " +
                        "<1>Thuộc tính.</1>",
                    description: "Chọn các phạm vi, tức là các nhóm thuộc tính người dùng được phép chia sẻ với " +
                        "ứng dụng này.",
                    heading: "Chọn thuộc tính người dùng",
                    scopelessAttributes: {
                        description: "Xem các thuộc tính không có phạm vi",
                        displayName: "Thuộc tính không có phạm vi",
                        name: "",
                        hint: "Không thể lấy các thuộc tính người dùng này bằng cách yêu cầu " +
                                "các phạm vi OIDC. Để lấy, hãy thêm các thuộc tính cần thiết vào một phạm vi phù hợp."
                    },
                    subjectAttributeSelectedHint: "Thuộc tính <1>{{ subjectattribute }}</1> trong phạm vi này được chọn làm định danh subject thay thế.",
                    selectedScopesComponentHint: "Yêu cầu các phạm vi này từ ứng dụng của bạn để lấy " +
                        "các thuộc tính người dùng đã chọn.",
                    howToUseScopesHint: "Cách sử dụng phạm vi",
                    mandatoryAttributeHint: "Đánh dấu những thuộc tính người dùng là bắt buộc phải được chia sẻ " +
                        "với ứng dụng. Khi đăng nhập, {{productName}} nhắc người dùng nhập các " +
                        "giá trị thuộc tính này, nếu chưa được cung cấp trong hồ sơ người dùng.",
                    mappingTable: {
                        actions: {
                            enable: "Bật ánh xạ tên thuộc tính"
                        },
                        columns: {
                            appAttribute: "Thuộc tính người dùng đã ánh xạ",
                            attribute: "Thuộc tính người dùng",
                            mandatory: "Bắt buộc",
                            requested: "Được yêu cầu"
                        },
                        listItem: {
                            actions: {
                                makeMandatory: "Đặt thành bắt buộc",
                                makeRequested: "Đặt thành được yêu cầu",
                                makeScopeRequested: "Đặt thành phạm vi được yêu cầu",
                                removeMandatory: "Bỏ bắt buộc",
                                removeRequested: "Bỏ yêu cầu",
                                removeScopeRequested: "Bỏ yêu cầu phạm vi",
                                subjectDisabledSelection: "Thuộc tính này là bắt buộc vì nó " +
                                    "là thuộc tính subject."
                            },
                            faultyAttributeMapping: "Thiếu ánh xạ thuộc tính OpenID Connect",
                            faultyAttributeMappingHint: "Giá trị thuộc tính sẽ không được chia sẻ cho" +
                                " ứng dụng khi người dùng đăng nhập.",
                            fields: {
                                claim: {
                                    label: "Vui lòng nhập một giá trị",
                                    placeholder: "vd: custom {{name}}, new {{name}}"
                                }
                            }
                        },
                        mappedAtributeHint: "Nhập tên thuộc tính tùy chỉnh sẽ được dùng trong " +
                            "assertion gửi đến ứng dụng.",
                        mappingRevert: {
                            confirmPrimaryAction: "Xác nhận",
                            confirmSecondaryAction: "Hủy",
                            confirmationContent: "Các thuộc tính tùy chỉnh đã ánh xạ sẽ thay đổi " +
                                "trở về các giá trị thuộc tính mặc định. " +
                                "Vui lòng tiếp tục một cách thận trọng vì bạn sẽ không thể " +
                                "lấy lại các giá trị thuộc tính tùy chỉnh đã ánh xạ.",
                            confirmationHeading: "Bạn có chắc không?",
                            confirmationMessage: "Thao tác này sẽ hoàn tác các giá trị thuộc tính tùy chỉnh đã ánh xạ " +
                                "về giá trị mặc định."
                        },
                        searchPlaceholder: "Tìm kiếm thuộc tính người dùng theo tên, tên hiển thị hoặc chi tiết phạm vi"
                    },
                    selectAll: "Chọn tất cả thuộc tính"
                },
                tabName: "Thuộc tính người dùng"
            },
            general: {
                tabName: "Chung"
            },
            info: {
                mtlsOidcHeading: "Endpoint máy chủ Mutual TLS",
                mtlsOidcSubHeading: "Các endpoint máy chủ sau sẽ hữu ích để bạn triển khai " +
                    "và cấu hình xác thực cho ứng dụng của mình bằng OpenID Connect khi áp dụng xác thực " +
                    "client MTLS hoặc ràng buộc token bằng chứng chỉ.  ",
                oidcHeading: "Endpoint máy chủ",
                oidcSubHeading: "Các endpoint máy chủ sau sẽ hữu ích để bạn triển khai và " +
                    "cấu hình xác thực cho ứng dụng của mình bằng OpenID Connect.",
                samlHeading: "Chi tiết kết nối",
                samlSubHeading: "Các chi tiết IdP sau sẽ hữu ích để bạn triển khai và " +
                    "cấu hình xác thực cho ứng dụng của mình bằng SAML 2.0.",
                wsFedHeading: "Chi tiết kết nối",
                wsFedSubHeading: "Các chi tiết IdP sau sẽ hữu ích để bạn triển khai và " +
                    "cấu hình xác thực cho ứng dụng của mình bằng WS-Federation.",
                tabName: "Thông tin"
            },
            protocol: {
                title: "Cấu hình giao thức",
                subtitle: "Cấu hình giao thức cho ứng dụng của bạn.",
                button: "Cấu hình giao thức"
            },
            provisioning: {
                inbound: {
                    heading: "Cấp phát vào",
                    subHeading: "Cấp phát người dùng hoặc nhóm vào kho người dùng của WSO2 Identity Server thông qua " +
                        "ứng dụng này."
                },
                outbound: {
                    actions: {
                        addIdp: "Nhà cấp phát mới"
                    },
                    addIdpWizard: {
                        errors: {
                            noProvisioningConnector: "Nhà cấp phát đã chọn không có" +
                                " connector cấp phát nào."
                        },
                        heading: "Thêm nhà cấp phát ra ngoài",
                        steps: {
                            details: "Chi tiết nhà cấp phát"
                        },
                        subHeading: "Chọn nhà cấp phát để cấp phát người dùng tự đăng ký vào" +
                            " ứng dụng của bạn."
                    },
                    heading: "Cấp phát ra ngoài",
                    subHeading: "Cấu hình một nhà cấp phát để cấp phát ra ngoài người dùng của " +
                        "ứng dụng này."
                },
                tabName: "Cấp phát"
            },
            sharedAccess: {
                title: "Chính sách chia sẻ",
                sharedRoles: "Vai trò được chia sẻ",
                sharingSettings: "Cài đặt chia sẻ cho",
                individualRoleSharingLabel: "Vai trò được chia sẻ riêng lẻ",
                individualRoleSharingHint: "Các vai trò này chỉ được chia sẻ với tổ chức đã chọn. " +
                    "Bạn có thể thêm hoặc xóa vai trò khỏi các tổ chức một cách riêng lẻ trong chế độ này.",
                commonRoleSharingLabel: "Vai trò được chia sẻ chung",
                commonRoleSharingHint: "Tập hợp vai trò này sẽ được chia sẻ với tất cả tổ chức hiện có và tương lai mà " +
                    "ứng dụng được chia sẻ.",
                doNotShareApplication: "Không chia sẻ ứng dụng với bất kỳ tổ chức nào.",
                shareAllApplication: "Chia sẻ ứng dụng với tất cả tổ chức.",
                shareSelectedApplication: "Chia sẻ ứng dụng với các tổ chức được chọn.",
                allRolesSharingMessage: "Tất cả vai trò của ứng dụng sẽ được chia sẻ với tổ chức.",
                allRolesAndOrgsSharingMessage: "Tất cả vai trò của ứng dụng sẽ được chia sẻ với tất cả tổ chức.",
                allRolesAndOrgsNotSharingMessage: "Không có vai trò nào sẽ được chia sẻ với bất kỳ tổ chức nào.",
                allApplicationRolesSharingMessage: "Tất cả vai trò của ứng dụng sẽ được chia sẻ và gán.",
                doNotShareRolesWithAllOrgs: "Không chia sẻ vai trò với tất cả tổ chức.",
                manageRoleSharing: "Quản lý chia sẻ vai trò",
                shareApplicationWithFutureChildOrgs: "Chia sẻ ứng dụng và vai trò với các tổ chức con trong tương lai",
                viewRoleSharing: "Xem vai trò được chia sẻ",
                noSharedOrgs: "Ứng dụng này không được chia sẻ với bất kỳ tổ chức nào.",
                noRolesAvailableForOrg: "Không có vai trò nào khả dụng cho tổ chức đã chọn.",
                roleAudience: {
                    application: "application/{{appName}}",
                    organization: "organization"
                },
                searchAvailableRolesPlaceholder: "Tìm kiếm vai trò khả dụng",
                orgNotSelectedForRoleSharing: "Để chia sẻ vai trò, vui lòng chọn tổ chức từ bảng bên trái.",
                rolesSharedPartially: "Các vai trò được chia sẻ có chọn lọc với tổ chức này.",
                shareRoleSubsetWithSelectedOrgs: "Chia sẻ một tập hợp con vai trò với các tổ chức được chọn",
                shareRoleSubsetWithAllOrgs: "Chỉ chia sẻ một tập hợp con vai trò với tất cả tổ chức",
                subTitle: "Chọn cách ứng dụng và các vai trò sẽ được chia sẻ với các tổ chức.",
                shareAllRoles: "Chia sẻ tất cả vai trò",
                shareSelectedRoles: "Chia sẻ các vai trò được chọn",
                doNotShareRoles: "Không chia sẻ vai trò",
                tabName: "Truy cập được chia sẻ",
                selectAnOrganizationToViewRoles: "Chọn một tổ chức để xem các vai trò được chia sẻ.",
                selectAnOrganizationToMangage: "Chọn một tổ chức để quản lý",
                toManageOrganizationSelectLeftPanel: "Để quản lý tổ chức, vui lòng chọn nó từ bảng bên trái.",
                shareTypeSwitchModal: {
                    header: "Chuyển chế độ chia sẻ sang chia sẻ có chọn lọc?",
                    message: "Thao tác này không thể hoàn tác và sẽ thay đổi cài đặt chia sẻ ứng dụng của bạn.",
                    description: "Bạn sắp chuyển sang chia sẻ có chọn lọc. Vui lòng chọn một trong 2 tùy chọn để tiếp tục.",
                    preserveStateLabel1: "Giữ nguyên trạng thái hiện tại",
                    preserveStateLabel2: "Giữ tất cả tổ chức, vai trò và cấu hình chia sẻ hiện có của ứng dụng.",
                    resetToDefaultLabel1: "Đặt lại về mặc định",
                    resetToDefaultLabel2: "Xóa tất cả cài đặt chia sẻ và bắt đầu với trạng thái sạch."
                },
                showShareAllWarningModal: {
                    header: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác và sẽ thay đổi vai trò trong tất cả tổ chức.",
                    description: "Thao tác này có thể chia sẻ vai trò mới hoặc hủy chia sẻ các vai trò hiện có khỏi tất cả tổ chức.",
                    assertionHint: "Vui lòng xác nhận thao tác của bạn."
                },
                sharedAccessStatusOptions: {
                    all: "Tất cả",
                    success: "Thành công",
                    failed: "Thất bại",
                    partiallyCompleted: "Hoàn thành một phần"
                },
                notifications: {
                    unshare: {
                        success: {
                            description: "Ứng dụng đã được hủy chia sẻ với (các) tổ chức thành công",
                            message: "Đã hủy chia sẻ ứng dụng!"
                        },
                        error: {
                            description: "Hủy chia sẻ ứng dụng thất bại. Vui lòng thử lại",
                            message: "Hủy chia sẻ ứng dụng thất bại!"
                        }
                    },
                    share: {
                        success: {
                            description: "Ứng dụng đã được chia sẻ với (các) tổ chức thành công",
                            message: "Đã chia sẻ ứng dụng!"
                        },
                        error: {
                            description: "Chia sẻ ứng dụng thất bại. Vui lòng thử lại",
                            message: "Chia sẻ ứng dụng thất bại!"
                        }
                    },
                    noOrganizationsSelected: {
                        description: "Vui lòng chọn ít nhất một tổ chức để chia sẻ ứng dụng này.",
                        message: "Chưa chọn tổ chức nào!"
                    },
                    fetchApplicationOrgTree: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy các tổ chức được chia sẻ.",
                            message: "Lấy các tổ chức được chia sẻ thất bại!"
                        }
                    },
                    fetchApplicationRoles: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy các vai trò được chia sẻ của ứng dụng.",
                            message: "Lấy vai trò thất bại!"
                        }
                    },
                    fetchOrganizations: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy các tổ chức.",
                            message: "Lấy tổ chức thất bại!"
                        }
                    },
                    noRolesSelected: {
                        description: "Vui lòng chọn ít nhất một vai trò để chia sẻ với tất cả tổ chức.",
                        message: "Chưa chọn vai trò nào!"
                    }
                }
            },
            shareApplication: {
                addSharingNotification: {
                    genericError: {
                        description: "Chia sẻ ứng dụng thất bại. Vui lòng thử lại",
                        message: "Chia sẻ ứng dụng thất bại!"
                    },
                    success: {
                        description: "Ứng dụng đã được chia sẻ với (các) tổ chức thành công",
                        message: "Đã chia sẻ ứng dụng!"
                    }
                },
                addAsyncSharingNotification: {
                    description: "Việc chia sẻ ứng dụng có thể mất một lúc để hoàn tất.",
                    message: "Đang chia sẻ ứng dụng."
                },
                getSharedOrganizations: {
                    genericError: {
                        description: "Lấy danh sách tổ chức được chia sẻ thất bại!",
                        message: "Lấy danh sách tổ chức được chia sẻ thất bại!"
                    }
                },
                heading: "Chia sẻ ứng dụng",
                shareApplication: "Chia sẻ ứng dụng",
                stopSharingNotification: {
                    genericError: {
                        description: "Dừng chia sẻ ứng dụng thất bại cho {{organization}}",
                        message: "Dừng chia sẻ ứng dụng thất bại!"
                    },
                    success: {
                        description: "Đã dừng chia sẻ ứng dụng với {{organization}} thành công",
                        message: "Dừng chia sẻ ứng dụng thành công!"
                    }
                },
                stopAllSharingNotification: {
                    genericError: {
                        description: "Dừng chia sẻ ứng dụng thất bại cho tất cả tổ chức",
                        message: "Dừng chia sẻ ứng dụng thất bại!"
                    },
                    success: {
                        description: "Đã dừng chia sẻ ứng dụng với tất cả tổ chức thành công",
                        message: "Dừng chia sẻ ứng dụng thành công!"
                    }
                },
                completedSharingNotification: {
                    failure: {
                        description: "Chia sẻ ứng dụng hoàn tất với thất bại cho tất cả tổ chức.",
                        message: "Chia sẻ ứng dụng thất bại."
                    },
                    success: {
                        description: "Ứng dụng đã được chia sẻ với các tổ chức thành công.",
                        message: "Chia sẻ ứng dụng thành công."
                    },
                    partialSuccess: {
                        description: "Chia sẻ ứng dụng hoàn tất với thành công một phần cho một số tổ chức.",
                        message: "Chia sẻ ứng dụng thành công một phần."
                    }
                },
                switchToSelectiveShareFromSharingWithAllSuborgsWarning: "Chuyển từ chia sẻ ứng dụng với tất cả tổ chức sang " +
                    "chia sẻ với các tổ chức được chọn sẽ " +
                    "đặt lại cấu hình ứng dụng trong tất cả tổ chức.",
                asyncOperationStatus: {
                    inProgress: {
                        heading: "Đang cập nhật.",
                        description: "Việc cập nhật truy cập được chia sẻ đang diễn ra."
                    },
                    failed: {
                        heading: "Cập nhật thất bại.",
                        description: "Cập nhật truy cập được chia sẻ thất bại.",
                        actionText: "Xem"
                    },
                    partiallyCompleted: {
                        heading: "Cập nhật thành công một phần.",
                        description: "Cập nhật truy cập được chia sẻ hoàn tất với thành công một phần.",
                        actionText: "Xem"
                    }
                },
                applicationShareFailureSummaryDefaultStatus: {
                    success: "Chia sẻ ứng dụng thành công.",
                    failed: "Chia sẻ ứng dụng thất bại.",
                    partiallyCompleted: "Chia sẻ ứng dụng hoàn thành một phần."
                }
            },
            enhancedOrganizationLogin: {
                title: "Bật đăng nhập tổ chức nâng cao",
                description: "Bật tùy chọn này sẽ chuyển ứng dụng sang đăng nhập tổ chức nâng cao. " +
                    "Thay đổi này có thể yêu cầu cập nhật thủ công thiết lập và cấu hình " +
                    "ứng dụng hiện có của bạn.",
                hint: "Tìm hiểu thêm về đăng nhập tổ chức nâng cao.",
                confirmation: {
                    header: "Bạn có chắc không?",
                    message: "Việc thay đổi chế độ đăng nhập tổ chức nâng cao sẽ ảnh hưởng đến ứng dụng hiện tại. " +
                        "Hãy tiếp tục một cách thận trọng.",
                    content: {
                        0: "Thay đổi này có thể yêu cầu cập nhật thủ công thiết lập và cấu hình " +
                            "ứng dụng của bạn."
                    }
                },
                notifications: {
                    enable: {
                        success: {
                            message: "Đã bật đăng nhập tổ chức nâng cao.",
                            description: "Đăng nhập tổ chức nâng cao đã được bật thành công cho " +
                                "ứng dụng này."
                        },
                        error: {
                            message: "Không thể bật đăng nhập tổ chức nâng cao.",
                            description: "Đã xảy ra lỗi khi bật đăng nhập tổ chức nâng cao. " +
                                "Vui lòng thử lại."
                        }
                    },
                    disable: {
                        success: {
                            message: "Đã tắt đăng nhập tổ chức nâng cao.",
                            description: "Đăng nhập tổ chức nâng cao đã được tắt thành công cho " +
                                "ứng dụng này."
                        },
                        error: {
                            message: "Không thể tắt đăng nhập tổ chức nâng cao.",
                            description: "Đã xảy ra lỗi khi tắt đăng nhập tổ chức nâng cao. " +
                                "Vui lòng thử lại."
                        }
                    }
                }
            },
            signOnMethod: {
                sections: {
                    authenticationFlow: {
                        heading: "Luồng xác thực",
                        sections: {
                            scriptBased: {
                                accordion: {
                                    title: {
                                        description: "Thêm điều kiện vào luồng đăng nhập của bạn.",
                                        heading: {
                                            readOnly: "Xác thực có điều kiện (Chỉ đọc)",
                                            readWrite: "Xác thực có điều kiện"
                                        },
                                        tooltip: {
                                            readOnly: "Bạn không có quyền chỉnh sửa script."
                                        }
                                    }
                                },
                                conditionalAuthTour: {
                                    steps: {
                                        0: {
                                            content: {
                                                0: "Định nghĩa một script để sửa đổi động luồng đăng nhập " +
                                                    "dựa trên ngữ cảnh",
                                                1: "Nhấn vào nút <1>Tiếp theo</1> để tìm hiểu về " +
                                                    "quá trình."
                                            },
                                            heading: "Xác thực có điều kiện"
                                        },
                                        1: {
                                            content: {
                                                0: "Nhấn vào nút này để thêm các " +
                                                    "tùy chọn xác thực cần thiết vào bước."
                                            },
                                            heading: "Thêm xác thực"
                                        },
                                        2: {
                                            content: {
                                                0: "Nhấn vào đây nếu bạn cần thêm các bước vào " +
                                                    "luồng. Sau khi bạn thêm một bước mới, <1>executeStep" +
                                                    "(STEP_NUMBER);</1> sẽ xuất hiện trên trình chỉnh sửa script."
                                            },
                                            heading: "Thêm bước mới"
                                        }
                                    }
                                },
                                editor: {
                                    apiDocumentation: "API",
                                    changeConfirmation: {
                                        content: "Template đã chọn sẽ thay thế script hiện có " +
                                            "trong trình chỉnh sửa cũng như các bước đăng nhập bạn " +
                                            "đã cấu hình. Nhấn <1>Xác nhận</1> để tiếp tục.",
                                        heading: "Bạn có chắc không?",
                                        message: "Thao tác này không thể hoàn tác."
                                    },
                                    goToApiDocumentation: "Đi đến tài liệu API",
                                    resetConfirmation: {
                                        content: "Thao tác này sẽ đặt lại script hiện có " +
                                            "trong trình chỉnh sửa về mặc định. Nhấn <1>Xác nhận</1> " +
                                            "để tiếp tục.",
                                        heading: "Bạn có chắc không?",
                                        message: "Thao tác này không thể hoàn tác."
                                    },
                                    templates: {
                                        darkMode: "Chế độ tối",
                                        heading: "Template"
                                    }
                                },
                                heading: "Cấu hình dựa trên script",
                                hint: "Định nghĩa luồng xác thực thông qua một script thích ứng. Bạn có thể " +
                                    "chọn một trong các template từ bảng để bắt đầu.",
                                secretsList: {
                                    create: "Tạo secret mới",
                                    emptyPlaceholder: "Không có secret nào khả dụng",
                                    search: "Tìm kiếm theo tên secret",
                                    tooltips: {
                                        keyIcon: "Bạn có thể lưu trữ an toàn thông tin nhạy cảm, như " +
                                            "khóa API và các secret khác, để sử dụng trong các script xác thực " +
                                            "có điều kiện. Sau khi lưu, các secret này có thể " +
                                            "được tham chiếu trong script của bạn bằng cú pháp <1>secrets.{tên secret}</1>",
                                        plusIcon: "Thêm vào script"
                                    }
                                },
                                subOrgInfoBanner: "Chỉ những người dùng được chia sẻ từ tổ chức gốc mới có thể " +
                                    "cập nhật script này."
                            },
                            stepBased: {
                                actions: {
                                    addAuthentication: "Thêm xác thực",
                                    addNewStep: "Thêm bước mới",
                                    addStep: "Bước xác thực mới",
                                    selectAuthenticator: "Chọn một phương thức xác thực"
                                },
                                addAuthenticatorModal: {
                                    content: {
                                        addNewAuthenticatorCard: {
                                            title: "Cấu hình kết nối mới"
                                        },
                                        authenticatorGroups: {
                                            basic: {
                                                description: "Tập hợp các phương thức xác thực cơ bản được " +
                                                    "{{productName}} hỗ trợ.",
                                                heading: "Cơ bản"
                                            },
                                            enterprise: {
                                                description: "Đăng nhập doanh nghiệp qua các giao thức tiêu chuẩn.",
                                                heading: "Đăng nhập doanh nghiệp"
                                            },
                                            mfa: {
                                                description: "Thêm lớp bảo mật bổ sung cho " +
                                                    "luồng đăng nhập của bạn.",
                                                heading: "Đa yếu tố"
                                            },
                                            social: {
                                                description: "Dùng tài khoản đăng nhập mạng xã hội hiện có.",
                                                heading: "Đăng nhập mạng xã hội"
                                            },
                                            backupCodes: {
                                                description: "Tùy chọn khôi phục xác thực hai yếu tố.",
                                                heading: "Khôi phục MFA"
                                            },
                                            external: {
                                                heading: "Xác thực người dùng bên ngoài"
                                            },
                                            internal: {
                                                heading: "Xác thực người dùng nội bộ"
                                            },
                                            twoFactorCustom: {
                                                heading: "Xác thực 2FA"
                                            }
                                        },
                                        goBackButton: "Quay lại lựa chọn",
                                        search: {
                                            placeholder: "Tìm kiếm phương thức xác thực"
                                        },
                                        stepSelectDropdown: {
                                            hint: "Chọn bước mà bạn muốn thêm phương thức xác thực vào.",
                                            label:  "Chọn bước",
                                            placeholder: "Chọn bước"
                                        }
                                    },
                                    description: null,
                                    heading: "Thêm xác thực",
                                    primaryButton: null,
                                    secondaryButton: null
                                },
                                authenticatorDisabled: "Bạn cần cấu hình phương thức xác thực này bằng cách " +
                                    "cung cấp client id & secret, để sử dụng với các ứng dụng của bạn.",
                                firstFactorDisabled: "Phương thức xác thực Định danh trước và phương thức " +
                                    "xác thực Tên đăng nhập & Mật khẩu không thể được thêm vào cùng một bước.",
                                sharedUserIdentifierFirstFactorDisabled: "Phương thức xác thực Định danh người dùng được chia sẻ và " +
                                    "phương thức xác thực Tên đăng nhập & Mật khẩu không thể được thêm vào cùng một bước.",
                                forms: {
                                    fields: {
                                        attributesFrom: {
                                            label: "Chọn thuộc tính từ bước này",
                                            placeholder: "Chọn bước"
                                        },
                                        subjectIdentifierFrom: {
                                            label: "Chọn định danh người dùng từ bước này",
                                            placeholder: "Chọn bước"
                                        },
                                        enableBackupCodes: {
                                            label: "Bật mã dự phòng"
                                        }
                                    }
                                },
                                heading: "Cấu hình dựa trên bước",
                                hint: "Tạo luồng đăng nhập người dùng bằng cách kéo các phương thức xác thực vào " +
                                    "các bước liên quan.",
                                secondFactorDisabled: "Các phương thức xác thực yếu tố thứ hai " +
                                    "chỉ có thể được sử dụng nếu <1>Tên người dùng và mật khẩu " +
                                    "mật khẩu</1>, <3>Đăng nhập mạng xã hội</3> hoặc bất kỳ handler nào khác" +
                                    "có thể xử lý các yếu tố này " +
                                    "hiện diện trong một bước trước đó.",
                                secondFactorDisabledDueToProxyMode: "Để cấu hình <1>{{auth}}</1>," +
                                    " bạn nên bật thiết lập cấp phát Just-in-Time" +
                                    " từ các kết nối sau.",
                                secondFactorDisabledInFirstStep: "Các phương thức xác thực yếu tố thứ hai không " +
                                    "thể được sử dụng trong bước đầu tiên.",
                                backupCodesDisabled: "Phương thức xác thực mã dự phòng chỉ có thể được sử dụng nếu các phương thức xác thực " +
                                    "đa yếu tố hiện diện trong bước hiện tại.",
                                backupCodesDisabledInFirstStep: "Phương thức xác thực mã dự phòng không thể được sử dụng " +
                                    "trong bước đầu tiên.",
                                federatedSMSOTPConflictNote: {
                                    multipleIdps: "Asgardeo yêu cầu hồ sơ người dùng chứa" +
                                    " <1>số điện thoại</1> để cấu hình <3>SMS OTP</3> với" +
                                    " các kết nối sau.",
                                    singleIdp: "Asgardeo yêu cầu hồ sơ người dùng chứa"+
                                    " <1>số điện thoại</1> để cấu hình <3>SMS OTP</3> với" +
                                    " kết nối <5>{{idpName}}</5>."
                                },
                                sessionExecutorDisabledInFirstStep: "Handler giới hạn phiên hoạt động yêu cầu " +
                                "có một phương thức xác thực cơ bản trong một bước trước đó.",
                                sessionExecutorDisabledInMultiOptionStep: "Handler giới hạn phiên hoạt động không thể được " +
                                "thêm vào một bước nhiều tùy chọn."
                            }
                        }
                    },
                    customization: {
                        heading: "Tùy chỉnh luồng đăng nhập",
                        revertToDefaultButton: {
                            hint: "Hoàn tác về cấu hình mặc định (Tên đăng nhập & Mật khẩu)",
                            label: "Hoàn tác về mặc định"
                        }
                    },
                    landing: {
                        banners: {
                            registrationConfiguration: "Muốn tùy chỉnh luồng <1>tự đăng ký</1> của tổ chức " +
                                "bạn? Nhấn <3>cấu hình</3> để bắt đầu."
                        },
                        defaultConfig: {
                            description: {
                                0: "Ứng dụng này được cấu hình với đăng nhập <1>Tên đăng nhập & Mật khẩu</1>",
                                1: "Chọn một trong các tùy chọn có sẵn ở phía bên phải để bắt đầu " +
                                    "tùy chỉnh."
                            },
                            heading: "Ứng dụng này được cấu hình với đăng nhập Tên đăng nhập & Mật khẩu"
                        },
                        flowBuilder: {
                            addMissingSocialAuthenticatorModal: {
                                content: {
                                    body: "Bạn chưa có Kết nối mạng xã hội " +
                                        "hoạt động nào được cấu hình với " +
                                        "<1>Phương thức xác thực {{authenticator}}</1>. Nhấn vào " +
                                        "<3>Cấu hình</3> để đăng ký" +
                                        " một <5>Kết nối mạng xã hội " +
                                        "{{authenticator}}</5> mới hoặc điều hướng đến phần <7>Kết nối</7>" +
                                        " theo cách thủ công.",
                                    message: "Chưa cấu hình Kết nối mạng xã hội " +
                                        "{{authenticator}} nào đang hoạt động"
                                },
                                description: "",
                                heading: "Cấu hình Kết nối mạng xã hội {{authenticator}}",
                                primaryButton: "Cấu hình",
                                secondaryButton: "Hủy"
                            },
                            duplicateSocialAuthenticatorSelectionModal: {
                                content: {
                                    body: "Bạn có nhiều Kết nối mạng xã hội được cấu hình với <1>" +
                                        "Phương thức xác thực {{authenticator}}</1>. Chọn kết nối mong muốn " +
                                        "từ lựa chọn bên dưới để tiếp tục.",
                                    message: "Tìm thấy nhiều Kết nối mạng xã hội với Phương thức xác thực " +
                                        "{{authenticator}}."
                                },
                                description: "",
                                heading: "Chọn Kết nối mạng xã hội {{authenticator}}",
                                primaryButton: "Tiếp tục",
                                secondaryButton: "Hủy"
                            },
                            heading: "Xây dựng luồng đăng nhập của riêng bạn",
                            headings: {
                                default: "Đăng nhập mặc định",
                                multiFactorLogin: "Đăng nhập đa yếu tố",
                                passwordlessLogin: "Đăng nhập không mật khẩu",
                                socialLogin: "Đăng nhập mạng xã hội"
                            },
                            types: {
                                apple: {
                                    description: "Cho phép người dùng đăng nhập bằng Apple ID.",
                                    heading: "Thêm đăng nhập Apple"
                                },
                                defaultConfig: {
                                    description: "Xây dựng luồng đăng nhập của bạn bắt đầu với đăng nhập Tên đăng nhập & "
                                        + "Mật khẩu.",
                                    heading: "Bắt đầu với cấu hình mặc định"
                                },
                                facebook: {
                                    description: "Cho phép người dùng đăng nhập bằng Facebook.",
                                    heading: "Thêm đăng nhập Facebook"
                                },
                                github: {
                                    description: "Cho phép người dùng đăng nhập bằng GitHub.",
                                    heading: "Thêm đăng nhập GitHub"
                                },
                                google: {
                                    description: "Cho phép người dùng đăng nhập bằng Google.",
                                    heading: "Thêm đăng nhập Google"
                                },
                                idf: {
                                    tooltipText: "Phương thức xác thực định danh trước không xác minh" +
                                        " danh tính người dùng, và do đó không thể được dùng để chọn" +
                                        " danh tính hoặc thuộc tính người dùng. Để làm vậy, hãy bật kiểm tra hợp lệ" +
                                        " bằng một script xác thực."
                                },
                                magicLink: {
                                    description: "Cho phép người dùng đăng nhập bằng một magic " +
                                        + "link được gửi đến email của họ.",
                                    heading: "Thêm đăng nhập Magic Link"
                                },
                                microsoft: {
                                    description: "Cho phép người dùng đăng nhập bằng Microsoft.",
                                    heading: "Thêm đăng nhập Microsoft"
                                },
                                totp: {
                                    description: "Bật lớp xác thực bổ sung với OTP dựa trên " +
                                        + "thời gian.",
                                    heading: "Thêm TOTP làm yếu tố thứ hai",
                                    info: {
                                        totpWithIdentifierFirstEnabled: "Phương thức xác thực TOTP với handler Định danh trước được cấu hình.",
                                        totpWithIdentifierFirstEnabledMessage: "Việc cấu hình phương thức xác thực TOTP " +
                                        "với handler Định danh trước không được khuyến nghị vì <2>đăng ký TOTP tăng dần</2> được " +
                                        "bật mặc định. Bạn có thể tắt đăng ký TOTP tăng dần thông qua " +
                                        " script <4>Xác thực có điều kiện</4>.",
                                        totpWithSharedUserIdentifierEnabled: "Phương thức xác thực TOTP với handler Định danh người dùng được chia sẻ được cấu hình.",
                                        totpWithSharedUserIdentifierEnabledMessage: "Việc cấu hình phương thức xác thực TOTP " +
                                        "với handler Định danh người dùng được chia sẻ không được khuyến nghị vì <2>đăng ký TOTP tăng dần</2> được " +
                                        "bật mặc định. Bạn có thể tắt đăng ký TOTP tăng dần thông qua " +
                                        " script <4>Xác thực có điều kiện</4>."
                                    }
                                },
                                usernameless: {
                                    description: "Cho phép người dùng đăng nhập bằng passkey, khóa bảo mật FIDO hoặc "
                                        + "sinh trắc học.",
                                    heading: "Thêm đăng nhập Passkey",
                                    info: "Đăng ký passkey tức thời chỉ khả dụng " +
                                    "cho các passkey được FIDO2 hỗ trợ và những người dùng muốn đăng ký " +
                                    "nhiều passkey phải thực hiện qua MyAccount."
                                },
                                passkey: {
                                    description: "Cho phép người dùng đăng nhập bằng passkey, khóa bảo mật FIDO hoặc " +
                                    "sinh trắc học.",
                                    heading: "Thêm đăng nhập Passkey",
                                    info: {
                                        progressiveEnrollmentEnabled: "Đăng ký passkey tăng dần được bật.",
                                        passkeyAsFirstStepWhenprogressiveEnrollmentEnabled: "<0>Lưu ý: </0> Đối với " +
                                        "việc đăng ký người dùng tức thời bằng passkey, hãy dùng template <2>Đăng ký Passkey " +
                                        "tăng dần</2> trong phần <4>Xác thực có điều kiện</4>.",
                                        passkeyIsNotFirstStepWhenprogressiveEnrollmentEnabled: "Người dùng có thể đăng ký " +
                                        "passkey tức thời. Nếu người dùng muốn đăng ký nhiều passkey, họ nên thực hiện " +
                                        "qua <1>My Account</1>.",
                                        progressiveEnrollmentEnabledCheckbox: "<0>Lưu ý: </0> Khi đặt " +
                                        "Passkey trong <2>bước đầu tiên</2>, người dùng cần thêm một script " +
                                        "thích ứng. Dùng template <4>Đăng ký Passkey tăng dần</4> trong " +
                                        "tab <6>Phương thức đăng nhập</6> của ứng dụng.",
                                        progressiveEnrollmentDisabled: "<1>Đăng ký passkey tăng dần</1> bị tắt. " +
                                        "Người dùng phải đăng ký passkey của họ qua <2>My Account</2> để sử dụng đăng nhập không mật khẩu."
                                    }
                                },
                                emailOTP: {
                                    description: "Bật lớp xác thực bổ sung với OTP dựa trên Email.",
                                    heading: "Thêm Email OTP làm yếu tố thứ hai"
                                },
                                smsOTP: {
                                    description: "Bật lớp xác thực bổ sung với OTP dựa trên SMS.",
                                    heading: "Thêm SMS OTP làm yếu tố thứ hai"
                                },
                                emailOTPFirstFactor: {
                                    description: "Cho phép người dùng đăng nhập bằng mật khẩu dùng một lần "
                                        + "được gửi đến email của họ.",
                                    heading: "Thêm đăng nhập Email OTP"
                                },
                                smsOTPFirstFactor: {
                                    description: "Cho phép người dùng đăng nhập bằng mật khẩu dùng một lần "
                                        + "được gửi đến điện thoại của họ.",
                                    heading: "Thêm đăng nhập SMS OTP"
                                }
                            },
                            validation: {
                                smsOTPRequiresMobileField: {
                                    message: "SMS OTP yêu cầu ít nhất một trường số điện thoại hiện diện trong luồng."
                                },
                                emailOTPRequiresEmailField: {
                                    message: "Email OTP yêu cầu ít nhất một trường email hiện diện trong luồng."
                                },
                                passwordRecoveryRequiresFactors: {
                                    message: "Khôi phục mật khẩu yêu cầu ít nhất một yếu tố khôi phục, như " +
                                        "Email OTP, SMS OTP hoặc Magic Link, hiện diện trong luồng."
                                },
                                passwordExecutorRequired: {
                                    message: "Biểu mẫu có trường Mật khẩu yêu cầu một Hành động 'Cấp phát mật khẩu' được cấu hình cho nút."
                                },
                                otpStepButtonsOutsideForm: {
                                    message: "Các bước bao gồm thành phần biểu mẫu OTP chỉ có thể có các nút hành động bên trong chính thành phần biểu mẫu OTP."
                                },
                                otpStepSingleActionButton: {
                                    message: "Biểu mẫu có bước OTP chỉ có thể có một nút hành động ngoài nút Gửi lại."
                                },
                                otpStepMultipleForms: {
                                    message: "Không cho phép nhiều biểu mẫu có bước OTP."
                                }
                            }
                        }
                    },
                    requestPathAuthenticators: {
                        notifications: {
                            getRequestPathAuthenticators: {
                                error: {
                                    description: "{{ description }}",
                                    message: "Lỗi lấy dữ liệu"
                                },
                                genericError: {
                                    description: "Đã xảy ra lỗi khi lấy các phương thức xác thực đường dẫn yêu cầu.",
                                    message: "Lỗi lấy dữ liệu"
                                },
                                success: {
                                    description: "",
                                    message: ""
                                }
                            }
                        },
                        subTitle: "Các phương thức xác thực cục bộ cho xác thực đường dẫn yêu cầu.",
                        title: "Xác thực đường dẫn yêu cầu"
                    },
                    templateDescription: {
                        description: {
                            code: "Mã",
                            defaultSteps: "Các bước mặc định",
                            description: "Mô tả",
                            helpReference: "Tham chiếu trợ giúp",
                            parameters: "Tham số",
                            prerequisites: "Điều kiện tiên quyết"
                        },
                        popupContent: "Thêm chi tiết"
                    }
                },
                tabName: "Luồng đăng nhập"
            },
            apiAuthorization: {
                limitedAccessMessage: "Bạn không có quyền gán tất cả tài nguyên API. Một số tài nguyên API bị vô hiệu hóa.",
                m2mPolicyMessage: "Tất cả phạm vi được ủy quyền của một tài nguyên API đều khả dụng cho ứng dụng M2M bất kể chính sách ủy quyền được chỉ định cho tài nguyên."
            },
            roles: {
                createApplicationRoleWizard: {
                    title: "Tạo vai trò ứng dụng",
                    subTitle: "Tạo một vai trò ứng dụng mới trong hệ thống.",
                    button: "Vai trò mới"
                }
            }
        }
    },
    forms: {
        advancedAttributeSettings: {
            sections: {
                linkedAccounts: {
                    errorAlert: {
                        message: "Cấu hình không hợp lệ",
                        description: "Kiểm tra hợp lệ tài khoản cục bộ được liên kết phải được bật để bắt buộc một tài khoản cục bộ được liên kết"
                    },
                    heading: "Phân giải thuộc tính cho tài khoản được liên kết",
                    descriptionFederated: "Quản lý cách các thuộc tính người dùng được phân giải khi một tài khoản cục bộ được liên kết với một danh tính liên kết.",
                    fields: {
                        validateLocalAccount: {
                            label: "Dùng thuộc tính tài khoản cục bộ được liên kết",
                            hint: "Nếu tồn tại một tài khoản cục bộ được liên kết, các thuộc tính của nó sẽ được dùng. Nếu không tìm thấy tài khoản được liên kết, các thuộc tính của tài khoản người dùng liên kết sẽ được dùng thay thế."
                        },
                        mandateLocalAccount: {
                            label: "Yêu cầu tài khoản cục bộ được liên kết",
                            hint: "Xác thực sẽ thất bại nếu không tìm thấy tài khoản cục bộ được liên kết trong quá trình trao đổi token.",
                            unifiedHint: "Xác thực sẽ thất bại nếu không tìm thấy tài khoản cục bộ được liên kết trong quá trình đăng nhập và trao đổi token."
                        }
                    }
                },
                role: {
                    fields: {
                        role: {
                            hint: "Tùy chọn này sẽ thêm miền kho người dùng nơi người dùng cư trú vào" +
                                " vai trò",
                            label: "Bao gồm miền người dùng",
                            validations: {
                                empty: "Chọn thuộc tính vai trò"
                            }
                        },
                        roleAttribute: {
                            hint: "Chọn thuộc tính",
                            label: "Thuộc tính vai trò",
                            validations: {
                                empty: "Chọn thuộc tính vai trò"
                            }
                        }
                    },
                    heading: "Vai trò"
                },
                subject: {
                    fields:{
                        alternateSubjectAttribute: {
                            hint: "Tùy chọn này sẽ cho phép dùng một thuộc tính thay thế làm định danh subject thay vì " +
                                "<1>{{defaultSubjectAttribute}}</1>.",
                            label: "Gán định danh subject thay thế"
                        },
                        subjectAttribute: {
                            hint: "Chọn thuộc tính bạn muốn dùng làm định danh subject của người dùng",
                            hintOIDC: "Chọn thuộc tính bạn muốn dùng làm định danh subject của" +
                                " người dùng. Thuộc tính này đại diện cho claim <1>sub</1> của <1>id_token</1>.",
                            hintSAML: "Chọn thuộc tính bạn muốn dùng làm định danh subject của" +
                                " người dùng. Thuộc tính này đại diện cho phần tử <1>subject</1> của SAML assertion.",
                            label: "Thuộc tính subject",
                            validations: {
                                empty: "Chọn thuộc tính subject"
                            },
                            placeholder: "Chọn một thuộc tính",
                            info: "Định danh subject thay thế chỉ có thể được gán khi ứng dụng đã có các thuộc tính người dùng" +
                                " để lựa chọn."
                        },
                        subjectIncludeTenantDomain: {
                            hint: "Tùy chọn này sẽ thêm tên tổ chức vào định danh subject " +
                                " cục bộ",
                            label: "Bao gồm tên tổ chức",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        subjectIncludeUserDomain: {
                            hint: "Tùy chọn này sẽ thêm miền kho người dùng nơi người dùng cư trú " +
                                " vào định danh subject cục bộ",
                            label: "Bao gồm miền người dùng",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        subjectUseMappedLocalSubject: {
                            hint: "Tùy chọn này sẽ dùng định danh subject cục bộ khi xác nhận " +
                                "danh tính",
                            label: "Dùng subject cục bộ đã ánh xạ",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        subjectType: {
                            label: "Loại subject",
                            public: {
                                label: "Công khai",
                                hint: "Tùy chọn này sẽ dùng định danh subject công khai làm" +
                                    " subject. URI định danh subject được dùng trong tính toán" +
                                    " giá trị subject."
                            },
                            pairwise: {
                                label: "Pairwise",
                                hint: "Bật pairwise để gán một ID ẩn danh duy nhất " +
                                    "cho mỗi client. URI định danh subject và URI callback hoặc " +
                                    "URI định danh sector được xem xét trong việc tính giá trị subject."
                            }
                        },
                        sectorIdentifierURI: {
                            label: "URI định danh sector",
                            hint: "Phải cấu hình giá trị này nếu nhiều URI callback với" +
                                " các tên máy chủ khác nhau được cấu hình.",
                            placeholder: "Nhập URI định danh subject",
                            validations: {
                                invalid: "URL đã nhập không phải HTTPS. Vui lòng thêm một URL hợp lệ.",
                                required: "Trường này là bắt buộc nếu nhiều URI callback được" +
                                    " cấu hình."
                            },
                            multipleCallbackError: "Cần cấu hình một URI định danh sector nếu " +
                                "nhiều URL callback được cấu hình với loại subject pairwise. Đi đến" +
                                " Thuộc tính người dùng -> Subject để cấu hình URI định danh sector."
                        }
                    },
                    heading: "Subject"
                }
            }
        },
        advancedConfig: {
            fields: {
                enableAuthorization: {
                    hint: "Quyết định liệu các chính sách ủy quyền có cần được kích hoạt trong " +
                        " các luồng xác thực hay không.",
                    label: "Bật ủy quyền",
                    validations: {
                        empty: "Đây là trường bắt buộc."
                    }
                },
                returnAuthenticatedIdpList: {
                    hint: " Danh sách các nhà cung cấp danh tính đã xác thực sẽ được trả về trong " +
                        "phản hồi xác thực.",
                    label: "Trả về danh sách IDP đã xác thực",
                    validations: {
                        empty: "Đây là trường bắt buộc."
                    }
                },
                saas: {
                    hint: "Mặc định, ứng dụng chỉ có thể được sử dụng bởi người dùng thuộc " +
                        "tổ chức của ứng dụng. Nếu ứng dụng này được bật SaaS, nó sẽ " +
                        "khả dụng cho tất cả người dùng trên tất cả tổ chức.",
                    label: "Ứng dụng SaaS",
                    validations: {
                        empty: "Đây là trường bắt buộc."
                    }
                },
                skipConsentLogin: {
                    hint: "Sau khi được bật, trang nhắc lấy chấp thuận người dùng sẽ " +
                        "bị bỏ qua cho ứng dụng này trong quá trình đăng nhập.",
                    label: "Bỏ qua chấp thuận đăng nhập",
                    validations: {
                        empty: "Đây là trường bắt buộc."
                    }
                },
                skipConsentLogout: {
                    hint: "Sau khi được bật, trang nhắc lấy chấp thuận người dùng sẽ " +
                        "bị bỏ qua cho ứng dụng này trong quá trình đăng xuất.",
                    label: "Bỏ qua chấp thuận đăng xuất",
                    validations: {
                        empty: "Đây là trường bắt buộc."
                    }
                }
            },
            sections: {
                applicationNativeAuthentication: {
                    heading: "Xác thực gốc ứng dụng",
                    alerts: {
                        apiAuthCompatibilityWarning: "Xin lưu ý rằng một số phương thức xác thực được cấu hình trong luồng xác thực không hỗ trợ xác thực gốc ứng dụng."
                    },
                    fields: {
                        enableAPIBasedAuthentication: {
                            hint: "Chọn để ủy quyền cho ứng dụng thực hiện xác thực trong ứng dụng, không cần trình duyệt, thông qua API xác thực gốc ứng dụng.",
                            label: "Bật API xác thực gốc ứng dụng"
                        }
                    }
                },
                clientAttestation: {
                    heading: "Chứng thực client",
                    alerts: {
                        clientAttestationAlert: "Để chứng thực client hoạt động, API xác thực gốc ứng dụng phải được bật."
                    },
                    fields: {
                        enableClientAttestation: {
                            hint: "Chọn để xác minh tính toàn vẹn của ứng dụng bằng cách gọi dịch vụ chứng thực của nền tảng lưu trữ. Để bật tùy chọn này, bạn sẽ cần thiết lập <1>Cài đặt nền tảng</1>.",
                            label: "Bật chứng thực client"
                        },
                        androidAttestationServiceCredentials: {
                            hint: "Cung cấp thông tin xác thực tài khoản dịch vụ Google ở định dạng JSON cho ứng dụng Android. Thông tin này sẽ được dùng để truy cập Dịch vụ Google Play Integrity.",
                            label: "Thông tin xác thực tài khoản dịch vụ",
                            placeholder: "Nội dung của tệp khóa JSON cho thông tin xác thực tài khoản dịch vụ Google",
                            validations: {
                                empty: "Cần có thông tin xác thực tài khoản dịch vụ Google cho chứng thực client.",
                                invalid: "Thông tin xác thực tài khoản dịch vụ Google không hợp lệ"
                            }
                        }
                    }
                },
                trustedApps: {
                    heading: "Cài đặt ứng dụng tin cậy",
                    alerts: {
                        trustedAppSettingsAlert: "Bật tính năng này sẽ công bố chi tiết trong <1>Cài đặt nền tảng</1> đến một endpoint công khai có thể truy cập bởi tất cả tổ chức Asgardeo. Do đó, các tổ chức khác có thể xem thông tin về ứng dụng của bạn và tổ chức liên kết của nó. Tùy chọn này không áp dụng nếu bạn đang dùng miền tùy chỉnh.",
                        link: "Đọc để biết thêm."
                    },
                    fields: {
                        enableFIDOTrustedApps: {
                            hint: "Chọn để tin cậy ứng dụng cho việc đăng nhập người dùng bằng passkey. Cung cấp chi tiết của ứng dụng trong <1>Cài đặt nền tảng</1>.",
                            label: "Thêm làm ứng dụng tin cậy FIDO"
                        }
                    },
                    modal: {
                        assertionHint : "Tôi hiểu và muốn tiếp tục.",
                        header: "Bạn có chắc không?",
                        message: "Cho mục đích kiểm tra hợp lệ, các chi tiết có trong Cài đặt nền tảng sẽ được liệt kê trên một endpoint công khai được chia sẻ trên tất cả tổ chức.",
                        content: ""
                    }
                },
                platformSettings: {
                    clientAttestationOnlySubTitle: "Các cấu hình dành riêng cho nền tảng sau là cần thiết khi bật các tính năng liên quan đến chứng thực client.",
                    heading: "Cài đặt nền tảng",
                    subTitle: "Các cấu hình dành riêng cho nền tảng sau là cần thiết khi bật các tính năng liên quan đến chứng thực client hoặc ứng dụng tin cậy.",
                    trustedAppsOnlySubTitle: "Các cấu hình dành riêng cho nền tảng sau là cần thiết khi bật các tính năng liên quan đến ứng dụng tin cậy.",
                    fields: {
                        android: {
                            heading: "Android",
                            fields: {
                                androidPackageName: {
                                    hint: "Nhập tên gói của ứng dụng của bạn. Đây là định danh duy nhất của ứng dụng và thường ở định dạng miền đảo ngược.",
                                    label: "Tên gói",
                                    placeholder: "com.example.myapp",
                                    validations: {
                                        emptyForAttestation: "Cần có tên gói ứng dụng để chứng thực client.",
                                        emptyForFIDO: "Cần có tên gói ứng dụng cho các ứng dụng tin cậy FIDO."
                                    }
                                },
                                keyHashes: {
                                    hint: "Các dấu vân tay SHA256 liên quan đến chứng chỉ ký của ứng dụng của bạn.",
                                    label: "Key Hashes",
                                    placeholder: "D4:B9:A3",
                                    validations: {
                                        invalidOrEmpty: "Cần có một key hash hợp lệ cho các ứng dụng tin cậy FIDO.",
                                        duplicate: "Các key hash giống nhau đã được thêm."
                                    },
                                    tooltip: "Thêm thumbprint"

                                }
                            }
                        },
                        apple: {
                            heading: "Apple",
                            fields: {
                                appleAppId: {
                                    hint: "Nhập Apple app ID, định danh duy nhất được Apple gán cho ứng dụng của bạn.",
                                    label: "App id",
                                    placeholder: "com.example.myapp"
                                }
                            }
                        }
                    }
                },
                certificate: {
                    fields: {
                        jwksValue: {
                            description: "URL được dùng để lấy khóa công khai JWKS.",
                            label: "URL",
                            placeholder: "https://myapp.io/jwks",
                            validations: {
                                empty: "Đây là trường bắt buộc.",
                                invalid: "Nhập một URL hợp lệ"
                            }
                        },
                        pemValue: {
                            actions: {
                                view: "Xem thông tin chứng chỉ"
                            },
                            description: "Giá trị văn bản của chứng chỉ ở định dạng PEM.",
                            hint: "Chứng chỉ (ở định dạng PEM) của ứng dụng.",
                            label: "Chứng chỉ",
                            placeholder: "Chứng chỉ ở định dạng PEM.",
                            validations: {
                                empty: "Đây là trường bắt buộc.",
                                invalid: "Nhập một chứng chỉ hợp lệ ở định dạng PEM"
                            }
                        },
                        type: {
                            children: {
                                jwks: {
                                    label: "Dùng endpoint JWKS"
                                },
                                pem: {
                                    label: "Cung cấp chứng chỉ"
                                }
                            },
                            label: "Loại"
                        }
                    },
                    heading: "Chứng chỉ",
                    hint: {
                        customOidc: "Chứng chỉ này được dùng để mã hóa <1>id_token</1>" +
                            " được trả về sau khi xác thực.",
                        customPassiveSTS: "Chứng chỉ này được dùng để xác thực chữ ký của các yêu cầu đã ký.",
                        customSaml: "Chứng chỉ này được dùng để xác thực chữ ký của các " +
                            "yêu cầu đã ký và để mã hóa các SAML assertion được trả về sau " +
                            "xác thực."
                    },
                    invalidOperationModal: {
                        header: "Thao tác không hợp lệ",
                        message: "Bạn nên tắt kiểm tra hợp lệ chữ ký yêu cầu để xóa "+
                            "chứng chỉ. Nếu ký yêu cầu hoặc phản hồi được bật, "+
                            "việc có một chứng chỉ hợp lệ để xác minh chữ ký là thiết yếu."
                    }
                }
            }
        },

        applicationsSettings: {
            title: "Cài đặt ứng dụng",
            fields: {
                dcrEndpoint: {
                    label: "Endpoint DCR",
                    hint: "Endpoint DCR cho phép các client OAuth được đăng ký làm ứng dụng trong một máy chủ ủy quyền."
                },
                ssaJwks: {
                    label: "Endpoint JWKS để kiểm tra hợp lệ SSA",
                    placeholder: "https://example.com/samplejwks.jwks",
                    hint: "URL JWKS sẽ được dùng để kiểm tra hợp lệ software statement assertion (SSA) đến trong yêu cầu tạo DCR.",
                    validations: {
                        empty: "Cần có URL JWKS để kiểm tra hợp lệ SSA"
                    }
                },
                mandateSSA: {
                    label: "Bắt buộc kiểm tra hợp lệ SSA",
                    hint: "Khi được chọn, kiểm tra hợp lệ SSA là bắt buộc, và tham số software_statement là bắt buộc cho yêu cầu tạo DCR."
                },
                authenticationRequired: {
                    label: "Yêu cầu xác thực",
                    hint: "Khi được chọn, xác thực sẽ là bắt buộc cho endpoint tạo DCR. Nếu không chọn, không cần xác thực để gọi endpoint tạo DCR."
                },
                enforceFapi: {
                    label: "Bắt buộc tuân thủ FAPI",
                    hint: "Khi được chọn, một ứng dụng được tạo thông qua endpoint DCR sẽ là một ứng dụng tuân thủ FAPI."
                }
            }
        },
        generalDetails: {
            sections: {
                branding: {
                    title: "Thương hiệu"
                }
            },
            brandingLink: {
                hint: "Thao tác này sẽ đưa bạn đến trang Thương hiệu, nơi bạn có thể tùy chỉnh giao diện người dùng hướng đến người tiêu dùng của ứng dụng như logo, màu sắc, phông chữ.",
                label: "Đi đến Thương hiệu ứng dụng"
            },
            fields: {
                accessUrl: {
                    hint: "URL trang đích cho ứng dụng này. Nó sẽ được dùng trong danh mục ứng dụng" +
                        " và các luồng khám phá. Nếu trang đăng nhập hết thời gian chờ, người dùng sẽ " +
                        "được chuyển hướng đến ứng dụng khách thông qua URL này.",
                    label: "URL truy cập",
                    placeholder: "https://myapp.io/home",
                    validations: {
                        empty: "Phải cung cấp một URL truy cập hợp lệ để ứng dụng này có thể được khám phá.",
                        invalid: "Nhập một URL hợp lệ"
                    },
                    ariaLabel: "URL truy cập ứng dụng"
                },
                description: {
                    label: "Mô tả",
                    placeholder: "Nhập mô tả cho ứng dụng"
                },
                discoverable: {
                    hint: "Nếu được bật, khách hàng có thể truy cập ứng dụng này từ " +
                        "cổng <1>{{ myAccount }}</1>.",
                    label: "Ứng dụng có thể khám phá"
                },
                discoverableGroups: {
                    label: "Nhóm có thể khám phá",
                    action: {
                        assign: "Nhập tên nhóm để tìm và gán nhóm"
                    },
                    radioOptions: {
                        everyone: "Mọi người trong tổ chức có thể khám phá ứng dụng này",
                        userGroups: "Chỉ một nhóm người dùng được chọn mới có thể khám phá ứng dụng này"
                    }
                },
                imageUrl: {
                    hint: "URL hình ảnh cho ứng dụng. Nếu không được cung cấp, chúng tôi sẽ hiển thị " +
                        "một hình thu nhỏ được tạo thay thế. Kích thước khuyến nghị: 200x200 pixel.",
                    label: "Logo",
                    placeholder: "https://myapp-resources.io/my_app_image.png",
                    validations: {
                        invalid: "Đây không phải là URL hình ảnh hợp lệ"
                    }
                },
                isSharingEnabled: {
                    hint: "Nếu được bật, nó sẽ chia sẻ ứng dụng này với tất cả hoặc bất kỳ tổ chức được chọn " +
                        "thuộc tổ chức gốc của bạn.",
                    label: "Cho phép chia sẻ với các tổ chức"
                },
                isManagementApp: {
                    hint: "Bật để cho phép ứng dụng truy cập API quản lý của tổ chức này.",
                    label: "Ứng dụng quản lý"
                },
                isFapiApp: {
                    hint: "Khi được bật, ứng dụng thực thi các yêu cầu hồ sơ bảo mật FAPI. Các cấu hình giao thức như loại grant, ràng buộc token và phương thức xác thực client sẽ bị hạn chế để tuân thủ hồ sơ FAPI đã chọn.",
                    label: "Bắt buộc tuân thủ hồ sơ bảo mật FAPI cho ứng dụng này"
                },
                name: {
                    label: "Tên",
                    placeholder: "Ứng dụng của tôi",
                    validations: {
                        duplicate: "Đã tồn tại một ứng dụng với tên này. " +
                            "Vui lòng nhập một tên khác.",
                        empty: "Cần có tên ứng dụng.",
                        reserved: "{{appName}} là một tên ứng dụng được bảo lưu. Vui lòng nhập một tên " +
                            "khác."
                    }
                }
            },
            managementAppBanner: "Ứng dụng được phép truy cập các API quản lý của " +
                "tổ chức này."
        },
        inboundCustom: {
            fields: {
                checkbox: {
                    label: "{{label}}",
                    validations: {
                        empty: "Cung cấp {{name}}"
                    }
                },
                dropdown: {
                    label: "{{label}}",
                    placeholder: "Nhập {{name}}",
                    validations: {
                        empty: "Cung cấp {{name}}"
                    }
                },
                generic: {
                    label: "{{label}}",
                    placeholder: "Nhập {{name}}",
                    validations: {
                        empty: "Chọn {{name}}"
                    }
                },
                password: {
                    label: "{{label}}",
                    placeholder: "Nhập {{name}}",
                    validations: {
                        empty: "Cung cấp {{name}}"
                    }
                }
            }
        },
        inboundOIDC: {
            description: "Dưới đây là cài đặt {{protocol}} cho ứng dụng của bạn.",
            documentation: "Đọc <1>tài liệu</1> của chúng tôi để tìm hiểu thêm về việc sử dụng " +
                "giao thức <3>{{protocol}}</3> để triển khai đăng nhập trong ứng dụng của bạn.",
            fields: {
                allowedOrigins: {
                    hint: "Origin được phép là các URL sẽ được phép thực hiện yêu cầu từ " +
                        "các origin chéo đến các API {{productName}}",
                    label: "Origin được phép",
                    placeholder: "https://myapp.io",
                    validations: {
                        empty: "Vui lòng thêm một origin hợp lệ."
                    }
                },
                callBackUrls: {
                    hint: "URL chuyển hướng được ủy quyền xác định nơi mã ủy quyền được gửi " +
                        "đến sau khi xác thực người dùng, và nơi người dùng được chuyển hướng đến khi " +
                        "đăng xuất. Ứng dụng khách nên chỉ định URL chuyển hướng được ủy quyền trong " +
                        "yêu cầu ủy quyền hoặc đăng xuất và {{productName}} sẽ kiểm tra nó dựa trên " +
                        "các URL chuyển hướng được ủy quyền đã nhập tại đây.",
                    info: "Chưa có ứng dụng? Hãy thử một ứng dụng mẫu dùng {{callBackURLFromTemplate}} " +
                        "làm URL chuyển hướng được ủy quyền. (Bạn có thể tải xuống và chạy mẫu ở " +
                        "bước sau.)",
                    label: "URL chuyển hướng được ủy quyền",
                    placeholder: "https://myapp.io/login",
                    validations: {
                        empty: "Đây là trường bắt buộc.",
                        invalid: "URL đã nhập không phải HTTP cũng không phải HTTPS. Vui lòng thêm một URL hợp lệ.",
                        required: "Trường này là bắt buộc cho một ứng dụng hoạt động. " +
                            "Tuy nhiên, nếu bạn dự định thử ứng dụng mẫu, " +
                            "có thể bỏ qua trường này."
                    }
                },
                clientID: {
                    label: "Client ID"
                },
                clientSecret: {
                    hashedDisclaimer: "Client secret được băm. Nếu bạn cần lấy lại nó, " +
                        "vui lòng tạo lại secret.",
                    hideSecret: "Ẩn secret",
                    label: "Client secret",
                    message: "{{productName}} không phát hành <1>client_secret</1> " +
                        "cho các ứng dụng gốc " +
                        "hoặc ứng dụng dựa trên trình duyệt web cho mục đích " +
                        "xác thực client.",
                    placeholder: "Nhập Client Secret",
                    showSecret: "Hiện secret",
                    validations: {
                        empty: "Đây là trường bắt buộc."
                    }
                },
                grant: {
                    children: {
                        client_credential: {
                            hint: "Loại grant này không hỗ trợ phạm vi 'openid'.",
                            label: "(không cho phép phạm vi openid)"
                        },
                        implicit: {
                            hint: "Loại grant này không được khuyến nghị.",
                            label: "{{grantType}} (Không được khuyến nghị)"
                        },
                        password: {
                            hint: "Loại grant này không được khuyến nghị.",
                            label: "{{grantType}} (Không được khuyến nghị)"
                        }
                    },
                    hint: "Điều này sẽ xác định cách ứng dụng giao tiếp với dịch vụ token.",
                    label: "Loại grant được phép",
                    validation: {
                        refreshToken:"Loại grant refresh token chỉ nên được chọn cùng với " +
                            "các loại grant cung cấp refresh token."
                    },
                    validations: {
                        empty: "Chọn ít nhất một loại grant"
                    }
                },
                public: {
                    hint: "Cho phép client xác thực với {{productName}} mà không cần client secret." +
                        " Các client công khai như ứng dụng chạy trong trình duyệt hoặc trên thiết bị di động" +
                        " không thể sử dụng client secret đã đăng ký. ",
                    label: "Client công khai",
                    validations: {
                        empty: "Đây là trường bắt buộc."
                    }
                },
                hybridFlow: {
                    hybridFlowResponseType: {
                        children: {
                            code_token: {
                                hint: "Loại response này không được khuyến nghị."
                            },
                            code_idtoken_token: {
                                hint: "Loại response này không được khuyến nghị."
                            }
                        }
                    }
                },
                ciba: {
                    authReqExpiryTime: {
                        hint: "Chỉ định thời gian hết hạn cho yêu cầu xác thực CIBA tính bằng giây.",
                        label: "Thời gian hết hạn yêu cầu xác thực CIBA",
                        placeholder: "Nhập thời gian hết hạn",
                        validations: {
                            empty: "Đây là trường bắt buộc.",
                            invalid: "Vui lòng nhập một số nguyên dương hợp lệ."
                        }
                    },
                    notificationChannels: {
                        externalHint: "Nếu client bao gồm " +
                            "notification_channel=external trong yêu cầu, " +
                            "{{productName}} trả về chi tiết thông báo " +
                            "trong phản hồi, cho phép ứng dụng khách " +
                            "gửi thông báo qua kênh của riêng nó.",
                        externalLabel: "Bên ngoài (Ứng dụng khách xử lý việc gửi)",
                        hint: "Chọn các phương thức gửi thông báo mà " +
                            "ứng dụng khách này được phép yêu cầu.",
                        label: "Phương thức gửi thông báo được phép"
                    },
                    skipUserValidation: {
                        hint: "Khi được bật, máy chủ bỏ qua việc kiểm tra hợp lệ xác minh " +
                            "người dùng được phân giải từ login_hint khớp với người dùng hoàn thành " +
                            "xác thực.",
                        label: "Bỏ qua kiểm tra hợp lệ người dùng"
                    },
                    allowFederatedUsers: {
                        hint: "Cho phép gửi thông báo CIBA đến người dùng không tìm thấy trong " +
                            "kho người dùng cục bộ. Thông báo được gửi trực tiếp đến giá trị login_hint, " +
                            "dùng kênh thông báo để xác định đó là email hay " +
                            "số điện thoại. Yêu cầu bật bỏ qua kiểm tra hợp lệ người dùng.",
                        label: "Cho phép người dùng liên kết"
                    },
                    heading: "Xác thực backchannel do client khởi tạo"
                },
                tokenExchange: {
                    heading: "Trao đổi token",
                    restrictScopeIssuanceForFederatedTokens: {
                        hint: "Khi được bật, máy chủ không phát hành phạm vi cho các token nhận được " +
                            "bằng cách trao đổi một token liên kết.",
                        label: "Hạn chế phát hành phạm vi cho token liên kết"
                    }
                }
            },
            messages: {
                customInvalidMessage: "Vui lòng nhập một URI hợp lệ. Các định dạng hợp lệ bao gồm HTTP, HTTPS, " +
                    "hoặc lược đồ URI dùng riêng tư.",
                revokeDisclaimer: {
                    content: "Ứng dụng đã bị thu hồi. Kích hoạt lại ứng dụng để cho phép " +
                        "người dùng đăng nhập.",
                    heading: "Ứng dụng không hoạt động"
                }
            },
            mobileApp: {
                discoverableHint: "Nếu được bật và một url có thể truy cập web (deep link) được cung cấp, khách hàng " +
                    "có thể truy cập ứng dụng này từ cổng <1>{{ myAccount }}</1>.",
                mobileAppPlaceholder: "myapp://oauth2"
            },
            dropdowns: {
                selectOption: "Chọn tùy chọn"
            },
            sections: {
                accessToken: {
                    fields: {
                        applicationTokenExpiry: {
                            hint: "Chỉ định thời hạn hiệu lực của " +
                                "<1>application_access_token</1> tính bằng giây.",
                            label: "Thời gian hết hạn application access token",
                            placeholder: "Nhập thời gian hết hạn application access token",
                            validations: {
                                empty: "Vui lòng điền thời gian hết hạn application access token",
                                invalid: "Thời gian hết hạn application access token phải tính bằng giây. " +
                                    "Không cho phép dấu thập phân và số âm."
                            }
                        },
                        bindingType: {
                            children: {
                                cookie: {
                                    label: "Cookie"
                                },
                                clientRequest: {
                                    label: "Yêu cầu client"
                                },
                                certificate: {
                                    label: "Chứng chỉ"
                                },
                                deviceFlow: {
                                    label: "Luồng thiết bị"
                                },
                                ssoBinding: {
                                    label: "Phiên SSO"
                                }
                            },
                            description: "Chọn loại <1>Phiên SSO</1> để cho phép {{productName}} " +
                                "ràng buộc <3>access_token</3> và <5>refresh_token</5> với "+
                                "phiên đăng nhập {{productName}} và phát hành token mới cho mỗi phiên. Các token " +
                                "bị thu hồi khi phiên đăng nhập đó bị kết thúc rõ ràng, hoặc thông qua yêu cầu đăng xuất " +
                                "hoặc thông qua API quản lý phiên. Chỉ việc phiên hết hạn không " +
                                "thu hồi các token.",
                            label: "Loại ràng buộc token",
                            valueDescriptions: {
                                cookie: "Ràng buộc access token với một cookie với tham số Secure " +
                                    "và httpOnly.",
                                none: "Không ràng buộc. {{productName}} chỉ phát hành access token mới " +
                                    "khi token hết hạn hoặc bị thu hồi.",
                                sso_session: "Ràng buộc access token với phiên đăng nhập. " +
                                    "{{productName}} sẽ phát hành access token mới cho mỗi lần đăng nhập mới " +
                                    "và thu hồi token khi đăng xuất.",
                                dpop: "Ràng buộc access token với khóa công khai của client. Client phải trình bày"+
                                    " một bằng chứng DPoP đã ký trong mỗi yêu cầu để chứng minh sở hữu khóa riêng tương ứng."
                            }
                        },
                        expiry: {
                            hint: "Chỉ định thời hạn hiệu lực của <1>access_token</1> tính bằng giây.",
                            label: "Thời gian hết hạn user access token",
                            labelForSPA: "Thời gian hết hạn access token",
                            placeholder: "Nhập thời gian hết hạn user access token",
                            validations: {
                                empty: "Vui lòng điền thời gian hết hạn user access token",
                                invalid: "Thời gian hết hạn access token phải tính bằng giây. " +
                                    "Không cho phép dấu thập phân và số âm."
                            }
                        },
                        revokeToken: {
                            hint: "Cho phép thu hồi token của ứng dụng này khi một phiên IDP được ràng buộc " +
                                "bị kết thúc thông qua đăng xuất người dùng. Hãy nhớ bao gồm <1>client_id</1> " +
                                "hoặc <3>id_token_hint</3> trong yêu cầu đăng xuất.",
                            label: "Thu hồi token khi người dùng đăng xuất"
                        },
                        type: {
                            label: "Loại token",
                            valueDescriptions: {
                                "default": "Phát hành một UUID mờ làm token.",
                                "jwt": "Phát hành một token JWT tự chứa.",
                                "opaque": "Phát hành một UUID mờ làm token."
                            }
                        },
                        validateBinding: {
                            hint: "Kiểm tra hợp lệ các thuộc tính ràng buộc khi kiểm tra hợp lệ token. Client " +
                                "cần trình bày <1>access_token</1> + cookie để ủy quyền "+
                                "thành công.",
                            label: "Kiểm tra hợp lệ ràng buộc token"
                        },
                        audience: {
                            hint: "Chỉ định (các) người nhận mà <1>access_token</1> này dành cho." +
                            " Mặc định, client ID của ứng dụng này được thêm làm đối tượng.",
                            label: "Đối tượng",
                            placeholder: "Nhập đối tượng",
                            validations: {
                                duplicate: "Đối tượng chứa giá trị trùng lặp",
                                empty: "Vui lòng điền đối tượng",
                                invalid: "Vui lòng tránh các ký tự đặc biệt như dấu phẩy (,)"
                            }
                        },
                        accessTokenAttributes: {
                            hint : "Chọn các thuộc tính nên được bao gồm trong <1>access_token</1>.",
                            label: "Thuộc tính access token",
                            placeholder: "Tìm kiếm theo tên thuộc tính"
                        }
                    },
                    heading: "Access Token",
                    hint: " Cấu hình nhà phát hành access token, thời gian hết hạn user access token, " +
                        "thời gian hết hạn application access token, v.v."
                },
                certificates: {
                    disabledPopup: "Chứng chỉ này được dùng để mã hóa <1>id_token</1>." +
                        " Trước tiên, bạn cần tắt mã hóa <3>id_token</3> để tiếp tục."
                },
                idToken: {
                    fields: {
                        algorithm: {
                            hint: "Danh sách thả xuống chứa các thuật toán mã hóa <1>id_token</1> "+
                            "được hỗ trợ.",
                            label: "Thuật toán",
                            placeholder: "Chọn thuật toán",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        audience: {
                            hint: "Chỉ định (các) người nhận mà <1>id_token</1> này dành cho." +
                            " Mặc định, client ID của ứng dụng này được thêm làm đối tượng.",
                            label: "Đối tượng",
                            placeholder: "Nhập đối tượng",
                            validations: {
                                duplicate: "Đối tượng chứa giá trị trùng lặp",
                                empty: "Vui lòng điền đối tượng",
                                invalid: "Vui lòng tránh các ký tự đặc biệt như dấu phẩy (,)"
                            }
                        },
                        encryption: {
                            hint: "Chọn để mã hóa <1>id_token</1> khi phát hành token bằng "+
                            "khóa công khai của ứng dụng. Để dùng mã hóa, hãy cấu hình endpoint JWKS "+
                            "hoặc chứng chỉ của ứng dụng trong phần Chứng chỉ "+
                            "bên dưới.",
                            label: "Bật mã hóa",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        expiry: {
                            hint: "Chỉ định thời hạn hiệu lực của <1>id_token</1> tính bằng giây.",
                            label: "Thời gian hết hạn ID Token",
                            placeholder: "Nhập thời gian hết hạn id token",
                            validations: {
                                empty: "Vui lòng điền thời gian hết hạn id token",
                                invalid: "Thời gian hết hạn ID token phải tính bằng giây. " +
                                    "Không cho phép dấu thập phân và số âm."
                            }
                        },
                        method: {
                            hint: "Danh sách thả xuống chứa các phương thức mã hóa <1>id_token</1> được hỗ trợ.",
                            label: "Phương thức mã hóa",
                            placeholder: "Chọn phương thức",
                            validations: {
                                empty:  "Đây là trường bắt buộc."
                            }
                        },
                        signing: {
                            hint: "Danh sách thả xuống chứa các thuật toán ký <1>id_token</1> "+
                                "được hỗ trợ.",
                            label: "Thuật toán ký phản hồi ID token",
                            placeholder: "Chọn thuật toán"
                        }
                    },
                    heading: "ID Token"
                },
                outdatedApplications: {
                    alert : {
                        title: "Cần cập nhật.",
                        content: "Chúng tôi đã cập nhật hành vi của các ứng dụng như sau.",
                        viewButton: "Xem chi tiết",
                        hideButton: "Ẩn chi tiết",
                        action: "Trước khi cập nhật ứng dụng của bạn, hãy đảm bảo cập nhật mọi cách sử dụng các thuộc tính này cho phù hợp."
                    },
                    label: "Lỗi thời",
                    documentationHint: "Thêm chi tiết",
                    confirmationModal: {
                        header: "Bạn đã thực hiện các thay đổi liên quan chưa?",
                        message: "Tiếp tục mà không thực hiện các thay đổi cần thiết sẽ khiến hành vi của ứng dụng khách bị hỏng.",
                        content: "Thao tác này không thể hoàn tác và sẽ dẫn đến việc cập nhật vĩnh viễn ứng dụng.",
                        assertionHint: "Vui lòng xác nhận thao tác của bạn"
                    },
                    fields: {
                        commonInstruction: "Các thay đổi hành vi sau sẽ được áp dụng khi cập nhật.",
                        versions: {
                            version100: {
                                useClientIdAsSubClaimOfAppTokens: {
                                    instruction: "Thuộc tính <1>sub</1> của application access token giờ trả về "
                                        + "<3>client_id</3> được tạo cho ứng dụng, thay vì <5>userid</5> của "
                                        + "chủ sở hữu ứng dụng."
                                },
                                removeUsernameFromIntrospectionRespForAppTokens: {
                                    instruction: "Các phản hồi introspection cho application access token không còn "
                                        + "trả về thuộc tính <1>username</1>."
                                }
                            },
                            version200: {
                                addAllRequestedClaimsInJWTAccessToken: {
                                    instruction: "Bất kể các <1>phạm vi</1> được yêu cầu, tất cả <3>Thuộc tính được yêu cầu</3> sẽ "
                                        + "được bao gồm trong JWT Access Token."
                                }
                            },
                            version300: {
                                linkedLocalAccountAttributeHandling: {
                                    instruction: "Trước đây, thiết lập \"Dùng thuộc tính tài khoản cục bộ được liên kết\", " +
                                        "khi kết hợp với yêu cầu về tài khoản cục bộ được liên kết, chỉ được thực thi " +
                                        "trong các luồng <1>trao đổi token</1>. Với bản cập nhật này, yêu cầu tương tự " +
                                        "sẽ được thực thi trong cả các luồng <3>đăng nhập</3>."
                                }
                            }
                        }
                    }
                },
                logoutURLs: {
                    fields: {
                        back: {
                            hint: "{{productName}} sẽ trực tiếp gửi các yêu cầu đăng xuất đến " +
                                "URL client này, để client có thể vô hiệu hóa phiên người dùng.",
                            label: "URL đăng xuất kênh sau",
                            placeholder: "https://myapp.io/logout",
                            validations: {
                                empty: "Vui lòng điền URL đăng xuất kênh sau",
                                invalid: "Vui lòng thêm URL hợp lệ"
                            }
                        },
                        front: {
                            hint: "{{productName}} kích hoạt trình duyệt tải URL client này khi người dùng đăng xuất.",
                            label: "URL đăng xuất kênh trước",
                            placeholder: "https://myapp.io/logout",
                            validations: {
                                empty: "Vui lòng điền URL đăng xuất kênh trước",
                                invalid: "Vui lòng thêm URL hợp lệ"
                            }
                        }
                    },
                    heading: "URL đăng xuất",
                    headingSingular: "URL đăng xuất"
                },
                pkce: {
                    description: "Phương thức mặc định được {{productName}} dùng để tạo challenge " +
                        "là SHA-256. Chỉ chọn \"Plain\" cho các môi trường hạn chế không thể" +
                        " sử dụng phép biến đổi SHA-256.",
                    fields: {
                        pkce: {
                            children: {
                                mandatory: {
                                    label: "Bắt buộc"
                                },
                                plainAlg: {
                                    label: "Hỗ trợ thuật toán biến đổi 'Plain'"
                                }
                            },
                            label: "{{label}}",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        }
                    },
                    heading: "PKCE",
                    hint: "Chọn để bắt buộc ứng dụng " +
                    "bao gồm code_challenge trong yêu cầu ủy quyền."
                },
                clientAuthentication: {
                    fields: {
                        authenticationMethod: {
                            hint: "Danh sách thả xuống chứa các phương thức xác thực client được hỗ trợ.",
                            label: "Phương thức xác thực client",
                            placeholder: "Chọn phương thức"
                        },
                        reusePvtKeyJwt: {
                            hint: "Nếu được bật, JWT có thể được tái sử dụng trong thời gian hết hạn của nó. " +
                                "JTI (JWT ID) là một claim cung cấp định danh duy nhất cho JWT.",
                            label: "Cho phép tái sử dụng Private Key JWT"
                        },
                        signingAlgorithm: {
                            hint: "Danh sách thả xuống chứa các thuật toán ký client assertion " +
                                "được hỗ trợ.",
                            label: "Thuật toán ký",
                            placeholder: "Chọn thuật toán"
                        },
                        subjectDN: {
                            label: "Tên miền subject xác thực client TLS",
                            placeholder: "Nhập tên miền subject xác thực client tls",
                            hint: "Nhập DN của chứng chỉ vận chuyển."
                        }
                    },
                    heading: "Xác thực client"
                },
                pushedAuthorization: {
                    fields: {
                        requirePushAuthorizationRequest: {
                            hint: "Chọn để bắt buộc ứng dụng gửi các yêu cầu " +
                                "ủy quyền dưới dạng yêu cầu ủy quyền được đẩy.",
                            label: "Bắt buộc"
                        }
                    },
                    heading: "Yêu cầu ủy quyền được đẩy"
                },
                fapiProfile: {
                    heading: "Hồ sơ FAPI",
                    hint: "Chọn hồ sơ bảo mật FAPI để thực thi cho ứng dụng này. Hồ sơ đã chọn hạn chế một số tùy chọn cấu hình giao thức để tuân thủ các yêu cầu của hồ sơ.",
                    unsupportedProfile: "Hồ sơ bảo mật \"{{profile}}\" không còn được bật cho tổ chức này. Chọn một hồ sơ được hỗ trợ hoặc liên hệ quản trị viên."
                },
                requestObject: {
                    fields: {
                        requestObjectSigningAlg: {
                            hint: "Danh sách thả xuống chứa các thuật toán ký <1>request object</1> " +
                                "được hỗ trợ.",
                            label: "Thuật toán ký request object",
                            placeholder: "Chọn thuật toán"
                        },
                        requestObjectEncryptionAlgorithm: {
                            hint: "Danh sách thả xuống chứa các thuật toán mã hóa <1>request object</1> " +
                                "được hỗ trợ.",
                            label: "Thuật toán mã hóa request object",
                            placeholder: "Chọn thuật toán"
                        },
                        requestObjectEncryptionMethod: {
                            hint: "Danh sách thả xuống chứa các phương thức mã hóa <1>request object</1> " +
                                "được hỗ trợ.",
                            label: "Phương thức mã hóa request object",
                            placeholder: "Chọn phương thức"
                        }
                    },
                    heading: "Request Object"
                },
                refreshToken: {
                    fields: {
                        extendRenewedRefreshTokenExpiryTime: {
                            hint: "Chọn để đảm bảo các refresh token được gia hạn nhận thời gian hết hạn mới " +
                                "thay vì giữ lại thời hạn hiệu lực còn lại từ token gốc.",
                            label: "Gia hạn thời gian hết hạn của refresh token được gia hạn"
                        },
                        expiry: {
                            hint: "Chỉ định thời hạn hiệu lực của <1>refresh_token</1> tính bằng giây.",
                            label: "Thời gian hết hạn refresh token",
                            placeholder: "Nhập thời gian hết hạn refresh token",
                            validations: {
                                empty: "Vui lòng điền thời gian hết hạn refresh token",
                                invalid: "Thời gian hết hạn refresh token phải tính bằng giây. " +
                                    "Không cho phép dấu thập phân và số âm."
                            }
                        },
                        renew: {
                            hint: "Chọn để phát hành một <1>refresh_token</1> mới mỗi khi "+
                                "<3>refresh_token</3> được " +
                                "trao đổi. Token hiện có sẽ bị vô hiệu hóa.",
                            label: "Gia hạn refresh token",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        gracefulRefreshTokenRotation: {
                            hint: "Khi được bật, refresh token trước đó vẫn hợp lệ trong một khoảng thời gian ân hạn " +
                                "sau khi xoay vòng, thay vì bị thu hồi ngay lập tức.",
                            label: "Xoay vòng refresh token một cách êm ái"
                        },
                        gracefulRefreshTokenRotationValidityPeriod: {
                            hint: "Thời gian tính bằng giây mà refresh token trước đó vẫn có thể sử dụng sau khi một cái mới được phát hành.",
                            label: "Thời hạn hiệu lực xoay vòng êm ái",
                            placeholder: "Nhập thời hạn hiệu lực xoay vòng êm ái",
                            validations: {
                                belowMin: "Giá trị không được nhỏ hơn 0.",
                                empty: "Vui lòng điền thời hạn hiệu lực xoay vòng êm ái",
                                invalid: "Thời hạn hiệu lực xoay vòng êm ái phải tính bằng giây. " +
                                    "Không cho phép dấu thập phân và số âm.",
                                maxExceeded: "Giá trị không được vượt quá mức tối đa đã cấu hình là {{max}} giây."
                            }
                        },
                        gracefulRefreshTokenReuseLimit: {
                            hint: "Số lần tối đa refresh token trước đó có thể được sử dụng trong khoảng thời gian ân hạn.",
                            label: "Giới hạn tái sử dụng refresh token",
                            placeholder: "Nhập giới hạn tái sử dụng refresh token",
                            validations: {
                                belowMin: "Giá trị phải ít nhất là 1.",
                                empty: "Vui lòng điền giới hạn tái sử dụng refresh token",
                                invalid: "Giới hạn tái sử dụng refresh token phải là số nguyên. " +
                                    "Không cho phép dấu thập phân và số âm.",
                                maxExceeded: "Giá trị không được vượt quá mức tối đa đã cấu hình là {{max}}."
                            }
                        }
                    },
                    heading: "Refresh Token"
                },
                subjectToken: {
                    fields: {
                        enable: {
                            hint: "Nếu được bật, ứng dụng này có thể được dùng trong các luồng mạo danh người dùng.",
                            label: "Bật loại response subject token",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        expiry: {
                            hint: "Chỉ định thời hạn hiệu lực của <1>subject_token</1> tính bằng giây.",
                            label: "Thời gian hết hạn subject token",
                            placeholder: "Nhập thời gian hết hạn subject token",
                            validations: {
                                empty: "Vui lòng điền thời gian hết hạn subject token",
                                invalid: "Thời gian hết hạn subject token phải tính bằng giây. " +
                                    "Không cho phép dấu thập phân và số âm."
                            }
                        }
                    },
                    heading: "Subject Token"
                },
                requestObjectSignature: {
                    description: "Chọn để bật kiểm tra hợp lệ chữ ký nhằm chỉ chấp nhận các <1>request object</1> " +
                        "đã ký trong yêu cầu ủy quyền.",
                    fields: {
                        signatureValidation: {
                            label: "Bật kiểm tra hợp lệ chữ ký"
                        }
                    },
                    heading: "Request Object"
                },
                scopeValidators: {
                    fields: {
                        validator: {
                            label: "{{label}}",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        }
                    },
                    heading: "Trình kiểm tra hợp lệ phạm vi"
                },
                hybridFlow: {
                    heading: "Luồng Hybrid",
                    enable: {
                        label: "Bật luồng Hybrid"
                    },
                    hybridFlowResponseType: {
                        label: "Các loại response được phép",
                        fields: {
                            children: {
                                code_token: {
                                    label: "code token"
                                },
                                code_idtoken: {
                                    label: "code id_token"
                                },
                                code_idtoken_token: {
                                    label: "code id_token token"
                                }
                            },
                            hint: "Chọn loại response luồng hybrid được phép."
                        }
                    }
                },
                applicationTokenIssuer: {
                    heading: "Nhà phát hành token ứng dụng",
                    fields: {
                        tokenIssuer: {
                            label: "Nhà phát hành token",
                            placeholder: "Chọn một nhà phát hành token cho ứng dụng",
                            hint: "Chọn nhà phát hành token cho ứng dụng này. " +
                                "Nhà phát hành token này sẽ được dùng trong các access token " +
                                "được phát hành cho ứng dụng này.",
                            loading: "Đang tải các nhà phát hành token...",
                            organization: "Tổ chức"
                        }
                    }
                }
            }
        },
        inboundSAML: {
            description: "Dưới đây là cài đặt SAML cho ứng dụng của bạn.",
            documentation: "Đọc <1>tài liệu</1> của chúng tôi để tìm hiểu thêm về việc sử dụng " +
                "giao thức <3>{{protocol}}</3> để triển khai đăng nhập trong ứng dụng của bạn.",
            fields: {
                assertionURLs: {
                    hint: "URL Assertion Consumer Service (ACS) xác định nơi để " +
                        "gửi phản hồi SAML.",
                    info: "Chưa có ứng dụng? Hãy thử một ứng dụng mẫu dùng {{assertionURLFromTemplate}} " +
                        "làm URL dịch vụ tiêu thụ assertion. (Bạn có thể tải xuống và chạy mẫu ở bước" +
                        " sau.)",
                    label: "URL dịch vụ tiêu thụ assertion",
                    placeholder: "Nhập URL ACS",
                    validations: {
                        empty: "Đây là trường bắt buộc.",
                        invalid: "URL đã nhập không phải HTTP cũng không phải HTTPS. Vui lòng thêm một URL hợp lệ.",
                        required: "Trường này là bắt buộc cho một ứng dụng hoạt động. " +
                            "Tuy nhiên, nếu bạn dự định thử ứng dụng mẫu, " +
                            "có thể bỏ qua trường này."
                    }
                },
                defaultAssertionURL: {
                    hint: "Nếu bạn đã cấu hình nhiều URL ACS, bạn phải cấu hình một cái làm " +
                        "mặc định. Trong trường hợp yêu cầu SAML từ ứng dụng của bạn không chỉ định " +
                        "URL ACS, phản hồi sẽ được gửi đến URL này.",
                    label: "URL dịch vụ tiêu thụ assertion mặc định",
                    validations: {
                        empty: "Đây là trường bắt buộc."
                    }
                },
                idpEntityIdAlias: {
                    hint: "Giá trị này có thể ghi đè ID thực thể nhà cung cấp danh tính (IdP) mặc định " +
                        "({{defaultIdpEntityID}}). ID thực thể IdP được dùng làm <1>saml2:Issuer</1> " +
                        " của phản hồi SAML được tạo bởi {{productName}}. Giá trị này phải là một " +
                        "URI/URL hợp lệ.",
                    label: "Alias ID thực thể IdP",
                    placeholder: "Nhập alias",
                    validations: {
                        empty: "Đây là trường bắt buộc.",
                        invalid: "Giá trị này phải là một URI/URL hợp lệ."
                    }
                },
                issuer: {
                    errorMessage: "Issuer đã tồn tại.",
                    hint: "Điều này chỉ định định danh duy nhất của ứng dụng. Đây cũng là " +
                        "giá trị <1>saml2:Issuer</1> được chỉ định trong yêu cầu xác thực SAML được phát hành " +
                        "bởi ứng dụng.",
                    label: "Issuer",
                    placeholder: "Nhập issuer",
                    validations: {
                        empty: "Vui lòng cung cấp issuer"
                    }
                },
                metaURL: {
                    errorMessage: "URL metadata không hợp lệ",
                    hint: "URL cho tệp meta",
                    label: "URL meta",
                    placeholder: "Nhập url tệp meta",
                    validations: {
                        empty: "Vui lòng cung cấp url tệp meta",
                        invalid: "Nhập một URL hợp lệ"
                    }
                },
                mode: {
                    children: {
                        manualConfig: {
                            label: "Cấu hình thủ công"
                        },
                        metadataFile: {
                            label: "Tệp metadata"
                        },
                        metadataURL: {
                            label: "URL metadata"
                        }
                    },
                    hint: "Chọn chế độ để cấu hình saml.",
                    label: "Chế độ"
                },
                qualifier: {
                    hint: "Giá trị này chỉ cần thiết nếu bạn phải cấu hình nhiều cấu hình " +
                        "xác thực vào SAML Single Sign-On (SSO) cho cùng một giá trị Issuer. " +
                        "Qualifier được định nghĩa tại đây sẽ được thêm vào issuer một cách nội bộ để " +
                        "nhận diện một ứng dụng duy nhất khi chạy.",
                    label: "Bộ định danh ứng dụng",
                    placeholder: "Nhập bộ định danh ứng dụng",
                    validations: {
                        empty: "Đây là trường bắt buộc."
                    }
                }
            },
            sections: {
                assertion: {
                    fields: {
                        audience: {
                            hint: "Điều này chỉ định các đối tượng của SAML assertion. " +
                                "Issuer của ứng dụng sẽ được thêm làm đối tượng mặc định.",
                            label: "Đối tượng",
                            placeholder: "Nhập đối tượng",
                            validations: {
                                invalid: "Vui lòng thêm URI hợp lệ"
                            }
                        },
                        nameIdFormat: {
                            hint: "Điều này chỉ định định dạng định danh tên được dùng để " +
                                "trao đổi thông tin về người dùng trong SAML assertion.",
                            label: "Định dạng Name ID",
                            placeholder: "Nhập định dạng name ID",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        recipients: {
                            hint:  "Điều này chỉ định người nhận của SAML assertion.",
                            label: "Người nhận",
                            placeholder: "Nhập người nhận",
                            validations: {
                                invalid: "Vui lòng thêm URI hợp lệ"
                            }
                        }
                    },
                    heading: "Assertion"
                },
                attributeProfile: {
                    fields: {
                        attributeNameFormat: {
                            hint: "Điều này chỉ định định dạng cho tên thuộc tính trong attribute statement của " +
                                "SAML assertion.",
                            label: "Định dạng tên thuộc tính"
                        },
                        enable: {
                            hint: "Điều này chỉ định liệu có bao gồm các thuộc tính của người dùng trong " +
                                "SAML assertion như một phần của attribute statement hay không.",
                            label: "Bật attribute profile"
                        },
                        includeAttributesInResponse: {
                            hint: "Sau khi bạn chọn ô bao gồm thuộc tính trong phản hồi " +
                                "luôn luôn, nhà cung cấp danh tính luôn bao gồm các giá trị thuộc tính " +
                                "liên quan đến các claim đã chọn trong SAML attribute statement.",
                            label: "Luôn bao gồm thuộc tính trong phản hồi"
                        },
                        serviceIndex: {
                            hint: "Đây là trường tùy chọn, nếu không được cung cấp một giá trị sẽ được tạo " +
                                "tự động.",
                            label: "Chỉ số dịch vụ tiêu thụ thuộc tính",
                            placeholder: "Nhập chỉ số dịch vụ tiêu thụ thuộc tính",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        }
                    },
                    heading: "Attribute Profile"
                },
                certificates: {
                    disabledPopup: "Hãy đảm bảo kiểm tra hợp lệ chữ ký yêu cầu và" +
                        " mã hóa assertion được tắt để tiếp tục.",
                    certificateRemoveConfirmation: {
                        header: "Xóa chứng chỉ hiện tại?",
                        content: "Đặt loại chứng chỉ thành none sẽ xóa chứng chỉ hiện tại " +
                            "được cung cấp cho ứng dụng này. Hãy tiếp tục một cách thận trọng."
                    }
                },
                encryption: {
                    fields: {
                        assertionEncryption: {
                            hint: "Chọn để mã hóa các SAML2 Assertion được trả về sau khi xác thực. " +
                                "Để dùng mã hóa, hãy cấu hình chứng chỉ của ứng dụng" +
                                " trong phần Chứng chỉ bên dưới.",
                            label: "Bật mã hóa",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        assertionEncryptionAlgorithm: {
                            label: "Thuật toán mã hóa assertion",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        keyEncryptionAlgorithm: {
                            label: "Thuật toán mã hóa khóa",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        }
                    },
                    heading: "Mã hóa"
                },
                idpInitiatedSLO: {
                    fields: {
                        enable: {
                            hint: "Điều này chỉ định liệu ứng dụng có hỗ trợ đăng xuất do IdP khởi tạo hay không.",
                            label: "Bật",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        returnToURLs: {
                            hint: "Điều này chỉ định các URL mà người dùng nên được chuyển hướng " +
                                "đến sau khi đăng xuất.",
                            label: "URL trở về",
                            placeholder: "Nhập URL",
                            validations: {
                                invalid: "Vui lòng thêm URL hợp lệ"
                            }
                        }
                    },
                    heading: "Đăng xuất đơn do IdP khởi tạo"
                },
                requestProfile: {
                    fields: {
                        enable: {
                            label: "Bật assertion query profile",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        }
                    },
                    heading: "Assertion Query/Request Profile"
                },
                requestValidation: {
                    fields: {
                        signatureValidation: {
                            hint: "Điều này chỉ định liệu {{productName}} có phải kiểm tra hợp lệ " +
                                "chữ ký của yêu cầu xác thực SAML và yêu cầu đăng xuất SAML " +
                                "được gửi bởi ứng dụng hay không.",
                            label: "Bật kiểm tra hợp lệ chữ ký yêu cầu",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        signatureValidationCertAlias: {
                            hint: "Nếu chứng chỉ ứng dụng được cung cấp thì nó sẽ được dùng và " +
                                "chứng chỉ đã chọn ở trên sẽ bị bỏ qua.",
                            label: "Alias chứng chỉ kiểm tra hợp lệ yêu cầu",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        }
                    },
                    heading: "Kiểm tra hợp lệ yêu cầu"
                },
                responseSigning: {
                    fields: {
                        digestAlgorithm: {
                            label: "Thuật toán digest",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        responseSigning: {
                            hint: "Điều này chỉ định liệu các phản hồi SAML được tạo bởi " +
                                "{{productName}} có nên được ký hay không.",
                            label: "Ký phản hồi SAML"
                        },
                        signingAlgorithm: {
                            label: "Thuật toán ký",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        }
                    },
                    heading: "Ký phản hồi"
                },
                sloProfile: {
                    fields: {
                        enable: {
                            hint: "Điều này chỉ định liệu ứng dụng có hỗ trợ profile Single Logout (SLO) " +
                                "hay không.",
                            label: "Bật SLO",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        logoutMethod: {
                            label: "Phương thức đăng xuất",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        requestURL: {
                            hint: "Điều này chỉ định endpoint của ứng dụng nơi yêu cầu " +
                                "đăng xuất đơn nên được gửi đến. Nếu bạn không chỉ định " +
                                "URL này, {{productName}} sẽ dùng URL ACS.",
                            label: "URL yêu cầu đăng xuất đơn",
                            placeholder: "Nhập URL yêu cầu đăng xuất đơn",
                            validations: {
                                empty: "Đây là trường bắt buộc.",
                                invalid: "Nhập một URL hợp lệ"
                            }
                        },
                        responseURL: {
                            hint: "Điều này chỉ định endpoint của ứng dụng nơi phản hồi " +
                                "đăng xuất đơn nên được gửi đến. Nếu bạn không chỉ định " +
                                "URL này, {{productName}} sẽ dùng URL ACS.",
                            label: "URL phản hồi đăng xuất đơn",
                            placeholder: "Nhập URL phản hồi đăng xuất đơn",
                            validations: {
                                empty: "Đây là trường bắt buộc.",
                                invalid: "Nhập một URL hợp lệ"
                            }
                        }
                    },
                    heading: "Single Logout Profile"
                },
                ssoProfile: {
                    fields: {
                        artifactBinding: {
                            hint: "Điều này chỉ định liệu chữ ký yêu cầu phân giải artifact " +
                                "có nên được kiểm tra hợp lệ dựa trên chứng chỉ ứng dụng hay không. Nếu bạn bật " +
                                "tùy chọn này, hãy đảm bảo cung cấp chứng chỉ ứng dụng bên dưới.",
                            label: "Bật kiểm tra hợp lệ chữ ký cho artifact binding"
                        },
                        bindings: {
                            hint: "Điều này chỉ định các cơ chế vận chuyển thông điệp SAML trong " +
                                "các giao thức truyền thông.",
                            label: "Bindings",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        },
                        idpInitiatedSSO: {
                            hint: "Điều này chỉ định liệu có khởi tạo Single Sign-On (SSO) từ " +
                                "IdP thay vì ứng dụng hay không.",
                            label: "Bật SSO do IdP khởi tạo",
                            validations: {
                                empty: "Đây là trường bắt buộc."
                            }
                        }
                    },
                    heading: "Single Sign-On Profile"
                }
            }
        },
        inboundSTS: {
            fields: {
                realm: {
                    hint: "Nhập định danh realm cho ws-federation",
                    label: "Realm",
                    placeholder: "Nhập realm.",
                    validations: {
                        empty: "Đây là trường bắt buộc."
                    }
                },
                replyTo: {
                    hint: "Nhập URL endpoint RP xử lý phản hồi.",
                    label: "URL trả lời",
                    placeholder: "Nhập URL trả lời",
                    validations: {
                        empty: "Đây là trường bắt buộc.",
                        invalid: "Nhập một URL hợp lệ"
                    }
                },
                replyToLogout: {
                    hint: "Nhập URL endpoint RP xử lý phản hồi khi đăng xuất.",
                    label: "URL trả lời đăng xuất",
                    placeholder: "Nhập URL trả lời đăng xuất",
                    validations: {
                        empty: "Đây là trường bắt buộc.",
                        invalid: "Nhập một URL hợp lệ"
                    }
                }
            }
        },
        inboundWSTrust: {
            fields: {
                audience: {
                    hint: "Địa chỉ endpoint của bên dựa tin cậy.",
                    label: "Đối tượng",
                    placeholder: "Nhập đối tượng",
                    validations: {
                        empty: "Nhập đối tượng.",
                        invalid: "Nhập một URL hợp lệ"
                    }
                },
                certificateAlias: {
                    hint: "Chứng chỉ công khai của bên dựa tin cậy.",
                    label: "Alias chứng chỉ",
                    placeholder: "Nhập đối tượng",
                    validations: {
                        empty: "Chọn alias chứng chỉ"
                    }
                }
            }
        },
        outboundProvisioning: {
            fields: {
                blocking: {
                    hint: "Chặn luồng xác thực cho đến khi việc cấp phát hoàn tất.",
                    label: "Chặn"
                },
                connector: {
                    label: "Connector cấp phát",
                    placeholder: "Chọn connector cấp phát",
                    validations: {
                        empty: "Bắt buộc phải chọn một connector cấp phát."
                    }
                },
                idp: {
                    label: "Kết nối cấp phát",
                    placeholder: "Chọn kết nối cấp phát",
                    validations: {
                        empty: "Bắt buộc phải chọn một kết nối cấp phát."
                    }
                },
                jit: {
                    hint: "Cấp phát người dùng vào kho được xác thực bằng cấp phát just-in-time.",
                    label: "JIT ra ngoài"
                },
                rules: {
                    hint: "Cấp phát người dùng dựa trên các quy tắc XACML được định nghĩa trước",
                    label: "Bật quy tắc"
                }
            }
        },
        provisioningConfig: {
            fields: {
                proxyMode: {
                    hint: "Người dùng/Nhóm không được cấp phát vào kho người dùng. Chúng chỉ được cấp phát " +
                        "ra ngoài.",
                    label: "Chế độ proxy"
                },
                userstoreDomain: {
                    hint: "Chọn tên miền kho người dùng để cấp phát người dùng và nhóm.",
                    label: "Miền kho người dùng cấp phát"
                }
            }
        },
        spaProtocolSettingsWizard:{
            fields: {
                callBackUrls: {
                    label: "URL chuyển hướng được ủy quyền",
                    validations: {
                        empty: "Đây là trường bắt buộc.",
                        invalid: "URL đã nhập không phải HTTP cũng không phải HTTPS. Vui lòng thêm một URL hợp lệ."
                    }
                },
                name: {
                    label: "Tên",
                    validations: {
                        invalid: "{{appName}} không phải là tên hợp lệ. Tên có thể chứa tối đa " +
                            "{{characterLimit}} ký tự, bao gồm chữ và số, dấu chấm (.), " +
                            "dấu gạch ngang (-), dấu gạch dưới (_) và dấu cách."
                    }
                },
                urlDeepLinkError: "URL đã nhập không phải là một deep link."
            }
        }
    },
    helpPanel: {
        tabs: {
            configs: {
                content: {
                    subTitle: "Cập nhật các cấu hình định nghĩa sẵn thông qua template hoặc thêm " +
                        "cấu hình mới tùy thuộc vào giao thức (OIDC, SAML, WS-Trust, v.v.) " +
                        "được cấu hình cho ứng dụng.",
                    title: "Cấu hình ứng dụng"
                },
                heading: "Hướng dẫn cấu hình"
            },
            docs: {
                content: null,
                heading: "Tài liệu"
            },
            samples: {
                content: {
                    sample: {
                        configurations: {
                            btn: "Tải cấu hình",
                            subTitle: "Để tích hợp ứng dụng được tạo trên máy chủ với " +
                                "ứng dụng mẫu, bạn cần khởi tạo client với " +
                                "các cấu hình sau.",
                            title: "Khởi tạo client"
                        },
                        downloadSample: {
                            btn: "Tải mẫu",
                            subTitle: "Ứng dụng mẫu này sẽ minh họa việc sử dụng WSO2 " +
                                "Identity Server SDK và cách bạn có thể tích hợp bất kỳ ứng dụng nào với " +
                                "Identity Server.",
                            title: "Thử mẫu"
                        },
                        goBack: "Quay lại",
                        subTitle: "Bắt đầu tạo mẫu thử một cách nhanh chóng bằng cách tải ứng dụng mẫu " +
                            "đã được cấu hình sẵn của chúng tôi.",
                        title: "Ứng dụng mẫu"
                    },
                    technology: {
                        subTitle: "Mẫu và các SDK cần thiết cùng thông tin hữu ích sẽ được " +
                            "cung cấp khi bạn chọn một công nghệ",
                        title: "Chọn một công nghệ"
                    }
                },
                heading: "Mẫu"
            },
            sdks: {
                content: {
                    sdk: {
                        goBack: "Quay lại",
                        subTitle: "Các bộ phát triển phần mềm sau có thể được dùng để khởi động " +
                            "việc phát triển ứng dụng của bạn.",
                        title: "Bộ phát triển phần mềm (SDK)"
                    }
                },
                heading: "SDK"
            },
            start: {
                content: {
                    endpoints: {
                        subTitle: "Nếu bạn triển khai ứng dụng của mình mà không dùng WSO2 SDK, " +
                            "các endpoint máy chủ sau sẽ hữu ích để bạn triển khai " +
                            "xác thực cho ứng dụng.",
                        title: "Endpoint máy chủ"
                    },
                    oidcConfigurations: {
                        labels: {
                            authorize: "Ủy quyền",
                            backchannelAuthentication: "Xác thực backchannel",
                            dynamicClientRegistration: "Đăng ký client động",
                            endSession: "Đăng xuất",
                            introspection: "Introspection",
                            issuer: "Issuer",
                            jwks: "JWKS",
                            keystore: "Bộ khóa",
                            openIdServer: "Máy chủ OpenID",
                            pushedAuthorizationRequest: "Yêu cầu ủy quyền được đẩy",
                            revoke: "Thu hồi",
                            sessionIframe: "Iframe phiên",
                            token: "Token",
                            userInfo: "UserInfo",
                            webFinger: "Web Finger",
                            wellKnown: "Khám phá"
                        }
                    },
                    samlConfigurations: {
                        buttons: {
                            certificate: "Tải chứng chỉ",
                            metadata: "Tải metadata IdP"
                        },
                        labels: {
                            certificate: "Chứng chỉ IdP",
                            issuer: "Issuer",
                            metadata: "Metadata IdP",
                            slo: "Đăng xuất đơn",
                            sso: "Đăng nhập một lần",
                            destinationURL: "URL đích",
                            artifactResolutionUrl: "URL phân giải artifact"
                        }
                    },
                    trySample: {
                        btn: "Khám phá mẫu",
                        subTitle: "Bạn có thể thử các mẫu minh họa luồng " +
                            "xác thực. Nhấn vào nút bên dưới để tải xuống và triển khai ứng dụng mẫu.",
                        title: "Thử với một mẫu"
                    },
                    useSDK: {
                        btns: {
                            withSDK: "Dùng SDK",
                            withoutSDK: "Thủ công"
                        },
                        subTitle: "Cài đặt và sử dụng các SDK của chúng tôi để tích hợp xác thực vào " +
                            "ứng dụng của bạn với số dòng mã tối thiểu.",
                        title: "Tích hợp ứng dụng của riêng bạn"
                    },
                    wsFedConfigurations: {
                        labels: {
                            passiveSTSUrl: "URL WS-Federation"
                        }
                    }
                },
                heading: "Tiếp theo là gì?"
            }
        }
    },
    list: {
        actions: {
            add: "Ứng dụng mới",
            custom: "Tùy chỉnh",
            predefined: "Dùng định nghĩa sẵn"
        },
        columns: {
            actions: "",
            name: "Tên",
            inboundKey: "Khóa vào"
        },
        labels: {
            fragment: "Ứng dụng được chia sẻ"
        }
    },
    myaccount: {
        description: "Cổng tự phục vụ cho người dùng của bạn.",
        popup: "Chia sẻ liên kết này với người dùng của bạn để cho phép truy cập My Account" +
        " và quản lý tài khoản của họ.",
        settings: "Cài đặt My Account",
        title: "My Account",
        enable: {
            0: "Đã bật",
            1: "Đã tắt"
        },
        Confirmation: {
            enableConfirmation: {
                content: "Cổng My Account đang ở chế độ xem trước và bạn nên tắt nó " +
                    "khi tổ chức của bạn chuyển sang môi trường sản xuất.",
                heading: "Bạn có chắc không?",
                message: "Bật cổng My Account."
            },
            disableConfirmation: {
                content: "Cổng My Account đang ở chế độ xem trước và bạn nên tắt nó " +
                    "khi tổ chức của bạn chuyển sang môi trường sản xuất. Khi cổng My Account bị tắt, " +
                    "người dùng của tổ chức bạn sẽ không thể truy cập nó.",
                heading: "Bạn có chắc không?",
                message: "Tắt cổng My Account."
            }
        },
        notifications: {
            error: {
                description: "{{description}}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Không thể cập nhật trạng thái cổng My Account.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật trạng thái cổng My Account thành công.",
                message: "Cập nhật thành công"
            }
        },
        fetchMyAccountStatus: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Không thể lấy trạng thái cổng My Account.",
                message: "Đã xảy ra lỗi"
            }
        },
        overview: {
            tabName: "Tổng quan",
            heading: "Chào mừng đến My Account",
            contentIntro: "My Account là cổng một điểm dừng cho nhu cầu tự phục vụ của người dùng, cung cấp các khả năng quản lý tài khoản phong phú.",
            contentDescription: "Bạn có thể cấu hình luồng đăng nhập của My Account, áp dụng các <1>cấu hình thương hiệu</1> tùy chỉnh và chia sẻ quyền truy cập đến nó với các tổ chức B2B.",
            shareApplication: "Chia sẻ liên kết này với người dùng của bạn để truy cập cổng My Account."
        }
    },
    featureGate: {
        enabledFeatures: {
            tags: {
                premium: {
                    info: "Mở khóa việc viết script xác thực có điều kiện với gói Doanh nghiệp của chúng tôi. <1>Liên hệ bộ phận bán hàng</1> để nâng cấp.",
                    warning: "Đây là tính năng cao cấp và sẽ sớm bị tắt cho gói đăng ký miễn phí. Hãy nâng cấp gói đăng ký để có quyền truy cập không gián đoạn vào tính năng này."
                }
            }
        }
    },
    notifications: {
        invalidPEMFile: {
            error: {
                description: "{{ description }}",
                message: "Lỗi giải mã"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi giải mã chứng chỉ.",
                message: "Lỗi giải mã"
            },
            success: {
                description: "Đã giải mã tệp chứng chỉ thành công.",
                message: "Giải mã thành công"
            }
        },
        addApplication: {
            error: {
                description: "{{description}}",
                message: "Lỗi tạo"
            },
            genericError: {
                description: "Không thể tạo ứng dụng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã tạo ứng dụng thành công.",
                message: "Tạo thành công"
            }
        },
        apiLimitReachedError: {
            error: {
                description: "Bạn đã đạt số lượng ứng dụng tối đa được phép.",
                message: "Không thể tạo ứng dụng"
            }
        },
        authenticationStepDeleteErrorDueToSecondFactors: {
            genericError: {
                description: "Các phương thức xác thực yếu tố thứ hai yêu cầu có một phương thức xác thực Tên đăng nhập & "
                    + "Mật khẩu trong một bước trước đó.",
                message: "Không thể xóa bước"
            }
        },
        authenticationStepDeleteErrorDueToAppShared: {
            genericError: {
                description: "Phương thức xác thực này là bắt buộc cho ứng dụng được chia sẻ.",
                message: "Không thể xóa phương thức xác thực này"
            }
        },
        authenticationStepMin: {
            genericError: {
                description: "Cần có ít nhất một bước xác thực.",
                message: "Không thể xóa bước"
            }
        },
        conditionalScriptLoopingError: {
            description: "Các cấu trúc lặp như <1>for</1>, <3>while</3>, và"
                + " <5>forEach</5> không được phép trong script" + " xác thực có điều kiện.",
            message: "Không thể cập nhật script"
        },
        deleteApplication: {
            error: {
                description: "{{description}}",
                message: "Lỗi xóa"
            },
            genericError: {
                description: "Không thể xóa ứng dụng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã xóa ứng dụng thành công.",
                message: "Đã xóa ứng dụng"
            }
        },
        deleteCertificateGenericError: {
            description: "Đã xảy ra lỗi. Chúng tôi không thể xóa chứng chỉ ứng dụng.",
            message: "Không thể cập nhật ứng dụng"
        },
        deleteCertificateSuccess: {
            description: "Đã xóa chứng chỉ ứng dụng thành công.",
            message: "Đã xóa chứng chỉ"
        },
        deleteOptionErrorDueToSecondFactorsOnRight: {
            error: {
                description: "{{description}}",
                message: "Không thể xóa phương thức xác thực này"
            },
            genericError: {
                description: "Có các phương thức xác thực ở các bước khác phụ thuộc vào "
                    + "phương thức xác thực này.",
                message: "Không thể xóa phương thức xác thực này"
            },
            success: {
                description: "Đã xóa phương thức xác thực khỏi bước {{stepNo}} thành công.",
                message: "Xóa thành công"
            }
        },
        deleteProtocolConfig: {
            error: {
                description: "{{description}}",
                message: "Lỗi xóa"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi xóa cấu hình giao thức vào.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã xóa cấu hình giao thức {{protocol}} thành công.",
                message: "Đã xóa cấu hình"
            }
        },
        duplicateAuthenticationStep: {
            genericError: {
                description: "Cùng một phương thức xác thực không được phép xuất hiện nhiều hơn một lần trong một bước.",
                message: "Không được phép"
            }
        },
        emptyAuthenticationStep: {
            genericError: {
                description: "Có các bước xác thực trống. Vui lòng xóa chúng hoặc thêm "
                    + "phương thức xác thực để tiếp tục.",
                message: "Lỗi cập nhật"
            }
        },
        fetchAllowedCORSOrigins: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Không thể lấy các Origin CORS được phép.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy các Origin CORS được phép thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        fetchApplication: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Không thể lấy chi tiết ứng dụng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy chi tiết ứng dụng thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        fetchFapiConfig: {
            genericError: {
                description: "Không thể lấy cấu hình FAPI. Đang dùng các tùy chọn hồ sơ mặc định.",
                message: "Đã xảy ra lỗi"
            }
        },
        fetchMyAccountApplication: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Không thể lấy chi tiết ứng dụng My Account.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy chi tiết ứng dụng My Account thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        fetchApplications: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Không thể lấy danh sách ứng dụng",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy danh sách ứng dụng thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        fetchCustomInboundProtocols: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy các giao thức vào tùy chỉnh.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "Đã lấy các giao thức vào tùy chỉnh thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        fetchInboundProtocols: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy các giao thức vào khả dụng.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "Đã lấy các giao thức vào thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        fetchOIDCIDPConfigs: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy cấu hình IDP cho ứng dụng OIDC."
                    + "",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "Đã lấy cấu hình IDP cho ứng dụng OIDC thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        fetchOIDCServiceEndpoints: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy các endpoint máy chủ cho "
                    + "ứng dụng OIDC.",
                message: "Đã xảy ra lỗi"
            }
        },
        fetchProtocolMeta: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy siêu dữ liệu giao thức.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "Đã lấy siêu dữ liệu giao thức thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        fetchSAMLIDPConfigs: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy cấu hình IDP cho ứng dụng SAML"
                    + ".",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "Đã lấy cấu hình IDP cho ứng dụng SAML thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        fetchTemplate: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy dữ liệu template ứng dụng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy dữ liệu template ứng dụng thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        fetchTemplates: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Không thể lấy các template ứng dụng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy các template ứng dụng thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        firstFactorAuthenticatorToSecondStep: {
            genericError: {
                description: "Phương thức xác thực này chỉ có thể được thêm vào bước đầu tiên.",
                message: "Không thể thêm vào bước này"
            }
        },
        getInboundProtocolConfig: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy cấu hình giao thức.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "Đã lấy cấu hình giao thức vào thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        regenerateSecret: {
            error: {
                description: "{{description}}",
                message: "Lỗi tạo lại"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi tạo lại ứng dụng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã tạo lại ứng dụng thành công.",
                message: "Tạo lại thành công"
            }
        },
        revokeApplication: {
            error: {
                description: "{{description}}",
                message: "Lỗi thu hồi"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi thu hồi ứng dụng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã thu hồi ứng dụng thành công.",
                message: "Thu hồi thành công"
            }
        },
        secondFactorAuthenticatorToFirstStep: {
            genericError: {
                description: "Các phương thức xác thực yếu tố thứ hai yêu cầu có một phương thức xác thực cơ bản "
                    + "trong một bước trước đó.",
                message: "Không thể thêm vào bước này"
            }
        },
        tierLimitReachedError: {
            emptyPlaceholder: {
                action: "Xem các gói",
                subtitles: "Bạn có thể liên hệ quản trị viên tổ chức hoặc (nếu bạn là " +
                    "quản trị viên) nâng cấp gói đăng ký để tăng giới hạn cho phép.",
                title: "Bạn đã đạt số lượng ứng dụng tối đa được phép " +
                    "cho tổ chức này."
            },
            heading: "Bạn đã đạt giới hạn tối đa cho ứng dụng"
        },
        updateAdvancedConfig: {
            error: {
                description: "{{description}}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy cấu hình nâng cao.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cấu hình nâng cao thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateApplication: {
            error: {
                description: "{{description}}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Không thể cập nhật ứng dụng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật ứng dụng thành công.",
                message: "Cập nhật thành công"
            }
        },
        disableApplication: {
            error: {
                description: "{{description}}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Không thể {{state}} ứng dụng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã {{state}} ứng dụng thành công.",
                message: "Ứng dụng {{state}}. "
            }
        },
        updateAuthenticationFlow: {
            error: {
                description: "{{description}}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật luồng xác thực của ứng dụng.",
                message: "Đã xảy ra lỗi"
            },
            invalidScriptError: {
                description: "Script xác thực chứa cú pháp không hợp lệ. Vui lòng sửa script và thử lại.",
                message: "Script xác thực không hợp lệ"
            },
            success: {
                description: "Đã cập nhật luồng xác thực của ứng dụng thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateClaimConfig: {
            mistmatchAlternativesubjectIdentifierError: {
                description: "Định danh subject thay thế không nằm trong các thuộc tính người dùng được yêu cầu.",
                message: "Đã xảy ra lỗi"
            },
            error: {
                description: "Các thuộc tính người dùng đã ánh xạ không được trùng lặp.",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật cài đặt thuộc tính.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cài đặt thuộc tính thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateInboundProtocolConfig: {
            error: {
                description: "{{description}}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình giao thức vào.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cấu hình giao thức vào thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateInboundProvisioningConfig: {
            error: {
                description: "{{description}}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình cấp phát.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cấu hình cấp phát thành công.",
                message: "Cập nhật thành công"
            }
        },
        updateOnlyIdentifierFirstError: {
            description: "Phương thức xác thực Định danh trước không thể là phương thức xác thực duy nhất. "
                + "Nó cần một bước bổ sung.",
            message: "Lỗi cập nhật"
        },
        updateIdentifierFirstInFirstStepError: {
            description: "Phương thức xác thực Định danh trước yêu cầu nhiều bước xác thực trong luồng đăng nhập.",
            message: "Lỗi cập nhật"
        },
        updateOnlySharedUserIdentifierError: {
            description: "Phương thức xác thực Định danh người dùng được chia sẻ không thể là phương thức xác thực duy nhất. "
                + "Nó cần một bước bổ sung.",
            message: "Lỗi cập nhật"
        },
        updateSharedUserIdentifierInFirstStepError: {
            description: "Phương thức xác thực Định danh người dùng được chia sẻ yêu cầu nhiều bước xác thực trong luồng đăng nhập.",
            message: "Lỗi cập nhật"
        },
        updateOutboundProvisioning: {
            genericError: {
                description: "IDP cấp phát ra ngoài đã tồn tại.",
                message: "Lỗi cập nhật"
            }
        },
        updateProtocol: {
            error: {
                description: "{{description}}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật ứng dụng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã thêm cấu hình giao thức mới thành công.",
                message: "Cập nhật thành công"
            }
        }
    },
    placeholders: {
        emptyAttributesList: {
            action: "Thêm thuộc tính người dùng",
            subtitles: "Hiện tại không có thuộc tính người dùng nào được chọn cho ứng dụng.",
            title: "Chưa thêm thuộc tính người dùng"
        },
        emptyAuthenticatorStep: {
            subtitles: {
                0: "Nhấn vào nút ở trên để thêm tùy chọn vào bước này."
            },
            title: null
        },
        emptyAuthenticatorsList: {
            subtitles: "Không tìm thấy phương thức xác thực {{type}} nào",
            title: null
        },
        emptyList: {
            action: "Ứng dụng mới",
            subtitles: {
                0: "Hiện tại không có ứng dụng nào khả dụng.",
                1: "Bạn có thể thêm ứng dụng mới một cách dễ dàng bằng cách làm theo",
                2: "các bước trong trình hướng dẫn tạo ứng dụng."
            },
            title: "Thêm một ứng dụng mới"
        },
        emptyOutboundProvisioningIDPs: {
            action: "Nhà cấp phát mới",
            subtitles: "Ứng dụng này chưa cấu hình nhà cấp phát ra ngoài nào." +
                " Thêm một nhà cấp phát để xem tại đây.",
            title: "Không có nhà cấp phát ra ngoài"
        },
        emptyProtocolList: {
            action: "Giao thức mới",
            subtitles: {
                0: "Hiện tại không có giao thức nào khả dụng.",
                1: "Bạn có thể thêm giao thức một cách dễ dàng bằng cách sử dụng",
                2: "các template định nghĩa sẵn."
            },
            title: "Thêm một giao thức"
        }
    },
    popups: {
        appStatus: {
            active: {
                content: "Ứng dụng đang hoạt động.",
                header: "Đang hoạt động",
                subHeader: ""
            },
            notConfigured: {
                content: "Ứng dụng chưa được cấu hình. Vui lòng cấu hình cấu hình truy cập.",
                header: "Chưa được cấu hình",
                subHeader: ""
            },
            revoked: {
                content: "Ứng dụng đã bị thu hồi. Vui lòng kích hoạt lại ứng dụng trong cấu hình " +
                    "truy cập.",
                header: "Đã thu hồi",
                subHeader: ""
            }
        }
    },
    templates: {
        emptyPlaceholder: {
            action: null,
            subtitles: "Vui lòng thêm template để hiển thị tại đây.",
            title: "Không có template để hiển thị."
        },
        manualSetup: {
            heading: "Thiết lập thủ công",
            subHeading: "Tạo một ứng dụng với cấu hình tùy chỉnh."
        },
        quickSetup: {
            heading: "Thiết lập nhanh",
            subHeading: "Bộ template ứng dụng định nghĩa sẵn giúp tăng tốc việc tạo ứng dụng."
        }
    },
    wizards: {
        applicationCertificateWizard: {
            emptyPlaceHolder: {
                description1: "Ứng dụng này chưa có chứng chỉ nào được thêm.",
                description2: "Thêm một chứng chỉ để xem tại đây.",
                title: "Không có chứng chỉ"
            },
            heading: "Thêm chứng chỉ mới",
            subHeading: "Thêm chứng chỉ mới vào ứng dụng"
        },
        minimalAppCreationWizard: {
            help: {
                heading: "Trợ giúp",
                subHeading: "Sử dụng hướng dẫn bên dưới",
                template: {
                    common: {
                        authorizedRedirectURLs: {
                            example: "Ví dụ: https://myapp.io/login",
                            subTitle: "URL mà mã ủy quyền được gửi đến sau khi" +
                                " xác thực và nơi người dùng được chuyển hướng đến khi đăng xuất.",
                            title: "URL chuyển hướng được ủy quyền"
                        },
                        heading: {
                            example: "Ví dụ: Ứng dụng của tôi",
                            subTitle: "Một tên duy nhất để nhận diện ứng dụng của bạn.",
                            title: "Tên"
                        },
                        protocol: {
                            subTitle: "Giao thức cấu hình truy cập sẽ được dùng để đăng nhập vào" +
                                " ứng dụng bằng SSO.",
                            title: "Giao thức"
                        }
                    },
                    label: "Các template bảng trợ giúp của trình hướng dẫn tạo ứng dụng tối giản.",
                    samlWeb: {
                        assertionResponseURLs: {
                            example: "Ví dụ: https://my-app.com/home.jsp",
                            subTitle: "Các URL mà trình duyệt được chuyển hướng đến sau khi" +
                                " xác thực thành công. Còn được gọi là URL Assertion Consumer Service (ACS)" +
                                " của nhà cung cấp dịch vụ.",
                            title: "URL dịch vụ tiêu thụ assertion"
                        },
                        issuer: {
                            example: "Ví dụ: my-app.com",
                            subTitle: "Phần tử <1>saml:Issuer</1> chứa định danh duy nhất" +
                                " của ứng dụng. Giá trị được thêm ở đây nên được" +
                                " chỉ định trong yêu cầu xác thực SAML được gửi từ ứng dụng" +
                                " khách.",
                            title: "Issuer"
                        },
                        metaFile: {
                            subTitle: "Tải lên tệp meta cho cấu hình SAML.",
                            title: "Tải lên tệp metadata"
                        },
                        metaURL: {
                            subTitle: "Liên kết URL meta để lấy cấu hình SAML.",
                            title: "URL meta"
                        }
                    }
                }
            }
        },
        sharedAccessStatus: {
            heading: "Tóm tắt - Cập nhật truy cập được chia sẻ của ứng dụng",
            subHeading: "Tóm tắt các lỗi chia sẻ ứng dụng chi tiết.",
            actionText: "Đóng",
            banner: {
                partiallyCompleted: "Hoàn thành một phần: ",
                failed: "Thất bại: "
            }
        }
    },
    resident: {
        provisioning: {
            outbound: {
                actions: {
                    addIdp: "Nhà cấp phát mới"
                },
                addIdpWizard: {
                    heading: "Thêm nhà cấp phát ra ngoài",
                    steps: {
                        details: "Chi tiết nhà cấp phát"
                    },
                    subHeading: "Chọn nhà cấp phát để cấp phát người dùng."
                },
                emptyPlaceholder: {
                    action: "Nhà cấp phát mới",
                    subtitles: "Chưa cấu hình nhà cấp phát ra ngoài nào. Thêm một nhà cấp phát để xem tại đây.",
                    title: "Không có nhà cấp phát ra ngoài"
                },
                form: {
                    fields: {
                        connection: {
                            label: "Kết nối cấp phát",
                            placeholder: "Chọn kết nối cấp phát",
                            validations: {
                                empty: "Bắt buộc phải chọn một kết nối cấp phát."
                            }
                        }
                    }
                },
                heading: "Cấu hình cấp phát ra ngoài",
                notifications: {
                    create: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi thêm cấu hình cấp phát ra ngoài.",
                            message: "Lỗi tạo"
                        },
                        success: {
                            description: "Đã thêm cấu hình cấp phát ra ngoài thành công.",
                            message: "Tạo thành công"
                        },
                        error: {
                            description: "Cấu hình cấp phát ra ngoài đã tồn tại cho ứng dụng cục bộ.",
                            message: "Lỗi tạo"
                        }
                    },
                    delete: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi xóa cấu hình cấp phát ra ngoài.",
                            message: "Lỗi xóa"
                        },
                        success: {
                            description: "Đã xóa cấu hình cấp phát ra ngoài thành công.",
                            message: "Xóa thành công"
                        }
                    },
                    fetch: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy cấu hình cấp phát ra ngoài.",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    update: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi cập nhật cấu hình cấp phát ra ngoài.",
                            message: "Lỗi cập nhật"
                        },
                        success: {
                            description: "Đã cập nhật cấu hình cấp phát ra ngoài thành công.",
                            message: "Cập nhật thành công"
                        }
                    }
                },
                subHeading: "Cấu hình cài đặt cấp phát ra ngoài cho ứng dụng cục bộ."
            }
        }
    }
};
