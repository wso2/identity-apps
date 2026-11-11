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

import { RemoteUserStoresNS } from "../../../models/namespaces/remote-user-stores-ns";

export const remoteUserStores: RemoteUserStoresNS = {
    form: {
        fields: {
            accessType: {
                label: "Loại truy cập",
                placeholder: "Chọn loại truy cập",
                validation: {
                    required: "Cần có loại truy cập"
                }
            },
            attributes: {
                validation: {
                    required: "Cần có ánh xạ thuộc tính"
                }
            },
            connectedUserStoreType: {
                label: "Loại kho người dùng từ xa",
                placeholder: "Chọn loại kho người dùng từ xa",
                validation: {
                    required: "Cần có loại kho người dùng"
                }
            },
            description: {
                label: "Mô tả",
                placeholder: "Mô tả mục đích hoặc phạm vi của kho người dùng này"
            },
            groupIdMapping: {
                helperText: "Chỉ định thuộc tính từ kho người dùng lưu ID nhóm.",
                label: "ID nhóm",
                placeholder: "ví dụ: groupId",
                validation: {
                    readGroupsEnabled: "Cần có ánh xạ ID nhóm khi tính năng đọc nhóm được bật",
                    required: "Cần có ánh xạ ID nhóm"
                }
            },
            groupnameMapping: {
                helperText: "Chỉ định thuộc tính từ kho người dùng lưu tên nhóm.",
                label: "Tên nhóm",
                placeholder: "ví dụ: groupName",
                validation: {
                    readGroupsEnabled: "Cần có ánh xạ tên nhóm khi tính năng đọc nhóm được bật",
                    required: "Cần có ánh xạ tên nhóm"
                }
            },
            name: {
                label: "Tên kho người dùng",
                placeholder: "KHO NGƯỜI DÙNG CỦA TÔI",
                validation: {
                    required: "Cần có tên kho người dùng"
                }
            },
            readGroups: {
                helperText: "Bật tùy chọn này để lấy thông tin nhóm từ kho người dùng.",
                label: "Đọc nhóm"
            },
            userIdMapping: {
                helperText: "Chỉ định thuộc tính từ kho người dùng đại diện cho ID duy nhất của người dùng.",
                label: "Ánh xạ ID người dùng",
                placeholder: "ví dụ: uid",
                validation: {
                    required: "Cần có ánh xạ ID người dùng"
                }
            },
            usernameMapping: {
                helperText: "Chỉ định thuộc tính từ kho người dùng đại diện cho định danh chính của người dùng.",
                label: "Ánh xạ tên đăng nhập",
                placeholder: "ví dụ: un",
                validation: {
                    required: "Cần có ánh xạ tên đăng nhập"
                }
            }
        },
        sections: {
            groupAttributes: "Thuộc tính nhóm",
            userAttributes: "Thuộc tính người dùng"
        }
    },
    notifications: {
        checkSumError: {
            description: "Đã xảy ra lỗi khi lấy thông tin kiểm tra hợp lệ.",
            message: "Đã xảy ra lỗi!"
        },
        connectionStatusCheckError: {
            description: "Đã xảy ra lỗi khi kiểm tra trạng thái kết nối.",
            message: "Đã xảy ra lỗi!"
        },
        disconnectError: {
            description: "Đã xảy ra lỗi khi ngắt kết nối kho người dùng.",
            message: "Ngắt kết nối thất bại!"
        },
        tokenCountExceededError: {
            description: "Bạn đã đạt số lượng token tối đa được phép.",
            message: "Tạo token thất bại!"
        },
        tokenGenerateError: {
            description: "Đã xảy ra lỗi khi tạo token cài đặt.",
            message: "Tạo token thất bại!"
        },
        typeFetchError: {
            description: "Đã xảy ra lỗi khi lấy các loại kho người dùng.",
            message: "Đã xảy ra lỗi!"
        }
    },
    pages: {
        create: {
            backButton: "Quay lại kho người dùng",
            description: "Onboarding người dùng trong kho người dùng từ xa của bạn vào {{ productName }}.",
            message: {
                classic:
                    "Nếu yêu cầu của bạn chỉ là xác thực, chúng tôi khuyến nghị sử dụng <1>Kết nối kho người dùng tối ưu</1> để đạt hiệu quả.",
                optimized:
                    "Cấu hình này chỉ hỗ trợ Xác thực và lấy thuộc tính người dùng. Các tính năng quản lý người dùng và nhóm không khả dụng trong thiết lập này. Nếu quản lý người dùng là yêu cầu thiết yếu, vui lòng dùng <1>Kết nối kho người dùng cổ điển</1> thay thế."
            },
            notifications: {
                createUserStore: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi tạo kho người dùng.",
                        message: "Đã xảy ra lỗi!"
                    },
                    success: {
                        description: "Kho người dùng đã được thêm thành công!",
                        message: "Thêm kho người dùng thành công!"
                    }
                }
            },
            stepper: {
                step1: {
                    description: "Cung cấp thông tin cơ bản để nhận diện và kết nối kho người dùng của bạn.",
                    title: "Chi tiết chung"
                },
                step2: {
                    description:
                        "Hoàn thành các cài đặt cần thiết để tích hợp kho người dùng đã kết nối của bạn, cho phép người dùng truy cập ứng dụng một cách liền mạch.",
                    title: "Cấu hình"
                }
            },
            title: "Tạo kho người dùng"
        },
        edit: {
            configurations: {
                attributes: {
                    custom: {
                        emptyPlaceholder: {
                            description: "Không có thuộc tính tùy chỉnh nào được tạo trong hệ thống.",
                            heading: "Không có thuộc tính tùy chỉnh"
                        },
                        heading: "Thuộc tính tùy chỉnh"
                    },
                    heading: "Ánh xạ thuộc tính",
                    local: {
                        heading: "Thuộc tính cục bộ"
                    }
                },
                groupAttributes: {
                    heading: "Thuộc tính nhóm"
                },
                userAttributes: {
                    heading: "Thuộc tính người dùng"
                }
            },
            generalSettings: {
                connections: {
                    actions: {
                        disconnect: "Ngắt kết nối",
                        generate: "Tạo token",
                        regenerate: "Tạo lại token"
                    },
                    emptyPlaceholder: {
                        description1: "Không có kết nối agent kho người dùng nào.",
                        description2: "Vui lòng làm theo hướng dẫn thiết lập để cấu hình (các) agent kho người dùng.",
                        heading: "Không có kết nối agent kho người dùng"
                    },
                    heading: "Kết nối agent kho người dùng"
                }
            },
            guide: {
                heading: "Kết nối kho người dùng từ xa",
                steps: {
                    attributeMapping: {
                        description:
                            "Cập nhật <1>ánh xạ thuộc tính</1> để khớp với kho người dùng từ xa đã kết nối. Vui lòng xem xét kỹ các thuộc tính đã ánh xạ để tránh lỗi khi lấy người dùng từ kho người dùng.",
                        heading: "Ánh xạ thuộc tính"
                    },
                    configure: {
                        description:
                            "Cập nhật các thuộc tính trong tệp deployment.toml nằm trong thư mục gốc của agent kho người dùng để khớp với cài đặt kho người dùng từ xa. Thêm các thuộc tính bổ sung theo yêu cầu của bạn.",
                        docsDescription:
                            "Xem <1>tài liệu Asgardeo</1> để biết thêm chi tiết về cấu hình agent kho người dùng.",
                        heading: "Cấu hình agent"
                    },
                    download: {
                        heading: "Tải agent",
                        onPrem: {
                            action: "Tải agent",
                            description: "Tải xuống và giải nén agent kho người dùng."
                        },
                        remote: {
                            description: "Chọn nền tảng của bạn và tải agent kho người dùng tương ứng:",
                            verification: {
                                description: "Làm theo các bước bên dưới để xác minh tệp đã tải bằng checksum SHA256.",
                                heading: "Xác minh tệp đã tải",
                                step1: "Thực thi lệnh sau trong dòng lệnh. Thay <1>FILE_PATH</1> bằng đường dẫn của tệp zip agent đã tải.",
                                step2: "So sánh checksum được tạo với checksum được cung cấp bên dưới."
                            }
                        }
                    },
                    run: {
                        checkConnection: {
                            action: "Kiểm tra kết nối",
                            errorAction: "Thử lại",
                            errorHeading: "Chưa kết nối",
                            errorMessage:
                                "Kho người dùng chưa được kết nối, vui lòng đảm bảo rằng bạn đã làm theo tất cả các bước của hướng dẫn thiết lập một cách đúng đắn.",
                            successAction: "Kết nối thành công"
                        },
                        commands: {
                            unix: "Trên Linux/Mac OS",
                            windows: "Trên Windows"
                        },
                        description: {
                            onPrem:
                                "Thực thi một trong các lệnh sau dựa trên hệ điều hành của bạn. Nhập token cài đặt khi được nhắc.",
                            remote: "Thực thi một trong các lệnh sau dựa trên hệ điều hành của bạn."
                        },
                        heading: "Chạy agent",
                        successMessage: {
                            onPrem:
                                "Sau khi agent kho người dùng được kết nối thành công, thông báo <3>Agent đã kết nối thành công với {{productName}}</3> sẽ được hiển thị trong terminal.",
                            remote:
                                "Sau khi agent kho người dùng được kết nối thành công, thông báo <3>Đã kết nối thành công với máy chủ</3> sẽ được hiển thị trong terminal."
                        }
                    },
                    token: {
                        action: "Tạo token",
                        description:
                            "Tạo một token cài đặt mới sẽ cần thiết khi bạn cố kết nối kho người dùng từ xa của mình thông qua agent kho người dùng.",
                        generatedToken: {
                            label: "Token cài đặt",
                            message:
                                "Hãy đảm bảo ghi lại token cài đặt vì nó sẽ cần thiết khi chạy agent kho người dùng. Bạn sẽ không thể thấy lại nó!"
                        },
                        heading: "Tạo token"
                    }
                },
                subHeading:
                    "Làm theo các bước bên dưới để cấu hình agent kho người dùng, agent này kết nối kho người dùng từ xa với Asgardeo"
            },
            tabs: {
                configurations: "Cấu hình",
                general: "Chung",
                guide: "Hướng dẫn thiết lập"
            }
        }
    }
};
