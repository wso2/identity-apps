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
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Forms, Validation } from "@wso2is/forms";
import { GenericIcon } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Form, Grid, Icon, List, Popup } from "semantic-ui-react";
import { updateProfileInfo } from "../../../api";
import { getAccountRecoveryIcons } from "../../../configs";
import { CommonConstants } from "../../../constants";
import { AlertInterface, AlertLevels, BasicProfileInterface, ProfileSchema } from "../../../models";
import { AppState } from "../../../store";
import { getProfileInformation, setActiveForm } from "../../../store/actions";
import { EditSection } from "../../shared";

/**
 * Email key.
 *
 * @constant
 * @default
 * @type {string}
 */
const EMAIL = "email";

/**
 * Prop types for the EmailRecoveryComponent component.
 * Also see {@link EmailRecovery.defaultProps}
 */
interface EmailRecoveryProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Email recovery section.
 *
 * @param {EmailRecoveryProps} props
 * @return {JSX.Element}
 */
export const EmailRecovery: React.FunctionComponent<EmailRecoveryProps> = (props: EmailRecoveryProps): JSX.Element => {

    const {
        onAlertFired,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const profileInfo: BasicProfileInterface = useSelector(
        (state: AppState) => state.authenticationInformation.profileInfo
    );
    const emailSchema: ProfileSchema = useSelector((state: AppState) => {
        const emailSchemas: ProfileSchema = state.authenticationInformation.profileSchemas.find(
            (profileSchema) => {
            return profileSchema.name === "emails";
        });
        if (emailSchemas && emailSchemas.subAttributes) {
            return emailSchemas.subAttributes[0];
        }
        return emailSchemas;
    });
    const activeForm: string = useSelector((state: AppState) => state.global.activeForm);

    const [ email, setEmail ] = useState("");
    const [ editedEmail, setEditedEmail ] = useState("");
    const [ isEmailPending, setEmailPending ] = useState<boolean>(false);

    let emailType: string;

    /**
     * Set the if the email verification is pending.
     */
    useEffect(() => {
        if (profileInfo?.pendingEmails && !isEmpty(profileInfo?.pendingEmails)) {
            setEmailPending(true);
        }
    }, [ profileInfo?.pendingEmails ]);

    useEffect(() => {
        if (isEmpty(profileInfo)) {
            dispatch(getProfileInformation());
        }
    }, []);

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
            emails: emailType || emailSchema
                ? [
                    {
                        type: emailType || emailSchema.name,
                        value: emailAddress
                    }
                ]
                : [emailAddress]
        };

        updateProfileInfo(data)
            .then(() => {
                onAlertFired({
                    description: t(
                        "myAccount:components.accountRecovery.emailRecovery.notifications.updateEmail" +
                        ".success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.accountRecovery.emailRecovery.notifications.updateEmail.success.message"
                    )
                });

                dispatch(getProfileInformation());
                dispatch(setActiveForm(null));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.accountRecovery.emailRecovery." +
                            "notifications.updateEmail.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.accountRecovery.emailRecovery." +
                            "notifications.updateEmail.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:components.accountRecovery.emailRecovery." +
                        "notifications.updateEmail.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.accountRecovery.emailRecovery." +
                        "notifications.updateEmail.genericError.message"
                    )
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
            if (typeof response.emails[0] === "object" && response.emails[0] !== null) {
                emailAddress = response.emails[0].value;
                emailType = response.emails[0].type;
            } else {
                emailAddress = response.emails[0];
                emailType = "array";
            }
        }
        setEmail(emailAddress);
        setEditedEmail(emailAddress);
    };

    useEffect(() => {
        if (!isEmpty(profileInfo)) {
            setEmailAddress(profileInfo);
        }
    }, [profileInfo]);

    /**
     * This is called when the edit icon is clicked.
     *
     */
    const handleEdit = () => {
        dispatch(setActiveForm(CommonConstants.SECURITY + EMAIL));
    };

    /**
     * This is called when the cancel button is pressed
     */
    const handleCancel = () => {
        dispatch(setActiveForm(null));
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

        Array.from(textToBeMasked).forEach(() => {
            mask += "*";
        });

        return email.replace(textToBeMasked, mask);
    };

    /**
     * This function returns the EditSection component and the recovery option
     * elements based on if the edit icon has been clicked
     */
    const showEditView = () => {
        if (activeForm!==CommonConstants.SECURITY+EMAIL) {
            return (
                <Grid padded={ true }>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 11 } className="first-column">
                            <List.Content floated="left">
                                <GenericIcon
                                    icon={ getAccountRecoveryIcons().email }
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
                                    t("myAccount:components.accountRecovery.emailRecovery.heading")
                                }</List.Header>
                                <List.Description>
                                    {
                                        email || email !== ""
                                        ? t("myAccount:components.accountRecovery.emailRecovery.descriptions.update",
                                            { email: email ? maskEmail(email) : "" })
                                        : t("myAccount:components.accountRecovery.emailRecovery.descriptions.add")
                                    }
                                    {
                                        (email || email !== "") && isEmailPending ? (
                                            <Popup
                                                size="tiny"
                                                trigger={
                                                    <Icon
                                                        style={ { marginLeft: "0.1em" } }
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
                                        ) : null
                                    }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={ 5 } className="last-column">
                            <List.Content floated="right">
                                {email || email !== "" ? (
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
                                    )}
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }
        return (
            <EditSection data-testid={ `${testId}-edit-section` }>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <List>
                                <List.Item>
                                    <List.Content>
                                        <Forms
                                            onSubmit={ (values) => {
                                                handleUpdate(values.get("email").toString());
                                            } }
                                            data-testid={ `${testId}-edit-section-form` }
                                        >
                                            <Field
                                                data-testid={ `${testId}-edit-section-form-email-field` }
                                                autoFocus={ true }
                                                label={ t(
                                                    "myAccount:components.accountRecovery.emailRecovery.forms" +
                                                    ".emailResetForm.inputs.email.label"
                                                ) }
                                                name="email"
                                                placeholder={ t(
                                                    "myAccount:components.accountRecovery.emailRecovery.forms" +
                                                    ".emailResetForm.inputs.email.placeholder"
                                                ) }
                                                required={ true }
                                                requiredErrorMessage={ t(
                                                    "myAccount:components.accountRecovery.emailRecovery.forms" +
                                                    ".emailResetForm.inputs.email.validations.empty"
                                                ) }
                                                type="text"
                                                validation={ (value: string, validation: Validation) => {
                                                    if (!FormValidation.email(value)) {
                                                        validation.isValid = false;
                                                        validation.errorMessages.push(
                                                            t(
                                                                "myAccount:components.accountRecovery.emailRecovery" +
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
                                            <p style={ { fontSize: "12px" } }>
                                                <Icon color="grey" floated="left" name="info circle" />
                                                {t(
                                                    "myAccount:components.profile.forms.emailChangeForm" +
                                                    ".inputs.email.note"
                                                )}
                                            </p>
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
                                        </Forms>

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

/**
 * Default props of {@link EmailRecovery} component.
 * See type definitions in {@link EmailRecoveryProps}
 */
EmailRecovery.defaultProps = {
    "data-testid": "email-recovery"
};
