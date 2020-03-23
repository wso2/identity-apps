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

import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { Field, Forms } from "@wso2is/forms";
import { ConfirmationModal, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import { isEmpty } from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Divider, Grid } from "semantic-ui-react";
import { deleteUser, updateUserInfo } from "../../api";
import { history } from "../../helpers";
import { AuthStateInterface, BasicProfileInterface, ProfileSchema } from "../../models";
import { AppState } from "../../store";
import { flattenSchemas } from "../../utils";
import * as _ from "lodash";

/**
 * Prop types for the basic details component.
 */
interface ProfileProps {
    onAlertFired: (alert: AlertInterface) => void;
    user: BasicProfileInterface;
    handleUserUpdate: (userId: string) => void;
}

/**
 * Basic details component.
 *
 * @param {ProfileProps} props - Props injected to the basic details component.
 * @return {ReactElement}
 */
export const UserProfile: FunctionComponent<ProfileProps> = (props: ProfileProps): ReactElement => {
    const { onAlertFired, user, handleUserUpdate } = props;
    const { t } = useTranslation();

    const [ profileInfo, setProfileInfo ] = useState(new Map<string, string>());
    const [ profileSchema, setProfileSchema ] = useState<ProfileSchema[]>();
    const [ urlSchema, setUrlSchema ] = useState<ProfileSchema>();
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<BasicProfileInterface>(undefined);
    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);

    /**
     * The following function maps profile details to the SCIM schemas.
     *
     * @param proSchema ProfileSchema
     * @param userInfo BasicProfileInterface
     */
    const mapUserToSchema = (proSchema: ProfileSchema[], userInfo: BasicProfileInterface): void => {
        if (!isEmpty(profileSchema) && !isEmpty(userInfo)) {
            const tempProfileInfo: Map<string, string> = new Map<string, string>();

            proSchema.forEach((schema: ProfileSchema) => {
                const schemaNames = schema.name.split(".");

                if (schemaNames.length === 1) {
                    if (schemaNames[0] === "emails") {
                        if (userInfo?.hasOwnProperty(schemaNames[0]) && userInfo[schemaNames[0]][0]) {
                            userInfo[[schemaNames[0]][0]][0].value &&
                                userInfo[[schemaNames[0]][0]][0].value !== "" ? tempProfileInfo.set(schema.name,
                                    userInfo[[schemaNames[0]][0]][0].value as string)
                                : tempProfileInfo.set(schema.name, userInfo[schemaNames[0]][0] as string);
                        }
                    } else {
                        tempProfileInfo.set(schema.name, userInfo[schemaNames[0]]);
                    }
                } else {
                    if (schemaNames[0] === "name") {
                        const name = schemaNames[1] && userInfo[schemaNames[0]] &&
                            userInfo[schemaNames[0]][schemaNames[1]] && (
                                tempProfileInfo.set(schema.name, userInfo[schemaNames[0]][schemaNames[1]])
                            );
                    } else {
                        const subValue = userInfo[schemaNames[0]]
                            && userInfo[schemaNames[0]]
                                .find((subAttribute) => subAttribute.type === schemaNames[1]);
                        tempProfileInfo.set(
                            schema.name,
                            subValue ? subValue.value : ""
                        );
                    }
                }
            });

            setProfileInfo(tempProfileInfo);
        }
    };

    /**
     * Sort the elements of the profileSchema state according by the displayOrder attribute in the ascending order.
     */
    useEffect(() => {
        const sortedSchemas = flattenSchemas([...profileDetails.profileSchemas])
            .sort((a: ProfileSchema, b: ProfileSchema) => {
                if (!a.displayOrder) {
                    return -1;
                } else if (!b.displayOrder) {
                    return 1;
                } else {
                    return parseInt(a.displayOrder, 10) - parseInt(b.displayOrder, 10);
                }
            });

        setProfileSchema(sortedSchemas);

        const url = sortedSchemas.filter((schema: ProfileSchema) => {
            return schema.name === "profileUrl";
        });

        if (sortedSchemas.length > 0) {
            setUrlSchema(url[0]);
        }

    }, [profileDetails.profileSchemas]);

    useEffect(() => {
        mapUserToSchema(profileSchema, user);
    }, [profileSchema, user]);

    /**
     * This function handles deletion of the user.
     *
     * @param userId
     */
    const handleUserDelete = (userId: string): void => {
        deleteUser(userId)
            .then(() => {
                onAlertFired({
                    description: t(
                        "devPortal:components.users.notifications.deleteUser.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "devPortal:components.users.notifications.deleteUser.success.message"
                    )
                });
                history.push("/users");
            });
    };

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param values
     * @param formName
     */
    const handleSubmit = (values: Map<string, string | string[]>): void => {

        const data = {
            Operations: [],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
        };

        let operation = {
            op: "replace",
            value: {}
        };

        profileSchema.forEach((schema: ProfileSchema) => {
            let opValue = {};

            const schemaNames = schema.name.split(".");

            if (schema.name !== "roles.default") {
                if (values.get(schema.name) !== undefined && values.get(schema.name).toString() !== undefined) {
                    if (schemaNames.length === 1) {
                        opValue = schemaNames[0] === "emails"
                            ? { emails: [values.get(schema.name)] }
                            : { [schemaNames[0]]: values.get(schemaNames[0]) };
                    } else {
                        if (schemaNames[0] === "name") {
                            const name = values.get(schema.name) && (
                                opValue = {
                                    name: { [schemaNames[1]]: values.get(schema.name) }
                                }
                            );
                        } else {
                            opValue = {
                                [schemaNames[0]]: [
                                    {
                                        type: schemaNames[1],
                                        value: values.get(schema.name)
                                    }
                                ]
                            };
                        }
                    }
                }
            }

            operation = {
                op: "replace",
                value: opValue
            };
            data.Operations.push(operation);
        });

        updateUserInfo(user.id, data).then((response) => {
            onAlertFired({
                    description: t(
                        "devPortal:components.user.profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "devPortal:components.user.profile.notifications.updateProfileInfo.success.message"
                    )
                });
            handleUserUpdate(user.id);
        });
    };

    /**
     * This function generates the user profile details form based on the input Profile Schema
     *
     * @param {Profile Schema} schema
     */
    const generateProfileEditForm = (schema: ProfileSchema, key: number): JSX.Element => {
        const fieldName = t("devPortal:components.user.profile.fields." +
            schema.name.replace(".", "_"), { defaultValue: schema.displayName }
        );

        return (
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
                    <Field
                        name={ schema.name }
                        label={ fieldName }
                        required={ schema.required }
                        requiredErrorMessage={ fieldName + " " + "is required" }
                        placeholder={ "Enter your" + " " + fieldName }
                        type="text"
                        value={ profileInfo.get(schema.name) }
                        key={ key }
                    />
                </Grid.Column>
            </Grid.Row>
        );
    };

    return (
        <>
            {
                !_.isEmpty(profileInfo) && (
                    <Forms
                        onSubmit={ (values) => handleSubmit(values) }
                    >
                        <Grid>
                            {
                                profileSchema && profileSchema.map((schema: ProfileSchema, index: number) => {
                                    if (schema.name !== "roles.default") {
                                        return (
                                            generateProfileEditForm(schema, index)
                                        );
                                    }
                                })
                            }
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <Button primary type="submit" size="small" className="form-button">
                                        Update
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Forms>
                )
            }
            <Divider hidden />
            <DangerZoneGroup sectionHeader="Danger Zone">
                <DangerZone
                    actionTitle="Delete user"
                    header="Delete the user"
                    subheader="This action is irreversible. Please proceed with caution."
                    onActionClick={ (): void => {
                        setShowDeleteConfirmationModal(true);
                        setDeletingUser(user);
                    } }
                />
            </DangerZoneGroup>
            {
                deletingUser && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingUser.userName }
                        assertionHint={ <p>Please type <strong>{ deletingUser.userName }</strong> to confirm.</p> }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleUserDelete(deletingUser.id) }
                    >
                        <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            This action is irreversible and will permanently delete the user.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            If you delete this user, the user will not be able to login to the developer portal or any
                            other application the user was subscribed before. Please proceed with caution.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};
