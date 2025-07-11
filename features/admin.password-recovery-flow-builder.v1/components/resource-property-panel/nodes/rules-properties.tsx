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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import useGetRulesMeta from "@wso2is/admin.rules.v1/api/use-get-rules-meta";
import RulesComponent from "@wso2is/admin.rules.v1/components/rules-component";
import {
    sampleExpressionsMeta,
    sampleRuleExecuteInstances,
    sampleRuleExecutionMeta
} from "@wso2is/admin.rules.v1/data";
import { getRuleInstanceValue } from "@wso2is/admin.rules.v1/providers/rules-provider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import "./rules-properties.scss";

/**
 * Props interface of {@link RulesProperties}
 */
export interface RulesPropertiesPropsInterface extends IdentifiableComponentInterface { }

/**
 * Rules properties component.
 *
 * @param props - Props injected to the component.
 * @returns Rules properties component.
 */
const RulesProperties: FunctionComponent<RulesPropertiesPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-properties-component"
}: RulesPropertiesPropsInterface): ReactElement => {

    // TODO: Change to collect dynamic value from the context
    const {
        data: RuleExpressionsMetaData
    } = useGetRulesMeta("preIssueAccessToken");

    // TODO: Use this function to get the rule value.
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const handleGetRuleValue = () => {
        const ruleValue: any = getRuleInstanceValue();

        // eslint-disable-next-line no-console
        console.log(ruleValue);
    };
    /* eslint-enable @typescript-eslint/no-unused-vars */

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2">
                Define a rule to how conditionally proceed to next steps in the flow
            </Typography>
            { RuleExpressionsMetaData && (
                <RulesComponent
                    initialData={ sampleRuleExecuteInstances }
                    conditionExpressionsMetaData={ sampleExpressionsMeta }
                    isMultipleRules={ true }
                    ruleExecutionMetaData={ sampleRuleExecutionMeta } />
            ) }
            <Box sx={ { mt: 3 } }>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={ handleGetRuleValue }
                >
                    Print Data
                </Button>
            </Box>
        </Stack>
    );
};

export default RulesProperties;
