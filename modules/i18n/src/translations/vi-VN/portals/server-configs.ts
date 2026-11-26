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
import { serverConfigsNS } from "../../../models";

/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const serverConfigs: serverConfigsNS = {
    adminAdvisory: {
        configurationEditSection: {
            backButtonLabel: "Quay lại Banner tư vấn quản trị",
            pageHeading: "Banner tư vấn quản trị",
            pageSubheading: "Cấu hình và tùy chỉnh banner tư vấn quản trị hiển thị trên trang đăng nhập.",
            form: {
                bannerContent: {
                    label: "Nội dung banner",
                    hint: "Đây là nội dung sẽ được hiển thị trong banner trên trang đăng nhập.",
                    placeholder: "Cảnh báo - nghiêm cấm sử dụng trái phép công cụ này."
                }
            }
        },
        configurationSection: {
            disabled: "Đã vô hiệu hóa",
            description: "Bật và cấu hình banner tư vấn quản trị.",
            enabled: "Đã bật",
            heading: "Banner tư vấn quản trị"
        },
        notifications: {
            disbleAdminAdvisoryBanner: {
                error: {
                    description: "{{ description }}",
                    message: "Lỗi khi vô hiệu hóa banner tư vấn quản trị."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi vô hiệu hóa banner tư vấn quản trị.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Đã vô hiệu hóa banner tư vấn quản trị thành công.",
                    message: "Đã vô hiệu hóa banner tư vấn quản trị"
                }
            },
            enableAdminAdvisoryBanner: {
                error: {
                    description: "{{ description }}",
                    message: "Lỗi khi bật banner tư vấn quản trị."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi bật banner tư vấn quản trị.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Đã bật banner tư vấn quản trị thành công.",
                    message: "Đã bật banner tư vấn quản trị"
                }
            },
            getConfigurations: {
                error: {
                    description: "{{ description }}",
                    message: "Lỗi khi lấy cấu hình banner tư vấn quản trị."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy cấu hình banner tư vấn quản trị.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "",
                    message: ""
                }
            },
            updateConfigurations: {
                error: {
                    description: "{{ description }}",
                    message: "Lỗi khi cập nhật cấu hình banner tư vấn quản trị."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi cập nhật cấu hình banner tư vấn quản trị.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Đã cập nhật cấu hình banner tư vấn quản trị thành công.",
                    message: "Cập nhật banner thành công"
                }
            }
        },
        pageHeading: "Banner tư vấn quản trị",
        pageSubheading: "Cấu hình banner tư vấn quản trị hiển thị trên trang đăng nhập.",
        title: "Banner tư vấn quản trị"
    },
    remoteLogPublishing: {
        title: "Xuất bản log từ xa",
        pageTitle: "Xuất bản log từ xa",
        description: "Cấu hình cài đặt ghi log từ xa cho log kiểm toán trong tổ chức.",
        fields: {
            logTypes: {
                label: "Các loại log sẽ được xuất bản",
                values: {
                    carbonLogs: "Log Carbon",
                    auditLogs: "Log kiểm toán",
                    allLogs: "Tất cả log"
                }
            },
            remoteURL: {
                label: "URL đích"
            },
            advanced: {
                title: "Cài đặt nâng cao",
                connectionTimeout: {
                    label: "Thời gian chờ kết nối (ms)"
                },
                verifyHostname: {
                    label: "Xác minh tên máy chủ"
                },
                basicAuthConfig: {
                    title: "Cấu hình xác thực cơ bản",
                    serverUsername: {
                        label: "Tên đăng nhập máy chủ từ xa"
                    },
                    serverPassword: {
                        label: "Mật khẩu máy chủ từ xa"
                    }
                },
                sslConfig: {
                    title: "Cấu hình SSL",
                    keystorePath: {
                        label: "Vị trí keystore"
                    },
                    keystorePassword: {
                        label: "Mật khẩu keystore"
                    },
                    truststorePath: {
                        label: "Vị trí truststore"
                    },
                    truststorePassword: {
                        label: "Mật khẩu truststore"
                    }
                }
            }
        },
        dangerZone: {
            button: "Khôi phục",
            title: "Khôi phục cấu hình mặc định",
            header: "Khôi phục cấu hình mặc định",
            subheader: "Thao tác này sẽ xóa cấu hình hiện có cho log {{logType}}. Vui lòng chắc chắn trước khi tiếp tục.",
            confirmation: {
                hint: "Vui lòng xác nhận thao tác của bạn.",
                header: "Bạn có chắc không?",
                message: "Nếu bạn khôi phục cấu hình mặc định, việc xuất bản log từ xa cho log {{logType}} có thể không hoạt động đúng. " +
                "Vui lòng tiếp tục một cách thận trọng.",
                content: "Thao tác này sẽ khôi phục cấu hình xuất bản log mặc định cho log {{logType}}."
            }
        },
        notification: {
            success: {
                description: "Cập nhật cấu hình xuất bản log từ xa thành công.",
                message: "Cập nhật thành công."
            },
            error: {
                updateError: {
                    description: "Đã xảy ra lỗi khi cập nhật cấu hình xuất bản log từ xa.",
                    message: "Đã xảy ra lỗi"
                },
                fetchError: {
                    description: "Đã xảy ra lỗi khi lấy cấu hình xuất bản log từ xa.",
                    message: "Không thể lấy cấu hình xuất bản log từ xa."
                }
            }
        }
    },
    realmConfiguration: {
        actionTitles: {
            config: "Thêm"
        },
        confirmation: {
            heading: "Xác nhận",
            message: "Bạn có muốn lưu các cấu hình liên quan đến realm không?"
        },
        description: "Cấu hình các cài đặt cơ bản liên quan đến realm.",
        form: {
            homeRealmIdentifiers: {
                hint: "Nhập định danh home realm. Cho phép nhiều định danh.",
                label: "Các định danh home realm",
                placeholder: "localhost"
            },
            idleSessionTimeoutPeriod: {
                hint: "Nhập thời gian chờ phiên không hoạt động tính bằng phút",
                label: "Thời gian chờ phiên không hoạt động"
            },
            rememberMePeriod: {
                hint: "Nhập khoảng thời gian ghi nhớ đăng nhập tính bằng phút",
                label: "Khoảng thời gian ghi nhớ đăng nhập"
            }
        },
        heading: "Cấu hình realm",
        notifications: {
            emptyHomeRealmIdentifiers: {
                error: {
                    description: "Bạn phải khai báo ít nhất một định danh home realm.",
                    message: "Lỗi xác thực dữ liệu"
                },
                genericError: {
                    description: "",
                    message: ""
                },
                success: {
                    description: "",
                    message: ""
                }
            },
            getConfigurations: {
                error: {
                    description: "{{ description }}",
                    message: "Lỗi lấy dữ liệu"
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy cấu hình realm.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "",
                    message: ""
                }
            },
            updateConfigurations: {
                error: {
                    description: "{{ description }}",
                    message: "Lỗi cập nhật"
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi cập nhật cấu hình realm.",
                    message: "Lỗi cập nhật"
                },
                success: {
                    description: "Đã cập nhật cấu hình realm thành công.",
                    message: "Cập nhật thành công"
                }
            }
        }
    },
    server: {
        title: "Máy chủ",
        description: "Cấu hình cài đặt máy chủ."
    }
};
