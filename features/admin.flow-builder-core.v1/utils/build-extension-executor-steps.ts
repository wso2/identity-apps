/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { ExtensionExecutorInterface } from "../models/metadata";
import { ResourceTypes } from "../models/resources";
import { Step, StepCategories, StepTypes } from "../models/steps";

/**
 * Icon used when a contributed executor does not declare one, or declares one that fails to load.
 */
export const DEFAULT_EXTENSION_EXECUTOR_ICON: string = "assets/images/icons/step.svg";

/**
 * Builds palette steps for the executors contributed by extensions deployed on the server.
 */
const buildExtensionExecutorSteps = (extensionExecutors: ExtensionExecutorInterface[]): Step[] => {
    if (!extensionExecutors?.length) {
        return [];
    }

    return extensionExecutors
        .filter((executor: ExtensionExecutorInterface) => !!executor?.name)
        .map((executor: ExtensionExecutorInterface) => ({
            category: StepCategories.Workflow,
            data: {
                action: {
                    executor: {
                        name: executor.name,
                        ...(executor.requiresConnection ? { meta: { idpName: "" } } : {})
                    },
                    next: "",
                    type: "EXECUTOR"
                }
            },
            deprecated: false,
            display: {
                description: executor.description,
                image: executor.icon || DEFAULT_EXTENSION_EXECUTOR_ICON,
                label: executor.displayName,
                showOnResourcePanel: true
            },
            resourceType: ResourceTypes.Step,
            type: StepTypes.Execution,
            version: "0.1.0"
        })) as unknown as Step[];
};

export default buildExtensionExecutorSteps;
