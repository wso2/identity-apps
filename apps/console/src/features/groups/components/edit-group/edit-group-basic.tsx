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

import {
    AlertInterface,
    AlertLevels,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { ConfirmationModal, DangerZone, DangerZoneGroup, EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Divider, Form, Grid } from "semantic-ui-react";
import { AppConstants, SharedUserStoreConstants, SharedUserStoreUtils, history } from "../../../core";
import { PRIMARY_USERSTORE_PROPERTY_VALUES } from "../../../userstores";
import { deleteGroupById, searchGroupList, updateGroupDetails } from "../../api";
import { GroupsInterface, PatchGroupDataInterface, SearchGroupInterface } from "../../models";

/**
 * Interface to contain props needed for component
 */
interface BasicGroupProps extends TestableComponentInterface {
    /**
     * Group id.
     */
    groupId: string;
    /**
     * Group details
     */
    groupObject: GroupsInterface;
    /**
     * Show if it is group.
     */
    isGroup: boolean;
    /**
     * Handle group update callback.
     */
    onGroupUpdate: () => void;
    /**
     * Show if the user is read only.
     */
    isReadOnly?: boolean;
    /**
     * Enable group and groups separation.
     */
    isGroupAndRoleSeparationEnabled?: boolean;
}

/**
 * Component to edit basic group details.
 *
 * @param props Group object containing details which needs to be edited.
 */
export const BasicGroupDetails: FunctionComponent<BasicGroupProps> = (props: BasicGroupProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        groupId,
        groupObject,
        onGroupUpdate,
        isGroup,
        isReadOnly,
        [ "data-testid" ]: testId
    } = props;

    const [ showGroupDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ labelText, setLableText ] = useState<string>("");
    const [ nameValue, setNameValue ] = useState<string>("");
    const [ isRegExLoading, setRegExLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const userStore: string = groupObject?.displayName?.split("/")?.length > 1
        ? groupObject.displayName.split("/")[0]
        : SharedUserStoreConstants.PRIMARY_USER_STORE;

    useEffect(() => {
        if (groupObject && groupObject.displayName.indexOf("/") !== -1) {
            setNameValue(groupObject.displayName.split("/")[1]);
            setLableText(groupObject.displayName.split("/")[0]);
        } else if (groupObject) {
            setNameValue(groupObject.displayName);
        }
    }, [ groupObject ]);

    /**
     * The following function validates role name against the user store regEx.
     */
    const validateGroupNamePattern = async (): Promise<string> => {
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
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface): void => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle group deletion action.
     *
     * @param id - Group ID which needs to be deleted
     */
    const handleOnDelete = (id: string): void => {
        deleteGroupById(id).then(() => {
            handleAlerts({
                description: t("console:manage.features.groups.notifications.deleteGroup.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("console:manage.features.groups.notifications.deleteGroup.success.message")
            });
            if (isGroup) {
                history.push(AppConstants.getPaths().get("GROUPS"));
            } else {
                history.push(AppConstants.getPaths().get("ROLES"));
            }
        });
    };

    /**
     * Method to update group name for the selected group.
     *
     */
    const updateGroupName = (values: Map<string, FormValue>): void => {
        const newName = values?.get("groupName")?.toString();

        const groupData: PatchGroupDataInterface = {
            Operations: [ {
                "op": "replace",
                "path": "displayName",
                "value": labelText ? labelText + "/" + newName : newName
            } ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        setIsSubmitting(true);

        updateGroupDetails(groupObject.id, groupData)
            .then(() => {
                onGroupUpdate();
                handleAlerts({
                    description: t("console:manage.features.groups.notifications.updateGroup.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.groups.notifications.updateGroup.success.message")
                });
            }).catch(() => {
                handleAlerts({
                    description: t("console:manage.features.groups.notifications.updateGroup.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.groups.notifications.updateGroup.error.message")
                });
            }).finally(() => {
                setIsSubmitting(false);
            })
        ;
    };

    return (
        <>
            <EmphasizedSegment padded="very">
                <Forms
                    onSubmit={ (values) => {
                        updateGroupName(values);
                    } }
                >
                    <Grid className="form-container with-max-width">
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Form.Field>
                                    <label
                                        data-testid={
                                            isGroup
                                                ? `${ testId }-group-name-label`
                                                : `${ testId }-group-name-label`
                                        }
                                    >
                                        {
                                            isGroup
                                                ? t("console:manage.features.groups.edit.basics.fields.groupName.name")
                                                : t("console:manage.features.roles.edit.basics.fields.groupName.name")
                                        }
                                    </label>
                                    <Field
                                        required={ true }
                                        name={ "groupName" }
                                        label={ labelText !== "" ? labelText + " /" : null }
                                        requiredErrorMessage={
                                            isGroup
                                                ? t("console:manage.features.groups.edit.basics.fields.groupName" +
                                                ".required")
                                                : t("console:manage.features.roles.edit.basics.fields.groupName" +
                                                ".required")
                                        }
                                        placeholder={
                                            isGroup
                                                ? t("console:manage.features.groups.edit.basics.fields.groupName." +
                                                "placeholder")
                                                : t("console:manage.features.roles.edit.basics.fields.groupName." +
                                                "placeholder")
                                        }
                                        value={ nameValue }
                                        validation={ async (value: string, validation: Validation) => {
                                            if (value) {
                                                let isGroupNameValid = true;

                                                await validateGroupNamePattern().then(regex => {
                                                    isGroupNameValid = SharedUserStoreUtils
                                                        .validateInputAgainstRegEx(value, regex);
                                                });

                                                if (!isGroupNameValid) {
                                                    validation.isValid = false;
                                                    validation.errorMessages.push(t("console:manage.features." +
                                                        "roles.addRoleWizard.forms.roleBasicDetails.roleName." +
                                                        "validations.invalid",
                                                    { type: "group" }));
                                                }

                                                const searchData: SearchGroupInterface = {
                                                    filter: `displayName eq  ${ userStore }/${ value }`,
                                                    schemas: [
                                                        "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
                                                    ],
                                                    startIndex: 1
                                                };

                                                await searchGroupList(searchData).then(response => {
                                                    if (response?.data?.totalResults !== 0) {
                                                        if (response.data.Resources[0]?.id !== groupId) {
                                                            validation.isValid = false;
                                                            validation.errorMessages.push(
                                                                t("console:manage.features.roles." + "addRoleWizard." +
                                                                    "forms.roleBasicDetails.roleName." +
                                                                    "validations.duplicate",
                                                                { type: "Group" }));
                                                        }
                                                    }

                                                }).catch(() => {
                                                    dispatch(addAlert({
                                                        description: t("console:manage.features.groups.notifications." +
                                                            "fetchGroups.genericError.description"),
                                                        level: AlertLevels.ERROR,
                                                        message: t("console:manage.features.groups.notifications." +
                                                            "fetchGroups.genericError.message")
                                                    }));
                                                });
                                            }
                                        } }
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
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
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
                !isReadOnly && (
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
                            onActionClick={ () => setShowDeleteConfirmationModal(!showGroupDeleteConfirmation) }
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
                showGroupDeleteConfirmation &&
                (<ConfirmationModal
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showGroupDeleteConfirmation }
                    assertionHint={ t("console:manage.features.roles.edit.basics.confirmation.assertionHint") }
                    assertionType="checkbox"
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => handleOnDelete(groupObject.id) }
                    data-testid={
                        isGroup
                            ? `${ testId }-group-confirmation-modal`
                            : `${ testId }-role-confirmation-modal`
                    }
                >
                    <ConfirmationModal.Header>
                        { t("console:manage.features.roles.edit.basics.confirmation.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("console:manage.features.roles.edit.basics.confirmation.message",
                            { type: isGroup ? "group." : "role." }) }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("console:manage.features.roles.edit.basics.confirmation.content",
                            { type: isGroup ? "group" : "role" }) }
                    </ConfirmationModal.Content>
                </ConfirmationModal>)
            }
        </>
    );
};
