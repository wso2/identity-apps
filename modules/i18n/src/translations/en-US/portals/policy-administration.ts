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

import { policyAdministrationNS } from "../../../models";

export const policyAdministration: policyAdministrationNS = {
    advancedSearch: {
        placeholder: "Search by policy name"
    },
    buttons:{
        newPolicy: "New Policy",
        policyAlgorithm: "Policy Algorithm"
    },
    createPolicy: {
        description: "Defines access control rules for secure and fine-grained resource authorization.",
        title: "Create Policy"
    },
    editPolicy: {
        backBtn: "Go back to Policy Administration "
    },
    policyAlgorithm: {
        actionText: "Select a policy combining algorithm",
        primaryBtn: "Update",
        title: "Policy Algorithm"
    },
    subtitle: "Create and manage your policies here.",
    title: "Policy Administration"
};
