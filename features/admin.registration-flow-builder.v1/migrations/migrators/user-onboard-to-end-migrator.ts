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
import { StaticStepTypes, StepTypes, Step } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { RegistrationFlow } from "../../models/flow";
import defaultEndNodeTemplate from "../templates/default-end-node.json";

/**
 * Recursively updates navigation references from USER_ONBOARD to END in form components.
 *
 * @param components - Array of form components to update
 * @returns Updated components with navigation references changed
 */
const updateNavigationReferences = (components: Element[]): Element[] => {
    return components.map((component: Element) => {
        let updatedComponent = { ...component };

        // Check if this component has an action that references USER_ONBOARD
        if (component.action && component.action.next === StaticStepTypes.UserOnboard) {
            updatedComponent = {
                ...updatedComponent,
                action: {
                    ...component.action,
                    next: StepTypes.End
                }
            };
        }

        // Recursively process nested components (for FORM components with sub-components)
        if (component.components && Array.isArray(component.components)) {
            updatedComponent = {
                ...updatedComponent,
                components: updateNavigationReferences(component.components)
            };
        }

        return updatedComponent;
    });
};

/**
 * Migrates old registration flows with USER_ONBOARD nodes to the new END node format.
 *
 * This migrator:
 * 1. Checks if the flow needs migration (contains USER_ONBOARD nodes)
 * 2. Returns the original flow if no migration is needed
 * 3. Identifies USER_ONBOARD nodes in the flow
 * 4. Replaces them with the new configurable END node
 * 5. Updates any navigation references pointing to USER_ONBOARD nodes
 * 6. Preserves the position of the original USER_ONBOARD node
 *
 * @param flow - The registration flow to migrate
 * @returns The migrated registration flow with END nodes, or the original flow if no migration is needed
 */
const userOnboardToEndMigrator = (flow: RegistrationFlow): RegistrationFlow => {
    if (!flow || !flow.steps || !Array.isArray(flow.steps)) {
        return flow;
    }

    // Check if migration is needed
    const needsMigration = flow.steps.some((step: Step) => step.type === StaticStepTypes.UserOnboard);

    if (!needsMigration) {
        return flow;
    }

    const migratedSteps: Step[] = flow.steps.map((step: Step) => {
        // Check if this is a USER_ONBOARD step that needs to be migrated
        if (step.type === StaticStepTypes.UserOnboard) {
            // Create the new END node based on the default template
            const endNode: any = {
                ...defaultEndNodeTemplate,
                // Preserve the original position if it exists, otherwise use template position
                position: step.position || defaultEndNodeTemplate.position,
                // Use original size if available, otherwise use template size
                size: step.size || defaultEndNodeTemplate.size
            };

            return endNode as Step;
        }

        // For other steps, check if they have navigation references to USER_ONBOARD
        if (step.data && step.data.components) {
            const updatedComponents = updateNavigationReferences(step.data.components);

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

    return {
        ...flow,
        steps: migratedSteps
    };
};


export default userOnboardToEndMigrator;
