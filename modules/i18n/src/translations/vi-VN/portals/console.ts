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
import { develop } from "./console-develop";
import { manage } from "./console-manage";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const console: ConsoleNS = {
    common: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        label: "Thuộc tính lọc",
                        placeholder: "Ví dụ: Name, Description, v.v.",
                        validations: {
                            empty: "Thuộc tính lọc là trường bắt buộc."
                        }
                    },
                    filterCondition: {
                        label: "Điều kiện lọc",
                        placeholder: "Ví dụ: Starts with, v.v.",
                        validations: {
                            empty: "Điều kiện lọc là trường bắt buộc."
                        }
                    },
                    filterValue: {
                        label: "Giá trị lọc",
                        placeholder: "Ví dụ: admin, wso2, v.v.",
                        validations: {
                            empty: "Giá trị lọc là trường bắt buộc."
                        }
                    },
                    filterRecursiveToggle: {
                        label: "Tìm kiếm ở các cấp lồng nhau"
                    }
                }
            },
            hints: {
                querySearch: {
                    actionKeys: "Shift + Enter",
                    label: "Để tìm kiếm dưới dạng truy vấn"
                }
            },
            options: {
                header: "Tìm kiếm nâng cao"
            },
            placeholder: "Tìm kiếm theo {{attribute}}",
            popups: {
                clear: "xóa tìm kiếm",
                dropdown: "Hiện tùy chọn"
            },
            resultsIndicator: "Đang hiển thị kết quả cho truy vấn \"{{query}}\""
        },
        community: "Cộng đồng",
        cookieConsent: {
            confirmButton: "Đã hiểu",
            content: "Chúng tôi sử dụng cookie để đảm bảo bạn có trải nghiệm tổng thể tốt nhất. Những cookie này được dùng để " +
                "duy trì một phiên liên tục không bị ngắt quãng đồng thời cung cấp các dịch vụ mượt mà và được cá nhân hóa. Để " +
                "tìm hiểu thêm về cách chúng tôi sử dụng cookie, vui lòng tham khảo <1>Chính sách Cookie</1> của chúng tôi."
        },
        dateTime: {
            humanizedDateString: "Sửa đổi lần cuối {{date}} trước"
        },
        dropdown: {
            footer: {
                privacyPolicy: "Quyền riêng tư",
                cookiePolicy: "Cookie",
                termsOfService: "Điều khoản"
            }
        },
        header: {
            appSwitch: {
                console: {
                    description: "Quản lý với vai trò nhà phát triển hoặc quản trị viên",
                    name: "Console"
                },
                myAccount: {
                    description: "Quản lý tài khoản của chính bạn",
                    name: "My Account"
                },
                tooltip: "Ứng dụng"
            },
            featureAnnouncements: {
                organizations: {
                    message: "Giới thiệu tổ chức B2B. Bắt đầu xây dựng nền tảng B2B của bạn bằng cách onboarding các " +
                    "tổ chức đối tác/khách hàng.",
                    buttons: {
                        tryout: "Dùng thử"
                    }
                }
            },
            organizationSwitch: {
                breadcrumbError: {
                    description: "Đã xảy ra lỗi khi lấy cấu trúc tổ chức.",
                    message: "Đã xảy ra lỗi"
                },
                emptyOrgListMessage: "Không có tổ chức nào",
                orgSearchPlaceholder: "Tìm kiếm theo tên tổ chức"
            }
        },
        help: {
            communityLinks: {
                discord: "Hỏi trên Discord",
                stackOverflow: "Hỏi trên Stack Overflow"
            },
            docSiteLink: "Tài liệu",
            helpCenterLink: {
                title: "Liên hệ hỗ trợ",
                subtitle: "Trao đổi với đội ngũ {{productName}} để được hỗ trợ cá nhân hóa."
            },
            helpDropdownLink: "Nhận trợ giúp"
        },
        marketingConsent: {
            heading: "Hãy giữ liên lạc nhé!",
            description: "Đăng ký để nhận tin tức mới nhất và cập nhật sản phẩm ngay trong hộp thư của bạn.",
            actions: {
                subscribe: "Đăng ký",
                decline: "Không hiển thị lại"
            },
            notifications: {
                errors: {
                    fetch: {
                        message: "Đã xảy ra lỗi",
                        description: "Đã xảy ra lỗi khi lấy dữ liệu chấp thuận của người dùng"
                    },
                    update: {
                        message: "Đã xảy ra lỗi",
                        description: "Đã xảy ra lỗi khi cập nhật chấp thuận của người dùng"
                    }
                }
            }
        },
        modals: {
            editAvatarModal: {
                content: {
                    gravatar: {
                        errors: {
                            noAssociation: {
                                content: "Có vẻ như email đã chọn chưa được đăng ký trên Gravatar. " +
                                "Hãy đăng ký tài khoản Gravatar bằng cách truy cập <1>website chính thức của Gravatar</1> hoặc sử dụng " +
                                    "một trong các tùy chọn sau.",
                                header: "Không tìm thấy hình ảnh Gravatar phù hợp!"
                            }
                        },
                        heading: "Gravatar dựa trên "
                    },
                    hostedAvatar: {
                        heading: "Hình ảnh được lưu trữ",
                        input: {
                            errors: {
                                http: {
                                    content: "URL đã chọn trỏ đến một hình ảnh không an toàn được phục vụ qua HTTP. " +
                                        "Vui lòng tiếp tục một cách thận trọng.",
                                    header: "Nội dung không an toàn!"
                                },
                                invalid: {
                                    content: "Vui lòng nhập một URL hình ảnh hợp lệ"
                                }
                            },
                            hint: "Nhập một URL hình ảnh hợp lệ được lưu trữ tại vị trí của bên thứ ba.",
                            placeholder: "Nhập URL cho hình ảnh.",
                            warnings: {
                                dataURL: {
                                    content: "Việc sử dụng Data URL với số lượng ký tự lớn có thể gây ra vấn đề " +
                                        "với cơ sở dữ liệu. Hãy tiếp tục một cách thận trọng.",
                                    header: "Kiểm tra kỹ Data URL đã nhập!"
                                }
                            }
                        }
                    },
                    systemGenAvatars: {
                        heading: "Ảnh đại diện do hệ thống tạo",
                        types: {
                            initials: "Chữ cái đầu"
                        }
                    }
                },
                description: null,
                heading: "Cập nhật ảnh hồ sơ",
                primaryButton: "Lưu",
                secondaryButton: "Hủy"
            },
            sessionTimeoutModal: {
                description: "Khi bạn nhấn vào <1>Quay lại</1>, chúng tôi sẽ cố khôi phục phiên nếu " +
                    "phiên đó tồn tại. Nếu bạn không có phiên đang hoạt động, bạn sẽ được chuyển đến trang đăng nhập.",
                heading: "Có vẻ như bạn đã không hoạt động trong một thời gian dài.",
                loginAgainButton: "Đăng nhập lại",
                primaryButton: "Quay lại",
                secondaryButton: "Đăng xuất",
                sessionTimedOutDescription: "Vui lòng đăng nhập lại để tiếp tục từ nơi bạn đã dừng lại.",
                sessionTimedOutHeading: "Phiên người dùng đã hết hạn do không hoạt động."
            }
        },
        placeholders: {
            404: {
                action: "Về trang chủ",
                subtitles: {
                    0: "Chúng tôi không thể tìm thấy trang bạn đang tìm.",
                    1: "Vui lòng kiểm tra URL hoặc nhấn vào nút bên dưới để được chuyển về trang chủ."
                },
                title: "Không tìm thấy trang"
            },
            accessDenied: {
                action: "Tiếp tục đăng xuất",
                subtitles: {
                    0: "Có vẻ như bạn không có quyền sử dụng cổng này.",
                    1: "Vui lòng đăng nhập bằng một tài khoản khác."
                },
                title: "Bạn không được cấp quyền"
            },
            brokenPage: {
                action: "Làm mới trang",
                subtitles: {
                    0: "Đã xảy ra lỗi khi hiển thị trang này.",
                    1: "Xem console của trình duyệt để biết chi tiết kỹ thuật."
                },
                title: "Đã xảy ra lỗi"
            },
            consentDenied: {
                action: "Tiếp tục đăng xuất",
                subtitles: {
                    0: "Có vẻ như bạn chưa cấp chấp thuận cho ứng dụng này.",
                    1: "Vui lòng cấp chấp thuận để sử dụng ứng dụng."
                },
                title: "Bạn đã từ chối chấp thuận"
            },
            genericError: {
                action: "Làm mới trang",
                subtitles: {
                    0: "Đã xảy ra lỗi khi hiển thị trang này.",
                    1: "Xem console của trình duyệt để biết chi tiết kỹ thuật."
                },
                title: "Đã xảy ra lỗi"
            },
            loginError: {
                action: "Tiếp tục đăng xuất",
                subtitles: {
                    0: "Có vẻ như bạn không có quyền sử dụng cổng này.",
                    1: "Vui lòng đăng nhập bằng một tài khoản khác."
                },
                title: "Bạn không được cấp quyền"
            },
            sessionStorageDisabled: {
                subtitles: {
                    0: "Để sử dụng ứng dụng này, bạn phải bật cookie trong cài đặt trình duyệt web của mình.",
                    1: "Để biết thêm thông tin về cách bật cookie, hãy xem phần trợ giúp của trình duyệt web của bạn."
                },
                title: "Cookie đã bị tắt trong trình duyệt của bạn."
            },
            unauthorized: {
                action: "Tiếp tục đăng xuất",
                subtitles: {
                    0: "Có vẻ như bạn không có quyền sử dụng cổng này.",
                    1: "Vui lòng đăng nhập bằng một tài khoản khác."
                },
                title: "Bạn không được cấp quyền"
            }
        },
        quickStart: {
            greeting: {
                alternativeHeading: "Chào mừng trở lại, {{username}}!",
                heading: "Chào mừng, {{username}}!",
                subHeading: "Đây là cách bạn có thể bắt đầu"
            },
            sections: {
                addSocialLogin: {
                    actions: {
                        setup: "Thiết lập kết nối mạng xã hội",
                        view: "Xem kết nối mạng xã hội"
                    },
                    description:
                    "Cho phép người dùng của bạn đăng nhập vào ứng dụng bằng nhà cung cấp danh tính " + "mà họ chọn",
                    heading: "Thêm đăng nhập mạng xã hội"
                },
                adminNotice: {
                    title: "Các cải tiến sắp tới đối với tổ chức",
                    description: "Kể từ <1>{{date}}</1>, các tổ chức sẽ kế thừa cài đặt trên nhiều lĩnh vực chính từ tổ chức cha của chúng. Trong khoảng thời gian này, các cập nhật cấu hình do quản trị viên thực hiện có thể không được phản ánh ngay lập tức.",
                    moreDetails: "<p>Xem <1>tài liệu</1> để biết thêm chi tiết về các thay đổi hành vi.</p>",
                    instructions: {
                        0: "<1>Cài đặt đăng nhập & đăng ký</1>",
                        1: "<1>Thuộc tính người dùng tùy chỉnh</1>",
                        2: "<1>Phạm vi OIDC</1>",
                        3: "<1>Luồng</1>",
                        4: "<1>Kết nối</1>",
                        5: "<1>Cài đặt xác minh cập nhật thuộc tính</1>"
                    }
                },
                integrateApps: {
                    actions: {
                        create: "Đăng ký ứng dụng",
                        manage: "Khám phá ứng dụng",
                        view: "Xem ứng dụng"
                    },
                    capabilities: {
                        sso: "SSO",
                        mfa: "MFA",
                        social: "Đăng nhập mạng xã hội"
                    },
                    description:
                    "Đăng ký ứng dụng của bạn và thiết kế trải nghiệm đăng nhập người dùng mong muốn bằng cách cấu hình " +
                    "SSO, MFA, đăng nhập mạng xã hội và nhiều quy tắc xác thực linh hoạt khác.",
                    heading: "Thêm đăng nhập vào ứng dụng của bạn"
                },
                learn: {
                    actions: {
                        view: "Xem tài liệu"
                    },
                    description:
                    "Bắt đầu sử dụng Asgardeo. Triển khai xác thực cho bất kỳ loại ứng dụng nào " +
                    "trong vài phút.",
                    heading: "Tìm hiểu"
                },
                manageUsers: {
                    actions: {
                        create: "Thêm người dùng",
                        manage: "Quản lý người dùng",
                        view: "Xem người dùng"
                    },
                    capabilities: {
                        collaborators: "Quản trị viên",
                        customers: "Người dùng",
                        groups: "Nhóm người dùng"
                    },
                    description:
                    "Tạo tài khoản người dùng cho người dùng và mời quản trị viên vào tổ chức của bạn. " +
                    "Cho phép người dùng của bạn tự quản lý hồ sơ của họ một cách an toàn.",
                    heading: "Quản lý người dùng và nhóm"
                },
                customizeFlows: {
                    actions: {
                        setup: "Thiết lập luồng người dùng"
                    },
                    description:
                        "Thiết kế trực quan và tùy chỉnh luồng người dùng với trình biên soạn luồng không cần mã của chúng tôi",
                    heading: "Tùy chỉnh luồng người dùng"
                },
                asgardeoTryIt: {
                    errorMessages: {
                        appCreateGeneric: {
                            message: "Đã xảy ra lỗi!",
                            description: "Không thể khởi tạo ứng dụng Try It."
                        },
                        appCreateDuplicate: {
                            message: "Ứng dụng đã tồn tại!",
                            description: "Vui lòng xóa ứng dụng Try It {{productName}} hiện có."
                        }
                    }
                }
            }
        },
        copilot: {
            // TODO: Switch back to "Copilot" once phase 2 is deployed
            title: "Hỏi AI",
            show: "Hiện Hỏi AI",
            hide: "Ẩn Hỏi AI",
            close: "Đóng",
            collapse: "Thu gọn",
            expand: "Mở rộng",
            exitFullscreen: "Thoát toàn màn hình",
            expandToFullscreen: "Mở rộng toàn màn hình",
            clearChat: {
                cancel: "Hủy",
                confirm: "Xóa cuộc trò chuyện",
                message: "Bạn có chắc muốn xóa cuộc trò chuyện và bắt đầu lại không?",
                submessage: "Thao tác này không thể hoàn tác.",
                title: "Xóa cuộc trò chuyện"
            },
            tabs: {
                chat: "Trò chuyện",
                help: "Trợ giúp"
            },
            help: {
                content: "Tôi có thể giúp bạn với nhiều tác vụ khác nhau trong {{productName}}. Hãy thử hỏi tôi về:\n\n• Quản lý người dùng\n• Cấu hình ứng dụng\n• Nhà cung cấp danh tính\n• Luồng xác thực\n• Xử lý sự cố\n\nChỉ cần nhập câu hỏi của bạn vào khung trò chuyện!"
            },
            documentation: {
                content: "Truy cập tài liệu và hướng dẫn toàn diện cho {{productName}}."
            },
            chat: {
                emptyChat: "Bắt đầu cuộc trò chuyện...",
                inputLabel: "Tin nhắn (tùy chọn)",
                loadEarlier: "Tải các tin nhắn trước đó",
                loadingHistory: "Đang tải...",
                messageError: "Không thể hiển thị tin nhắn này.",
                sendMessage: "Gửi tin nhắn",
                thinking: "Đang suy nghĩ..."
            },
            errors: {
                authRequired: "Cần xác thực. Vui lòng đăng nhập để tiếp tục sử dụng copilot.",
                clearHistoryFailed: "Đã xảy ra lỗi. Vui lòng thử lại.",
                connectionFailed: "Đã xảy ra lỗi. Vui lòng thử lại.",
                default: "Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại.",
                requestCancelled: "Yêu cầu đã bị hủy.",
                timeout: "Yêu cầu mất nhiều thời gian hơn dự kiến. Vui lòng thử lại."
            },
            status: {
                submitting: "Đang gửi câu hỏi của bạn..."
            },
            welcome: {
                actions: {
                    authenticationMethods: "Có những phương thức xác thực nào khác nhau?",
                    configureSaml: "Làm thế nào để cấu hình SAML SSO cho một ứng dụng?",
                    manageRoles: "Làm thế nào để quản lý vai trò người dùng?"
                },
                description: "Tôi có thể giúp bạn về quản lý danh tính, thiết lập ứng dụng, quản lý người dùng và hơn thế nữa.",
                // TODO: Switch back to "Copilot" once phase 2 is deployed
                disclaimer: "Hỏi AI có thể mắc lỗi; hãy sử dụng một cách thận trọng. Tránh chia sẻ thông tin cá nhân hoặc nhạy cảm.",
                termsAndConditions: "Điều khoản và điều kiện",
                placeholder: "Nhập tin nhắn của bạn tại đây...",
                send: "Gửi tin nhắn",
                suggestionsTitle: "HÃY THỬ HỎI VỀ",
                // TODO: Switch back to "Copilot" once phase 2 is deployed
                title: "Xin chào, chào mừng đến với Hỏi AI! Tôi có thể hỗ trợ gì cho bạn?"
            }
        },
        sidePanel: {
            privacy: "Quyền riêng tư",
            loginAndRegistration: {
                label: "Đăng nhập & Đăng ký",
                description: "Cấu hình cài đặt đăng nhập và đăng ký."
            },
            userAttributesAndStores: "Thuộc tính & Kho người dùng",
            userManagement: "Quản lý danh tính",
            branding: "Thương hiệu",
            tenants: "Tổ chức gốc",
            policyAdministration: "Quản trị chính sách"
        },
        featureLockedBanner: {
            prefix: "Tính năng này chỉ khả dụng trên các gói cao cấp hơn.",
            action: "Nâng cấp gói của bạn",
            contactAction: "Liên hệ với chúng tôi",
            suffix: "để có quyền truy cập."
        },
        featureLockedTooltip: {
            toggleEnable: "Không thể bật tài nguyên này vì bạn đã vượt quá phân bổ tài nguyên cho gói hiện tại."
        },
        freeTrialBanner: {
            upgradeAction: "nâng cấp",
            contactAction: "liên hệ với chúng tôi"
        },
        planLimitExceededAlert: {
            comparePlansAction: "So sánh các gói",
            hideDetails: "Ẩn chi tiết",
            showDetails: "Hiện chi tiết",
            resolutionsHeading: "Để khôi phục quyền truy cập, hãy chọn một trong các cách sau:",
            applications: {
                title: "Tất cả ứng dụng đã bị vô hiệu hóa — vượt quá giới hạn gói",
                description: "Bạn có nhiều ứng dụng hơn mức gói hiện tại cho phép.",
                upgradeResolution: "<strong>Nâng cấp gói của bạn</strong> để tăng giới hạn ứng dụng. "
                    + "Sau khi nâng cấp, bạn có thể bật lại các ứng dụng hiện có và tạo mới.",
                stayResolution: "<strong>Giữ nguyên gói hiện tại</strong> và xóa các ứng dụng vượt mức "
                    + "để nằm trong giới hạn cho phép. Khi đã trong giới hạn, bạn có thể bật lại phần còn lại."
            },
            enterpriseConnections: {
                title: "Tất cả kết nối doanh nghiệp đã bị vô hiệu hóa — vượt quá giới hạn gói",
                description: "Bạn có nhiều kết nối doanh nghiệp hơn mức gói hiện tại cho phép.",
                upgradeResolution: "<strong>Nâng cấp gói của bạn</strong> để tăng giới hạn kết nối doanh nghiệp. "
                    + "Sau khi nâng cấp, bạn có thể bật lại các kết nối hiện có và tạo mới.",
                stayResolution: "<strong>Giữ nguyên gói hiện tại</strong> và xóa các kết nối doanh nghiệp vượt mức "
                    + "để nằm trong giới hạn cho phép. Khi đã trong giới hạn, bạn có thể bật lại "
                    + "phần còn lại."
            },
            organizations: {
                title: "Tất cả tổ chức đã bị vô hiệu hóa — vượt quá giới hạn gói",
                description: "Bạn có nhiều tổ chức hơn mức gói hiện tại cho phép.",
                upgradeResolution: "<strong>Nâng cấp gói của bạn</strong> để tăng giới hạn tổ chức. "
                    + "Sau khi nâng cấp, bạn có thể bật lại các tổ chức hiện có và tạo mới.",
                stayResolution: "<strong>Giữ nguyên gói hiện tại</strong> và xóa các tổ chức vượt mức "
                    + "để nằm trong giới hạn cho phép. Khi đã trong giới hạn, bạn có thể bật lại phần còn lại."
            }
        },
        upgrade: "Nâng cấp",
        validations: {
            inSecureURL: {
                description: "URL đã nhập là URL không dùng TLS. Vui lòng tiếp tục một cách thận trọng.",
                heading: "URL không an toàn"
            },
            unrecognizedURL: {
                description: "URL đã nhập không phải HTTP cũng không phải HTTPS. Vui lòng tiếp tục một cách thận trọng.",
                heading: "URL không được nhận diện"
            }
        }
    },
    develop,
    manage
};
