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

import { ConsentsNS } from "../../../models";

export const consents: ConsentsNS = {
    preferenceManagement: {
        form: {
            description: {
                label: "Mô tả",
                labelRoleHint: "Để trống để dùng mô tả mặc định."
            },
            linkHint: "Để thu thập chấp thuận khi đăng ký, hãy thêm tùy chọn này vào <0>luồng đăng ký</0>.",
            name: {
                error: {
                    duplicateName: "Đã tồn tại một tùy chọn với tên này. Vui lòng dùng một tên khác."
                },
                label: "Tên",
                placeholder: "Đăng ký nhận bản tin"
            }
        },
        list: {
            emptyPlaceholder: {
                addConsent: "Tùy chọn mới",
                subtitle: "Hiện tại không có tùy chọn nào khả dụng"
            },
            emptySearchPlaceholder: {
                action: "Xóa tìm kiếm",
                subtitle: "Không tìm thấy tùy chọn nào cho truy vấn tìm kiếm.",
                title: "Không tìm thấy kết quả"
            },
            labels: {
                sharedPreference: "Tùy chọn được chia sẻ"
            }
        },
        notifications: {
            create: {
                error: {
                    conflict: {
                        description: "Đã tồn tại một tùy chọn với tên này. Vui lòng dùng một tên khác.",
                        message: "Xung đột"
                    },
                    description: "Không thể tạo tùy chọn. Vui lòng thử lại.",
                    message: "Tạo thất bại",
                    notFound: {
                        description: "Không tìm thấy tùy chọn được yêu cầu.",
                        message: "Không tìm thấy"
                    },
                    serverError: {
                        description: "Đã xảy ra lỗi máy chủ khi tạo tùy chọn. Vui lòng thử lại sau.",
                        message: "Lỗi máy chủ"
                    }
                },
                success: {
                    description: "Tạo tùy chọn thành công.",
                    message: "Đã tạo tùy chọn"
                }
            },
            delete: {
                error: {
                    conflict: {
                        description: "Không thể xóa tùy chọn này vì nó đang được sử dụng hoặc được bảo vệ.",
                        message: "Không thể xóa"
                    },
                    description: "Không thể xóa tùy chọn. Vui lòng thử lại.",
                    message: "Xóa thất bại",
                    notFound: {
                        description: "Không tìm thấy tùy chọn bạn đang cố xóa.",
                        message: "Không tìm thấy"
                    },
                    serverError: {
                        description: "Đã xảy ra lỗi máy chủ khi xóa tùy chọn. Vui lòng thử lại sau.",
                        message: "Lỗi máy chủ"
                    }
                },
                success: {
                    description: "Xóa tùy chọn thành công.",
                    message: "Đã xóa tùy chọn"
                }
            },
            update: {
                error: {
                    conflict: {
                        description: "Phiên bản này đã tồn tại hoặc xung đột với một phiên bản khác.",
                        message: "Xung đột phiên bản"
                    },
                    description: "Cập nhật tùy chọn thất bại. Vui lòng thử lại.",
                    message: "Cập nhật thất bại",
                    notFound: {
                        description: "Không tìm thấy tùy chọn hoặc phiên bản bạn đang cố cập nhật.",
                        message: "Không tìm thấy"
                    },
                    serverError: {
                        description: "Đã xảy ra lỗi máy chủ khi cập nhật tùy chọn. Vui lòng thử lại sau.",
                        message: "Lỗi máy chủ"
                    }
                },
                success: {
                    description: "Cập nhật tùy chọn thành công.",
                    message: "Cập nhật thành công"
                }
            }
        },
        pages: {
            deleteConfirmation: {
                assertionHint: "Tôi hiểu thao tác này là vĩnh viễn và không thể hoàn tác.",
                content: "Tùy chọn này chỉ có thể bị xóa nếu không có người dùng nào đã chấp nhận nó.",
                header: "Xóa tùy chọn?",
                message: "Thao tác này sẽ xóa vĩnh viễn tùy chọn. Không thể hoàn tác.",
                primaryAction: "Xác nhận",
                secondaryAction: "Hủy"
            },
            edit: {
                backButton: "Quay lại Quản lý tùy chọn",
                dangerZone: {
                    actionTitle: "Xóa tùy chọn",
                    header: "Xóa tùy chọn",
                    subheader: "Sau khi bạn xóa một tùy chọn, không thể hoàn tác. Vui lòng chắc chắn."
                },
                title: "Chỉnh sửa tùy chọn"
            },
            list: {
                actions: {
                    addConsent: "Tùy chọn mới"
                },
                description: "Quản lý các tùy chọn liên lạc cho tổ chức của bạn.",
                heading: "Quản lý tùy chọn",
                search: {
                    placeholder: "Tìm kiếm theo tên"
                },
                title: "Quản lý tùy chọn"
            },
            new: {
                backButton: "Quay lại Quản lý tùy chọn",
                title: "Tạo tùy chọn"
            }
        },
        preview: {
            consentHeader: "Vui lòng xem lại các tùy chọn của bạn để tiếp tục.",
            emptyDescription: "Viết tên chấp thuận để xem trước.",
            exampleDescription: "Tôi đồng ý nhận liên lạc về {{consentName}}.",
            pageTitle: "Tùy chọn liên lạc"
        }
    },
    policyConsents: {
        brandingRequired: "Bật thương hiệu để cập nhật chính sách mặc định. <1>Đi đến Thương hiệu</1>",
        form: {
            createNewVersion: "Tạo phiên bản mới",
            description: {
                label: "Mô tả"
            },
            mandatory: {
                hint: "Người dùng phải chấp nhận chính sách này để tiếp tục.",
                label: "Bắt buộc",
                linkHint: "Để thu thập chấp thuận khi đăng ký, hãy thêm chính sách này vào <0>luồng đăng ký</0>."
            },
            name: {
                error: {
                    duplicateName: "Đã tồn tại một chính sách với tên này. Vui lòng dùng một tên khác."
                },
                label: "Tên",
                placeholder: "Chính sách quyền riêng tư"
            },
            policyUrl: {
                hint: "Liên kết đến tài liệu chính sách đầy đủ. Bạn có thể dùng placeholder như <1>{{lang}}</1>, <3>{{country}}</3>, hoặc <5>{{locale}}</5> để tùy chỉnh URL cho các khu vực hoặc ngôn ngữ khác nhau.",
                label: "URL chính sách",
                versionHint: "Để tạo phiên bản mới, hãy cập nhật URL chính sách, mô tả hoặc cài đặt prompt ở trên."
            },
            promptOnLogin: {
                activeHint: "Người dùng sẽ được nhắc xem lại và chấp nhận chính sách này trong khi đăng nhập.",
                hint: "Khi được bật, người dùng sẽ được nhắc xem lại và chấp nhận chính sách này ở mỗi lần đăng nhập.",
                label: "Nhắc khi đăng nhập"
            },
            versionDropdown: {
                currentVersionLabel: "Phiên bản {{version}} (hiện tại)",
                trigger: "Phiên bản {{version}}"
            },
            createModal: {
                header: "Tạo chính sách",
                hint: "Người dùng có chấp thuận đang chờ từ phiên bản trước sẽ luôn được nhắc, bất kể cài đặt này.",
                promptAtLogin: "Nhắc ở lần đăng nhập tiếp theo",
                promptDescription: "Người dùng hiện có có nên được yêu cầu chấp nhận chính sách này ở lần đăng nhập tiếp theo không?"
            },
            versionModal: {
                createNewVersion: "Lưu dưới dạng phiên bản mới",
                hint: "Người dùng có chấp thuận đang chờ từ phiên bản trước sẽ luôn được nhắc, bất kể cài đặt này.",
                promptAtLogin: "Nhắc ở lần đăng nhập tiếp theo",
                promptDescription: "Người dùng hiện có có nên được yêu cầu chấp nhận phiên bản mới này ở lần đăng nhập tiếp theo không?"
            }
        },
        list: {
            emptyPlaceholder: {
                addPolicy: "Chính sách mới",
                subtitle: "Hiện tại không có chính sách nào khả dụng"
            },
            emptySearchPlaceholder: {
                action: "Xóa tìm kiếm",
                subtitle: "Không tìm thấy chính sách nào cho truy vấn tìm kiếm.",
                title: "Không tìm thấy kết quả"
            },
            labels: {
                defaultPolicy: "Mặc định",
                notConfigured: "Chưa được cấu hình",
                sharedPolicy: "Chính sách được chia sẻ"
            }
        },
        notifications: {
            create: {
                error: {
                    conflict: {
                        description: "Đã tồn tại một chính sách với tên này. Vui lòng dùng một tên khác.",
                        message: "Xung đột"
                    },
                    description: "Không thể tạo chính sách. Vui lòng thử lại.",
                    message: "Tạo thất bại",
                    notFound: {
                        description: "Không tìm thấy chính sách được yêu cầu.",
                        message: "Không tìm thấy"
                    },
                    serverError: {
                        description: "Đã xảy ra lỗi máy chủ khi tạo chính sách. Vui lòng thử lại sau.",
                        message: "Lỗi máy chủ"
                    }
                },
                success: {
                    description: "Tạo chính sách thành công.",
                    message: "Đã tạo chính sách"
                }
            },
            delete: {
                error: {
                    conflict: {
                        description: "Không thể xóa chính sách này vì nó đang được sử dụng hoặc được bảo vệ.",
                        message: "Không thể xóa"
                    },
                    description: "Không thể xóa chính sách. Vui lòng thử lại.",
                    message: "Xóa thất bại",
                    notFound: {
                        description: "Không tìm thấy chính sách bạn đang cố xóa.",
                        message: "Không tìm thấy"
                    },
                    serverError: {
                        description: "Đã xảy ra lỗi máy chủ khi xóa chính sách. Vui lòng thử lại sau.",
                        message: "Lỗi máy chủ"
                    }
                },
                success: {
                    description: "Xóa chính sách thành công.",
                    message: "Đã xóa chính sách"
                }
            },
            update: {
                error: {
                    conflict: {
                        description: "Phiên bản này đã tồn tại hoặc xung đột với một phiên bản khác.",
                        message: "Xung đột phiên bản"
                    },
                    description: "Cập nhật chính sách thất bại. Vui lòng thử lại.",
                    message: "Cập nhật thất bại",
                    notFound: {
                        description: "Không tìm thấy chính sách hoặc phiên bản bạn đang cố cập nhật.",
                        message: "Không tìm thấy"
                    },
                    serverError: {
                        description: "Đã xảy ra lỗi máy chủ khi cập nhật chính sách. Vui lòng thử lại sau.",
                        message: "Lỗi máy chủ"
                    }
                },
                success: {
                    description: "Cập nhật chính sách thành công.",
                    message: "Cập nhật thành công"
                }
            }
        },
        pages: {
            deleteConfirmation: {
                assertionHint: "Tôi hiểu thao tác này là vĩnh viễn và không thể hoàn tác.",
                content: "Chính sách này chỉ có thể bị xóa nếu không có người dùng nào đã chấp nhận nó.",
                header: "Xóa chính sách?",
                message: "Thao tác này sẽ xóa vĩnh viễn chính sách. Không thể hoàn tác.",
                primaryAction: "Xác nhận",
                secondaryAction: "Hủy"
            },
            edit: {
                backButton: "Quay lại Quản lý chính sách",
                dangerZone: {
                    actionTitle: "Xóa chính sách",
                    header: "Xóa chính sách",
                    subheader: "Sau khi bạn xóa một chính sách, không thể hoàn tác. Vui lòng chắc chắn."
                },
                title: "Chỉnh sửa chính sách"
            },
            list: {
                actions: {
                    addPolicy: "Chính sách mới"
                },
                description: "Quản lý các chính sách cho tổ chức của bạn.",
                heading: "Quản lý chính sách",
                search: {
                    placeholder: "Tìm kiếm theo tên chính sách"
                },
                title: "Quản lý chính sách"
            },
            new: {
                backButton: "Quay lại Quản lý chính sách",
                title: "Tạo chính sách"
            }
        },
        promptScope: {
            assignButton: "Gán ứng dụng",
            assignModal: {
                header: "Gán ứng dụng",
                noApps: "Tất cả ứng dụng đều đã được gán.",
                subHeading: "Gán ứng dụng cho chính sách chấp thuận này."
            },
            header: "Gán ứng dụng",
            noApplications: "Không có ứng dụng nào được gán.",
            noApplicationsSubtitle: "Gán ứng dụng để nhắc người dùng xem lại và chấp nhận chính sách chấp thuận này.",
            searchPlaceholder: "Tìm kiếm theo tên ứng dụng",
            selectAll: "Chọn tất cả ứng dụng",
            subHeading: "Chọn những ứng dụng sẽ nhắc người dùng xem lại và chấp nhận chính sách chấp thuận này."
        },
        wizard: {
            create: {
                form: {
                    description: {
                        configureTranslation: "Cấu hình bản dịch",
                        i18nCard: {
                            brandingRequired: "Bật thương hiệu để cập nhật bản dịch. <1>Đi đến Thương hiệu</1>",
                            brandingRequiredShort: "Bật thương hiệu để cập nhật bản dịch.",
                            createTitle: "Tạo bản dịch",
                            deleteError: {
                                description: "Không thể xóa bản dịch. Vui lòng thử lại.",
                                message: "Xóa thất bại"
                            },
                            deleteSuccess: {
                                description: "Xóa bản dịch thành công.",
                                message: "Đã xóa bản dịch"
                            },
                            deleteTooltip: "Xóa bản dịch cho khóa đã chọn.",
                            editTooltip: "Chỉnh sửa văn bản bản dịch cho khóa đã chọn.",
                            i18nKey: "Khóa bản dịch",
                            keyPlaceholder: "ví dụ: consent.description",
                            language: "Ngôn ngữ",
                            newTooltip: "Tạo khóa bản dịch mới cho mô tả này.",
                            saveError: {
                                description: "Không thể lưu bản dịch. Vui lòng thử lại.",
                                message: "Lưu thất bại"
                            },
                            saveSuccess: {
                                description: "Lưu bản dịch thành công.",
                                message: "Đã lưu bản dịch"
                            },
                            selectKey: "Chọn một khóa bản dịch",
                            title: "Cấu hình bản dịch",
                            translationPlaceholder: "Nhập văn bản mô tả đã dịch...",
                            translationText: "Văn bản bản dịch",
                            updateTitle: "Cập nhật bản dịch"
                        },
                        insertCustomLinkShort: "Liên kết",
                        insertPolicyLink: "Bọc văn bản đã chọn bằng URL chính sách dưới dạng liên kết",
                        insertPolicyLinkInvalidUrl: "URL chính sách phải là URL HTTP hoặc HTTPS hợp lệ.",
                        insertPolicyLinkNoPolicyUrl: "Định nghĩa URL chính sách ở trên trước khi chèn liên kết.",
                        insertPolicyLinkNoSelection: "Chọn những từ bạn muốn liên kết, sau đó nhấn.",
                        insertPolicyLinkShort: "Liên kết chính sách",
                        insertPolicyLinkTooltip: "Bọc văn bản đã chọn bằng URL chính sách của bạn dưới dạng siêu liên kết.",
                        labelRoleHint: "Nhãn hộp kiểm hiển thị cho người dùng. Để trống để dùng mặc định. Đánh dấu văn bản và nhấn \"Liên kết chính sách\" để thêm siêu liên kết.",
                        removePolicyLink: "Xóa liên kết chính sách khỏi văn bản đã chọn."
                    }
                },
                preview: {
                    consentHeader: "Vui lòng xem lại và chấp nhận những điều sau để tiếp tục.",
                    emptyDescription: "Nhập tên chính sách ở trên để xem trước.",
                    exampleDescription: "Tôi đã đọc và đồng ý với <0>{{policyName}}</0>.",
                    pageTitle: "Xem lại và chấp nhận chính sách",
                    updatedPolicies: "Chính sách đã cập nhật"
                }
            }
        }
    },
    registrationFlow: {
        addAttribute: "Thêm thuộc tính",
        addPurpose: "Thêm mục đích",
        attributeDisplayName: "Tên hiển thị",
        attributeName: "Tên thuộc tính",
        attributes: "Thuộc tính người dùng",
        noPreference: "Không có tùy chọn nào khả dụng. Tạo chúng từ Quản lý tùy chọn.",
        noPolicies: "Không có chính sách nào khả dụng. Tạo chính sách từ Quản lý chính sách.",
        purposeDescription: "Mô tả",
        purposeLabel: "Mục đích {{index}}",
        purposeName: "Tên mục đích",
        selectPreference: "Chọn tùy chọn:",
        selectPolicies: "Chọn chính sách:"
    },
    sidePanel: {
        consentEdit: "Chỉnh sửa chấp thuận",
        consentNew: "Chấp thuận mới",
        preferenceManagementEdit: "Chỉnh sửa Quản lý tùy chọn",
        preferenceManagementNew: "Quản lý tùy chọn mới",
        privacyPolicy: "Chính sách quyền riêng tư",
        termsOfService: "Điều khoản dịch vụ"
    },
    tabs: {
        applications: { label: "Ứng dụng" },
        content: { label: "Nội dung" },
        general: { label: "Chung" },
        preview: { label: "Xem trước" }
    }
};
