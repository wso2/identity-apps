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

import React, { useState, useEffect} from "react";
import { getRolePermission, getAllPermission } from "../../api";

interface PermissionsListProps {
    roleId?: string;
}

export const PermissionsList: React.FunctionComponent<PermissionsListProps> = (props): JSX.Element => {

    const [permissionList, setPermissionList] = useState([]);
    const [rolePermissionList, setRolePermissionList] = useState([]);

    useEffect(() => {
        let didCancel = false;
        let roleId = props.roleId;

        getAllPermission().then((response) => {
            console.log(response.data);
            setPermissionList(response.data)
        })

        if (roleId && roleId !== '') {
            getRolePermission(roleId).then((response) => {
                if (response.status === 200 && !didCancel) {
                    setPermissionList(response.data.Resources);
                    console.log(response);
                }
            })
        }

        return () => {
            didCancel = true;
        };
    }, [])

    return (
        <div>
            {permissionList? permissionList.map((perm) => {
                return <li>{perm.displayName}</li>
            }) : <div>no permissions</div> }
        </div>
    );
}