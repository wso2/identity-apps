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
 * Type of value a declared header, query parameter or variable holds.
 */
export enum DeclaredDataTypes {
    STRING = "STRING",
    INTEGER = "INTEGER",
    DECIMAL = "DECIMAL",
    BOOLEAN = "BOOLEAN",
    STRING_ARRAY = "STRING_ARRAY",
    NUMBER_ARRAY = "NUMBER_ARRAY"
}

/**
 * The value a declared variable starts with, of the variable's type.
 */
export type DeclaredValue = string | number | boolean | (string | number)[];

/**
 * A header or query parameter the flow reads from each request.
 */
export interface DeclarationInterface {
    name: string;
    dataType: DeclaredDataTypes;
}

/**
 * A variable the flow keeps.
 */
export interface VariableDeclarationInterface extends DeclarationInterface {
    value?: DeclaredValue;
    clientWritable?: boolean;
}

/**
 * What a flow declares besides its steps.
 */
export interface FlowDeclarationsInterface {
    headers?: DeclarationInterface[];
    queryParams?: DeclarationInterface[];
    variables?: VariableDeclarationInterface[];
}

/**
 * Whether flows may declare headers, query parameters and variables, and the limits they are saved against.
 */
export interface DeclarationConfigsInterface {
    enabled: boolean;
    maxHeaders: number;
    maxQueryParams: number;
    maxVariables: number;
    maxValueLength: number;
    maxArraySize: number;
}
