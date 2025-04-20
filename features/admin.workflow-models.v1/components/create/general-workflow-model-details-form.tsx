/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { SelectChangeEvent } from "@mui/material";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import { SelectFieldAdapter } from "@wso2is/form/src";
import React, {
    ForwardRefExoticComponent,
    ForwardedRef,
    ReactElement,
    RefAttributes,
    forwardRef,
    useImperativeHandle,
    useRef
} from "react";
import { useTranslation } from "react-i18next";
import { WORKFLOW_MODEL_VALIDATION_REGEX_PATTERNS } from "../../constants/workflow-model-constants";
import { workflowEngineOptions } from "../../models";
import { GeneralDetailsFormValuesInterface } from "../../models/ui";
import "./general-workflow-model-details-form.scss";
import { validateInputWithRegex } from "../../utils/workflowModel-utils";

/**
 * This component renders the general workflow model details form component.
 *
 * @param props - Props injected to the component.
 *
 * @returns The general workflow model details form component.
 */
interface GeneralWorkflowModelDetailsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the form is read-only or not.
     */
    isReadOnly: boolean;
    /**
     * Callback to be called on form submit.
     * @param values - Form values.
     * @returns void
     */
    onSubmit?: (values: GeneralDetailsFormValuesInterface) => void;
    /**
     * Initial values for the form.
     */
    initialValues?: Partial<GeneralDetailsFormValuesInterface>;
}

export interface GeneralWorkflowModelDetailsFormRef {
    triggerSubmit: () => void;
}

const GeneralWorkflowModelDetailsForm: ForwardRefExoticComponent<RefAttributes<GeneralWorkflowModelDetailsFormRef> &
    GeneralWorkflowModelDetailsPropsInterface> = forwardRef(
        (
            {
                isReadOnly,
                onSubmit,
                initialValues,
                ["data-componentid"]: testId
                = "workflow-model-general-details"
            }: GeneralWorkflowModelDetailsPropsInterface,
            ref: ForwardedRef<GeneralWorkflowModelDetailsFormRef>
        ): ReactElement => {
            const triggerFormSubmit: any = useRef<() => void>();
            const { t } = useTranslation();

            useImperativeHandle(ref, () => ({
                triggerSubmit: () => {
                    if (triggerFormSubmit.current) {
                        triggerFormSubmit.current();
                    }
                }
            }));

            const validateForm = (
                values: GeneralDetailsFormValuesInterface
            ): Partial<GeneralDetailsFormValuesInterface> => {
                const error: Partial<GeneralDetailsFormValuesInterface> = {};

                if (!values?.name) {
                    error.name = t("workflowModels:forms.general.name.requiredErrorMessage");
                } else {
                    const nameValue: string = values?.name.toUpperCase();
                    // Regular expression to validate having no symbols in the user store name.
                    const regExpInvalidSymbols: RegExp = new RegExp("^[^_/]+$");
                    // Regular expression to validate having all symbols in the user store name.
                    const regExpAllSymbols: RegExp = new RegExp("^([^a-zA-Z0-9]+$)");

                    const validityResult: Map<string, string | boolean> = validateInputWithRegex(
                        nameValue,
                        WORKFLOW_MODEL_VALIDATION_REGEX_PATTERNS.EscapeRegEx
                    );
                    const validationMatch: boolean = validityResult.get("isMatch").toString() === "true";

                    if (!regExpInvalidSymbols.test(nameValue)) {
                        error.name =
                        t(
                            "workflowModels:forms.general.name.validationErrorMessages.invalidSymbolsErrorMessage"
                        );
                    } else if (regExpAllSymbols.test(nameValue)) {
                        error.name =
                        t(
                            "workflowModels:forms.general.name.validationErrorMessages.allSymbolsErrorMessage"
                        );
                    } else if (validationMatch) {
                        const invalidString: string = validityResult.get("invalidStringValue").toString();

                        error.name =
                        t("workflowModels:forms.general.name.validationErrorMessages.invalidInputErrorMessage",
                            { invalidString });
                    }
                }

                if (values?.description) {
                    const validityResult: Map<string, string | boolean> = validateInputWithRegex(
                        values?.description,
                        WORKFLOW_MODEL_VALIDATION_REGEX_PATTERNS.EscapeRegEx
                    );
                    const validationMatch: boolean = validityResult.get("isMatch").toString() === "true";

                    if (validationMatch) {
                        const invalidString: string = validityResult.get("invalidStringValue").toString();

                        error.description =
                        t("workflowModels:forms.general.description.validationErrorMessages.invalidInputErrorMessage",
                            { invalidString });
                    }
                }

                if (!values?.engine) {
                    error.engine =
                    t(
                        "workflowModels:forms.general.engine.requiredErrorMessage"
                    );
                }

                return error;
            };

            const handleWorkflowEngineChange = (event: SelectChangeEvent) => {};

            return (
                <FinalForm
                    onSubmit={ (values: GeneralDetailsFormValuesInterface) => {
                        onSubmit?.({ ...values });
                    } }
                    validate={ validateForm }
                    initialValues={ initialValues }
                    render={ ({ handleSubmit }: FormRenderProps) => {
                        triggerFormSubmit.current = handleSubmit;

                        return (
                            <form onSubmit={ handleSubmit } className="general-workflow-model-details-form">
                                <FinalFormField
                                    className="text-field-container"
                                    FormControlProps={ {
                                        margin: "dense"
                                    } }
                                    name="name"
                                    type="text"
                                    label={ t("workflowModels:forms.general.name.label") }
                                    placeholder={ t("workflowModels:forms.general.name.placeholder") }
                                    component={ TextFieldAdapter }
                                    disabled={ isReadOnly }
                                    required
                                    fullWidth
                                    data-componentid={ `${testId}-field-name` }
                                />
                                <FinalFormField
                                    className="text-field-container"
                                    FormControlProps={ {
                                        margin: "dense"
                                    } }
                                    name="description"
                                    type="text"
                                    label={ t("workflowModels:forms.general.description.label") }
                                    placeholder={ t("workflowModels:forms.general.description.label") }
                                    component={ TextFieldAdapter }
                                    disabled={ isReadOnly }
                                    data-componentid={ `${testId}-field-description` }
                                />
                                <div className="workflow-engine-selection-field">
                                    <FinalFormField
                                        className="select-field-container"
                                        FormControlProps={ {
                                            margin: "dense"
                                        } }
                                        width={ 16 }
                                        ariaLabel="Workflow Engine Type"
                                        required={ true }
                                        name="engine"
                                        type="dropdown"
                                        displayEmpty={ true }
                                        label={ t("workflowModels:forms.general.engine.label") }
                                        placeholder={ t("workflowModels:forms.general.engine.placeholder") }
                                        component={ SelectFieldAdapter }
                                        options={ workflowEngineOptions }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                        onChange={ handleWorkflowEngineChange }
                                        disabled={ isReadOnly }
                                        value={ initialValues.engine }
                                        defaultValue={ initialValues.engine }
                                        data-componentid={ `${testId}-field-engine` }
                                    />
                                </div>
                            </form>
                        );
                    } }
                />

            );
        }
    );

export default GeneralWorkflowModelDetailsForm;
