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

import React, { FunctionComponent, ReactElement } from "react"
import { Grid, Divider, Button } from "semantic-ui-react"
import { Field, Forms } from "@wso2is/forms"
import { useTranslation } from "react-i18next";
import { DangerZoneGroup, DangerZone } from "@wso2is/react-components";
import { deleteSelectedRole } from "../../../api";
import { AlertLevels, AlertInterface } from "../../../models";
import { useDispatch } from "react-redux";
import { addAlert } from "../../../store/actions";

export const BaiscRoleDetails: FunctionComponent<any> = (): ReactElement => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

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
        });
    };

    return (
        <>
            <Forms 
                onSubmit={ () => { console.log() } }
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
                    onActionClick={ () => handleOnDelete("") }
                />
            </DangerZoneGroup>
        </>
    )
}
