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

import {
    ConditionExpressionMetaInterface,
    ConditionExpressionsMetaDataInterface
} from "@wso2is/admin.rules.v1/models/meta";
import {
    ConditionExpressionWithoutIdInterface,
    RuleConditionWithoutIdInterface,
    RuleWithoutIdInterface
} from "@wso2is/admin.rules.v1/models/rules";
import React, { FunctionComponent, ReactElement, SVGProps } from "react";
import {
    DevicePolicyExpressionInterface,
    DevicePolicyFieldDefinitionInterface,
    PolicyANDRuleInterface,
    PolicyExpressionInterface,
    PolicyResourceResponseInterface,
    PolicyRuleInterface
} from "../models/device-policy";

/**
 * Maps device policy field metadata into the format the rules component expects,
 * excluding the `platform` field (handled by the wizard's platform tabs).
 *
 * @param fields - Field definitions returned by the policy metadata endpoint.
 * @returns Condition expression metadata for the rules component.
 */
export const mapToConditionsMeta = (
    fields: DevicePolicyFieldDefinitionInterface[]
): ConditionExpressionsMetaDataInterface =>
    fields
        .filter((f: DevicePolicyFieldDefinitionInterface): boolean => f.field.name !== "platform")
        .map(
            (f: DevicePolicyFieldDefinitionInterface): ConditionExpressionMetaInterface => ({
                field: f.field,
                operators: f.operators,
                value: {
                    ...f.value,
                    inputType: f.value.inputType.toLowerCase() as "input" | "options"
                }
            })
        );

/**
 * Flattens a rule (groups of expressions) into a single expression list for the API payload.
 *
 * @param rule - Rule instance from the rules component.
 * @returns Flat policy rule payload.
 */
export const buildFlatRule = (rule: RuleWithoutIdInterface | null): PolicyRuleInterface => {
    const rules: PolicyANDRuleInterface[] = (rule?.rules ?? []).map(
        (group: RuleConditionWithoutIdInterface): PolicyANDRuleInterface => ({
            condition: "AND",
            expressions: (group.expressions ?? []).map(
                (e: { field: string; operator: string; value: string }): PolicyExpressionInterface => ({
                    field: e.field,
                    operator: e.operator,
                    value: e.value
                })
            )
        })
    );

    return { condition: "OR", rules };
};

/**
 * Counts the total number of condition expressions across all groups of a rule.
 *
 * @param rule - Rule instance.
 * @returns Total condition count.
 */
export const countConditions = (rule: RuleWithoutIdInterface | null): number =>
    (rule?.rules ?? []).reduce(
        (acc: number, g: RuleConditionWithoutIdInterface) => acc + (g.expressions?.length ?? 0),
        0
    );

/**
 * Converts an API policy resource into the rule format consumed by the rules component.
 *
 * @param platformRule - Policy resource for a single platform.
 * @returns Rule instance, or `null` when there are no rule groups.
 */
export const convertApiRuleToRuleFormat = (
    platformRule: PolicyResourceResponseInterface
): RuleWithoutIdInterface | null => {
    const groups: { expressions: DevicePolicyExpressionInterface[] }[] =
        platformRule.rule?.rules ?? [];

    if (groups.length === 0) {
        return null;
    }

    const rules: RuleConditionWithoutIdInterface[] = groups.map(
        (group: { expressions: DevicePolicyExpressionInterface[] }): RuleConditionWithoutIdInterface => {
            const expressions: ConditionExpressionWithoutIdInterface[] =
                (group.expressions ?? []).map(
                    (expr: DevicePolicyExpressionInterface): ConditionExpressionWithoutIdInterface => ({
                        field: expr.field,
                        operator: expr.operator,
                        value: expr.value?.value ?? ""
                    })
                );

            return { condition: "AND", expressions } as RuleConditionWithoutIdInterface;
        }
    );

    return { condition: "OR", rules } as unknown as RuleWithoutIdInterface;
};

/**
 * Renders a platform logo, supporting both string URLs and SVG React components.
 *
 * @param logo - Logo source (URL string or SVG component).
 * @param size - Width/height in pixels.
 * @returns The rendered logo element.
 */
export const renderPlatformLogo = (
    logo: FunctionComponent | string,
    size: number
): ReactElement => {
    if (typeof logo === "string") {
        return <img src={ logo } alt="" style={ { height: size, objectFit: "contain", width: size } } />;
    }

    const LogoComponent: FunctionComponent<SVGProps<SVGSVGElement>> =
        logo as FunctionComponent<SVGProps<SVGSVGElement>>;

    return <LogoComponent width={ size } height={ size } />;
};
