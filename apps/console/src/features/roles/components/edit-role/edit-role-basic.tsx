/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { OrganizationType } from "@wso2is/common";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { ConfirmationModal, DangerZone, DangerZoneGroup, EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider } from "semantic-ui-react";
import { AppConstants, history } from "../../../core";
import { useGetOrganizationType } from "../../../organizations/hooks/use-get-organization-type";
import { deleteRoleById, updateRoleDetails, useRolesList } from "../../api";
import { RoleConstants, Schemas } from "../../constants";
import { PatchRoleDataInterface, RoleBasicInterface, RoleEditSectionsInterface } from "../../models/roles";

/**
 * Interface to contain props needed for component
 */
type BasicRoleProps = IdentifiableComponentInterface & RoleEditSectionsInterface;

const FORM_ID: string = "edit-role-basic";

/**
 * Component to edit basic role details.
 *
 * @param props - Role object containing details which needs to be edited.
 */
export const BasicRoleDetails: FunctionComponent<BasicRoleProps> = (props: BasicRoleProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        role,
        onRoleUpdate,
        isReadOnly,
        tabIndex,
        [ "data-componentid" ]: componentid
    } = props;

    const [ showRoleDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ roleNameSearchQuery, setRoleNameSearchQuery ] = useState<string>(undefined);
    const orgType: OrganizationType = useGetOrganizationType();
    
    const {
        data: rolesList,
        isLoading: isRolesListLoading,
        error: rolesListError,
        isValidating: isRolesListValidating
    } = useRolesList( undefined, undefined, roleNameSearchQuery);

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface): void => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle role deletion action.
     *
     * @param id - Role ID which needs to be deleted
     */
    const handleOnDelete = (): void => {
        deleteRoleById(role.id).then(() => {
            handleAlerts({
                description: t("console:manage.features.roles.notifications.deleteRole.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("console:manage.features.roles.notifications.deleteRole.success.message")
            });

            history.push(AppConstants.getPaths().get("ROLES"));
        });
    };

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = async (values: RoleBasicInterface): Promise<RoleBasicInterface> => {

        const errors: RoleBasicInterface = {
            roleName: undefined
        };

        if (values.roleName?.toString().trim().length >= RoleConstants.ROLE_NAME_MIN_LENGTH) {

            setRoleNameSearchQuery(`displayName eq ${values.roleName?.toString().trim()}`);

            if (!isRolesListLoading || !isRolesListValidating) {
                if (rolesList?.totalResults > 0 || rolesListError) {
                    errors.roleName = t("console:manage.features.roles.addRoleWizard.forms."
                        + "roleBasicDetails.roleName.validations.duplicate",{ type: "Role" });
                }
            } 
            
            return errors;
        }
    };

    /**
     * Update role name for the selected role.
     */
    const updateRoleName = (values: Record<string, string>): void => {
        const newRoleName: string = values?.roleName?.toString().trim();

        const roleData: PatchRoleDataInterface = {
            Operations: [ {
                "op": "replace",
                "path": "displayName",
                "value": newRoleName
            } ],
            schemas: [ Schemas.PATCH_OP ]
        };

        setIsSubmitting(true);

        updateRoleDetails(role.id, roleData)
            .then(() => {
                onRoleUpdate(tabIndex);
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
                <Form 
                    id={ FORM_ID } 
                    uncontrolledForm={ false }
                    validate={ validateForm }
                    noValidate={ true }
                    onSubmit={ updateRoleName }
                >
                    <Field.Input
                        ariaLabel="roleName"
                        name="roleName"
                        inputType="identifier"
                        required={ true }
                        readOnly={ isReadOnly }
                        value={ role?.displayName }
                        label={ t("console:manage.features.roles.edit.basics.fields.roleName.name") }
                        placeholder={
                            t("console:manage.features.roles.edit.basics.fields.roleName.placeholder")
                        }
                        maxLength={ RoleConstants.ROLE_NAME_MAX_LENGTH }
                        minLength={ RoleConstants.ROLE_NAME_MIN_LENGTH }
                    />
                    <Field.Button
                        form={ FORM_ID }
                        buttonType="primary_btn"
                        ariaLabel="Update button"
                        name="update-button"
                        hidden={ isReadOnly }
                        disabled={ isSubmitting }
                        loading={ isSubmitting }
                        data-componentid={ `${ componentid }-role-update-button` }
                        label={ t("extensions:develop.apiResource.tabs.general.form.updateButton") }
                    />
                </Form>
            </EmphasizedSegment>
            <Divider hidden />
            {
                (!isReadOnly && orgType !== OrganizationType.SUBORGANIZATION) && (
                    <DangerZoneGroup sectionHeader="Danger Zone">
                        <DangerZone
                            actionTitle={ 
                                t("console:manage.features.roles.edit.basics.dangerZone.actionTitle",
                                    { type: "Role" })
                            }
                            header={
                                t("console:manage.features.roles.edit.basics.dangerZone.header",
                                    { type: "role" })
                            }
                            subheader={
                                t("console:manage.features.roles.edit.basics.dangerZone.subheader",
                                    { type: "role" })
                            }
                            onActionClick={ () => setShowDeleteConfirmationModal(!showRoleDeleteConfirmation) }
                            data-componentid={ `${ componentid }-role-danger-zone` }
                        />
                    </DangerZoneGroup>
                )
            }
            {
                showRoleDeleteConfirmation && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showRoleDeleteConfirmation }
                        assertionHint={ t("console:manage.features.roles.edit.basics.confirmation.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleOnDelete() }
                        data-componentid={ `${ componentid }-role-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header>
                            { t("console:manage.features.roles.edit.basics.confirmation.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            { t("console:manage.features.roles.edit.basics.confirmation.message", { type: "role." }) }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("console:manage.features.roles.edit.basics.confirmation.content", { type: "role" }) }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};

/**
 * Default props for application roles tab component.
 */
BasicRoleDetails.defaultProps = {
    "data-componentid": "edit-role-basic"
};
