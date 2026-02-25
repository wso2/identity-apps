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

import { IssuerUsageScopeNS } from "../../../models/namespaces/issuer-usage-scope-ns";

export const issuerUsageScope: IssuerUsageScopeNS = {
    description: "Control whether the root organization issuer is available for use by the child organizations.",
    form: {
        issuer: {
            label: "Issuer of {{organizationName}} organization",
            placeholder: "Loading issuer..."
        },
        options: {
            allExistingAndFutureOrgs: {
                hint: "The applications which are created in the organizations under" +
                " {{organizationName}} organization, can use the issuer of {{organizationName}} organization as the token issuer.",
                label: "Allow the issuer to be used in all organizations."
            },
            none: {
                hint: "Do not allow the issuer of this organization to be used in any organizations created under this organization.",
                label: "Do not allow the issuer to be used in any organizations."
            }
        },
        updateButton: {
            ariaLabel: "Issuer usage scope form update button"
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Error occurred while fetching issuer usage scope configurations.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully retrieved the issuer usage scope configurations.",
                message: "Retrieved successfully"
            }
        },
        updateConfiguration: {
            defaultError: {
                description: "Error occurred while updating issuer usage scope configurations.",
                message: "Error occurred"
            },
            issuerUsedInOrgsError: {
                description: "The issuer of this organization is currently being used in the child organizations' applications.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully updated the issuer usage scope configurations.",
                message: "Updated successfully"
            }
        }
    },
    title: "Issuer Usage Scope"
};
