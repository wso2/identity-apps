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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import { PlusIcon } from "@oxygen-ui/react-icons";
import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import { IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import React, {
    ForwardRefExoticComponent,
    ForwardedRef,
    ReactElement,
    RefAttributes,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import "./configuration-details-form.scss";
import { useTranslation } from "react-i18next";
import ApprovalStep from "./approval-step";
import { ENTITY_TYPES, EntityType, templateNameMap } from "../../constants/workflow-model-constants";
import { MultiStepApprovalTemplate } from "../../models";
import { ApprovalSteps, ConfigurationsFormValuesInterface } from "../../models/ui";

/**
 * Props for the configurations form component.
 */
export interface ConfigurationsPropsInterface extends IdentifiableComponentInterface {

    /**
     * Whether the form is in read-only mode.
     */
    isReadOnly?: boolean;

    /**
     * Whether the form has validation errors.
     */
    hasErrors?: boolean;

    /**
     * Callback to handle form submission.
     */
    onSubmit?: (values: ConfigurationsFormValuesInterface) => void;

    /**
     * Initial values for the form.
     */
    initialValues?: Partial<ConfigurationsFormValuesInterface>;
}


export interface ConfigurationsFormRef {
    triggerSubmit: () => void;
    setValues?: (values: ConfigurationsFormValuesInterface) => void;
}

const ConfigurationsForm: ForwardRefExoticComponent<RefAttributes<ConfigurationsFormRef> &
    ConfigurationsPropsInterface> = forwardRef(
        ({
            isReadOnly,
            onSubmit,
            hasErrors,
            initialValues,
            ["data-componentid"]: testId
            = "workflow-model-configuration-details"
        }: ConfigurationsPropsInterface, ref: ForwardedRef<ConfigurationsFormRef>): ReactElement => {

            const { t } = useTranslation();
            const [ isValidStep, setValidStep ] = useState<boolean>(true);

            useEffect(() => {
                if (initialValues?.approvalSteps?.length) {
                    const parsedSteps: MultiStepApprovalTemplate[] =
                    initialValues.approvalSteps.map((step: ApprovalSteps, index: number) =>
                        ({
                            id: `step${Date.now()}-${index}`,
                            stepNumber: index + 1,
                            roles: step.roles || [],
                            users: step.users || []
                        }));

                    setSteps(parsedSteps);
                    temporarySteps.current.approvalSteps = initialValues.approvalSteps;
                }
            }, [ initialValues ]);


            // Exposing triggerSubmit method
            useImperativeHandle(ref, () => ({
                triggerSubmit: () => {
                    const configurationData: ConfigurationsFormValuesInterface = {
                        approvalSteps: temporarySteps.current.approvalSteps
                    };

                    onSubmit?.(configurationData);
                }
            }));

            const [ steps, setSteps ] = useState<MultiStepApprovalTemplate[]>([]);
            const temporarySteps: any = useRef<ConfigurationsFormValuesInterface>({
                approvalSteps: []
            });

            // Add new approval step
            const addNewStep = () => {
                const currentStep: any = temporarySteps.current.approvalSteps[steps.length - 1];

                const hasValidRoles: boolean = currentStep?.roles?.length > 0;
                const hasValidUsers: boolean = currentStep?.users?.length > 0;

                // Show validation error only if trying to add a new step and the last step is invalid
                if (!hasValidRoles && !hasValidUsers && steps.length > 0) {
                    setValidStep(false);

                    return;
                }

                // If step is valid, reset the validation flag
                setValidStep(true);

                const newStep: MultiStepApprovalTemplate = {
                    id: `step${Date.now()}`,
                    stepNumber: steps.length + 1,
                    roles: [],
                    users: []
                };

                setSteps((prevSteps: MultiStepApprovalTemplate[]) => ([ ...prevSteps, newStep ]));
                temporarySteps.current.approvalSteps.push(newStep); // Add to temporarySteps as well
            };

            // Handle step deletion
            const handleDelete = (stepId: string, index: number) => {
                const lastStep: any = temporarySteps.current.approvalSteps[steps.length - 2];

                const hasValidRoles: boolean = lastStep?.roles?.length > 0;
                const hasValidUsers: boolean = lastStep?.users?.length > 0;

                if (hasValidRoles || hasValidUsers && steps.length > 0) {
                    setValidStep(true);

                }

                setSteps((prevSteps: MultiStepApprovalTemplate[]) => {
                    return prevSteps.reduce((acc: MultiStepApprovalTemplate[], step: MultiStepApprovalTemplate) => {
                        if (step.id !== stepId) {
                            // Use the current length of accumulator to determine the new stepNumber
                            acc.push({ ...step, stepNumber: acc.length + 1 });
                        }


                        return acc;
                    }, [] as MultiStepApprovalTemplate[]);
                });

                temporarySteps.current.approvalSteps.splice(index, 1);
            };

            // Handle changes in users or roles for specific steps
            const handleStepChange: (
                index: number,
                updatedEntities: UserBasicInterface[] | RolesInterface[],
                type: EntityType
            ) => void = useCallback(
                (
                    index: number,
                    updatedEntities: UserBasicInterface[] | RolesInterface[],
                    type: EntityType
                ) => {
                    const updatedStep:  MultiStepApprovalTemplate = {
                        ...temporarySteps.current.approvalSteps[index],
                        [type]: type === ENTITY_TYPES.USERS
                            ?(updatedEntities as UserBasicInterface[]).map((user:UserBasicInterface) => (user.userName))
                            : (updatedEntities as RolesInterface[]).map((role: RolesInterface) => (role.displayName))
                    };

                    temporarySteps.current.approvalSteps[index] = updatedStep;
                },
                []
            );


            return (
                <>
                    <Box
                        className={ "box-container-heading" }
                        data-componentid={ `${testId}-box-template-heading` }
                    >
                        <label data-componentid={ `${testId}-label-template-name` }>
                            { templateNameMap["MultiStepApprovalTemplate"] }
                        </label>

                        <Button
                            variant="text"
                            onClick={ addNewStep }
                            className="add-rule-btn"
                            data-componentid={ `${testId}-button-add-new-step` }
                        >
                            <div
                                className="flex-row-gap-10"
                                data-componentid={ `${testId}-button-add-new-step-content` }
                            >
                                <PlusIcon />
                                { t("workflowModels:forms.configurations.template.label") }
                            </div>
                        </Button>
                    </Box>

                    { steps.map((step: MultiStepApprovalTemplate, index: number) => {
                        const isLastStep: boolean = index === steps.length - 1;
                        console.log("Step index:", index, "isLastStep:", isLastStep, "isValidStep:", isValidStep);

                        return (
                            <ApprovalStep
                                key={ step.id }
                                index={ index }
                                step={ step }
                                initialValues={ initialValues?.approvalSteps?.[index] }
                                hasErrors={ hasErrors }
                                onDelete={ () => handleDelete(step.id, index) }
                                updateUsers={
                                    (updateUsers: UserBasicInterface[]) =>
                                        handleStepChange(index, updateUsers, ENTITY_TYPES.USERS)
                                }
                                updateRoles={
                                    (updateRoles: RolesInterface[]) =>
                                        handleStepChange(index, updateRoles, ENTITY_TYPES.ROLES)
                                }
                                showValidationError={ isLastStep && !isValidStep }
                                data-componentid={ `${testId}-approval-step-${index}` }
                            />
                        );
                    }) }
                </>
            );
        }
    );

export default ConfigurationsForm;
