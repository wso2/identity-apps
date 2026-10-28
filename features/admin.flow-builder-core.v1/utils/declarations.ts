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
import { Node } from "@xyflow/react";
import {
    DeclarationInterface,
    DeclaredDataTypes,
    FlowDeclarationsInterface,
    VariableDeclarationInterface
} from "../models/declarations";
import { StaticStepTypes } from "../models/steps";

/**
 * Id of the start node, which holds what the flow declares.
 */
export const START_STEP_ID: string = StaticStepTypes.Start.toLowerCase();

/**
 * Variable every flow declares: a number from 0 to 99 that stays with the user's browser. The server adds it to a
 * flow that leaves it out, and only its initial value can change.
 */
export const AB_TESTING_KEY: string = "abTestingKey";
export const AB_TESTING_KEY_MIN: number = 0;
export const AB_TESTING_KEY_MAX: number = 99;

/**
 * Condition fields that read what the flow declares.
 */
export const DeclaredFields: {
    VARIABLES: string;
    REQUEST_HEADERS: string;
    REQUEST_QUERY_PARAMETERS: string;
} = {
    REQUEST_HEADERS: "request.headers",
    REQUEST_QUERY_PARAMETERS: "request.queryParameters",
    VARIABLES: "variables"
};

/**
 * The names the server accepts, for each kind of declaration.
 */
export const DeclarationNamePatterns: {
    headers: RegExp;
    queryParams: RegExp;
    variables: RegExp;
} = {
    headers: /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/,
    queryParams: /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,63}$/,
    variables: /^[A-Za-z0-9]{1,255}$/
};

/**
 * Data types a header or query parameter may hold. A request may repeat either, so they hold arrays.
 */
export const REQUEST_VALUE_DATA_TYPES: DeclaredDataTypes[] = [
    DeclaredDataTypes.STRING_ARRAY,
    DeclaredDataTypes.NUMBER_ARRAY
];

/**
 * The declarations that have a name, with the name trimmed.
 *
 * @param declarations - Declarations as edited.
 * @returns The named declarations.
 */
const keepNamed = <T extends DeclarationInterface>(declarations: T[]): T[] =>
    (declarations ?? []).filter((declaration: T) => declaration?.name?.trim())
        .map((declaration: T) => ({ ...declaration, name: declaration.name.trim() }));

/**
 * Reads the declarations off the start node, as they are saved with the flow.
 *
 * Rows without a name are left out, and header names are put in lower case, as the server keeps them.
 *
 * @param nodes - Nodes of the flow.
 * @returns The declarations, or undefined when the flow declares nothing.
 */
export const getDeclarationsPayload = (nodes: Node[]): FlowDeclarationsInterface | undefined => {
    const declarations: FlowDeclarationsInterface = nodes?.find(
        (node: Node) => node.id === START_STEP_ID
    )?.data?.declarations as FlowDeclarationsInterface;

    const headers: DeclarationInterface[] = keepNamed(declarations?.headers).map(
        (header: DeclarationInterface) => ({ ...header, name: header.name.toLowerCase() })
    );
    const queryParams: DeclarationInterface[] = keepNamed(declarations?.queryParams);
    const variables: VariableDeclarationInterface[] = keepNamed(declarations?.variables);

    if (!headers.length && !queryParams.length && !variables.length) {
        return undefined;
    }

    return { headers, queryParams, variables };
};

/**
 * Offers the names the flow declares as the qualifiers of the condition fields that read them, so a condition
 * picks a declared header, query parameter or variable instead of typing its name.
 *
 * @param metadata     - The rule editor's metadata.
 * @param declarations - What the flow declares.
 * @returns The metadata with the declared names as options.
 */
export const withDeclaredQualifiers = (
    metadata: ConditionExpressionsMetaDataInterface,
    declarations: FlowDeclarationsInterface
): ConditionExpressionsMetaDataInterface => {
    if (!metadata) {
        return metadata;
    }

    const namesByField: Record<string, string[]> = {
        [ DeclaredFields.VARIABLES ]: (declarations?.variables ?? []).map(
            (variable: VariableDeclarationInterface) => variable?.name
        ),
        [ DeclaredFields.REQUEST_HEADERS ]: (declarations?.headers ?? []).map(
            (header: DeclarationInterface) => header?.name?.toLowerCase()
        ),
        [ DeclaredFields.REQUEST_QUERY_PARAMETERS ]: (declarations?.queryParams ?? []).map(
            (queryParam: DeclarationInterface) => queryParam?.name
        )
    };

    return metadata.map((meta: ConditionExpressionMetaInterface): ConditionExpressionMetaInterface => {
        const names: string[] = namesByField[ meta.field?.name ];

        if (!names || !meta.qualifier) {
            return meta;
        }

        return {
            ...meta,
            qualifier: {
                ...meta.qualifier,
                inputType: "options",
                values: [ ...new Set(names.map((name: string) => name?.trim()).filter(Boolean)) ]
                    .map((name: string) => ({ displayName: name, name }))
            }
        };
    });
};
