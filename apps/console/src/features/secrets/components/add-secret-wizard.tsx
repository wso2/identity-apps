/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    ContentLoader,
    Heading,
    LinkButton,
    Message,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import React, { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Modal } from "semantic-ui-react";
import { AppState, ConfigReducerStateInterface } from "../../core";
import { createSecret, getSecretList } from "../api/secret";
import { EMPTY_STRING } from "../constants/secrets.common";
import { SecretModel } from "../models/secret";
import {
    SECRET_DESCRIPTION_LENGTH,
    SECRET_NAME_LENGTH,
    SECRET_VALUE_LENGTH,
    secretNameValidator,
    secretValueValidator
} from "../utils/secrets.validation.utils";

/**
 * Props interface of {@link AddSecretWizard}
 */
export type AddSecretWizardProps = {
    onClose: (shouldRefresh?: boolean) => void;
} & IdentifiableComponentInterface;

/**
 * A typed constant for dropdown options.
 */
type FieldDropDownOption = {
    key: number | string;
    text: string;
    value: string;
}

const FORM_ID: string = "secrets-add-wizard-form";

/**
 * This wizard is sorely responsible for adding a new `secret` for a
 * given `secret-type`.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
const AddSecretWizard: FC<AddSecretWizardProps> = (props: AddSecretWizardProps): ReactElement => {

    const {
        onClose,
        ["data-componentid"]: testId
    } = props;

    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    /** Form reference to trigger the form submit externally this modal. */
    const formRef = useRef(null);

    const [ showWizard, setShowWizard ] = useState<boolean>(true);
    const [ requestInProgress, setRequestInProgress ] = useState<boolean>(false);
    const [ submitShouldBeDisabled, setSubmitShouldBeDisabled ] = useState<boolean>(false);
    const [ secretTypes, setSecretTypes ] = useState<FieldDropDownOption[]>([]);
    const [ listOfSecretNamesForSecretType, setListOfSecretNamesForSecretType ] = useState<Set<string>>(new Set());
    const [ secretNameInvalid, setSecretNameInvalid ] = useState<boolean>(false);
    const [ secretValueInvalid, setSecretValueInvalid ] = useState<boolean>(false);
    const [ initialFormValues, setInitialFormValues ] = useState<Record<string, any>>({});
    const [ showInfoMessage ] = useState<boolean>(true);

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    /**
     * Initial state hook. Fetches the available secret types and
     * sets it to `secretTypes` state. Also, it fetches the
     * available secrets for the initial secret-type :)
     */
    useEffect(() => {

        setRequestInProgress(true);

        fetchSecretTypes()
            .then(async (response) => {
                setSecretTypes(response);
                const initialSecretType = response.length ? response[0].value : EMPTY_STRING;

                setInitialFormValues({
                    secret_description: EMPTY_STRING,
                    secret_name: EMPTY_STRING,
                    secret_type: initialSecretType,
                    secret_value: EMPTY_STRING
                });
                /**
                 * If we have a initial secret type then, go ahead and fetch
                 * it's added secrets. We use that information to validate the user
                 * input so by the time user enter a secret-name we can before
                 * hand know whether its taken or not.
                 */
                if (initialSecretType) {
                    // Always the secret list for first secret type will be fetched.
                    setListOfSecretNamesForSecretType(
                        new Set((await fetchAllSecretsForSecretType(initialSecretType))
                            .map(({ secretName }) => secretName))
                    );
                }
            })
            .catch((error): void => {
                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: error.response.data?.description,
                        level: AlertLevels.ERROR,
                        message: error.response.data?.message
                    });
                    setRequestInProgress(false);

                    return;
                }
                setAlert({
                    description: t("console:develop.features.secrets.errors.generic.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.secrets.errors.generic.message")
                });
            })
            .finally((): void => {
                setRequestInProgress(false);
            });

    }, []);

    /**
     * Triggered whenever `secretNameInvalid` or
     * `secretValueInvalid` changes.
     */
    useEffect(() => {
        setSubmitShouldBeDisabled(secretNameInvalid || secretValueInvalid);
    }, [ secretNameInvalid, secretValueInvalid ]);

    // TODO: show the secret_type field and listen for its value changes,
    //  onChange, re-fetch the secrets for that type using
    //  {@link fetchAllSecretsForSecretType}

    // TODO: As an UX feature we can directly offer the functionality to
    //  add a secret-type from the dropdown it self. In that way we don't
    //  have to develop another interface for managing the secret-types.
    //  Backend should have the logic to check: "if a secret CRUD operation
    //  is last record of it's type then simply delete it".

    /**
     * Called when the wizard is successfully submitted.
     */
    const onWizardSubmission = async (values): Promise<void> => {
        setRequestInProgress(true);

        try {
            await createSecret({
                body: {
                    description: values.secret_description,
                    name: values.secret_name,
                    value: values.secret_value
                },
                params: {
                    secretType: values.secret_type
                }
            });
            dispatch(addAlert({
                description: t("console:develop.features.secrets.alerts.createdSecret.description", {
                    secretName: values.secret_name,
                    secretType: values.secret_type
                }),
                level: AlertLevels.SUCCESS,
                message: t("console:develop.features.secrets.alerts.createdSecret.message")
            }));
            onWizardClose(true);
            setRequestInProgress(false);
        } catch (error) {
            setRequestInProgress(false);
            if (error.response && error.response.data && error.response.data.description) {
                setAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: error.response.data?.message
                });
            }
        }
    };

    /**
     * Called when wizard Cancel button click and when after a
     * successful submission of the wizard. @see onWizardSubmission.
     *
     * @param shouldRefreshTheSecretListOnClose - should refresh the secret list on close or not.
     */
    const onWizardClose = (shouldRefreshTheSecretListOnClose?: boolean): void => {
        if (onClose)
            onClose(shouldRefreshTheSecretListOnClose);
        else
            setShowWizard(false);
    };

    /**
     * Fetch available secret-types. Note that "ADAPTIVE_AUTH_CALL_CHOREO"
     * is a static secret-type supported by the API.
     *
     * @remarks Note that this function is WIP and may change in the future.
     * @returns Promise of type FieldDropDownOption[].
     */
    const fetchSecretTypes = async (): Promise<FieldDropDownOption[]> => {
        // FIXME: Practically, this should be a API call that fetches all the available
        //  Secret-Types. Currently, our API does not have a get-all route.
        //  https://github.com/wso2/product-is/issues/12447
        return Promise.resolve([
            {
                key: 1,
                text: "Adaptive Script",
                value: "ADAPTIVE_AUTH_CALL_CHOREO"
            } as FieldDropDownOption
        ]);
    };

    /**
     * Fetches all the secrets for the given secret type.
     *
     * @param secretType - Type of the secret.
     * @returns Promise fo type SecretModel[].
     */
    const fetchAllSecretsForSecretType = async (secretType: string): Promise<SecretModel[]> => {
        try {
            const response = await getSecretList({ params: { secretType } });

            return Promise.resolve(response.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.description) {
                setAlert({
                    description: error.response.data?.description,
                    level: AlertLevels.ERROR,
                    message: error.response.data?.message
                });
            }
        }
    };

    return (
        <Modal
            dimmer="blurring"
            size="tiny"
            open={ showWizard }
            onKeyPress={ (e: React.KeyboardEvent) => {
                if (e.key === "Enter" && showWizard) {
                    formRef?.current?.triggerSubmit();
                }
            } }
            onClose={ () => onClose(false) }
            data-componentid={ `${ testId }-view-certificate-modal` }>
            <Modal.Header className="wizard-header">
                { t("console:develop.features.secrets.wizards.addSecret.heading") }
                <Heading as="h6">
                    { t("console:develop.features.secrets.wizards.addSecret.subheading") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container">
                { alert && alertComponent }
                <Form
                    id={ FORM_ID }
                    ref={ formRef }
                    onSubmit={ onWizardSubmission }
                    uncontrolledForm={ false }
                    initialValues={ initialFormValues }>
                    <Field.Dropdown
                        required
                        search
                        disabled
                        hidden
                        name="secret_type"
                        options={ secretTypes }
                        value={ secretTypes.length && secretTypes[0].value }
                        label={ t("console:develop.features.secrets.wizards.addSecret.form.secretTypeField.label") }
                        ariaLabel={ t("console:develop.features.secrets.wizards" +
                            ".addSecret.form.secretTypeField.ariaLabel") }
                        hint={ t("console:develop.features.secrets.wizards.addSecret.form.secretTypeField.hint") }
                    />
                    <Field.Input
                        required
                        name="secret_name"
                        label={ t("console:develop.features.secrets.wizards.addSecret.form.secretNameField.label") }
                        ariaLabel={ t("console:develop.features.secrets.wizards.addSecret." +
                            "form.secretNameField.ariaLabel") }
                        placeholder={ t("console:develop.features.secrets.wizards.addSecret." +
                            "form.secretNameField.placeholder") }
                        minLength={ SECRET_NAME_LENGTH.min }
                        maxLength={ SECRET_NAME_LENGTH.max }
                        inputType="name"
                        hint={ t("console:develop.features.secrets.wizards.addSecret.form.secretNameField.hint") }
                        validate={ (value): string | undefined => {
                            const error = secretNameValidator(value, listOfSecretNamesForSecretType);

                            setSecretNameInvalid(Boolean(error));

                            return error;
                        } }
                    />
                    <Field.Textarea
                        required
                        name="secret_value"
                        ariaLabel={ t("console:develop.features.secrets.wizards.addSecret." +
                            "form.secretValueField.ariaLabel") }
                        label={ t("console:develop.features.secrets.wizards" +
                            ".addSecret.form.secretValueField.label") }
                        placeholder={ t("console:develop.features.secrets.wizards.addSecret" +
                            ".form.secretValueField.placeholder") }
                        minLength={ SECRET_VALUE_LENGTH.min }
                        maxLength={ SECRET_VALUE_LENGTH.max }
                        type="textarea"
                        hint={
                            t("console:develop.features.secrets.wizards.addSecret.form.secretValueField.hint", {
                                maxLength: SECRET_VALUE_LENGTH.max,
                                minLength: SECRET_VALUE_LENGTH.min
                            })
                        }
                        validate={ (value): string | undefined => {
                            const error = secretValueValidator(value);

                            setSecretValueInvalid(Boolean(error));

                            return error;
                        } }
                    />
                    {
                        showInfoMessage && (
                            <Message
                                data-componentid={ `${ testId }-page-message` }
                                type="info"
                                content={
                                    t("console:develop.features.secrets.banners.secretIsHidden.content",
                                        { productName: config.ui?.productName })
                                }
                            />
                        )
                    }
                    <Field.Textarea
                        label={ t("console:develop.features.secrets.wizards.addSecret" +
                            ".form.secretDescriptionField.label") }
                        ariaLabel={ t("console:develop.features.secrets.wizards.addSecret" +
                            ".form.secretDescriptionField.ariaLabel") }
                        placeholder={ t("console:develop.features.secrets.wizards.addSecret.form" +
                            ".secretDescriptionField.placeholder") }
                        name="secret_description"
                        minLength={ SECRET_DESCRIPTION_LENGTH.min }
                        maxLength={ SECRET_DESCRIPTION_LENGTH.max }
                    />
                </Form>
                { requestInProgress && <ContentLoader/> }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                aria-label={
                                    t("console:develop.features.secrets.wizards.actions.cancelButton.ariaLabel")
                                }
                                floated="left"
                                onClick={ () => onWizardClose(false) }
                                data-testid={ `${ testId }-form-cancel-button` }>
                                { t("console:develop.features.secrets.wizards.actions.cancelButton.label") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                aria-label={
                                    t("console:develop.features.secrets.wizards.actions.createButton.ariaLabel")
                                }
                                disabled={ submitShouldBeDisabled || requestInProgress }
                                floated="right"
                                onClick={ () => formRef?.current?.triggerSubmit() }
                                loading={ requestInProgress }
                                data-testid={ `${ testId }-form-submit-button` }>
                                { t("console:develop.features.secrets.wizards.actions.createButton.label") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
            { /* <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header
                    data-testid={ `${ testId }-modal-side-panel-header` }
                    className="wizard-header help-panel-header muted">
                    <div className="help-panel-header-text">
                        Help
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <Suspense fallback={ <ContentLoader/> }>
                        <HelpPanel/>
                    </Suspense>
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel> */ }
        </Modal>
    );

};

/**
 * Default props of {@link AddSecretWizard}
 */
AddSecretWizard.defaultProps = {
    "data-componentid": "add-secret-wizard"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AddSecretWizard;
