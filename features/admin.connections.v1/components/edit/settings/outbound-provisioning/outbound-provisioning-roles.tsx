/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { AppState, FeatureConfigInterface } from "@wso2is/admin.core.v1";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { getRolesList } from "@wso2is/admin.roles.v2/api";
import { AlertLevels, RoleListInterface, RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, Hint, Popup } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import filter from "lodash-es/filter";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import React, { FunctionComponent, MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, DropdownItemProps, DropdownProps, Form, Grid, Icon, Label } from "semantic-ui-react";
import { updateConnectionRoleMappings } from "../../../../api/connections";
import { ConnectionRolesInterface } from "../../../../models/connection";
import { handleGetRoleListError, handleUpdateIDPRoleMappingsError } from "../../../../utils/connection-utils";

interface OutboundProvisioningRolesPropsInterface extends TestableComponentInterface {
    idpId: string;
    idpRoles: ConnectionRolesInterface;
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

    const dispatch: Dispatch = useDispatch();
    const { isSuperOrganization } = useGetCurrentOrganizationType();
    const { t } = useTranslation();
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const handleRoleAdd = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (isEmpty(selectedRole)) {
            return;
        }
        if (isEmpty(selectedRoles.find((role: string) => role === selectedRole))) {
            setSelectedRoles([ ...selectedRoles, selectedRole ]);
        }
        setSelectedRole("");
    };

    const handleRoleRemove = (removingRole: string) => {
        if (isEmpty(removingRole)) {
            return;
        }
        setSelectedRoles(filter(selectedRoles, (role: string) => !isEqual(removingRole, role)));
    };

    useEffect(() => {
        if (!isSuperOrganization()) {
            return;
        }

        getRolesList(null)
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    const allRole: RoleListInterface = response.data;

                    setRoleList(allRole?.Resources?.filter((role: RolesInterface) => {
                        return !(role.displayName
                            .includes("Application/") || role.displayName.includes("Internal/"));
                    }));
                }
            })
            .catch((error: AxiosError) => {
                handleGetRoleListError(error);
            });
        setSelectedRoles(idpRoles.outboundProvisioningRoles === undefined ? [] :
            idpRoles.outboundProvisioningRoles);
    }, []);

    const handleOutboundProvisioningRoleMapping = (outboundProvisioningRoles: string[]) => {
        setIsSubmitting(true);

        updateConnectionRoleMappings(idpId, {
            ...idpRoles,
            outboundProvisioningRoles: outboundProvisioningRoles
        }
        ).then(() => {
            dispatch(addAlert(
                {
                    description: t("authenticationProvider:" +
                        "notifications.updateIDPRoleMappings." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:" +
                        "notifications.updateIDPRoleMappings.success.message")
                }
            ));
            onUpdate(idpId);
        }).catch((error: AxiosError) => {
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
                        { t("authenticationProvider:forms.outboundProvisioningRoles"
                            + ".heading") }
                    </Heading>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column width={ 8 }>
                    <Form className="outbound-provisioning-roles role-select-dropdown">
                        <Form.Select
                            options={ roleList?.map((role: RolesInterface) => {
                                return {
                                    key: role.id,
                                    text: role.displayName,
                                    value: role.displayName
                                } as DropdownItemProps;
                            }) }
                            value={ selectedRole }
                            placeholder={ t("authenticationProvider:" +
                                "forms.outboundProvisioningRoles" +
                                ".placeHolder") }
                            onChange={
                                (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
                                    if (isEmpty(data?.value?.toString())) {
                                        return;
                                    }
                                    setSelectedRole(data.value.toString());
                                }
                            }
                            search
                            label={ t("authenticationProvider:forms." +
                                "outboundProvisioningRoles.label") }
                            data-testid={ `${ testId }-role-select-dropdown` }
                            readOnly={ isReadOnly }
                        />
                        <Popup
                            trigger={
                                (
                                    <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                                        <Button
                                            onClick={ (event: MouseEvent<HTMLButtonElement>) =>
                                                handleRoleAdd(event) }
                                            icon="add"
                                            disabled={ false }
                                            className="inline"
                                        />
                                    </Show>
                                )
                            }
                            position="top center"
                            content={ t("authenticationProvider:forms." +
                                "outboundProvisioningRoles.popup.content") }
                            inverted
                            data-testid={ `${ testId }-add-button` }
                        />
                    </Form>
                    <Hint>
                        { t("authenticationProvider:forms.outboundProvisioningRoles.hint") }
                    </Hint>

                    {
                        selectedRoles && selectedRoles?.map((selectedRole: string, index: number) => {
                            return (
                                <Show key={ index } when={ featureConfig?.identityProviders?.scopes?.update }>
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
                    <Show when={ featureConfig?.identityProviders?.scopes?.update }>
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
