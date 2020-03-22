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

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { PageLayout } from "../layouts";
import { history } from "../helpers";
import { getRoleById } from "../api";
import { EditRole } from "../components/roles/edit-role/edit-role";
import { RolesInterface } from "../models";
import { ROLE_VIEW_PATH } from "../constants";

export const RoleEditPage: FunctionComponent<any> = (props: any): ReactElement => {

    const [ roleId, setRoleId ] = useState<string>(undefined);
    const [ roleObject, setRoleObject ] = useState<RolesInterface>();

    const getRoleDetails = (roleId: string ): void => {
        getRoleById(roleId).then(response => {
            if (response.status === 200) {
                setRoleObject(response.data);
            }
        }).catch(error => {
            // TODO: handle error
        })
    }

    const onRoleUpdate = (): void => {
        getRoleDetails(roleId);
    }

    /**
     * Get Role data from URL id
     */
    useEffect(() => {
        const path = history.location.pathname.split("/");
        const roleId = path[ path.length - 1 ];

        setRoleId(roleId);
        getRoleDetails(roleId);
    }, []);

    const handleBackButtonClick = () => {
        history.push(ROLE_VIEW_PATH);
    };
    
    return (
        <PageLayout
            title={ "Edit Role" }
            backButton={ {
                onClick: handleBackButtonClick,
                text: "Go back to roles"
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditRole roleObject={ roleObject } roleId={ roleId } onRoleUpdate={ onRoleUpdate } />
        </PageLayout>
    );
}
