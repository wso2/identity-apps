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

import { Element } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { Step, StepTypes } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { PasswordRecoveryFlow } from "../../models/flow";
import defaultEndNodeTemplate from "../templates/default-end-node.json";

/**
 * Checks if a flow has string "End" references in component actions.
 *
 * @param flow - The password recovery flow to check
 * @returns True if the flow contains string "End" references
 */
const hasStringEndReference = (flow: PasswordRecoveryFlow): boolean => {
    if (!flow || !flow.steps || !Array.isArray(flow.steps)) {
        return false;
    }

    return flow.steps.some((step: Step) => {
        if (step.data && step.data.components) {
            return checkComponentsForStringEnd(step.data.components);
        }

        return false;
    });
};

/**
 * Recursively checks components for string "End" references.
 *
 * @param components - Array of components to check
 * @returns True if any component has a string "End" reference
 */
const checkComponentsForStringEnd = (components: Element[]): boolean => {
    return components.some((component: Element) => {
        if (component.action && component.action.next === "End") {
            return true;
        }

        if (component.components && Array.isArray(component.components)) {
            return checkComponentsForStringEnd(component.components);
        }

        return false;
    });
};

/**
 * Recursively updates string "End" references to proper END node references in form components.
 *
 * @param components - Array of form components to update
 * @returns Updated components with string "End" references changed to END
 */
const updateStringEndReferences = (components: Element[]): Element[] => {
    return components.map((component: Element) => {
        let updatedComponent: Element = { ...component };

        if (component.action && component.action.next === "End") {
            updatedComponent = {
                ...updatedComponent,
                action: {
                    ...component.action,
                    next: StepTypes.End
                }
            };
        }

        if (component.components && Array.isArray(component.components)) {
            updatedComponent = {
                ...updatedComponent,
                components: updateStringEndReferences(component.components)
            };
        }

        return updatedComponent;
    });
};

/**
 * Calculates the appropriate position for the END node based on existing steps.
 *
 * @param steps - Array of existing steps
 * @returns Position coordinates for the END node
 */
const calculateEndNodePosition = (steps: Step[]): { x: number; y: number } => {
    if (!steps || steps.length === 0) {
        return { x: 1120, y: 420 };
    }

    const rightmostX = Math.max(...steps.map(step => {
        const stepX: number = step.position?.x || 0;
        const stepWidth: number = step.size?.width || 350;

        return stepX + stepWidth;
    }));

    const averageY: number = steps.reduce((sum, step) => sum + (step.position?.y || 200), 0) / steps.length;

    return {
        x: rightmostX + 100,
        y: averageY
    };
};

/**
 * Migrates old password recovery flows with string "End" references to the new END node format.
 *
 * This migrator:
 * 1. Checks if the flow needs migration (contains string "End" references but no END node)
 * 2. Returns the original flow if no migration is needed
 * 3. Identifies string "End" references in component actions
 * 4. Adds a new configurable END node to the flow
 * 5. Updates any navigation references pointing to string "End" to reference the END node
 * 6. Positions the END node appropriately relative to existing nodes
 *
 * @param flow - The password recovery flow to migrate
 * @returns The migrated password recovery flow with END nodes, or the original flow if no migration is needed
 */
const endStepMigrator = (flow: PasswordRecoveryFlow): PasswordRecoveryFlow => {
    if (!flow || !flow.steps || !Array.isArray(flow.steps)) {
        return flow;
    }

    const hasStringEndReferences: boolean = hasStringEndReference(flow);
    const hasEndNode: boolean = flow.steps.some((step: Step) => step.type === StepTypes.End);

    if (!hasStringEndReferences || hasEndNode) {
        return flow;
    }

    const endNodePosition: { x: number; y: number } = calculateEndNodePosition(flow.steps);

    // Create the new END node based on the default template
    const endNode: Step = {
        ...defaultEndNodeTemplate,
        position: endNodePosition
    } as unknown as Step;

    // Update steps to replace string "End" references with proper navigation
    const migratedSteps: Step[] = flow.steps.map((step: Step) => {
        if (step.data && step.data.components) {
            const updatedComponents: Element[] = updateStringEndReferences(step.data.components);

            return {
                ...step,
                data: {
                    ...step.data,
                    components: updatedComponents
                }
            };
        }

        return step;
    });

    migratedSteps.push(endNode);

    return {
        ...flow,
        steps: migratedSteps
    };
};

export default endStepMigrator;