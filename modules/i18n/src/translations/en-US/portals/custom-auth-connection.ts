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

import { customAuthConnectionNS } from "../../../models";

export const customAuthentication: customAuthConnectionNS = {
    fields: {
        createWizard: {
            authenticationTypeStep: {
                cardExternalAuthentication: {
                    examples: "Eg: Social Login, Enterprise IdP",
                    header: "External (Federated) User Authentication",
                    mainDescription: "Authenticate and provision federated users."
                },
                cardInternalUserAuthentication: {
                    examples: "Eg: Username & Password, Email OTP",
                    header: "Internal User Authentication",
                    mainDescription: "Collect identifier and authenticate user accounts managed in the organization."
                },
                label: "Select the authentication type you are implementing",
                twoFactorAuthentication: {
                    examples: "Eg: TOTP",
                    header: "2FA Authentication",
                    mainDescription: "Only verify users in a second or later step in the login flow."
                }
            }
        }
    }
};
