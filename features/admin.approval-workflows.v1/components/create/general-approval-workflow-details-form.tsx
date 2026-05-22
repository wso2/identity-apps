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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import isEqual from "lodash-es/isEqual";
import React, {
    ForwardRefExoticComponent,
    ForwardedRef,
    MutableRefObject,
    ReactElement,
    RefAttributes,
    forwardRef,
    useImperativeHandle,
    useRef
} from "react";
import { useTranslation } from "react-i18next";
import { getApprovalWorkflows } from "../../api/approval-workflow";
import { APPROVAL_WORKFLOW_VALIDATION_REGEX_PATTERNS } from "../../constants/approval-workflow-constants";
import { GeneralDetailsFormValuesInterface } from "../../models/ui";
import "./general-approval-workflow-details-form.scss";
import { validateInputWithRegex } from "../../utils/approval-workflow-utils";

/**
 * Props for the general details form component.
 */
interface GeneralApprovalWorkflowDetailsPropsInterface extends IdentifiableComponentInterface {
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
    /**
     * Approval Workflow ID.
     */
    approvalWorkflowId?: string;
}

export interface GeneralApprovalWorkflowDetailsFormRef {
    triggerSubmit: () => void;
    isFormEdited?: () => boolean;
}

/**
 * This component renders the approval workflow details form component.
 *
 * @param props - Props injected to the component.
 *
 * @returns The general approval workflow details form component.
 */
const GeneralApprovalWorkflowDetailsForm: ForwardRefExoticComponent<RefAttributes<
    GeneralApprovalWorkflowDetailsFormRef
> &
    GeneralApprovalWorkflowDetailsPropsInterface> = forwardRef(
        (
            {
                approvalWorkflowId,
                isReadOnly,
                onSubmit,
                initialValues,
                ["data-componentid"]: componentId = "workflow-model-general-details"
            }: GeneralApprovalWorkflowDetailsPropsInterface,
            ref: ForwardedRef<GeneralApprovalWorkflowDetailsFormRef>
        ): ReactElement => {
            const triggerFormSubmit: MutableRefObject<() => void> = useRef<(() => void) | null>(null);
            const currentValuesRef: any = useRef(null);
            const formApiRef: MutableRefObject<any> = useRef<any>(null);

            const { t } = useTranslation([ "approvalWorkflows" ]);

            const nameExistsErrorRef: MutableRefObject<string | null> = useRef<string | null>(null);
            const checkedNameRef: MutableRefObject<string | null> = useRef<string | null>(null);

            // Expose triggerSubmit to the parent via the ref
            useImperativeHandle(ref, () => ({
                isFormEdited: () => {
                    return !isEqual(initialValues, currentValuesRef.current);
                },
                triggerSubmit: async () => {
                    const currentName: string = currentValuesRef.current?.name;

                    nameExistsErrorRef.current = null;
                    checkedNameRef.current = null;

                    if (currentName) {
                        try {
                            const response: { workflows?: { id: string; name: string }[] } =
                                await getApprovalWorkflows(currentName);
                            const nameExists: boolean =
                                response?.workflows?.some((workflow: { id: string; name: string }) => {
                                    return (
                                        workflow.name === currentName &&
                                        (approvalWorkflowId ? approvalWorkflowId !== workflow.id : true)
                                    );
                                }) ?? false;

                            if (nameExists) {
                                nameExistsErrorRef.current = t(
                                    "approvalWorkflows:forms.general.name.validationErrorMessages" +
                                    ".alreadyExistsErrorMessage"
                                );
                                checkedNameRef.current = currentName;
                                // Force FinalForm to re-run validateForm (which reads the refs)
                                // by briefly changing the value. React batches both DOM updates
                                // so only the final state (with the error) is rendered.
                                formApiRef.current?.change("name", "");
                                formApiRef.current?.change("name", currentName);
                                formApiRef.current?.blur("name");

                                return;
                            }
                        } catch (_error: unknown) {
                            // Silently fail — do not block submission on a lookup error.
                        }
                    }

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
                    error.name = t("approvalWorkflows:forms.general.name.requiredErrorMessage");
                } else {
                    const nameValue: string = values?.name.toUpperCase();
                    // Regular expression to validate having no symbols in the user store name.
                    const regExpInvalidSymbols: RegExp = new RegExp("^[^_/]+$");
                    // Regular expression to validate having all symbols in the user store name.
                    const regExpAllSymbols: RegExp = new RegExp("^([^a-zA-Z0-9]+$)");

                    const validityResult: Map<string, string | boolean> = validateInputWithRegex(
                        nameValue,
                        APPROVAL_WORKFLOW_VALIDATION_REGEX_PATTERNS.EscapeRegEx
                    );
                    const validationMatch: boolean = validityResult.get("isMatch").toString() === "true";

                    if (!regExpInvalidSymbols.test(nameValue)) {
                        error.name = t(
                            "approvalWorkflows:forms.general.name.validationErrorMessages.invalidSymbolsErrorMessage"
                        );
                    } else if (regExpAllSymbols.test(nameValue)) {
                        error.name = t(
                            "approvalWorkflows:forms.general.name.validationErrorMessages.allSymbolsErrorMessage"
                        );
                    } else if (validationMatch) {
                        const invalidString: string = validityResult.get("invalidStringValue").toString();

                        error.name = t(
                            "approvalWorkflows:forms.general.name.validationErrorMessages.invalidInputErrorMessage",
                            { invalidString }
                        );
                    }

                    if (
                        values?.name === checkedNameRef.current &&
                        nameExistsErrorRef.current
                    ) {
                        error.name = nameExistsErrorRef.current;
                    }
                }

                if (values?.description) {
                    const validityResult: Map<string, string | boolean> = validateInputWithRegex(
                        values?.description,
                        APPROVAL_WORKFLOW_VALIDATION_REGEX_PATTERNS.EscapeRegEx
                    );
                    const validationMatch: boolean = validityResult.get("isMatch").toString() === "true";

                    if (validationMatch) {
                        const invalidString: string = validityResult.get("invalidStringValue").toString();

                        error.description = t(
                            "approvalWorkflows:forms.general.description.validationErrorMessages." +
                            "invalidInputErrorMessage",
                            { invalidString }
                        );
                    }
                }

                return error;
            };

            return (
                <FinalForm
                    onSubmit={ (values: GeneralDetailsFormValuesInterface) => {
                        onSubmit?.({ ...values });
                    } }
                    validate={ validateForm }
                    initialValues={ initialValues }
                    render={ ({ handleSubmit, values, form }: FormRenderProps) => {
                        triggerFormSubmit.current = handleSubmit;
                        currentValuesRef.current = values;
                        formApiRef.current = form;

                        return (
                            <form onSubmit={ handleSubmit } className="general-workflow-model-details-form">
                                <FinalFormField
                                    className="text-field-container"
                                    FormControlProps={ {
                                        margin: "dense"
                                    } }
                                    name="name"
                                    type="text"
                                    label={ t("approvalWorkflows:forms.general.name.label") }
                                    placeholder={ t("approvalWorkflows:forms.general.name.placeholder") }
                                    component={ TextFieldAdapter }
                                    disabled={ isReadOnly }
                                    required
                                    fullWidth
                                    data-componentid={ `${componentId}-field-name` }
                                />
                                <FinalFormField
                                    className="text-field-container"
                                    FormControlProps={ {
                                        margin: "dense"
                                    } }
                                    name="description"
                                    type="text"
                                    label={ t("approvalWorkflows:forms.general.description.label") }
                                    placeholder={ t("approvalWorkflows:forms.general.description.placeholder") }
                                    component={ TextFieldAdapter }
                                    disabled={ isReadOnly }
                                    data-componentid={ `${componentId}-field-description` }
                                />
                            </form>
                        );
                    } }
                />
            );
        }
    );

export default GeneralApprovalWorkflowDetailsForm;
