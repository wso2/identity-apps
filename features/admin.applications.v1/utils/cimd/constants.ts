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

/**
 * Constants for OAuth Client ID Metadata Document (CIMD) clients.
 */
export class CimdConstants {

    private constructor() { }

    public static readonly CALLBACK_URL_REGEXP_PREFIX: string = "regexp=";

    public static readonly IPV4_LOOPBACK_PREFIX: string = "http://127.0.0.1";

    /**
     * Longest Client Identifier URL IS can store as a client ID, in UTF-8 bytes.
     */
    public static readonly MAX_CLIENT_ID_BYTES: number = 255;
}
