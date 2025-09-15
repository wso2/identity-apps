/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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
import { Saml2ConfigNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const saml2Config: Saml2ConfigNS = {
    title: "SAML2 Web SSO Configuration",
    description: "Configure SAML2 Web SSO for your applications.",
    form: {
        metadataValidityPeriod: {
            hint: "Set the SAML metadata validity period in minutes.",
            label: "Metadata Validity Period"
        },
        destinationUrl: {
            hint: "The location to send the SAML Response, as defined in the SAML assertion.",
            label: "Destination URLs"
        },
        enableMetadataSigning: {
            label: "Enable Metadata Signing"
        },
        validation: {
            metadataValidityPeriod: "Metadata validity period should be a positive integer.",
            destinationURLs: "Destination URL should be a valid URL."
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Error occurred while fetching saml2 configurations.",
                message: "Error occurred"
            }
        },
        revertConfiguration: {
            error: {
                message: "Error occurred",
                description: "Error occurred while reverting saml2 configurations."
            },
            success: {
                message: "Revert successful",
                description: "Successfully reverted the saml2 configurations."
            }
        },
        updateConfiguration: {
            error: {
                description: "Error occurred while updating saml2 configurations.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully updated the saml2 configurations.",
                message: "Update successful"
            }
        }
    }
};
