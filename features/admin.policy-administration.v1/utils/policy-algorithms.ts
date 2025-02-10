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
import PolicyAdministrationConstants from "../constants/policy-administration-constants";
import { AlgorithmOption } from "../models/policies";

export const algorithmOptions: AlgorithmOption[] = [
    {
        description: "policyAdministration:policyAlgorithm.algorithmOptions.denyOverrides.description",
        id: PolicyAdministrationConstants.DENY_OVERRIDES,
        value: 1
    },
    {
        description: "policyAdministration:policyAlgorithm.algorithmOptions.permitOverrides.description",
        id: PolicyAdministrationConstants.PERMIT_OVERRIDES,
        value: 2
    },
    {
        description: "policyAdministration:policyAlgorithm.algorithmOptions.firstApplicable.description",
        id: PolicyAdministrationConstants.FIRST_APPLICABLE,
        value: 3
    },
    {
        description: "policyAdministration:policyAlgorithm.algorithmOptions.permitUnlessDeny.description",
        id: PolicyAdministrationConstants.PERMIT_UNLESS_DENY,
        value: 4
    },
    {
        description: "policyAdministration:policyAlgorithm.algorithmOptions.denyUnlessPermit.description",
        id: PolicyAdministrationConstants.DENY_UNLESS_PERMIT,
        value: 5
    },
    {
        description: "policyAdministration:policyAlgorithm.algorithmOptions.orderedPermitOverrides.description",
        id: PolicyAdministrationConstants.ORDERED_PERMIT_OVERRIDES,
        value: 6
    },
    {
        description: "policyAdministration:policyAlgorithm.algorithmOptions.orderedDenyOverrides.description",
        id: PolicyAdministrationConstants.ORDERED_DENY_OVERRIDES,
        value: 7
    },
    {
        description: "policyAdministration:policyAlgorithm.algorithmOptions.onlyOneApplicable.description",
        id: PolicyAdministrationConstants.ONLY_ONE_APPLICABLE,
        value: 8
    }
];
