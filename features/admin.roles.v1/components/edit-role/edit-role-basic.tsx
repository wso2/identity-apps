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

import {
    AlertInterface,
    AlertLevels,
    RolesInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { ConfirmationModal, DangerZone, DangerZoneGroup, EmphasizedSegment } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, Divider, Form, Grid, InputOnChangeData } from "semantic-ui-react";
import {
    AppConstants,
    SharedUserStoreConstants,
    SharedUserStoreUtils,
    UserStoreDetails,
    UserStoreProperty,
    history
} from "../../../admin.core.v1";
import { PRIMARY_USERSTORE_PROPERTY_VALUES } from "../../../admin.userstores.v1/constants/user-store-constants";
import { deleteRoleById, searchRoleList, updateRoleDetails } from "../../api/roles";
import { PatchRoleDataInterface, SearchRoleInterface } from "../../models/roles";

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
    roleObject: RolesInterface;
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
 * @param props - Role object containing details which needs to be edited.
 */
export const BasicRoleDetails: FunctionComponent<BasicRoleProps> = (props: BasicRoleProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

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
            .then((response: string) => {
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
        let userStoreRegEx: string = "";

        if (userStore !== SharedUserStoreConstants.PRIMARY_USER_STORE) {
            await SharedUserStoreUtils.getUserStoreRegEx(userStore,
                SharedUserStoreConstants.USERSTORE_REGEX_PROPERTIES.RolenameRegEx)
                .then((response: string) => {
                    setRegExLoading(true);
                    userStoreRegEx = response;
                });
        } else {
            await SharedUserStoreUtils.getPrimaryUserStore().then((response: UserStoreDetails) => {
                setRegExLoading(true);
                if (response && response.properties) {
                    userStoreRegEx = response?.properties?.filter((property: UserStoreProperty) => {
                        return property.name === "RolenameJavaScriptRegEx";
                    })[ 0 ].value;
                }
            });
        }

        setRegExLoading(false);

        return new Promise((
            resolve: (value: string | PromiseLike<string>) => void,
            reject: (reason?: any) => void
        ) => {
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
     * @param event - ChangeEvent.
     * @param data - InputOnChangeData.
     */
    const handleRoleNameChange = (event: ChangeEvent, data: InputOnChangeData): void => {
        setIsRoleNamePatternValid(SharedUserStoreUtils.validateInputAgainstRegEx(data?.value, userStoreRegEx));
    };

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
    const handleOnDelete = (id: string): void => {
        deleteRoleById(id).then(() => {
            handleAlerts({
                description: t("roles:notifications.deleteRole.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("roles:notifications.deleteRole.success.message")
            });
            if (isGroup) {
                history.push(AppConstants.getPaths().get("GROUPS"));
            } else {
                history.push(AppConstants.getPaths().get("ROLES"));
            }
        });
    };

    /**
     * Method to update role name for the selected role.
     *
     */
    const updateRoleName = (values: Map<string, FormValue>): void => {
        const newRoleName: string = values?.get("roleName")?.toString();

        const roleData: PatchRoleDataInterface = {
            Operations: [ {
                "op": "replace",
                "path": "displayName",
                "value": labelText ? labelText + "/" + newRoleName : newRoleName
            } ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        setIsSubmitting(true);

        updateRoleDetails(roleObject.id, roleData)
            .then(() => {
                onRoleUpdate();
                handleAlerts({
                    description: t("roles:notifications.updateRole.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("roles:notifications.updateRole.success.message")
                });
            }).catch(() => {
                handleAlerts({
                    description: t("roles:notifications.updateRole.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("roles:notifications.updateRole.error.message")
                });
            }).finally(() => {
                setIsSubmitting(false);
            });

    };

    return (
        <>
            <EmphasizedSegment padded="very">
                <Forms
                    onSubmit={ (values: Map<string, FormValue>) => {
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
                                                : t("roles:edit.basics.fields.roleName.name")
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
                                                : t("roles:edit.basics.fields.roleName" +
                                                ".required")
                                        }
                                        placeholder={
                                            isGroup
                                                ? t("console:manage.features.groups.edit.basics.fields.groupName." +
                                                "placeholder")
                                                : t("roles:edit.basics.fields.roleName." +
                                                "placeholder")
                                        }
                                        value={ nameValue }
                                        validation={ async (value: string, validation: Validation) => {
                                            if (value) {
                                                let isRoleNameValid: boolean = true;

                                                await validateRoleNamePattern().then((regex: string) => {
                                                    isRoleNameValid = SharedUserStoreUtils
                                                        .validateInputAgainstRegEx(value, regex);
                                                });

                                                if (!isRoleNameValid) {
                                                    validation.isValid = false;
                                                    validation.errorMessages.push(t(
                                                        "roles:addRoleWizard.forms.roleBasicDetails.roleName." +
                                                        "validations.invalid",
                                                        { type: "role" }));
                                                }

                                                const searchData: SearchRoleInterface = {
                                                    filter: "displayName eq " + value.toString(),
                                                    schemas: [
                                                        "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
                                                    ],
                                                    startIndex: 1
                                                };

                                                await searchRoleList(searchData).then((response: AxiosResponse) => {
                                                    if (response?.data?.totalResults !== 0) {
                                                        if (response.data.Resources[0]?.id !== roleId) {
                                                            validation.isValid = false;
                                                            validation.errorMessages.push(
                                                                t("roles:addRoleWizard." +
                                                                    "forms.roleBasicDetails.roleName.validations." +
                                                                    "duplicate",
                                                                { type: "Role" }));
                                                        }
                                                    }

                                                }).catch(() => {
                                                    dispatch(addAlert({
                                                        description: t("roles:notifications." +
                                                            "fetchRoles.genericError.description"),
                                                        level: AlertLevels.ERROR,
                                                        message: t("roles:notifications." +
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
                                            { t("roles:edit.basics.buttons.update") }
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
                !isReadOnly && (
                    <DangerZoneGroup sectionHeader="Danger Zone">
                        <DangerZone
                            actionTitle={
                                isGroup
                                    ? t("roles:edit.basics.dangerZone.actionTitle",
                                        { type: "Group" })
                                    : t("roles:edit.basics.dangerZone.actionTitle",
                                        { type: "Role" })
                            }
                            header={
                                isGroup
                                    ? t("roles:edit.basics.dangerZone.header",
                                        { type: "group" })
                                    : t("roles:edit.basics.dangerZone.header",
                                        { type: "role" })
                            }
                            subheader={
                                isGroup
                                    ? t("roles:edit.basics.dangerZone.subheader",
                                        { type: "group" })
                                    : t("roles:edit.basics.dangerZone.subheader",
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
                        type="negative"
                        open={ showRoleDeleteConfirmation }
                        assertionHint={ t("roles:edit.basics.confirmation.assertionHint") }
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
                            { t("roles:edit.basics.confirmation.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            { t("roles:edit.basics.confirmation.message",
                                { type: isGroup ? "group." : "role." }) }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("roles:edit.basics.confirmation.content",
                                { type: isGroup ? "group" : "role" }) }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};
