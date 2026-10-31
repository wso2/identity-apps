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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import RuleExecutionComponent from "./rules";
import { HiddenConfigurationInterface, RuleLimitsInterface } from "../contexts/rules-context";
import { ConditionExpressionsMetaDataInterface, RuleExecutionMetaDataInterface } from "../models/meta";
import { RuleExecuteCollectionWithoutIdInterface, RuleWithoutIdInterface } from "../models/rules";
import { RulesProvider } from "../providers/rules-provider";

/**
 * Props interface of {@link RulesComponent}
 */
interface RulesComponentPropsInterface extends IdentifiableComponentInterface {
    /**
     * Initial data to be passed to the rules component.
     */
    initialData?: RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface;

    /**
     * Rule expressions meta data.
     */
    conditionExpressionsMetaData: ConditionExpressionsMetaDataInterface;

    /**
     * Is multiple rules flag.
     */
    isMultipleRules?: boolean;

    /**
     * Rule executions meta data.
     */
    ruleExecutionMetaData?: RuleExecutionMetaDataInterface;

    /**
     * Hidden configuration for filtering UI components.
     */
    hidden?: HiddenConfigurationInterface;

    /**
     * Limits the rule is kept within, as the server validates them. Not enforced when absent.
     */
    limits?: RuleLimitsInterface;

    /**
     * Optional text shown before "If" in place of "Execute" (e.g., "Navigate").
     */
    executeText?: string;

    /**
     * Called whenever the rule changes, with this editor's own value.
     */
    onChange?: (rule: RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface) => void;
}

/**
 * Props interface of {@link RulesComponent}
 */
type RulesComponentPropsWithValidation =
    | (RulesComponentPropsInterface & { isMultipleRules: true; ruleExecutionMetaData: any })
    | (RulesComponentPropsInterface & { isMultipleRules?: false; ruleExecutionMetaData?: never });

/**
 * Rules component to render.
 *
 * @param props - Props injected to the component.
 * @returns Rule component.
 *
 */
const RulesComponent: FunctionComponent<RulesComponentPropsWithValidation> = ({
    ["data-componentid"]: componentId = "rules-component",
    initialData,
    conditionExpressionsMetaData,
    isMultipleRules,
    ruleExecutionMetaData,
    onChange,
    hidden,
    limits,
    executeText
}: RulesComponentPropsWithValidation): ReactElement => (
    <RulesProvider
        initialData={ initialData }
        isMultipleRules={ isMultipleRules }
        conditionExpressionsMetaData={ conditionExpressionsMetaData }
        ruleExecutionMetaData={ ruleExecutionMetaData }
        onChange={ onChange }
        hidden={ hidden }
        limits={ limits }
    >
        <RuleExecutionComponent
            data-componentid={ componentId }
            executeText={ executeText }
        />
    </RulesProvider>
);

export default RulesComponent;
