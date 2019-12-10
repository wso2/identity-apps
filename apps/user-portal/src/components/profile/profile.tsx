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

import { Field, Forms, Validation } from "@wso2is/forms";
import { FormValidation } from "@wso2is/validation";
import { isEmpty } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-skeleton-loader";
import { Form, Grid, Icon, List, Popup, Responsive } from "semantic-ui-react";
import { updateProfileInfo } from "../../api";
import * as UIConstants from "../../constants/ui-constants";
import { AuthStateInterface, Notification, ProfileSchema } from "../../models";
import { AppState } from "../../store";
import { getProfileInformation } from "../../store/actions";
import { EditSection, SettingsSection, UserAvatar } from "../shared";

/**
 * Prop types for the basic details component.
 */
interface ProfileProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * Basic details component.
 *
 * @param {ProfileProps} props - Props injected to the basic details component.
 * @return {JSX.Element}
 */
export const Profile: FunctionComponent<ProfileProps> = (props: ProfileProps): JSX.Element => {
    const [profileInfo, setProfileInfo] = useState(new Map<string, string>());
    const [profileSchema, setProfileSchema] = useState<ProfileSchema[]>();
    const [editingForm, setEditingForm] = useState(new Map<string, boolean>());
    const { onNotificationFired } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const profileInfoLoader: boolean = useSelector((state: AppState) => state.loaders.isProfileInfoLoading);
    const profileSchemaLoader: boolean = useSelector((state: AppState) => state.loaders.isProfileSchemaLoading);

    /**
     * This function extracts the sub attributes from the schemas and appends them to the main schema iterable.
     * The returned iterable will have all the schema attributes in a flat structure so that
     * you can just iterate through them to display them.
     * @param schemas
     */
    const flattenSchemas = (schemas: ProfileSchema[]): ProfileSchema[] => {
        const tempSchemas: ProfileSchema[] = [];
        schemas.forEach((schema: ProfileSchema) => {
            if (schema.subAttributes && schema.subAttributes.length > 0) {
                /**
                 * If the schema has sub attributes, then this function will be recursively called.
                 * The returned attributes are pushed into the `tempSchemas` array.
                 */
                tempSchemas.push(...flattenSchemas(schema.subAttributes));
            } else {
                tempSchemas.push(schema);
            }
        });
        return tempSchemas;
    };

    /**
     * This function traverses the whole schema array to find a certain attribute.
     * The found attribute will be returned as a part of the object it belongs to with the who
     * @param schemas
     */
    const parseSchemas = (
        schemas: ProfileSchema[],
        formName: string,
        values: Map<string, string | string[]>,
        value: {}
    ): {} => {
        let schema: ProfileSchema;
        for (schema of schemas) {
            value = {};
            if (schema.name === formName) {
                if (formName === "givenName" || formName === "familyName") {
                    value[schema.name] = values.get(formName);
                } else {
                    value = [{ type: formName, value: values.get(formName) }];
                }

                return value;
            } else if (schema.subAttributes && schema.subAttributes.length > 0) {
                const returnValue = parseSchemas(schema.subAttributes, formName, values, value);
                if (!isEmpty(returnValue)) {
                    value[schema.name] = returnValue;
                    return value;
                }
            }
        }
        return value;
    };

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
        setProfileSchema(flattenSchemas(profileDetails.profileSchemas).sort((a: ProfileSchema, b: ProfileSchema) => {
            if (!a.displayOrder) {
                return -1;
            } else if (!b.displayOrder) {
                return 1;
            } else {
                return parseInt(a.displayOrder, 10) - parseInt(b.displayOrder, 10);
            }
        }));
    }, [profileDetails]);

    /**
     * This adds key-value pairs to the `editingForm` state. This would be used to open and close
     * editing forms.
     * This also maps profile info to the schema.
     */
    useEffect(() => {
        if (!isEmpty(profileSchema) && !isEmpty(profileDetails) && !isEmpty(profileDetails.profileInfo)) {
            const tempEditingForm: Map<string, boolean> = new Map<string, boolean>(editingForm);
            const tempProfileInfo: Map<string, string> = new Map<string, string>(profileInfo);
            profileSchema.forEach((schema: ProfileSchema) => {
                tempEditingForm.set(schema.name, false);
                if (isEmpty(profileDetails.profileInfo[schema.name])) {
                    Object.entries(profileDetails.profileInfo).forEach((profileInfoPair) => {
                        if (Array.isArray(profileInfoPair[1])) {
                            profileInfoPair[1].forEach((subProfileInfo, index: number) => {
                                if (typeof subProfileInfo === "object" && subProfileInfo !== null) {
                                    if (subProfileInfo.type === schema.name) {
                                        tempProfileInfo.set(schema.name, subProfileInfo.value);
                                    }
                                }
                            });
                        } else if (typeof profileInfoPair[1] === "object" && profileInfoPair[1] !== null) {
                            if (profileInfoPair[1][schema.name]) {
                                tempProfileInfo.set(schema.name, profileInfoPair[1][schema.name]);
                            } else if (schema.name === "givenName" || schema.name === "familyName") {
                                tempProfileInfo.set(schema.name, "");
                            }
                        }
                    });
                } else if (Array.isArray(profileDetails.profileInfo[schema.name])) {
                    tempProfileInfo.set(schema.name, profileDetails.profileInfo[schema.name][0]);
                } else {
                    tempProfileInfo.set(schema.name, profileDetails.profileInfo[schema.name]);
                }
            });
            setEditingForm(tempEditingForm);
            setProfileInfo(tempProfileInfo);
        }
    }, [profileSchema, profileDetails]);

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param formName - Name of the form
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
        if (typeof (profileDetails.profileInfo[formName]) === "undefined") {
            Object.entries(profileDetails.profileInfo).forEach((profileInfoPair) => {
                if (Array.isArray(profileInfoPair[1])) {
                    profileInfoPair[1].forEach((subProfileInfo, index: number) => {
                        if (typeof subProfileInfo === "object" && subProfileInfo !== null) {
                            if (subProfileInfo.type === formName) {
                                value[profileInfoPair[0]] = [{
                                    type: formName,
                                    value: values.get(formName)
                                }];
                            }
                        }
                    });
                } else if (typeof profileInfoPair[1] === "object" && profileInfoPair[1] !== null) {
                    Object.entries(profileInfoPair[1]).forEach((subPair) => {
                        if (subPair[0] === formName) {
                            value[profileInfoPair[0]] = {
                                [formName]: Array.isArray(subPair[1])
                                    ? [values.get(formName)]
                                    : values.get(formName)
                            };
                        }
                    });
                }
            });
        } else if (Array.isArray(profileDetails.profileInfo[formName])) {
            value[formName] = [values.get(formName)];
        } else {
            value[formName] = formName === "emails" ? [values.get(formName)] : values.get(formName);
        }

        if (isEmpty(value)) {
            value = { ...parseSchemas(profileDetails.profileSchemas, formName, values, {}) };
        }

        data.Operations[0].value = { ...value };
        updateProfileInfo(data).then((response) => {
            if (response.status === 200) {
                onNotificationFired({
                    description: t("views:components.profile.notifications.updateProfileInfo.success.description"),
                    message: t("views:components.profile.notifications.updateProfileInfo.success.message"),
                    otherProps: {
                        positive: true
                    },
                    visible: true
                });

                // Re-fetch the profile information
                dispatch(getProfileInformation());
            }
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
     * This function generates the Edit Section based on the input Profile Schema
     * @param {Profile Schema} schema
     */
    const generateSchemaForm = (schema: ProfileSchema): JSX.Element => {
        if (editingForm && editingForm.size > 0 && editingForm.get(schema.name)) {
            return (
                <EditSection>
                    <Grid>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column width={ 4 }>{ schema.displayName }</Grid.Column>
                            <Grid.Column width={ 12 }>
                                <Forms
                                    onSubmit={ (values) => {
                                        handleSubmit(values, schema.name);
                                    } }
                                >
                                    <Field
                                        label={ schema.displayName }
                                        name={ schema.name }
                                        placeholder={ t("views:components.profile.forms.generic.inputs.placeholder", {
                                            fieldName: schema.displayName
                                        }) }
                                        required={ schema.required }
                                        requiredErrorMessage={ t(
                                            "views:components.profile.forms." +
                                            "generic.inputs.validations.empty",
                                            {
                                                fieldName: schema.displayName
                                            }
                                        ) }
                                        type="text"
                                        validation={ (value: string, validation: Validation) => {
                                            switch (schema.name) {
                                                case "emails":
                                                    if (!FormValidation.email(value)) {
                                                        validation.errorMessages.push(
                                                            t(
                                                                "views:components.profile.forms." +
                                                                "generic.inputs.validations.invalidFormat",
                                                                {
                                                                    fieldName: schema.displayName
                                                                }
                                                            )
                                                        );
                                                        validation.isValid = false;
                                                    }
                                                    break;
                                                case "mobile":
                                                    if (!FormValidation.mobileNumber(value)) {
                                                        validation.errorMessages.push(t(
                                                            "views:components.profile.forms." +
                                                            "generic.inputs.validations.invalidFormat",
                                                            {
                                                                fieldName: schema.displayName
                                                            }
                                                        ));
                                                        validation.isValid = false;
                                                    }
                                                    break;
                                                case "profileUrl":
                                                    if (!FormValidation.url(value)) {
                                                        validation.errorMessages.push(t(
                                                            "views:components.profile.forms." +
                                                            "generic.inputs.validations.invalidFormat",
                                                            {
                                                                fieldName: schema.displayName
                                                            }
                                                        ));
                                                        validation.isValid = false;
                                                    }
                                                    break;
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
            return (
                <Grid padded={ true }>
                    <Grid.Row columns={ 3 }>
                        < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                            <List.Content>{ schema.displayName }</List.Content>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                            <List.Content>
                                <List.Description>
                                    {
                                        profileInfoLoader || profileSchemaLoader
                                            ? (
                                                <Skeleton width="100%" widthRandomness={ 0.25 } />
                                            )
                                            : profileInfo.get(schema.name)
                                            || t("views:components.profile.forms." +
                                                "generic.inputs.placeholder",
                                                { fieldName: schema.displayName })
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
                                { schema.mutability !== "READ_ONLY" && schema.name !== "userName"
                                    ?
                                    (
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
                                                            : "add" }
                                                    />
                                                )
                                            }
                                            position="top center"
                                            content={ !isEmpty(profileInfo.get(schema.name))
                                                ? t("common:edit")
                                                : t("common:add") }
                                            inverted={ true }
                                        />
                                    ) : null }
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid >
            );
        }
    };

    return (
        < SettingsSection
            description={ t("views:sections.profile.description") }
            header={ t("views:sections.profile.heading") }
            icon={ profileInfoLoader
                ? (
                    <Skeleton height="75px" width="75px" widthRandomness={ 0 } borderRadius="50%" />
                )
                : (
                    <UserAvatar
                        authState={ profileDetails }
                        size="tiny"
                        showGravatarLabel
                        gravatarInfoPopoverText={ (
                            <Trans i18nKey="views:components.userAvatar.infoPopover">
                                This image has been retrieved from
                            <a href={ UIConstants.GRAVATAR_URL } target="_blank" rel="noopener">Gravatar</a> service.
                        </Trans>
                        ) }
                    />
                ) }
            iconMini={ profileInfoLoader
                ? (
                    <Skeleton height="75px" width="75px" widthRandomness={ 0 } borderRadius="50%" />
                )
                : (
                    <UserAvatar
                        authState={ profileDetails }
                        size="tiny"
                        showGravatarLabel
                        gravatarInfoPopoverText={ (
                            <Trans i18nKey="views:components.userAvatar.infoPopover">
                                This image has been retrieved from
                            <a href={ UIConstants.GRAVATAR_URL } target="_blank" rel="noopener">Gravatar</a> service.
                        </Trans>
                        ) }
                    />
                ) }
        >
            <List divided={ true } verticalAlign="middle" className="main-content-inner">
                {
                    profileSchema && profileSchema.map((schema: ProfileSchema, index: number) => {
                        if (schema.name !== "default") {
                            return (
                                <List.Item key={ index } className="inner-list-item">
                                    { generateSchemaForm(schema) }
                                </List.Item>
                            );
                        }
                    })
                }
            </List>
        </SettingsSection>
    );
};
