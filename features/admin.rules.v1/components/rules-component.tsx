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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import RuleExecutionComponent from "./rules";
import { ConditionExpressionsMetaDataInterface, RuleExecutionMetaDataInterface } from "../models/meta";
import { RuleExecuteCollectionInterface, RuleInterface } from "../models/rules";
import { RulesProvider } from "../providers/rules-provider";
import "./rules-component.scss";

/**
 * Props interface of {@link RulesComponent}
 */
interface RulesComponentPropsInterface extends IdentifiableComponentInterface {
    /**
     * Initial data to be passed to the rules component.
     */
    initialData?: RuleExecuteCollectionInterface | RuleInterface;

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
    ruleExecutionMetaData
}: RulesComponentPropsWithValidation): ReactElement => (
    <RulesProvider
        initialData={ initialData }
        conditionExpressionsMetaData={ conditionExpressionsMetaData }
        ruleExecutionMetaData={ ruleExecutionMetaData }
    >
        <RuleExecutionComponent
            data-componentid={ componentId }
            isMultipleRules={ isMultipleRules }
        />
    </RulesProvider>
);

export default RulesComponent;
