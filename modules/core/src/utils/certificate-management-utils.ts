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

import { saveAs } from "file-saver";
import * as forge from "node-forge";
import { CertificateManagementConstants } from "../constants";
import { Certificate, CertificateValidity, DisplayCertificate } from "../models";
import moment from "moment";

/**
 * Utility class for certificate management operations.
 */
export class CertificateManagementUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Converts a PEM encoded string to a Forge certificate object.
     *
     * @param {string} pem The PEM encoded certificate content.
     *
     * @returns {forge.pki.Certificate} The Forge Certificate object.
     */
    public static decodeCertificate(pem: string): forge.pki.Certificate {

        // Check if the certificate content is base 64 encoded.
        const base64DecodedCert = this.getBase64DecodedCertificate(pem);
        if (base64DecodedCert !== null) {
            if (base64DecodedCert.startsWith(CertificateManagementConstants.CERTIFICATE_BEGIN)) {
                return forge.pki.certificateFromPem(base64DecodedCert);
            }
        }

        const pemValue = pem?.split("\n");

        // appends -----END CERTIFICATE-----.
        pemValue?.push(CertificateManagementConstants.CERTIFICATE_END);

        // appends a new line.
        pemValue?.push(CertificateManagementConstants.END_LINE);

        // pushes -----BEGIN CERTIFICATE----- to the top.
        pemValue?.unshift(CertificateManagementConstants.CERTIFICATE_BEGIN);

        const pemCert = pemValue?.join("\n");

        try {
            return forge.pki.certificateFromPem(pemCert);
        } catch (e) {
            return null;
        }
    }

    /**
     * decodeCertificate|displayCertificate|decodeForgeCertificate|searchIssuerDNAlias|exportCertificate
     * @param pemCert
     * @param isBase64Encoded
     */
    public static canSafelyParseCertificate(pemCert: string, isBase64Encoded: boolean = true): boolean {
        if (isBase64Encoded) {
            pemCert = this.getBase64DecodedCertificate(pemCert);
        }
        if (!pemCert) return false;
        try {
            forge.pki.certificateFromPem(pemCert);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * This serializes the certificate content to a displayable format.
     *
     * @param {Certificate} certificate The Certificate object returned by teh API endpoints.
     * @param {string} pem The PEM encoded certificate content.
     * @return {DisplayCertificate}
     */
    public static displayCertificate(certificate: Certificate = null, pem: string): DisplayCertificate {

        const certificateForge = CertificateManagementUtils.decodeCertificate(pem);

        if (certificateForge) {
            return {
                alias: certificate ? certificate.alias : null,
                issuerDN: certificateForge.issuer.attributes
                    .map(attribute => {
                        return {
                            [ attribute.shortName ]: attribute.value
                        }
                    }),
                serialNumber: certificateForge.serialNumber,
                subjectDN: certificateForge.subject.attributes
                    .map(attribute => {
                        return {
                            [ attribute.shortName ]: attribute.value
                        }
                    }),
                validFrom: certificateForge.validity.notBefore,
                validTill: certificateForge.validity.notAfter,
                version: certificateForge.version
            };
        }

        return null;
    }

    /**
     * This serializes the certificate object.
     *
     * @param {Certificate} data The data object containing the alias and the PEM string.
     * @param {forge.pki.Certificate} certificateForge The Forge Certificate object.
     */
    public  static decodeForgeCertificate(data: Certificate, certificateForge: forge.pki.Certificate):
        DisplayCertificate {

        return {
           alias: data.alias,
           issuerDN: certificateForge.issuer.attributes
               .map(attribute => {
                   return {
                       [ attribute.shortName ]: attribute.value
                   }
               }),
           serialNumber: certificateForge.serialNumber,
           subjectDN: certificateForge.subject.attributes
               .map(attribute => {
                   return {
                       [ attribute.shortName ]: attribute.value
                   }
               }),
           validFrom: certificateForge.validity.notBefore,
           validTill: certificateForge.validity.notAfter,
           version: certificateForge.version
       };
    }

    /**
     * The following function search the issuerDN array and return a alias for the issuer.
     *
     * @param issuerDN
     */
    public static searchIssuerDNAlias(issuerDN: object[]): string {

        if (!issuerDN || issuerDN.length === 0)
            return CertificateManagementConstants.NOT_AVAILABLE;

        let issuerAlias = "";
        issuerDN.map((issuer) => {
            if (Object.prototype.hasOwnProperty.call(issuer, "CN")) {
                issuerAlias = issuer["CN"];
                return;
            } else if (Object.prototype.hasOwnProperty.call(issuer, "O")) {
                issuerAlias = issuer["O"];
                return;
            }
        });

        return issuerAlias;
    }

    /**
     * This converts a PEM-encoded certificate to a
     * DER encoded ASN.1 certificate and saves it to the disk.
     *
     * ```
     * const intArray = der.data.split("").map(char => {
            return char.charCodeAt(0);
        });
     * ```
     * The `ByteStringBuffer` that holds the DER encoded
     * string actually has `UTF-16` encoded string values.
     *
     * The above code snippet is used to decode the `UTF-16` string.
     *
     * @param {string} name The alias of the certificate.
     * @param {string} pem The PEM encoded certificate content.
     */
    public static exportCertificate(name: string, pem: string) {
        const certificate = CertificateManagementUtils.decodeCertificate(pem);

        const der = forge.asn1.toDer(
            forge.pki.certificateToAsn1(certificate)
        );

        const intArray = der.data.split("").map(char => {
            return char.charCodeAt(0);
        });

        const buffer = new Uint8Array(intArray).buffer;

        const blob = new Blob([ buffer ], {
            type: "application/x-x509-ca-cert"
        });

        saveAs(blob, name + ".cer");
    }

    /**
     * This strips **BEGIN CERTIFICATE** and **END CERTIFICATE** parts from
     * the PEM encoded string.
     *
     * @param {string} pemString The PEM-encoded content of a certificate.
     *
     * @returns {string} The PEM string without the **BEGIN CERTIFICATE** and **END CERTIFICATE** parts.
     */
    public static stripPem (pemString: string): string {

        const pemValue = pemString.split("\n");

        // removes -----BEGIN CERTIFICATE----- if present.
        pemValue[ 0 ]?.includes(CertificateManagementConstants.CERTIFICATE_BEGIN) && pemValue.shift();

        // removes "\n" if present.
        pemValue[ pemValue.length - 1 ] === CertificateManagementConstants.END_LINE
        && pemValue.pop();

        // removes -----END CERTIFICATE----- if present.
        pemValue[ pemValue.length - 1 ]?.includes(CertificateManagementConstants.CERTIFICATE_END)
        && pemValue.pop();
        return pemValue.join("\n");
    }

    /**
     * This encloses a stripped PEM string with **BEGIN CERTIFICATE** and **END CERTIFICATE**.
     *
     * @param {string} pemString The stripped PEM string (usually received as from an API call)
     *
     * @returns {string} A full PEM string.
     */
    public static enclosePem (pemString: string): string {

        const pemValue = pemString.split("\n");

        // adds -----BEGIN CERTIFICATE----- if not present.
        !pemValue[ 0 ]?.includes(CertificateManagementConstants.CERTIFICATE_BEGIN)
        && pemValue.unshift(CertificateManagementConstants.CERTIFICATE_BEGIN);

        // adds "\n" if not present.
        !(pemValue[ pemValue.length - 1 ] === CertificateManagementConstants.END_LINE)
        && pemValue.push(CertificateManagementConstants.END_LINE);

        // adds -----END CERTIFICATE----- if not present.
        if (!pemValue[ pemValue.length - 2 ]?.includes(CertificateManagementConstants.CERTIFICATE_END)) {
            const lastLine = pemValue.pop();
            pemValue.push(CertificateManagementConstants.CERTIFICATE_END);
            pemValue.push(lastLine);
        }
        return pemValue.join("\n");
    }

    /**
     * Get validity period of a certificate in human readable format.
     * @param validFrom {Date}
     * @param validTill {Date}
     */
    public static getValidityPeriodInHumanReadableFormat(validFrom: Date, validTill: Date): string {

        const isValid = new Date() >= validFrom && new Date() <= validTill;
        const now = moment(new Date());
        const receivedDate = moment(validTill);

        let description;
        if (isValid) {
            description = "Valid for " + moment.duration(now.diff(receivedDate)).humanize();
        } else {
            description = "Expired " + moment.duration(now.diff(receivedDate)).humanize() + " ago";
        }

        return description;
    }

    /**
     * Returns the validity of a certificate.
     * @param from {Date}
     * @param to {Date}
     * @public
     */
    public static determineCertificateValidityState({ from, to }: { from: Date; to: Date; }): CertificateValidity {

        const _now = moment(new Date());
        const _from = moment(from);
        const _to = moment(to);

        const isValid = _now.isAfter(_from) && _now.isBefore(_to);

        if (isValid) {
            if (_now.diff(_to, 'minute') < 0 && _now.diff(_to, 'year') >= -1) {
                return CertificateValidity.WILL_EXPIRE_SOON;
            } else if (_now.diff(_to, 'minute') < 0) {
                return CertificateValidity.VALID;
            } else {
                return CertificateValidity.EXPIRED;
            }
        } else {
            return CertificateValidity.EXPIRED;
        }

    }

    /**
     * Base 64 decodes the certificate content. If not a valid base 64 content, returns null.
     *
     * @param {string} certContent to be base 64 decoded.
     */
    private static getBase64DecodedCertificate(certContent: string) : string {
        try {
            return atob(certContent);
        } catch (e) {
            return null;
        }
    }
}
