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
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Grid from "@oxygen-ui/react/Grid";
import Paper from "@oxygen-ui/react/Paper";
import Table from "@oxygen-ui/react/Table";
import TableCell from "@oxygen-ui/react/TableCell";
import TableRow from "@oxygen-ui/react/TableRow";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import {
    OrganizationInterface,
    OrganizationRoleInterface,
    SelectedOrganizationRoleInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, LinkButton } from "@wso2is/react-components";
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
import { Modal } from "semantic-ui-react";
import useGetApplicationShare from "../../api/use-get-application-share";
import useConsoleRoles from "../../hooks/use-console-roles";
import useConsoleSettings from "../../hooks/use-console-settings";
import "./console-roles-selective-share.scss";

interface ConsoleRolesSelectiveShareProps extends IdentifiableComponentInterface {
    open: boolean;
    closeWizard: () => void;
    roleSelections: Record<string, SelectedOrganizationRoleInterface[]>;
    setRoleSelections: ReactDispatch<SetStateAction<Record<string, SelectedOrganizationRoleInterface[]>>>;
}

const ConsoleRolesSelectiveShare = (props: ConsoleRolesSelectiveShareProps) => {
    const {
        [ "data-componentid" ]: componentId = "console-roles-selective-share-modal",
        open,
        closeWizard,
        roleSelections,
        setRoleSelections
    } = props;

    const organizationName: string = store.getState().auth.tenantDomain;
    const organizationId: string = useSelector((state: AppState) => state?.organization?.organization?.id);

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { consoleId } = useConsoleSettings();

    const [ selectedOrgId, setSelectedOrgId ] = useState<string>(organizationId);
    const [ selectedOrgName, setSelectedOrgName ] = useState<string>(organizationName);
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
            setOrganizationTree(buildTree(originalOrganizationTree?.organizations));
        }
    }, [ originalOrganizationTree ]);

    useEffect(() => {
        // If the console roles are fetched, that means they are already shared with the organization.
        if (consoleRoles?.Resources?.length > 0) {
            const rootRoles: SelectedOrganizationRoleInterface[] = consoleRoles.Resources.map(
                (role: OrganizationRoleInterface) => ({
                    ...role,
                    selected: true
                }));

            setRoleSelections({
                [organizationId]: rootRoles
            });
        }
    }, [ consoleRoles ]);

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

        // Create the manually specified root node
        const rootNode: TreeViewBaseItem = {
            children: [],
            id: organizationId,
            label: organizationName
        };

        nodeMap[organizationId] = rootNode;

        // Add all other nodes to nodeMap
        data.forEach((item: OrganizationInterface) => {
            if (item.id === organizationId) return; // Ignore if it's the root

            nodeMap[item.id] = {
                children: [],
                id: item.id,
                label: item.name
            };
        });

        // Build tree structure by assigning children to parents
        data.forEach((item: OrganizationInterface) => {
            if (item.id === organizationId) return; // Ignore the root

            const node: TreeViewBaseItem = nodeMap[item.id];
            const parent: TreeViewBaseItem = nodeMap[item.parentId];

            if (parent) {
                if (!parent.children) parent.children = [];
                parent.children.push(node);
            }
        });

        return [ rootNode ];
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

    const resolveAvailableRoles = (orgId: string): void => {
        setSelectedOrgId(orgId);

        const allOrgs: OrganizationInterface[] = [ ...originalOrganizationTree.organizations ];

        const selectedOrg: OrganizationInterface = allOrgs.find((org: OrganizationInterface) => org.id === orgId);

        if (!selectedOrg) return;

        if (orgId === organizationId) {
            setSelectedOrgName(organizationName);
        } else {
            setSelectedOrgName(selectedOrg.name);
        }

        const parentId: string = selectedOrg.parentId;
        const parentRoles: SelectedOrganizationRoleInterface[] = roleSelections[parentId];

        if (!parentRoles) return;

        const inheritedRoles: SelectedOrganizationRoleInterface[] = parentRoles.filter(
            (role: SelectedOrganizationRoleInterface) => role.selected);

        // If the org is already present in roleSelections, cherry-pick the inherited roles
        // If the roleSelections have roles which are not in inherited roles, remove them
        // If the inherited roles have roles which are not in roleSelections, add them
        if (roleSelections[orgId]) {
            const currentRoles: SelectedOrganizationRoleInterface[] = roleSelections[orgId];

            // Remove roles that are not in inherited roles
            const updatedRoles: SelectedOrganizationRoleInterface[] = currentRoles.filter(
                (role: SelectedOrganizationRoleInterface) => inheritedRoles.some(
                    (inheritedRole: SelectedOrganizationRoleInterface) => inheritedRole.displayName === role.displayName
                ));

            // Add inherited roles that are not already selected
            // If the organization has the role in roles array, it should be selected by default
            inheritedRoles.forEach((inheritedRole: SelectedOrganizationRoleInterface) => {
                if (!updatedRoles.some(
                    (role: SelectedOrganizationRoleInterface) => role.displayName === inheritedRole.displayName)) {
                    updatedRoles.push({
                        ...inheritedRole,
                        selected: selectedOrg.roles?.some(
                            (role: OrganizationRoleInterface) => role.displayName === inheritedRole.displayName
                        ) || false
                    });
                }
            });

            setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
                ...prev,
                [orgId]: updatedRoles
            }));

            return;
        }

        // If the org is not present in roleSelections, assign inherited roles directly
        // If the organization has the role in roles array, it should be selected by default
        setRoleSelections((prev: Record<string, SelectedOrganizationRoleInterface[]>) => ({
            ...prev,
            [orgId]: inheritedRoles.map((roles: SelectedOrganizationRoleInterface) => ({
                ...roles,
                selected:  selectedOrg.roles?.some(
                    (role: OrganizationRoleInterface) => role.displayName === roles.displayName
                ) || false
            }))
        }));
    };

    return (
        <Modal
            data-componentid={ componentId }
            open={ open }
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                Select Roles for Organization { selectedOrgName }
            </Modal.Header>
            <Modal.Content className="roles-selective-share-modal-content" scrolling>
                <Grid container rowSpacing={ 2 }>
                    <Grid xs={ 6 }>
                        <Heading as="h5" className="wizard-sub-header">
                            Organizations
                        </Heading>
                    </Grid>
                    <Grid xs={ 6 }>
                        <Heading as="h5" className="wizard-sub-header">
                            Available Roles
                        </Heading>
                    </Grid>
                    <Grid container xs={ 6 } paddingRight={ 2 } marginTop={ 1 }>
                        <Box width={ "100%" }>
                            <RichTreeView
                                items={ organizationTree }
                                defaultSelectedItems={ [ organizationName ] }
                                onItemClick={ (event: SyntheticEvent, item: string) => {
                                    resolveAvailableRoles(item);
                                } }
                            />
                        </Box>
                    </Grid>
                    <Grid container xs={ 6 }>
                        <Paper elevation={ 0 } className="roles-selective-share-table-container">
                            <Table size="small">
                                { !isEmpty(roleSelections[selectedOrgId]) ? (
                                    roleSelections[selectedOrgId]?.map(
                                        (role: SelectedOrganizationRoleInterface, index: number) => (
                                            <TableRow key={ `role-${ index }` }>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={ role.selected }
                                                        onChange={ (_e: ChangeEvent<HTMLInputElement>) => {
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

                                                            // If deselected, propagate removal to children
                                                            if (role.selected) {
                                                                cascadeRoleRemoval(selectedOrgId, role);
                                                            }
                                                        } }
                                                    />
                                                    { role.displayName }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                ) : null
                                }
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Grid container alignItems="center" justifyContent="space-between" marginX={ 1 }>
                    <LinkButton
                        data-componentid={ `${ componentId }-cancel-button` }
                        floated="left"
                        onClick={ () => {
                            closeWizard();
                        } }
                    >
                        { t("common:cancel") }
                    </LinkButton>
                    <Button
                        data-componentid={ `${ componentId }-save-button` }
                        variant="contained"
                        size="small"
                        onClick={ () => null }
                    >
                        { t("common:save") }
                    </Button>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

export default ConsoleRolesSelectiveShare;
