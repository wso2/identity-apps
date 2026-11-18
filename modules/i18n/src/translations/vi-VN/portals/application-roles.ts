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

import { ApplicationRolesNS } from "../../../models";

export const applicationRoles: ApplicationRolesNS = {
    assign: "Gán",
    assignGroupWizard: {
        heading: "Gán nhóm",
        subHeading: "Gán nhóm cho vai trò ứng dụng."
    },
    authenticatorGroups: {
        goToConnections: "Đi đến Kết nối",
        groupsList: {
            assignGroups: "Gán nhóm",
            notifications: {
                fetchAssignedGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi lấy các nhóm được gán"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy các nhóm được gán.",
                        message: "Đã xảy ra lỗi"
                    }
                },
                updateAssignedGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi cập nhật các nhóm được gán"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật các nhóm được gán.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã cập nhật các nhóm được gán thành công.",
                        message: "Cập nhật thành công"
                    }
                }
            }
        },
        hint: "Khi gán nhóm bên ngoài cho một vai trò, hãy đảm bảo rằng kết nối được bật trong " +
            "<1>Kiểm soát phân giải vai trò nhóm bên ngoài</1> trong tab Vai trò của <3>Ứng dụng</3>.",
        placeholder: {
            subTitle: {
                0: "Hiện tại không có nhóm bên ngoài nào khả dụng.",
                1: "Bạn có thể thêm một nhóm bên ngoài mới bằng cách truy cập tab " +
                    "Nhóm trong một kết nối."
            },
            title: "Không có nhóm bên ngoài"
        }
    },
    connectorGroups: {
        placeholder: {
            subTitle: {
                0: "Hiện tại không có nhóm bên ngoài nào khả dụng.",
                1: "Xác định các nhóm bạn nhận được từ các kết nối bằng cách thêm một nhóm mới."
            },
            title: "Không có nhóm bên ngoài"
        }
    },
    heading: "Vai trò ứng dụng",
    roleGroups: {
        assignGroup: "Gán nhóm",
        confirmation: {
            deleteRole: {
                content: "Nếu bạn xóa nhóm này khỏi vai trò ứng dụng, các quyền " +
                    "gắn với vai trò này sẽ bị xóa khỏi nhóm. Vui lòng tiếp tục " +
                    "một cách thận trọng.",
                message: "Thao tác này không thể hoàn tác và sẽ xóa " +
                    "nhóm khỏi vai trò ứng dụng."
            }
        },
        notifications: {
            addGroups: {
                error: {
                    description: "Đã xảy ra lỗi khi thêm nhóm.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Nhóm đã được thêm thành công vào vai trò.",
                    message: "Thêm nhóm thành công"
                }
            },
            fetchGroups: {
                error: {
                    description: "Đã xảy ra lỗi khi lấy các nhóm.",
                    message: "Đã xảy ra lỗi"
                }
            }
        },
        placeholder: {
            subTitle: {
                0: "Không có nhóm nào được gán cho vai trò này.",
                1: "Để gán một nhóm, nhấn vào nút Gán nhóm."
            },
            title: "Không có nhóm nào được gán"
        },
        searchGroup: "Tìm kiếm nhóm"
    },
    roleList: {
        placeholder: {
            subTitle: {
                0: "Hiện tại không có vai trò ứng dụng nào khả dụng.",
                1: "Bạn có thể thêm một vai trò ứng dụng mới bằng cách truy cập tab " +
                    "Vai trò trong một Ứng dụng."
            },
            title: "Không có vai trò ứng dụng"
        }
    },
    roleMapping: {
        heading: "Kiểm soát phân giải vai trò nhóm bên ngoài",
        notifications: {
            sharedApplication: {
                error: {
                    description: "Đã xảy ra lỗi khi lấy các ứng dụng được chia sẻ.",
                    message: "Đã xảy ra lỗi"
                }
            },
            updateRole: {
                error: {
                    description: "{{description}}",
                    message: "Lỗi khi cập nhật vai trò"
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi cập nhật vai trò.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Đã cập nhật vai trò thành công.",
                    message: "Cập nhật thành công"
                }
            }
        },
        subHeading: "Bật hoặc tắt phân giải vai trò ứng dụng từ các nhóm bên ngoài trong luồng xác thực"
    },
    roles: {
        goBackToRoles: "Quay lại Vai trò",
        heading: "Vai trò",
        orgRoles: {
            heading: "Vai trò tổ chức",
            subHeading: "Quản lý vai trò tổ chức tại đây."
        },
        subHeading: "Quản lý vai trò và quyền."
    },
    searchApplication: "Tìm kiếm ứng dụng",
    subHeading: "Xem và gán nhóm cho các vai trò ứng dụng của bạn."
};
