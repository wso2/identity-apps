/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { Code, ContentLoader, Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import React, { FC, Fragment, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, Modal } from "semantic-ui-react";
import { createSecret, getSecretList } from "../api/secret";
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

/**
 * This wizard is sorely responsible for adding a new `secret` for a
 * given `secret-type`.
 *
 * Known Issue TODO: https://github.com/wso2/product-is/issues/12447
 *                   Need to add i18n strings, access-control, event-publishers
 * @param props {AddSecretWizardProps}
 * @constructor
 */
const AddSecretWizard: FC<AddSecretWizardProps> = (props: AddSecretWizardProps): ReactElement => {

    const {
        onClose,
        ["data-componentid"]: testId
    } = props;

    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const dispatch = useDispatch();

    /** Form reference to trigger the form submit externally this modal. */
    const formRef = useRef(null);

    const [ showWizard, setShowWizard ] = useState<boolean>(true);
    const [ requestInProgress, setRequestInProgress ] = useState<boolean>(false);
    const [ submitShouldBeDisabled, setSubmitShouldBeDisabled ] = useState<boolean>(false);
    const [ secretTypes, setSecretTypes ] = useState<FieldDropDownOption[]>([]);
    const [ listOfSecretNamesForSecretType, setListOfSecretNamesForSecretType ] = useState<Set<string>>(new Set());

    // const [ selectedSecretTypeInvalid, setSelectedSecretTypeInvalid ] = useState<boolean>(false);
    // const [ secretDescriptionInvalid, setSecretDescriptionInvalid ] = useState<boolean>(false);
    const [ secretNameInvalid, setSecretNameInvalid ] = useState<boolean>(false);
    const [ secretValueInvalid, setSecretValueInvalid ] = useState<boolean>(false);

    const [ initialFormValues, setInitialFormValues ] = useState<Record<string, any>>({});

    /**
     * Initial state hook. Fetches the available secret types and
     * sets it to {@code secretTypes} state. Also, it fetches the
     * available secrets for the initial secret-type :)
     */
    useEffect(() => {

        setRequestInProgress(true);

        fetchSecretTypes()
            .then(async (response) => {
                setSecretTypes(response);
                const initialSecretType = response.length ? response[0].value : "";
                setInitialFormValues({
                    secret_description: "",
                    secret_name: "",
                    secret_type: initialSecretType,
                    secret_value: ""
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
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Cannot get available secret types."
                    });
                    setRequestInProgress(false);
                    return;
                }
                setAlert({
                    description: "Something went wrong",
                    level: AlertLevels.ERROR,
                    message: "This wasn't suppose to happen. Try refreshing the page."
                });
            })
            .finally((): void => {
                setRequestInProgress(false);
            });

    }, []);

    useEffect(() => {
        setSubmitShouldBeDisabled(secretNameInvalid || secretValueInvalid);
    }, [ secretNameInvalid, secretValueInvalid ]);

    // TODO: show the secret_type field and listen for its value changes,
    //       onChange, re-fetch the secrets for that type using
    //       {@link fetchAllSecretsForSecretType}

    // TODO: As an UX feature we can directly offer the functionality to
    //       add a secret-type from the dropdown it self. In that way we don't
    //       have to develop another interface for managing the secret-types.
    //       Backend should have the logic to check: "if a secret CRUD operation
    //       is last record of it's type then simply delete it".

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
                description: `Successfully created Secret ${ values.secret_name }`,
                level: AlertLevels.SUCCESS,
                message: `Created Secret for ${ values.secret_type }`
            }));
            onWizardClose(true);
            setRequestInProgress(false);
        } catch (error) {
            setRequestInProgress(false);
            if (error.response && error.response.data && error.response.data.description) {
                setAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: error.response.data.message
                });
            }
        }
    };

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
     * @return {Promise<FieldDropDownOption[]>}
     */
    const fetchSecretTypes = async (): Promise<FieldDropDownOption[]> => {
        // FIXME: Practically, this should be a API call that fetches all the available
        //        Secret-Types. Currently, our API does not have a get-all route.
        return Promise.resolve([
            {
                key: 1,
                text: "Adaptive Script",
                value: "ADAPTIVE_AUTH_CALL_CHOREO"
            } as FieldDropDownOption
        ]);
    };

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
            scrolling
            size="tiny"
            open={ showWizard }
            onClose={ () => onClose(false) }
            data-testid={ `${ testId }-view-certificate-modal` }>
            <Modal.Header className="wizard-header">
                Create Secret
                <Heading as="h6">
                    Create a new Secret for External APIs or Adaptive Authentication script
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container">
                { alert && alertComponent }
                <Form
                    ref={ formRef }
                    onSubmit={ onWizardSubmission }
                    uncontrolledForm={ false }
                    initialValues={ initialFormValues }>
                    <Field.Dropdown
                        required
                        search
                        disabled
                        hidden
                        value={ secretTypes.length && secretTypes[0].value }
                        options={ secretTypes }
                        label="Select Secret Type"
                        ariaLabel="Select an Secret Type"
                        name="secret_type"
                        hint={ "Select a Secret Type which this secret falls into." }
                        // TODO: implement validation here if above improvement added.
                    />
                    <Field.Input
                        required
                        name="secret_name"
                        label="Secret Name"
                        ariaLabel="Secret Name for the secret type"
                        placeholder="Enter a Secret Name for the Secret Type"
                        minLength={ SECRET_NAME_LENGTH.min }
                        maxLength={ SECRET_NAME_LENGTH.max }
                        inputType="name"
                        hint={
                            <Fragment>
                                Give a meaningful name for this secret. Note that once you create this secret with the
                                name above, you <strong>cannot change</strong> it afterwards.
                            </Fragment>
                        }
                        validate={ (value): string | undefined => {
                            const error = secretNameValidator(value, listOfSecretNamesForSecretType);
                            setSecretNameInvalid(Boolean(error));
                            return error;
                        } }
                    />
                    <Field.Input
                        required
                        label="Secret Value"
                        name="secret_value"
                        ariaLabel="Secret value"
                        placeholder="Enter a Secret Value"
                        minLength={ SECRET_VALUE_LENGTH.min }
                        maxLength={ SECRET_VALUE_LENGTH.max }
                        type="password"
                        inputType="password"
                        hint={
                            <Fragment>
                                This is the value of the secret. You can enter a value between length&nbsp;
                                <Code>{ SECRET_VALUE_LENGTH.min }</Code> to <Code>{ SECRET_VALUE_LENGTH.max }</Code>.
                            </Fragment>
                        }
                        validate={ (value): string | undefined => {
                            const error = secretValueValidator(value);
                            setSecretValueInvalid(Boolean(error));
                            return error;
                        } }
                    />
                    <Field.Textarea
                        label="Secret Description"
                        ariaLabel="Secret's description"
                        placeholder="Enter a Secret Description"
                        name="secret_description"
                        minLength={ SECRET_DESCRIPTION_LENGTH.min }
                        maxLength={ SECRET_DESCRIPTION_LENGTH.max }
                        hint={
                            <Fragment>
                                Give a description for this secret (i.e., When to use this secret).
                                Note that you <strong>can update</strong> this description anytime.
                            </Fragment>
                        }
                    />
                </Form>
                { requestInProgress && <ContentLoader/> }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => onWizardClose(false) }
                                data-testid={ `${ testId }-form-cancel-button` }>
                                Cancel
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                aria-label="Submission Button"
                                disabled={ submitShouldBeDisabled }
                                floated="right"
                                onClick={ () => formRef?.current?.triggerSubmit() }
                                loading={ requestInProgress }
                                data-testid={ `${ testId }-form-submit-button` }>
                                Finish
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );

};

/**
 * Default props of {@link AddSecretWizard}
 */
AddSecretWizard.defaultProps = {
    "data-componentid": "add-secret-wizard"
};

export default AddSecretWizard;
