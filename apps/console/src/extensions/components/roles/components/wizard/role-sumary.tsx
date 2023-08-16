/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { UserAvatar } from "@wso2is/react-components";
import Tree from "rc-tree";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Label } from "semantic-ui-react";
import { TreeNode } from "../../../../../features/roles/models";
import { RoleManagementUtils } from "../../../../../features/roles/utils";

interface AddUserWizardSummaryProps extends TestableComponentInterface {
    summary: any;
    triggerSubmit: boolean;
    isAddGroup: boolean;
    onSubmit: (application: any) => void;
}

/**
 * Component to create a summary of the role which will be created.
 * 
 * @param props props containing summary data for the view.
 */
export const CreateRoleSummary: FunctionComponent<AddUserWizardSummaryProps> = (
    props: AddUserWizardSummaryProps
): ReactElement => {
    
    const {
        summary,
        triggerSubmit,
        onSubmit,
        isAddGroup,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    
    const [ permissions, setPermissions ] = useState<TreeNode[]>([]);
    const [ defaultExpandedKeys, setDefaultExpandKeys ] = useState<string[]>([]);
    const [ selectedPermissions, setSelectedPermissions ] = useState<string[]>([]);

    useEffect(() => {
        RoleManagementUtils.getAllPermissions().then((permissionTree: TreeNode[]) => {
            setPermissions(permissionTree);
            setDefaultExpandKeys( [ permissionTree[0].key.toString() ] );

            if (summary && summary.PermissionList) {
                const permissions = summary.PermissionList;
                setSelectedPermissions([...selectedPermissions, ...permissions.map( permission => permission.key )]);
            }
        });
    }, [ permissions.length > 0 ]);

    /**
     * Submits the form programmatically if triggered from outside.
     */
    useEffect(() => {
        if (!triggerSubmit) {
            return;
        }

        onSubmit(summary);
    }, [ triggerSubmit ]);


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
                <span className={ `tree-arrow ${ !eventObject.expanded ? "active" : "" }` }>
                    <span></span>
                    <span></span>
                </span>
            </div>
        );
    };

    return (
        <Grid className="wizard-summary">
            { summary?.BasicDetails && (
                <>
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div
                                data-testid={ `${ testId }-role-name-label` }
                                className="label"
                            >
                                {
                                    isAddGroup ?
                                        t("console:manage.features.roles.addRoleWizard.summary.labels.roleName",
                                            { type: "Group" }) :
                                        t("console:manage.features.roles.addRoleWizard.summary.labels.roleName",
                                            { type: "Role" })
                                }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div
                                data-testid={ `${ testId }-role-name-value` }
                                className="value url"
                            >
                                { summary.BasicDetails.roleName }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </>
            ) }
            {
                summary?.PermissionList &&
                summary.PermissionList instanceof Array &&
                summary.PermissionList.length > 0 &&
                     (
                        <Grid.Row className="summary-field" columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                                <div
                                    data-testid={ `${ testId }-permissions-label` }
                                    className="label"
                                >
                                    { t("console:manage.features.roles.addRoleWizard.summary.labels.permissions") }
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <Label.Group>
                                    <Tree
                                        className={ "customIcon" }
                                        data-testid={ `${ testId }-tree` }
                                        disabled
                                        checkedKeys={ selectedPermissions }
                                        defaultExpandedKeys={ defaultExpandedKeys }
                                        showLine
                                        showIcon={ false }
                                        checkable
                                        selectable={ false }
                                        treeData={ permissions }
                                        switcherIcon={ switcherIcon }
                                    />
                                </Label.Group>
                            </Grid.Column>
                        </Grid.Row>
                    )
            }
            {
                summary?.UserList && summary?.UserList instanceof Array &&
                summary?.UserList?.length > 0
                    ? (
                        <Grid.Row className="summary-field" columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                                <div
                                    data-testid={ `${ testId }-users-label` }
                                    className="label"
                                >
                                    { t("console:manage.features.roles.addRoleWizard.summary.labels.users") }
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <Label.Group>
                                    {
                                        summary?.UserList
                                            .map((user, index) => (
                                                <div key={ index } className="role-summary-user">
                                                    <UserAvatar
                                                        name={ user.userName }
                                                        size="mini"
                                                        floated="left"
                                                        image={ user.profileUrl }
                                                    />
                                                    { user.userName }
                                                </div>
                                            ))
                                    }
                                </Label.Group>
                            </Grid.Column>
                        </Grid.Row>
                    )
                    : null
            }
            {
                summary?.GroupList && summary?.GroupList instanceof Array &&
                    summary?.GroupList?.length > 0
                    ? (
                        <Grid.Row className="summary-field" columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                                <div
                                    data-testid={ `${ testId }-users-label` }
                                    className="label"
                                >
                                    { t("console:manage.features.roles.addRoleWizard.summary.labels.groups") }
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <Label.Group>
                                    {
                                        summary?.GroupList
                                            .map((group, index) => (
                                                <Label
                                                    data-testid={
                                                        `${ testId }-permissions-${ index }-label`
                                                    }
                                                    key={ index }
                                                    basic
                                                    circular
                                                >
                                                    { group?.displayName }
                                                </Label>
                                            ))
                                    }
                                </Label.Group>
                            </Grid.Column>
                        </Grid.Row>
                    )
                    : null
            }
        </Grid>
    );
};
