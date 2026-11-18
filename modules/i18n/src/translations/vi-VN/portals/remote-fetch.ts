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
import { remoteFetchNS } from "../../../models";

export const remoteFetch: remoteFetchNS = {
    components: {
        status: {
            details: "Chi tiết",
            header: "Cấu hình từ xa",
            hint: "Hiện tại không có ứng dụng nào được triển khai.",
            linkPopup: {
                content: "",
                header: "URL kho lưu trữ Github",
                subHeader: ""
            },
            refetch: "Tải lại"
        }
    },
    forms: {
        getRemoteFetchForm: {
            actions: {
                remove: "Xóa cấu hình",
                save: "Lưu cấu hình"
            },
            fields: {
                accessToken: {
                    label: "Github Personal Access Token",
                    placeholder: "Personal Access Token"
                },
                connectivity: {
                    children: {
                        polling: {
                            label: "Polling"
                        },
                        webhook: {
                            label: "Webhook"
                        }
                    },
                    label: "Cơ chế kết nối"
                },
                enable: {
                    hint: "Bật cấu hình để lấy ứng dụng",
                    label: "Bật cấu hình lấy dữ liệu"
                },
                gitBranch: {
                    hint: "Bật cấu hình để lấy ứng dụng",
                    label: "Nhánh Github",
                    placeholder: "Ví dụ: Main",
                    validations: {
                        required: "Cần có nhánh Github."
                    }
                },
                gitFolder: {
                    hint: "Bật cấu hình để lấy ứng dụng",
                    label: "Thư mục GitHub",
                    placeholder: "Ví dụ: SampleConfigFolder/",
                    validations: {
                        required: "Cần có thư mục cấu hình Github."
                    }
                },
                gitURL: {
                    label: "URL kho lưu trữ GitHub",
                    placeholder: "Ví dụ: https://github.com/samplerepo/sample-project",
                    validations: {
                        required: "Cần có URL kho lưu trữ Github."
                    }
                },
                pollingFrequency: {
                    label: "Tần suất polling"
                },
                sharedKey: {
                    label: "Khóa chia sẻ GitHub"
                },
                username: {
                    label: "Tên đăng nhập Github",
                    placeholder: "Ví dụ: John Doe"
                }
            },
            heading: {
                subTitle: "Cấu hình kho lưu trữ để lấy ứng dụng",
                title: "Kho lưu trữ cấu hình ứng dụng"
            }
        }
    },
    modal: {
        appStatusModal: {
            description: "",
            heading: "Trạng thái lấy ứng dụng",
            primaryButton: "Tải lại ứng dụng",
            secondaryButton: ""
        }
    },
    notifications: {
        createRepoConfig: {
            error: {
                description: "{{ description }}",
                message: "Lỗi tạo"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi tạo cấu hình kho từ xa.",
                message: "Lỗi tạo"
            },
            success: {
                description: "Đã tạo cấu hình kho từ xa thành công.",
                message: "Tạo thành công"
            }
        },
        deleteRepoConfig: {
            error: {
                description: "{{ description }}",
                message: "Lỗi xóa"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi xóa cấu hình kho từ xa.",
                message: "Lỗi xóa"
            },
            success: {
                description: "Đã xóa cấu hình kho từ xa thành công.",
                message: "Xóa thành công"
            }
        },
        getConfigDeploymentDetails: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy chi tiết triển khai.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "Đã lấy chi tiết triển khai thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        getConfigList: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy danh sách cấu hình triển khai.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "Đã lấy danh sách cấu hình triển khai thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        getRemoteRepoConfig: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy cấu hình kho lưu trữ.",
                message: "Lỗi lấy dữ liệu"
            },
            success: {
                description: "Đã lấy cấu hình kho lưu trữ thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        triggerConfigDeployment: {
            error: {
                description: "{{ description }}",
                message: "Lỗi triển khai"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi triển khai cấu hình kho lưu trữ.",
                message: "Lỗi triển khai"
            },
            success: {
                description: "Đã triển khai cấu hình kho lưu trữ thành công.",
                message: "Triển khai thành công"
            }
        }
    },
    pages: {
        listing: {
            subTitle: "Cấu hình kho lưu trữ github để hoạt động liền mạch với identity server.",
            title: "Cấu hình từ xa"
        }
    },
    placeholders: {
        emptyListPlaceholder: {
            action: "Cấu hình kho lưu trữ",
            subtitles: "Hiện tại không có kho lưu trữ nào được cấu hình. Bạn có thể thêm cấu hình mới.",
            title: "Thêm cấu hình"
        }
    }
};
