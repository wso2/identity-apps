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

import React, { useEffect, useState } from "react";
import { PageLayout, ListLayout } from "../layouts";
import { getGroupsList } from "../api";
import { RoleList } from "../components/users";
import { RoleListInterface } from "../models"

/**
 * React component to list User Roles.
 * 
 * @return {JSX.Element}
 */
export const UserRoles = (): JSX.Element => {
    const [ roleList, setRoleList ] = useState<RoleListInterface>();
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);

    useEffect(() => {
        getGroupsList().then((response)=> {
            if (response.status === 200) {
                console.log(response.data);
                setRoleList(response.data);
            }
        }).catch();
    },[])

    return (
        <PageLayout
            title="Users Roles page"
            description="Create and manage roles, assign permissions for roles."
            showBottomDivider={ true } 
        >
            <ListLayout
                totalPages={ Math.ceil(roleList?.totalResults / listItemLimit) }
            >
                <RoleList roleList={ roleList?.Resources } />
            </ListLayout>
        </PageLayout>
    );
}
