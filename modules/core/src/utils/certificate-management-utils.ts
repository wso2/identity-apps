/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { saveAs } from "file-saver";
import * as forge from "node-forge";
import { CertificateManagementConstants } from "../constants";
import { Certificate, CertificateValidity, DisplayCertificate } from "../models";

dayjs.extend(duration);
dayjs.extend(relativeTime);

/**
 * Utility class for certificate management operations.
 */
export class CertificateManagementUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Converts a PEM encoded string to a Forge certificate object.
     *
     * @param pem - The PEM encoded certificate content.
     * @returns The Forge Certificate object.
     */
    public static decodeCertificate(pem: string): forge.pki.Certificate {

        // Check if the certificate content is base 64 encoded.
        const base64DecodedCert: string | null = this.getBase64DecodedCertificate(pem);

        if (base64DecodedCert !== null) {
            if (base64DecodedCert.startsWith(CertificateManagementConstants.CERTIFICATE_BEGIN)) {
                return forge.pki.certificateFromPem(base64DecodedCert);
            }
        }

        const pemValue: string[] | undefined = pem?.split("\n");

        // appends -----END CERTIFICATE-----.
        pemValue?.push(CertificateManagementConstants.CERTIFICATE_END);

        // appends a new line.
        pemValue?.push(CertificateManagementConstants.END_LINE);

        // pushes -----BEGIN CERTIFICATE----- to the top.
        pemValue?.unshift(CertificateManagementConstants.CERTIFICATE_BEGIN);

        const pemCert: string | undefined = pemValue?.join("\n");

        try {
            return forge.pki.certificateFromPem(pemCert);
        } catch (e) {
            return null;
        }
    }

    /**
     * Validates if a certificate string can be parsed safely.
     * Supports both PEM formatted certificates (with BEGIN/END headers) and Base64 encoded certificates.
     *
     * @param pemCert - The certificate string to validate.
     * @param isBase64Encoded - Whether to attempt Base64 decoding (default: true).
     * @returns True if the certificate can be safely parsed, false otherwise.
     */
    public static canSafelyParseCertificate(pemCert: string, isBase64Encoded: boolean = true): boolean {
        if (!pemCert) {
            return false;
        }

        let certificateToParse: string = pemCert;

        // Check if the certificate is already in PEM format (has BEGIN/END headers).
        if (pemCert.includes(CertificateManagementConstants.CERTIFICATE_BEGIN)
            && pemCert.includes(CertificateManagementConstants.END_LINE)) {
            certificateToParse = pemCert;
        } else if (isBase64Encoded) {
            const decodedCert: string = this.getBase64DecodedCertificate(pemCert);

            if (decodedCert) {
                certificateToParse = decodedCert;
            } else {
                certificateToParse = pemCert;
            }
        }

        try {
            forge.pki.certificateFromPem(certificateToParse);

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * This serializes the certificate content to a displayable format.
     *
     * @param certificate - The Certificate object returned by the API endpoints.
     * @param pem - The PEM encoded certificate content.
     * @returns The displayable certificate object.
     */
    public static displayCertificate(certificate: Certificate = null, pem: string): DisplayCertificate {

        const certificateForge: forge.pki.Certificate = CertificateManagementUtils.decodeCertificate(pem);

        if (certificateForge) {
            return {
                alias: certificate ? certificate.alias : null,
                issuerDN: certificateForge.issuer.attributes
                    .map((attribute: any) => {
                        return {
                            [ attribute.shortName ]: attribute.value
                        };
                    }),
                serialNumber: certificateForge.serialNumber,
                subjectDN: certificateForge.subject.attributes
                    .map((attribute: any) => {
                        return {
                            [ attribute.shortName ]: attribute.value
                        };
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
     * @param data - The data object containing the alias and the PEM string.
     * @param certificateForge - The Forge Certificate object.
     * @returns The displayable certificate object.
     */
    public  static decodeForgeCertificate(data: Certificate, certificateForge: forge.pki.Certificate):
        DisplayCertificate {

        return {
            alias: data.alias,
            issuerDN: certificateForge.issuer.attributes
                .map((attribute: any) => {
                    return {
                        [ attribute.shortName ]: attribute.value
                    };
                }),
            serialNumber: certificateForge.serialNumber,
            subjectDN: certificateForge.subject.attributes
                .map((attribute: any) => {
                    return {
                        [ attribute.shortName ]: attribute.value
                    };
                }),
            validFrom: certificateForge.validity.notBefore,
            validTill: certificateForge.validity.notAfter,
            version: certificateForge.version
        };
    }

    /**
     * The following function search the issuerDN array and return a alias for the issuer.
     *
     * @param issuerDN - The issuer DN array to search through.
     * @returns The issuer alias string.
     */
    public static searchIssuerDNAlias(issuerDN: object[]): string {

        if (!issuerDN || issuerDN.length === 0)
            return CertificateManagementConstants.NOT_AVAILABLE;

        let issuerAlias: string = "";

        issuerDN.map((issuer: any) => {
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
     * @param name - The alias of the certificate.
     * @param pem - The PEM encoded certificate content.
     */
    public static exportCertificate(name: string, pem: string) {
        const certificate: forge.pki.Certificate = CertificateManagementUtils.decodeCertificate(pem);

        const der: forge.util.ByteStringBuffer = forge.asn1.toDer(
            forge.pki.certificateToAsn1(certificate)
        );

        const intArray: number[] = der.data.split("").map((char: string) => {
            return char.charCodeAt(0);
        });

        const buffer: ArrayBuffer = new Uint8Array(intArray).buffer;

        const blob: Blob = new Blob([ buffer ], {
            type: "application/x-x509-ca-cert"
        });

        saveAs(blob, name + ".cer");
    }

    /**
     * This strips **BEGIN CERTIFICATE** and **END CERTIFICATE** parts from
     * the PEM encoded string.
     *
     * @param pemString - The PEM-encoded content of a certificate.
     * @returns The PEM string without the **BEGIN CERTIFICATE** and **END CERTIFICATE** parts.
     */
    public static stripPem (pemString: string): string {

        const pemValue: string[] = pemString.split("\n");

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
     * @param pemString - The stripped PEM string (usually received as from an API call)
     * @returns A full PEM string.
     */
    public static enclosePem (pemString: string): string {

        const pemValue: string[] = pemString.split("\n");

        // adds -----BEGIN CERTIFICATE----- if not present.
        !pemValue[ 0 ]?.includes(CertificateManagementConstants.CERTIFICATE_BEGIN)
        && pemValue.unshift(CertificateManagementConstants.CERTIFICATE_BEGIN);

        // adds "\n" if not present.
        !(pemValue[ pemValue.length - 1 ] === CertificateManagementConstants.END_LINE)
        && pemValue.push(CertificateManagementConstants.END_LINE);

        // adds -----END CERTIFICATE----- if not present.
        if (!pemValue[ pemValue.length - 2 ]?.includes(CertificateManagementConstants.CERTIFICATE_END)) {
            const lastLine: string | undefined = pemValue.pop();

            pemValue.push(CertificateManagementConstants.CERTIFICATE_END);
            pemValue.push(lastLine);
        }

        return pemValue.join("\n");
    }

    /**
     * Get validity period of a certificate in human readable format.
     *
     * @param validFrom - The certificate's valid from date.
     * @param validTill - The certificate's valid till date.
     * @returns The validity period description.
     */
    public static getValidityPeriodInHumanReadableFormat(validFrom: Date, validTill: Date): string {

        const isValid: boolean = new Date() >= validFrom && new Date() <= validTill;
        const now: Dayjs = dayjs(new Date());
        const receivedDate: Dayjs = dayjs(validTill);

        let description: string;

        if (isValid) {
            description = "Valid for " + dayjs.duration(now.diff(receivedDate)).humanize();
        } else {
            description = "Expired " + dayjs.duration(now.diff(receivedDate)).humanize() + " ago";
        }

        return description;
    }

    /**
     * Returns the validity of a certificate.
     *
     * @param from - The start date of validity.
     * @param to - The end date of validity.
     * @returns The certificate validity state.
     * @public
     */
    public static determineCertificateValidityState({ from, to }: { from: Date; to: Date; }): CertificateValidity {

        const _now: Dayjs = dayjs(new Date());
        const _from: Dayjs = dayjs(from);
        const _to: Dayjs = dayjs(to);

        const isValid: boolean = _now.isAfter(_from) && _now.isBefore(_to);

        if (isValid) {
            if (_now.diff(_to, "minute") < 0 && _now.diff(_to, "year") >= -1) {
                return CertificateValidity.WILL_EXPIRE_SOON;
            } else if (_now.diff(_to, "minute") < 0) {
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
     * @param certContent - The certificate content to be base 64 decoded.
     * @returns The decoded certificate content or null if invalid.
     */
    private static getBase64DecodedCertificate(certContent: string) : string {
        try {
            return atob(certContent);
        } catch (e) {
            return null;
        }
    }
}
