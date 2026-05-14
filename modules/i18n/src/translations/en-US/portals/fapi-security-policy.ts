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

import { FapiSecurityPolicyNS } from "../../../models/namespaces/fapi-security-policy-ns";

export const fapiSecurityPolicy: FapiSecurityPolicyNS = {
    description: "Configure the FAPI security profile enforced across your organization's applications.",
    form: {
        buttons: {
            update: {
                ariaLabel: "FAPI security policy form update button"
            }
        },
        dcr: {
            fields: {
                mandate: {
                    hint: "When enabled, applications registered through the DCR endpoint will be bound to the selected FAPI profile.",
                    label: "Mandate FAPI for applications registered using DCR"
                },
                profile: {
                    label: "Apply FAPI Profile: "
                }
            },
            heading: "Dynamic Client Registration"
        },
        fields: {
            enableFapi: {
                hint: "Global switch to activate FAPI security requirements across all applications.",
                label: "Enable FAPI"
            }
        },
        profiles: {
            description: "Select the FAPI security profiles available organization-wide. " +
                "At least one profile must be enabled. " +
                "Applications can then be registered using any of the enabled profiles.",
            heading: "Supported FAPI Profiles",
            options: {
                fapi1Advanced: {
                    hint: "Advanced protection for secure data sharing and API access.",
                    label: "FAPI 1 Advanced"
                },
                fapi2Security: {
                    hint: "Enhanced protection for mission-critical APIs and sensitive data.",
                    label: "FAPI 2 Security"
                }
            },
            validations: {
                atLeastOne: "At least one FAPI profile must be selected."
            }
        }
    },
    constraints: {
        grantTypes: {
            hint: "Some grant types are restricted by the active FAPI profile. " +
                "This setting is locked and cannot be modified."
        },
        pkce: {
            hint: "PKCE with the S256 code challenge method is required by the active FAPI profile. " +
                "This setting is locked and cannot be modified."
        },
        pvtKeyJwt: {
            hint: "Private key JWT reuse is not permitted by the active FAPI profile. " +
                "This setting is locked and cannot be modified."
        },
        par: {
            hint: "Pushed Authorization Requests (PAR) are required by the active FAPI profile. " +
                "This setting is locked and cannot be modified."
        },
        validateBinding: {
            hint: "Token binding validation is required by the active FAPI profile. " +
                "This setting is locked and cannot be modified."
        }
    },
    notifications: {
        getDcrConfig: {
            error: {
                description: "Error occurred while fetching DCR FAPI configurations.",
                message: "Error occurred"
            }
        },
        getFapiConfig: {
            error: {
                description: "Error occurred while fetching FAPI configurations.",
                message: "Error occurred"
            }
        },
        updateConfig: {
            error: {
                description: "Error occurred while updating FAPI security policy configurations.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully updated the FAPI security policy configurations.",
                message: "Updated successfully"
            }
        }
    },
    title: "FAPI Security Policy"
};
