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

import { OpenID4VPConfigNS } from "../../../models/namespaces/openid4vp-ns";

export const openid4vp: OpenID4VPConfigNS = {
           description: "Manage how your organization requests and verifies credentials from digital wallets.",
           goBack: "Go back to Presentation Definitions",
           form: {
               clientIdScheme: {
                   hint:
                       "Specifies how the verifier identifies itself to the wallet during a VP request. Defaults to the x509_hash client ID scheme.",
                   label: "Client ID Scheme",
                   placeholder: "Select a client ID scheme"
               },
               responseMode: {
                   directPost: {
                       hint: "Submits the verifiable credential as plain JSON over HTTPS POST. No response encryption."
                   },
                   directPostJwt: {
                       hint: "Submits the verifiable credential as an encrypted JWT over HTTPS POST. " +
                           "Provides confidentiality for the response content."
                   },
                   hint:
                       "How the wallet submits the verifiable credential. Use direct_post.jwt for " +
                       "response encryption; direct_post for plain JSON.",
                   label: "Response Mode"
               },
           },
           notifications: {
               getConfiguration: {
                   error: {
                       description: "An error occurred while retrieving the verifiable presentation configuration.",
                       message: "Retrieval Error"
                   }
               },
               updateConfiguration: {
                   error: {
                       description: "An error occurred while updating the verifiable presentation configuration.",
                       message: "Update Error"
                   },
                   success: {
                       description: "Verifiable presentation configuration updated successfully.",
                       message: "Update Successful"
                   }
               }
           },
           title: "Verifiable Presentation Settings"
       };
