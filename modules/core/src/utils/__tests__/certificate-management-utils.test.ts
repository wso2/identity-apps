/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import * as forge from "node-forge";
import { CertificateManagementUtils } from "../certificate-management-utils";

jest.mock("node-forge", () => ({
    pki: {
        certificateFromPem: jest.fn()
    }
}));

describe("CertificateManagementUtils", (): void => {

    // Valid PEM certificate format.
    const validPemCertificate: string = `-----BEGIN CERTIFICATE-----
        MIIFaDCCBFCgAwIBAgISESHkvZFwK9Qz0KsXD3x8p44aMA0GCSqGSIb3DQEBCwUA
        MEoxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MSMwIQYDVQQD
        ExpMZXQncyBFbmNyeXB0IEF1dGhvcml0eSBYMzAeFw0yMDEyMDgwNzQ4NDFaFw0y
        iTAzMDgwNzQ4NDFaMBYxFDASBgNVBAMTC2V4YW1wbGUuY29tMIIBIjANBgkqhkiG
        9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw8bKrLJWZKbT8KiL6h4=
        -----END CERTIFICATE-----`;

    // Base64 encoded version of a valid PEM certificate.
    const base64EncodedCertificate: string = btoa(validPemCertificate);

    // Invalid certificate content.
    const invalidCertificate: string = "invalid-certificate-content";

    const mockCertificateFromPem: jest.MockedFunction<typeof forge.pki.certificateFromPem> =
        forge.pki.certificateFromPem as jest.MockedFunction<typeof forge.pki.certificateFromPem>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("canSafelyParseCertificate", (): void => {
        it("should return false for empty certificate", (): void => {
            const result: boolean = CertificateManagementUtils.canSafelyParseCertificate("");

            expect(result).toBe(false);
        });

        it("should return false for null certificate", (): void => {
            const result: boolean = CertificateManagementUtils.canSafelyParseCertificate(null as any);

            expect(result).toBe(false);
        });

        it("should return false for undefined certificate", (): void => {
            const result: boolean = CertificateManagementUtils.canSafelyParseCertificate(undefined as any);

            expect(result).toBe(false);
        });

        it("should return false for invalid certificate content", (): void => {
            // Mock certificate parsing failure
            mockCertificateFromPem.mockImplementation(() => {
                throw new Error("Invalid certificate");
            });

            const result: boolean = CertificateManagementUtils.canSafelyParseCertificate(invalidCertificate);

            expect(result).toBe(false);
        });

        it("should return false for certificate without proper PEM headers", (): void => {
            const certificateWithoutHeaders: string =
                "MIIFaDCCBFCgAwIBAgISESHkvZFwK9Qz0KsXD3x8p44aMA0GCSqGSIb3DQEBCwUA";
            const result: boolean = CertificateManagementUtils.canSafelyParseCertificate(
                certificateWithoutHeaders,
                false
            );

            expect(result).toBe(false);
        });

        it("should return false for Base64 encoded certificate when isBase64Encoded is false", (): void => {
            const result: boolean = CertificateManagementUtils.canSafelyParseCertificate(
                base64EncodedCertificate,
                false
            );

            expect(result).toBe(false);
        });

        it("should return true for valid PEM certificate with BEGIN/END headers", (): void => {
            // Mock successful certificate parsing
            mockCertificateFromPem.mockReturnValue({} as any);

            const result: boolean = CertificateManagementUtils.canSafelyParseCertificate(validPemCertificate);

            expect(result).toBe(true);
            expect(mockCertificateFromPem).toHaveBeenCalledTimes(1);
        });

        it("should return true for valid Base64 encoded certificate", (): void => {
            // Mock successful certificate parsing
            mockCertificateFromPem.mockReturnValue({} as any);

            const result: boolean = CertificateManagementUtils.canSafelyParseCertificate(
                base64EncodedCertificate,
                true
            );

            expect(result).toBe(true);
            expect(mockCertificateFromPem).toHaveBeenCalledTimes(1);
        });
    });
});
