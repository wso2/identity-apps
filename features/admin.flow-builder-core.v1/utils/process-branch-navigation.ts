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

import omit from "lodash-es/omit";
import { fillBranchNames } from "./branch-operations";
import { ActionTypes } from "../models/actions";
import { Action, Branch } from "../models/elements";

/**
 * Writes the canvas edges of a rule decision step back onto its branches.
 *
 * @param stepData    - The `data` of the step being transformed.
 * @param navigations - Map of source handle id to target step id, for the whole flow.
 * @returns The step data with each branch's target resolved.
 */
const processBranchNavigation = (stepData: any, navigations: Record<string, string>): any => {

    const action: Action = stepData?.action;

    if (!action?.branches) {
        return stepData;
    }

    return {
        ...stepData,
        action: {
            // A rule evaluation runs no executor, and the API rejects one, so a stale one from an
            // earlier save is dropped along with the single next step.
            ...omit(action, [ "next", "executor" ]),
            // Asserted on the way out rather than trusted from the node, so that a decision built
            // before the type was recorded still saves. Every action names its type, and the API
            // rejects one that does not.
            type: ActionTypes.Route,
            branches: fillBranchNames(action.branches).map((branch: Branch) => ({
                ...branch,
                next: navigations[branch.id]
            }))
        }
    };
};

export default processBranchNavigation;
