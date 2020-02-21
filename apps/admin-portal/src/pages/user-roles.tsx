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
import { PrimaryButton } from "@wso2is/react-components";
import { Icon, PaginationProps, DropdownProps } from "semantic-ui-react";
import { DEFAULT_ROLE_LIST_ITEM_LIMIT } from "../constants";

/**
 * React component to list User Roles.
 * 
 * @return {JSX.Element}
 */
export const UserRoles = (): JSX.Element => {
    const [ roleList, setRoleList ] = useState<RoleListInterface>();
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);

    useEffect(() => {
        setListItemLimit(DEFAULT_ROLE_LIST_ITEM_LIMIT);
    }, []);

    useEffect(() => {
        getGroupsList().then((response)=> {
            if (response.status === 200) {
                console.log(response.data);
                setRoleList(response.data);
            }
        }).catch();
    },[ listOffset, listItemLimit ]);

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    return (
        <PageLayout
            title="Users Roles page"
            description="Create and manage roles, assign permissions for roles."
            showBottomDivider={ true } 
        >
            <ListLayout
                currentListSize={ roleList?.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                /*={
                    (
                        <PrimaryButton onClick={ () => setShowWizard(true) }>
                            <Icon name="add"/>
                            Add Role
                        </PrimaryButton>
                    )
                }*/
                showPagination={ roleList?.totalResults >= DEFAULT_ROLE_LIST_ITEM_LIMIT }
                totalPages={ Math.ceil(roleList?.totalResults / listItemLimit) }
                totalListSize={ roleList?.totalResults }
            >
                <RoleList roleList={ roleList?.Resources } />
                {
                    showWizard && (
                    <div>ppp</div>
                ) }
            </ListLayout>
        </PageLayout>
    );
}
