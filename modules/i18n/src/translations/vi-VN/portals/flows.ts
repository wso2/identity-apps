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
import { flowsNS } from "../../../models";

export const flows: flowsNS = {
    askPassword: {
        banner: {
            description: "Mang đến trải nghiệm onboarding người dùng được mời liền mạch cho người dùng của bạn bằng cách tùy chỉnh luồng đăng ký phù hợp với nhu cầu của tổ chức.",
            title: "Xây dựng trải nghiệm đăng ký người dùng được mời lý tưởng của bạn với <1>Trình xây dựng luồng đăng ký người dùng được mời</1> mới của chúng tôi"
        },
        flowDisplayName: "Đăng ký người dùng được mời",
        steps: {
            end: {
                autoLogin: {
                    hint: "Đăng nhập người dùng ngay lập tức khi luồng hoàn tất, không cần bước bổ sung.",
                    label: "Tự động đăng nhập"
                },
                description: "<1>Màn hình kết thúc</1> xác định điều gì xảy ra khi luồng đăng ký người dùng được mời hoàn tất. Nó cho phép bạn kiểm soát trải nghiệm cuối cùng của người dùng bằng cách chọn một trong các kết quả sau:",
                flowCompletionNotification: {
                    hint: "Thông báo cho người dùng qua email khi luồng hoàn thành thành công.",
                    label: "Gửi email thông báo khi luồng hoàn tất"
                }
            }
        }
    },
    core: {
        autoSave: {
            savingInProgress: "Đang tự động lưu..."
        },
        breadcrumb: "Chỉnh sửa luồng {{flowType}}",
        elements: {
            richText: {
                linkEditor: {
                    linkTargetHint: "Cho phép quản trị viên kiểm soát việc liên kết mở trong cùng tab hay tab mới",
                    linkTargetLabel: "Mở liên kết trong tab mới",
                    newTabHint: "Liên kết sẽ mở trong tab trình duyệt mới",
                    placeholder: "Nhập URL liên kết tại đây...",
                    predefinedUrls: {
                        applicationAccessUrl: "URL truy cập ứng dụng",
                        callbackOrApplicationAccessUrl: "URL callback hoặc truy cập ứng dụng",
                        customUrl: "URL tùy chỉnh",
                        privacyPolicyUrl: "URL chính sách quyền riêng tư",
                        supportEmail: "Email liên hệ hỗ trợ",
                        termsOfUseUrl: "URL điều khoản sử dụng"
                    },
                    sameTabHint: "Liên kết sẽ mở trong cùng tab trình duyệt",
                    urlTypeLabel: "Loại URL"
                },
                placeholder: "Nhập nội dung văn bản phong phú tại đây..."
            },
            preferenceManagement: {
                emptyState: "Chưa cấu hình mục đích nào"
            },
            policyConsent: {
                emptyState: "Chưa cấu hình chính sách nào"
            },
            textPropertyField: {
                i18nCard: {
                    chip: {
                        commonScreen: {
                            label: "Chung"
                        }
                    },
                    commonKeyWarning: "Bạn đang chỉnh sửa một khóa bản dịch được chia sẻ ảnh hưởng đến nhiều trang trên toàn hệ thống. Các thay đổi sẽ được phản ánh trên tất cả các trang sử dụng khóa này.",
                    configure: "Thêm",
                    createTitle: "Tạo bản dịch",
                    i18nKey: "Khóa bản dịch",
                    i18nKeyInputHint: "Khóa bản dịch sẽ được thêm tiền tố '{{newI18nKeyPrefix}}' và thêm vào màn hình {{primaryI18nScreen}}",
                    i18nKeyInputPlaceholder: "Nhập một khóa bản dịch mới",
                    language: "Ngôn ngữ",
                    languageText: "Bản dịch",
                    languageTextPlaceholder: "Nhập văn bản cho ngôn ngữ đã chọn",
                    selectI18nKey: "Chọn một khóa bản dịch",
                    selectLanguage: "Chọn ngôn ngữ",
                    title: "Bản dịch - {{propertyKey}}",
                    tooltip: {
                        addNewTranslation: "Thêm một bản dịch mới",
                        commonKeyTooltip: "Đây là một khóa bản dịch được chia sẻ dùng trên nhiều trang dành cho người dùng cuối",
                        editExistingTranslation: "Cập nhật một bản dịch hiện có"
                    },
                    updateTitle: "Cập nhật bản dịch"
                },
                placeholder: "Nhập {{propertyName}}",
                tooltip: {
                    configureTranslation: "Cấu hình bản dịch",
                    enableBrandingRequired: "Bật thương hiệu để cập nhật bản dịch. <1>Đi đến Thương hiệu</1>"
                }
            }
        },
        executions: {
            confirmationCode: {
                configurationHint: "Cho phép người dùng tự đặt mật khẩu trong quá trình onboarding do quản trị viên khởi tạo và cấu hình các cài đặt liên quan."
            },
            landing:{
                message: "Cấu hình cài đặt {{executor}} và xuất bản để áp dụng các thay đổi."
            },
            names: {
                apple: "Apple",
                confirmationCode: "Mã xác nhận",
                default: "Thực thi",
                digitalWallet: "Ví kỹ thuật số",
                facebook: "Facebook",
                flowExtension: "Tiện ích luồng",
                github: "GitHub",
                google: "Google",
                magicLink: "Magic Link",
                microsoft: "Microsoft",
                passkeyEnrollment: "Đăng ký Passkey"
            },
            tooltip: {
                configurationHint: "Cấu hình"
            }
        },
        labels: {
            disableFlow: "Vô hiệu hóa",
            enableFlow: "Bật"
        },
        modals: {
            revertFlow: {
                assertionHint: "Vui lòng xác nhận thao tác của bạn",
                description: "Thao tác này sẽ xóa vĩnh viễn tất cả tùy chỉnh và hoàn tác luồng về trạng thái ban đầu.",
                title: "Hoàn tác luồng {{flowType}}?",
                warning: "Thao tác này không thể hoàn tác."
            }
        },
        notificationPanel: {
            emptyMessages: {
                errors: "Không tìm thấy lỗi nào.",
                info: "Không tìm thấy thông báo thông tin nào.",
                warnings: "Không tìm thấy cảnh báo nào."
            },
            header: "Thông báo",
            tabs: {
                errors: "Lỗi",
                info: "Thông tin",
                warnings: "Cảnh báo"
            },
            trigger: {
                label: "Thông báo"
            }
        },
        notifications: {
            brandingPreferenceFetch: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy tùy chọn thương hiệu.",
                    message: "Lỗi lấy tùy chọn thương hiệu"
                }
            },
            customTextPreferenceMetaFetch: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy siêu dữ liệu tùy chọn văn bản tùy chỉnh.",
                    message: "Lỗi lấy siêu dữ liệu tùy chọn văn bản tùy chỉnh"
                }
            },
            disableFlow: {
                genericError: {
                    description: "Đã xảy ra lỗi khi vô hiệu hóa luồng {{flowType}}.",
                    message: "Lỗi vô hiệu hóa luồng {{flowType}}"
                },
                success: {
                    description: "Đã vô hiệu hóa luồng {{flowType}} thành công.",
                    message: "Đã vô hiệu hóa luồng {{flowType}}"
                }
            },
            enableFlow: {
                genericError: {
                    description: "Đã xảy ra lỗi khi bật luồng {{flowType}}.",
                    message: "Lỗi bật luồng {{flowType}}"
                },
                success: {
                    description: "Đã bật luồng {{flowType}} thành công.",
                    message: "Đã bật luồng {{flowType}}"
                }
            },
            fallbackTextPreferenceFetch: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy tùy chọn văn bản dự phòng.",
                    message: "Lỗi lấy tùy chọn văn bản dự phòng"
                }
            },
            fetchFlowConfig: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy cấu hình luồng {{flowType}}.",
                    message: "Lỗi lấy luồng {{flowType}}"
                }
            },
            flowMetadataFetch: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy siêu dữ liệu luồng.",
                    message: "Lỗi lấy siêu dữ liệu luồng"
                }
            },
            restoreFromHistory: {
                genericError: {
                    description: "Đã xảy ra lỗi khi khôi phục phiên bản luồng.",
                    message: "Không thể khôi phục phiên bản"
                },
                invalidData: {
                    description: "Dữ liệu luồng không hợp lệ trong mục lịch sử.",
                    message: "Không thể khôi phục phiên bản"
                },
                success: {
                    description: "Đã khôi phục luồng về phiên bản từ {{date}} thành công.",
                    message: "Khôi phục luồng thành công"
                }
            },
            revertFlow: {
                genericError: {
                    description: "Đã xảy ra lỗi khi hoàn tác luồng {{flowType}}.",
                    message: "Lỗi hoàn tác luồng {{flowType}}"
                },
                success: {
                    description: "Đã hoàn tác luồng {{flowType}} về trạng thái ban đầu thành công.",
                    message: "Đã hoàn tác luồng {{flowType}}"
                }
            },
            textPreferenceFetch: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy tùy chọn văn bản tùy chỉnh.",
                    message: "Lỗi lấy tùy chọn văn bản"
                }
            },
            updateI18nKey: {
                genericError: {
                    description: "Đã xảy ra lỗi khi cập nhật văn bản tùy chỉnh trong luồng.",
                    message: "Lỗi cập nhật văn bản tùy chỉnh"
                },
                success: {
                    description: "Đã cập nhật văn bản tùy chỉnh trong luồng thành công.",
                    message: "Cập nhật văn bản tùy chỉnh thành công"
                }
            }
        },
        steps: {
            end: {
                flowCompletionProperties: "Thuộc tính hoàn thành luồng"
            }
        },
        tooltips: {
            disableFlow: "Vô hiệu hóa luồng {{flowType}}",
            enableFlow: "Bật luồng {{flowType}}"
        },
        validation: {
            fields: {
                button: {
                    action: "Nút phải có loại hành động được định nghĩa để hoạt động đúng.",
                    general: "Các trường bắt buộc chưa được cấu hình đúng cho nút có ID <1>{{id}}</1>.",
                    text: "Nút phải có văn bản để hiển thị cho người dùng.",
                    variant: "Nút phải có biến thể được định nghĩa để tạo kiểu đúng."
                },
                checkbox: {
                    general: "Các trường bắt buộc chưa được cấu hình đúng cho trường hộp kiểm có ID <1>{{id}}</1>.",
                    identifier: "Trường hộp kiểm phải được ánh xạ tới một thuộc tính để thu thập dữ liệu.",
                    label: "Trường hộp kiểm phải có nhãn để hiển thị cho người dùng."
                },
                divider: {
                    general: "Các trường bắt buộc chưa được cấu hình đúng cho đường phân cách có ID <1>{{id}}</1>.",
                    variant: "Đường phân cách phải có biến thể được định nghĩa để tạo kiểu và định hướng đúng."
                },
                flowExtension: {
                    actionId: "Cần có và phải chọn một kết nối tiện ích luồng.",
                    general: "Các trường bắt buộc chưa được cấu hình đúng cho tiện ích luồng có ID <1>{{id}}</1>."
                },
                image: {
                    general: "Các trường bắt buộc chưa được cấu hình đúng cho hình ảnh có ID <1>{{id}}</1>.",
                    src: "Hình ảnh phải có URL nguồn để hiển thị cho người dùng.",
                    variant: "Hình ảnh phải có biến thể được định nghĩa để tạo kiểu và bố cục đúng."
                },
                input: {
                    general: "Các trường bắt buộc chưa được cấu hình đúng cho trường nhập liệu có ID <1>{{id}}</1>.",
                    identifier: "Trường nhập liệu phải được ánh xạ tới một thuộc tính để thu thập dữ liệu.",
                    idpName: "Cần có và phải chọn một kết nối.",
                    label: "Trường nhập liệu phải có nhãn để hiển thị cho người dùng."
                },
                otpInput: {
                    general: "Các trường bắt buộc chưa được cấu hình đúng cho trường nhập OTP có ID <1>{{id}}</1>.",
                    label: "Trường nhập OTP phải có nhãn để hướng dẫn người dùng."
                },
                phoneNumberInput: {
                    general: "Các trường bắt buộc chưa được cấu hình đúng cho trường số điện thoại có ID <1>{{id}}</1>.",
                    identifier: "Trường số điện thoại phải được ánh xạ tới một thuộc tính để thu thập dữ liệu.",
                    label: "Trường số điện thoại phải có nhãn để hiển thị cho người dùng."
                },
                preferenceManagement: {
                    general: "Các trường bắt buộc chưa được cấu hình đúng cho tùy chọn liên lạc.",
                    purposeAttributesRequired: "Mục đích \"{{purposeName}}\" phải có ít nhất một thuộc tính được chọn.",
                    purposesRequired: "Phải thêm ít nhất một mục đích."
                },
                policyConsent: {
                    general: "Các trường bắt buộc chưa được cấu hình đúng cho chấp thuận chính sách.",
                    noPoliciesAvailable: "Không có chính sách nào khả dụng để chọn.",
                    policiesRequired: "Phải chọn ít nhất một chính sách."
                },
                richText: {
                    general: "Các trường bắt buộc chưa được cấu hình đúng cho văn bản phong phú có ID <1>{{id}}</1>.",
                    text: "Văn bản phong phú phải có nội dung để hiển thị cho người dùng."
                },
                typography: {
                    general: "Các trường bắt buộc chưa được cấu hình đúng cho kiểu chữ có ID <1>{{id}}</1>.",
                    text: "Kiểu chữ phải có nội dung văn bản để hiển thị cho người dùng.",
                    variant: "Kiểu chữ phải có biến thể được định nghĩa để tạo kiểu văn bản đúng."
                }
            },
            userResolveExecutorFields: {
                message: "Biểu mẫu với hành động 'Resolve User' chỉ có thể chứa một trường nhập văn bản được ánh xạ tới Username.",
                messageWithUserIdentifier: "Biểu mẫu với hành động 'Resolve User' chỉ có thể chứa các trường nhập văn bản được ánh xạ tới Username hoặc User Identifier."
            }
        },
        validationStatusLabels: {
            error: "Lỗi",
            errors: "Lỗi",
            info: "Thông tin",
            warning: "Cảnh báo",
            warnings: "Cảnh báo"
        },
        versionHistory: {
            currentVersion: "Phiên bản hiện tại",
            emptyState: "Không có lịch sử phiên bản",
            hint: "Xin lưu ý rằng lịch sử phiên bản được lưu cục bộ trong trình duyệt của bạn và sẽ bị mất nếu bạn xóa dữ liệu trình duyệt hoặc chuyển sang trình duyệt hoặc thiết bị khác.",
            moreActions: "Thêm hành động",
            panelTitle: "Lịch sử phiên bản (Cục bộ)",
            restoreAction: "Khôi phục",
            restoreDialog: {
                cancel: "Hủy",
                noFlowData: "Không có dữ liệu luồng để xem trước.",
                previewContainer: {
                    description: "Bản xem trước bên dưới hiển thị trạng thái của luồng trong phiên bản đã chọn.",
                    title: "Xem trước luồng"
                },
                restore: "Khôi phục",
                restoring: "Đang khôi phục...",
                title: "Khôi phục phiên bản này?",
                warningAlert: {
                    description: "Nếu bạn tiếp tục, luồng hiện tại sẽ được thay thế bằng phiên bản từ <1>{{timestamp}}</1>. Vui lòng dành chút thời gian xem lại bản xem trước luồng bên dưới trước khi xác nhận vì thao tác này không thể hoàn tác.",
                    title: "Cảnh báo"
                }
            },
            restoreVersion: "Khôi phục phiên bản này",
            unknownAuthor: "Không xác định"
        },
        workflowAlert: {
            description: "Một quy trình công việc đang được kích hoạt cho luồng này. Các cài đặt sau sẽ không có hiệu lực cho đến khi quy trình công việc bị vô hiệu hóa.",
            navigation: "Nhấn <1>tại đây</1> để xem các quy trình công việc hiện đang được kích hoạt.",
            title: "Quy trình công việc đã kích hoạt"
        }
    },
    label: "Luồng",
    page: {
        description: "Thiết kế và tùy chỉnh hành trình người dùng của bạn với trình biên soạn luồng không cần mã.",
        title: "Luồng"
    },
    passwordRecovery: {
        banner: {
            description: "Mang đến trải nghiệm khôi phục mật khẩu liền mạch cho người dùng của bạn bằng cách tùy chỉnh luồng khôi phục phù hợp với nhu cầu của tổ chức.",
            title: "Xây dựng trải nghiệm khôi phục mật khẩu lý tưởng của bạn với <1>Trình xây dựng luồng khôi phục mật khẩu</1> mới của chúng tôi"
        },
        flowDisplayName: "Khôi phục mật khẩu",
        name: "Trình xây dựng luồng khôi phục mật khẩu",
        steps: {
            end: {
                autoLogin: {
                    hint: "Đăng nhập người dùng ngay lập tức khi khôi phục mật khẩu hoàn tất, không cần bước bổ sung.",
                    label: "Tự động đăng nhập"
                },
                description: "<1>Màn hình kết thúc</1> xác định điều gì xảy ra khi luồng khôi phục mật khẩu hoàn tất. Nó cho phép bạn kiểm soát trải nghiệm cuối cùng của người dùng bằng cách chọn một trong các kết quả sau:",
                flowCompletionNotification: {
                    hint: "Thông báo cho người dùng qua email khi luồng khôi phục mật khẩu hoàn thành thành công.",
                    label: "Gửi email thông báo khi luồng hoàn tất"
                }
            }
        }
    },
    registrationFlow: {
        flowDisplayName: "Đăng ký",
        notifications: {
            updateFlowConfig: {
                genericError: {
                    description: "Không thể cập nhật cấu hình hoàn thành luồng đăng ký.",
                    message: "Cập nhật cấu hình thất bại"
                }
            },
            updateRegistrationFlow: {
                genericError: {
                    description: "Không thể cập nhật luồng đăng ký.",
                    message: "Cập nhật luồng thất bại"
                },
                success: {
                    description: "Luồng đăng ký đã được cập nhật thành công.",
                    message: "Cập nhật luồng thành công"
                }
            }
        },
        steps: {
            emailConfirmation: "Xác nhận email",
            end: {
                accountActivation: {
                    activateImmediately: {
                        hint: "Tự động kích hoạt tài khoản người dùng khi tạo, cho phép truy cập ngay lập tức mà không cần chờ xác minh.",
                        label: "Kích hoạt tài khoản khi tạo"
                    }
                },
                accountFlowCompletion: {
                    hint: "Thông báo cho người dùng qua email khi luồng hoàn thành thành công.",
                    label: "Gửi email thông báo khi luồng hoàn tất"
                },
                accountVerification: {
                    hint: "Yêu cầu người dùng xác nhận tài khoản của họ qua email trước khi cấp quyền truy cập.",
                    label: "Xác minh tài khoản khi luồng hoàn tất.",
                    warning: "Khi luồng bao gồm bước xác minh email (ví dụ: Email OTP), tùy chọn này sẽ không được áp dụng."
                },
                autoLogin: {
                    hint: "Đăng nhập người dùng ngay lập tức khi luồng hoàn tất, không cần bước bổ sung.",
                    label: "Tự động đăng nhập"
                },
                description: "<1>Màn hình kết thúc</1> xác định điều gì xảy ra khi luồng hoàn tất. Nó cho phép bạn kiểm soát trải nghiệm cuối cùng của người dùng bằng cách chọn một trong các kết quả sau:"
            }
        }
    }
};
