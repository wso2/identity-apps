/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/forms";
import { ContentLoader, Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Modal } from "semantic-ui-react";
import FunctionLibraryContentEditor from "./function-library-content-editor";
import { createFunctionLibrary } from "../api/function-library";
import { FUNCTION_LIBRARY_ADD_WIZARD } from "../constants/component-ids";
import { FunctionLibraryConstants } from "../constants/function-library-constants";

/**
 * Props interface of {@link AddFunctionLibraryWizard}.
 */
type AddFunctionLibraryWizardPropsInterface = {
    /**
     * Called when the wizard is closed. `shouldRefresh` indicates whether the
     * function library list should be refreshed.
     */
    onClose: (shouldRefresh?: boolean) => void;
} & IdentifiableComponentInterface;

interface AddFunctionLibraryFormValuesInterface {
    name: string;
    description: string;
}

const FORM_ID: string = "add-function-library-form";

/**
 * Modal wizard used to create a new function library.
 *
 * @param props - Props injected to the component.
 * @returns Add function library wizard.
 */
const AddFunctionLibraryWizard: FunctionComponent<AddFunctionLibraryWizardPropsInterface> = (
    props: AddFunctionLibraryWizardPropsInterface
): ReactElement => {
    const {
        onClose,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const formRef: React.MutableRefObject<any> = useRef(null);

    const [ content, setContent ] = useState<string>("");
    const [ contentError, setContentError ] = useState<string>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const handleClose: (shouldRefresh?: boolean) => void = (shouldRefresh?: boolean): void => {
        onClose(shouldRefresh);
    };

    const handleSubmit: (values: AddFunctionLibraryFormValuesInterface) => void = (
        values: AddFunctionLibraryFormValuesInterface
    ): void => {
        if (!content) {
            setContentError(t("functionLibraries:forms.content.validations.empty"));

            return;
        }

        setIsSubmitting(true);

        createFunctionLibrary({
            content,
            description: values.description,
            name: values.name
        })
            .then(() => {
                dispatch(addAlert({
                    description: t("functionLibraries:notifications.create.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("functionLibraries:notifications.create.success.message")
                }));
                handleClose(true);
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                setAlert({
                    description: error?.response?.data?.description
                        ?? t("functionLibraries:notifications.create.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        ?? t("functionLibraries:notifications.create.genericError.message")
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <Modal
            dimmer="blurring"
            size="large"
            open={ true }
            onClose={ () => handleClose(false) }
            data-componentid={ componentId }
        >
            <Modal.Header className="wizard-header">
                { t("functionLibraries:wizards.add.heading") }
                <Heading as="h6">
                    { t("functionLibraries:wizards.add.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                <Form
                    id={ FORM_ID }
                    ref={ formRef }
                    uncontrolledForm={ false }
                    onSubmit={ handleSubmit }
                    initialValues={ {
                        description: "",
                        name: ""
                    } }
                >
                    <Field.Input
                        ariaLabel="Function library name"
                        inputType="name"
                        name="name"
                        label={ t("functionLibraries:forms.name.label") }
                        placeholder={ t("functionLibraries:forms.name.placeholder") }
                        hint={ t("functionLibraries:forms.name.hint") }
                        required={ true }
                        minLength={ FunctionLibraryConstants.NAME_MIN_LENGTH }
                        maxLength={ FunctionLibraryConstants.NAME_MAX_LENGTH }
                        validate={ (value: string): string | undefined => {
                            if (value && !FunctionLibraryConstants.NAME_REGEX.test(value)) {
                                return t("functionLibraries:forms.name.validations.invalid");
                            }
                        } }
                        width={ 16 }
                        data-componentid={ `${ componentId }-name-input` }
                    />
                    <Field.Textarea
                        ariaLabel="Function library description"
                        name="description"
                        label={ t("functionLibraries:forms.description.label") }
                        placeholder={ t("functionLibraries:forms.description.placeholder") }
                        required={ false }
                        maxLength={ FunctionLibraryConstants.DESCRIPTION_MAX_LENGTH }
                        minLength={ 0 }
                        width={ 16 }
                        data-componentid={ `${ componentId }-description-input` }
                    />
                </Form>
                <FunctionLibraryContentEditor
                    value={ content }
                    onChange={ (value: string) => {
                        setContent(value);
                        if (value) {
                            setContentError(undefined);
                        }
                    } }
                    data-componentid={ `${ componentId }-content-editor` }
                />
                { contentError && (
                    <div className="field error function-library-content-error">
                        { contentError }
                    </div>
                ) }
                { isSubmitting && <ContentLoader /> }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => handleClose(false) }
                                data-componentid={ `${ componentId }-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                floated="right"
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                                onClick={ () => formRef?.current?.triggerSubmit() }
                                data-componentid={ `${ componentId }-create-button` }
                            >
                                { t("common:create") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

AddFunctionLibraryWizard.defaultProps = {
    "data-componentid": FUNCTION_LIBRARY_ADD_WIZARD
};

export default AddFunctionLibraryWizard;
