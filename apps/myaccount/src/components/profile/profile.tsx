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
import { ProfileConstants } from "@wso2is/core/constants";
import { isFeatureEnabled, resolveUserDisplayName, resolveUserEmails } from "@wso2is/core/helpers";
import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { ProfileUtils } from "@wso2is/core/utils";
import { Field, Forms, Validation } from "@wso2is/forms";
import { EditAvatarModal, LinkButton, PrimaryButton, UserAvatar } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { isEmpty } from "lodash";
import React, { FunctionComponent, MouseEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Form, Grid, Icon, List, Placeholder, Popup, Responsive } from "semantic-ui-react";
import { updateProfileInfo } from "../../api";
import { AppConstants, CommonConstants } from "../../constants";
import * as UIConstants from "../../constants/ui-constants";
import { AlertInterface, AlertLevels, AuthStateInterface, FeatureConfigInterface, ProfileSchema } from "../../models";
import { AppState } from "../../store";
import { getProfileInformation, setActiveForm } from "../../store/actions";
import { EditSection, SettingsSection } from "../shared";
import { MobileUpdateWizard } from "../shared/mobile-update-wizard";

/**
 * Prop types for the basic details component.
 * Also see {@link Profile.defaultProps}
 */
interface ProfileProps extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Basic details component.
 *
 * @param {ProfileProps} props - Props injected to the basic details component.
 * @return {JSX.Element}
 */
export const Profile: FunctionComponent<ProfileProps> = (props: ProfileProps): JSX.Element => {

    const {
        onAlertFired,
        featureConfig,
        ["data-testid"]: testId
    } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const isProfileInfoLoading: boolean = useSelector((state: AppState) => state.loaders.isProfileInfoLoading);
    const isSCIMEnabled: boolean = useSelector((state: AppState) => state.profile.isSCIMEnabled);
    const profileSchemaLoader: boolean = useSelector((state: AppState) => state.loaders.isProfileSchemaLoading);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);

    const activeForm: string = useSelector((state: AppState) => state.global.activeForm);

    const [ profileInfo, setProfileInfo ] = useState(new Map<string, string>());
    const [ profileSchema, setProfileSchema ] = useState<ProfileSchema[]>();
    const [ isEmailPending, setEmailPending ] = useState<boolean>(false);
    const [ showEditAvatarModal, setShowEditAvatarModal ] = useState<boolean>(false);
    const [ showMobileUpdateWizard, setShowMobileUpdateWizard ] = useState<boolean>(false);

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
        const sortedSchemas = ProfileUtils.flattenSchemas([...profileDetails.profileSchemas])
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
                                profileDetails.profileInfo.pendingEmails[0].value as string);
                        } else {
                            const primaryEmail = profileDetails.profileInfo[schemaNames[0]] &&
                                profileDetails.profileInfo[schemaNames[0]]
                                .find((subAttribute) => typeof subAttribute === "string");

                            // Set the primary email value.
                            tempProfileInfo.set(schema.name, primaryEmail);
                        }
                    } else {
                        if (schema.extended) {
                            tempProfileInfo.set(
                                schema.name,
                                profileDetails?.profileInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]
                                ? profileDetails?.profileInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA][schemaNames[0]]
                                : ""
                            );
                            return;
                        }
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
     * The following method handles the `onSubmit` event of forms.
     *
     * @param values
     * @param formName
     * @param isExtended
     */
    const handleSubmit = (values: Map<string, string | string[]>, formName: string, isExtended: boolean): void => {
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

        if (ProfileUtils.isMultiValuedSchemaAttribute(profileSchema, schemaNames[0]) ||
            schemaNames[0] === "phoneNumbers") {
            const attributeValues = [];

            if (schemaNames.length === 1) {
                // List of sub attributes.
                const subValue = profileDetails.profileInfo[schemaNames[0]]
                    && profileDetails.profileInfo[schemaNames[0]]
                        .filter((subAttribute) => typeof subAttribute === "object");

                if (subValue && subValue.length > 0) {
                    subValue.map((value) => {
                        attributeValues.push(value);
                    });
                }

                // This is required as the api doesn't support
                // patching the attribute at the sub attribute level.
                value = {
                    [schemaNames[0]]: [
                        ...attributeValues,
                        values?.get(formName)
                    ]
                };

                if (values.get(formName)) {
                    value = {
                        ...value,
                        [ProfileConstants.SCIM2_ENT_USER_SCHEMA]: {
                            "verifyEmail": true
                        }
                    };
                }
            } else {
                let primaryValue = "";

                // The primary value of the email attribute.
                if (schemaNames[0] === "emails" && profileDetails?.profileInfo[schemaNames[0]]) {
                    primaryValue = profileDetails.profileInfo[schemaNames[0]]
                        && profileDetails.profileInfo[schemaNames[0]]
                            .find((subAttribute) => typeof subAttribute === "string");
                }

                // List of sub attributes.
                const subValues = profileDetails.profileInfo[schemaNames[0]]
                    && profileDetails.profileInfo[schemaNames[0]]
                        .filter((subAttribute) => typeof subAttribute ===  "object");

                if (subValues && subValues.length > 0) {
                    subValues.map((value) => {
                        attributeValues.push(value);
                    });
                }

                // This is required as the api doesn't support
                // patching the attribute at the sub attribute level.
                value = {
                    [schemaNames[0]]: [
                        ...attributeValues,
                        primaryValue,
                        {
                            type: schemaNames[1],
                            value: values.get(formName)
                        }
                ]
                };

                if (primaryValue) {
                    value = {
                        ...value,
                        [ProfileConstants.SCIM2_ENT_USER_SCHEMA]: {
                            "verifyEmail": true
                        }
                    };
                }
            }
        } else {
            if (schemaNames.length === 1) {
                if (isExtended) {
                    value = {
                        [ProfileConstants.SCIM2_ENT_USER_SCHEMA]: {
                            [schemaNames[0]]: values.get(formName)
                        }
                    };
                } else {
                    value = { [schemaNames[0]]: values.get(formName) };
                }
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
        }

        data.Operations[0].value = value;
        updateProfileInfo(data).then((response) => {
            if (response.status === 200) {
                onAlertFired({
                    description: t(
                        "myAccount:components.profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.profile.notifications.updateProfileInfo.success.message"
                    )
                });

                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
            }
        }).catch(error => {
            onAlertFired({
                description: error?.detail ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: error?.message ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.message"
                )
            });
        });

        // Hide corresponding edit view
        dispatch(setActiveForm(null));
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
        if (activeForm === CommonConstants.PERSONAL_INFO+schema.name) {
            const fieldName = t("myAccount:components.profile.fields." + schema.name.replace(".", "_"),
                { defaultValue: schema.displayName }
            );
            return (
                isFeatureEnabled(
                    featureConfig?.personalInfo,
                    AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_MOBILE_VERIFICATION")
                ) && checkSchemaType(schema.name, "mobile")
                ? (
                    <EditSection data-testid={ `${testId}-schema-mobile-editing-section` }>
                        <p>
                            { t("myAccount:components.profile.messages.mobileVerification.content") }
                        </p>
                        <Grid padded={ true }>
                            <Grid.Row columns={ 2 }>
                                < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                                    <List.Content>{ fieldName }</List.Content>
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
                                                    || (
                                                        <a
                                                            className="placeholder-text"
                                                            tabIndex={ 0 }
                                                            onClick={ () => {
                                                                setShowMobileUpdateWizard(true);
                                                            } }
                                                            onKeyPress={ (e) => {
                                                                if (e.key === "Enter") {
                                                                    setShowMobileUpdateWizard(true);
                                                                    }
                                                            } }
                                                        >
                                                            { t("myAccount:components.profile.forms.generic.inputs." +
                                                                "placeholder", { fieldName }) }
                                                        </a>
                                                    )
                                            }
                                        </List.Description>
                                    </List.Content>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 2 }>
                                    <PrimaryButton
                                        floated="left"
                                        onClick={ () => {
                                            setShowMobileUpdateWizard(true);
                                        } }
                                    >
                                        { t("common:update").toString() }
                                    </PrimaryButton>
                                </Grid.Column>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 2 }>
                                    <LinkButton
                                        floated="left"
                                        onClick={ () => {
                                            dispatch(setActiveForm(null));
                                        } }
                                    >
                                        { t("common:cancel").toString() }
                                    </LinkButton>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid >
                    </EditSection>
                )
                : (
                    <EditSection data-testid={ `${testId}-schema-editing-section` }>
                        <Grid>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 4 }>{ fieldName }</Grid.Column>
                                <Grid.Column width={ 12 }>
                                    <Forms
                                        onSubmit={ (values) => {
                                            handleSubmit(values, schema.name, schema.extended);
                                        } }
                                    >
                                        <Field
                                            autoFocus={ true }
                                            label=""
                                            name={ schema.name }
                                            placeholder={ t("myAccount:components.profile.forms.generic.inputs." +
                                                "placeholder", {
                                                fieldName
                                            }) }
                                            required={ schema.required }
                                            requiredErrorMessage={ t(
                                                "myAccount:components.profile.forms.generic.inputs.validations.empty",
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
                                                                "myAccount:components.profile.forms." +
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
                                                            "myAccount:components.profile.forms." +
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
                                                maxLength={ schema.name === "emails" ? 50 : 30 }
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
                                                    dispatch(setActiveForm(null));
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
                )
            );
        } else {
            const fieldName = t("myAccount:components.profile.fields." + schema.name.replace(".", "_"),
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
                                                                        t("myAccount:components.profile.messages." +
                                                                            "emailConfirmation.content")
                                                                    }
                                                                    header={
                                                                        t("myAccount:components.profile.messages." +
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
                                                    tabIndex={ 0 }
                                                    onKeyPress={ (e) => {
                                                        if (e.key === "Enter") {
                                                            dispatch(
                                                                setActiveForm(
                                                                    CommonConstants.PERSONAL_INFO + schema.name
                                                                )
                                                            );
                                                        }
                                                    } }
                                                    onClick={ () => {
                                                        dispatch(
                                                            setActiveForm(
                                                                CommonConstants.PERSONAL_INFO + schema.name
                                                            )
                                                        );
                                                    } }
                                                >
                                                    {t("myAccount:components.profile.forms.generic.inputs.placeholder",
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
                                    && schema.mutability !== ProfileConstants.READONLY_SCHEMA
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
                                                        tabIndex={ 0 }
                                                        onKeyPress={ (e) => {
                                                            if (e.key === "Enter") {
                                                                dispatch(
                                                                    setActiveForm(
                                                                        CommonConstants.PERSONAL_INFO + schema.name
                                                                    )
                                                                )
                                                            }
                                                        } }
                                                        onClick={
                                                            () => dispatch(
                                                                setActiveForm(
                                                                    CommonConstants.PERSONAL_INFO + schema.name
                                                                )
                                                            )
                                                        }
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
                    description: t("myAccount:components.profile.notifications.updateProfileInfo.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("myAccount:components.profile.notifications.updateProfileInfo.success.message")
                });

                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    onAlertFired({
                        description: t("myAccount:components.profile.notifications.updateProfileInfo.error" +
                            ".description",
                            { description: error.response.data.detail }),
                        level: AlertLevels.ERROR,
                        message: t("myAccount:components.profile.notifications.updateProfileInfo.error.message")
                    });
                }

                onAlertFired({
                    description: t("myAccount:components.profile.notifications.updateProfileInfo.genericError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:components.profile.notifications.updateProfileInfo.genericError.message")
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
                data-testid={ `${testId}-user-avatar` }
                editable
                showGravatarLabel
                size="tiny"
                tabIndex={ 0 }
                onKeyPress={ (e) => {
                    if (e.key === "Enter") {
                        handleAvatarOnClick();
                    }
                } }
                onClick={ handleAvatarOnClick }
                profileInfo={ profileDetails?.profileInfo as any }
                gravatarInfoPopoverText={ (
                    <Trans i18nKey="myAccount:components.userAvatar.infoPopover">
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
                        data-testid={ `${testId}-edit-avatar-modal` }
                        open={ showEditAvatarModal }
                        name={ resolveUserDisplayName(profileDetails?.profileInfo as any) }
                        emails={ resolveUserEmails(profileDetails?.profileInfo?.emails) }
                        onClose={ () => setShowEditAvatarModal(false) }
                        onCancel={ () => setShowEditAvatarModal(false) }
                        onSubmit={ handleAvatarEditModalSubmit }
                        imageUrl={ profileDetails?.profileInfo?.profileUrl }
                        heading={ t("myAccount:modals.editAvatarModal.heading") }
                        submitButtonText={ t("myAccount:modals.editAvatarModal.primaryButton") }
                        cancelButtonText={ t("myAccount:modals.editAvatarModal.secondaryButton") }
                        translations={ {
                            gravatar: {
                                errors: {
                                    noAssociation: {
                                        content: t("myAccount:modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.content"),
                                        header: t("myAccount:modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.header")
                                    }
                                },
                                heading: t("myAccount:modals.editAvatarModal.content.gravatar.heading")
                            },
                            hostedAvatar: {
                                heading: t("myAccount:modals.editAvatarModal.content.hostedAvatar.heading"),
                                input: {
                                    errors: {
                                        http: {
                                            content: t("myAccount:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.http.content"),
                                            header: t("myAccount:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.http.header")
                                        },
                                        invalid: {
                                            content: t("myAccount:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.invalid.content"),
                                            pointing: t("myAccount:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.invalid.pointing")
                                        }
                                    },
                                    hint: t("myAccount:modals.editAvatarModal.content.hostedAvatar.input.hint"),
                                    placeholder: t("myAccount:modals.editAvatarModal.content.hostedAvatar.input" +
                                        ".placeholder"),
                                    warnings: {
                                        dataURL: {
                                            content: t("myAccount:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.warnings.dataURL.content"),
                                            header: t("myAccount:modals.editAvatarModal.content." +
                                                "hostedAvatar.input.warnings.dataURL.header")
                                        }
                                    }
                                }
                            },
                            systemGenAvatars: {
                                heading: t("myAccount:modals.editAvatarModal.content.systemGenAvatars.heading"),
                                types: {
                                    initials: t("myAccount:modals.editAvatarModal.content.systemGenAvatars." +
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

    /**
     * Handles the close action of the mobile update wizard.
     */
    const handleCloseMobileUpdateWizard = () => {
        setShowMobileUpdateWizard(false);
        dispatch(setActiveForm(null));
    };

    return (
        <SettingsSection
            data-testid={ `${testId}-settings-section` }
            description={ t("myAccount:sections.profile.description") }
            header={ t("myAccount:sections.profile.heading") }
            icon={ renderAvatar() }
            iconMini={ renderAvatar() }
            placeholder={
                !isSCIMEnabled
                    ? t("myAccount:components.profile.placeholders.SCIMDisabled.heading")
                    : null
            }
        >
            <List divided={ true } verticalAlign="middle"
                  className="main-content-inner"
                  data-testid={ `${testId}-schema-list` }>
                {
                    profileSchema && profileSchema.map((schema: ProfileSchema, index: number) => {
                        if (!(schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ROLES_DEFAULT")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("PROFILE_URL")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_DISABLED")
                            || schema.name === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ONETIME_PASSWORD"))) {
                            return (
                                <>
                                    {
                                        showMobileUpdateWizard && checkSchemaType(schema.name, "mobile")
                                            ? (
                                                < MobileUpdateWizard
                                                    data-testid={ `${testId}-mobile-update-wizard` }
                                                    onAlertFired={ onAlertFired }
                                                    closeWizard={ () =>
                                                        handleCloseMobileUpdateWizard()
                                                    }
                                                    wizardOpen={ true }
                                                    currentMobileNumber={ profileInfo.get(schema.name) }
                                                    isMobileRequired={ schema.required }
                                                />
                                            )
                                            : null
                                    }
                                    <List.Item key={ index } className="inner-list-item"
                                               data-testid={ `${testId}-schema-list-item` }>
                                        { generateSchemaForm(schema) }
                                    </List.Item>
                                </>
                            );
                        }
                    })
                }
            </List>
        </SettingsSection>
    );
};

/**
 * Default properties for the {@link Profile} component.
 * See type definitions in {@link ProfileProps}
 */
Profile.defaultProps = {
    "data-testid": "profile"
};
