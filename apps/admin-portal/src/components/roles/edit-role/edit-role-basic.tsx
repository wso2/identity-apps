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
 * under the License
 */

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react"
import { Grid, Divider, Button } from "semantic-ui-react"
import { Field, Forms } from "@wso2is/forms"
import { useTranslation } from "react-i18next";
import { DangerZoneGroup, DangerZone } from "@wso2is/react-components";
import { deleteSelectedRole, getRoleById, updateRoleDetails } from "../../../api";
import { AlertLevels, AlertInterface, RolesInterface, CreateRoleInterface } from "../../../models";
import { useDispatch } from "react-redux";
import { addAlert } from "../../../store/actions";
import { history } from "../../../helpers";

/**
 * Interface to contain props needed for component
 */
interface BasicRoleProps {
    roleObject: RolesInterface;
    roleId: string;
}

/**
 * Component to edit basic role details.
 * 
 * @param props Role object containing details which needs to be edited.
 */
export const BaiscRoleDetails: FunctionComponent<BasicRoleProps> = (props: BasicRoleProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        roleObject,
        roleId
    } = props;

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle role deletion action.
     * 
     * @param id - Role ID which needs to be deleted
     */
    const handleOnDelete = (id: string): void => {
        deleteSelectedRole(id).then(() => {
            handleAlerts({
                description: t(
                    "views:components.roles.notifications.deleteRole.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "views:components.roles.notifications.deleteRole.success.message"
                )
            });
            history.push("/roles");
        });
    };

    /**
     * Method to update role name for the selected role.
     * 
     * @param values Form values which will be used to update the role
     */
    const updateRoleName = (values: any): void => {
        const roleData: CreateRoleInterface = {
            displayName: values.get("rolename")
        }

        updateRoleDetails(roleId, roleData).then(response => {
            handleAlerts({
                description: t(
                    "views:components.roles.notifications.updateRole.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "views:components.roles.notifications.updateRole.success.message"
                )
            });
        }).catch(error => {
            handleAlerts({
                description: t(
                    "views:components.roles.notifications.updateRole.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "views:components.roles.notifications.updateRole.error.message"
                )
            });
        })
    }

    return (
        <>
            <Forms 
                onSubmit={ (values) => { 
                    updateRoleName(values) 
                } }
            >
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
                            <Field
                                name={ "rolename" }
                                label={ t("views:components.roles.edit.basics.fields.roleName") }
                                required={ true }
                                requiredErrorMessage={ "Role name is required" }
                                placeholder={ "Enter your role name" }
                                value={ roleObject? roleObject.displayName : "" }
                                type="text"
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Button primary type="submit" size="small" className="form-button">
                                Update
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms>
            <Divider hidden />
            <DangerZoneGroup sectionHeader="Danger Zone">
                <DangerZone
                    actionTitle="Delete Role"
                    header="Delete this role"
                    subheader="This action is irreversible. Please proceed with caution."
                    onActionClick={ () => handleOnDelete(roleId) }
                />
            </DangerZoneGroup>
        </>
    )
}
