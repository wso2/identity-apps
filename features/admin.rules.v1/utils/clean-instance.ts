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

import removeIds from "./remove-ids";
import {
    RuleExecuteCollectionInterface,
    RuleExecuteCollectionWithoutIdInterface,
    RuleInterface, RuleWithoutIdInterface
} from "../models/rules";

/**
 * Cleans the rule instance by removing the `isRuleInstanceTouched` and `id` properties.
 *
 * @param obj - The rule object or rule collection that needs to be cleaned.
 * @param isCollection - A flag indicating whether the input is a collection of rules.
 * @returns RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface -
 * The cleaned object without the `isRuleInstanceTouched` property.
 */
export const cleanInstance = (
    obj: RuleExecuteCollectionInterface | RuleInterface,
    isCollection: boolean = false
): RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface => {
    let objWithoutTouched: RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface;

    if (isCollection) {
        objWithoutTouched = {
            ...obj,
            rules: (obj as RuleExecuteCollectionInterface)?.rules.map(
                ({ isRuleInstanceTouched: _, ...rest }: RuleInterface) => rest
            )
        } as RuleExecuteCollectionWithoutIdInterface;
    } else {
        const { isRuleInstanceTouched: _, ...rest } = obj as RuleInterface;

        objWithoutTouched = rest as RuleInterface;
    }

    return removeIds(objWithoutTouched);
};

export default cleanInstance;
