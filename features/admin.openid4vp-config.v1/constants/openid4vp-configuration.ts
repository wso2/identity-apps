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

import { IdentityAppsError } from "@wso2is/core/errors";

export class OpenID4VPConfigConstants {
           private constructor() {}

           public static readonly OPENID4VP_CONFIG_FETCH_ERROR_CODE: string = "OID4VP-00001";
           public static readonly OPENID4VP_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: string = "OID4VP-00002";
           public static readonly OPENID4VP_CONFIG_UPDATE_ERROR_CODE: string = "OID4VP-00003";
           public static readonly OPENID4VP_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR_CODE: string = "OID4VP-00004";

           public static readonly CLIENT_ID_SCHEME_OPTIONS: { key: string; text: string; value: string }[] = [
               { key: "redirect_uri", text: "redirect_uri", value: "redirect_uri" },
               { key: "x509_san_dns", text: "x509_san_dns", value: "x509_san_dns" },
               { key: "x509_hash", text: "x509_hash", value: "x509_hash" }
           ];

           public static ErrorMessages: {
               OPENID4VP_CONFIG_FETCH_ERROR_CODE: IdentityAppsError;
               OPENID4VP_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: IdentityAppsError;
               OPENID4VP_CONFIG_UPDATE_ERROR_CODE: IdentityAppsError;
               OPENID4VP_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR_CODE: IdentityAppsError;
           } = {
               OPENID4VP_CONFIG_FETCH_ERROR_CODE: new IdentityAppsError(
                   OpenID4VPConfigConstants.OPENID4VP_CONFIG_FETCH_ERROR_CODE,
                   "An error occurred while fetching the OpenID4VP configurations.",
                   "Error while fetching the OpenID4VP configurations",
                   null
               ),
               OPENID4VP_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: new IdentityAppsError(
                   OpenID4VPConfigConstants.OPENID4VP_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE,
                   "Received an invalid status code while fetching the OpenID4VP configurations.",
                   "Invalid Status Code while fetching the OpenID4VP configurations",
                   null
               ),
               OPENID4VP_CONFIG_UPDATE_ERROR_CODE: new IdentityAppsError(
                   OpenID4VPConfigConstants.OPENID4VP_CONFIG_UPDATE_ERROR_CODE,
                   "An error occurred while updating the OpenID4VP configurations.",
                   "Error while updating the OpenID4VP configurations",
                   null
               ),
               OPENID4VP_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR_CODE: new IdentityAppsError(
                   OpenID4VPConfigConstants.OPENID4VP_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR_CODE,
                   "Received an invalid status code while updating the OpenID4VP configurations.",
                   "Invalid Status Code while updating the OpenID4VP configurations",
                   null
               )
           };
       }
