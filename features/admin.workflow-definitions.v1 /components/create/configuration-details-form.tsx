import { PlusIcon } from "@oxygen-ui/react-icons";
import React, {
    ForwardedRef,
    forwardRef,
    ForwardRefExoticComponent,
    ReactElement,
    RefAttributes,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import { RolesInterface } from "@wso2is/core/models";
import Button from "@oxygen-ui/react/Button";
import "./configuration-details-form.scss";
import Box from "@oxygen-ui/react/Box";
import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import ApprovalStep from "./approval-step";
import { ConfigurationsFormValuesInterface } from "../../models/ui";

export interface ConfigurationsPropsInterface {
    isReadOnly?: boolean;
    onSubmit?: (values: ConfigurationsFormValuesInterface) => void;
    initialValues?: Partial<ConfigurationsFormValuesInterface>;
}

export interface ConfigurationsFormRef {
    triggerSubmit: () => void;
}

export type MultiStepApprovalTemplate = {
    id: string;
    stepNumber: number;
    roles: string[];
    users: string[];
};

const ConfigurationsForm: ForwardRefExoticComponent<RefAttributes<ConfigurationsFormRef> &
    ConfigurationsPropsInterface> = forwardRef(
    ({ isReadOnly, onSubmit, initialValues }: ConfigurationsPropsInterface, ref: ForwardedRef<ConfigurationsFormRef>): ReactElement => {
        const triggerFormSubmit = useRef<() => void>();

        useEffect(() => {
            if (initialValues?.approvalSteps?.length) {
                const parsedSteps = initialValues.approvalSteps.map((step, index) => ({
                    id: `step${Date.now()}-${index}`,
                    stepNumber: index + 1,
                    roles: step.roles || [],
                    users: step.users || []
                }));
        
                setSteps(parsedSteps);
                console.log("Initial Values",initialValues)
                temporarySteps.current.approvalSteps = initialValues.approvalSteps;
            }
        }, [initialValues]);
        

        // Exposing triggerSubmit method
        useImperativeHandle(ref, () => ({
            triggerSubmit: () => {
                const configurationData: ConfigurationsFormValuesInterface = {
                    approvalSteps: temporarySteps.current.approvalSteps
                }
                onSubmit?.(configurationData);
                // if (triggerFormSubmit.current) {
                //     triggerFormSubmit.current();
                // }
            }
        }));

        const [steps, setSteps] = useState<MultiStepApprovalTemplate[]>([]);
        const temporarySteps = useRef<ConfigurationsFormValuesInterface>({
            approvalSteps: []
        });

        // Add new approval step
        const addNewStep = () => {
            const newStep: MultiStepApprovalTemplate = {
                id: `step${Date.now()}`,
                stepNumber: steps.length + 1,
                roles: [],
                users: []
            };
            setSteps(prevSteps => [...prevSteps, newStep]); // Use state only, avoid refs here
        };

        // Handle step deletion
        const handleDelete = (stepId: string, index: number) => {
            setSteps(prevSteps => {
                // Create a new array with the deleted step removed and re-number the steps
                const newSteps = prevSteps
                    .filter((step: MultiStepApprovalTemplate) => step.id !== stepId)
                    .map((step: MultiStepApprovalTemplate, index: number) => ({
                        ...step,
                        stepNumber: index + 1 // Reassign step numbers
                    }));
                return newSteps;
            });
        
            temporarySteps.current.approvalSteps = temporarySteps.current.approvalSteps.filter((_, i) => i !== index);

            console.log("Updated after delete: ", temporarySteps.current);
        };

        // Handle changes in users or roles for specific steps
        const handleStepChange = useCallback(
            (index: number, updatedEntities: UserBasicInterface[] | RolesInterface[], type: "users" | "roles") => {
                temporarySteps.current.approvalSteps[index] = {
                    ...temporarySteps.current.approvalSteps[index],
                    [type]: type === "users" ?  updatedEntities.map(user => user.userName): updatedEntities.map(role => role.displayName)
                }
                console.log("Updated after adding new values: ", temporarySteps.current);
            },
            []
        );
        useEffect(() => {
            console.log("Received initialValues:", initialValues);
          }, [initialValues]);       
        
        return (
            <div>
                <Box
                    className={`box-container-heading ${steps.length > 0 ? "has-steps" : ""}`}
                    sx={{ position: "relative" }}
                >
                    <label> Multi Step User/Role Approval </label>

                    <Button variant="text" onClick={addNewStep} className="add-rule-btn">
                        <div className="flex-row-gap-10">
                            <PlusIcon />
                            {"Add New Approval Step"}
                        </div>
                    </Button>
                </Box>
                {steps.map((step, index) => (
                    <ApprovalStep
                        key={step.id}
                        index={index}
                        step={step}
                        initialValues={initialValues?.approvalSteps?.[index]}
                        onDelete={() => handleDelete(step.id, index)}
                        updateUsers={(updateUsers) => handleStepChange(index, updateUsers, "users")}
                        updateRoles={(updateRoles) => handleStepChange(index, updateRoles, "roles")}
                    />
                ))}
            </div>
        );
    }
);

export default ConfigurationsForm;
