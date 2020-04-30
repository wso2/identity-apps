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

/**
 * This function calculate the number of days since the last
 * modified date to the current date.
 *
 * @param modifiedDate - Data string that needs to be calculated.
 */

import moment from "moment"
import * as forge from "node-forge";
import { CERTIFICATE_BEGIN, CERTIFICATE_END, END_LINE } from "../constants";
import { DisplayCertificate } from "../models";

/**
 * Class containing common utility methods used
 * throuought the application.
 *
 */
export class CommonUtils {

    /**
     * A util method to humanize the last modified date.
     *
     * @param date - Date string which needs to be humanize
     */
    static humanizeDateDifference = (date: string): string => {
        const now = moment(new Date());
        const recievedDate = moment(date);
        return "Last modified " + moment.duration(now.diff(recievedDate)).humanize() + " ago";
    };

    /**
     * Decodes the pem value.
     *
     * @param pem Pem value to be decoded.
     */
    public static decodeCertificate = (pem: string): forge.pki.Certificate => {
        const pemValue = pem.split("\n");

        // appends -----END CERTIFICATE-----.
        pemValue.push(CERTIFICATE_END);

        // appends a new line.
        pemValue.push(END_LINE);

        // pushes -----BEGIN CERTIFICATE----- to the top.
        pemValue.unshift(CERTIFICATE_BEGIN);

        const pemCert = pemValue.join("\n");

        try {
            const certificateForge = forge.pki
                .certificateFromPem(pemCert);

            return certificateForge;
        } catch (e) {

            return null
        }
    };

    /**
     * Decode the pem details and show in the DisplayCertificate format.
     *
     * @param pem Pem value to be decoded.
     */
    public static displayCertificate = (pem: string): DisplayCertificate => {

        const certificateForge = CommonUtils.decodeCertificate(pem);
        if (certificateForge) {
            const displayCertificate: DisplayCertificate = {
                issuerDN: certificateForge.issuer.attributes
                    .map(attribute => {
                        return {
                            [attribute.shortName]: attribute.value
                        }
                    }),
                serialNumber: certificateForge.serialNumber,
                subjectDN: certificateForge.subject.attributes
                    .map(attribute => {
                        return {
                            [attribute.shortName]: attribute.value
                        }
                    }),
                validFrom: certificateForge.validity.notBefore,
                validTill: certificateForge.validity.notAfter,
                version: certificateForge.version
            };

            return displayCertificate;
        }
        return null;
    };

}
