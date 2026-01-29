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

import merge from "lodash-es/merge";
import { Resources } from "../models/resources";
import { Step } from "../models/steps";

const resolveStepMetadata = (resources: Resources, steps: Step[]): Step[] => {
    const updateStepResourceType = (step: Step): Step => {
        let updatedStep: Step = { ...step };

        for (const stepWithMeta of resources?.steps || []) {
            if (step.type === stepWithMeta.type) {
                updatedStep = merge({}, stepWithMeta, updatedStep);

                break;
            }
        }

        return updatedStep;
    };

    return steps?.map(updateStepResourceType);
};

export default resolveStepMetadata;
