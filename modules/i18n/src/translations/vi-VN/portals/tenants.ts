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

/* eslint-disable max-len */

import { TenantsNS } from "../../../models/namespaces/tenants-ns";

export const tenants: TenantsNS = {
    actions: {
        newTenant: {
            title: "Tổ chức gốc mới"
        },
        systemSettings: {
            tooltip: "Cấu hình cài đặt hệ thống"
        }
    },
    addTenant: {
        actions: {
            cancel: {
                label: "Hủy"
            },
            save: {
                label: "Tạo"
            }
        },
        form: {
            adminDetails: {
                title: "Chi tiết quản trị viên"
            }
        },
        notifications: {
            addTenant: {
                error: {
                    description: "Đã xảy ra lỗi khi tạo tổ chức.",
                    message: "Không thể tạo tổ chức"
                },
                success: {
                    description: "Đã tạo tổ chức gốc thành công.",
                    message: "Đã tạo tổ chức"
                }
            }
        },
        subtitle: "Thêm một tổ chức gốc mới để chia sẻ máy chủ theo cách tách biệt.",
        title: "Tạo một tổ chức gốc"
    },
    common: {
        form: {
            fields: {
                alphanumericUsername: {
                    label: "Tên đăng nhập",
                    placeholder: "Nhập tên đăng nhập",
                    validations: {
                        usernameHint: "Phải là chuỗi chữ và số (a-z, A-Z, 0-9) dài từ {{minLength}} đến {{maxLength}} ký tự bao gồm ít nhất một chữ cái.",
                        usernameSpecialCharHint: "Phải dài từ {{minLength}} đến {{maxLength}} ký tự, bao gồm ít nhất một chữ cái, và có thể chứa tổ hợp các ký tự sau: a-z, A-Z, 0-9, !@#$&'+\\=^.{|}~-."
                    }
                },
                domain: {
                    helperText: "Nhập một handle tổ chức (miền) duy nhất cho tổ chức của bạn. Ký tự hợp lệ bao gồm chữ cái thường, số, '.', '-', và '_'.",
                    label: "Handle tổ chức (Miền)",
                    placeholder: "Nhập handle tổ chức (miền)",
                    validations: {
                        domainInvalidCharPattern: "Handle tổ chức (miền) chứa một hoặc nhiều ký tự không hợp lệ.",
                        domainInvalidPattern: "Handle tổ chức (miền) không khớp với mẫu hợp lệ.",
                        domainMandatoryExtension: "Handle tổ chức (miền) phải có phần mở rộng dấu chấm. Ví dụ: abc.com",
                        domainStartingWithDot: "Handle tổ chức (miền) không được bắt đầu bằng dấu chấm.",
                        domainUnavailable: "Đã tồn tại một tổ chức với cùng handle (miền).",
                        required: "Cần có handle tổ chức (miền)."
                    }
                },
                email: {
                    label: "Email",
                    placeholder: "Nhập địa chỉ email của quản trị viên.",
                    validations: {
                        invalid: "Vui lòng nhập một địa chỉ email hợp lệ. Bạn có thể sử dụng ký tự " +
                            "chữ và số, ký tự unicode, dấu gạch dưới (_), dấu gạch ngang (-), dấu chấm (.), " +
                            "và ký tự a còng (@).",
                        required: "Cần có email."
                    }
                },
                emailUsername: {
                    helperTextAlt: "Nhập một địa chỉ email hợp lệ để dùng làm tên đăng nhập.",
                    label: "Tên đăng nhập (Email)",
                    placeholder: "Nhập một địa chỉ email hoặc tên đăng nhập để dùng làm tên đăng nhập."
                },
                firstname: {
                    label: "Tên",
                    placeholder: "Nhập tên của quản trị viên.",
                    validations: {
                        required: "Cần có tên."
                    }
                },
                id: {
                    helperText: "Chọn một tên đăng nhập duy nhất cho quản trị viên.",
                    label: "ID Tenant",
                    placeholder: "Nhập một ID Tenant."
                },
                lastname: {
                    label: "Họ",
                    placeholder: "Nhập họ của quản trị viên.",
                    validations: {
                        required: "Cần có họ."
                    }
                },
                organizationName: {
                    helperText: "Nhập một tên duy nhất cho tổ chức của bạn. Ký tự hợp lệ bao gồm chữ cái (a–z, A–Z), số, dấu cách, dấu chấm (.), dấu gạch ngang (-), và dấu gạch dưới (_). <bold>Để trống trường này để dùng handle tổ chức (miền) làm tên tổ chức.</bold>",
                    label: "Tên tổ chức",
                    placeholder: "Nhập tên tổ chức",
                    validations: {
                        invalidCharPattern: "Tên tổ chức chứa một hoặc nhiều ký tự không hợp lệ."
                    }
                },
                password: {
                    actions: {
                        generate: {
                            label: "Tạo"
                        }
                    },
                    label: "Mật khẩu",
                    placeholder: "Nhập mật khẩu cho quản trị viên.",
                    validations: {
                        criteria: {
                            consecutiveCharacters: "Không được lặp ký tự quá {{repeatedChr}} lần",
                            lowerCase: "Cần ít nhất {{minLowerCase}} chữ in thường",
                            passwordCase: "Cần ít nhất {{minUpperCase}} chữ in hoa và {{minLowerCase}} chữ in thường",
                            passwordLength: "Phải có độ dài từ {{min}} đến {{max}} ký tự",
                            passwordNumeric: "Cần ít nhất {{min}} chữ số",
                            specialCharacter: "Cần ít nhất {{specialChr}} ký tự đặc biệt",
                            uniqueCharacters: "Cần ít nhất {{uniqueChr}} ký tự khác nhau",
                            upperCase: "Cần ít nhất {{minUpperCase}} chữ in hoa"
                        },
                        required: "Cần có mật khẩu."
                    }
                },
                username: {
                    helperText: "Chọn một tên đăng nhập duy nhất cho quản trị viên.",
                    label: "Tên đăng nhập",
                    placeholder: "Nhập tên đăng nhập cho quản trị viên.",
                    validations: {
                        regExViolation: "Vui lòng nhập một tên đăng nhập hợp lệ.",
                        required: "Cần có tên đăng nhập.",
                        usernameLength: "Độ dài tên đăng nhập phải từ {{minLength}} đến {{maxLength}}.",
                        usernameSpecialCharSymbols: "Vui lòng chọn một tên đăng nhập hợp lệ tuân theo các hướng dẫn đã cho.",
                        usernameSymbols: "Tên đăng nhập phải bao gồm ký tự chữ và số (a-z, A-Z, 0-9) và phải chứa ít nhất một chữ cái."
                    }
                }
            }
        }
    },
    confirmationModals: {
        deleteTenant: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn xóa tổ chức này, người dùng sẽ không thể sử dụng các dịch vụ do tổ chức cung cấp. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn tổ chức.",
            primaryAction: "Xác nhận",
            secondaryAction: "Hủy"
        },
        disableTenant: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn vô hiệu hóa tổ chức này, người dùng sẽ không thể sử dụng các dịch vụ do tổ chức cung cấp cho đến khi nó được bật lại. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này sẽ tạm thời vô hiệu hóa tổ chức.",
            primaryAction: "Xác nhận",
            secondaryAction: "Hủy"
        }
    },
    deploymentUnits: {
        label: "Khu vực",
        placeholder: "Chọn một khu vực (ví dụ: US).",
        validations: {
            empty: "Đây là trường bắt buộc."
        }
    },
    edit: {
        backButton: "Quay lại Tổ chức gốc",
        consoleURL: {
            hint: "Nếu bạn cố đăng nhập vào Console của tổ chức <1>{{domain}}</1> bằng cùng trình duyệt, bạn sẽ phải đăng xuất khỏi phiên đang hoạt động này trước.",
            label: "URL Console"
        },
        subtitle: "Được tạo vào {{date}}"
    },
    editSelfOrganization: {
        actions: {
            save: {
                label: "Lưu"
            }
        },
        form: {
            fields: {
                created: {
                    label: "Đã tạo"
                },
                lastModified: {
                    label: "Sửa đổi lần cuối"
                },
                organizationHandle: {
                    hint: "Sao chép handle tổ chức vào clipboard",
                    label: "Handle tổ chức"
                },
                organizationId: {
                    hint: "Sao chép ID tổ chức vào clipboard",
                    label: "ID tổ chức"
                },
                organizationName: {
                    label: "Tên tổ chức",
                    placeholder: "Nhập tên tổ chức",
                    validations: {
                        required: "Cần có tên tổ chức"
                    }
                }
            }
        },
        notifications: {
            updateOrganization: {
                error: {
                    description: "Đã xảy ra lỗi khi cập nhật tổ chức",
                    message: "Cập nhật thất bại"
                },
                success: {
                    description: "Cập nhật tổ chức thành công",
                    message: "Cập nhật thành công"
                }
            }
        },
        readOnly: {
            subtitle: "Duyệt thông tin tổ chức",
            title: "Chi tiết tổ chức"
        },
        subtitle: "Quản lý chi tiết tổ chức",
        title: "Chỉnh sửa tổ chức"
    },
    editTenant: {
        actions: {
            save: {
                label: "Cập nhật"
            }
        },
        dangerZoneGroup: {
            delete: {
                actionTitle: "Xóa",
                header: "Xóa tổ chức",
                subheader: "Sau khi bạn xóa một tổ chức gốc, không thể hoàn tác. Vui lòng tiếp tục một cách thận trọng."
            },
            disable: {
                actionTitle: "Vô hiệu hóa",
                header: "Vô hiệu hóa tổ chức",
                subheader: "Người dùng sẽ không thể đăng nhập vào bất kỳ ứng dụng nào hoặc thực hiện bất kỳ tác vụ liên quan nào của tổ chức cho đến khi nó được bật lại."
            },
            header: "Vùng nguy hiểm"
        },
        disabledDisclaimer: {
            actions: {
                enable: {
                    label: "Bật"
                }
            },
            content: "Tổ chức này hiện đang ở trạng thái <1>bị vô hiệu hóa</1>. Người dùng sẽ không thể đăng nhập vào bất kỳ ứng dụng nào hoặc thực hiện bất kỳ tác vụ liên quan nào của tổ chức cho đến khi nó được bật lại.",
            title: "Cảnh báo"
        },
        notifications: {
            deleteTenantMeta: {
                error: {
                    description: "Đã xảy ra lỗi khi xóa tổ chức {{tenantDomain}}.",
                    message: "Không thể xóa"
                },
                success: {
                    description: "Đã xóa tổ chức {{tenantDomain}} thành công.",
                    message: "Đã xóa tổ chức"
                }
            },
            updateTenant: {
                error: {
                    description: "Đã xảy ra lỗi khi cố cập nhật tổ chức",
                    message: "Không thể cập nhật tổ chức"
                },
                success: {
                    description: "Đã cập nhật tổ chức thành công.",
                    message: "Đã cập nhật tổ chức"
                }
            },
            updateTenantStatus: {
                error: {
                    description: "Đã xảy ra lỗi khi cố {{operation}} tổ chức {{tenantDomain}}",
                    message: "Không thể {{operation}} tổ chức"
                },
                success: {
                    description: "Đã {{operation}} tổ chức {{tenantDomain}} thành công.",
                    message: "Tổ chức {{operation}}"
                }
            }
        }
    },
    listDeploymentUnits: {
        description: "Đã xảy ra lỗi khi lấy các khu vực.",
        message: "Không thể lấy các khu vực"
    },
    listing: {
        advancedSearch: {
            form: {
                dropdown: {
                    filterAttributeOptions: {
                        domain: "Miền"
                    }
                },
                inputs: {
                    filterAttribute: {
                        placeholder: "Ví dụ: Domain."
                    },
                    filterCondition: {
                        placeholder: "Ví dụ: Starts with, v.v."
                    },
                    filterValue: {
                        placeholder: "Nhập giá trị để tìm kiếm"
                    }
                }
            },
            placeholder: "Search by domain"
        },
        count: "Đang hiển thị {{results}} trên {{totalResults}}",
        emptyPlaceholder: {
            actions: {
                configure: {
                    label: "Cấu hình cài đặt hệ thống"
                },
                divider: "HOẶC",
                new: {
                    label: "Tổ chức gốc mới"
                }
            },
            subtitles: {
                0: "Hiện tại không có tổ chức gốc nào khả dụng.",
                1: "Tạo tổ chức gốc đầu tiên của bạn, hoặc cấu hình cài đặt hệ thống áp dụng cho tất cả tổ chức gốc."
            },
            title: "Không có nhóm nào được gán cho vai trò."
        },
        emptySearchResult: {
            actions: {
                clearSearchQuery: {
                    label: "Xóa truy vấn tìm kiếm"
                }
            },
            subtitles: {
                0: "Chúng tôi không thể tìm thấy kết quả nào cho '{{ searchQuery }}'",
                1: "Vui lòng thử một từ khóa tìm kiếm khác."
            },
            title: "Không tìm thấy kết quả"
        },
        item: {
            actions: {
                delete: {
                    label: "Xóa"
                },
                edit: {
                    label: "Chỉnh sửa"
                },
                more: {
                    label: "Thêm"
                }
            },
            meta: {
                createdOn: {
                    label: "Được tạo vào <1>{{date}}</1>"
                },
                owner: {
                    label: "Thuộc sở hữu của <1>{{owner}}</1>"
                }
            }
        }
    },
    status: {
        activate: "Bật",
        activated: "Đã bật",
        deActivate: "Vô hiệu hóa",
        deActivated: "Đã vô hiệu hóa"
    },
    subtitle: "Cấu hình và quản lý máy chủ của bạn bằng cách tạo các tổ chức cấp gốc mới trong không gian làm việc của bạn.",
    systemSettings: {
        actions: {
            newTenant: {
                title: "Tổ chức gốc mới"
            },
            systemSettings: {
                tooltip: "Cấu hình cài đặt hệ thống"
            }
        },
        backButton: "Quay lại Tổ chức gốc",
        subtitle: "Cấu hình và quản lý các cấu hình toàn cục áp dụng trên toàn hệ thống. .",
        title: "Cài đặt hệ thống"
    },
    tenantDropdown: {
        options: {
            edit: {
                label: "Chỉnh sửa tổ chức"
            },
            manage: {
                label: "Quản lý tổ chức gốc"
            },
            view: {
                label: "Xem tổ chức"
            }
        }
    },
    title: "Tổ chức gốc"
};
