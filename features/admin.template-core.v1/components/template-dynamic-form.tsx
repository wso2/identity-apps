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

import { useRequiredScopes } from "@wso2is/access-control";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FormRenderProps, MutableState, Tools } from "@wso2is/form";
import {
    ContentLoader,
    EmphasizedSegment,
    PrimaryButton
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import has from "lodash-es/has";
import pick from "lodash-es/pick";
import set from "lodash-es/set";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { Grid } from "semantic-ui-react";
import { FormDynamicField } from "./form-dynamic-field";
import useInitializeHandlers, { CustomInitializeFunction } from "../hooks/use-initialize-handlers";
import useSubmissionHandlers, { CustomSubmissionFunction } from "../hooks/use-submission-handlers";
import useValidationHandlers, { CustomValidationsFunction } from "../hooks/use-validation-handlers";
import { DynamicFieldInterface, DynamicFormInterface, DynamicInputFieldTypes } from "../models/dynamic-fields";

/**
 * Prop types of the `TemplateDynamicForm` component.
 */
export interface TemplateDynamicFormPropsInterface extends IdentifiableComponentInterface {
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
     * Definition of the dynamic form.
     */
    form: DynamicFormInterface;
    /**
     * Initial values for the form fields.
     */
    initialFormValues: Record<string, unknown>;
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
    onFormSubmit: (values: Record<string, unknown>, callback: () => void) => void;
    /**
     * Loading status for the wizard.
     */
    isLoading: boolean;
    /**
     * Prop to indicate whether the form is read-only.
     */
    readOnly: boolean;
}

/**
 * Template Dynamic form component.
 *
 * @param Props - Props to be injected into the component.
 */
export const TemplateDynamicForm: FunctionComponent<TemplateDynamicFormPropsInterface> = ({
    customInitializers,
    customSubmissionHandlers,
    customValidations,
    form,
    initialFormValues,
    templatePayload,
    buttonText,
    onFormSubmit,
    isLoading,
    readOnly,
    ["data-componentid"]: componentId = "template-dynamic-form"
}: TemplateDynamicFormPropsInterface): ReactElement => {

    const { validate } = useValidationHandlers(customValidations);
    const { initialize } = useInitializeHandlers(customInitializers);
    const { submission } = useSubmissionHandlers(customSubmissionHandlers);

    const { UIConfig } = useUIConfig();
    // Check if the user has the required scopes to update the application.
    const hasApplicationUpdatePermissions: boolean = useRequiredScopes(
        UIConfig?.features?.applications?.scopes?.update);

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ formInitialValues, setFormInitialValues ] = useState<{ [key: string]: unknown }>(null);

    const onlyOneFilePickerExists: boolean = useMemo(() => {

        if (!form || !formInitialValues) {
            return false;
        }
        if (form.fields?.length === 1
            && form?.fields[0]?.type === DynamicInputFieldTypes.FILE
            && Object.keys(formInitialValues).length === 1) {
            return true;
        }

        return false;
    }, [ form, formInitialValues ]);

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

            setFormInitialValues(initialValues);
        };

        if (!initialFormValues || !form || !templatePayload) {
            return;
        }

        prepareInitialValues();
    }, [ initialFormValues, form, templatePayload ]);

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

        onFormSubmit(formValues, () => setIsSubmitting(false));
    };

    return (
        <EmphasizedSegment
            data-componentid={ `${componentId}-form` }
            padded="very"
        >
            {
                !formInitialValues || isLoading
                    ? <ContentLoader inline="centered" active/>
                    : (
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
                            validate={ (formValues: Record<string, unknown>) => validate(formValues, form?.fields) }
                            render={ ({ form: formState, handleSubmit }: FormRenderProps) => {
                                return (
                                    <form id={ `${componentId}-form` } onSubmit={ handleSubmit }>
                                        <Grid>
                                            { form?.fields?.map(
                                                (field: DynamicFieldInterface) => {
                                                    if (!field || field?.hidden) {
                                                        return null;
                                                    }

                                                    return (
                                                        <Grid.Row
                                                            key={ field?.id }
                                                            columns={ 1 }
                                                        >
                                                            <Grid.Column
                                                                mobile={ 16 }
                                                                tablet={ 14 }
                                                                computer={ 12 }
                                                            >
                                                                <FormDynamicField
                                                                    field={ field }
                                                                    form={ formState }
                                                                    readOnly={ readOnly
                                                                        || !hasApplicationUpdatePermissions
                                                                    }
                                                                />
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    );
                                                })
                                            }
                                            { !onlyOneFilePickerExists && (
                                                <Grid.Row column={ 1 }>
                                                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                                        <PrimaryButton
                                                            type="submit"
                                                            data-componentid={ `${componentId}-form-update-button` }
                                                            loading={ isSubmitting }
                                                            disabled={ isSubmitting }
                                                        >
                                                            { buttonText }
                                                        </PrimaryButton>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            ) }
                                        </Grid>
                                    </form>
                                );
                            } }
                        />
                    )
            }
        </EmphasizedSegment>
    );
};
