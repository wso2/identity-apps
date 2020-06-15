/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the 'License'); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Class containing certificate related constants which can be used across several applications.
 */
export class CertificateManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
    }

    /**
     * Contains the terminating line of a PEM certificate.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly CERTIFICATE_END: string = "-----END CERTIFICATE-----";

    /**
     * Contains the first line of a PEM certificate.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly CERTIFICATE_BEGIN: string = "-----BEGIN CERTIFICATE-----";

    /**
     * Contains the first line of a PEM certificate.
     * @constant
     * @type {string}
     */
    public static readonly END_LINE: string = "";
}
