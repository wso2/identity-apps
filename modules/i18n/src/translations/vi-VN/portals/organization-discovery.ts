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
import { organizationDiscoveryNS } from "../../../models";

export const organizationDiscovery: organizationDiscoveryNS = {
    advancedSearch: {
        form: {
            dropdown: {
                filterAttributeOptions: {
                    organizationName: "Tên tổ chức"
                }
            },
            inputs: {
                filterAttribute: {
                    placeholder: "Ví dụ: Tên tổ chức, v.v."
                },
                filterCondition: {
                    placeholder: "Ví dụ: Starts with, v.v."
                },
                filterValue: {
                    placeholder: "Nhập giá trị để tìm kiếm"
                }
            }
        },
        placeholder: "Tìm kiếm theo tên tổ chức"
    },
    assign: {
        buttons: {
            assign: "Gán"
        },
        description: "Gán miền email cho các tổ chức.",
        form: {
            fields: {
                emailDomains: {
                    hint: "Nhập và enter miền email để ánh xạ tới tổ chức. (Ví dụ: gmail.com, v.v.)",
                    label : "Miền email",
                    placeholder: "Nhập miền email",
                    validations: {
                        invalid: {
                            0: "Vui lòng nhập một miền email hợp lệ.",
                            1: "Miền email đã cung cấp đã được ánh xạ tới một tổ chức khác."
                        }
                    }
                },
                organizationName: {
                    emptyPlaceholder: {
                        0: "Không có tổ chức nào khả dụng.",
                        1: "Tất cả tổ chức đều đã được gán miền."
                    },
                    hint: "Nhập tên tổ chức mà bạn muốn thêm ánh xạ miền.",
                    label: "Tên tổ chức",
                    placeholder: "Chọn một tổ chức"
                }
            }
        },
        title: "Gán miền email"
    },
    edit: {
        back: "Quay lại",
        description: "Chỉnh sửa miền email",
        form: {
            fields: {
                emailDomains: {
                    hint: "Nhập và enter miền email để ánh xạ tới tổ chức. (Ví dụ: gmail.com, v.v.)",
                    label : "Miền email",
                    placeholder: "Nhập miền email",
                    validations: {
                        invalid: {
                            0: "Vui lòng nhập một miền email hợp lệ.",
                            1: "Miền email đã cung cấp đã được ánh xạ tới một tổ chức khác."
                        }
                    }
                },
                organizationName: {
                    hint: "Tên tổ chức mà các ánh xạ miền được thêm vào.",
                    label: "Tên tổ chức"
                }
            },
            message: "Thay đổi ánh xạ miền email có thể khiến người dùng hiện có không thể đăng nhập."
        }
    },
    emailDomains: {
        actions: {
            assign: "Gán miền email",
            enable: "Bật khám phá miền email"
        }
    },
    message: "Tính năng khám phá miền email chỉ có thể được sử dụng khi địa chỉ email được cấu hình làm tên đăng nhập."
        + " Khi được bật, các miền email được xác thực trong quá trình xác thực người dùng và khi quản trị viên"
        + " onboarding người dùng vào các tổ chức.",
    notifications: {
        addEmailDomains: {
            error: {
                description: "Việc thêm miền email vào tổ chức không thành công.",
                message: "Thêm không thành công"
            },
            success: {
                description: "Đã thêm miền email thành công.",
                message: "Thêm thành công"
            }
        },
        checkEmailDomain: {
            error: {
                description: "Việc xác thực sự tồn tại của miền email không thành công.",
                message: "Xác thực không thành công"
            }
        },
        disableEmailDomainBasedSelfRegistration: {
            error: {
                description: "Đã xảy ra lỗi khi tắt khám phá miền email cho tự đăng ký.",
                message: "Tắt không thành công"
            },
            success: {
                description: "Đã tắt khám phá miền email cho tự đăng ký thành công.",
                message: "Tắt thành công"
            }
        },
        disableEmailDomainDiscovery: {
            error: {
                description: "Đã xảy ra lỗi khi tắt khám phá miền email.",
                message: "Tắt không thành công"
            },
            success: {
                description: "Đã tắt khám phá miền email thành công.",
                message: "Tắt thành công"
            }
        },
        enableEmailDomainBasedSelfRegistration: {
            error: {
                description: "Đã xảy ra lỗi khi bật khám phá miền email cho tự đăng ký.",
                message: "Bật không thành công"
            },
            success: {
                description: "Đã bật khám phá miền email cho tự đăng ký thành công.",
                message: "Bật thành công"
            }
        },
        enableEmailDomainDiscovery: {
            error: {
                description: "Đã xảy ra lỗi khi bật khám phá miền email.",
                message: "Bật không thành công"
            },
            success: {
                description: "Đã bật khám phá miền email thành công.",
                message: "Bật thành công"
            }
        },
        fetchOrganizationDiscoveryAttributes: {
            error: {
                description: "Đã xảy ra lỗi khi lấy các thuộc tính khám phá tổ chức.",
                message: "Lấy dữ liệu không thành công"
            }
        },
        getEmailDomainDiscovery: {
            error: {
                description: "Đã xảy ra lỗi khi lấy cấu hình khám phá miền email.",
                message: "Lấy dữ liệu không thành công"
            }
        },
        getOrganizationListWithDiscovery: {
            error: {
                description: "Đã xảy ra lỗi khi lấy danh sách tổ chức với các thuộc tính khám phá.",
                message: "Lấy dữ liệu không thành công"
            }
        },
        updateOrganizationDiscoveryAttributes: {
            error: {
                description: "Đã xảy ra lỗi khi cập nhật các thuộc tính khám phá tổ chức.",
                message: "Cập nhật không thành công"
            },
            success: {
                description: "Đã cập nhật các thuộc tính khám phá tổ chức thành công.",
                message: "Cập nhật thành công"
            }
        }
    },
    placeholders: {
        emptyList: {
            action: "Gán miền email",
            subtitles: "Không có tổ chức nào được gán miền email.",
            title: "Gán miền email"
        }
    },
    selfRegistration: {
        label: "Khám phá miền email cho tự đăng ký",
        labelHint: "Khi được bật, người dùng sẽ tự đăng ký vào các tổ chức con thông qua các ứng dụng được chia sẻ",
        message: "Bật <1>tự đăng ký</1> để cho phép khám phá miền cho tự đăng ký"
    },
    title: "Khám phá tổ chức"
};
