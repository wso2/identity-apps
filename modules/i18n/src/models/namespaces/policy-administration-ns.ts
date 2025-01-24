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

export interface policyAdministrationNS {
   subtitle: string;
   title: string;
   buttons: {
       newPolicy: string;
       policyAlgorithm: string;
   };
    editPolicy: {
        backBtn: string;
    };
    createPolicy: {
        title: string;
        description: string;
    };
    advancedSearch: {
        placeholder: string;
    }
    policyAlgorithm: {
        title: string;
        actionText: string;
        primaryBtn: string;
    }
    alerts: {
        deleteSuccess: {
            message: string;
            description: string;
        };
        deleteFailure: {
            message: string;
            description: string;
        };
        activateSuccess: {
            message: string;
            description: string;
        };
        activateFailure: {
            message: string;
            description: string;
        };
        deactivateSuccess: {
            message: string;
            description: string;
        };
        deactivateFailure: {
            message: string;
            description: string;
        };
        updateSuccess: {
            message: string;
            description: string;
        };
        updateFailure: {
            message: string;
            description: string;
        };
        updateAlgorithmSuccess: {
            message: string;
            description: string;
        };
        updateAlgorithmFailure: {
            message: string;
            description: string;
        };
        createSuccess: {
            message: string;
            description: string;
        };
        createFailure: {
            message: string;
            description: string;
        };
    };
    inactivePoliciesPlaceholder: {
        title: string;
        subtitle: string;
    };
    activePoliciesPlaceholder: {
        title: string;
        subtitle: string;
    };
}
