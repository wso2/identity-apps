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

/**
 * Interface to represent the rule execution data.
 */
export interface ListDataInterface {
    name: string;
    displayName: string;
}

/**
 * What a condition using an operator takes as its value: `none` for an operator that checks the
 * field alone (`isBlank`, `isEmpty`), `list` for one compared against a set (`in`, `notIn`), and
 * `single` for everything else.
 */
export type OperatorValueInputType = "none" | "single" | "list";

/**
 * An operator as the rule metadata publishes it.
 */
export interface OperatorInterface extends ListDataInterface {
    /**
     * The value a condition using the operator takes. A single value when absent.
     */
    valueInput?: OperatorValueInputType;
}

/**
 * Interface to represent the rule execution data.
 */
export interface LinkInterface {
    href: string;
    method: string;
    rel: "values" | "filter";
}

/**
 * Interface to represent the condition expression meta data value.
 */
export interface ExpressionValueInterface {
    inputType: "input" | "options";
    valueType: string;
    valueReferenceAttribute?: string;
    valueDisplayAttribute?: string;
    links?: LinkInterface[];
    values?: ListDataInterface[];
}

/**
 * Interface to represent the condition expression meta data.
 */
export interface ConditionExpressionMetaInterface {
    field: ListDataInterface,
    /**
     * How a qualifier is chosen for this field, for fields that name a family of values rather than a
     * single one. Entered the same way as a value, so it carries the same shape. Absent on fields
     * that name one value, and a field with no `qualifier` here renders no qualifier control.
     */
    qualifier?: ExpressionValueInterface;
    /**
     * The operators the field supports.
     */
    operators: OperatorInterface[],
    value: ExpressionValueInterface;
    /**
     * The fields a value of this field may be read from instead of being entered. Absent when only
     * an entered value is allowed, which is what keeps the value input exactly as it was.
     */
    valueFieldNames?: string[];
}

/**
 * Interface to represent the condition expressions meta data.
 */
export type ConditionExpressionsMetaDataInterface = ConditionExpressionMetaInterface[];

/**
 * Interface to represent the rule executions meta data.
 */
export interface RuleExecutionMetaDataInterface {
    executions: ListDataInterface[];
    fallbackExecutions: ListDataInterface[];
}
