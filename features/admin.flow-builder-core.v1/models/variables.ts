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

/**
 * Type of value a header or runtime value of a flow holds.
 */
export enum VariableDataTypes {
    STRING = "STRING",
    INTEGER = "INTEGER",
    DECIMAL = "DECIMAL",
    BOOLEAN = "BOOLEAN",
    STRING_ARRAY = "STRING_ARRAY",
    NUMBER_ARRAY = "NUMBER_ARRAY"
}

/**
 * The value a runtime value starts with, of its type.
 */
export type RuntimeValueType = string | number | boolean | (string | number)[];

/**
 * A variable of a flow: a header it reads from each request, or a runtime value it keeps.
 */
export interface FlowVariableInterface {
    name: string;
    dataType: VariableDataTypes;
}

/**
 * A runtime value the flow keeps.
 */
export interface RuntimeValueInterface extends FlowVariableInterface {
    value?: RuntimeValueType;
    clientWritable?: boolean;
}

/**
 * The variables of a flow: the headers it reads from each request, and the runtime values it keeps.
 */
export interface FlowVariablesInterface {
    headers?: FlowVariableInterface[];
    runtimeValues?: RuntimeValueInterface[];
}

/**
 * The limits flow variables are saved against.
 */
export interface VariableLimitsInterface {
    maxHeaders: number;
    maxRuntimeValues: number;
    maxValueLength: number;
    maxArraySize: number;
}
