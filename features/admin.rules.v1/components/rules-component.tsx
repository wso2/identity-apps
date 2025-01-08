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
import Rules from "./rules";
import { RuleComponentMetaDataInterface, RuleExecutionMetaDataInterface, RuleInterface } from "../models/rules";
import { RulesProvider } from "../providers/rules-provider";
import Rules from "./rules";
import "./rules-component.scss";

/**
 * Props interface of {@link RulesComponent}
 */
interface RulesComponentPropsInterface extends IdentifiableComponentInterface {
    /**
     * Initial data to be passed to the rules component.
     */
    initialData?: RuleInterface[];

    /**
     * Meta data to be passed to the rules component.
     */
    metaData: RuleComponentMetaDataInterface;

    /**
     * Multiple rules flag.
     * 
     * @default false
     */
    multipleRules?: boolean;

    /**
     * Rule execution meta data.
     */
    ruleExecutions?: RuleExecutionMetaDataInterface[];
}

type RulesComponentPropsWithValidation =
    | (RulesComponentPropsInterface & { multipleRules: true; ruleExecutions: any })
    | (RulesComponentPropsInterface & { multipleRules?: false; ruleExecutions?: never });

/**
 * Landing page for the Flows feature.
 *
 * @param props - Props injected to the component.
 * @returns Flows page component.
 */
const RulesComponent: FunctionComponent<RulesComponentPropsWithValidation> = ({
    ["data-componentid"]: componentId = "rules-component",
    initialData,
    metaData,
    multipleRules,
    ruleExecutions
}: RulesComponentPropsWithValidation): ReactElement => (
    <RulesProvider metaData={ metaData } initialData={ initialData } ruleExecutions={ ruleExecutions }>
        <Rules data-componentid={ componentId } multipleRules={ multipleRules } />
    </RulesProvider>
);

export default RulesComponent;
