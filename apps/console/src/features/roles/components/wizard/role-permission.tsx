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

import { RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Forms } from "@wso2is/forms";
import { ContentLoader, EmphasizedSegment, TreeView } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid } from "semantic-ui-react";
import { getPermissionList, getPermissionsForRole } from "../../api";
import { Permission } from "../../models";
import { addPath } from "../role-utils";

/**
 * Interface to capture permission list props
 */
interface PermissionListProp extends  TestableComponentInterface {
    triggerSubmit?: boolean;
    onSubmit?: (permissions: any) => void;
    roleObject?: RolesInterface;
    isEdit: boolean;
    initialValues?: Permission[];
    isRole?: boolean;
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
        initialValues,
        isRole,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ permissionTree, setPermissionTree ] = useState<Permission[]>([]);
    const [ availablePermissionsInRole, setAvailablePermissionsInRole ] = useState<Permission[]>([]);
    const [ checkedPermissions, setCheckedPermissions ] = useState<Permission[]>([]);
    const [ isPermissionsLoading, setIsPermissionsLoading ] = useState<boolean>(true);
    const [ collapseTree, setCollapseTree ] = useState<boolean>(false);

    /**
     * Retrieve permissions for a given role if in Role edit mode.
     */
    useEffect(() => {
        if (isRole && roleObject) {
            getPermissionsForRole(roleObject.id)
                .then(response => {
                    if (response.status === 200 && response.data instanceof Array) {
                        const permissionsArray: Permission[] = [];
                        const permissions = response.data;
                        permissions.forEach(permission => {
                            permissionsArray.push({
                                fullPath: permission,
                                id: permission,
                                isChecked: false,
                                isExpanded: true,
                                isPartiallyChecked: false,
                                name: permission
                            })
                        });
                        setAvailablePermissionsInRole(permissionsArray);
                        getAllPermissions();
                    }
                })
                .catch(() => {
                    //Handle Role Retrieval Properly
                })
        } else {
            getAllPermissions();
        }
    }, [availablePermissionsInRole.toString()]);

    useEffect(() => {
        const collapsedTree = _.cloneDeep(permissionTree);
        removeIndeterminateState(collapsedTree);
        checkedPermissions.forEach((node: Permission) => {
            markParentAsPartiallyChecked(collapsedTree, node, 0)
        });
        setPermissionTree(collapsedTree);
    }, [checkedPermissions.length]);

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
                        path, path.resourcePath.replace(/^\/|\/$/g, "").split("/"), arr
                    ),[]);

                    //Will collapse top level nodes in initial load
                    setTopNodesCollapsed(permissionTree);

                    //Retrieved permissions of Role in edit mode
                    if (availablePermissionsInRole.length !== 0) {
                        setCheckedPermissions(availablePermissionsInRole);
                        availablePermissionsInRole.forEach((node: Permission) => {
                            markParentAsPartiallyChecked(permissionTree, node, 0)
                        });
                        setCheckedStateForNodesInPermissionTree(availablePermissionsInRole, permissionTree, false);
                    }

                    //temporary selected roles in roles create wizard
                    if (initialValues && initialValues.length !== 0) {
                        setCheckedPermissions(initialValues);
                        initialValues.forEach((node: Permission) => {
                            markParentAsPartiallyChecked(permissionTree, node, 0)
                        });
                        setCheckedStateForNodesInPermissionTree(initialValues, permissionTree, false);
                    }

                    //Set loading flag false
                    setIsPermissionsLoading(false);
                    setPermissionTree(permissionTree);
                }
            })
            .catch(() => {
                //Handle Permission Retrieval Properly
            })
    };

    /**
     * Util method to load the initial tree main elements collapsed.
     *
     * @param permissionNodes permissionTree
     */
    const setTopNodesCollapsed = (permissionNodes: Permission[]): void => {
        permissionNodes[0].children?.forEach((permissionNode: Permission) => {
            permissionNode.isExpanded = false;
        })
    };

    /**
     * Util method to remove indeterminate state.
     *
     * @param nodeTree permission node tree
     */
    const removeIndeterminateState = (nodeTree: Permission[]): void => {
        nodeTree.forEach(permission => {
            permission.isPartiallyChecked = false;
            if (permission.children) {
                removeIndeterminateState(permission.children);
            }
        })
    };

    /**
     * Util method to change collapse state of tree nodes.
     *
     * @param permissionNodes Permssion Tree
     * @param parentCollapseState Collapsed state of the parent node
     */
    const setNodeCollapseState = (permissionNodes: Permission[], parentCollapseState: boolean): void => {
        permissionNodes.forEach((permissionNode: Permission) => {
            permissionNode.isExpanded = parentCollapseState;

            if (permissionNode.children) {
                setNodeCollapseState(permissionNode.children, parentCollapseState);
            }
        })
    };

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
    };

    /**
     * A util method which will check all the child elements.
     *
     * @param nodes child nodes need to be checked.
     * @param checked
     */
    const markChildrenAsChecked = (nodes: any, checked: boolean): void => {
        nodes.forEach((node)=>{
            node.isChecked = checked;
            if(node.children){
                markChildrenAsChecked(node.children, checked);
            }
        })
    };

    /**
     * Add indeteminate state for parent node when checked on tree node.
     *
     * @param nodes permission node list
     * @param checkedNode current checked permission node
     * @param depth depth of the current checked permission node
     */
    const markParentAsPartiallyChecked = (nodes: Permission[], checkedNode: Permission, depth: number): void => {
        const permissionPath: string[] = checkedNode?.fullPath?.split("/").filter(String);
        permissionPath.pop();
        nodes.forEach((node: Permission) => {
            if (permissionPath[depth] === node.name) {
                node.isPartiallyChecked = true;
                if (node.children) {
                    markParentAsPartiallyChecked(node.children, checkedNode, ++depth);
                }
            }
        });
    };

    /**
     * Click event handler for the permission tree checkboxes.
     *
     * @param nodeData - array of checked elements returned.
     */
    const handlePermssionCheck = (nodeData: Permission[]): void => {
        const checkState = nodeData[0].isChecked;

        markChildrenAsChecked(nodeData, checkState);

        if (nodeData[0].isChecked) {
            setCheckedPermissions([...checkedPermissions, nodeData[0]])
        } else {
            setCheckedPermissions(checkedPermissions.filter(item => item.fullPath !== nodeData[0].fullPath));
        }
    };

    /**
     * Handler to update collapse button state when tree node is expanded
     * or collapsed.
     *
     * @param node - current node expanded or collapsed
     * @param depth - depth of the current node in the tree
     */
    const handleOnToggle = (node: any, depth: number) => {
        if (depth === 0 && node.isExpanded) {
            setCollapseTree(false);
        } else if (depth === 0 && !node.isExpanded) {
            setCollapseTree(true);
        }
    };

    /**
     * Util method to handle expand all, collapse all button event.
     */
    const handleExpandAll = (): void => {
        const collapsedTree = _.cloneDeep(permissionTree);
        setNodeCollapseState(collapsedTree, collapseTree);
        setPermissionTree(collapsedTree);
        setCollapseTree(!collapseTree);
    };

    return (
        <EmphasizedSegment data-testid={ testId }>
            { !isPermissionsLoading &&
                <div className="action-container">
                        <Button
                            data-testid={ `${ testId }-tree-expand-all-button` }
                            basic
                            compact
                            size="tiny"
                            onClick={ handleExpandAll }
                            icon={ collapseTree? "expand" : "compress" }
                            content={
                                collapseTree ?
                                    t("adminPortal:components.roles.addRoleWizard.permissions.buttons.expandAll") :
                                    t("adminPortal:components.roles.addRoleWizard.permissions.buttons.collapseAll")
                            }
                        />
                </div>
            }
            <Forms
                submitState={ triggerSubmit }
                onSubmit={ () => { onSubmit(checkedPermissions); } }
            >
                {
                    !isPermissionsLoading ?
                        <div className="treeview-container">
                            <TreeView
                                data-testid={ `${ testId }-tree` }
                                data={ permissionTree }
                                keywordLabel= "label"
                                isDeletable= { () => { return false } }
                                noChildrenAvailableMessage= ""
                                onUpdateCb={ updatedData => setPermissionTree(updatedData) }
                                onCheckToggleCb={ handlePermssionCheck }
                                onExpandToggleCb={ handleOnToggle }
                            />
                        </div> :
                        <ContentLoader active />
                }
                { isEdit && !isPermissionsLoading &&
                    <>
                        <Divider hidden/>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Button
                                    data-testid={ `${ testId }-update-button` }
                                    primary
                                    type="submit"
                                    size="small"
                                    className="form-button"
                                >
                                    { t("adminPortal:components.roles.addRoleWizard.permissions.buttons.update") }
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </>
                }
            </Forms>
        </EmphasizedSegment>
    )

};
