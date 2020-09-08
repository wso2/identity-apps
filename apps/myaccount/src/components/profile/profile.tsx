/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { updateProfileImageURL } from "@wso2is/core/api";
import { resolveUserDisplayName, resolveUserEmails } from "@wso2is/core/helpers";
import { Field, Forms, Validation } from "@wso2is/forms";
import { EditAvatarModal, UserAvatar } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { isEmpty } from "lodash";
import React, { FunctionComponent, MouseEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Form, Grid, Icon, List, Placeholder, Popup, Responsive } from "semantic-ui-react";
import { updateProfileInfo } from "../../api";
import * as UIConstants from "../../constants/ui-constants";
import { AlertInterface, AlertLevels, AuthStateInterface, ProfileSchema } from "../../models";
import { AppState } from "../../store";
import { getProfileInformation } from "../../store/actions";
import { flattenSchemas } from "../../utils";
import { EditSection, SettingsSection } from "../shared";

/**
 * Prop types for the basic details component.
 */
interface ProfileProps {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Basic details component.
 *
 * @param {ProfileProps} props - Props injected to the basic details component.
 * @return {JSX.Element}
 */
export const Profile: FunctionComponent<ProfileProps> = (props: ProfileProps): JSX.Element => {

    const { onAlertFired } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const isProfileInfoLoading: boolean = useSelector((state: AppState) => state.loaders.isProfileInfoLoading);
    const isSCIMEnabled: boolean = useSelector((state: AppState) => state.profile.isSCIMEnabled);
    const profileSchemaLoader: boolean = useSelector((state: AppState) => state.loaders.isProfileSchemaLoading);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);

    const [ profileInfo, setProfileInfo ] = useState(new Map<string, string>());
    const [ profileSchema, setProfileSchema ] = useState<ProfileSchema[]>();
    const [ editingForm, setEditingForm ] = useState(new Map<string, boolean>());
    const [ isEmailPending, setEmailPending ] = useState<boolean>(false);
    const [ showEditAvatarModal, setShowEditAvatarModal ] = useState<boolean>(false);

    /**
     * Set the if the email verification is pending.
     */
    useEffect(() => {
        if (profileDetails?.profileInfo?.pendingEmails && !isEmpty(profileDetails?.profileInfo?.pendingEmails)) {
            setEmailPending(true);
        }
    }, [ profileDetails?.profileInfo?.pendingEmails ]);

    /**
     * dispatch getProfileInformation action if the profileDetails object is empty
     */
    useEffect(() => {
        if (isEmpty(profileDetails.profileInfo)) {
            dispatch(getProfileInformation());
        }
    }, []);

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

    }, [profileDetails.profileSchemas]);

    /**
     * This also maps profile info to the schema.
     */
    useEffect(() => {
        if (!isEmpty(profileSchema) && !isEmpty(profileDetails) && !isEmpty(profileDetails.profileInfo)) {
            const tempProfileInfo: Map<string, string> = new Map<string, string>();

            profileSchema.forEach((schema: ProfileSchema) => {
                const schemaNames = schema.name.split(".");

                if (schemaNames.length === 1) {
                    if (schemaNames[0] === "emails") {
                        if (profileDetails?.profileInfo?.pendingEmails?.length > 0) {
                            tempProfileInfo.set(schema.name,
                                profileDetails.profileInfo.pendingEmails[0].value as string)
                        } else {
                            profileDetails.profileInfo[ schemaNames[ 0 ] ][ 0 ] &&
                            profileDetails.profileInfo[ [ schemaNames[ 0 ] ][ 0 ] ][ 0 ].value &&
                            profileDetails.profileInfo[ [ schemaNames[ 0 ] ][ 0 ] ][ 0 ].value !== ""
                                ? tempProfileInfo.set(schema.name,
                                profileDetails.profileInfo[ [ schemaNames[ 0 ] ][ 0 ] ][ 0 ].value as string)
                                : tempProfileInfo.set(
                                    schema.name, profileDetails.profileInfo[ schemaNames[ 0 ] ][ 0 ] as string);
                        }
                    } else {
                        tempProfileInfo.set(schema.name, profileDetails.profileInfo[schemaNames[0]]);
                    }
                } else {
                    if (schemaNames[0] === "name") {
                        tempProfileInfo.set(schema.name, profileDetails.profileInfo[schemaNames[0]][schemaNames[1]]);
                    } else {
                        const subValue = profileDetails.profileInfo[schemaNames[0]]
                            && profileDetails.profileInfo[schemaNames[0]]
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
    }, [profileSchema, profileDetails.profileInfo]);

    /**
     * The following method handles the onClick event of the cancel button.
     *
     * @param formName - Name of the form
     */
    const hideFormEditView = (formName: string): void => {
        const tempEditingForm: Map<string, boolean> = new Map<string, boolean>(editingForm);
        tempEditingForm.set(formName, false);
        setEditingForm(tempEditingForm);
    };

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param values
     * @param formName
     */
    const handleSubmit = (values: Map<string, string | string[]>, formName: string): void => {
        const data = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
        };

        let value = {};

        const schemaNames = formName.split(".");

        if (schemaNames.length === 1) {
            value = schemaNames[0] === "emails"
                ? { emails: [values.get(formName)] }
                : { [schemaNames[0]]: values.get(formName) };
        } else {
            if (schemaNames[0] === "name") {
                value = {
                    name: { [schemaNames[1]]: values.get(formName) }
                };
            } else {
                value = {
                    [schemaNames[0]]: [
                        {
                            type: schemaNames[1],
                            value: values.get(formName)
                        }
                    ]
                };
            }
        }

        data.Operations[0].value = value;
        updateProfileInfo(data).then((response) => {
            if (response.status === 200) {
                onAlertFired({
                    description: t(
                        "userPortal:components.profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "userPortal:components.profile.notifications.updateProfileInfo.success.message"
                    )
                });

                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
            }
        }).catch(error => {
            onAlertFired({
                description: error?.detail ?? t(
                    "userPortal:components.profile.notifications.updateProfileInfo.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: error?.message ?? t(
                    "userPortal:components.profile.notifications.updateProfileInfo.genericError.message"
                )
            });
        });

        // Hide corresponding edit view
        hideFormEditView(formName);
    };

    /**
     * The following method handles the onClick event of the edit button.
     *
     * @param formName - Name of the form
     */
    const showFormEditView = (formName: string): void => {
        const tempEditingForm: Map<string, boolean> = new Map<string, boolean>(editingForm);
        tempEditingForm.set(formName, true);
        setEditingForm(tempEditingForm);
    };

    /**
     * This takes the schema name and a type and sees if the schema is of the specified type
     * @param {string} schema The schema name eg: 'emails.workEmail'
     * @param {string}type The type to check for eg: 'emails'
     *
     * @returns {boolean} True/False
     */
    const checkSchemaType = (schema: string, type: string): boolean => {
        return schema.split(".").filter((name) => {
            return name === type;
        }).length > 0;
    };

    /**
     * This function generates the Edit Section based on the input Profile Schema
     * @param {Profile Schema} schema
     */
    const generateSchemaForm = (schema: ProfileSchema): JSX.Element => {
        if (editingForm && editingForm.size > 0 && editingForm.get(schema.name)) {
            const fieldName = t("userPortal:components.profile.fields." + schema.name.replace(".", "_"),
                { defaultValue: schema.displayName }
            );

            return (
                <EditSection>
                    <Grid>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column width={ 4 }>{fieldName}</Grid.Column>
                            <Grid.Column width={ 12 }>
                                <Forms
                                    onSubmit={ (values) => {
                                        handleSubmit(values, schema.name);
                                    } }
                                >
                                    <Field
                                        autoFocus={ true }
                                        label=""
                                        name={ schema.name }
                                        placeholder={ t("userPortal:components.profile.forms.generic.inputs." +
                                            "placeholder", {
                                            fieldName
                                        }) }
                                        required={ schema.required }
                                        requiredErrorMessage={ t(
                                            "userPortal:components.profile.forms.generic.inputs.validations.empty",
                                            {
                                                fieldName
                                            }
                                        ) }
                                        type="text"
                                        validation={ (value: string, validation: Validation) => {
                                            if (checkSchemaType(schema.name, "emails")) {
                                                if (!FormValidation.email(value)) {
                                                    validation.errorMessages.push(
                                                        t(
                                                            "userPortal:components.profile.forms." +
                                                            "generic.inputs.validations.invalidFormat",
                                                            {
                                                                fieldName
                                                            }
                                                        )
                                                    );
                                                    validation.isValid = false;
                                                }
                                            }
                                            if (checkSchemaType(schema.name, "mobile")) {
                                                if (!FormValidation.mobileNumber(value)) {
                                                    validation.errorMessages.push(t(
                                                        "userPortal:components.profile.forms." +
                                                        "generic.inputs.validations.invalidFormat",
                                                        {
                                                            fieldName
                                                        }
                                                    ));
                                                    validation.isValid = false;
                                                }
                                            }
                                        } }
                                        value={ profileInfo.get(schema.name) }
                                    />
                                    <Field
                                        hidden={ true }
                                        type="divider"
                                    />
                                    <Form.Group>
                                        <Field
                                            size="small"
                                            type="submit"
                                            value={ t("common:save").toString() }
                                        />
                                        <Field
                                            className="link-button"
                                            onClick={ () => {
                                                hideFormEditView(schema.name);
                                            } }
                                            size="small"
                                            type="button"
                                            value={ t("common:cancel").toString() }
                                        />
                                    </Form.Group>
                                </ Forms>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </EditSection >
            );
        } else {
            const fieldName = t("userPortal:components.profile.fields." + schema.name.replace(".", "_"),
                { defaultValue: schema.displayName }
            );
            return (
                <Grid padded={ true }>
                    <Grid.Row columns={ 3 }>
                        < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                            <List.Content>{fieldName}</List.Content>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                            <List.Content>
                                <List.Description>
                                    {
                                        isProfileInfoLoading || profileSchemaLoader
                                            ? (
                                                <Placeholder><Placeholder.Line /></Placeholder>
                                            )
                                            : profileInfo.get(schema.name)
                                            ? (
                                                schema.name === "emails" && isEmailPending
                                                    ? (
                                                        <>
                                                            <p>
                                                                {
                                                                    profileInfo.get(schema.name)
                                                                }
                                                                <Popup
                                                                    size="tiny"
                                                                    trigger={
                                                                        <Icon
                                                                            name="info circle"
                                                                            color="yellow"
                                                                        />
                                                                    }
                                                                    content={
                                                                        t("userPortal:components.profile.messages." +
                                                                            "emailConfirmation.content")
                                                                    }
                                                                    header={
                                                                        t("userPortal:components.profile.messages." +
                                                                            "emailConfirmation.header")
                                                                    }
                                                                    inverted
                                                                />
                                                            </p>
                                                        </>
                                                    )
                                                    : profileInfo.get(schema.name)
                                            )
                                            : (
                                                <a
                                                    className="placeholder-text"
                                                    onClick={ () => { showFormEditView(schema.name); } }
                                                >
                                                    {t("userPortal:components.profile.forms.generic.inputs.placeholder",
                                                        {
                                                            fieldName
                                                        })
                                                    }
                                                </a>
                                            )
                                    }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column
                            mobile={ 2 }
                            tablet={ 2 }
                            computer={ 2 }
                            className={
                                window.innerWidth > Responsive.onlyTablet.minWidth ? "last-column" : ""
                            }
                        >
                            <List.Content floated="right">
                                { !isReadOnlyUser
                                    && schema.mutability !== "READ_ONLY"
                                    && schema.name !== "userName"
                                    && !isEmpty(profileInfo.get(schema.name))
                                    ? (
                                        < Popup
                                            trigger={
                                                (
                                                    <Icon
                                                        link={ true }
                                                        className="list-icon"
                                                        size="small"
                                                        color="grey"
                                                        onClick={ () => showFormEditView(schema.name) }
                                                        name={ !isEmpty(profileInfo.get(schema.name))
                                                            ? "pencil alternate"
                                                            : null }
                                                    />
                                                )
                                            }
                                            position="top center"
                                            content={ !isEmpty(profileInfo.get(schema.name))
                                                ? t("common:edit")
                                                : "" }
                                            inverted={ true }
                                        />
                                    )
                                    : null}
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid >
            );
        }
    };

    /**
     * Handles edit avatar modal submit action.
     *
     * @param {<HTMLButtonElement>} e - Event.
     * @param {string} url - Selected image URL.
     */
    const handleAvatarEditModalSubmit = (e: MouseEvent<HTMLButtonElement>, url: string): void => {
        updateProfileImageURL(url)
            .then(() => {
                onAlertFired({
                    description: t("userPortal:components.profile.notifications.updateProfileInfo.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("userPortal:components.profile.notifications.updateProfileInfo.success.message")
                });

                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    onAlertFired({
                        description: t("userPortal:components.profile.notifications.updateProfileInfo.error" +
                            ".description",
                            { description: error.response.data.detail }),
                        level: AlertLevels.ERROR,
                        message: t("userPortal:components.profile.notifications.updateProfileInfo.error.message")
                    });
                }

                onAlertFired({
                    description: t("userPortal:components.profile.notifications.updateProfileInfo.genericError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("userPortal:components.profile.notifications.updateProfileInfo.genericError.message")
                });
            })
            .finally(() => {
                setShowEditAvatarModal(false);
            });
    };

    /**
     * Renders the user avatar.
     *
     * @return {any}
     */
    const renderAvatar = () => (
        <>
            <UserAvatar
                editable
                showGravatarLabel
                size="tiny"
                onClick={ handleAvatarOnClick }
                profileInfo={ profileDetails?.profileInfo as any }
                gravatarInfoPopoverText={ (
                    <Trans i18nKey="userPortal:components.userAvatar.infoPopover">
                        This image has been retrieved from
                        <a href={ UIConstants.GRAVATAR_URL } target="_blank" rel="noopener noreferrer">
                            Gravatar
                        </a> service.
                    </Trans>
                ) }
            />
            {
                showEditAvatarModal && (
                    <EditAvatarModal
                        open={ showEditAvatarModal }
                        name={ resolveUserDisplayName(profileDetails?.profileInfo as any) }
                        emails={ resolveUserEmails(profileDetails?.profileInfo?.emails) }
                        onClose={ () => setShowEditAvatarModal(false) }
                        onCancel={ () => setShowEditAvatarModal(false) }
                        onSubmit={ handleAvatarEditModalSubmit }
                        heading={ t("userPortal:modals.editAvatarModal.heading") }
                        submitButtonText={ t("userPortal:modals.editAvatarModal.primaryButton") }
                        cancelButtonText={ t("userPortal:modals.editAvatarModal.secondaryButton") }
                        translations={ {
                            gravatar: {
                                errors: {
                                    noAssociation: {
                                        content: t("userPortal:modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.content"),
                                        header: t("userPortal:modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.header")
                                    }
                                },
                                heading: t("userPortal:modals.editAvatarModal.content.gravatar.heading")
                            },
                            hostedAvatar: {
                                heading: t("userPortal:modals.editAvatarModal.content.hostedAvatar.heading"),
                                input: {
                                    errors: {
                                        http: {
                                            content: t("userPortal:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.http.content"),
                                            header: t("userPortal:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.http.header")
                                        },
                                        invalid: {
                                            content: t("userPortal:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.invalid.content"),
                                            pointing: t("userPortal:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.invalid.pointing")
                                        }
                                    },
                                    hint: t("userPortal:modals.editAvatarModal.content.hostedAvatar.input.hint"),
                                    placeholder: t("userPortal:modals.editAvatarModal.content.hostedAvatar.input" +
                                        ".placeholder"),
                                    warnings: {
                                        dataURL: {
                                            content: t("userPortal:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.warnings.dataURL.content"),
                                            header: t("userPortal:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.warnings.dataURL.header")
                                        }
                                    }
                                }
                            },
                            systemGenAvatars: {
                                heading: t("userPortal:modals.editAvatarModal.content.systemGenAvatars.heading"),
                                types: {
                                    initials: t("userPortal:modals.editAvatarModal.content.systemGenAvatars." +
                                        "types.initials")
                                }
                            }
                        } }
                    />
                )
            }
        </>
    );

    /**
     * Handles the onclick action of the avatar.
     */
    const handleAvatarOnClick = () => {
        setShowEditAvatarModal(true);
    };

    return (
        <SettingsSection
            description={ t("userPortal:sections.profile.description") }
            header={ t("userPortal:sections.profile.heading") }
            icon={ renderAvatar() }
            iconMini={ renderAvatar() }
            placeholder={
                !isSCIMEnabled
                    ? t("userPortal:components.profile.placeholders.SCIMDisabled.heading")
                    : null
            }
        >
            <List divided={ true } verticalAlign="middle" className="main-content-inner">
                {
                    profileSchema && profileSchema.map((schema: ProfileSchema, index: number) => {
                        if (schema.name !== "roles.default" && schema.name !== "profileUrl") {
                            return (
                                <List.Item key={ index } className="inner-list-item">
                                    {generateSchemaForm(schema)}
                                </List.Item>
                            );
                        }
                    })
                }
            </List>
        </SettingsSection>
    );
};
