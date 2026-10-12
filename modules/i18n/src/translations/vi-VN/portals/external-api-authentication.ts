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

import { ExternalAPIAuthenticationNS } from "../../../models/namespaces/external-api-authentication-ns";

export const externalApiAuthentication: ExternalAPIAuthenticationNS = {
    fields: {
        authentication: {
            info: {
                message: "Nếu bạn đang thay đổi xác thực, hãy lưu ý rằng các secret xác thực" +
                " của endpoint bên ngoài cần được cập nhật.",
                title: "Đã cấu hình cơ chế xác thực <strong>{{ authType }}</strong>."
            },
            label: "Xác thực",
            types: {
                apiKey: {
                    name: "API Key",
                    properties: {
                        header: {
                            label: "Tiêu đề",
                            placeholder: "Tiêu đề",
                            validations: {
                                empty: "Tiêu đề là trường bắt buộc."
                            }
                        },
                        value: {
                            label: "Giá trị",
                            placeholder: "Giá trị",
                            validations: {
                                empty: "Giá trị là trường bắt buộc."
                            }
                        }
                    }
                },
                basic: {
                    name: "Cơ bản",
                    properties: {
                        password: {
                            label: "Mật khẩu",
                            placeholder: "Mật khẩu",
                            validations: {
                                empty: "Mật khẩu là trường bắt buộc."
                            }
                        },
                        username: {
                            label: "Tên đăng nhập",
                            placeholder: "Tên đăng nhập",
                            validations: {
                                empty: "Tên đăng nhập là trường bắt buộc."
                            }
                        }
                    }
                },
                bearer: {
                    name: "Bearer Token",
                    properties: {
                        accessToken: {
                            label: "Access Token",
                            placeholder: "Access Token",
                            validations: {
                                empty: "Access token là trường bắt buộc."
                            }
                        }
                    }
                },
                clientCredential: {
                    name: "Client Credential",
                    properties: {
                        clientID: {
                            label: "Client ID",
                            placeholder: "Client ID",
                            validations: {
                                empty: "Client id là trường bắt buộc."
                            }
                        },
                        clientSecret: {
                            label: "Client Secret",
                            placeholder: "Client Secret",
                            validations: {
                                empty: "Client secret là trường bắt buộc."
                            }
                        },
                        scopes: {
                            label: "Phạm vi",
                            placeholder: "Phạm vi",
                            validations: {
                                empty: "Phạm vi là trường bắt buộc."
                            }
                        },
                        tokenEndpoint: {
                            label: "Token Endpoint",
                            placeholder: "Token Endpoint",
                            validations: {
                                empty: "Token endpoint là trường bắt buộc."
                            }
                        }
                    }
                },
                none: {
                    name: "Không có"
                },
                passwordCredential: {
                    name: "Password Credential",
                    properties: {
                        clientID: {
                            label: "Client ID",
                            placeholder: "Client ID",
                            validations: {
                                empty: "Client id là trường bắt buộc."
                            }
                        },
                        clientSecret: {
                            label: "Client Secret",
                            placeholder: "Client Secret",
                            validations: {
                                empty: "Client secret là trường bắt buộc."
                            }
                        },
                        password: {
                            label: "Mật khẩu",
                            placeholder: "Mật khẩu",
                            validations: {
                                empty: "Mật khẩu là trường bắt buộc."
                            }
                        },
                        scopes: {
                            label: "Phạm vi",
                            placeholder: "Phạm vi",
                            validations: {
                                empty: "Phạm vi là trường bắt buộc."
                            }
                        },
                        tokenEndpoint: {
                            label: "Token Endpoint",
                            placeholder: "Token Endpoint",
                            validations: {
                                empty: "Token endpoint là trường bắt buộc."
                            }
                        },
                        username: {
                            label: "Tên đăng nhập",
                            placeholder: "Tên đăng nhập",
                            validations: {
                                empty: "Tên đăng nhập là trường bắt buộc."
                            }
                        }
                    }
                }
            }
        },
        authenticationType: {
            hint: {
                create: "Sau khi thêm, các secret này sẽ không được hiển thị. Bạn chỉ có thể đặt lại chúng.",
                update: "Sau khi cập nhật, các secret này sẽ không được hiển thị. Bạn chỉ có thể đặt lại chúng."
            },
            label: "Xác thực",
            placeholder: "Chọn cơ chế xác thực",
            validations: {
                empty: "Cơ chế xác thực là trường bắt buộc."
            }
        },
        authenticationTypeDropdown: {
            authProperties: {
                accessToken: {
                    label: "Access Token",
                    placeholder: "Nhập access token",
                    validations: {
                        required: "Access token là trường bắt buộc."
                    }
                },
                clientID: {
                    label: "Client ID",
                    placeholder: "Client ID",
                    validations: {
                        required: "Client ID là trường bắt buộc."
                    }
                },
                clientSecret: {
                    label: "Client Secret",
                    placeholder: "Client Secret",
                    validations: {
                        required: "Client Secret là trường bắt buộc."
                    }
                },
                header: {
                    label: "Tên tiêu đề",
                    placeholder: "Nhập tên tiêu đề (ví dụ: X-API-Key)",
                    validations: {
                        required: "Tên tiêu đề là trường bắt buộc."
                    }
                },
                password: {
                    label: "Mật khẩu",
                    placeholder: "Mật khẩu",
                    validations: {
                        required: "Mật khẩu là trường bắt buộc."
                    }
                },
                scopes: {
                    label: "Phạm vi",
                    placeholder: "Phạm vi",
                    validations: {
                        required: "Phạm vi là trường bắt buộc."
                    }
                },
                tokenEndpoint: {
                    label: "Token Endpoint",
                    placeholder: "Token Endpoint",
                    validations: {
                        required: "Token Endpoint là trường bắt buộc."
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
                    label: "Giá trị API Key",
                    placeholder: "Nhập giá trị API key",
                    validations: {
                        required: "Giá trị API key là trường bắt buộc."
                    }
                }
            },
            hint: {
                create: "Sau khi thêm, các secret này sẽ không được hiển thị. Bạn chỉ có thể đặt lại chúng.",
                update: "Sau khi cập nhật, các secret này sẽ không được hiển thị. Bạn chỉ có thể đặt lại chúng một lần nữa."
            },
            label: "Cơ chế xác thực",
            placeholder: "Chọn cơ chế xác thực",
            title: "Xác thực",
            validations: {
                required: "Cơ chế xác thực là trường bắt buộc."
            }
        }
    },
    showPassword: {
        alert: {
            content: "Mật khẩu sẽ không còn hiển thị trên trang cấu hình kể từ ngày 15 tháng 6 năm 2025 trở đi." ,
            title: "Thông báo"
        }
    }
};
