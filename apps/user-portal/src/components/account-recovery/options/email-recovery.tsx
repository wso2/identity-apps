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
 * under the License.
 */
import { Field, Fo2m, GroupFields, Validation } from "@wso2is/fo2m";
import Validator from "@wso2is/validator";
import { FORMERR } from "dns";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Form, Grid, Icon, List } from "semantic-ui-react";
import { updateProfileInfo } from "../../../api";
import { AccountRecoveryIcons } from "../../../configs";
import { BasicProfileInterface, Notification } from "../../../models";
import { AppState } from "../../../store";
import { getProfileInformation } from "../../../store/actions";
import { EditSection, ThemeIcon } from "../../shared";

/**
 * Prop types for the EmailRecoveryComponent component.
 */
interface EmailRecoveryProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * Email recovery section.
 *
 * @param {EmailRecoveryProps} props
 * @return {JSX.Element}
 */
export const EmailRecovery: React.FunctionComponent<EmailRecoveryProps> = (props: EmailRecoveryProps): JSX.Element => {
    const [email, setEmail] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const { t } = useTranslation();
    const { onNotificationFired } = props;
    const dispatch = useDispatch();
    const profileInfo: BasicProfileInterface = useSelector(
        (state: AppState) => state.authenticationInformation.profileInfo
    );

    useEffect(() => {
        if (isEmpty(profileInfo)) {
            dispatch(getProfileInformation());
        }
    }, []);

    useEffect(() => {
        if (!isEmpty(profileInfo)) {
            setEmailAddress(profileInfo);
        }
    }, [profileInfo]);

    const handleUpdate = (emailAddress: string) => {
        const data = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
        };

        data.Operations[0].value = {
            emails: [emailAddress]
        };

        updateProfileInfo(data)
            .then((response) => {
                onNotificationFired({
                    description: t(
                        "views:components.accountRecovery.emailRecovery.notifications.updateEmail" +
                        ".success.description"
                    ),
                    message: t(
                        "views:components.accountRecovery.emailRecovery.notifications.updateEmail.success.message"
                    ),
                    otherProps: {
                        positive: true
                    },
                    visible: true
                });
                dispatch(getProfileInformation());
                setIsEdit(false);
            })
            .catch((error) => {
                onNotificationFired({
                    description: error && error.data && error.data.details
                        ? t(
                            "views:components.accountRecovery.emailRecovery." +
                            "notifications.updateEmail.error.description",
                            {
                                description: error.data.details
                            }
                        )
                        : t(
                            "views:components.accountRecovery.emailRecovery." +
                            "notifications.updateEmail.genericError.description"
                        ),
                    message: error && error.data && error.data.details
                        ? t(
                            "views:components.accountRecovery.emailRecovery." +
                            "notifications.updateEmail.error.message"
                        )
                        : t(
                            "views:components.accountRecovery.emailRecovery." +
                            "notifications.updateEmail.genericError.message"
                        ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                });
            });
    };

    /**
     * This function gets the email address from the response passed as the argument
     * and assigns it to email and editedEmail.
     * @param response
     * @remark Temporarily the first element in the emails array is shown.
     * In the future, we need to decide whether or not to allow multiple recovery emails
     */
    const setEmailAddress = (response) => {
        let emailAddress = "";
        if (response.emails) {
            emailAddress = response.emails[0];
        }
        setEmail(emailAddress);
        setEditedEmail(emailAddress);
    };

    /**
     * This is called when the edit icon is clicked.
     *
     */
    const handleEdit = () => {
        setIsEdit(true);
    };

    /**
     * This is called when the cancel button is pressed
     */
    const handleCancel = () => {
        setIsEdit(false);
    };

    /**
     * This function masks the email address passed as the argument and returns
     * the masked email address.
     * The text between the second character of the email and the @ sign is masked.
     * @param emailAddress
     */
    const maskEmail = (emailAddress: string) => {
        let mask = "";
        const indexOfAt = emailAddress.indexOf("@");
        const textToBeMasked = emailAddress.slice(2, indexOfAt);

        for (const i of textToBeMasked) {
            mask += "*";
        }

        return email.replace(textToBeMasked, mask);
    };

    /**
     * This function returns the EditSection component and the recovery option
     * elements based on if the edit icon has been clicked
     */
    const showEditView = () => {
        if (!isEdit) {
            return (
                <Grid padded={ true }>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 11 } className="first-column">
                            <List.Content floated="left">
                                <ThemeIcon
                                    icon={ AccountRecoveryIcons.email }
                                    size="mini"
                                    twoTone={ true }
                                    transparent={ true }
                                    square={ true }
                                    rounded={ true }
                                    relaxed={ true }
                                />
                            </List.Content>
                            <List.Content>
                                <List.Header>{
                                    t("views:components.accountRecovery.emailRecovery.heading")
                                }</List.Header>
                                <List.Description>
                                    { email || email !== ""
                                        ? t("views:components.accountRecovery.emailRecovery.descriptions.update", {
                                            email: email ? maskEmail(email) : ""
                                        })
                                        : t("views:components.accountRecovery.emailRecovery.descriptions.add") }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={ 5 } className="last-column">
                            <List.Content floated="right">
                                { email || email !== "" ? (
                                    <Icon
                                        link={ true }
                                        onClick={ handleEdit }
                                        className="list-icon"
                                        size="small"
                                        color="grey"
                                        name="pencil alternate"
                                    />
                                ) : (
                                        <Icon
                                            link={ true }
                                            onClick={ handleEdit }
                                            className="list-icon"
                                            size="small"
                                            color="grey"
                                            name="plus"
                                        />
                                    ) }
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }
        return (
            <EditSection>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <List>
                                <List.Item>
                                    <List.Content>
                                        <Fo2m
                                            onSubmit={ (values) => {
                                                handleUpdate(values.get("email").toString());
                                            } }
                                        >
                                            <Field
                                                label={ t(
                                                    "views:components.accountRecovery.emailRecovery.forms" +
                                                    ".emailResetForm.inputs.email.label"
                                                ) }
                                                name="email"
                                                placeholder={ t(
                                                    "views:components.accountRecovery.emailRecovery.forms" +
                                                    ".emailResetForm.inputs.email.placeholder"
                                                ) }
                                                required={ true }
                                                requiredErrorMessage={ t(
                                                    "views:components.accountRecovery.emailRecovery.forms" +
                                                    ".emailResetForm.inputs.email.validations.empty"
                                                ) }
                                                type="text"
                                                validation={ (value: string, validation: Validation) => {
                                                    if (!Validator.email(value)) {
                                                        validation.isValid = false;
                                                        validation.errorMessages.push(
                                                            t(
                                                                "views:components.accountRecovery.emailRecovery" +
                                                                ".forms.emailResetForm.inputs.email." +
                                                                "validations.invalidFormat"
                                                            ).toString()
                                                        );
                                                    }
                                                }
                                                }
                                                value={ editedEmail }
                                                width={ 9 }
                                            />
                                            <Field
                                                hidden={ true }
                                                type="divider"
                                            />
                                            <Form.Group inline={ true }>
                                                <Field
                                                    size="small"
                                                    type="submit"
                                                    value={ t("common:update").toString() }
                                                />
                                                <Field
                                                    className="link-button"
                                                    onClick={ handleCancel }
                                                    size="small"
                                                    type="button"
                                                    value={ t("common:cancel").toString() }
                                                />
                                            </Form.Group>
                                        </Fo2m>

                                    </List.Content>
                                </List.Item>
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EditSection >
        );
    };

    return showEditView();
};
