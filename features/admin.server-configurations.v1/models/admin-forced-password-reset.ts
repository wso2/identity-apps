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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GovernanceConnectorInterface } from "../models/governance-connectors";

/**
 * Interface for admin forced password reset form props.
 */
export interface AdminForcedPasswordResetFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Connector's initial values.
     */
    initialValues: GovernanceConnectorInterface;
    /**
     * Callback for form submit.
     *
     * @param values - Resolved Form Values.
     */
    onSubmit: (values) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Whether the connector is enabled using the toggle button.
     */
    isConnectorEnabled?: boolean;
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}

/**
 * Form initial values interface.
 */
export interface AdminForcedPasswordResetFormValuesInterface {
    /**
     * Force password link/otp expiry time.
     */
    expiryTime: string;
    /**
     * Wether email link based force password reset is enabled.
     */
    enableEmailLink: boolean;
    /**
     * Whether email otp based force password reset is enabled.
     */
    enableEmailOtp: boolean;
}

export interface AdminForcedPasswordResetFormUpdatableConfigInterface {
    /**
     * Enable email link based forced password reset.
     */
    "Recovery.AdminPasswordReset.RecoveryLink": boolean;
    /**
     * Enable email OTP based forced password reset.
     */
    "Recovery.AdminPasswordReset.OTP": boolean;
    /**
     * Expiry time of force password link/OTP.
     */
    "Recovery.AdminPasswordReset.ExpiryTime": number;
}

export enum AdminForcedPasswordResetOption {
    EMAIL_LINK = "emailLink",
    EMAIL_OTP = "emailOTP",
}
