/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import Typography from "@oxygen-ui/react/Typography";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FormRenderProps, MutableState, Tools } from "@wso2is/form";
import {
    ContentLoader,
    Heading,
    LinkButton,
    Markdown,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import has from "lodash-es/has";
import pick from "lodash-es/pick";
import set from "lodash-es/set";
import React, { ChangeEvent, FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, ModalProps } from "semantic-ui-react";
import { FormDynamicField } from "./form-dynamic-field";
import useInitializeHandlers, { CustomInitializeFunction } from "../hooks/use-initialize-handlers";
import useSubmissionHandlers, { CustomSubmissionFunction } from "../hooks/use-submission-handlers";
import useValidationHandlers, { CustomValidationsFunction } from "../hooks/use-validation-handlers";
import { DynamicFieldInterface, DynamicFormInterface } from "../models/dynamic-fields";
import "./resource-create-wizard.scss";

/**
 * Prop types of the `ResourceCreateWizard` component.
 */
export interface ResourceCreateWizardPropsInterface extends ModalProps, IdentifiableComponentInterface {
    /**
     * Whether the resource creation wizard should be displayed.
     */
    showWizard?: boolean;
    /**
     * Callback triggered when closing the resource creation wizard.
     */
    onClose?: () => void;
    /**
     * Custom validation functions for form validations.
     */
    customValidations?: CustomValidationsFunction;
    /**
     * Custom initialize functions.
     */
    customInitializers?: CustomInitializeFunction;
    /**
     * Custom submission handler functions.
     */
    customSubmissionHandlers?: CustomSubmissionFunction;
    /**
     * Definition of the form for the resource creation wizard.
     */
    form: DynamicFormInterface;
    /**
     * Wizard guide as an array of strings.
     */
    guide: string[],
    /**
     * Initial values for the form fields.
     */
    initialFormValues: Record<string, unknown>;
    /**
     * Identifier of the extension template.
     */
    templateId: string;
    /**
     * Name of the extension template.
     */
    templateName: string;
    /**
     * Description of the extension template.
     */
    templateDescription: string;
    /**
     * Template payload values.
     */
    templatePayload: Record<string, unknown>;
    /**
     * i18n key of the form main button text.
     */
    buttonText: string;
    /**
     * Function to handle form submission.
     */
    onFormSubmit: (
        values: Record<string, unknown>,
        callback: (errorMsg: string, errorDescription: string) => void
    ) => void;
    /**
     * Loading status for the wizard.
     */
    isLoading: boolean;
}

/**
 * Dynamic resource create wizard component.
 *
 * @param Props - Props to be injected into the component.
 */
export const ResourceCreateWizard: FunctionComponent<ResourceCreateWizardPropsInterface> = ({
    ["data-componentid"]: componentId = "resource-create-wizard",
    form,
    initialFormValues,
    showWizard,
    templateId,
    templateName,
    templateDescription,
    templatePayload,
    guide,
    buttonText,
    customValidations,
    customInitializers,
    customSubmissionHandlers,
    onClose,
    onFormSubmit,
    isLoading,
    ...rest
}: ResourceCreateWizardPropsInterface): ReactElement => {

    const { validate } = useValidationHandlers(customValidations);
    const { initialize } = useInitializeHandlers(customInitializers);
    const { submission } = useSubmissionHandlers(customSubmissionHandlers);
    const [ alert, setAlert, notification ] = useWizardAlert();

    const { t } = useTranslation();

    const [ installGuideActivePage, setInstallGuideActivePage ] = useState<number>(1);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ formInitialValues, setFormInitialValues ] = useState<{ [key: string]: unknown }>(null);

    /**
     * Moderate the initially provided data for the form.
     */
    useEffect(() => {
        const prepareInitialValues = async (): Promise<void> => {
            let initialValues: Record<string, unknown>;

            if (form?.submitDefinedFieldsOnly) {
                const paths: string[] = form?.fields?.map((field: DynamicFieldInterface) => field?.name);

                initialValues = pick(initialFormValues, paths);
            } else {
                initialValues = cloneDeep(initialFormValues);
            }

            await initialize(initialValues, form?.fields, templatePayload);

            /**
             * Template ID and Template Version must be submitted when creating the application.
             */
            if (!initialValues?.templateId) {
                initialValues.templateId = initialFormValues?.templateId;
            }
            if (!initialValues?.templateVersion && initialFormValues?.templateVersion) {
                initialValues.templateVersion = initialFormValues?.templateVersion;
            }

            setFormInitialValues(initialValues);
        };

        if (!initialFormValues || !form || !templatePayload) {
            return;
        }

        prepareInitialValues();
    }, [ initialFormValues, form, templatePayload ]);

    /**
     * This function will navigate the user to the notification message if there are any errors.
     */
    const scrollToNotification = () => {
        document.getElementById("notification-div")?.scrollIntoView({ behavior: "smooth" });
    };

    /**
     * Callback function triggered when clicking the form submit button.
     *
     * @param values - Submission values from the form fields.
     */
    const onSubmit = async (values: Record<string, unknown>): Promise<void> => {
        setIsSubmitting(true);
        const formValues: Record<string, unknown> = cloneDeep(values);

        /**
         * Make sure that cleared text fields are set to an empty string.
         */
        form?.fields?.forEach((field: DynamicFieldInterface) => {
            if (!has(formValues, field?.name)) {
                const initialValue: any = get(formInitialValues, field?.name);

                if (initialValue && typeof initialValue === "string") {
                    set(formValues, field?.name, "");
                }
            }
        });

        await submission(formValues, form?.fields, templatePayload);

        onFormSubmit(formValues, (errorMsg: string, errorDescription: string) => {
            setIsSubmitting(false);

            if (errorMsg) {
                setAlert({
                    description: errorDescription,
                    level: AlertLevels.ERROR,
                    message: errorMsg
                });
                scrollToNotification();
            }
        });
    };

    let formSubmit: (e: MouseEvent<HTMLButtonElement>) => void;

    return (
        <ModalWithSidePanel
            open={ showWizard }
            className="wizard resource-create-wizard"
            dimmer="blurring"
            closeOnDimmerClick={ false }
            closeOnEscape
            data-componentid={ componentId }
            onClose={ onClose }
            { ...rest }
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header className="wizard-header">
                    { templateName }
                    <Heading as="h6">{ templateDescription }</Heading>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    {
                        !formInitialValues || isLoading
                            ? <ContentLoader />
                            : (
                                <>
                                    { alert && (
                                        <Grid>
                                            <Grid.Row columns={ 1 } id="notification-div">
                                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                                    { notification }
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    ) }
                                    <FinalForm
                                        initialValues={ formInitialValues }
                                        onSubmit={ onSubmit }
                                        mutators={ {
                                            setFormAttribute: (
                                                [ fieldName, fieldVal ]: [ fieldName: string, fieldVal: any ],
                                                state: MutableState<Record<string, unknown>, Record<string, unknown>>,
                                                { changeValue }: Tools<Record<string, unknown>, Record<string, unknown>>
                                            ) => {
                                                changeValue(state, fieldName, () => fieldVal);
                                            }
                                        } }
                                        validate={
                                            (formValues: Record<string, unknown>) => validate(formValues, form?.fields)
                                        }
                                        render={ ({ form: formState, handleSubmit }: FormRenderProps) => {
                                            formSubmit = handleSubmit;

                                            return (
                                                <form id={ `${templateId}-form` } onSubmit={ handleSubmit }>
                                                    <Grid>
                                                        { form?.fields.map(
                                                            (field: DynamicFieldInterface) => {
                                                                if (field?.hidden) {
                                                                    return null;
                                                                }

                                                                return (
                                                                    <Grid.Row
                                                                        key={ field?.id }
                                                                        columns={ 1 }
                                                                    >
                                                                        <Grid.Column
                                                                            mobile={ 16 }
                                                                            tablet={ 16 }
                                                                            computer={ 14 }
                                                                        >
                                                                            <FormDynamicField
                                                                                field={ field }
                                                                                form={ formState }
                                                                            />
                                                                        </Grid.Column>
                                                                    </Grid.Row>
                                                                );
                                                            })
                                                        }
                                                    </Grid>
                                                </form>
                                            );
                                        } }
                                    />
                                </>
                            )
                    }
                </ModalWithSidePanel.Content>
                <ModalWithSidePanel.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton floated="left" onClick={ onClose }>
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    onClick={ (e: MouseEvent<HTMLButtonElement>) => formSubmit(e) }
                                    floated="right"
                                    data-componentid={ `${componentId}-create-button` }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                >
                                    { buttonText }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
            { guide && (
                <ModalWithSidePanel.SidePanel>
                    <ModalWithSidePanel.Header className="wizard-header help-panel-header muted">
                        <div className="help-panel-header-text">
                            { t("applications:wizards.minimalAppCreationWizard.help.heading") }
                        </div>
                    </ModalWithSidePanel.Header>
                    <ModalWithSidePanel.Content className="installation-guide-content">
                        { Array.isArray(guide) && (
                            <>
                                <Markdown
                                    source={ guide[installGuideActivePage - 1] }
                                />
                                { guide.length > 1 && (
                                    <div className="installation-guide-stepper">
                                        <div className="installation-guide-stepper-progress">
                                            <Typography variant="body3">
                                                Page { installGuideActivePage } of{ " " }
                                                { guide.length }
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={
                                                    (installGuideActivePage / guide.length) * 100
                                                }
                                            />
                                        </div>
                                        <Pagination
                                            siblingCount={ 0 }
                                            boundaryCount={ 0 }
                                            count={ guide.length }
                                            variant="outlined"
                                            shape="rounded"
                                            className="installation-guide-stepper-pagination"
                                            onChange={ (_: ChangeEvent, page: number) => {
                                                setInstallGuideActivePage(page);
                                            } }
                                        />
                                    </div>
                                ) }
                            </>
                        ) }
                    </ModalWithSidePanel.Content>
                </ModalWithSidePanel.SidePanel>
            ) }
        </ModalWithSidePanel>
    );
};
