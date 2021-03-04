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

import { getRolesList } from "@wso2is/core/api";
import { AlertLevels, RoleListInterface, RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, Hint } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, DropdownItemProps, Form, Grid, Icon, Label, Popup } from "semantic-ui-react";
import { updateIDPRoleMappings } from "../../../api";
import { IdentityProviderRolesInterface } from "../../../models";
import { handleGetRoleListError, handleUpdateIDPRoleMappingsError } from "../../utils";
import {AppState} from "../../../../core/store";
import {getGroupList} from "../../../../groups/api";
import {GroupListInterface, GroupsInterface} from "../../../../groups/models";

interface OutboundProvisioningRolesPropsInterface extends TestableComponentInterface {
    idpId: string;
    idpRoles: IdentityProviderRolesInterface;
}

export const OutboundProvisioningRoles: FunctionComponent<OutboundProvisioningRolesPropsInterface> = (
    props: OutboundProvisioningRolesPropsInterface) => {

    const {
        idpId,
        idpRoles,
        [ "data-testid" ]: testId
    } = props;

    const [selectedRole, setSelectedRole] = useState<string>(undefined);
    const [selectedRoles, setSelectedRoles] = useState<string[]>(undefined);
    const [roleList, setRoleList] = useState<RolesInterface[]>(undefined);
    const [groupList, setGroupList] = useState<GroupsInterface[]>(undefined);

    const isGroupAndRoleSeparationEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.isGroupAndRoleSeparationEnabled)
    const groupsOrRolesIdentifier = isGroupAndRoleSeparationEnabled ? "outboundProvisioningGroups" :
        "outboundProvisioningRoles"

    const dispatch = useDispatch();

    const { t } = useTranslation();
    
    const handleRoleAdd = (event) => {
        event.preventDefault();
        if (_.isEmpty(selectedRole)) {
            return;
        }
        if (_.isEmpty(selectedRoles.find(role => role === selectedRole))) {
            setSelectedRoles([...selectedRoles, selectedRole]);
        }
        setSelectedRole("");
    };

    const handleRoleRemove = (removingRole: string) => {
        if (_.isEmpty(removingRole)) {
            return;
        }
        setSelectedRoles(_.filter(selectedRoles, role => !_.isEqual(removingRole, role)));
    };

    useEffect(() => {
        if (isGroupAndRoleSeparationEnabled) {
            getGroupList(null)
                .then((response) => {
                    if (response.status === 200) {
                        const allGroup: GroupListInterface = response.data;
                        setGroupList(allGroup?.Resources);
                    }
                })
        } else {
            getRolesList(null)
                .then((response) => {
                    if (response.status === 200) {
                        const allRole: RoleListInterface = response.data;
                        setRoleList(allRole?.Resources?.filter((role) => {
                            return !(role.displayName
                                .includes("Application/") || role.displayName.includes("Internal/"));
                        }));
                    }
                })
                .catch((error) => {
                    handleGetRoleListError(error);
                });
        }
        setSelectedRoles(idpRoles.outboundProvisioningRoles === undefined ? [] :
            idpRoles.outboundProvisioningRoles);
    }, []);

    const handleOutboundProvisioningRoleMapping = (outboundProvisioningRoles: string[]) => {
        updateIDPRoleMappings(idpId, {
                ...idpRoles,
                outboundProvisioningRoles: outboundProvisioningRoles
            }
        ).then(() => {
            dispatch(addAlert(
                {
                    description: t("console:develop.features.idp.notifications.updateIDPRoleMappings." + 
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.idp.notifications.updateIDPRoleMappings.success.message")
                }
            ));
        }).catch(error => {
            handleUpdateIDPRoleMappingsError(error);
        });
    };

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={ 8 }>
                    <Heading as="h5">
                        { t("console:develop.features.idp.forms." + groupsOrRolesIdentifier + ".heading") }
                    </Heading>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column width={ 8 }>
                    <Form className="outbound-provisioning-roles role-select-dropdown">
                        <Form.Select
                            options={
                                isGroupAndRoleSeparationEnabled ?
                                    groupList?.map((group) => {
                                        return {
                                            key: group.id,
                                            text: group.displayName,
                                            value: group.displayName
                                        } as DropdownItemProps;
                                    }) :
                                    roleList?.map((role) => {
                                        return {
                                            key: role.id,
                                            text: role.displayName,
                                            value: role.displayName
                                        } as DropdownItemProps;
                                    })
                            }
                            value={ selectedRole }
                            placeholder={ t("console:develop.features.idp.forms." + groupsOrRolesIdentifier
                                + ".placeHolder") }
                            onChange={
                                (event, data) => {
                                    if (_.isEmpty(data?.value?.toString())) {
                                        return;
                                    }
                                    setSelectedRole(data.value.toString());
                                }
                            }
                            search
                            label={ t("console:develop.features.idp.forms." + groupsOrRolesIdentifier + ".label") }
                            data-testid={ `${ testId }-role-select-dropdown` }
                        />
                        <Popup
                            trigger={
                                (
                                    <Button
                                        onClick={ (e) => handleRoleAdd(e) }
                                        icon="add"
                                        type="button"
                                        disabled={ false }
                                        className="inline"
                                    />
                                )
                            }
                            position="top center"
                            content={ t("console:develop.features.idp.forms." + groupsOrRolesIdentifier
                                + ".popup.content") }
                            inverted
                            data-testid={ `${ testId }-add-button` }
                        />
                    </Form>
                    <Hint>
                        { t("console:develop.features.idp.forms." + groupsOrRolesIdentifier + ".hint") }
                    </Hint>

                    {
                        selectedRoles && selectedRoles?.map((selectedRole, index) => {
                            return (
                                <Label
                                    key={ index }
                                >
                                    { selectedRole }
                                    <Icon
                                        name="delete"
                                        onClick={ () => handleRoleRemove(selectedRole) }
                                        data-testid={ `${ testId }-delete-button` }
                                    />
                                </Label>
                            );
                        })
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={ 8 }>
                    <Button
                        primary
                        size="small"
                        onClick={ () => {
                            if (selectedRoles === undefined) {
                                return;
                            }
                            handleOutboundProvisioningRoleMapping(selectedRoles);
                        } }
                        data-testid={ `${ testId }-update-button` }
                    >
                        { t("common:update") }
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default proptypes for the IDP outbound provisioning roles component.
 */
OutboundProvisioningRoles.defaultProps = {
    "data-testid": "idp-edit-outbound-provisioning-settings-roles"
};
