/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

export class ConsentConstants {

    public static readonly EMPTY_STRING = "";
    public static readonly PLACEHOLDER_RECEIPT_ID = "resident-idp-placeholder-receipt-id";
    public static readonly COLLECTION_METHOD: string = "Web Form - My Account";
    public static readonly SERVICE_DISPLAY_NAME: string = "Resident IDP";
    public static readonly SERVICE_DESCRIPTION: string = "Resident IDP";
    public static readonly RECEIPT_ACTIVE_STATE: string = "ACTIVE";
    public static readonly RECEIPT_REVOKED_STATE: string = "REVOKED";
    public static readonly DEFAULT_CONSENT = "DEFAULT";
    public static readonly CONSENT_TYPE = "EXPLICIT";
    public static readonly TERMINATION = "DATE_UNTIL:INDEFINITE";

}
