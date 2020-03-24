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
import { getPermissionList, getPermissionsForRole } from "../../../api";
import { Permission } from "../../../models/permission";
import { TreeView } from "@wso2is/react-components";
import { Forms } from "@wso2is/forms";
import { addPath } from "../role-utils";
import { Segment, Button, Grid, Loader } from "semantic-ui-react";
import _ from "lodash";
import { RolesInterface } from "../../../models";

/**
 * Interface to capture permission list props
 */
interface PermissionListProp {
    triggerSubmit?: boolean;
    onSubmit?: (permissions: any) => void;
    roleObject?: RolesInterface;
    isEdit: boolean;
    initialValues?: Permission[];
}

/**
 * Component to create the permission tree structure from the give permission list.
 * 
 * @param props props containing event handlers for permission component
 */
export const PermissionList: FunctionComponent<PermissionListProp> = (props: PermissionListProp): ReactElement => {

    const {
        triggerSubmit,
        onSubmit,
        roleObject,
        isEdit,
        initialValues
    } = props;

    const [ permissionTree, setPermissionTree ] = useState<Permission[]>([]);
    const [ availablePermissionsInRole, setAvailablePermissionsInRole ] = useState<Permission[]>([]);
    const [ checkedPermissions, setCheckedPermissions ] = useState<Permission[]>([]);
    const [ isPermissionsLoading, setIsPermissionsLoading ] = useState<boolean>(true);
    const [ collapseTree, setCollapseTree ] = useState<boolean>(false);

    /*
    
    
    */

    /**
     * Retrieve permissions for a given role if in Role edit mode.
     */
    useEffect(() => {
        if (isEdit && roleObject) {
            getPermissionsForRole(roleObject.id)
                .then(response => {
                    if (response.status === 200 && response.data instanceof Array) {
                        const permissionsArray: Permission[] = [];
                        response.data.forEach(permission => {
                            permissionsArray.push({
                                id: permission,
                                isChecked: false,
                                fullPath: permission,
                                name: permission,
                                isExpanded: true
                            })
                        })
                        setAvailablePermissionsInRole(permissionsArray);
                        getAllPermissions();
                    }
                })
                .catch(error => {
                    //Handle Role Retrieval Properly
                })
        } else {
            getAllPermissions();
        }
    }, [availablePermissionsInRole.toString()])

        /**
     * Retrieve all permissions to render permissions tree.
     */
    const getAllPermissions = (): void => {
        getPermissionList()
            .then(response => {
                if (response.status === 200 && response.data && response.data instanceof Array) {
                    const permissionStringArray = response.data;
                    let permissionTree: Permission[] = [];

                    permissionTree = permissionStringArray.reduce((arr, path) => addPath(
                        path, path.resourcePath.replace(/^\/|\/$/g, "").split('/'), arr,
                    ),[]);

                    //Retrieved permissions of Role in edit mode
                    if (availablePermissionsInRole.length !== 0) {
                        setCheckedPermissions(availablePermissionsInRole);
                        setCheckedStateForNodesInPermissionTree(availablePermissionsInRole, permissionTree, false);
                    }

                    //temporary selected roles in roles create wizard
                    if (initialValues && initialValues.length !== 0) {
                        setCheckedPermissions(initialValues);
                        setCheckedStateForNodesInPermissionTree(initialValues, permissionTree, false);
                    }

                    //Set loading flag false
                    setIsPermissionsLoading(false);
                    setPermissionTree(permissionTree);
                }
            })
            .catch(error => {
                //Handle Permission Retrieval Properly
            })
    }

    /**
     * Util method to change checked state in permission tree according to the selected permissions
     * array.
     * 
     * @param selectedPermissions permissions already selected in the component
     * @param permissionNodes permission tree
     * @param isParentChecked state whether the parent node is checked
     */
    const setCheckedStateForNodesInPermissionTree = (selectedPermissions: Permission[],
        permissionNodes: Permission[], isParentChecked: boolean): void => {
            permissionNodes.forEach(treeNode => {
                if (selectedPermissions.some(selectedPermission => selectedPermission.fullPath === treeNode.fullPath)) {
                    treeNode.isChecked = true;
                    if (treeNode.children) {
                        setCheckedStateForNodesInPermissionTree(selectedPermissions, treeNode.children, true);
                    }
                } else if (isParentChecked) {
                    treeNode.isChecked = true;
                    if (treeNode.children) {
                        setCheckedStateForNodesInPermissionTree(selectedPermissions, treeNode.children, true);
                    }
                } else {
                    if (treeNode.children) {
                        setCheckedStateForNodesInPermissionTree(selectedPermissions, treeNode.children, false);
                    }
                }
            })
    }

    /**
     * A util method which will check all the child elements.
     * 
     * @param nodes child nodes need to be checked.
     */
    const markChildrenAsChecked = (nodes: any, checked: boolean): void => {
        nodes.forEach((node)=>{
            node.isChecked = checked
            if(node.children){
                markChildrenAsChecked(node.children, checked);
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

        markChildrenAsChecked(nodeData, checkState);

        if (nodeData[0].isChecked) {
            setCheckedPermissions([...checkedPermissions, nodeData[0]])
        } else {
            setCheckedPermissions(checkedPermissions.filter(item => item.fullPath !== nodeData[0].fullPath));
        }
    }

    return (
        <Segment basic loading={ isPermissionsLoading }>
            { !isPermissionsLoading && 
                <Button.Group size="tiny" vertical labeled icon>
                    <Button 
                        onClick={ () => {
                            const collapsedState = _.cloneDeep(permissionTree);
                            collapsedState[0].isExpanded = collapseTree;
                            setPermissionTree(collapsedState);
                            setCollapseTree(!collapseTree);
                        } } 
                        icon={ collapseTree? "expand" : "compress" } 
                        content={ collapseTree? "Expand All" : "Collapse All" } 
                    />
                </Button.Group>
            }
            <Forms submitState={ triggerSubmit } onSubmit={ () => {
                onSubmit(checkedPermissions);
            } }>
                {
                    !isPermissionsLoading ? 
                        <div className="treeview-container">
                            <TreeView
                                data={ permissionTree }
                                keywordLabel= "label"
                                isDeletable= { () => { return false } }
                                noChildrenAvailableMessage= ""
                                onUpdateCb={ updatedData => setPermissionTree(updatedData) }
                                onCheckToggleCb={ handlePermssionCheck }
                            /> 
                        </div> : 
                        <Loader active />
                }
                { isEdit && !isPermissionsLoading &&
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
    )

}
