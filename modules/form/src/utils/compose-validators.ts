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

/**
 * Composes multiple validators into a single validator function.
 *
 * @remarks
 * This function takes multiple validator functions as arguments and returns a single
 * validator function that applies each validator in sequence. The composed validator
 * stops at the first validation error encountered.
 *
 * @param validators - An array of validator functions.
 * @returns A composed validator function that applies all the provided validators.
 *
 * @example
 * ```typescript
 * const isRequired = (value: string) => value ? undefined : "This field is required";
 * const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value) ? undefined : "Invalid email address";
 * const validate = composeValidators(isRequired, isEmail);
 * const error = validate("example@domain.com"); // undefined
 * const error2 = validate(""); // "This field is required"
 * ```
 */
const composeValidators = (...validators: Array<(value: any) => string | undefined | any>) => (
    value: any
): string | undefined => validators.reduce((error: any, validator: any) => error || validator(value), undefined);

export default composeValidators;
