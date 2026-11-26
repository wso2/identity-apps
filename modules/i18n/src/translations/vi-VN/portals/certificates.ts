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

import { CertificatesNS } from "../../../models";

export const certificates: CertificatesNS = {
    keystore: {
        advancedSearch: {
            error: "Định dạng truy vấn lọc không đúng",
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: "Ví dụ: alias, v.v."
                    },
                    filterCondition: {
                        placeholder: "Ví dụ: Starts with, v.v."
                    },
                    filterValue: {
                        placeholder: "Ví dụ: wso2carbon, v.v."
                    }
                }
            },
            placeholder: "Tìm kiếm theo alias"
        },
        attributes: {
            alias: "Alias"
        },
        certificateModalHeader: "Xem chứng chỉ",
        certificateViewValidation: "Chúng tôi không thể đọc chứng chỉ này. Hiện tại chúng tôi chỉ hỗ trợ hiển thị thông tin khóa công khai trong các loại chứng chỉ có thuật toán khóa {algorithms}. Hỗ trợ cho thuật toán khóa <strong>Elliptic Curve Cryptography</strong>&nbsp; sẽ sớm được bật.",
        confirmation: {
            content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn chứng chỉ.",
            header: "Bạn có chắc không?",
            hint: "Vui lòng nhập <1>{{id}}</1> để xác nhận.",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn chứng chỉ.",
            primaryAction: "Xác nhận",
            tenantContent: "Thao tác này sẽ xóa vĩnh viễn chứng chỉ tenant."
                + "Sau khi xóa, trừ khi bạn nhập một chứng chỉ tenant mới,"
                + "bạn sẽ không thể truy cập các ứng dụng cổng."
                + "Để tiếp tục xóa, hãy nhập alias của chứng chỉ và nhấn xóa."
        },
        errorCertificate: "Đã xảy ra lỗi khi giải mã chứng chỉ."
            + " Vui lòng đảm bảo chứng chỉ hợp lệ.",
        errorEmpty: "Hãy thêm một tệp chứng chỉ hoặc dán nội dung của một chứng chỉ mã hóa PEM.",
        forms: {
            alias: {
                label: "Alias",
                placeholder: "Nhập một alias",
                requiredErrorMessage: "Cần có alias"
            }
        },
        list: {
            columns: {
                actions: "Hành động",
                name: "Tên"
            }
        },
        notifications: {
            addCertificate:{
                genericError: {
                    description: "Đã xảy ra lỗi khi nhập chứng chỉ.",
                    message: "Đã xảy ra lỗi!"
                },
                success: {
                    description: "Chứng chỉ đã được nhập thành công.",
                    message: "Nhập chứng chỉ thành công"
                }
            },
            deleteCertificate: {
                genericError: {
                    description: "Đã xảy ra lỗi khi xóa chứng chỉ.",
                    message: "Đã xảy ra lỗi!"
                },
                success: {
                    description: "Chứng chỉ đã được xóa thành công.",
                    message: "Xóa chứng chỉ thành công"
                }
            },
            download: {
                success: {
                    description: "Chứng chỉ đã bắt đầu tải xuống.",
                    message: "Đã bắt đầu tải chứng chỉ"
                }
            },
            getAlias: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy chứng chỉ.",
                    message: "Đã xảy ra lỗi"
                }
            },
            getCertificate: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy "
                        + "chứng chỉ",
                    message: "Đã xảy ra lỗi!"
                }
            },
            getCertificates: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy các chứng chỉ.",
                    message: "Đã xảy ra lỗi"
                }
            },
            getPublicCertificate: {
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy chứng chỉ của tổ chức.",
                    message: "Đã xảy ra lỗi!"
                }
            }
        },
        pageLayout: {
            description: "Quản lý các chứng chỉ trong keystore.",
            primaryAction: "Nhập chứng chỉ",
            title: "Chứng chỉ"
        },
        placeholders: {
            emptyList: {
                action: "Nhập chứng chỉ",
                subtitle: "Hiện tại không có chứng chỉ nào khả dụng."
                    + "Bạn có thể nhập một chứng chỉ mới bằng cách nhấn vào"
                    + "nút bên dưới.",
                title: "Nhập chứng chỉ"
            },
            emptySearch: {
                action: "Xóa truy vấn tìm kiếm",
                subtitle: "Chúng tôi không thể tìm thấy kết quả nào cho {{searchQuery}}."
                    + "Vui lòng thử một từ khóa tìm kiếm khác.",
                title: "Không tìm thấy kết quả"
            }
        },
        serial : "Số sê-ri:",
        summary: {
            issuerDN: "DN nhà phát hành",
            sn: "Số sê-ri:",
            subjectDN: "DN chủ thể",
            validFrom: "Không hợp lệ trước",
            validTill: "Không hợp lệ sau",
            version: "Phiên bản"
        },
        wizard: {
            dropZone: {
                action: "Tải lên chứng chỉ",
                description: "Kéo và thả tệp chứng chỉ vào đây."
            },
            header: "Nhập chứng chỉ",
            panes: {
                paste: "Dán",
                upload: "Tải lên"
            },
            pastePlaceholder: "Dán nội dung của chứng chỉ PEM",
            steps: {
                summary: "Tóm tắt",
                upload: "Tải lên chứng chỉ"
            }
        }
    },
    truststore: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: "Ví dụ: alias, certificate, v.v."
                    },
                    filterCondition: {
                        placeholder: "Ví dụ: Starts with, v.v."
                    },
                    filterValue: {
                        placeholder: "Ví dụ: wso2carbon, v.v."
                    }
                }
            },
            placeholder: "Tìm kiếm theo tên nhóm"
        }
    }
};
