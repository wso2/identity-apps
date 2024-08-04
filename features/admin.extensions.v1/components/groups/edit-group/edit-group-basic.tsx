/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants, SharedUserStoreConstants, SharedUserStoreUtils, history } from "@wso2is/admin.core.v1";
import {
    GroupsInterface,
    PatchGroupDataInterface,
    SearchGroupInterface,
    deleteGroupById,
    searchGroupList,
    updateGroupDetails
} from "@wso2is/admin.groups.v1";
import { CONSUMER_USERSTORE } from "@wso2is/admin.userstores.v1/constants";
import {
    AlertInterface,
    AlertLevels,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import {
    Code,
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Hint
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, Divider, Form, Grid } from "semantic-ui-react";

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
     * Show if the userstore is a remote userstore.
     */
    isUserstoreRemote?: boolean;
    /**
     * Enable group and groups separation.
     */
    isGroupAndRoleSeparationEnabled?: boolean;
    /**
     * Show if the read only prop is loaded
     */
    isReadOnlyLoading: boolean;
}

/**
 * Component to edit basic group details.
 *
 * @param props - Group object containing details which needs to be edited.
 */
export const BasicGroupDetails: FunctionComponent<BasicGroupProps> = (props: BasicGroupProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        groupId,
        groupObject,
        onGroupUpdate,
        isGroup,
        isReadOnly,
        isUserstoreRemote,
        isReadOnlyLoading,
        [ "data-testid" ]: testId
    } = props;

    const [ showGroupDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ labelText, setLableText ] = useState<string>("");
    const [ nameValue, setNameValue ] = useState<string>("");
    const [ isRegExLoading, setRegExLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        if (groupObject && groupObject.displayName.indexOf("/") !== -1) {
            setNameValue(groupObject.displayName.split("/")[1]);
            setLableText(groupObject.displayName.split("/")[0]);
        } else if (groupObject) {
            setNameValue(groupObject.displayName);
        }
    }, [ groupObject ]);

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
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
     * The following function validates role name against the user store regEx.
     *
     */
    const validateGroupNamePattern = async (): Promise<string> => {
        let userStoreRegEx: string = "";

        await SharedUserStoreUtils.getUserStoreRegEx(CONSUMER_USERSTORE,
            SharedUserStoreConstants.USERSTORE_REGEX_PROPERTIES.RolenameRegEx)
            .then((response: string) => {
                setRegExLoading(true);
                userStoreRegEx = response;
            });

        setRegExLoading(false);

        return new Promise((resolve: (value: string | PromiseLike<string>) => void,
            reject: (reason?: string) => void) => {
            if (userStoreRegEx !== "") {
                resolve(userStoreRegEx);
            } else {
                reject("");
            }
        });

    };

    /**
     * Method to update group name for the selected group.
     *
     */
    const updateGroupName = (values: Map<string, FormValue>): void => {
        const newName: string = values?.get("groupName")?.toString();

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
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <>
            { !isReadOnlyLoading
                ? (
                    <EmphasizedSegment padded="very">
                        <Forms
                            onSubmit={ (values:  Map<string, FormValue>) => {
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
                                                        ? t("console:manage.features.groups.edit.basics.fields." +
                                                            "groupName.name")
                                                        : t("roles:edit.basics.fields." +
                                                            "groupName.name")
                                                }
                                            </label>
                                            <Field
                                                required={ true }
                                                name={ "groupName" }
                                                label={ null }
                                                requiredErrorMessage={
                                                    isGroup
                                                        ? t("console:manage.features.groups.edit.basics.fields." +
                                                            "groupName.required")
                                                        : t("roles:edit.basics.fields." +
                                                            "groupName.required")
                                                }
                                                placeholder={
                                                    isGroup
                                                        ? t("console:manage.features.groups.edit.basics.fields." +
                                                            "groupName.placeholder")
                                                        : t("roles:edit.basics.fields." +
                                                            "groupName.placeholder")
                                                }
                                                value={ nameValue }
                                                type="text"
                                                data-testid={
                                                    isGroup
                                                        ? `${ testId }-group-name-input`
                                                        : `${ testId }-role-name-input`
                                                }
                                                loading={ isRegExLoading }
                                                readOnly={ isReadOnly }
                                                validation={ async (value: string, validation: Validation) => {
                                                    let isGroupNameValid: boolean = true;

                                                    await validateGroupNamePattern().then((regex: string) => {
                                                        isGroupNameValid =
                                                        SharedUserStoreUtils.validateInputAgainstRegEx(value
                                                            , regex);
                                                    });

                                                    if (!isGroupNameValid) {
                                                        validation.isValid = false;
                                                        validation.errorMessages.push(t("console:manage.features." +
                                                            "businessGroups.fields.groupName." +
                                                            "validations.invalid", { type: "group" }));
                                                    }

                                                    const searchData: SearchGroupInterface = {
                                                        filter: `displayName eq  ${ CONSUMER_USERSTORE }/${ value }`,
                                                        schemas: [
                                                            "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
                                                        ],
                                                        startIndex: 1
                                                    };

                                                    await searchGroupList(searchData).then((response: any) => {
                                                        if (response?.data?.totalResults !== 0) {
                                                            if (response.data.Resources[0]?.id !== groupId) {
                                                                validation.isValid = false;
                                                                validation.errorMessages.push(
                                                                    t("roles:addRoleWizard." +
                                                                        "forms.roleBasicDetails.roleName.validations." +
                                                                        "duplicate", { type: "group" }));
                                                            }
                                                        }
                                                    }).catch(() => {
                                                        dispatch(addAlert({
                                                            description: t("console:manage.features.groups." +
                                                                "notifications.fetchGroups.genericError.description"),
                                                            level: AlertLevels.ERROR,
                                                            message: t("console:manage.features.groups." +
                                                                "notifications.fetchGroups.genericError.message")
                                                        }));
                                                    });

                                                } }
                                            />
                                        </Form.Field>
                                        { !isReadOnly && (
                                            <Hint>
                                                A name for the group.
                                                { " " }
                                                Can contain between 3 to 30 alphanumeric characters, dashes
                                                (<Code>-</Code>),{ " " }
                                                and underscores (<Code>_</Code>).
                                            </Hint>)
                                        }
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
                                                    className="form-button"
                                                    data-testid={
                                                        isGroup
                                                            ? `${ testId }-group-update-button`
                                                            : `${ testId }-role-update-button`
                                                    }
                                                    disabled={ isRegExLoading || isSubmitting }
                                                    loading={ isSubmitting }
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
                ) : (
                    <EmphasizedSegment padded>
                        <ContentLoader inline="centered" active/>
                    </EmphasizedSegment>
                )
            }
            <Divider hidden />
            {
                !isReadOnlyLoading && (
                    <DangerZoneGroup sectionHeader="Danger Zone">
                        <DangerZone
                            actionTitle={
                                isGroup
                                    ? t("roles:edit.basics.dangerZone.actionTitle",
                                        { type: "group" })
                                    : t("roles:edit.basics.dangerZone.actionTitle",
                                        { type: "role" })
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
                            onActionClick={ () => setShowDeleteConfirmationModal(!showGroupDeleteConfirmation) }
                            data-testid={
                                isGroup
                                    ? `${ testId }-group-danger-zone`
                                    : `${ testId }-role-danger-zone`
                            }
                            isButtonDisabled={ isReadOnly || isUserstoreRemote }
                            buttonDisableHint = {
                                isGroup
                                    ? t("roles:edit.basics.dangerZone." +
                                        "buttonDisableHint", { type: "group" })
                                    : t("roles:edit.basics.dangerZone." +
                                    "buttonDisableHint", { type: "role" })
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
                    assertionHint={ t("roles:edit.basics.confirmation.assertionHint") }
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
                        { t("roles:edit.basics.confirmation.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("roles:edit.basics.confirmation.message",
                            { type: isGroup ? "group." : "role." }) }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        If you delete this group, the users attached to it will no longer be able to perform{ " " }
                        intended actions that were previously allowed via this group. Please proceed with caution.
                    </ConfirmationModal.Content>
                </ConfirmationModal>)
            }
        </>
    );
};
