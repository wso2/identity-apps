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

import { CustomerDataServiceNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */

export const customerDataService: CustomerDataServiceNS = {
    common: {
        buttons: {
            cancel: "Hủy",
            close: "Đóng",
            confirm: "Xác nhận",
            delete: "Xóa",
            update: "Cập nhật"
        },
        dangerZone: {
            header: "Vùng nguy hiểm"
        },
        featurePreview: {
            action: "Thử Customer Data Service",
            description: "Customer Data Service (CDS) cho phép bạn xây dựng và quản lý hồ sơ khách hàng hợp nhất bằng cách định nghĩa các thuộc tính hồ sơ, cấu hình quy tắc hợp nhất và theo dõi các hồ sơ ẩn danh — mang lại cho bạn một góc nhìn duy nhất, nhất quán về mỗi khách hàng.",
            message: "Sau khi Customer Data Service (CDS) được bật, bạn có thể cấu hình các thuộc tính hồ sơ và quy tắc hợp nhất, và bắt đầu xây dựng các hồ sơ khách hàng hợp nhất.",
            name: "Customer Data Service",
            updateError: "Không thể cập nhật cài đặt Customer Data Service. Vui lòng thử lại."
        },
        notifications: {
            error: "Lỗi",
            loadAttributes: {
                error: {
                    description: "Đã xảy ra lỗi khi tải các thuộc tính.",
                    message: "Không thể tải thuộc tính."
                }
            },
            notAllowed: "Không được phép"
        }
    },
    landing: {
        backButton: "Quay lại Dữ liệu khách hàng",
        configuration: {
            profileAttributes: {
                description: "Quản lý các thuộc tính tạo nên hồ sơ khách hàng",
                title: "Thuộc tính hồ sơ"
            },
            unificationRules: {
                description: "Quản lý quy tắc hợp nhất hồ sơ",
                title: "Quy tắc hợp nhất"
            }
        },
        enable: {
            label: "Bật Customer Data Service"
        },
        notifications: {
            update: {
                error: {
                    description: "Không thể cập nhật cài đặt Customer Data Service. Vui lòng thử lại.",
                    message: "Lỗi cập nhật"
                },
                success: {
                    description: "Cấu hình Customer Data Service đã được cập nhật thành công.",
                    message: "Cập nhật thành công"
                }
            }
        },
        page: {
            description: "Thu thập và hợp nhất dữ liệu khách hàng trên các ứng dụng của bạn",
            title: "Dữ liệu khách hàng"
        },
        profiles: {
            description: "Quản lý hồ sơ khách hàng có dữ liệu danh tính, hành vi và ứng dụng.",
            heading: "Hồ sơ"
        }
    },
    profileAttributes: {
        create: {
            forms: {
                advancedSettings: {
                    fields: {
                        canonicalValues: {
                            hint: "Định nghĩa các cặp nhãn-giá trị được phép cho thuộc tính này.",
                            label: "Tùy chọn",
                            labelField: "Giá trị hiển thị",
                            labelPlaceholder: "ví dụ: Color",
                            validations: {
                                atLeastOne: "Cần ít nhất một tùy chọn.",
                                empty: "Cần cả nhãn và giá trị."
                            },
                            valueField: "Giá trị",
                            valuePlaceholder: "ví dụ: Blue"
                        },
                        mergeStrategy: {
                            hint : "Xác định cách giá trị của thuộc tính từ nhiều hồ sơ được hợp nhất khi hợp nhất hồ sơ diễn ra. " ,
                            label: "Chiến lược hợp nhất",
                            options: {
                                combine: {
                                    hint: "Tất cả giá trị từ các nguồn khác nhau được kết hợp.",
                                    label: "Kết hợp"
                                },
                                overwrite: {
                                    hint: "Giá trị đến thay thế giá trị đã lưu.",
                                    label: "Ghi đè"
                                }
                            }
                        },
                        subAttributes: {
                            hint: "Chọn các thuộc tính con tạo nên thuộc tính phức hợp này.",
                            label: "Thuộc tính con",
                            noOptions: "Không tìm thấy thuộc tính con nào khả dụng.",
                            placeholder: "Chọn một thuộc tính con"
                        }
                    }
                },
                attributeGeneral: {
                    fields: {
                        applicationIdentifier: {
                            label: "Ứng dụng",
                            loading: "Đang tải ứng dụng…",
                            noOptions: "Không tìm thấy ứng dụng nào.",
                            placeholder: "Chọn một ứng dụng",
                            validations: {
                                empty: "Cần có một ứng dụng."
                            }
                        },
                        attribute: {
                            label: "Thuộc tính"
                        },
                        description: {
                            hint: "Mô tả ngắn giải thích mục đích của thuộc tính này.",
                            label: "Mô tả",
                            placeholder: "Nhập mô tả"
                        },
                        displayName: {
                            hint: "Tên dễ đọc.",
                            label: "Tên hiển thị",
                            placeholder: "Nhập tên hiển thị"
                        },
                        name: {
                            fullNameHint: "Tên thuộc tính đầy đủ: {{fullName}}",
                            label: "Tên thuộc tính",
                            placeholder: "Nhập tên thuộc tính",
                            validations: {
                                available: "Tên thuộc tính này khả dụng.",
                                empty: "Cần có tên thuộc tính.",
                                exists: "Đã tồn tại một thuộc tính với tên này."
                            }
                        },
                        scope: {
                            ariaLabel: "Phạm vi thuộc tính",
                            label: "Phạm vi",
                            options: {
                                applicationData: "Dữ liệu ứng dụng",
                                traits: "Đặc điểm"
                            }
                        }
                    }
                },
                typeConfig: {
                    fields: {
                        multiValued: {
                            hint: "Chọn tùy chọn này nếu thuộc tính có thể có nhiều giá trị.",
                            label: "Cho phép nhiều giá trị cho thuộc tính này"
                        },
                        mutability: {
                            hint: "Kiểm soát liệu thuộc tính này có thể được cập nhật sau khi được đặt hay không.",
                            label: "Khả năng thay đổi",
                            options: {
                                immutable: {
                                    hint: "Giá trị thuộc tính không thể thay đổi sau khi được đặt.",
                                    label: "Bất biến"
                                },
                                readOnly: {
                                    hint: "Thuộc tính chỉ có thể được đọc; không thể sửa đổi.",
                                    label: "Chỉ đọc"
                                },
                                readWrite: {
                                    hint: "Giá trị thuộc tính có thể được đọc và cập nhật tự do.",
                                    label: "Đọc & Ghi"
                                },
                                writeOnce: {
                                    hint: "Thuộc tính chỉ có thể được ghi một lần.",
                                    label: "Ghi một lần"
                                }
                            }
                        },
                        valueType: {
                            hint: "Chọn loại dữ liệu cho thuộc tính này.",
                            label: "Loại giá trị",
                            options: {
                                boolean: {
                                    hint: "Một cờ true / false.",
                                    label: "Boolean"
                                },
                                complex: {
                                    hint: "Một đối tượng phức hợp bao gồm các thuộc tính con.",
                                    label: "Đối tượng"
                                },
                                date: {
                                    hint: "Một ngày theo lịch (YYYY-MM-DD).",
                                    label: "Ngày"
                                },
                                date_time: {
                                    hint: "Một giá trị ngày và giờ.",
                                    label: "Ngày & Giờ"
                                },
                                decimal: {
                                    hint: "Một số có độ chính xác thập phân.",
                                    label: "Số thập phân"
                                },
                                epoch: {
                                    hint: "Một dấu thời gian Unix (giây kể từ epoch).",
                                    label: "Epoch"
                                },
                                integer: {
                                    hint: "Một số nguyên.",
                                    label: "Số nguyên"
                                },
                                options: {
                                    hint: "Một tập hợp cố định các cặp khóa-giá trị.",
                                    label: "Tùy chọn"
                                },
                                string: {
                                    hint: "Một giá trị văn bản thuần.",
                                    label: "Văn bản"
                                }
                            }
                        }
                    }
                }
            },
            notifications: {
                addProfileAttribute: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi tạo thuộc tính. Vui lòng thử lại.",
                        message: "Tạo thuộc tính thất bại"
                    },
                    success: {
                        description: "Thuộc tính đã được tạo thành công.",
                        message: "Đã tạo thuộc tính"
                    }
                }
            },
            pageLayout: {
                back: "Quay lại Thuộc tính",
                description: "Tạo một thuộc tính schema hồ sơ mới.",
                stepper: {
                    step1: {
                        description: "Cung cấp tên và mô tả cho thuộc tính.",
                        title: "Chi tiết chung"
                    },
                    step2: {
                        description: "Chọn loại giá trị, khả năng thay đổi và số lượng giá trị.",
                        title: "Loại & Cấu hình"
                    }
                },
                title: "Tạo thuộc tính"
            }
        },
        edit: {
            confirmations: {
                deleteAttribute: {
                    assertionHint: "Vui lòng xác nhận việc xóa.",
                    content: "Bạn có chắc muốn xóa <1>{{attributeName}}</1> không?",
                    header: "Xóa thuộc tính",
                    message: "Thao tác này không thể hoàn tác!"
                }
            },
            dangerZone: {
                delete: {
                    actionTitle: "Xóa thuộc tính",
                    header: "Xóa thuộc tính này",
                    subheader: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn thuộc tính."
                }
            },
            fields: {
                applicationIdentifier: {
                    hint: "Định danh ứng dụng mà thuộc tính này thuộc về, như được lưu trong customer data service.",
                    label: "Định danh ứng dụng"
                },
                applicationName: {
                    hint: "Tên của ứng dụng mà thuộc tính này thuộc về.",
                    label: "Tên ứng dụng"
                },
                attribute: {
                    hint: "Tên của thuộc tính này.",
                    label: "Thuộc tính"
                },
                displayName: {
                    hint: "Tên dễ đọc.",
                    label: "Tên hiển thị",
                    placeholder: "Nhập tên hiển thị"
                },
                mergeStrategy: {
                    hint: "Xác định cách giá trị của thuộc tính từ nhiều hồ sơ được hợp nhất khi hợp nhất hồ sơ diễn ra. " +
                        "Dùng Kết hợp để tích lũy giá trị, hoặc Ghi đè để thay thế bằng giá trị cập nhật mới nhất.",
                    label: "Chiến lược hợp nhất",
                    options: {
                        combine: "Kết hợp",
                        overwrite: "Ghi đè"
                    }
                },
                multiValued: {
                    hint: "Chọn tùy chọn này nếu thuộc tính có thể có nhiều giá trị.",
                    label: "Cho phép nhiều giá trị cho thuộc tính này"
                },

                mutability: {
                    hint: "Kiểm soát liệu thuộc tính này có thể được cập nhật sau khi được đặt hay không.",
                    label: "Khả năng thay đổi"
                },

                subAttributes: {
                    allAdded: "Tất cả thuộc tính con khả dụng đã được thêm.",
                    empty: "Không tìm thấy thuộc tính con nào khả dụng.",
                    hint: "Chọn các thuộc tính con tạo nên thuộc tính phức hợp này.",
                    label: "Thuộc tính con",
                    placeholder: "Chọn thuộc tính con",
                    validationError: "Một thuộc tính phức hợp phải có ít nhất một thuộc tính con.",
                    validationErrorMessage: "Cần có thuộc tính con"
                },

                valueType: {
                    label: "Loại giá trị",
                    options: {
                        boolean: "Boolean",
                        complex: "Phức hợp",
                        date: "Ngày",
                        dateTime: "Ngày & Giờ",
                        decimal: "Số thập phân",
                        epoch: "Epoch",
                        integer: "Số nguyên",
                        text: "Văn bản"
                    }
                }
            },
            identityAttributesNotice: "Các thuộc tính danh tính là chỉ đọc trong phần này. " +
                "Để thực hiện thay đổi, vui lòng cập nhật chúng từ phần Thuộc tính.",
            notifications: {
                deleteAttribute: {
                    error: {
                        description: "Không thể xóa thuộc tính.",
                        message: "Xóa thất bại"
                    },
                    success: {
                        description: "Thuộc tính đã được xóa thành công.",
                        message: "Đã xóa thuộc tính"
                    }
                },
                fetchAttribute: {
                    error: {
                        description: "Không thể lấy chi tiết thuộc tính.",
                        message: "Lỗi lấy dữ liệu"
                    }
                },
                updateAttribute: {
                    error: {
                        description: "Không thể cập nhật thuộc tính.",
                        message: "Cập nhật thất bại"
                    },
                    success: {
                        description: "Cập nhật thuộc tính thành công.",
                        message: "Cập nhật thành công"
                    }
                }
            },
            page: {
                backButton: "Quay lại Thuộc tính",
                pageTitle: "Chỉnh sửa thuộc tính"
            },
            tabs: {
                general: "Chung"
            }
        },
        list: {
            actions: {
                delete: "Xóa",
                edit: "Chỉnh sửa",
                view: "Xem"
            },
            buttons: {
                add: "Thêm thuộc tính hồ sơ",
                clearSearch: "Xóa truy vấn tìm kiếm",
                retry: "Thử lại"
            },
            columns: {
                attribute: "Thuộc tính"
            },
            confirmations: {
                deleteAttribute: {
                    assertionHint: "Vui lòng xác nhận việc xóa.",
                    content: "Bạn có chắc muốn xóa <1>{{attributeName}}</1> không?. " +
                        "Xóa thuộc tính này sẽ loại bỏ thuộc tính khỏi schema và các hồ sơ.",
                    header: "Xóa thuộc tính",
                    message: "Thao tác này không thể hoàn tác!"
                }
            },
            identityAttributes: {
                description: "Chỉnh sửa hoặc cập nhật thuộc tính danh tính.",
                manage: "Quản lý thuộc tính danh tính",
                title: "Thuộc tính danh tính"
            },
            notifications: {
                deleteAttribute: {
                    error: {
                        description: "Không thể xóa thuộc tính.",
                        message: "Xóa thất bại"
                    },
                    success: {
                        description: "Xóa thuộc tính thành công.",
                        message: "Đã xóa"
                    }
                },
                filterProfileAttributes: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi lọc các thuộc tính hồ sơ. Vui lòng thử lại.",
                        message: "Lọc thất bại"
                    }
                }
            },
            page: {
                description: "Quản lý các thuộc tính tạo nên hồ sơ khách hàng.",
                pageTitle: "Thuộc tính hồ sơ",
                title: "Thuộc tính hồ sơ"
            },
            placeholders: {
                emptyList: {
                    subtitles: {
                        0: "Tạo một thuộc tính để thấy nó được liệt kê tại đây."
                    },
                    title: "Không tìm thấy thuộc tính nào"
                },
                emptySearch: {
                    action: "Xóa truy vấn tìm kiếm",
                    subtitles: {
                        0: "Chúng tôi không thể tìm thấy thuộc tính nào khớp với truy vấn tìm kiếm của bạn. Vui lòng thử lại với truy vấn khác."
                    },
                    title: "Không tìm thấy kết quả"
                }
            },
            search: {
                placeholder: "Tìm kiếm theo tên thuộc tính"
            },
            sortBy: {
                name: "Tên",
                scope: "Phạm vi"
            }
        }
    },
    profiles: {
        details: {
            confirmations: {
                deleteProfile: {
                    assertionHint: "Vui lòng xác nhận việc xóa.",
                    content: "Bạn có chắc muốn xóa hồ sơ <1>{{profileId}}</1> không? " +
                        "Thao tác này xóa vĩnh viễn hồ sơ và các hồ sơ được hợp nhất vào nó.",
                    header: "Xóa hồ sơ",
                    message: "Thao tác này không thể hoàn tác!"
                }
            },
            dangerZone: {
                delete: {
                    actionTitle: "Xóa hồ sơ",
                    header: "Xóa hồ sơ này",
                    subheader: "Hồ sơ này không được liên kết với một ID người dùng và có thể bị xóa. " +
                        "Xóa hồ sơ là không thể hoàn tác và cũng sẽ xóa các hồ sơ hợp nhất được hợp nhất vào hồ sơ này."
                }
            },
            form: {
                createdDate: { label: "Ngày tạo" },
                location: { label: "Vị trí" },
                profileData: { label: "Dữ liệu hồ sơ" },
                profileId: { label: "ID hồ sơ" },
                updatedDate: { label: "Ngày cập nhật" },
                userId: { label: "ID người dùng" }
            },
            notifications: {
                deleteProfile: {
                    error: {
                        description: "Không thể xóa hồ sơ.",
                        message: "Lỗi"
                    },
                    notAllowed: {
                        description: "Các hồ sơ được liên kết với một người dùng không thể bị xóa.",
                        message: "Không được phép"
                    },
                    success: {
                        description: "Xóa hồ sơ thành công.",
                        message: "Thành công"
                    }
                },
                fetchProfile: {
                    error: {
                        description: "Không thể tải chi tiết hồ sơ.",
                        message: "Lỗi"
                    }
                }
            },
            page: {
                backButton: "Quay lại Hồ sơ",
                description: "Hồ sơ khách hàng",
                fallbackTitle: "Hồ sơ",
                pageTitle: "Hồ sơ"
            },
            profileData: {
                actions: {
                    copy: "Sao chép",
                    export: "Xuất",
                    view: "Xem"
                },
                copy: {
                    success: {
                        description: "Dữ liệu hồ sơ đã được sao chép vào clipboard.",
                        message: "Đã sao chép"
                    }
                },
                export: {
                    success: {
                        description: "Dữ liệu hồ sơ đã được xuất.",
                        message: "Đã xuất"
                    }
                },
                modal: {
                    title: "Dữ liệu hồ sơ"
                }
            },
            section: {
                profileData: {
                    description: "Phần này chứa các thuộc tính danh tính, đặc điểm và dữ liệu ứng dụng của hồ sơ.",
                    title: "Dữ liệu hồ sơ"
                }
            },
            tabs: {
                general: "Chung",
                unifiedProfiles: "Hồ sơ hợp nhất"
            },
            unifiedProfiles: {
                columns: {
                    profileId: "ID hồ sơ",
                    reason: "Quy tắc hợp nhất liên quan"
                },
                description: "Hồ sơ này đã được hợp nhất với các hồ sơ sau dựa trên các quy tắc hợp nhất " +
                    "đã cấu hình. Dữ liệu từ tất cả các hồ sơ này được hợp nhất vào hồ sơ này.",
                empty: "Không tìm thấy hồ sơ hợp nhất nào cho hồ sơ này.",
                title: "Hồ sơ hợp nhất"
            }
        },
        linkedUser: {
            action: "Xem hồ sơ khách hàng",
            info: "Người dùng này có một hồ sơ Dữ liệu khách hàng liên kết."
        },
        list: {
            chips: {
                anonymous: "Tạm thời",
                registered: "Vĩnh viễn",
                unified: "Đã hợp nhất"
            },
            columns: {
                profile: "Hồ sơ",
                unifiedProfiles: "Hồ sơ hợp nhất",
                user: "Loại hồ sơ"
            },
            confirmations: {
                delete: {
                    assertionHint: "Vui lòng xác nhận việc xóa.",
                    content: "Bạn có chắc muốn xóa hồ sơ <1>{{profileId}}</1> không? " +
                        "Thao tác này xóa vĩnh viễn hồ sơ và các hồ sơ được hợp nhất vào nó.",
                    header: "Xóa hồ sơ",
                    message: "Thao tác này không thể hoàn tác!"
                }
            },
            notifications: {
                delete: {
                    error: {
                        description: "Không thể xóa hồ sơ.",
                        message: "Xóa thất bại"
                    },
                    success: {
                        description: "Hồ sơ đã được xóa thành công.",
                        message: "Đã xóa hồ sơ"
                    }
                },
                fetchProfiles: {
                    error: {
                        description: "Đã xảy ra lỗi khi tải các hồ sơ.",
                        message: "Không thể tải hồ sơ."
                    }
                }
            },
            placeholders: {
                emptyList: {
                    subtitle: "Tạo một hồ sơ để thấy nó được liệt kê tại đây.",
                    title: "Không tìm thấy hồ sơ nào"
                },
                emptySearch: {
                    action: "Xóa truy vấn tìm kiếm",
                    subtitle: "Chúng tôi không thể tìm thấy hồ sơ nào khớp với truy vấn tìm kiếm của bạn. Vui lòng thử lại với truy vấn khác.",
                    title: "Không tìm thấy kết quả"
                }
            },
            search: {
                placeholder: "Tìm kiếm theo ID hồ sơ"
            }
        },
        page: {
            description: "Quản lý hồ sơ khách hàng có dữ liệu danh tính, hành vi và ứng dụng",
            pageTitle: "Hồ sơ",
            title: "Hồ sơ"
        }
    },
    sidePanel: {
        ProfileAttributes: "Thuộc tính hồ sơ",
        Profiles: "Hồ sơ",
        UnificationRules: "Quy tắc hợp nhất",
        customerDataProfile: "Dữ liệu khách hàng"
    },
    unificationRules: {
        common: {
            notifications: {
                deleted: {
                    description: "Quy tắc hợp nhất đã được xóa thành công.",
                    message: "Đã xóa quy tắc"
                },
                deletionFailed: {
                    description: "Không thể xóa quy tắc hợp nhất.",
                    message: "Xóa thất bại"
                },
                loadedFailed: {
                    description: "Không thể tải các quy tắc hợp nhất.",
                    message: "Tải thất bại"
                }
            }
        },
        create: {
            buttons: {
                cancel: "Hủy",
                create: "Tạo quy tắc",
                creating: "Đang tạo..."
            },
            fields: {
                attribute: {
                    attributeAriaLabel: "Thuộc tính",
                    errors: {
                        alreadyUsed: "Thuộc tính này đã được dùng bởi quy tắc khác. Hãy chọn một thuộc tính khác.",
                        loadFailed: "Không thể tải các thuộc tính cho phạm vi đã chọn.",
                        required: "Cần có thuộc tính."
                    },
                    hint: "Chọn một thuộc tính để phân giải các hồ sơ tương tự.",
                    label: "Thuộc tính",
                    loadingRulesHint: "Đang tải các quy tắc hiện có để kiểm tra trùng lặp…",
                    noAvailableForScopeHint: "Không có thuộc tính khả dụng cho phạm vi này.",
                    noOptions: "Không có thuộc tính khả dụng",
                    placeholder: "Chọn một thuộc tính",
                    rulesLoadFailedHint: "Không thể tải các quy tắc hiện có. Việc kiểm tra trùng lặp có thể không chính xác.",
                    scopeAriaLabel: "Phạm vi thuộc tính"
                },
                isActive: {
                    label: "Bật quy tắc này ngay lập tức"
                },
                priority: {
                    errors: {
                        alreadyUsed: "Mức ưu tiên {{priority}} đã được dùng bởi quy tắc khác. Hãy chọn một giá trị khác.",
                        min: "Mức ưu tiên phải ít nhất là 1."
                    },
                    hint: "Số càng nhỏ, mức ưu tiên càng cao. Các quy tắc có mức ưu tiên cao hơn được đánh giá trước.",
                    label: "Mức ưu tiên"
                },
                ruleName: {
                    errors: {
                        required: "Cần có tên quy tắc."
                    },
                    hint: "Chọn một tên quy tắc mô tả tiêu chí hợp nhất, ví dụ: 'Hợp nhất theo email'.",
                    label: "Tên quy tắc",
                    placeholder: "Nhập tên quy tắc mô tả."
                },
                scope: {
                    options: {
                        identity: "Thuộc tính danh tính",
                        trait: "Đặc điểm"
                    }
                }
            },
            headings: {
                ruleDetails: "Chi tiết quy tắc",
                ruleDetailsDescription: "Cung cấp tên, chọn thuộc tính để hợp nhất, và cấu hình mức ưu tiên."
            },
            notifications: {
                created: {
                    description: "Quy tắc hợp nhất đã được tạo thành công.",
                    message: "Đã tạo quy tắc hợp nhất."
                },
                creationFailed: {
                    description: "Không thể tạo quy tắc hợp nhất.",
                    message: "Tạo quy tắc hợp nhất thất bại"
                },
                loadingRules: {
                    description: "Vui lòng đợi cho đến khi các quy tắc hiện có được tải để kiểm tra trùng lặp.",
                    message: "Đang tải các quy tắc hợp nhất"
                }
            },
            page: {
                backButton: "Quay lại Quy tắc hợp nhất",
                description: "Định nghĩa một quy tắc hợp nhất hồ sơ mới để phân giải và hợp nhất các hồ sơ khách hàng.",
                title: "Tạo quy tắc hợp nhất"
            }
        },
        list: {
            actions: {
                delete: "Xóa",
                disable: "Vô hiệu hóa",
                enable: "Bật",
                moveDown: "Di chuyển xuống",
                moveUp: "Di chuyển lên"
            },
            buttons: {
                add: "Thêm quy tắc hợp nhất",
                clearSearch: "Xóa truy vấn tìm kiếm",
                retry: "Thử lại"
            },
            columns: {
                attribute: "Thuộc tính",
                enabled: "Đã bật",
                priority: "Mức ưu tiên",
                rule: "Quy tắc"
            },
            confirmations: {
                delete: {
                    assertionHint: "Vui lòng xác nhận việc xóa.",
                    content: "Bạn có chắc muốn xóa quy tắc " +
                        "<1>{{ruleName}}</1> không? Xóa quy tắc sẽ loại bỏ nó " +
                        "khỏi việc tham gia khớp và hợp nhất hồ sơ người dùng. Việc " +
                        "hợp nhất hiện có sẽ không bị ảnh hưởng.",
                    header: "Xóa quy tắc hợp nhất",
                    message: "Xóa quy tắc này sẽ loại bỏ nó vĩnh viễn và không thể hoàn tác."
                },
                toggle: {
                    disableContent: "Bạn có chắc muốn vô hiệu hóa quy tắc <1>{{ruleName}}</1> không?",
                    disableHeader: "Vô hiệu hóa quy tắc hợp nhất",
                    disableMessage: "Vô hiệu hóa quy tắc này sẽ ngăn nó tham gia vào việc hợp nhất hồ sơ.",
                    enableContent: "Bạn có chắc muốn bật quy tắc <1>{{ruleName}}</1> không?",
                    enableHeader: "Bật quy tắc hợp nhất",
                    enableMessage: "Bật quy tắc này sẽ cho phép quy tắc này được gọi trong việc khớp và hợp nhất hồ sơ."
                }
            },
            labels: {
                scope: {
                    identity: "Thuộc tính danh tính",
                    trait: "Đặc điểm"
                }
            },
            notifications: {
                priorityUpdated: {
                    error: {
                        description: "Không thể cập nhật mức ưu tiên.",
                        message: "Cập nhật quy tắc hợp nhất thất bại"
                    },
                    rollbackError: {
                        description: "Không thể hoàn tác mức ưu tiên sau khi cập nhật thất bại.",
                        message: "Hoàn tác thất bại"
                    },
                    success: {
                        description: "Mức ưu tiên của \"{{ruleName}}\" đã được {{direction}}.",
                        message: "Đã cập nhật mức ưu tiên quy tắc hợp nhất"
                    }
                },
                ruleDisabled: {
                    success: {
                        description: "\"{{ruleName}}\" đã được vô hiệu hóa.",
                        message: "Đã vô hiệu hóa quy tắc hợp nhất"
                    }
                },
                ruleEnabled: {
                    success: {
                        description: "\"{{ruleName}}\" đã được bật.",
                        message: "Đã bật quy tắc hợp nhất"
                    }
                },
                toggleFailed: {
                    error: {
                        description: "Không thể cập nhật trạng thái quy tắc hợp nhất.",
                        message: "Cập nhật thất bại"
                    }
                }
            },
            page: {
                description: "Quản lý quy tắc hợp nhất hồ sơ.",
                title: "Quy tắc hợp nhất"
            },
            placeholders: {
                empty: {
                    subtitle: "Vui lòng thêm một quy tắc hợp nhất để bắt đầu hợp nhất các hồ sơ của bạn.",
                    title: "Không tìm thấy quy tắc hợp nhất nào"
                },
                error: {
                    subtitle: "Không thể tải các quy tắc hợp nhất. Vui lòng thử lại.",
                    title: "Lỗi khi tải quy tắc"
                },
                noResults: {
                    subtitle1: "Không có quy tắc hợp nhất nào khớp với tìm kiếm của bạn.",
                    subtitle2: "Hãy thử điều chỉnh tiêu chí tìm kiếm.",
                    title: "Không tìm thấy kết quả"
                },
                search: "Tìm kiếm theo tên quy tắc hoặc tên thuộc tính"
            }
        }
    }
};
