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

import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import RulesComponent from "@wso2is/admin.rules.v1/components/rules-component";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import "./rules-properties.scss";
import useGetRulesMeta from "@wso2is/admin.rules.v1/api/use-get-rules-meta";
import { sampleExecutionsList } from "@wso2is/admin.rules.v1/data";

/**
 * Props interface of {@link RulesProperties}
 */
export interface RulesPropertiesPropsInterface extends IdentifiableComponentInterface { }

/**
 * Component to generate the properties for the attribute collector widget.
 *
 * @param props - Props injected to the component.
 * @returns The RulesProperties component.
 */
const RulesProperties: FunctionComponent<RulesPropertiesPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-properties-component"
}: RulesPropertiesPropsInterface): ReactElement => {

    // TODO: Change the glow value
    const {
        data: RulesMeta
    } = useGetRulesMeta("preIssueAccessToken");

    return( 
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2">Define a rule to how conditionally proceed to next steps in the flow</Typography>
            { RulesMeta &&
                <RulesComponent metaData={ RulesMeta } multipleRules={ true } ruleExecutions={ sampleExecutionsList } />
            }
            <Box sx={{ mt: 3 }}>
                <Button size="small" variant="contained" color="primary">Save</Button>
            </Box>
        </Stack>
    
    );
};

export default RulesProperties;
