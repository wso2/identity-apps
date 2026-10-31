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

import { BRANCH_ID_CHAR_COUNT, DEFAULT_BRANCH_NAME, newBranch } from "./branch-operations";
import generateResourceId from "./generate-resource-id";
import { ActionTypes } from "../models/actions";
import { Action, Branch } from "../models/elements";
import { Step, StepTypes } from "../models/steps";

export { DEFAULT_BRANCH_NAME };

/**
 * Gives a newly created rule decision step one conditional branch and the default.
 *
 * @param step - The step being added to the canvas.
 * @returns The step, with its starting branches when it is a rule decision that has none.
 */
const seedRuleDecisionBranches = (step: Step): Step => {

    if (step?.type !== StepTypes.RuleEvaluation) {
        return step;
    }

    const action: Action = (step.data?.action ?? {}) as Action;

    if (action.branches?.length > 0) {
        return step;
    }

    const defaultBranch: Branch = {
        id: generateResourceId("branch", BRANCH_ID_CHAR_COUNT),
        name: DEFAULT_BRANCH_NAME
    };

    return {
        ...step,
        data: {
            ...step.data,
            action: {
                ...action,
                // Every action names its type, and the API rejects one that does not.
                type: ActionTypes.Route,
                branches: [ newBranch(), defaultBranch ]
            }
        }
    };
};

export default seedRuleDecisionBranches;
