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
           description: "Configure the OpenID for Verifiable Presentations (OpenID4VP) settings for this tenant.",
           form: {
               clientIdScheme: {
                   hint:
                       "Specifies how the verifier identifies itself to the wallet during a VP request. Defaults to the x509_hash client ID scheme.",
                   label: "Client ID Scheme",
                   placeholder: "Select a client ID scheme"
               },
               clientId: {
                   hint:
                       "Override the client identifier sent in VP requests. Leave blank to auto-derive " +
                       "from the selected client ID scheme.",
                   label: "Client ID (optional)",
                   placeholder: "Auto-derived from the selected client ID scheme if left blank"
               },
               responseMode: {
                   directPost: {
                       hint: "Submits the VP response as plain JSON over HTTPS POST. No response encryption."
                   },
                   directPostJwt: {
                       hint: "Submits the VP response as an encrypted JWT over HTTPS POST. " +
                           "Provides confidentiality for the response content."
                   },
                   hint:
                       "How the wallet submits the VP response. Use direct_post.jwt for " +
                       "response encryption; direct_post for plain JSON.",
                   label: "Response Mode"
               },
               registrationCert: {
                   dropzoneText: "Drag and drop a file containing the registration certificate JWT here.",
                   hint:
                       "A JWT-encoded registration attestation (rc-wrp+jwt) issued by a trust anchor. " +
                       "Paste the JWT string or upload a file containing it. Leave blank if not applicable.",
                   label: "Registration Certificate JWT (optional)",
                   placeholder: "Paste the rc-wrp+jwt string here",
                   uploadButtonText: "Upload JWT File"
               },
               revocation: {
                   rejectVcWithoutStatusClaim: {
                       hint:
                           "When enabled, credentials that do not include a status claim are rejected " +
                           "during verification. Disable to allow credentials issued without revocation support.",
                       label: "Reject credentials without a status claim"
                   },
                   sectionTitle: "Revocation"
               }
           },
           notifications: {
               getConfiguration: {
                   error: {
                       description: "An error occurred while retrieving the OpenID4VP configuration.",
                       message: "Retrieval Error"
                   }
               },
               updateConfiguration: {
                   error: {
                       description: "An error occurred while updating the OpenID4VP configuration.",
                       message: "Update Error"
                   },
                   success: {
                       description: "OpenID4VP configuration updated successfully.",
                       message: "Update Successful"
                   }
               }
           },
           title: "OpenID4VP Configuration"
       };
