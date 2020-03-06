/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import React, { ReactElement } from "react";
import { RolesInterface } from "../../../models";
import { ResourceList, ResourceListItem } from "@wso2is/react-components";
import { CommonUtils } from "../../../utils";

interface RoleListProps {
    roleList: RolesInterface[];
    handleRoleDelete: (roleId: string) => void;
}

/**
 * List component for Role Management list
 * 
 * @param props contains the role list as a prop to populate
 */
export const RoleList: React.FunctionComponent<RoleListProps> = (props: RoleListProps): ReactElement => {
    const {
        roleList,
        handleRoleDelete
    } = props;

    return (
        <ResourceList className="roles-list">
            {
                roleList && roleList.map((role, index) => (
                    <ResourceListItem
                        key={ index }
                        actionsFloated="right"
                        actions={ [
                            {
                                icon: "trash alternate",
                                onClick: () => handleRoleDelete(role.id),
                                popupText: "Delete Role",
                                type: "button"
                            }
                        ] }
                        itemHeader={ role.displayName }
                        metaContent={ CommonUtils.humanizeDateDifference(role.meta.created) }
                    />
                ))
            }
        </ResourceList>
    );
};
