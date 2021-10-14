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

import { DisplayCertificate } from "../models";

/**
 * Class containing certificate related constants which can be used across several applications.
 */
export class CertificateManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     * @hideConstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

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

    /**
     * Denotes "Not Available"
     */
    public static readonly NOT_AVAILABLE = "N/A";

    /**
     * An empty string. Used in case DN or issuers are empty.
     */
    public static readonly EMPTY_STRING = "";

    /**
     * Used for unreadable certificates avatar name.
     */
    public static readonly QUESTION_MARK = "?";

    /**
     * Used in between intermediate strings in cert interfaces.
     */
    public static readonly SPACE_CHARACTER = " ";

    /**
     * An empty pass.
     * @constructor
     */
    public static readonly NO_OPERATIONS = (): void => void 0;

    /**
     * Dummy certificate as a placeholder.
     */
    public static readonly DUMMY_DISPLAY_CERTIFICATE: DisplayCertificate = {
        alias: CertificateManagementConstants.NOT_AVAILABLE,
        infoUnavailable: true,
        issuerDN: [],
        serialNumber: CertificateManagementConstants.NOT_AVAILABLE,
        subjectDN: [],
        validFrom: new Date(),
        validTill: new Date(),
        version: 0
    };

    /**
     * Supported key algorithm types.
     * {@link https://www.npmjs.com/package/node-forge#pki}
     */
    public static readonly SUPPORTED_KEY_ALGORITHMS: string[] = [
        "ED25519",
        "RSA",
        "RSA-KEM",
        "X.509",
        "PKCS#5",
        "PKCS#7",
        "PKCS#8",
        "PKCS#10",
        "PKCS#12",
        "ASN.1"
    ];

}
