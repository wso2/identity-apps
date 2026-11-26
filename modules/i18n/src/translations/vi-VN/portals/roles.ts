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
import { rolesNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */

export const roles: rolesNS = {
    addRoleWizard: {
        agents: {
            assignAgentModal: {
                heading: "Gán agent",
                hint: "Chọn agent để gán chúng vào vai trò",
                list: {
                    listHeader: "Tên",
                    searchPlaceholder: "Tìm kiếm agent"
                },
                search: "Tìm kiếm agent theo tên hoặc ID",
                subHeading: "Gán agent mới vào vai trò."
            }
        },
        back: "Quay lại",
        buttons: {
            finish: "Hoàn tất",
            next: "Tiếp theo",
            previous: "Trước"
        },
        forms: {
            roleBasicDetails: {
                assignedApplication: {
                    applicationSubTitle: {
                        application: "Hỗ trợ vai trò theo phạm vi ứng dụng.",
                        changeAudience: "Thay đổi đối tượng",
                        organization: "Hỗ trợ vai trò theo phạm vi tổ chức. "
                    },
                    hint: "Gán một ứng dụng cho vai trò. Lưu ý rằng ứng dụng được gán cho vai trò này không thể chỉnh sửa sau khi vai trò được tạo.",
                    label: "Ứng dụng được gán",
                    note: "Lưu ý rằng ứng dụng được gán cho vai trò này không thể chỉnh sửa sau khi vai trò được tạo.",
                    placeholder: "Chọn ứng dụng để gán vai trò",
                    validations: {
                        empty: "Cần có ứng dụng được gán để tạo vai trò theo phạm vi ứng dụng."
                    }
                },
                domain: {
                    label: {
                        group: "Kho người dùng",
                        role: "Loại vai trò"
                    },
                    placeholder: "Miền",
                    validation: {
                        empty: {
                            group: "Chọn kho người dùng",
                            role: "Chọn loại vai trò"
                        }
                    }
                },
                notes: {
                    appNote: "Khi đối tượng của vai trò là ứng dụng, bạn có thể liên kết vai trò với một ứng dụng cho phép vai trò có đối tượng là ứng dụng.",
                    cannotCreateRole: "Bạn không thể tạo vai trò với đối tượng là ứng dụng vì hiện tại không có ứng dụng nào hỗ trợ vai trò có đối tượng là ứng dụng. Vui lòng <1>tạo một ứng dụng</1> hỗ trợ vai trò có đối tượng là ứng dụng để tiếp tục.",
                    orgNote: "Khi đối tượng của vai trò là tổ chức, bạn có thể liên kết vai trò với một ứng dụng cho phép vai trò có đối tượng là tổ chức.",
                    subOrganization: {
                        appNote: "Khi đối tượng của vai trò là ứng dụng, bạn có thể liên kết vai trò với một ứng dụng cho phép vai trò có đối tượng là ứng dụng. Bạn không thể liên kết vai trò với một ứng dụng được chia sẻ.",
                        orgNote: "Khi đối tượng của vai trò là tổ chức, bạn có thể liên kết vai trò với một ứng dụng cho phép vai trò có đối tượng là tổ chức. Bạn không thể liên kết vai trò với một ứng dụng được chia sẻ."
                    }
                },
                roleAudience: {
                    hint: "Đặt đối tượng của vai trò. <1>Lưu ý rằng đối tượng của vai trò không thể thay đổi.</1>",
                    label: "Chọn đối tượng của vai trò",
                    values: {
                        application: "Ứng dụng",
                        organization: "Tổ chức"
                    }
                },
                roleName: {
                    hint: "Một tên cho {{type}}.",
                    label: "Tên {{type}}",
                    placeholder: "Nhập tên {{type}}",
                    validations: {
                        duplicate: "Đã tồn tại một {{type}} với tên {{type}} đã cho.",
                        duplicateInAudience: "Đã tồn tại một vai trò với tên này trong đối tượng đã chọn.",
                        empty: "Cần có tên {{type}} để tiếp tục.",
                        invalid: "Tên {{type}} chỉ có thể chứa ký tự chữ và số, -, và _. "
                            + "Và phải có độ dài từ 3 đến 30 ký tự."
                    }
                }
            },
            rolePermission: {
                apiResource: {
                    hint: {
                        noApiResourcesAvailable: "Không có tài nguyên nào được ủy quyền cho ứng dụng đã chọn.",
                        empty: "Không có tài nguyên API nào được ủy quyền cho ứng dụng đã chọn. Tài nguyên API có thể được ủy quyền thông qua <1>tại đây</1>."
                    },
                    label: "Chọn tài nguyên API",
                    placeholder: "Chọn một tài nguyên API để gán quyền(phạm vi)"
                },
                notes: {
                    applicationRoles: "Chỉ các API và quyền(phạm vi) được ủy quyền trong ứng dụng đã chọn(<1>{{applicationName}}</1>) mới được liệt kê để chọn."
                },
                notifications: {
                    fetchAPIResourceError: {
                        error: {
                            description: "Đã xảy ra lỗi khi lấy tài nguyên API. Vui lòng thử lại.",
                            message: "Đã xảy ra lỗi"
                        }
                    }
                },
                permissions: {
                    label: "Chọn quyền(phạm vi) từ các tài nguyên API đã chọn",
                    permissionsLabel: "Quyền (phạm vi)",
                    placeholder: "Chọn quyền(phạm vi)",
                    tooltips: {
                        noScopes: "Không có phạm vi nào khả dụng cho tài nguyên API đã chọn",
                        removeAPIResource: "Xóa tài nguyên API",
                        selectAllScopes: "Chọn tất cả quyền(phạm vi)"
                    },
                    validation: {
                        empty: "Danh sách quyền(phạm vi) không được để trống. Chọn ít nhất một quyền(phạm vi)."
                    }
                }
            }
        },
        heading: "Tạo {{type}}",
        permissions: {
            buttons: {
                collapseAll: "Thu gọn tất cả",
                expandAll: "Mở rộng tất cả",
                update: "Cập nhật"
            },
            limitedPermission: "Bạn không có đủ quyền để gán quyền cho vai trò này."
        },
        subHeading: "Tạo một {{type}} mới trong hệ thống.",
        summary: {
            labels: {
                domain: {
                    group: "Kho người dùng",
                    role: "Loại vai trò"
                },
                groups: "Nhóm được gán",
                permissions: "Quyền",
                roleName: "Tên {{type}}",
                roles: "Vai trò được gán",
                users: "Người dùng được gán"
            }
        },
        users: {
            assignUserModal: {
                heading: "Gán người dùng",
                hint: "Chọn người dùng để thêm họ vào nhóm người dùng.",
                list: {
                    listHeader: "Tên",
                    searchByEmailPlaceholder: "Tìm kiếm người dùng theo địa chỉ email",
                    searchPlaceholder: "Tìm kiếm người dùng"
                },
                subHeading: "Gán người dùng mới vào {{type}}."
            }
        },
        wizardSteps: {
            0: "Chi tiết cơ bản",
            1: "Chọn quyền",
            2: "Gán người dùng",
            3: "Tóm tắt",
            4: "Nhóm & Người dùng",
            5: "Gán vai trò"
        }
    },
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "Ví dụ: tên vai trò."
                },
                filterCondition: {
                    placeholder: "Ví dụ: Starts with, v.v."
                },
                filterValue: {
                    placeholder: "Nhập giá trị để tìm kiếm"
                }
            }
        },
        placeholder: "Tìm kiếm theo tên vai trò"
    },
    edit: {
        agents: {
            actions: {
                assign: {
                    placeholder: "Nhập tên đăng nhập để tìm và gán agent"
                },
                remove: {
                    label: "Đang xóa agent",
                    placeholder: "Khôi phục agent"
                },
                search: {
                    moreItemsMessage: "Chỉ những agent gần đây được liệt kê. Nhập để tìm những agent khác ...",
                    placeholder: "Tìm kiếm agent"
                }
            },
            heading: "Agent được gán",
            list: {
                emptyPlaceholder: {
                    action: "Gán agent",
                    subtitles: "Hiện tại không có agent nào được gán cho {{type}}.",
                    title: "Không có agent nào được gán"
                },
                organization: "Được quản lý bởi",
                user: "Agent"
            },
            notifications: {
                error: {
                    description: "{{description}}",
                    message: "Đã xảy ra lỗi khi cập nhật agent được gán cho vai trò."
                },
                fetchError: {
                    description: "Chúng tôi không thể lấy agent được gán cho vai trò.",
                    message: "Đã xảy ra lỗi"
                },
                genericError: {
                    description: "Chúng tôi không thể cập nhật agent được gán cho vai trò.",
                    message: "Đã xảy ra lỗi"
                },
                pendingApproval: {
                    description: "Cập nhật gán agent đã được chấp nhận và đang chờ phê duyệt.",
                    message: "Gán agent được chấp nhận để phê duyệt"
                },
                success: {
                    description: "Các agent được gán cho vai trò đã được cập nhật thành công.",
                    message: "Cập nhật vai trò thành công"
                }
            },
            placeholders: {
                beginSearch: "Để bắt đầu, hãy tìm kiếm agent bằng cách nhập tên hoặc ID. Bạn có thể phải nhập đầy đủ tên hoặc ID.",
                emptyPlaceholder: {
                    action: "Gán agent",
                    subtitles: {
                        0: "Hiện tại không có agent nào được gán cho vai trò này."
                    },
                    title: "Không có agent nào được gán cho vai trò."
                },
                emptySearchResult: "Chúng tôi không thể tìm thấy kết quả nào. Vui lòng thử với tên hoặc ID đầy đủ.",
                error: "Đã xảy ra lỗi khi lấy agent.",
                errorPlaceholder: {
                    action: "Làm mới",
                    subtitles: {
                        0: "Đã xảy ra lỗi khi lấy agent được gán cho vai trò này.",
                        1: "Vui lòng thử lại."
                    },
                    title: "Đã xảy ra lỗi"
                }
            },
            subHeading: "Thêm hoặc xóa agent được gán cho vai trò này. Lưu ý rằng điều này sẽ ảnh hưởng đến việc thực hiện một số tác vụ."
        },
        basics: {
            buttons: {
                update: "Cập nhật"
            },
            confirmation: {
                assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                content: "Nếu bạn xóa {{type}} này, các quyền gắn với nó sẽ " +
                    "bị xóa và những người dùng gắn với nó sẽ không còn có thể thực hiện các hành động " +
                    "mong muốn mà trước đây đã được phép. Vui lòng tiếp tục một cách thận trọng",
                header: "Bạn có chắc không?",
                message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn {{type}} đã chọn"
            },
            dangerZone: {
                actionTitle: "Xóa {{type}}",
                buttonDisableHint: "Tùy chọn xóa bị vô hiệu hóa vì {{type}} này được quản lý trong một" +
                    " kho người dùng từ xa.",
                header: "Xóa {{type}}",
                subheader: "Sau khi bạn xóa {{type}}, không thể khôi phục lại."
            },
            fields: {
                roleName: {
                    name: "Tên vai trò",
                    placeholder: "Nhập tên vai trò",
                    required: "Cần có tên vai trò"
                }
            }
        },
        groups: {
            actions: {
                assign: {
                    placeholder: "Gán nhóm"
                },
                remove: {
                    label: "Đang xóa nhóm",
                    placeholder: "Khôi phục nhóm"
                },
                search: {
                    placeholder: "Tìm kiếm nhóm"
                }
            },
            addGroupsModal: {
                heading: "Cập nhật nhóm của vai trò",
                subHeading: "Thêm nhóm mới hoặc xóa nhóm hiện có được gán cho vai trò."
            },
            externalGroupsHeading: "Nhóm bên ngoài",
            heading: "Nhóm được gán",
            localGroupsHeading: "Nhóm cục bộ",
            notifications: {
                error: {
                    description: "{{description}}",
                    message: "Đã xảy ra lỗi khi cập nhật các nhóm được gán cho vai trò."
                },
                fetchError: {
                    description: "Chúng tôi không thể lấy các nhóm được gán cho vai trò.",
                    message: "Đã xảy ra lỗi"
                },
                genericError: {
                    description: "Chúng tôi không thể cập nhật các nhóm được gán cho vai trò.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Các nhóm được gán cho vai trò đã được cập nhật thành công.",
                    message: "Cập nhật vai trò thành công"
                }
            },
            placeholders: {
                emptyPlaceholder: {
                    action: "Gán nhóm",
                    subtitles: {
                        0: "Hiện tại không có nhóm nào được gán cho vai trò này."
                    },
                    title: "Không có nhóm nào được gán cho vai trò."
                },
                errorPlaceholder: {
                    action: "Làm mới",
                    subtitles: {
                        0: "Đã xảy ra lỗi khi lấy các nhóm được gán cho vai trò này.",
                        1: "Vui lòng thử lại."
                    },
                    title: "Đã xảy ra lỗi"
                }
            },
            subHeading: "Thêm hoặc xóa các nhóm được gán cho vai trò này. Lưu ý rằng điều này "
                + "sẽ ảnh hưởng đến việc thực hiện một số tác vụ."


        },
        menuItems: {
            agents: "Agent",
            basic: "Cơ bản",
            connectedApps: "Ứng dụng đã kết nối",
            groups: "Nhóm",
            permissions: "Quyền",
            roles: "Vai trò",
            users: "Người dùng"
        },
        permissions: {
            heading: "Quyền được gán",
            limitedPermission: "Bạn không có đủ quyền để chỉnh sửa quyền của vai trò này.",
            readOnlySubHeading: "Xem các quyền được gán của vai trò.",
            removedPermissions: "Quyền đã xóa",
            subHeading: "Quản lý các quyền được gán trong vai trò."
        },
        placeholders: {
            errorPlaceHolder: {
                action: "Quay lại",
                subtitles: {
                    0: "Đã xảy ra lỗi khi lấy vai trò được yêu cầu, có thể do vai trò không tồn tại.",
                    1: "Vui lòng thử lại."
                },
                title: "Đã xảy ra lỗi"
            }
        },
        users: {
            actions: {
                assign: {
                    placeholder: "Nhập tên đăng nhập để tìm và gán người dùng"
                },
                remove: {
                    label: "Đang xóa người dùng",
                    placeholder: "Khôi phục người dùng"
                },
                search: {
                    moreItemsMessage: "Chỉ những người dùng gần đây được liệt kê. Nhập để tìm những người khác ...",
                    placeholder: "Tìm kiếm người dùng"
                }
            },
            heading: "Người dùng được gán",
            list: {
                emptyPlaceholder: {
                    action: "Gán người dùng",
                    subtitles: "Hiện tại không có người dùng nào được gán cho {{type}}.",
                    title: "Không có người dùng nào được gán"
                },
                organization: "Được quản lý bởi",
                user: "Người dùng"
            },
            notifications: {
                error: {
                    description: "{{description}}",
                    message: "Đã xảy ra lỗi khi cập nhật người dùng được gán cho vai trò."
                },
                fetchError: {
                    description: "Chúng tôi không thể lấy người dùng được gán cho vai trò.",
                    message: "Đã xảy ra lỗi"
                },
                genericError: {
                    description: "Chúng tôi không thể cập nhật người dùng được gán cho vai trò.",
                    message: "Đã xảy ra lỗi"
                },
                pendingApproval: {
                    description: "Cập nhật gán người dùng đã được chấp nhận và đang chờ phê duyệt.",
                    message: "Gán người dùng được chấp nhận để phê duyệt"
                },
                success: {
                    description: "Người dùng được gán cho vai trò đã được cập nhật thành công.",
                    message: "Cập nhật vai trò thành công"
                }
            },
            placeholders: {
                beginSearch: "Để bắt đầu, hãy tìm kiếm người dùng bằng cách nhập tên đăng nhập. Bạn có thể phải nhập đầy đủ tên đăng nhập.",
                emptyPlaceholder: {
                    action: "Gán người dùng",
                    subtitles: {
                        0: "Hiện tại không có người dùng nào được gán cho vai trò này."
                    },
                    title: "Không có người dùng nào được gán cho vai trò."
                },
                emptySearchResult: "Chúng tôi không thể tìm thấy kết quả nào. Vui lòng thử với tên đăng nhập đầy đủ.",
                error: "Đã xảy ra lỗi khi lấy người dùng.",
                errorPlaceholder: {
                    action: "Làm mới",
                    subtitles: {
                        0: "Đã xảy ra lỗi khi lấy người dùng được gán cho vai trò này.",
                        1: "Vui lòng thử lại."
                    },
                    title: "Đã xảy ra lỗi"
                }
            },
            subHeading: "Thêm hoặc xóa người dùng được gán cho vai trò này. Lưu ý rằng điều này sẽ ảnh hưởng đến việc thực hiện một số tác vụ."
        }
    },
    list: {
        buttons: {
            addButton: "{{type}} mới",
            filterDropdown: "Lọc theo"
        },
        columns: {
            actions: "Hành động",
            audience: "Đối tượng",
            lastModified: "Thời gian sửa đổi",
            managedByApp: {
                header: "Được quản lý bởi",
                label: "Chỉ có thể được sử dụng trong ứng dụng: "
            },
            managedByOrg: {
                header: "Được quản lý bởi",
                label: "Có thể được sử dụng trong tổ chức: "
            },
            name: "Vai trò"
        },
        confirmations: {
            deleteItem: {
                assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                content: "Nếu bạn xóa {{type}} này, các quyền gắn với nó sẽ " +
                    "bị xóa và những người dùng gắn với nó sẽ không còn có thể thực hiện " +
                    "các hành động mong muốn mà trước đây đã được phép. Vui lòng tiếp tục một cách thận trọng.",
                header: "Bạn có chắc không?",
                message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn {{type}} đã chọn"
            },
            deleteItemError: {
                content: "Hãy xóa các liên kết khỏi ứng dụng sau trước khi xóa:",
                header: "Không thể xóa",
                message: "Có một ứng dụng đang sử dụng vai trò này."
            }
        },
        emptyPlaceholders: {
            emptyRoleList: {
                action: "{{type}} mới",
                emptyRoles: "Không tìm thấy {{type}} nào",
                subtitles: {
                    0: "Hiện tại không có {{type}} nào khả dụng.",
                    1: "Bạn có thể thêm {{type}} mới một cách dễ dàng bằng cách làm theo",
                    2: "các bước trong trình hướng dẫn tạo {{type}}."
                },
                title: "Thêm một {{type}} mới"
            },
            search: {
                action: "Xóa truy vấn tìm kiếm",
                subtitles: {
                    0: "Chúng tôi không thể tìm thấy kết quả nào cho {{searchQuery}}",
                    1: "Vui lòng thử một từ khóa tìm kiếm khác."
                },
                title: "Không tìm thấy kết quả"
            }
        },
        filterAttirbutes: {
            audience: "Đối tượng vai trò",
            name: "Tên"
        },
        filterOptions: {
            all: "Hiển thị tất cả",
            applicationRoles: "Vai trò ứng dụng",
            organizationRoles: "Vai trò tổ chức"
        },
        labels: {
            shared: "Vai trò được chia sẻ"
        },
        popups: {
            delete: "Xóa {{type}}",
            edit: "Chỉnh sửa {{type}}"
        }
    },
    notifications: {
        apiLimitReachedError: {
            error: {
                description: "Bạn đã đạt số lượng vai trò tối đa được phép.",
                message: "Không thể tạo vai trò"
            }
        },
        createPermission: {
            error: {
                description: "{{description}}",
                message: "Đã xảy ra lỗi khi thêm quyền cho vai trò."
            },
            genericError: {
                description: "Không thể thêm quyền cho vai trò.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Quyền đã được thêm thành công cho vai trò.",
                message: "Tạo vai trò thành công."
            }
        },
        createRole: {
            error: {
                description: "{{description}}",
                message: "Đã xảy ra lỗi khi tạo vai trò."
            },
            genericError: {
                description: "Không thể tạo vai trò.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Vai trò đã được tạo thành công.",
                message: "Tạo vai trò thành công."
            }
        },
        createRolePendingApproval: {
            success: {
                description: "Việc tạo vai trò mới đã được chấp nhận và đang chờ phê duyệt.",
                message: "Vai trò được chấp nhận để tạo"
            }
        },
        deleteRole: {
            error: {
                description: "{{description}}",
                message: "Không thể xóa vai trò đã chọn."
            },
            genericError: {
                description: "Không thể xóa vai trò đã chọn.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Vai trò đã chọn đã được xóa thành công.",
                message: "Xóa vai trò thành công"
            }
        },
        fetchRole: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy vai trò.",
                message: "Đã xảy ra lỗi"
            }
        },
        fetchRoles: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy danh sách vai trò.",
                message: "Đã xảy ra lỗi"
            }
        },
        tierLimitReachedError: {
            emptyPlaceholder: {
                action: "Xem các gói",
                subtitles: "Bạn có thể liên hệ quản trị viên tổ chức hoặc (nếu bạn là " +
                    "quản trị viên) nâng cấp gói đăng ký để tăng giới hạn cho phép.",
                title: "Bạn đã đạt số lượng vai trò tối đa được phép " +
                    "cho tổ chức này."
            },
            heading: "Bạn đã đạt giới hạn tối đa cho vai trò"
        },
        updateRole: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi cập nhật vai trò đã chọn."
            },
            genericError: {
                description: "Không thể cập nhật vai trò đã chọn.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Vai trò đã chọn đã được cập nhật thành công.",
                message: "Cập nhật vai trò thành công"
            }
        }
    },
    readOnlyList: {
        emptyPlaceholders: {
            searchAndFilter: {
                subtitles: {
                    0: "Chúng tôi không thể tìm thấy kết quả nào cho tổ hợp tên vai trò và đối tượng đã chỉ định.",
                    1: "Vui lòng thử một tổ hợp khác."
                },
                title: "Không tìm thấy kết quả"
            }
        }
    }
};
