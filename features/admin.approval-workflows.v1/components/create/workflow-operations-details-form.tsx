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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Grid from "@oxygen-ui/react/Grid";
import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FormRenderProps } from "@wso2is/form";
import { Heading, Hint } from "@wso2is/react-components";
import React, {
    ForwardRefExoticComponent,
    ForwardedRef,
    MutableRefObject,
    ReactElement,
    RefAttributes,
    SyntheticEvent,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import AutoCompleteRenderOption from "./auto-complete-render-option";
import { DropdownPropsInterface, WorkflowOperationsDetailsFormValuesInterface } from "../../models/ui";
import "./general-approval-workflow-details-form.scss";
import "./workflow-operations-details-form.scss";

/**
 * This component renders the workflow operation details form component.
 *
 * @param props - Props injected to the component.
 *
 * @returns The workflow operation details form component.
 */
interface WorkflowOperationsDetailsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the form is read-only or not.
     */
    isReadOnly: boolean;
    /**
     * Callback to be called on form submit.
     * @param values - Form values.
     * @returns void
     */
    onSubmit?: (values: WorkflowOperationsDetailsFormValuesInterface) => void;
    /**
     * Initial values for the form.
     */
    initialValues?: Partial<WorkflowOperationsDetailsFormValuesInterface>;
    /**
     * Whether the component is used in edit page or not.
     */
    isEditPage?: boolean;
}

/**
 * Dropdown options for operations.
 */
export const operations: DropdownPropsInterface[] = [
    { key: "operation1", text: "Create User", value: "ADD_USER" },
    { key: "operation2", text: "Remove User", value: "DELETE_USER" },
    { key: "operation3", text: "Create Role", value: "ADD_ROLE" },
    { key: "operation4", text: "Add or Remove Users from Role", value: "UPDATE_ROLES_OF_USERS" }
    // { key: "operation3", text: "Remove Role", value: "DELETE_ROLE" },
    // { key: "operation4", text: "Remove User Claims", value: "DELETE_USER_CLAIMS" },
    // { key: "operation6", text: "Update Role Name", value: "UPDATE_ROLE_NAME" },
    // { key: "operation8", text: "Update User Attributes", value: "UPDATE_USER_CLAIMS" }
    // { key: "operation9", text: "Manage Users in a Role", value: "UPDATE_USERS_OF_ROLES" }
];

export interface WorkflowOperationsDetailsFormRef {
    triggerSubmit: () => void;
}

/**
 * This component renders the workflow operations form component.
 *
 * @param props - Props injected to the component.
 *
 * @returns The workflow operations form component.
 */
const WorkflowOperationsDetailsForm: ForwardRefExoticComponent<RefAttributes<WorkflowOperationsDetailsFormRef> &
    WorkflowOperationsDetailsPropsInterface> = forwardRef(
        (
            {
                isReadOnly,
                onSubmit,
                initialValues,
                isEditPage,
                ["data-componentid"]: componentId
                = "workflow-operations"
            }: WorkflowOperationsDetailsPropsInterface,
            ref: ForwardedRef<WorkflowOperationsDetailsFormRef>
        ): ReactElement => {

            const { t } = useTranslation();

            const triggerFormSubmit: MutableRefObject<() => void> = useRef<(() => void) | null>(null);

            const [ selectedOperations, setSelectedOperations ] = useState<DropdownPropsInterface[]>([]);

            useImperativeHandle(ref, () => ({
                triggerSubmit: () => {
                    if (triggerFormSubmit.current) {
                        triggerFormSubmit.current();
                    }
                }
            }));

            useEffect(() => {
                if (initialValues?.matchedOperations) {
                    setSelectedOperations(initialValues?.matchedOperations);
                }
            }, [ initialValues ]);

            return (
                <FinalForm
                    onSubmit={ (values: WorkflowOperationsDetailsFormValuesInterface) => {
                        onSubmit?.({
                            ...values,
                            matchedOperations: selectedOperations.map((operation: DropdownPropsInterface) => operation)
                        });
                    } }
                    initialValues={ initialValues }
                    render={ ({ handleSubmit }: FormRenderProps) => {
                        triggerFormSubmit.current = handleSubmit;

                        return (
                            <form onSubmit={ handleSubmit } className="workflow-operations-details-form">
                                <Grid
                                    xs={ 12 }
                                    sm={ 4 }
                                    md={ 7 }
                                    data-componentid={ `${componentId}-field-role-autocomplete-container` }
                                >
                                    <div className="operations-autocomplete">
                                        <Grid width={ 16 } className="operations-autocomplete-header">
                                            <Heading as="h6">
                                                { t("approvalWorkflows:forms.operations.dropDown.label") }
                                            </Heading>
                                        </Grid>

                                        <Autocomplete
                                            className="operations-autocomplete-input"
                                            data-componentid={ `${componentId}-field-operation-autocomplete` }
                                            multiple
                                            disableCloseOnSelect
                                            options={ operations }
                                            disabled={ isReadOnly }
                                            getOptionLabel={ (option: DropdownPropsInterface) => option.text }
                                            value={ selectedOperations }
                                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                                <TextField
                                                    { ...params }
                                                    placeholder={
                                                        t("approvalWorkflows:forms.operations.dropDown.placeholder")
                                                    }
                                                    data-componentid={ `${componentId}-field-operation-search` }
                                                />
                                            ) }
                                            onChange={ (
                                                event: SyntheticEvent,
                                                selectedOperations: DropdownPropsInterface[]
                                            ) => {
                                                setSelectedOperations(selectedOperations);
                                            } }
                                            filterOptions={ (
                                                options: DropdownPropsInterface[],
                                                { inputValue }: { inputValue: string }
                                            ) =>
                                                options.filter((option: DropdownPropsInterface) =>
                                                    option.text
                                                        .toLowerCase()
                                                        .includes(inputValue.toLowerCase())
                                                )
                                            }
                                            isOptionEqualToValue={ (
                                                option: DropdownPropsInterface,
                                                value: DropdownPropsInterface
                                            ) => option.value === value.value }
                                            renderOption={ (
                                                props: React.HTMLAttributes<HTMLLIElement>,
                                                option: DropdownPropsInterface,
                                                { selected }: { selected: boolean }
                                            ) => (
                                                <AutoCompleteRenderOption
                                                    selected={ selected }
                                                    displayName={ option.text }
                                                    renderOptionProps={ props }
                                                    data-componentid={ `${componentId}-option-operation-${option.key}` }
                                                />
                                            ) }
                                        />
                                        { isEditPage && (<Hint className="hint" compact>
                                            { t("approvalWorkflows:pageLayout.create.stepper.step2.hint") }
                                        </Hint>) }
                                    </div>
                                </Grid>
                            </form>
                        );
                    } }
                />

            );
        }
    );

export default WorkflowOperationsDetailsForm;
