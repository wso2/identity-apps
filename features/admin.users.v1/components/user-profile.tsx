/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import OxygenGrid from "@oxygen-ui/react/Grid";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { commonConfig } from "@wso2is/admin.extensions.v1";
import { ConnectorPropertyInterface } from "@wso2is/admin.server-configurations.v1";
import { ProfileConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    ProfileInfoInterface,
    ProfileSchemaInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    FinalForm,
    FinalFormField,
    FormRenderProps,
    TextFieldAdapter
} from "@wso2is/form";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import moment from "moment";
import React, { FunctionComponent, ReactElement, ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider } from "semantic-ui-react";
import { deleteUser, updateUserInfo } from "../api";
import {
    AdminAccountTypes
} from "../constants";
import "./user-profile.scss";

/**
 * Prop types for the basic details component.
 */
interface UserProfilePropsInterface extends IdentifiableComponentInterface {
    /**
     * System admin username
     */
    adminUsername: string;
    /**
     * On alert fired callback.
     */
    onAlertFired: (alert: AlertInterface) => void;
    /**
     * User profile
     */
    user: any;
    /**
     * Handle user update callback.
     */
    handleUserUpdate: (userId: string) => void;
    /**
     * Show if the user is read only.
     */
    isReadOnly?: boolean;
    /**
     * Is the user store readonly.
     */
    isReadOnlyUserStore?: boolean;
    /**
     * Allow if the user is deletable.
     */
    allowDeleteOnly?: boolean;
    /**
     * Password reset connector properties
     */
    connectorProperties: ConnectorPropertyInterface[];
    /**
     * Is read only user stores loading.
     */
    isReadOnlyUserStoresLoading?: boolean;
    /**
     * Tenant admin
     */
    tenantAdmin?: string;
    /**
     * User Disclaimer Message
     */
    editUserDisclaimerMessage?: ReactNode;
    /**
     * Admin user type
     */
    adminUserType?: string;
    /**
     * Is user managed by parent organization.
     */
    isUserManagedByParentOrg?: boolean;
}

/**
 * Basic details component.
 *
 * @param props - Props injected to the basic details component.
 * @returns The react component for the user profile.
 */
export const UserProfile: FunctionComponent<UserProfilePropsInterface> = (
    props: UserProfilePropsInterface
): ReactElement => {

    const {
        onAlertFired,
        user,
        handleUserUpdate,
        isReadOnly,
        isReadOnlyUserStore = false,
        adminUserType = "None",
        [ "data-componentid" ]: componentId = "user-mgt-user-profile"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const profileSchemas: ProfileSchemaInterface[] = useSelector((state: AppState) => state.profile.profileSchemas);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<ProfileInfoInterface>(undefined);
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const createdDate: string = user?.meta?.created;
    const modifiedDate: string = user?.meta?.lastModified;

    const hiddenSchemas: string[] = [
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ROLES_DEFAULT"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACTIVE"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("GROUPS"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PROFILE_URL"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_DISABLED"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ONETIME_PASSWORD"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PREFERRED_MFA_OPTION"),
        "department",
        "dateOfBirth"
    ];

    const displayedAttributes: ProfileSchemaInterface[] = useMemo(() => {
        return profileSchemas.filter((schema: ProfileSchemaInterface) => {
            let resolveSupportedByDefaultValue: boolean = schema?.supportedByDefault?.toLowerCase() === "true";

            if (schema?.profiles?.console?.supportedByDefault !== undefined) {
                resolveSupportedByDefaultValue = schema?.profiles?.console?.supportedByDefault;
            }

            if (hiddenSchemas.includes(schema.name)) {
                return false;
            }

            if (resolveSupportedByDefaultValue && !schema.multiValued) {
                return true;
            }

            return false;
        });
    }, [ profileSchemas ]);

    /**
     * This function handles deletion of the user.
     *
     * @param deletingUser - user object to be deleted.
     */
    const handleUserDelete = (deletingUser: any): void => {
        const userId: string = deletingUser.id;

        deleteUser(userId)
            .then(() => {
                onAlertFired({
                    description: t(
                        "users:notifications.deleteUser.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "users:notifications.deleteUser.success.message"
                    )
                });

                history.push(AppConstants.getPaths().get("USERS"));
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("users:notifications.deleteUser.error.message")
                    });

                    return;
                }

                setAlert({
                    description: t("users:notifications.deleteUser.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("users:notifications.deleteUser.genericError" +
                        ".message")
                });
            });
    };



    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param values - submit values.
     */
    const handleSubmit = (formValues: ProfileInfoInterface): void => {
        const attributeData: any = {
            ...user.attributes,
            ...formValues
        };

        const userData: any = {
            ...user,
            attributes: attributeData
        };

        setIsSubmitting(true);

        updateUserInfo(user.id, userData)
            .then(() => {
                onAlertFired({
                    description: t(
                        "user:profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "user:profile.notifications.updateProfileInfo.success.message"
                    )
                });

                handleUserUpdate(user.id);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.detail || error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.detail || error?.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t("user:profile.notifications.updateProfileInfo." +
                            "error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("user:profile.notifications.updateProfileInfo." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("user:profile.notifications.updateProfileInfo." +
                        "genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const resolveDangerActions = (): ReactElement => {
        return (
            <DangerZoneGroup
                sectionHeader={ t("user:editUser.dangerZoneGroup.header") }
            >
                <DangerZone
                    data-componentId={ `${ componentId }-danger-zone` }
                    actionTitle={ t("user:editUser.dangerZoneGroup." +
                    "deleteUserZone.actionTitle") }
                    header={ t("user:editUser.dangerZoneGroup." +
                    "deleteUserZone.header") }
                    subheader={ commonConfig.userEditSection.isGuestUser
                        ? t("extensions:manage.guest.editUser.dangerZoneGroup.deleteUserZone." +
                            "subheader")
                        : t("user:editUser.dangerZoneGroup." +
                            "deleteUserZone.subheader")
                    }
                    onActionClick={ (): void => {
                        setShowDeleteConfirmationModal(true);
                        setDeletingUser(user);
                    } }
                    isButtonDisabled={
                        adminUserType === AdminAccountTypes.INTERNAL && isReadOnlyUserStore }
                    buttonDisableHint={ t("user:editUser.dangerZoneGroup." +
                    "deleteUserZone.buttonDisableHint") }
                />
            </DangerZoneGroup>
        );
    };

    /**
     * Form validator to validate the value against the schema regex.
     * @param value - Input value.
     * @returns An error if the value is not valid else undefined.
     */
    const validateInput = async (
        value: string,
        schema: ProfileSchemaInterface,
        fieldName: string,
        required: boolean = false
    ):
        Promise<string | undefined> => {
        if (required && isEmpty(value) ) {
            return (
                t("user:profile.forms.generic.inputs.validations.empty", { fieldName })
            );
        }

        if (isEmpty(value)) {
            return undefined;
        }

        if (!RegExp(schema.regEx).test(value)) {
            return (
                t("users:forms.validation.formatError", { field: fieldName })
            );
        }

        return undefined;
    };

    /**
     * This function generates the user profile details form based on the input Profile Schema
     *
     * @param schema - The profile schema to be used to generate the form.
     * @param key - The key for form field the profile schema.
     * @returns the form field for the profile schema.
     */
    const generateProfileEditForm = (schema: ProfileSchemaInterface, key: number): JSX.Element => {
        const fieldsToHide: string[] = [];

        if (fieldsToHide.some((name: string) => schema.name === name)) {
            return;
        }

        const fieldName: string = t("user:profile.fields." +
            schema.name.replace(".", "_"), { defaultValue: schema.displayName }
        );

        return (
            <>
                <FinalFormField
                    data-componentId={ `${ componentId }-profile-form-${ schema.name }-input` }
                    key={ key }
                    ariaLabel="userID"
                    name={  schema.name }
                    type="text"
                    label={ fieldName }
                    component={ TextFieldAdapter }
                    validate={ (value: string) => validateInput(value, schema, fieldName) }
                />
                <Divider hidden/>
            </>
        );
    };

    return (
        <>
            <EmphasizedSegment padded="very">
                <OxygenGrid container>
                    <OxygenGrid lg={ 8 } md={ 16 }>
                        <FinalForm
                            keepDirtyOnReinitialize={ true }
                            onSubmit={ handleSubmit }
                            initialValues={ {
                                ...user.attributes,
                                userID: user.id
                            } }
                            render={ ({ handleSubmit }: FormRenderProps) => {
                                return (
                                    <form
                                        id="user-profile-form"
                                        onSubmit={ handleSubmit }
                                        className="user-profile-form"
                                    >

                                        {
                                            user.id && (
                                                <>
                                                    <FinalFormField
                                                        key="userID"
                                                        data-componentid={ `${ componentId }-userID` }
                                                        component={ TextFieldAdapter }
                                                        label={ t("user:profile.fields.userId") }
                                                        ariaLabel="userID"
                                                        name="userID"
                                                        type="text"
                                                        readOnly={ true }
                                                    />
                                                    <Divider hidden/>
                                                </>
                                            )
                                        }
                                        <FinalFormField
                                            data-componentId={ `${ componentId }-profile-form-givenname-input` }
                                            key={ "givenname" }
                                            ariaLabel="givenname"
                                            type="text"
                                            name={ "name.givenname" }
                                            label={ "First Name" }
                                            component={ TextFieldAdapter }
                                        />
                                        <Divider hidden/>
                                        <FinalFormField
                                            data-componentId={ `${ componentId }-profile-form-lastname-input` }
                                            key={ "lastname" }
                                            ariaLabel="lastname"
                                            type="text"
                                            name={ "name.lastname" }
                                            label={ "Last Name" }
                                            component={ TextFieldAdapter }
                                        />
                                        <Divider hidden/>
                                        {
                                            displayedAttributes &&
                                            displayedAttributes.map((schema: ProfileSchemaInterface, index: number) => {
                                                if (hiddenSchemas.includes(schema.name)) {

                                                    return;
                                                }

                                                return generateProfileEditForm(schema, index);
                                            })
                                        }
                                        {
                                            createdDate && (
                                                <>
                                                    <FinalFormField
                                                        key="createdDate"
                                                        data-componentid={ `${ componentId }-created-date` }
                                                        component={ TextFieldAdapter }
                                                        label={ t("user:profile.fields.createdDate") }
                                                        initialValue={ createdDate
                                                            ? moment(createdDate).format("YYYY-MM-DD")
                                                            : ""
                                                        }
                                                        ariaLabel="createdDate"
                                                        name="createdDate"
                                                        type="text"
                                                        required={ false }
                                                        readOnly={ true }
                                                    />
                                                    <Divider hidden/>
                                                </>
                                            )
                                        }
                                        {
                                            modifiedDate && (
                                                <>
                                                    <FinalFormField
                                                        key="modifiedDate"
                                                        data-componentid={ `${ componentId }-modified-date` }
                                                        component={ TextFieldAdapter }
                                                        label={ t("user:profile.fields.modifiedDate") }
                                                        initialValue={ modifiedDate
                                                            ? moment(modifiedDate).format("YYYY-MM-DD")
                                                            : ""
                                                        }
                                                        ariaLabel="modifiedDate"
                                                        name="modifiedDate"
                                                        type="text"
                                                        required={ false }
                                                        readOnly={ true }
                                                    />
                                                    <Divider hidden/>
                                                </>
                                            )
                                        }
                                        {
                                            !isReadOnly && (
                                                <Button
                                                    data-componentid={ `${ componentId }-form-update-button` }
                                                    variant="contained"
                                                    type="submit"
                                                    size="small"
                                                    className="form-button"
                                                    disabled={ isSubmitting }
                                                    loading={ isSubmitting }
                                                >
                                                    { t("common:update") }
                                                </Button>
                                            )
                                        }
                                    </form>
                                );
                            } }

                        />
                    </OxygenGrid>
                </OxygenGrid>
            </EmphasizedSegment>
            <Divider hidden />
            { resolveDangerActions() }
            {
                deletingUser && (
                    <ConfirmationModal
                        data-componentId={ `${componentId}-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("user:deleteUser.confirmationModal." +
                            "assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => {
                            setShowDeleteConfirmationModal(false);
                            setAlert(null);
                        } }
                        onPrimaryActionClick={ (): void => handleUserDelete(deletingUser) }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-componentId={ `${componentId}-confirmation-modal-header` }>
                            { t("user:deleteUser.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-componentId={ `${componentId}-confirmation-modal-message` }
                            attached
                            negative
                        >
                            { commonConfig.userEditSection.isGuestUser
                                ? t("extensions:manage.guest.deleteUser.confirmationModal.message")
                                : t("user:deleteUser.confirmationModal.message")
                            }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                            { commonConfig.userEditSection.isGuestUser
                                ? t("extensions:manage.guest.deleteUser.confirmationModal.content")
                                : t("user:deleteUser.confirmationModal.content")
                            }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};
