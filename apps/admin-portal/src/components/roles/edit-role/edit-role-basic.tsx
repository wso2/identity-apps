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

import { Forms } from "@wso2is/forms"
import { ConfirmationModal, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState, useEffect, ChangeEvent } from "react"
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Divider, Grid, Input, Form, InputOnChangeData } from "semantic-ui-react"
import { deleteRoleById, updateRoleDetails } from "../../../api";
import { ROLE_VIEW_PATH, GROUP_VIEW_PATH } from "../../../constants";
import { history } from "../../../helpers";
import { AlertInterface, AlertLevels, PatchRoleDataInterface, RolesInterface } from "../../../models";
import { addAlert } from "../../../store/actions";

/**
 * Interface to contain props needed for component
 */
interface BasicRoleProps {
    roleObject: RolesInterface;
    isGroup: boolean;
    onRoleUpdate: () => void;
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
        onRoleUpdate,
        isGroup
    } = props;

    const [ showRoleDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false)
    const [ labelText, setLableText ] = useState<string>(undefined);
    const [ nameValue, setNameValue ] = useState<string>('');

    useEffect(() => {
        if (roleObject && roleObject.displayName.indexOf('/') !== -1) {
            setNameValue(roleObject.displayName.split('/')[1])
            setLableText(roleObject.displayName.split('/')[0])
        } else if (roleObject) {
            setNameValue(roleObject.displayName);
        }
    }, [roleObject])

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
        deleteRoleById(id).then(() => {
            handleAlerts({
                description: isGroup ? 
                    t("devPortal:components.groups.notifications.deleteGroup.success.description") : 
                    t("devPortal:components.roles.notifications.deleteRole.success.description"),
                level: AlertLevels.SUCCESS,
                message: isGroup ? 
                    t("devPortal:components.groups.notifications.deleteGroup.success.message") : 
                    t("devPortal:components.roles.notifications.deleteRole.success.message")
            });
            if (isGroup) {
                history.push(GROUP_VIEW_PATH);
            } else {
                history.push(ROLE_VIEW_PATH);
            }
        });
    };

    /**
     * Method to update role name for the selected role.
     * 
     * @param values Form values which will be used to update the role
     */
    const updateRoleName = (values: any): void => {
        const roleData: PatchRoleDataInterface = {
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:PatchOp"
            ],
            Operations: [{
                "op": "replace",
                "value": {
                    "displayName": labelText ? labelText + "/" + nameValue : nameValue
                }
            }]
        };

        updateRoleDetails(roleObject.id, roleData)
            .then(response => {
                onRoleUpdate();
                handleAlerts({
                    description: isGroup ? 
                        t("devPortal:components.groups.notifications.updateGroup.success.description") : 
                        t("devPortal:components.roles.notifications.updateRole.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: isGroup ? 
                        t("devPortal:components.groups.notifications.updateGroup.success.message") : 
                        t("devPortal:components.roles.notifications.updateRole.success.message")
                });
            }).catch(error => {
                handleAlerts({
                    description: isGroup ? 
                        t("devPortal:components.groups.notifications.updateGroup.error.description") : 
                        t("devPortal:components.roles.notifications.updateRole.error.description"),
                    level: AlertLevels.ERROR,
                    message: isGroup ? 
                        t("devPortal:components.groups.notifications.updateGroup.error.message") : 
                        t("devPortal:components.roles.notifications.updateRole.error.message")
                });
            });
    };

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
                            <Form.Field>
                                <label>
                                    { isGroup ? 
                                        t("devPortal:components.groups.edit.basics.fields.groupName.name") : 
                                        t("devPortal:components.roles.edit.basics.fields.roleName.name") 
                                    }
                                </label>
                                <Input
                                    required={ true }
                                    name={ "rolename" }
                                    label={ labelText + " /" }
                                    requiredErrorMessage={ 
                                        isGroup ? 
                                            t("devPortal:components.groups.edit.basics.fields.groupName.required") : 
                                            t("devPortal:components.roles.edit.basics.fields.roleName.required") 
                                    }
                                    placeholder={ 
                                        isGroup ? 
                                            t("devPortal:components.groups.edit.basics.fields.groupName.placeholder") : 
                                            t("devPortal:components.roles.edit.basics.fields.roleName.placeholder") 
                                    }
                                    value={ nameValue }
                                    onChange={ (event: ChangeEvent, data: InputOnChangeData) => {
                                        setNameValue(data.value)
                                    } }
                                    type="text"
                                />
                            </Form.Field>
                            
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
                    actionTitle={ isGroup ? "Delete Group" : "Delete Role" }
                    header={ isGroup ? "Delete group" : "Delete role" }
                    subheader={ 
                        isGroup ? 
                            "Once you delete the group, there is no going back. Please be certain." : 
                            "Once you delete the role, there is no going back. Please be certain." 
                    }
                    onActionClick={ () => setShowDeleteConfirmationModal(!showRoleDeleteConfirmation) }
                />
            </DangerZoneGroup> 
            {
                showRoleDeleteConfirmation && 
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showRoleDeleteConfirmation }
                        assertion={ roleObject.displayName }
                        assertionHint={ <p>Please type <strong>{ roleObject.displayName }</strong> to confirm.</p> }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleOnDelete(roleObject.id) }
                    >
                        <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            This action is irreversible and will permanently delete the selected { 
                                isGroup ? "group." : "role." 
                            }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            If you delete this { 
                                isGroup ? "group" : "role" 
                            }, the permissions attached to it will be deleted and the users 
                            attached to it will no longer be able to perform intended actions which were previously
                            allowed. Please proceed with caution.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
            }
        </>
    )
};
