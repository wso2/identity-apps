/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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
import { ContentLoader, EmphasizedSegment } from "@wso2is/react-components";
import Tree from "rc-tree";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid } from "semantic-ui-react";
import { TreeNode } from "../../models";
import { OrganizationRoleManagementUtils } from "../../utils/organization-role-management-utils";

/**
 * Interface to capture permission list props
 */
interface OrganizationPermissionListProp extends TestableComponentInterface {
    /**
     * Should the content be emphasized.
     */
    emphasize?: boolean;
    triggerSubmit?: boolean;
    onSubmit?: (checkedPermission: TreeNode[]) => void;
    roleObject?: RolesInterface;
    isEdit: boolean;
    initialValues?: TreeNode[];
    isRole?: boolean;
    isReadOnly?: boolean;
    /**
     * Permissions to hide.
     */
    permissionsToHide?: string[];
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}

/**
 * Component to create the permission tree structure from the give permission list.
 *
 * @param props props containing event handlers for permission component
 */
export const OrganizationPermissionList: FunctionComponent<OrganizationPermissionListProp> =
    (props: OrganizationPermissionListProp): ReactElement => {

        const {
            isReadOnly,
            emphasize,
            triggerSubmit,
            onSubmit,
            roleObject,
            isEdit,
            initialValues,
            isRole,
            isSubmitting,
            permissionsToHide,
            ["data-testid"]: testId
        } = props;

        const { t } = useTranslation();

        const [ permissions, setPermissions ] = useState<TreeNode[]>([]);
        const [ checkedPermission, setCheckedPermission ] = useState<TreeNode[]>([]);
        const [ previouslyCheckedKeys, setPreviouslyCheckedKeys ] = useState<string[]>([]);
        const [ defaultExpandedKeys, setDefaultExpandKeys ] = useState<string[]>([]);
        const [ isPermissionsLoading, setIsPermissionsLoading ] = useState<boolean>(true);

        useEffect(() => {
            const checkedNodes: TreeNode[] = [];

            OrganizationRoleManagementUtils.getAllOrganizationLevelPermissions(permissionsToHide)
                .then((permissionTree: TreeNode[]) => {
                    setPermissions(permissionTree);
                    setDefaultExpandKeys([ permissionTree[0].key.toString() ]);
                    setIsPermissionsLoading(false);
                });

            if (initialValues && initialValues.length > 0) {
                const previousFormCheckedKeys: string[] = [];

                initialValues.forEach(initialKey => {
                    previousFormCheckedKeys.push(initialKey.key.toString());
                });
                setPreviouslyCheckedKeys(previousFormCheckedKeys);
                previouslyCheckedKeys?.forEach(key => {
                    checkedNodes.push(getNodeByKey(key, permissions));
                });
                setCheckedPermission(checkedNodes);
            }

            if (isRole && roleObject) {
                setPreviouslyCheckedKeys(roleObject.permissions);
                previouslyCheckedKeys?.forEach(key => {
                    checkedNodes.push(getNodeByKey(key, permissions));
                });
                setCheckedPermission(checkedNodes);
            }
        }, [ permissions.length > 0 ]);

        /**
         * Util function to disable checking of a node and it's children.
         *
         * @param permissionNodes - array of permission nodes
         * @param state - disable state
         */
        const disableTreeNode = (permissionNodes: TreeNode[], state: boolean) => {
            permissionNodes.forEach((permission: TreeNode) => {
                permission.disableCheckbox = state;
                if (permission.children) {
                    disableTreeNode(permission.children, state);
                }
            });
        };

        /**
         * Event handler when a node is checked on the permission tree.
         *
         * @param checked - checked states of the node
         * @param info - checked information
         */
        const onCheck = (checked: { checked: React.ReactText[]; halfChecked: React.ReactText[] }, info) => {
            if (info.checked) {
                if (!checkedPermission.find(permission => permission.key === info.node.key)) {
                    const parentNode: TreeNode = getNodeByKey(info.node.key, permissions, true);
                    let checkedChildren: number = 1;

                    parentNode?.children?.forEach((childPermission: TreeNode) => {
                        if (checkedPermission.filter((checkedPermission: TreeNode) =>
                            checkedPermission.key === childPermission.key).length > 0) {
                            ++checkedChildren;
                        }
                    });
                    if (parentNode?.children?.length === checkedChildren) {
                        const filteredCheckedPermissions = checkedPermission.filter((permission: TreeNode) => {
                            permission.key.toString().replace(/^\/|\/$/g, "").split("/") === parentNode.key.toString()
                                .replace(/^\/|\/$/g, "").split("/");
                        });

                        setCheckedPermission([ ...filteredCheckedPermissions, parentNode ]);
                    } else {
                        setCheckedPermission([ ...checkedPermission, info.node ]);
                    }
                }
            } else {
                setCheckedPermission(info.checkedNodes);
            }
        };

        /**
         * Util method to find a node from a given key.
         *
         * @param key - key to be found
         * @param permissionTree - permission tree to traverse
         * @param isParent - condition to find the parent of the key node
         */
        const getNodeByKey = (key: string, permissionTree: TreeNode[], isParent: boolean = false): TreeNode => {
            const flattenedTree = [ permissionTree[0] ];

            while (flattenedTree.length) {
                const node = flattenedTree.shift();

                if (isParent) {
                    if (node.key === key.slice(0, key.lastIndexOf("/"))) {
                        return node;
                    }
                } else {
                    if (node.key === key) {
                        return node;
                    }
                }

                if (node.children) {
                    flattenedTree.push(...node.children);
                }
            }

            return null;
        };

        /**
         * Util method to get a custom expander icon for
         * the tree nodes.
         * @param eventObject - event object
         */
        const switcherIcon = eventObject => {
            if (eventObject.isLeaf) {
                return null;
            }

            return (
                <div className="tree-arrow-wrap">
                    <span className={ `tree-arrow ${!eventObject.expanded ? "active" : ""}` }>
                        <span></span>
                        <span></span>
                    </span>
                </div>
            );
        };

        const renderChildren = (): ReactElement => (
            <>
                <Forms
                    submitState={ triggerSubmit }
                    onSubmit={ () => {
                        onSubmit(checkedPermission);
                    } }
                >
                    {
                        !isPermissionsLoading
                            ? (
                                <div className="treeview-container">
                                    <Tree
                                        className={ "customIcon" }
                                        data-testid={ `${testId}-tree` }
                                        disabled={ isReadOnly }
                                        checkedKeys={ checkedPermission.map(permission => permission.key) }
                                        defaultExpandedKeys={ defaultExpandedKeys }
                                        showLine
                                        showIcon={ false }
                                        checkable
                                        selectable={ false }
                                        onCheck={ onCheck }
                                        treeData={ permissions }
                                        switcherIcon={ switcherIcon }
                                    />
                                </div>
                            )
                            : <ContentLoader className="p-3" active/>
                    }
                    { isEdit && !isPermissionsLoading && (
                        <>
                            <Divider hidden/>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <Button
                                        data-testid={ `${testId}-update-button` }
                                        primary
                                        type="submit"
                                        loading={ isSubmitting }
                                        disabled={ isSubmitting }
                                        size="small"
                                        className="form-button"
                                    >
                                        { t("console:manage.features.roles.addRoleWizard.permissions.buttons.update") }
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </>
                    ) }
                </Forms>
            </>
        );

        return (
            emphasize
                ? (
                    <EmphasizedSegment data-testid={ testId } padded="very">
                        { renderChildren() }
                    </EmphasizedSegment>
                )
                : (
                    <div data-testid={ testId }>
                        { renderChildren() }
                    </div>
                )
        );
    };

/**
 * Default props for the component.
 */
OrganizationPermissionList.defaultProps = {
    emphasize: true,
    isReadOnly: false
};
