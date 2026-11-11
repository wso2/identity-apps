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
import { oidcScopesNS } from "../../../models";

export const oidcScopes: oidcScopesNS = {
    addAttributes: {
        description: "Chọn những thuộc tính người dùng bạn muốn liên kết với phạm vi {{name}}."
    },
    back: "Quay lại Ánh xạ thuộc tính OpenID Connect",
    buttons: {
        addScope: "Phạm vi OIDC mới"
    },
    confirmationModals: {
        deleteClaim: {
            assertionHint: "Vui lòng nhập <1>{{ name }}</1> để xác nhận.",
            content: "Nếu bạn xóa claim này, bạn sẽ không thể khôi phục lại." +
                "Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn claim OIDC."
        },
        deleteScope: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn xóa phạm vi này, bạn sẽ không thể khôi phục lại. " +
                "Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn phạm vi OIDC."
        }
    },
    editScope: {
        claimList: {
            addClaim:  "Thuộc tính mới",
            emptyPlaceholder: {
                action: "Thêm thuộc tính",
                subtitles: {
                    0: "Không có thuộc tính nào được thêm cho phạm vi OIDC này.",
                    1: "Vui lòng thêm các thuộc tính cần thiết để xem chúng tại đây."
                },
                title: "Không có thuộc tính OIDC"
            },
            emptySearch: {
                action: "Xem tất cả",
                subtitles: {
                    0: "Chúng tôi không thể tìm thấy thuộc tính bạn đã tìm kiếm.",
                    1: "Vui lòng thử một tên khác."
                },
                title: "Không tìm thấy kết quả"
            },
            popupDelete: "Xóa thuộc tính",
            searchClaims: "tìm kiếm thuộc tính",
            subTitle: "Thêm hoặc xóa thuộc tính của một phạm vi OIDC",
            title: "{{ name }}"
        }
    },
    forms: {
        addScopeForm: {
            inputs: {
                description: {
                    label: "Mô tả",
                    placeholder: "Nhập mô tả cho phạm vi"
                },
                displayName: {
                    label: "Tên hiển thị",
                    placeholder: "Nhập tên hiển thị",
                    validations: {
                        empty: "Trường này không được để trống"
                    }
                },
                scopeName: {
                    label: "Phạm vi",
                    placeholder: "Nhập phạm vi",
                    validations: {
                        duplicate: "Phạm vi này đã tồn tại.",
                        empty: "Trường này không được để trống.",
                        invalid: "Phạm vi chỉ có thể chứa ký tự chữ và số và _. " +
                        "Và phải có độ dài từ 3 đến 40 ký tự."
                    }
                }
            }
        }
    },
    list: {
        columns: {
            actions: "Hành động",
            name: "Tên"
        },
        empty: {
            action: "Thêm phạm vi OIDC",
            subtitles: {
                0: "Không có phạm vi OIDC nào trong hệ thống.",
                1: "Vui lòng thêm phạm vi OIDC mới để xem chúng tại đây."
            },
            title: "Không có phạm vi OIDC"
        },
        searchPlaceholder: "Tìm kiếm theo phạm vi"
    },
    manageAttributes: "Quản lý thuộc tính",
    notifications: {
        addOIDCClaim: {
            error: {
                description: "{{description}}",
                message: "Lỗi tạo"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi thêm thuộc tính OIDC.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã thêm thuộc tính OIDC mới thành công.",
                message: "Tạo thành công"
            }
        },
        addOIDCScope: {
            error: {
                description: "{{description}}",
                message: "Lỗi tạo"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi tạo phạm vi OIDC.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã tạo phạm vi OIDC mới thành công.",
                message: "Tạo thành công"
            }
        },
        claimsMandatory: {
            error: {
                description: "Để thêm một phạm vi, bạn cần đảm bảo rằng phạm vi " +
                    "có ít nhất một thuộc tính.",
                message: "Bạn cần chọn ít nhất một thuộc tính."
            }
        },
        deleteOIDCScope: {
            error: {
                description: "{{description}}",
                message: "Lỗi xóa"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi xóa phạm vi OIDC.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã xóa phạm vi OIDC thành công.",
                message: "Xóa thành công"
            }
        },
        deleteOIDClaim: {
            error: {
                description: "{{description}}",
                message: "Lỗi xóa"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi xóa thuộc tính OIDC.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã xóa thuộc tính OIDC thành công.",
                message: "Xóa thành công"
            }
        },
        fetchOIDCScope: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy chi tiết phạm vi OIDC.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy chi tiết phạm vi OIDC thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        fetchOIDCScopes: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy các phạm vi OIDC.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy danh sách phạm vi OIDC thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        fetchOIDClaims: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy các thuộc tính OIDC.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy danh sách phạm vi OIDC thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        updateOIDCScope: {
            error: {
                description: "{{description}}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật phạm vi OIDC.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật phạm vi OIDC {{ scope }} thành công.",
                message: "Cập nhật thành công"
            }
        }
    },
    placeholders:{
        emptyList: {
            action: "Phạm vi OIDC mới",
            subtitles: {
                0: "Hiện tại không có phạm vi OIDC nào.",
                1: "Bạn có thể thêm phạm vi OIDC mới một cách dễ dàng bằng cách làm theo",
                2: "các bước trong trình hướng dẫn tạo."
            },
            title: "Thêm một phạm vi OIDC mới"
        },
        emptySearch: {
            action: "Xóa truy vấn tìm kiếm",
            subtitles: {
                0: "Chúng tôi không thể tìm thấy phạm vi bạn đã tìm kiếm.",
                1: "Vui lòng thử một tên khác."
            },
            title: "Không tìm thấy kết quả"
        }
    },
    updateScope: "Cập nhật phạm vi",
    viewAttributes: "Xem thuộc tính",
    viewScope: "Xem phạm vi",
    wizards: {
        addScopeWizard: {
            buttons: {
                next: "Tiếp theo",
                previous: "Trước"
            },
            claimList: {
                searchPlaceholder: "Tìm kiếm thuộc tính",
                table: {
                    emptyPlaceholders: {
                        assigned: "Tất cả thuộc tính khả dụng đã được gán cho phạm vi OIDC này.",
                        unAssigned: "Không có thuộc tính nào được gán cho phạm vi OIDC này."
                    },
                    header: "Thuộc tính"
                }
            },
            steps: {
                basicDetails: "Chi tiết cơ bản",
                claims: "Thêm thuộc tính"
            },
            subTitle: "Tạo một phạm vi OpenID Connect (OIDC) mới với các thuộc tính cần thiết",
            title: "Tạo phạm vi OpenID Connect"
        }
    }
};
