/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Hint } from "@wso2is/react-components";
import React, { FC, Fragment, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Divider, Form, Grid, Icon, Popup, TextArea, TextAreaProps, Transition } from "semantic-ui-react";
import { patchSecret } from "../api/secret";
import { EMPTY_STRING } from "../constants/secrets.common";
import { SecretModel } from "../models/secret";
import { SECRET_VALUE_LENGTH, secretValueValidator } from "../utils/secrets.validation.utils";

const FIELD_I18N_KEY = "console:develop.features.secrets.forms.editSecret.secretValueField";

/**
 * Props interface of {@link SecretValueForm}
 */
export type SecretValueFormProps = {
    editingSecret: SecretModel;
    showInfoBanner?: boolean;
} & IdentifiableComponentInterface;

const SecretValueForm: FC<SecretValueFormProps> = (props: SecretValueFormProps): ReactElement => {

    const {
        editingSecret,
        ["data-componentid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ fieldError, setFieldError ] = useState<string | undefined>(undefined);
    const [ secretFieldTouched, setSecretFieldTouched ] = useState<boolean>(false);
    const [ secretFieldModified, setSecretFieldModified ] = useState<boolean>(false);
    const [ isEditingSecretValue, setIsEditingSecretValue ] = useState<boolean>(false);
    const [ secretValue, setSecretValue ] = useState<string | undefined>(EMPTY_STRING);

    const updateSecretValue = async (valueToUpdate: string) => {
        setLoading(true);
        patchSecret({
            body: {
                operation: "REPLACE",
                path: "/value",
                value: valueToUpdate
            },
            params: {
                secretName: editingSecret?.secretName,
                secretType: editingSecret?.type
            }
        }).then((): void => {
            dispatch(addAlert({
                description: t("console:develop.features.secrets.alerts.updatedSecret.description", {
                    secretName: editingSecret?.secretName,
                    secretType: editingSecret?.type
                }),
                level: AlertLevels.SUCCESS,
                message: t("console:develop.features.secrets.alerts.updatedSecret.message")
            }));
        }).catch((error): void => {
            if (error.response && error.response.data && error.response.data.description) {
                dispatch(addAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: error.response.data?.message
                }));
                return;
            }
            dispatch(addAlert({
                description: t("console:develop.features.secrets.errors.generic.description"),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.secrets.errors.generic.message")
            }));
        }).finally(() => {
            setLoading(false);
            resetFieldState();
        });
    };

    /**
     * This is the secret field value validator. When the field
     * is in readonly mode it will always return undefined.
     *
     * @param value {string} User input.
     * @return error {string | undefined} if valid undefined
     */
    const fieldValidator = (value: string): string | undefined => {
        if (isEditingSecretValue) {
            return secretValueValidator(value);
        }
        return undefined;
    };

    /**
     * The submission handler of this value form. If the value is in
     * readonly mode it will act as a enabler. Otherwise a submission
     * event handler.
     *
     * @event-handler
     * - @param event {React.FormEvent<HTMLFormElement>}
     * - @param data {FormProps}
     */
    const onSubmission = async () => {
        if (isEditingSecretValue) {
            await updateSecretValue(secretValue);
        } else {
            setSecretValue(EMPTY_STRING);
            setIsEditingSecretValue(true);
        }
    };

    /**
     * This resets the state back to initial. This should be called
     * if the user decides to cancel the update operation.
     *
     * @event-handler
     * @return {Promise<void>}
     */
    const resetFieldState = async () => {
        setIsEditingSecretValue(false);
        setFieldError(undefined);
        setSecretFieldTouched(false);
        setSecretFieldModified(false);
        setIsEditingSecretValue(false);
        setSecretValue(EMPTY_STRING);
    };

    /**
     * Calls everytime when textarea value changes.
     *
     * @event-handler
     * @param event {React.ChangeEvent<HTMLInputElement>}
     * @param props {TextAreaProps}
     */
    const onSecretFieldValueChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
        props: TextAreaProps
    ): void => {
        event?.preventDefault();
        setSecretFieldModified(true);
        setSecretFieldTouched(true);
        setSecretValue(String(props.value));
        setFieldError(fieldValidator(String(props.value)));
    };

    return (
        <Fragment>
            <Form
                noValidate={ true }
                aria-labelledby={ testId }
                onSubmit={ onSubmission }>
                <Grid
                    className="form-container with-max-width"
                    columns={ 2 }
                >
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <Form.TextArea
                                type="textarea"
                                className="with-lock-icon"
                                label={ t(`${ FIELD_I18N_KEY }.label`) }
                                aria-label={ t(`${ FIELD_I18N_KEY }.ariaLabel`) }
                                placeholder={
                                    isEditingSecretValue
                                        ? t(`${ FIELD_I18N_KEY }.placeholder`)
                                        : EMPTY_STRING
                                }
                                required={ isEditingSecretValue }
                                readOnly={ !isEditingSecretValue }
                                disabled={ !isEditingSecretValue }
                                minLength={ SECRET_VALUE_LENGTH.min }
                                maxLength={ SECRET_VALUE_LENGTH.max }
                                name="secretValue"
                                control={ TextArea }
                                value={ secretValue }
                                onChange={ onSecretFieldValueChange }
                                onBlur={ () => setSecretFieldTouched(true) }
                                error={ (secretFieldTouched || secretFieldModified) ? fieldError : undefined }
                                style={ { position: "relative" } }
                            />
                            <div className={ "edit-button-transition" }>
                                <Popup
                                    trigger={ (
                                        <Show when={ AccessControlConstants.SECRET_EDIT }>
                                            <Button
                                                type="submit"
                                                loading={ loading }
                                                primary={ isEditingSecretValue && secretValue && !fieldError }
                                                disabled={
                                                    loading ||
                                                    isEditingSecretValue &&
                                                    (!!fieldError || !(secretValue?.trim()))
                                                }
                                                style={ { marginLeft: "-15px", marginTop: "23px" } }
                                                aria-label={
                                                    isEditingSecretValue
                                                        ? t(`${ FIELD_I18N_KEY }.updateButton`)
                                                        : t(`${ FIELD_I18N_KEY }.editButton`)
                                                }
                                                className="ui button icon">
                                                <Icon name={ isEditingSecretValue ? "check" : "pencil alternate" }/>
                                            </Button>
                                        </Show>
                                    ) }
                                    disabled={ isEditingSecretValue && (!!fieldError || !(secretValue?.trim())) }
                                    position="top center"
                                    content={
                                        isEditingSecretValue
                                            ? t(`${ FIELD_I18N_KEY }.updateButton`)
                                            : t(`${ FIELD_I18N_KEY }.editButton`)
                                    }
                                />
                                <Transition
                                    duration={ 500 }
                                    unmountOnHide
                                    animation="fade down"
                                    visible={ isEditingSecretValue }>
                                    { isEditingSecretValue ? (
                                        <Button
                                            type="button"
                                            onClick={ resetFieldState }
                                            style={ { marginLeft: "-15px", marginTop: "5px" } }
                                            aria-label={ t(`${ FIELD_I18N_KEY }.cancelButton`) }
                                            color="red"
                                            icon="cancel"/>
                                    ) : <Fragment/> }
                                </Transition>
                            </div>
                            { isEditingSecretValue ? (
                                <Hint icon="info circle">
                                    { t(`${ FIELD_I18N_KEY }.hint`, {
                                        maxLength: SECRET_VALUE_LENGTH.max,
                                        minLength: SECRET_VALUE_LENGTH.min
                                    }) }
                                </Hint>
                            ) : (
                                <Divider hidden/>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        </Fragment>
    );

};

/**
 * Default props of {@link SecretValueForm}
 */
SecretValueForm.defaultProps = {
    "data-componentid": "secret-value-form",
    showInfoBanner: false
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SecretValueForm;
