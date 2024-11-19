/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { ValueWithFallback } from "../models/base";

/**
 * Type-guard to check if the given value is of type `ValueWithFallback`.
 * @param value - Value to be checked.
 * @returns `true` if the value is of type `ValueWithFallback`, else `false`.
 */
const isTextValueWithFallback = (value: any): value is ValueWithFallback => {
    return (
        value !== null &&
        typeof value === "object" &&
        "fallback" in value &&
        "i18nKey" in value &&
        (value.fallback === null || typeof value.fallback === "string") &&
        (value.i18nKey === null || typeof value.i18nKey === "string")
    );
};

export default isTextValueWithFallback;
