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

import React, { FunctionComponent, ReactElement, useEffect, useState} from "react";
import { getPermissionList, getPermissionsPerRole } from "../../../api";
import { Permission } from "../../../models/permission";
import SuperTreeview from 'react-super-treeview';
import { Forms } from "@wso2is/forms";
import { addPath } from "../role-utils";
import { Segment } from "semantic-ui-react";

/**
 * Interface to capture permission list props
 */
interface PermissionListProp {
    triggerSubmit?: boolean;
    onSubmit?: (permissions: any) => void;
    role?: string;
}

/**
 * Component to create the permission tree structure from the give permission list.
 * 
 * @param props props containing event handlers for permission component
 */
export const PermissionList: FunctionComponent<PermissionListProp> = (props: PermissionListProp): ReactElement => {

    const [ permissionTree, setPermissionTree ] = useState([]);
    const [ selectedPermissions, setSelectedPermissions ] = useState([]);
    const [ permissionsLoading, setPermissionsLoading ] = useState(Boolean);

    const {
        triggerSubmit,
        onSubmit,
        role
    } = props;

    const getPermsList = (rolePerms?: string[]): void => {
        getPermissionList().then((response)=> {
            if (response.status === 200) {
                const permList = response.data;
                let permTree: Permission[] = [];

                permTree = permList.reduce((arr, path) => addPath(
                    path, path.resourcePath.replace(/^\/|\/$/g, "").split('/'), arr, rolePerms
                ),[]);

                setPermissionTree(permTree);
                setPermissionsLoading(false);
            }
        }).catch(error => {
            //TODO handle error
        });

    }

    useEffect(() => {
        setPermissionsLoading(true);

        if (role) {
            getPermissionsPerRole(role).then(response => {
                if (response.status === 200) {
                    getPermsList(response.data);
                }
            }).catch(error => {
                //TODO: Handle Error
            })
        } else {
            getPermsList();
        }
    },[]);

    /**
     * A util method which will check all the child elements.
     * 
     * @param nodes child nodes need to be checked.
     */
    const applyCheckStateTo = (nodes: any, checked: boolean): void => {
        nodes.forEach((node)=>{
            node.isChecked = checked
            if(node.children){
                applyCheckStateTo(node.children, checked);
            }
        })
    }

    /**
     * Click event handler for the permission tree checkboxes.
     * 
     * @param nodeData - array of checked elements returned.
     */
    const handlePermssionCheck = (nodeData): void => {
        const checkState = nodeData[0].isChecked;

        applyCheckStateTo(nodeData, checkState);

        if (nodeData[0].isChecked) {
            setSelectedPermissions([...selectedPermissions, nodeData[0]]);
        } else {
            setSelectedPermissions(selectedPermissions.filter(item => item.fullPath !== nodeData[0].fullPath));
        }
    }

    return (
        <Segment padded loading={ permissionsLoading }>
            <Forms submitState={ triggerSubmit } onSubmit={ () => {
                onSubmit(selectedPermissions);
            } }>
                {
                    !permissionsLoading ? <SuperTreeview
                        data={ permissionTree }
                        keywordLabel= "label"
                        isDeletable= { () => { return false } }
                        noChildrenAvailableMessage= ""
                        onUpdateCb={ updatedData => setPermissionTree(updatedData) }
                        onCheckToggleCb={ handlePermssionCheck }
                    /> : <div></div>
                }
            </Forms>
        </Segment>
        
        
    );
}
