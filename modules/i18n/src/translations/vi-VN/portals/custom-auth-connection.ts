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

import { customAuthenticatorNS } from "../../../models";

export const customAuthenticator: customAuthenticatorNS = {
    fields: {
        createWizard: {
            authenticationTypeStep: {
                externalAuthenticationCard: {
                    examples: "Ví dụ: Đăng nhập mạng xã hội, Enterprise IdP",
                    header: "Xác thực người dùng bên ngoài (liên kết)",
                    mainDescription: "Xác thực và cấp phát người dùng liên kết."
                },
                internalUserAuthenticationCard: {
                    examples: "Ví dụ: Tên đăng nhập & Mật khẩu, Email OTP",
                    header: "Xác thực người dùng nội bộ",
                    mainDescription: "Thu thập định danh và xác thực các tài khoản người dùng được quản lý trong tổ chức."
                },
                label: "Chọn loại xác thực bạn đang triển khai",
                title: "Loại xác thực",
                twoFactorAuthenticationCard: {
                    examples: "Ví dụ: TOTP",
                    header: "Xác thực 2FA",
                    mainDescription: "Chỉ xác minh người dùng ở bước thứ hai hoặc muộn hơn trong luồng đăng nhập."
                }
            },
            configurationsStep: {
                authenticationTypeDropdown: {
                    authProperties: {
                        accessToken: {
                            label: "Access token",
                            placeholder: "Access Token",
                            validations: {
                                required: "Access Token là trường bắt buộc."
                            }
                        },
                        header: {
                            label: "Tiêu đề",
                            placeholder: "Tiêu đề",
                            validations: {
                                invalid: "Vui lòng chọn một tên tiêu đề hợp lệ tuân theo các hướng dẫn đã cho.",
                                required: "Tiêu đề là trường bắt buộc."
                            }
                        },
                        password: {
                            label: "Mật khẩu",
                            placeholder: "Mật khẩu",
                            validations: {
                                required: "Mật khẩu là trường bắt buộc."
                            }
                        },
                        username: {
                            label: "Tên đăng nhập",
                            placeholder: "Tên đăng nhập",
                            validations: {
                                required: "Tên đăng nhập là trường bắt buộc."
                            }
                        },
                        value: {
                            label: "Giá trị",
                            placeholder: "Giá trị",
                            validations: {
                                required: "Giá trị là trường bắt buộc."
                            }
                        }
                    },
                    hint: "Sau khi thêm, các secret này sẽ không được hiển thị. Bạn chỉ có thể đặt lại chúng.",
                    label: "Cơ chế xác thực",
                    placeholder: "Chọn loại xác thực",
                    title: "Xác thực endpoint",
                    validations: {
                        required: "Loại xác thực là trường bắt buộc."
                    }
                },
                endpoint: {
                    hint: "URL của endpoint bên ngoài đã cấu hình để tích hợp với phương thức xác thực",
                    label: "Endpoint",
                    placeholder: "https://auth.service.example.com/authenticate",
                    validations: {
                        empty: "URI endpoint trống",
                        general: "Vui lòng nhập một URL hợp lệ.",
                        invalid: "URL đã nhập không phải HTTPS. Vui lòng thêm một URL hợp lệ."
                    }
                },
                title: "Cấu hình"
            },
            generalSettingsStep: {
                displayName: {
                    label: "Tên hiển thị",
                    placeholder: "Tên hiển thị phương thức xác thực",
                    validations: {
                        empty: "",
                        invalid: "Tên hiển thị không hợp lệ"
                    }
                },
                helpPanel: {
                    displayName: {
                        description: "Cung cấp một tên có ý nghĩa để hiển thị trên trang đăng nhập và trình chỉnh sửa luồng đăng nhập.",
                        header: "Tên hiển thị"
                    },
                    identifier: {
                        description: "Cung cấp một tên duy nhất để tham chiếu trong các script xác thực và " +
                        "tham số xác thực.",
                        header: "Định danh",
                        note: "Lưu ý rằng <1>custom-</1> sẽ được thêm làm tiền tố cho định danh.",
                        warning: "Trường này phải là duy nhất; sau khi tạo, nó không thể chỉnh sửa. "
                    }
                },
                identifier: {
                    hint: "Phải là chuỗi chỉ chứa chữ cái (a-z, A-Z) số (0-9), " +
                    "dấu gạch dưới (_) và dấu gạch ngang (-). ",
                    label: "Định danh",
                    placeholder: "authenticator-identifier",
                    validations: {
                        empty: "",
                        invalid: "Định danh không hợp lệ"
                    }
                },
                title: "Cài đặt chung"
            },
            subTitle: "Đăng ký dịch vụ xác thực được triển khai bên ngoài.",
            title: "Xác thực tùy chỉnh"
        },
        editPage: {
            generalTab: {
                iconUrl: {
                    hint: "URL hình ảnh của kết nối để hiển thị. Nếu không được cung cấp, một hình thu nhỏ được tạo" +
                    "sẽ được hiển thị. Kích thước khuyến nghị là 200x200 pixel."
                }
            }
        }
    },
    notifications: {
        addCustomAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Lỗi tạo"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi tạo phương thức xác thực tùy chỉnh.",
                message: "Lỗi tạo"
            },
            success: {
                description: "Đã tạo phương thức xác thực tùy chỉnh thành công.",
                message: "Tạo thành công"
            }
        },
        getCustomAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy phương thức xác thực tùy chỉnh.",
                message: "Lỗi lấy dữ liệu"
            }
        },
        updateCustomAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật phương thức xác thực tùy chỉnh.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật phương thức xác thực tùy chỉnh thành công.",
                message: "Cập nhật thành công"
            }
        }
    }
};
