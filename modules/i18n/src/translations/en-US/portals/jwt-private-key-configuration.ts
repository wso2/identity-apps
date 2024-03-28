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
import { jwtPrivateKeyConfigurationNS } from "../../../models";

export const jwtPrivateKeyConfiguration: jwtPrivateKeyConfigurationNS = {
    fetchValidationConfigData: {
        error: {
            description: "{{description}}",
            message: "Retrieval error"
        },
        genericError: {
            description: "Impossible de récupérer les données de configuration de l'authentificateur de clé privée jwt.",
            message: "Something went wrong"
        }
    },
    notifications: {
        error: {
            description: "{{description}}",
            message: "Update error"
        },
        genericError: {
            description: "Failed to update jwt private-key authenticator configuration.",
            message: "Something went wrong"
        },
        success: {
            description: "Successfully updated jwt private-key authenticator configuration.",
            message: "Update successful"
        }
    },
    pageTitle: "Private Key JWT Client Authentication for OIDC",
    description: "Authenticate confidential clients to the authorization server when using the token endpoint.",
    goBackToApplication: "Go back to application",
    goBackToAccountSecurityConfig: "Go back to Account Security",
    messageInfo: "If enabled, the JWT can be reused again within its expiration period. JTI (JWT ID) is a claim that provides a unique identifier for the JWT.",
    tokenReuseEnabled: "Token Reuse Enabled",
    tokenReuseDisabled: "Token Reuse Disabled"
}
