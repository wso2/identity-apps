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
import { AlertInterface, BasicProfileInterface } from "../../models";
import { useTranslation } from "react-i18next";
import { Heading, Hint, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { Grid, Icon, Input, Label, List, Modal, Segment } from "semantic-ui-react";
import { getGroupsList, updateUserRoles } from "../../api";
import _ from "lodash";
import { AlertLevels } from "@wso2is/core/dist/src/models";

interface UserRolesPropsInterface {
    user: BasicProfileInterface;
    onAlertFired: (alert: AlertInterface) => void;
    handleUserUpdate: (userId: string) => void;
}

export const UserRolesList: FunctionComponent<UserRolesPropsInterface> = (
    props: UserRolesPropsInterface
): ReactElement => {

    const {
        onAlertFired,
        user,
        handleUserUpdate
    } = props;

    const [ appRoles, setAppRoles ] = useState(new Map<string, string>());
    const [ internalRoles, setInternalRoles ] = useState(new Map<string, string>());
    const [ primaryRoles, setPrimaryRoles ] = useState(new Map<string, string>());
    const [ showAddNewRoleModal, setAddNewRoleModalView ] = useState(false);
    const [ roleList, setRoleList ] = useState<any>([]);
    const [ tempRoleList, setTempRoleList ] = useState([]);
    const [ selectedDomain, setSelectedDomain ] = useState("");

    const { t } = useTranslation();

    /**
     * The following function remove already assigned roles from the initial
     * role specific to it's domain.
     *
     * @param domain
     * @param roleList
     */
    const removeExistingRoles = (domain: string, roleList) => {
        const roleListCopy = [ ...roleList ];
        if (domain === "Application") {
            const addedAppRoles = [];
            _.forEachRight(roleListCopy, (role) => {
                if (appRoles.has(role.displayName)) {
                    addedAppRoles.push(role);
                    roleListCopy.splice(roleListCopy.indexOf(role), 1);
                }
            });
            setTempRoleList(addedAppRoles);
            setRoleList(roleListCopy);
        } else if (domain === "Internal") {
            const addedInternalRoles = [];
            _.forEachRight(roleListCopy, (role) => {
                if (internalRoles.has(role.displayName)) {
                    addedInternalRoles.push(role);
                    roleListCopy.splice(roleListCopy.indexOf(role), 1);
                }
            });
            setTempRoleList(addedInternalRoles);
            setRoleList(roleListCopy);
        } else {
            const addedPrimaryRoles = [];
            _.forEachRight(roleListCopy, (role) => {
                if (primaryRoles.has(role.displayName)) {
                    addedPrimaryRoles.push(role);
                    roleListCopy.splice(roleListCopy.indexOf(role), 1);
                }
            });
            setTempRoleList(addedPrimaryRoles);
            setRoleList(roleListCopy);
        }
    };

    const getRolesList = (domain: string) => {
        setSelectedDomain(domain);
        getGroupsList(domain)
            .then((response) => {
                removeExistingRoles(domain, response.data.Resources);
                setAddNewRoleModalView(true);
            });
    };

    const handleRemoveRoleItem = (role: any) => {
        const userRolesCopy = [ ...tempRoleList ];
        userRolesCopy.splice(tempRoleList.indexOf(role), 1);
        setTempRoleList(userRolesCopy);

        // When a role is removed from the assigned list it is appended
        // back to the initial list.
        setRoleList([ ...roleList, role]);
    };

    const addRole = (role: any) => {
        if (!(tempRoleList.includes(role))) {
            setTempRoleList([ ...tempRoleList, role ]);

            // When a role is added to the assigned role list it is removed
            // from the initial list.
            const roleListCopy = [ ...roleList ];
            roleListCopy.splice(roleList.indexOf(role), 1);
            setRoleList(roleListCopy);
        }
    };

    const handleSearchFieldChange = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), 'i');

            roleList && roleList.map((role) => {
                isMatch = re.test(role.displayName);
                if (isMatch) {
                    filteredRoleList.push(role);
                    setRoleList(filteredRoleList);
                }
            });
        } else {
            setRoleList(roleList);
        }
    };

    /**
     * The following function maps the role list of the user
     * the role categories available.
     */
    const mapUserRolesToCategories = () => {
        const applicationRoles = new Map<string, string> ();
        const intRoles = new Map<string, string> ();
        const primRoles = new Map<string, string> ();

        if (user.groups && user.groups instanceof Array) {
            _.forEachRight (user.groups, (group) => {
                const role = group.display.split("/");
                const prefix = role[0];

                if (prefix === "Application") {
                    applicationRoles.set(group.display, group.value);
                } else if (prefix === "Internal") {
                    intRoles.set(group.display, group.value);
                } else {
                    primRoles.set(group.display, group.value);
                }
            });
            setAppRoles(applicationRoles);
            setInternalRoles(intRoles);
            setPrimaryRoles(primRoles);
        }
    };

    useEffect(() => {
        if (!(user)) {
            return;
        }
        mapUserRolesToCategories();
    }, []);

    /**
     * The following useEffect will be triggered when the
     * roles are updated.
     */
    useEffect(() => {
        if (!(user)) {
            return;
        }
        mapUserRolesToCategories();
    }, [ user ]);

    const handelAddNewRoleModalClose = () => {
        setAddNewRoleModalView(false);
    };

    /**
     * This function handles assigning the roles to the user.
     */
    const updateUserRole = (user: any, roles: any) => {
        const roleIds = [];

        roles.map((role) => {
            roleIds.push(role.id);
        });

        const bulkRemoveData: any = {
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:BulkRequest" ],
            Operations: []
        };

        const bulkAddData: any = {
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:BulkRequest" ],
            Operations: []
        };

        let removeOperation = {
            method: "PATCH",
            data: {
                "Operations": [
                    {
                        "op": "remove",
                        "path": "members[display eq" + " " + user.userName + "]"
                    }
                ]
            }
        };

        let addOperation = {
            method: "PATCH",
            data: {
                "Operations": [
                    {
                        "op": "add",
                        "value": {
                            "members": [
                                {
                                    "display": user.userName,
                                    "value": user.id
                                }
                            ]
                        }
                    }
                ]
            }
        };

        const removeOperations = [];
        const addOperations = [];
        let removedIds = [];

        if (selectedDomain === "Application") {
            removedIds = [ ...appRoles?.values()];
        } else if (selectedDomain === "Internal") {
            removedIds = [ ...internalRoles?.values()];
        } else {
            removedIds = [ ...primaryRoles?.values()];
        }

        if (roleIds?.length > 0) {
            roleIds.map((roleId) => {
                if (removedIds?.includes(roleId)) {
                    removedIds.splice(removedIds.indexOf(roleId), 1);
                }
            });
        }

        if (removedIds && removedIds.length > 0) {
            removedIds.map((id) => {
                removeOperation = {
                    ...removeOperation,
                    ...{ path: "/Groups/" + id }
                };
                removeOperations.push(removeOperation);
            });

            removeOperations.map((operation) => {
                bulkRemoveData.Operations.push(operation);
            });

            updateUserRoles(bulkRemoveData)
                .then(() => {
                    onAlertFired({
                        description: "Removing assigned roles for the user successful",
                        level: AlertLevels.SUCCESS,
                        message: "Update user roles successful"
                    });
                    handelAddNewRoleModalClose();
                    handleUserUpdate(user.id);
                })
                .catch((error) => {
                    onAlertFired({
                        description: "An error occurred while updating user roles",
                        level: AlertLevels.ERROR,
                        message: "Something went wrong"
                    });
                });
        } else {
            roleIds.map((id) => {
                addOperation = {
                    ...addOperation,
                    ...{ path: "/Groups/" + id }
                };
                addOperations.push(addOperation);
            });

            addOperations.map((operation) => {
                bulkAddData.Operations.push(operation);
            });

            updateUserRoles(bulkAddData)
                .then(() => {
                    onAlertFired({
                        description: "Assigning new roles for the user successful",
                        level: AlertLevels.SUCCESS,
                        message: "Update user roles successful"
                    });
                    handelAddNewRoleModalClose();
                    handleUserUpdate(user.id);
                })
                .catch((error) => {
                    onAlertFired({
                        description: "An error occurred while updating user roles",
                        level: AlertLevels.ERROR,
                        message: "Something went wrong"
                    });
                });
        }
    };

    const addNewRoleModal = () => (
        <Modal open={ showAddNewRoleModal } size="small">
            <Modal.Header>
                Edit user roles
                <Heading subHeading ellipsis as="h6">
                    Add new roles or remove existing roles assigned to the user.
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                <Grid style={ { width: "-webkit-fill-available" } }>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <label>Unassigned roles</label>
                                </Grid.Column>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <Input
                                        icon={ <Icon name="search"/> }
                                        fluid
                                        onChange={ handleSearchFieldChange }
                                        placeholder="Search role"
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column>
                                    <Segment className={ "user-role-list-segment" }>
                                        <List className={ "user-role-list" }>
                                            { roleList &&
                                            roleList.map((role, index) =>{
                                                return (
                                                    <List.Item
                                                        key={ index }
                                                        className={ "user-role-list-item" }
                                                        onClick={ () => addRole(role) }
                                                    >
                                                        { role.displayName }
                                                        <Icon
                                                            name="add"
                                                        />
                                                    </List.Item>
                                                )
                                            })
                                            }
                                        </List>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column>
                            <Grid.Row columns={ 1 } className={ "urlComponentLabelRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <label>Assigned roles</label>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <Segment className={ "user-assigned-roles-segment" }>
                                        {
                                            tempRoleList && tempRoleList.map((role, index) => {
                                                return (
                                                    <Label key={ index }>
                                                        { role.displayName }
                                                        <Icon
                                                            name="delete"
                                                            onClick={ () => handleRemoveRoleItem(role) }
                                                        />
                                                    </Label>
                                                );
                                            })
                                        }
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <PrimaryButton onClick={ () => updateUserRole(user, tempRoleList) }>Save</PrimaryButton>
                <LinkButton onClick={ handelAddNewRoleModalClose }>Cancel</LinkButton>
            </Modal.Actions>
        </Modal>
    );

    return (
        <>
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 8 }>
                        <Heading as="h4">Primary roles</Heading>
                        <Hint>
                            The following are the primary roles assigned to the user at the moment.
                        </Hint>
                        {
                            primaryRoles && primaryRoles.size > 0 ? (
                                <Segment.Group style={ { boxShadow: "none" } }>
                                <Segment clearing className="user-roles-segment-header">
                                    <Icon
                                        className="floated right"
                                        color="grey"
                                        name="plus"
                                    />
                                    <Icon
                                        onClick={ () => getRolesList("Primary") }
                                        className="floated right"
                                        color="grey"
                                        name="pencil alternate"
                                    />
                                </Segment>
                                <Segment className="user-roles-segment">
                                    {
                                        [ ...primaryRoles.keys() ].map((roleName, index) => {
                                            return (
                                            roleName === "admin" ?
                                                (
                                                    <Label color="teal" key={ index }>
                                                        { roleName }
                                                    </Label>
                                                ) :
                                                (
                                                <Label key={ index }>
                                                    { roleName }
                                                </Label>
                                                )
                                            );

                                        })
                                    }
                                </Segment>
                                </Segment.Group>
                            ) : (
                                <Segment.Group style={ { boxShadow: "none" } }>
                                    <Segment clearing className="user-roles-segment-header">
                                        <Icon
                                            className="floated right"
                                            color="grey"
                                            name="plus"
                                        />
                                    </Segment>
                                    <Segment textAlign="center" size="small" className="user-roles-segment">
                                        <Heading subHeading style={ { fontSize: "small", color: "#767676" } }>
                                            No primary roles assigned to this user at the moment.
                                        </Heading>
                                        <PrimaryButton
                                            size="mini"
                                            style={ { padding: "0.7em"} }
                                            onClick={ () => getRolesList("Primary") }
                                        >
                                            <Icon name="plus"/>
                                            Assign new role
                                        </PrimaryButton>
                                    </Segment>
                                </Segment.Group>
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column computer={ 8 }>
                        <Heading as="h4">Application roles</Heading>
                        <Hint>
                            The following are the application roles assigned to the user at the moment.
                        </Hint>
                        {
                            appRoles && appRoles.size > 0 ? (
                                <Segment.Group style={ { boxShadow: "none" } }>
                                    <Segment clearing className="user-roles-segment-header">
                                        <Icon
                                            className="floated right"
                                            color="grey"
                                            name="plus"
                                        />
                                        <Icon
                                            onClick={ () => getRolesList("Application") }
                                            className="floated right"
                                            color="grey"
                                            name="pencil alternate"
                                        />
                                    </Segment>
                                <Segment className="user-roles-segment">
                                    {
                                        [ ...appRoles.keys() ].map((roleName, index) => {
                                            return (
                                                <Label key={ index }>
                                                    { roleName }
                                                </Label>
                                            );
                                        })
                                    }
                                </Segment>
                                </Segment.Group>
                                ) : (
                                    <Segment.Group style={ { boxShadow: "none" } }>
                                        <Segment clearing className="user-roles-segment-header">
                                            <Icon
                                                className="floated right"
                                                color="grey"
                                                name="plus"
                                            />
                                        </Segment>
                                        <Segment textAlign="center" size="small" className="user-roles-segment">
                                            <Heading subHeading style={ { fontSize: "small", color: "#767676" } }>
                                                No application roles assigned to this user at the moment.
                                            </Heading>
                                            <PrimaryButton
                                                size="mini"
                                                style={ { padding: "0.7em"} }
                                                onClick={ () => getRolesList("Application") }
                                            >
                                                <Icon name="plus"/>
                                                Assign new role
                                            </PrimaryButton>
                                        </Segment>
                                    </Segment.Group>
                                )
                            }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column computer={ 8 }>
                        <Heading as="h4">Internal roles</Heading>
                        <Hint>
                            The following are the internal roles assigned to the user at the moment.
                        </Hint>
                        {
                            internalRoles && internalRoles.size > 0 ? (
                                <Segment.Group style={ { boxShadow: "none" } }>
                                    <Segment clearing className="user-roles-segment-header">
                                        <Icon
                                            className="floated right"
                                            color="grey"
                                            name="plus"
                                        />
                                        <Icon
                                            onClick={ () => getRolesList("Internal") }
                                            className="floated right"
                                            color="grey"
                                            name="pencil alternate"
                                        />
                                    </Segment>
                                <Segment className="user-roles-segment">
                                    {
                                        [ ...internalRoles.keys() ].map((roleName, index) => {
                                            return (
                                                roleName === "Internal/everyone" ?
                                                    (
                                                        <Label className="info-label" key={ index }>
                                                            { roleName }
                                                        </Label>
                                                    ) :
                                                    (
                                                        <Label key={ index }>
                                                            { roleName }
                                                        </Label>
                                                    )
                                            );
                                        })
                                    }
                                </Segment>
                                </Segment.Group>
                                ): (
                                    <Segment.Group style={ { boxShadow: "none" } }>
                                        <Segment clearing className="user-roles-segment-header">
                                            <Icon
                                                className="floated right"
                                                color="grey"
                                                name="plus"
                                            />
                                        </Segment>
                                        <Segment textAlign="center" size="small" className="user-roles-segment">
                                            <Heading style={ { fontSize: "small", color: "#767676" } }>
                                                No internal roles assigned to this user at the moment.
                                            </Heading>
                                            <PrimaryButton
                                                size="mini"
                                                style={ { padding: "0.7em"} }
                                                onClick={ () => getRolesList("Internal") }
                                            >
                                                <Icon name="plus"/>
                                                Assign new role
                                            </PrimaryButton>
                                        </Segment>
                                    </Segment.Group>
                                )
                            }
                    </Grid.Column>
                </Grid.Row>
                { addNewRoleModal() }
            </Grid>
        </>
    );
};
