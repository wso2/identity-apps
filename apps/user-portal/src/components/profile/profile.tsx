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
import { Form, Grid, Icon, List, Popup, Responsive } from "semantic-ui-react";
import { updateProfileInfo } from "../../api";
import * as UIConstants from "../../constants/ui-constants";
import { AuthStateInterface, createEmptyProfile, Notification } from "../../models";
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

    /**
     *
     * @param schemas
     */
    const flattenSchemas = (schemas: ProfileSchema[]): ProfileSchema[] => {
        const tempSchemas: ProfileSchema[] = [];
        schemas.forEach((schema: ProfileSchema) => {
            if (schema.subAttributes && schema.subAttributes.length > 0) {
                tempSchemas.push(...flattenSchemas(schema.subAttributes));
            } else {
                tempSchemas.push(schema);
            }
        });
        return tempSchemas;
    };

    /**
     * dispatch getProfileInformation action if the profileDetails object is empty
     */
    useEffect(() => {
        if (isEmpty(profileDetails.profileInfo)) {
            dispatch(getProfileInformation());
        }
        getProfileSchemas().then((response: ProfileSchema[]) => {
            setProfileSchema(flattenSchemas(response).sort((a: ProfileSchema, b: ProfileSchema) => {
                if (!a.displayOrder) {
                    return -1;
                } else if (!b.displayOrder) {
                    return 1;
                } else {
                    return parseInt(a.displayOrder, 10) - parseInt(b.displayOrder, 10);
                }
            }));
        });
    }, []);

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
                            tempProfileInfo.set(schema.name, profileInfoPair[1][schema.name]);
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

        const value = {};
        if (isEmpty(profileDetails.profileInfo[formName])) {
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
                    value[profileInfoPair[0]] = { [formName] : values.get(formName) };
                }
            });
        } else if (Array.isArray(profileDetails.profileInfo[formName])) {
            value[formName] = [values.get(formName)];
        } else {
            value[formName] = values.get(formName);
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
                < EditSection >
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
                                        required={ false }
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
                                    { profileInfo.get(schema.name) }
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
            icon={ (
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
            iconMini={ (
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
                        return (
                            <List.Item key={ index } className="inner-list-item">
                                { generateSchemaForm(schema) }
                            </List.Item>
                        );
                    })
                }
            </List>
        </SettingsSection>
    );
};
