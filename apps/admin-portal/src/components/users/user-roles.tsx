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
import { EmptyPlaceholder, Heading, Hint, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { Button, Grid, Icon, Input, Label, List, Modal, Popup, Segment } from "semantic-ui-react";
import { getRoleList, updateUserRoles } from "../../api";
import _ from "lodash";
import { AlertLevels } from "@wso2is/core/dist/src/models";
import { EmptyPlaceholderIllustrations } from "../../configs";

interface UserRolesPropsInterface {
    user: BasicProfileInterface;
    onAlertFired: (alert: AlertInterface) => void;
    handleUserUpdate: (userId: string) => void;
}

/**
 * Enum for role types.
 * @readonly
 * @enum { string }
 */
enum RoleTypes {
    APPLICATION = "Application",
    INTERNAL= "Internal",
    PRIMARY = "Primary"
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
    const [ initialRoleList, setInitialRoleList ] = useState([]);
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
        const addedRoles = [];
            _.forEachRight(roleListCopy, (role) => {
                if (domain === RoleTypes.APPLICATION) {
                    if (appRoles.has(role.displayName)) {
                        addedRoles.push(role);
                        roleListCopy.splice(roleListCopy.indexOf(role), 1);
                    }
                } else if (domain === RoleTypes.INTERNAL) {
                    if (internalRoles.has(role.displayName)) {
                        addedRoles.push(role);
                        roleListCopy.splice(roleListCopy.indexOf(role), 1);
                    }
                } else {
                    if (primaryRoles.has(role.displayName)) {
                        addedRoles.push(role);
                        roleListCopy.splice(roleListCopy.indexOf(role), 1);
                    }
                }
            });
            setTempRoleList(addedRoles);
            setRoleList(roleListCopy);
            setInitialRoleList(roleListCopy);
    };

    const getRolesList = (domain: string) => {
        setSelectedDomain(domain);
        getRoleList(domain)
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
            setRoleList(initialRoleList);
        }
    };

    /**
     * The following function enables the user to select all the roles
     * at once.
     */
    const handleSelectAll = () => {
        if (!_.isEmpty(initialRoleList)) {
            setTempRoleList(initialRoleList);
            setRoleList([]);
        }
    };

    /**
     * The following function enables the user to deselect all the roles
     * at once.
     */
    const handleRemoveAll = () => {
        if (_.isEmpty(initialRoleList)) {
            setRoleList(tempRoleList);
            setTempRoleList([]);
            return;
        }
        setRoleList(initialRoleList);
        setTempRoleList([]);
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

                if (prefix === RoleTypes.APPLICATION) {
                    applicationRoles.set(group.display, group.value);
                } else if (prefix === RoleTypes.INTERNAL) {
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

        if (selectedDomain === RoleTypes.APPLICATION) {
            removedIds = [ ...appRoles?.values()];
        } else if (selectedDomain === RoleTypes.INTERNAL) {
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
        <Modal open={ showAddNewRoleModal } size="small" className="user-roles">
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
                                            {
                                                !_.isEmpty(roleList) ? (
                                                roleList &&
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
                                            ) : (
                                                <div className={ "empty-placeholder-center" }>
                                                    <EmptyPlaceholder
                                                        image={ EmptyPlaceholderIllustrations.emptyList }
                                                        imageSize="mini"
                                                        title={ "The role list is empty" }
                                                        subtitle={ [ "You have assigned all the roles to user." ] }
                                                    />
                                                </div>

                                                )
                                            }
                                        </List>
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Button
                                        fluid
                                        onClick={ () => handleSelectAll() }
                                    >
                                        <Icon name="check circle outline"/>
                                        Add all
                                    </Button>
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
                                            selectedDomain == RoleTypes.INTERNAL ? (
                                                <>
                                                <Popup
                                                    trigger={
                                                        <Label className={ "info-label" }>
                                                            Internal/everyone
                                                            <Icon
                                                                name="info circle"
                                                                inverted
                                                            />
                                                        </Label>
                                                    }
                                                    inverted
                                                    content="This role will be assigned to all the users by default."
                                                />
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
                                                </>
                                            ) : (
                                                !_.isEmpty(tempRoleList) ? (
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
                                                ) : (
                                                    <div className={ "empty-placeholder-center" }>
                                                        <EmptyPlaceholder
                                                            image={ EmptyPlaceholderIllustrations.emptyList }
                                                            imageSize="mini"
                                                            title={ "The role list is empty" }
                                                            subtitle={ [ "You have not assigned any roles to the user."
                                                            ] }
                                                        />
                                                    </div>
                                                )
                                            )
                                        }
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Button
                                        fluid
                                        onClick={ () => handleRemoveAll() }
                                    >
                                        <Icon name="times circle outline"/>
                                        Remove all
                                    </Button>
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
                                            onClick={ () => getRolesList(RoleTypes.PRIMARY) }
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
                                            onClick={ () => getRolesList(RoleTypes.PRIMARY) }
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
                                            onClick={ () => getRolesList(RoleTypes.APPLICATION) }
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
                                                onClick={ () => getRolesList(RoleTypes.APPLICATION) }
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
                            <Segment.Group style={ { boxShadow: "none" } }>
                                <Segment clearing className="user-roles-segment-header">
                                    <Icon
                                        className="floated right"
                                        color="grey"
                                        name="plus"
                                    />
                                    <Icon
                                        onClick={ () => getRolesList(RoleTypes.INTERNAL) }
                                        className="floated right"
                                        color="grey"
                                        name="pencil alternate"
                                    />
                                </Segment>
                                <Segment className="user-roles-segment">
                                    <Popup
                                        trigger={
                                            <Label className={ "info-label" }>
                                                Internal/everyone
                                                <Icon
                                                    name="info circle"
                                                    inverted
                                                />
                                            </Label>
                                        }
                                        inverted
                                        content="This role is assigned to all the users by default."
                                    />
                                    {
                                        [ ...internalRoles.keys() ].map((roleName, index) => {
                                            return (
                                                <Label key={ index }>
                                                    { roleName }
                                                </Label>
                                            );
                                        })
                                    }
                                </Segment>
                            </Segment.Group>
                    </Grid.Column>
                </Grid.Row>
                { addNewRoleModal() }
            </Grid>
        </>
    );
};
