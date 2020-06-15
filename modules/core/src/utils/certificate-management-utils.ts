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

import * as forge from "node-forge";
import { CertificateManagementConstants } from "../constants";
import { Certificate, DisplayCertificate } from "../models";

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
            return null
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
}
