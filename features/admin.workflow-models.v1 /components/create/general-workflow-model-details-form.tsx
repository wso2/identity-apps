import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    ForwardedRef,
    forwardRef,
    ForwardRefExoticComponent,
    ReactElement,
    RefAttributes,
    useImperativeHandle,
    useRef
} from "react";
import { GeneralDetailsFormValuesInterface } from "../../models/ui";
import { FinalForm, FinalFormField, FormRenderProps, RadioGroupFieldAdapter, TextFieldAdapter } from "@wso2is/form";
import { SelectFieldAdapter } from "@wso2is/form/src";
import { DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { WorkflowEngineTypeDropdownOption } from "../../models";
import "./general-workflow-model-details-form.scss";
import { APPROVALPROCESS_VALIDATION_REGEX_PATTERNS } from "../../constants/workflow-model-constants";
import { validateInputWithRegex } from "../../utils/approvalProcess-utils";
import { SelectChangeEvent } from "@mui/material";

interface GeneralApprovalProcessDetailsPropsInterface extends IdentifiableComponentInterface {
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

export interface GeneralApprovalProcessDetailsFormRef {
    triggerSubmit: () => void;
}

const workflowEngineOptions: WorkflowEngineTypeDropdownOption[] = [
    { key: "engine_1", text: "Simple Workflow Engine", value: "workflowImplSimple" }
];

const GeneralApprovalProcessDetailsForm: ForwardRefExoticComponent<RefAttributes<GeneralApprovalProcessDetailsFormRef> &
    GeneralApprovalProcessDetailsPropsInterface> = forwardRef(
    (
        { isReadOnly, onSubmit, initialValues }: GeneralApprovalProcessDetailsPropsInterface,
        ref: ForwardedRef<GeneralApprovalProcessDetailsFormRef>
    ): ReactElement => {
        const triggerFormSubmit = useRef<() => void>();

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
                error.name = "Approval process name is required";
            } else {
                const nameValue: string = values?.name.toUpperCase();
                // Regular expression to validate having no symbols in the user store name.
                const regExpInvalidSymbols: RegExp = new RegExp("^[^_/]+$");
                // Regular expression to validate having all symbols in the user store name.
                const regExpAllSymbols: RegExp = new RegExp("^([^a-zA-Z0-9]+$)");

                const validityResult: Map<string, string | boolean> = validateInputWithRegex(
                    nameValue,
                    APPROVALPROCESS_VALIDATION_REGEX_PATTERNS.EscapeRegEx
                );
                const validationMatch: boolean = validityResult.get("isMatch").toString() === "true";

                if (!regExpInvalidSymbols.test(nameValue)) {
                    error.name =
                        "The name you entered contains disallowed " + "characters. It can not contain '/' or '_'.";
                } else if (regExpAllSymbols.test(nameValue)) {
                    error.name =
                        "The approval process name should have a combination of alphanumerics and special characters. Please try a different name.";
                } else if (validationMatch) {
                    const invalidString: string = validityResult.get("invalidStringValue").toString();

                    error.name = "Approval process name cannot contain the pattern" + invalidString;
                }
            }

            if (values?.description) {
                const validityResult: Map<string, string | boolean> = validateInputWithRegex(
                    values?.description,
                    APPROVALPROCESS_VALIDATION_REGEX_PATTERNS.EscapeRegEx
                );
                const validationMatch: boolean = validityResult.get("isMatch").toString() === "true";

                if (validationMatch) {
                    const invalidString: string = validityResult.get("invalidStringValue").toString();

                    error.description = "Approval process description cannot contain the pattern" + invalidString;
                }
            }

            // if (!values.engine) {
            //     error.engine = "A workflow engine is not selected";
            // }
            return error;
        };

        const handleWorkflowEngineChange = (event: SelectChangeEvent) => {};

        return (
            <FinalForm
                onSubmit={(values: GeneralDetailsFormValuesInterface) => {
                    console.log("Values that are rendered into the form from General for end", values);
                    onSubmit?.({ ...values });
                }}
                validate={validateForm}
                initialValues={initialValues}
                render={({ handleSubmit }: FormRenderProps) => {
                    triggerFormSubmit.current = handleSubmit;

                    return (
                        <form onSubmit={handleSubmit} className="general-approval-process-details-form">
                            <FinalFormField
                                className="text-field-container"
                                FormControlProps={{
                                    margin: "dense"
                                }}
                                data-componentid="general-approval-process-field-name"
                                name="name"
                                type="text"
                                label="Name" // Replace with `t(...)` if using translations
                                placeholder="Approval Workflow" // Replace with `t(...)` if using translations
                                component={TextFieldAdapter}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />
                            <FinalFormField
                                className="text-field-container"
                                FormControlProps={{
                                    margin: "dense"
                                }}
                                data-componentid="general-approval-process-field-description"
                                name="description"
                                type="text"
                                label="Description" // Replace with `t(...)` if using translations
                                placeholder="Describe the purpose of this workflow model" // Replace with `t(...)` if using translations
                                component={TextFieldAdapter}
                                disabled={isReadOnly}
                            />
                            <div className="workflow-engine-selection-field">
                                <FinalFormField
                                    className="select-field-container"
                                    FormControlProps={{
                                        margin: "dense"
                                    }}
                                    width={16}
                                    ariaLabel="Workflow Engine Type"
                                    required={true}
                                    name="workflowEngineType"
                                    type={"dropdown"}
                                    displayEmpty={true}
                                    label={"Workflow Engine"}
                                    placeholder={"Select the suitable workflow engine"}
                                    component={SelectFieldAdapter}
                                    options={workflowEngineOptions}
                                    maxLength={100}
                                    minLength={0}
                                    onChange={handleWorkflowEngineChange}
                                    disabled={isReadOnly}
                                    value={initialValues.engine}
                                    defaultValue={initialValues.engine}
                                />
                            </div>
                        </form>
                    );
                }}
            />
        );
    }
);

export default GeneralApprovalProcessDetailsForm;
