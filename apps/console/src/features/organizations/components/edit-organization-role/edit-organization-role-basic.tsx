/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { ConfirmationModal, DangerZone, DangerZoneGroup, EmphasizedSegment } from "@wso2is/react-components";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Form, Grid, InputOnChangeData } from "semantic-ui-react";
import { AppConstants, AppState, SharedUserStoreConstants, SharedUserStoreUtils, history } from "../../../core";
import { PRIMARY_USERSTORE_PROPERTY_VALUES } from "../../../userstores";
import { deleteOrganizationRole, getOrganizationRoles, patchOrganizationRoleDetails } from "../../api";
import { OrganizationRoleManagementConstants } from "../../constants";
import {
    OrganizationResponseInterface,
    OrganizationRoleInterface,
    PatchOrganizationRoleDataInterface
} from "../../models";

/**
 * Interface to contain props needed for component
 */
interface BasicRoleProps extends TestableComponentInterface {
    /**
     * Role id.
     */
    roleId: string;
    /**
     * Role details
     */
    roleObject: OrganizationRoleInterface;
    /**
     * Show if it is role.
     */
    isGroup: boolean;
    /**
     * Handle role update callback.
     */
    onRoleUpdate: () => void;
    /**
     * Show if the user is read only.
     */
    isReadOnly?: boolean;
}

/**
 * Component to edit basic role details.
 *
 * @param props Role object containing details which needs to be edited.
 */
export const BasicRoleDetails: FunctionComponent<BasicRoleProps> = (props: BasicRoleProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        roleId,
        roleObject,
        onRoleUpdate,
        isGroup,
        isReadOnly,
        [ "data-testid" ]: testId
    } = props;

    const [ showRoleDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ labelText, setLableText ] = useState<string>("");
    const [ nameValue, setNameValue ] = useState<string>("");
    const [ userStoreRegEx, setUserStoreRegEx ] = useState<string>("");
    const [ isRoleNamePatternValid, setIsRoleNamePatternValid ] = useState<boolean>(true);
    const [ isRegExLoading, setRegExLoading ] = useState<boolean>(false);
    const [ userStore ] = useState<string>(SharedUserStoreConstants.PRIMARY_USER_STORE);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    useEffect(() => {
        if (roleObject && roleObject.displayName.indexOf("/") !== -1) {
            setNameValue(roleObject.displayName.split("/")[1]);
            setLableText(roleObject.displayName.split("/")[0]);
        } else if (roleObject) {
            setNameValue(roleObject.displayName);
        }
    }, [ roleObject ]);

    useEffect(() => {
        if (userStoreRegEx !== "") {
            return;
        }
        fetchUserstoreRegEx()
            .then((response) => {
                setUserStoreRegEx(response);
                setRegExLoading(false);
            });
    }, [ nameValue ]);

    const fetchUserstoreRegEx = async (): Promise<string> => {
        // TODO: Enable when the role object includes user store.
        // if (roleObject && roleObject.displayName.indexOf("/") !== -1) {
        //     // Get the role name regEx for the secondary user store
        //     const userstore = roleObject.displayName.split("/")[0].toString().toLowerCase();
        //     await getUserstoreRegEx(userstore, USERSTORE_REGEX_PROPERTIES.RolenameRegEx)
        //         .then((response) => {
        //             setRegExLoading(true);
        //             regEx = response;
        //         })
        // } else if (roleObject) {
        //     // Get the role name regEx for the primary user store
        //     regEx = PRIMARY_USERSTORE_PROPERTY_VALUES.RolenameJavaScriptRegEx;
        // }
        return PRIMARY_USERSTORE_PROPERTY_VALUES.RolenameJavaScriptRegEx;
    };

    /**
     * The following function validates role name against the user store regEx.
     */
    const validateRoleNamePattern = async (): Promise<string> => {
        let userStoreRegEx = "";

        if (userStore !== SharedUserStoreConstants.PRIMARY_USER_STORE) {
            await SharedUserStoreUtils.getUserStoreRegEx(userStore,
                SharedUserStoreConstants.USERSTORE_REGEX_PROPERTIES.RolenameRegEx)
                .then((response) => {
                    setRegExLoading(true);
                    userStoreRegEx = response;
                });
        } else {
            await SharedUserStoreUtils.getPrimaryUserStore().then((response) => {
                setRegExLoading(true);
                if (response && response.properties) {
                    userStoreRegEx = response?.properties?.filter(property => {
                        return property.name === "RolenameJavaScriptRegEx";
                    })[ 0 ].value;
                }
            });
        }

        setRegExLoading(false);

        return new Promise((resolve, reject) => {
            if (userStoreRegEx !== "") {
                resolve(userStoreRegEx);
            } else {
                reject("");
            }
        });

    };

    /**
     * The following function handles the role name change.
     *
     * @param event
     * @param data
     */
    const handleRoleNameChange = (event: ChangeEvent, data: InputOnChangeData): void => {
        setIsRoleNamePatternValid(SharedUserStoreUtils.validateInputAgainstRegEx(data?.value, userStoreRegEx));
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface): void => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle role deletion action.
     *
     * @param id - Role ID which needs to be deleted
     */
    const handleOnDelete = (id: string): void => {
        deleteOrganizationRole(currentOrganization.id, id).then(() => {
            handleAlerts({
                description: t("console:manage.features.roles.notifications.deleteRole.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("console:manage.features.roles.notifications.deleteRole.success.message")
            });
            if (isGroup) {
                history.push(AppConstants.getPaths().get("GROUPS"));
            } else {
                history.push(
                    AppConstants.getPaths().get("ORGANIZATION_ROLES")
                );
            }
        });
    };

    /**
     * Method to update role name for the selected role.
     *
     */
    const updateRoleName = (values: Map<string, FormValue>): void => {
        const newRoleName: string = values?.get("roleName")?.toString();

        const roleData: PatchOrganizationRoleDataInterface = {
            operations: [ {
                "op": "REPLACE",
                "path": "displayName",
                "value": [
                    labelText ? labelText + "/" + newRoleName : newRoleName
                ]
            } ]
        };

        setIsSubmitting(true);

        patchOrganizationRoleDetails(currentOrganization.id, roleObject.id, roleData)
            .then(() => {
                onRoleUpdate();
                handleAlerts({
                    description: t("console:manage.features.roles.notifications.updateRole.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.roles.notifications.updateRole.success.message")
                });
            }).catch(() => {
                handleAlerts({
                    description: t("console:manage.features.roles.notifications.updateRole.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.roles.notifications.updateRole.error.message")
                });
            }).finally(() => {
                setIsSubmitting(false);
            });

    };

    return (
        <>
            <EmphasizedSegment padded="very">
                <Forms
                    onSubmit={ (values) => {
                        updateRoleName(values);
                    } }
                >
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
                                <Form.Field
                                    error={ !isRoleNamePatternValid }
                                >
                                    <label
                                        data-testid={
                                            isGroup
                                                ? `${ testId }-group-name-label`
                                                : `${ testId }-role-name-label`
                                        }
                                    >
                                        {
                                            isGroup
                                                ? t("console:manage.features.groups.edit.basics.fields.groupName.name")
                                                : t("console:manage.features.roles.edit.basics.fields.roleName.name")
                                        }
                                    </label>
                                    <Field
                                        required={ true }
                                        name={ "roleName" }
                                        label={ labelText !== "" ? labelText + " /" : null }
                                        requiredErrorMessage={
                                            isGroup
                                                ? t("console:manage.features.groups.edit.basics.fields.groupName" +
                                                ".required")
                                                : t("console:manage.features.roles.edit.basics.fields.roleName" +
                                                ".required")
                                        }
                                        placeholder={
                                            isGroup
                                                ? t("console:manage.features.groups.edit.basics.fields.groupName." +
                                                "placeholder")
                                                : t("console:manage.features.roles.edit.basics.fields.roleName." +
                                                "placeholder")
                                        }
                                        value={ nameValue }
                                        validation={ async (value: string, validation: Validation) => {
                                            if (value) {
                                                const filter = "name eq " + value.toString();

                                                await getOrganizationRoles(
                                                    currentOrganization.id,
                                                    filter,
                                                    10,
                                                    null
                                                ).then(response => {
                                                    if (response?.Resources && response?.Resources?.length !== 0) {
                                                        if (response?.Resources[0]?.id !== roleId) {
                                                            validation.isValid = false;
                                                            validation.errorMessages.push(
                                                                t("console:manage.features.roles.addRoleWizard." +
                                                                    "forms.roleBasicDetails.roleName.validations." +
                                                                    "duplicate",
                                                                { type: "Role" }));
                                                        }
                                                    }
                                                }).catch(() => {
                                                    dispatch(addAlert({
                                                        description: t("console:manage.features.roles.notifications." +
                                                            "fetchRoles.genericError.description"),
                                                        level: AlertLevels.ERROR,
                                                        message: t("console:manage.features.roles.notifications." +
                                                            "fetchRoles.genericError.message")
                                                    }));
                                                });
                                            }
                                        } }
                                        onChange={ handleRoleNameChange }
                                        type="text"
                                        data-testid={
                                            isGroup
                                                ? `${ testId }-group-name-input`
                                                : `${ testId }-role-name-input`
                                        }
                                        loading={ isRegExLoading }
                                        readOnly={ isReadOnly }
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                {
                                    !isReadOnly && (
                                        <Button
                                            primary
                                            type="submit"
                                            size="small"
                                            loading={ isSubmitting }
                                            className="form-button"
                                            data-testid={
                                                isGroup
                                                    ? `${ testId }-group-update-button`
                                                    : `${ testId }-role-update-button`
                                            }
                                            disabled={ isRegExLoading || isSubmitting }
                                        >
                                            { t("console:manage.features.roles.edit.basics.buttons.update") }
                                        </Button>
                                    )
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Forms>
            </EmphasizedSegment>
            <Divider hidden />
            {
                (
                    !isReadOnly &&
                    roleObject?.displayName !== OrganizationRoleManagementConstants.ORG_CREATOR_ROLE_NAME
                ) && (
                    <DangerZoneGroup sectionHeader="Danger Zone">
                        <DangerZone
                            actionTitle={
                                isGroup
                                    ? t("console:manage.features.roles.edit.basics.dangerZone.actionTitle",
                                        { type: "Group" })
                                    : t("console:manage.features.roles.edit.basics.dangerZone.actionTitle",
                                        { type: "Role" })
                            }
                            header={
                                isGroup
                                    ? t("console:manage.features.roles.edit.basics.dangerZone.header",
                                        { type: "group" })
                                    : t("console:manage.features.roles.edit.basics.dangerZone.header",
                                        { type: "role" })
                            }
                            subheader={
                                isGroup
                                    ? t("console:manage.features.roles.edit.basics.dangerZone.subheader",
                                        { type: "group" })
                                    : t("console:manage.features.roles.edit.basics.dangerZone.subheader",
                                        { type: "role" })
                            }
                            onActionClick={ () => setShowDeleteConfirmationModal(!showRoleDeleteConfirmation) }
                            data-testid={
                                isGroup
                                    ? `${ testId }-group-danger-zone`
                                    : `${ testId }-role-danger-zone`
                            }
                        />
                    </DangerZoneGroup>
                )
            }
            {
                showRoleDeleteConfirmation && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showRoleDeleteConfirmation }
                        assertionHint={ t("console:manage.features.roles.edit.basics.confirmation.assertionHint") }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleOnDelete(roleObject.id) }
                        data-testid={
                            isGroup
                                ? `${ testId }-group-confirmation-modal`
                                : `${ testId }-role-confirmation-modal`
                        }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header>
                            { t("console:manage.features.roles.edit.basics.confirmation.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            { t("console:manage.features.roles.edit.basics.confirmation.message",
                                { type: isGroup ? "group." : "role." }) }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("console:manage.features.roles.edit.basics.confirmation.content",
                                { type: isGroup ? "group." : "role." }) }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};
