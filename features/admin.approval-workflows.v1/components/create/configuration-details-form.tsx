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
import { CircleCheckFilledIcon, PlusIcon } from "@oxygen-ui/react-icons";
import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import { IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { Hint } from "@wso2is/react-components";
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
import { ENTITY_TYPES, EntityType } from "../../constants/approval-workflow-constants";
import { MultiStepApprovalTemplate } from "../../models/approval-workflows";
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
    /**
     * Whether the component is used in edit page or not.
     */
    isEditPage?: boolean;
}

export interface ConfigurationsFormRef {
    triggerSubmit: () => void;
}

interface StraightArrowProps {
    length?: number;
    color?: string;
    strokeWidth?: number;
}

/**
 * This component renders the approval step details form component.
 *
 * @param props - Props injected to the component.
 *
 * @returns The approval step details form component.
 */
const ConfigurationsForm: ForwardRefExoticComponent<RefAttributes<ConfigurationsFormRef> &
    ConfigurationsPropsInterface> = forwardRef(
        (
            {
                isReadOnly,
                onSubmit,
                hasErrors,
                initialValues,
                isEditPage,
                ["data-componentid"]: componentId = "workflow-model-configuration-details"
            }: ConfigurationsPropsInterface,
            ref: ForwardedRef<ConfigurationsFormRef>
        ): ReactElement => {

            const { t } = useTranslation();

            const StraightArrow: React.FC<StraightArrowProps> = (props: StraightArrowProps) => {
                const { length = 100, color = "#555", strokeWidth = 2 } = props;

                return (
                    <svg width={ length } height="10" viewBox={ `0 0 ${length} 10` } xmlns="http://www.w3.org/2000/svg">
                        <line x1="0" y1="5" x2={ length - 10 } y2="5" stroke={ color } strokeWidth={ strokeWidth } />
                        <polygon points={ `${length - 10},0 ${length},5 ${length - 10},10` } fill={ color } />
                    </svg>
                );
            };

            const [ steps, setSteps ] = useState<MultiStepApprovalTemplate[]>([]);
            const [ isValidStep, setValidStep ] = useState<boolean>(true);
            const temporarySteps: any = useRef<{ approvalSteps: MultiStepApprovalTemplate[] }>({
                approvalSteps: []
            });

            /**
             * Initializes approval steps based on `initialValues`. If no steps are provided,
             * a default step is created.
             *
             * @param initialValues - Initial values for approval steps.
             * @returns
             */
            useEffect(() => {
                if (initialValues) {
                    if (initialValues?.approvalSteps?.length > 0) {
                        const parsedSteps: MultiStepApprovalTemplate[] = initialValues.approvalSteps.map(
                            (step: ApprovalSteps, index: number) => ({
                                id: `step-${index}`,
                                roles: step.roles || [],
                                stepNumber: index + 1,
                                users: step.users || []
                            })
                        );

                        setSteps(parsedSteps);
                        temporarySteps.current.approvalSteps = parsedSteps;
                    } else {
                        const defaultStep: MultiStepApprovalTemplate = {
                            id: `step${Date.now()}-1`,
                            roles: [],
                            stepNumber: 1,
                            users: []
                        };

                        setSteps([ defaultStep ]);
                        temporarySteps.current.approvalSteps = [ defaultStep ];
                    }
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

            /**
             * Adds a new approval step if the last step is valid.
             *
             * @returns
             */
            const addNewStep = () => {
                const currentStep: any = temporarySteps.current.approvalSteps[steps.length - 1];

                const hasValidRoles: boolean = currentStep?.roles?.length > 0;
                const hasValidUsers: boolean = currentStep?.users?.length > 0;

                // Show validation error only if trying to add a new step and the last step is invalid
                if (!hasValidRoles && !hasValidUsers && steps.length > 0) {
                    setValidStep(false);

                    return;
                }

                setValidStep(true);

                const newStep: MultiStepApprovalTemplate = {
                    id: `step${Date.now()}`,
                    roles: [],
                    stepNumber: steps.length + 1,
                    users: []
                };

                setSteps((prevSteps: MultiStepApprovalTemplate[]) => [ ...prevSteps, newStep ]);
                temporarySteps.current.approvalSteps.push(newStep);
            };

            /**
             * Deletes the specified step and reorders the remaining steps.
             *
             * @param stepId - ID of the step to delete.
             */
            const handleDelete = (stepId: string) => {
                const updatedSteps: MultiStepApprovalTemplate[] = steps.reduce(
                    (
                        acc: MultiStepApprovalTemplate[],
                        step: MultiStepApprovalTemplate
                    ) => {
                        if (step.id !== stepId) {
                            acc.push({ ...step, stepNumber: acc.length + 1 });
                        }

                        return acc;
                    },
                    []
                );

                setSteps(updatedSteps);
                temporarySteps.current.approvalSteps = updatedSteps;
            };


            /**
             * Updates users or roles for a specific approval step.
             *
             * @param index - Step index.
             * @param updatedEntities - Updated users or roles.
             * @param type - Type of entity (`USERS` or `ROLES`).
             * @returns
             */
            const handleStepChange: (
                index: number,
                updatedEntities: UserBasicInterface[] | RolesInterface[],
                type: EntityType
                ) => void = useCallback(
                    (index: number, updatedEntities: UserBasicInterface[] | RolesInterface[], type: EntityType) => {
                        const updatedStep: MultiStepApprovalTemplate = {
                            ...temporarySteps.current.approvalSteps[index],
                            [type]:
                            type === ENTITY_TYPES.USERS
                                ? (updatedEntities as UserBasicInterface[]).map((user: UserBasicInterface) => user.id)
                                : (updatedEntities as RolesInterface[]).map((role: RolesInterface) => role.id)
                        };

                        temporarySteps.current.approvalSteps[index] = updatedStep;
                    },
                    []
                );

            return (
                <>
                    <Box
                        className="approval-steps-container"
                        data-componentid={ `${componentId}-approval-steps-container` }
                    >
                        <div className="approval-steps-stepsWrapper">
                            { steps.map((step: MultiStepApprovalTemplate, index: number) => (
                                <>
                                    <ApprovalStep
                                        key={ step.id }
                                        index={ index }
                                        step={ step }
                                        isReadOnly={ isReadOnly }
                                        initialValues={ step }
                                        isOneStepLeft={ steps.length === 1 }
                                        hasErrors={ hasErrors }
                                        onDelete={ () => handleDelete(step.id) }
                                        updateUsers={ (updateUsers: UserBasicInterface[]) =>
                                            handleStepChange(index, updateUsers, ENTITY_TYPES.USERS)
                                        }
                                        updateRoles={ (updateRoles: RolesInterface[]) =>
                                            handleStepChange(index, updateRoles, ENTITY_TYPES.ROLES)
                                        }
                                        showValidationError={ index === steps.length - 1 && !isValidStep }
                                        data-componentid={ `${componentId}-approval-step-${index}` }
                                    />

                                    <div className="arrow-plus-wrapper">
                                        { index === steps.length - 1 ? (
                                            <>
                                                <div className="arrow-plus-wrapper">
                                                    <div className="arrow-container">
                                                        <div className="arrow-line">
                                                            <StraightArrow length={ 100 } />
                                                        </div>
                                                        <div className="plus-icon" onClick={ addNewStep }>
                                                            <PlusIcon />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <CircleCheckFilledIcon className="icon-configured" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="arrow-line">
                                                <StraightArrow length={ 100 } />
                                            </div>
                                        ) }
                                    </div>
                                </>
                            )) }
                        </div>
                    </Box>
                    { isEditPage && (<div className="approval-steps-hint">
                        <Hint className="hint" compact>
                            { t("approvalWorkflows:pageLayout.create.stepper.step3.hint") }
                        </Hint>
                    </div>) }

                </>
            );
        }
    );

export default ConfigurationsForm;
