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

import {
    ConditionExpressionMetaInterface,
    ConditionExpressionsMetaDataInterface
} from "@wso2is/admin.rules.v1/models/meta";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { Node } from "@xyflow/react";
import FlowConstants from "../constants/flow-constants";
import {
    FlowVariableInterface,
    FlowVariablesInterface,
    RuntimeValueInterface,
    RuntimeValueType,
    VariableDataTypes,
    VariableLimitsInterface
} from "../models/variables";
import { StaticStepTypes } from "../models/steps";

/**
 * Id of the start node, which holds the variables of the flow.
 */
export const START_STEP_ID: string = StaticStepTypes.Start.toLowerCase();

/**
 * Runtime value every flow has: a number from 0 to 99 that stays with the user's browser. The server adds it to a
 * flow that leaves it out, and only its initial value can change.
 */
export const AB_TESTING_KEY: string = "abTestingKey";
export const AB_TESTING_KEY_MIN: number = 0;
export const AB_TESTING_KEY_MAX: number = 99;

/**
 * Condition fields that read the variables of the flow.
 */
const VariableFields: {
    REQUEST_HEADERS: string;
    RUNTIME_VALUES: string;
} = {
    REQUEST_HEADERS: "request.headers",
    RUNTIME_VALUES: "runtimeValues"
};

/**
 * The names the server accepts, for each kind of variable.
 */
const VariableNamePatterns: {
    headers: RegExp;
    runtimeValues: RegExp;
} = {
    headers: /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/,
    runtimeValues: /^[A-Za-z0-9]{1,255}$/
};

/**
 * Data types a header may hold. A request may repeat a header, so it holds an array.
 */
export const HEADER_DATA_TYPES: VariableDataTypes[] = [
    VariableDataTypes.STRING_ARRAY,
    VariableDataTypes.NUMBER_ARRAY
];

/**
 * Problems with the name of a variable, named as their messages are under `flows:core.steps.start.variables.errors`.
 */
export type VariableNameError = "duplicate" | "invalidName" | "invalidRuntimeValueName" | "reserved";

/**
 * Problems with the initial value of a runtime value, named as their messages are under
 * `flows:core.steps.start.variables.errors`.
 */
export type VariableValueError = "abTestingKeyOutOfRange" | "notAnInteger" | "tooManyValues" | "valueTooLong";

/**
 * The runtime values of a flow with its A/B testing key first, adding the key with its initial value when the flow
 * does not have it yet. The key is then always the first runtime value, whatever names the other rows are given.
 *
 * @param runtimeValues - Runtime values of the flow.
 * @returns The runtime values, starting with the A/B testing key.
 */
export const withAbTestingKeyFirst = (runtimeValues: RuntimeValueInterface[]): RuntimeValueInterface[] => {
    const list: RuntimeValueInterface[] = runtimeValues ?? [];
    const index: number = list.findIndex((runtimeValue: RuntimeValueInterface) =>
        runtimeValue?.name?.trim() === AB_TESTING_KEY);

    if (index === 0) {
        return list;
    }
    if (index < 0) {
        return [
            { dataType: VariableDataTypes.INTEGER, name: AB_TESTING_KEY, value: AB_TESTING_KEY_MIN },
            ...list
        ];
    }

    return [ list[ index ], ...list.filter((_: RuntimeValueInterface, current: number) => current !== index) ];
};

/**
 * The problem with the name of a variable, if any. Header names are compared ignoring case, as HTTP does.
 *
 * @param kind      - Kind of the variable.
 * @param variables - Variables of that kind, with the A/B testing key first for runtime values.
 * @param index     - Position of the variable.
 * @returns The problem, or undefined when the name is fine or not given yet.
 */
export const getVariableNameError = (
    kind: keyof FlowVariablesInterface,
    variables: FlowVariableInterface[],
    index: number
): VariableNameError | undefined => {
    const isHeader: boolean = kind === "headers";
    const name: string = variables[ index ]?.name?.trim() ?? "";

    if (!name) {
        return undefined;
    }
    if (!VariableNamePatterns[ kind ].test(name)) {
        return isHeader ? "invalidName" : "invalidRuntimeValueName";
    }
    if (!isHeader && name === AB_TESTING_KEY && index !== 0) {
        return "reserved";
    }

    const key: string = isHeader ? name.toLowerCase() : name;
    const isDuplicate: boolean = variables.some((variable: FlowVariableInterface, other: number) => {
        const otherName: string = variable?.name?.trim() ?? "";

        return other < index && (isHeader ? otherName.toLowerCase() : otherName) === key;
    });

    return isDuplicate ? "duplicate" : undefined;
};

/**
 * The problem with the initial value of a runtime value, if any.
 *
 * @param runtimeValue   - The runtime value.
 * @param limits         - Limits on values.
 * @param isAbTestingKey - Whether it is the A/B testing key of the flow.
 * @returns The problem, or undefined when the value is fine or not given.
 */
export const getVariableValueError = (
    runtimeValue: RuntimeValueInterface,
    limits: Pick<VariableLimitsInterface, "maxValueLength" | "maxArraySize">,
    isAbTestingKey: boolean
): VariableValueError | undefined => {
    const value: RuntimeValueType = runtimeValue?.value;

    if (value === undefined || value === null) {
        return undefined;
    }
    if (isAbTestingKey) {
        return Number.isInteger(value) && (value as number) >= AB_TESTING_KEY_MIN
            && (value as number) <= AB_TESTING_KEY_MAX ? undefined : "abTestingKeyOutOfRange";
    }

    const isTooLong: (entry: string | number | boolean) => boolean = (entry: string | number | boolean): boolean =>
        limits?.maxValueLength !== undefined && String(entry).length > limits.maxValueLength;

    if (Array.isArray(value)) {
        if (limits?.maxArraySize !== undefined && value.length > limits.maxArraySize) {
            return "tooManyValues";
        }

        return value.some(isTooLong) ? "valueTooLong" : undefined;
    }
    if (runtimeValue.dataType === VariableDataTypes.INTEGER && !Number.isInteger(value)) {
        return "notAnInteger";
    }

    return typeof value === "string" && isTooLong(value) ? "valueTooLong" : undefined;
};

/**
 * The names of the variables that cannot be saved as they are, for the validation panel. A variable without a name
 * is left out when the flow is saved, so it is not reported.
 *
 * @param variables - Variables of the flow.
 * @param limits    - Limits on flow variables.
 * @returns The names of the headers and runtime values that have a problem.
 */
export const getInvalidVariableNames = (
    variables: FlowVariablesInterface,
    limits: VariableLimitsInterface
): string[] => {
    const headers: FlowVariableInterface[] = variables?.headers ?? [];
    const runtimeValues: RuntimeValueInterface[] = withAbTestingKeyFirst(variables?.runtimeValues);

    const invalidHeaders: string[] = headers
        .filter((_: FlowVariableInterface, index: number) => getVariableNameError("headers", headers, index))
        .map((header: FlowVariableInterface) => header.name.trim());
    const invalidRuntimeValues: string[] = runtimeValues
        .filter((runtimeValue: RuntimeValueInterface, index: number) => runtimeValue?.name?.trim()
            && (getVariableNameError("runtimeValues", runtimeValues, index)
                || getVariableValueError(runtimeValue, limits, index === 0)))
        .map((runtimeValue: RuntimeValueInterface) => runtimeValue.name.trim());

    return [ ...new Set([ ...invalidHeaders, ...invalidRuntimeValues ]) ];
};

/**
 * The variables that have a name, with the name trimmed.
 *
 * @param variables - Variables as edited.
 * @returns The named variables.
 */
const keepNamed = <T extends FlowVariableInterface>(variables: T[]): T[] =>
    (variables ?? []).filter((variable: T) => variable?.name?.trim())
        .map((variable: T) => ({ ...variable, name: variable.name.trim() }));

/**
 * Reads the variables off the start node, as they are saved with the flow.
 *
 * Rows without a name are left out, and header names are put in lower case, as the server keeps them.
 *
 * @param nodes - Nodes of the flow.
 * @returns The variables, or undefined when the flow defines none.
 */
export const getVariablesPayload = (nodes: Node[]): FlowVariablesInterface | undefined => {
    const variables: FlowVariablesInterface = nodes?.find(
        (node: Node) => node.id === START_STEP_ID
    )?.data?.variables as FlowVariablesInterface;

    const headers: FlowVariableInterface[] = keepNamed(variables?.headers).map(
        (header: FlowVariableInterface) => ({ ...header, name: header.name.toLowerCase() })
    );
    const runtimeValues: RuntimeValueInterface[] = keepNamed(variables?.runtimeValues);

    if (!headers.length && !runtimeValues.length) {
        return undefined;
    }

    return { headers, runtimeValues };
};

/**
 * Offers the names of the flow's variables as the qualifiers of the condition fields that read them, so a condition
 * picks a defined header or runtime value instead of typing its name. A field keeps its own input when the console
 * has flow variables turned off, or when the flow defines no variable it could pick.
 *
 * @param metadata  - The rule editor's metadata.
 * @param variables - The variables of the flow.
 * @param isEnabled - Whether the console has flow variables turned on.
 * @returns The metadata with the variable names as options.
 */
export const withVariableQualifiers = (
    metadata: ConditionExpressionsMetaDataInterface,
    variables: FlowVariablesInterface,
    isEnabled: boolean
): ConditionExpressionsMetaDataInterface => {
    if (!metadata || !isEnabled) {
        return metadata;
    }

    const namesByField: Record<string, string[]> = {
        [ VariableFields.RUNTIME_VALUES ]: withAbTestingKeyFirst(variables?.runtimeValues).map(
            (runtimeValue: RuntimeValueInterface) => runtimeValue?.name
        ),
        [ VariableFields.REQUEST_HEADERS ]: (variables?.headers ?? []).map(
            (header: FlowVariableInterface) => header?.name?.toLowerCase()
        )
    };

    return metadata.map((meta: ConditionExpressionMetaInterface): ConditionExpressionMetaInterface => {
        const names: string[] = [ ...new Set((namesByField[ meta.field?.name ] ?? [])
            .map((name: string) => name?.trim()).filter(Boolean)) ];

        if (!names.length || !meta.qualifier) {
            return meta;
        }

        return {
            ...meta,
            qualifier: {
                ...meta.qualifier,
                inputType: "options",
                values: names.map((name: string) => ({ displayName: name, name }))
            }
        };
    });
};

/**
 * Whether the console has flow variables turned on in its feature configuration.
 *
 * @param flowsFeatureConfig - Feature configuration of flows.
 * @returns True unless the feature is listed in the disabled features of flows.
 */
export const isVariablesEnabled = (flowsFeatureConfig: FeatureAccessConfigInterface): boolean =>
    isFeatureEnabled(flowsFeatureConfig, FlowConstants.VARIABLES_FEATURE_ID);

/**
 * The limits on flow variables, from the console's deployment configuration, with the server's defaults for any
 * that are not configured or not positive.
 *
 * @param configured - Limits configured under `ui.flowExecution.variables`.
 * @returns The limits.
 */
export const resolveVariableLimits = (configured?: Partial<VariableLimitsInterface>): VariableLimitsInterface => {
    const positiveOr: (value: number | undefined, fallback: number) => number = (
        value: number | undefined,
        fallback: number
    ): number =>
        Number.isInteger(value) && value > 0 ? value : fallback;

    return {
        maxArraySize: positiveOr(configured?.maxArraySize, FlowConstants.DEFAULT_MAX_ARRAY_SIZE),
        maxHeaders: positiveOr(configured?.maxHeaders, FlowConstants.DEFAULT_MAX_HEADERS),
        maxRuntimeValues: positiveOr(configured?.maxRuntimeValues, FlowConstants.DEFAULT_MAX_RUNTIME_VALUES),
        maxValueLength: positiveOr(configured?.maxValueLength, FlowConstants.DEFAULT_MAX_VALUE_LENGTH)
    };
};
