/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Grid from "@oxygen-ui/react/Grid";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemIcon from "@oxygen-ui/react/ListItemIcon";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Paper from "@oxygen-ui/react/Paper";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import {
    OrganizationInterface,
    OrganizationRoleInterface,
    SelectedOrganizationRoleInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    ChangeEvent,
    Dispatch as ReactDispatch,
    SetStateAction,
    SyntheticEvent,
    useEffect,
    useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import useGetApplicationShare from "../../api/use-get-application-share";
import { ConsoleRolesOnboardingConstants } from "../../constants/console-roles-onboarding-constants";
import useConsoleRoles from "../../hooks/use-console-roles";
import useConsoleSettings from "../../hooks/use-console-settings";
import "./console-roles-selective-share.scss";

interface ConsoleRolesSelectiveShareProps extends IdentifiableComponentInterface {
    roleSelections: Record<string, SelectedOrganizationRoleInterface[]>;
    setRoleSelections: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
}

const ConsoleRolesSelectiveShare = (props: ConsoleRolesSelectiveShareProps) => {
    const {
        [ "data-componentid" ]: componentId = "console-roles-selective-share-modal",
        roleSelections,
        setRoleSelections
    } = props;

    const organizationName: string = store.getState().auth.tenantDomain;
    const organizationId: string = useSelector((state: AppState) => state?.organization?.organization?.id);

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { consoleId } = useConsoleSettings();

    const [ selectedOrgId, setSelectedOrgId ] = useState<string>();
    const [ readOnly, setReadOnly ] = useState<boolean>(true);
    const [ selectedOrgName, setSelectedOrgName ] = useState<string>();
    const [ organizationTree, setOrganizationTree ] = useState<TreeViewBaseItem[]>([
        {
            children: [],
            id: organizationName,
            label: organizationName
        }
    ]);

    const {
        data: originalOrganizationTree,
        isLoading: isOrganizationTreeFetchRequestLoading,
        error:  originalOrganizationTreeFetchRequestError
    } = useGetApplicationShare(
        consoleId,
        !isEmpty(consoleId)
    );

    const {
        consoleRoles,
        consoleRolesFetchRequestError
    } = useConsoleRoles(true, null, null, null);

    useEffect(() => {
        if (originalOrganizationTree?.organizations?.length > 0) {
            const orgTree: TreeViewBaseItem[] = buildTree(originalOrganizationTree?.organizations);

            if (orgTree.length > 0) {
                setOrganizationTree(orgTree);
                setSelectedOrgId(orgTree[0].id);
                setSelectedOrgName(orgTree[0].label);
            }
        }
    }, [ originalOrganizationTree ]);

    useEffect(() => {
        if (
            originalOrganizationTree?.organizations?.length > 0 &&
            consoleRoles?.Resources?.length > 0
        ) {
            const rootRoles: SelectedOrganizationRoleInterface[] = consoleRoles.Resources.map(
                (role: SelectedOrganizationRoleInterface) => ({
                    ...role,
                    selected: true
                }));

            const computedRoleSelections: Record<string, SelectedOrganizationRoleInterface[]> =
            computeInitialRoleSelections(
                originalOrganizationTree.organizations,
                organizationId,
                rootRoles
            );

            setRoleSelections(computedRoleSelections);
        }
    }, [ originalOrganizationTree, consoleRoles ]);

    useEffect(() => {
        if (originalOrganizationTreeFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("consoleSettings:sharedAccess.notifications.fetchOrgTree.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.fetchOrgTree.genericError.message")
                })
            );
        }
    }, [ isOrganizationTreeFetchRequestLoading ]);

    useEffect(() => {
        if (consoleRolesFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("consoleSettings:sharedAccess.notifications.fetchConsoleRoles." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("consoleSettings:sharedAccess.notifications.fetchConsoleRoles.genericError.message")
                })
            );
        }
    }, [ consoleRolesFetchRequestError ]);

    const buildTree = (data: OrganizationInterface[]): TreeViewBaseItem[] => {
        const nodeMap: Record<string, TreeViewBaseItem> = {};

        // Add all nodes to nodeMap (except root)
        data.forEach((item: OrganizationInterface) => {
            nodeMap[item.id] = {
                children: [],
                id: item.id,
                label: item.name
            };
        });

        // Build tree by assigning children to their parents
        data.forEach((item: OrganizationInterface) => {
            if (item.parentId === organizationId) {
                // Top-level node, skip adding to a parent
                return;
            }

            const parent: TreeViewBaseItem = nodeMap[item.parentId];

            if (parent) {
                if (!parent.children) parent.children = [];
                parent.children.push(nodeMap[item.id]);
            }
        });

        // Return level 1 nodes (whose parent is the root)
        return data
            .filter((item: OrganizationInterface) => item.parentId === organizationId)
            .map((item: OrganizationInterface) => nodeMap[item.id]);
    };

    const getChildrenOfOrganization = (parentId: string): string[] => {
        const allOrgs: OrganizationInterface[] = originalOrganizationTree?.organizations || [];

        return allOrgs
            .filter((org: OrganizationInterface) => org.parentId === parentId)
            .map((org: OrganizationInterface) => org.id);
    };

    const cascadeRoleRemoval = (parentId: string, removedRole: SelectedOrganizationRoleInterface) => {
        const children: string[] = getChildrenOfOrganization(parentId);

        children.forEach((childId: string) => {
            const childRoles: SelectedOrganizationRoleInterface[] = roleSelections[childId];

            if (childRoles) {
                const updatedRoles: SelectedOrganizationRoleInterface[] = childRoles.filter(
                    (role: SelectedOrganizationRoleInterface) => role.displayName !== removedRole.displayName);

                setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                    ...prev,
                    [childId]: updatedRoles
                }));

                // Recursive cleanup down the tree
                cascadeRoleRemoval(childId, removedRole);
            }
        });
    };

    const roleAdditionToChildren = (parentId: string, addedRole: SelectedOrganizationRoleInterface) => {
        const children: string[] = getChildrenOfOrganization(parentId);

        children.forEach((childId: string) => {
            const existingRoles: SelectedOrganizationRoleInterface[] = roleSelections[childId] || [];

            const alreadyHasRole: boolean = existingRoles.some(
                (role: SelectedOrganizationRoleInterface) => role.displayName === addedRole.displayName
            );

            if (!alreadyHasRole) {
                const updatedRoles: SelectedOrganizationRoleInterface[] = [
                    ...existingRoles,
                    {
                        ...addedRole,
                        selected: false
                    }
                ];

                setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                    ...prev,
                    [childId]: updatedRoles
                }));
            }
        });
    };

    const computeInitialRoleSelections = (
        orgs: OrganizationInterface[],
        rootId: string,
        rootRoles: SelectedOrganizationRoleInterface[]
    ): Record<string, SelectedOrganizationRoleInterface[]> => {
        const roleMap: Record<string, SelectedOrganizationRoleInterface[]> = {
            [rootId]: rootRoles
        };

        const buildRolesForChildren = (parentId: string) => {
            const parentRoles: SelectedOrganizationRoleInterface[] = roleMap[parentId];

            orgs?.filter((org: OrganizationInterface) => org.parentId === parentId)
                .forEach((childOrg:OrganizationInterface) => {
                    const inheritedRoles: SelectedOrganizationRoleInterface[] = parentRoles.filter(
                        (role: SelectedOrganizationRoleInterface) => role.selected);

                    roleMap[childOrg.id] = inheritedRoles.map((role: SelectedOrganizationRoleInterface) => ({
                        ...role,
                        selected: childOrg.roles?.some(
                            (orgRole: OrganizationRoleInterface) => orgRole.displayName === role.displayName
                        ) || false
                    }));

                    // Recursive call for next level
                    buildRolesForChildren(childOrg.id);
                });
        };

        buildRolesForChildren(rootId);

        return roleMap;
    };

    return (
        <>
            <Button
                variant="text"
                size="small"
                onClick={ () => setReadOnly(!readOnly) }
            >
                { readOnly
                    ? "Manage Role Sharing"
                    : "View Shared Roles"
                }
            </Button>
            <Paper
                variant="outlined"
                className="roles-selective-share-container"
            >
                <Grid
                    container
                    xs={ 12 }
                    className="roles-selective-share-header"
                >
                    <Grid
                        xs={ 6 }
                        md={ 8 }
                        padding={ 2 }
                        className="left-content"
                    >
                        <Heading as="h5">
                            { t("consoleSettings:sharedAccess.organizations") }
                        </Heading>
                    </Grid>
                    <Grid
                        xs={ 6 }
                        md={ 4 }
                        padding={ 2 }
                        style={ { backgroundColor: "rgb(250 249 248)" } }
                    >
                        <Heading as="h5" className="header-title">
                            { readOnly
                                ? "Selected Roles" + ` for ${ selectedOrgName }`
                                : t("consoleSettings:sharedAccess.availableRoles") + ` for ${ selectedOrgName }`
                            }
                        </Heading>
                    </Grid>
                </Grid>
                <Grid
                    container
                    xs={ 12 }
                    className="roles-selective-share-content-container"
                >
                    <Grid
                        container
                        xs={ 6 }
                        md={ 8 }
                        paddingRight={ 2 }
                        className="roles-selective-share-content left-content"
                    >
                        <RichTreeView
                            className="roles-selective-share-tree-view"
                            items={ organizationTree }
                            defaultSelectedItems={ [ organizationName ] }
                            expansionTrigger="iconContainer"
                            onItemClick={ (_e: SyntheticEvent, itemId: string) => {
                                setSelectedOrgId(itemId);
                                const org: OrganizationInterface = originalOrganizationTree?.organizations?.find(
                                    (org: OrganizationInterface) => org.id === itemId);

                                setSelectedOrgName(org?.name || organizationName);
                            } }
                            // selectionPropagation={ {
                            //     parents: true
                            // } }
                            // checkboxSelection={ !readOnly }
                            // multiSelect
                        />
                    </Grid>
                    <Grid
                        container
                        xs={ 6 }
                        md={ 4 }
                        className="roles-selective-share-content"
                        style={ { backgroundColor: "rgb(250 249 248)" } }
                    >
                        <List
                            disablePadding
                        >
                            { !isEmpty(roleSelections[selectedOrgId]) && (
                                roleSelections[selectedOrgId]?.filter((role: SelectedOrganizationRoleInterface) =>
                                    readOnly ? role.selected : true)
                                    .map(
                                        (role: SelectedOrganizationRoleInterface, index: number) => (
                                            <ListItem
                                                key={ `role-${ index }` }
                                                className="roles-selective-share-list-item"
                                                data-componentid={ `${componentId}-role-${ index }` }
                                            >
                                                { !readOnly && (
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            data-componentid={
                                                                `${componentId}-role-checkbox-${ index }` }
                                                            edge="start"
                                                            checked={ role.selected }
                                                            onChange={ (
                                                                _e: ChangeEvent<HTMLInputElement>
                                                            ) => {
                                                                const updatedRoles: SelectedOrganizationRoleInterface[]
                                                                = roleSelections[selectedOrgId].map(
                                                                    (r: SelectedOrganizationRoleInterface) => {
                                                                        if (r.displayName === role.displayName) {
                                                                            return { ...r, selected: !r.selected };
                                                                        }

                                                                        return r;
                                                                    }
                                                                );

                                                                setRoleSelections((prev: Record<string,
                                                                    SelectedOrganizationRoleInterface[]>) => ({
                                                                    ...prev,
                                                                    [selectedOrgId]: updatedRoles
                                                                }));

                                                                if (role.selected) {
                                                                    // Role is being unchecked
                                                                    cascadeRoleRemoval(selectedOrgId, role);
                                                                } else {
                                                                    // Role is being checked
                                                                    roleAdditionToChildren(selectedOrgId, role);
                                                                }
                                                            } }
                                                            disabled={ role.displayName ===
                                                                ConsoleRolesOnboardingConstants.ADMINISTRATOR }
                                                        />
                                                    </ListItemIcon>
                                                ) }
                                                <ListItemText
                                                    primary={ role.displayName }
                                                    data-componentid={ `${componentId}-role-text-${ index }` }
                                                />
                                            </ListItem>
                                        )))
                            }
                        </List>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
};

export default ConsoleRolesSelectiveShare;
