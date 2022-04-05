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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { getRolesList } from "@wso2is/core/api";
import { AlertLevels, RoleListInterface, RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, Hint } from "@wso2is/react-components";
import filter from "lodash-es/filter";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, DropdownItemProps, Form, Grid, Icon, Label, Popup } from "semantic-ui-react";
import { updateIDPRoleMappings } from "../../../api";
import { IdentityProviderRolesInterface } from "../../../models";
import { handleGetRoleListError, handleUpdateIDPRoleMappingsError } from "../../utils";

interface OutboundProvisioningRolesPropsInterface extends TestableComponentInterface {
    idpId: string;
    idpRoles: IdentityProviderRolesInterface;
    isReadOnly?: boolean;
    onUpdate: (id: string) => void;
}

export const OutboundProvisioningRoles: FunctionComponent<OutboundProvisioningRolesPropsInterface> = (
    props: OutboundProvisioningRolesPropsInterface) => {

    const {
        idpId,
        idpRoles,
        isReadOnly,
        onUpdate,
        [ "data-testid" ]: testId
    } = props;

    const [ selectedRole, setSelectedRole ] = useState<string>(undefined);
    const [ selectedRoles, setSelectedRoles ] = useState<string[]>(undefined);
    const [ roleList, setRoleList ] = useState<RolesInterface[]>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const handleRoleAdd = (event) => {
        event.preventDefault();
        if (isEmpty(selectedRole)) {
            return;
        }
        if (isEmpty(selectedRoles.find(role => role === selectedRole))) {
            setSelectedRoles([ ...selectedRoles, selectedRole ]);
        }
        setSelectedRole("");
    };

    const handleRoleRemove = (removingRole: string) => {
        if (isEmpty(removingRole)) {
            return;
        }
        setSelectedRoles(filter(selectedRoles, role => !isEqual(removingRole, role)));
    };

    useEffect(() => {
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
        setSelectedRoles(idpRoles.outboundProvisioningRoles === undefined ? [] :
            idpRoles.outboundProvisioningRoles);
    }, []);

    const handleOutboundProvisioningRoleMapping = (outboundProvisioningRoles: string[]) => {
        setIsSubmitting(true);

        updateIDPRoleMappings(idpId, {
            ...idpRoles,
            outboundProvisioningRoles: outboundProvisioningRoles
        }
        ).then(() => {
            dispatch(addAlert(
                {
                    description: t("console:develop.features.authenticationProvider." +
                        "notifications.updateIDPRoleMappings." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider." +
                        "notifications.updateIDPRoleMappings.success.message")
                }
            ));
            onUpdate(idpId);
        }).catch(error => {
            handleUpdateIDPRoleMappingsError(error);
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={ 8 }>
                    <Heading as="h5">
                        { t("console:develop.features.authenticationProvider.forms.outboundProvisioningRoles"
                            + ".heading") }
                    </Heading>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column width={ 8 }>
                    <Form className="outbound-provisioning-roles role-select-dropdown">
                        <Form.Select
                            options={ roleList?.map((role) => {
                                return {
                                    key: role.id,
                                    text: role.displayName,
                                    value: role.displayName
                                } as DropdownItemProps;
                            }) }
                            value={ selectedRole }
                            placeholder={ t("console:develop.features.authenticationProvider" +
                                ".forms.outboundProvisioningRoles" +
                                ".placeHolder") }
                            onChange={
                                (event, data) => {
                                    if (isEmpty(data?.value?.toString())) {
                                        return;
                                    }
                                    setSelectedRole(data.value.toString());
                                }
                            }
                            search
                            label={ t("console:develop.features.authenticationProvider.forms." +
                                "outboundProvisioningRoles.label") }
                            data-testid={ `${ testId }-role-select-dropdown` }
                            readOnly={ isReadOnly }
                        />
                        <Popup
                            trigger={
                                (
                                    <Show when={ AccessControlConstants.IDP_EDIT }>
                                        <Button
                                            onClick={ (e) => handleRoleAdd(e) }
                                            icon="add"
                                            type="button"
                                            disabled={ false }
                                            className="inline"
                                        />
                                    </Show>
                                )
                            }
                            position="top center"
                            content={ t("console:develop.features.authenticationProvider.forms." +
                                "outboundProvisioningRoles.popup.content") }
                            inverted
                            data-testid={ `${ testId }-add-button` }
                        />
                    </Form>
                    <Hint>
                        { t("console:develop.features.authenticationProvider.forms.outboundProvisioningRoles.hint") }
                    </Hint>

                    {
                        selectedRoles && selectedRoles?.map((selectedRole, index) => {
                            return (
                                <Show key={ index } when={ AccessControlConstants.IDP_EDIT }>
                                    <Label>
                                        { selectedRole }
                                        <Icon
                                            name="delete"
                                            onClick={ () => handleRoleRemove(selectedRole) }
                                            data-testid={ `${ testId }-delete-button` }
                                        />
                                    </Label>
                                </Show>
                            );
                        })
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={ 8 }>
                    <Show when={ AccessControlConstants.IDP_EDIT }>
                        <Button
                            primary
                            size="small"
                            loading={ isSubmitting }
                            disabled={ isSubmitting }
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
                    </Show>
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
