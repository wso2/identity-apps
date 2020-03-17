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
import { TreeView } from "@wso2is/react-components";
import { Forms } from "@wso2is/forms";
import { addPath } from "../role-utils";
import { Segment, Button, Grid } from "semantic-ui-react";
import _ from "lodash";

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
    const [ permissionsOfRole, setPermissionsOfRole ] = useState([]);
    const [ permissionsLoading, setPermissionsLoading ] = useState(Boolean);
    const [ collapseAll, setCollapseAll ] = useState(Boolean);

    const {
        triggerSubmit,
        onSubmit,
        role
    } = props;

    /**
     * Util method to check permissions already in the selected role.
     * 
     * @param permList - Permissions which are available in the selected role
     * @param nodes - Permmission Node List
     * @param isParentChecked - Check whether parent is selected
     */
    const checkRolePerms = (permList: string[], nodes: any, isParentChecked: boolean): void  => {
        nodes.forEach(node => {
            if (permList.includes(node.fullPath)) {
                node.isChecked = true;
                if(node.children){
                    checkRolePerms(permList, node.children, true);
                }
            } else if (isParentChecked) {
                node.isChecked = true;
                if(node.children){
                    checkRolePerms(permList, node.children, true);
                }
            } else {
                if(node.children){
                    checkRolePerms(permList, node.children, false);
                }
            }
        });
    }

    const getPermsList = (rolePerms?: string[]): void => {
        getPermissionList().then((response)=> {
            if (response.status === 200) {
                const permList = response.data;
                let permTree: Permission[] = [];

                permTree = permList.reduce((arr, path) => addPath(
                    path, path.resourcePath.replace(/^\/|\/$/g, "").split('/'), arr,
                ),[]);

                if (rolePerms) {
                    checkRolePerms(rolePerms, permTree, false);
                    setPermissionsOfRole(rolePerms);
                    setSelectedPermissions(rolePerms)
                }

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
            if (permissionsOfRole.length > 0) {
                setSelectedPermissions([...selectedPermissions, nodeData[0].fullPath]);
            } else {
                setSelectedPermissions([...selectedPermissions, nodeData[0]]);
            }
        } else {
            if (permissionsOfRole.length > 0) {
                setSelectedPermissions(selectedPermissions.filter(item => item !== nodeData[0].fullPath));
            } else {
                setSelectedPermissions(selectedPermissions.filter(item => item.fullPath !== nodeData[0].fullPath));
            }
        }
    }

    return (
        <Segment padded clearing loading={ permissionsLoading }>
            <Button.Group size="tiny" vertical labeled icon>
                <Button 
                    onClick={ () => {
                        const collapsedState = _.cloneDeep(permissionTree);
                        collapsedState[0].isExpanded = collapseAll;
                        setPermissionTree(collapsedState);
                        setCollapseAll(!collapseAll);
                    } } 
                    icon={ collapseAll? "compress" : "expand" } 
                    content={ collapseAll? "Expand All" : "Collapse All" } 
                />
            </Button.Group>
            
            <Forms submitState={ triggerSubmit } onSubmit={ () => {
                onSubmit(selectedPermissions);
            } }>
                {
                    !permissionsLoading ? 
                        <div className="super-treeview-container">
                            <TreeView
                                data={ permissionTree }
                                keywordLabel= "label"
                                isDeletable= { () => { return false } }
                                noChildrenAvailableMessage= ""
                                onUpdateCb={ updatedData => setPermissionTree(updatedData) }
                                onCheckToggleCb={ handlePermssionCheck }
                            /> 
                        </div> : <div></div>
                }
                {permissionsOfRole && permissionsOfRole.length && 
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Button primary type="submit" size="small" className="form-button">
                                Update
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                }
            </Forms>
            
        </Segment>
    );
}
