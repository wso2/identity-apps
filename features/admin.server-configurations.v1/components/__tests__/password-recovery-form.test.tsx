/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "../../../test-configs/utils";

import { PasswordRecoveryConfigurationForm } from "../../forms";
import { PasswordRecoveryConfigurationFormPropsInterface } from "../../models";

const onSubmitMock: jest.Mock<any, any> = jest.fn();
const data_component_id: string = "password-recovery-edit-form";
const initialProps : PasswordRecoveryConfigurationFormPropsInterface = {
    initialValues: {
        "category": "Account Management",
        "displayName": "",
        "friendlyName": "Account Recovery",
        "id": "YWNjb3VudC1yZWNvdmVyeQ",
        "name": "account-recovery",
        "order": "",
        "properties": [
            {
                "description": "",
                "displayName": "Notification based password recovery",
                "name": "Recovery.Notification.Password.Enable",
                "value": "false"
            },
            {
                "description": "Enable to include uppercase characters in SMS and e-mail OTPs.",
                "displayName": "Include uppercase characters in OTP",
                "name": "Recovery.Notification.Password.OTP.UseUppercaseCharactersInOTP",
                "value": "true"
            },
            {
                "description": "Enable to include lowercase characters in SMS and e-mail OTPs.",
                "displayName": "Include lowercase characters in OTP",
                "name": "Recovery.Notification.Password.OTP.UseLowercaseCharactersInOTP",
                "value": "true"
            },
            {
                "description": "Enable to include numbers in SMS and e-mail OTPs.",
                "displayName": "Include numbers in OTP",
                "name": "Recovery.Notification.Password.OTP.UseNumbersInOTP",
                "value": "true"
            },
            {
                "description": "Length of the OTP for SMS and e-mail verifications. OTP length must be 4-10.",
                "displayName": "OTP length",
                "name": "Recovery.Notification.Password.OTP.OTPLength",
                "value": "6"
            },
            {
                "description": "",
                "displayName": "Notify when recovery success",
                "name": "Recovery.NotifySuccess",
                "value": "false"
            },
            {
                "description": "",
                "displayName": "Recovery link expiry time in minutes",
                "name": "Recovery.ExpiryTime",
                "value": "1440"
            },
            {
                "description": "Expiration time of the SMS OTP code for password recovery",
                "displayName": "SMS OTP expiry time",
                "name": "Recovery.Notification.Password.ExpiryTime.smsOtp",
                "value": "1"
            },
            {
                "description": "",
                "displayName": "Max failed attempts for password recovery",
                "name": "Recovery.Notification.Password.MaxFailedAttempts",
                "value": "3"
            },
            {
                "description": "",
                "displayName": "Max resend attempts for password recovery",
                "name": "Recovery.Notification.Password.MaxResendAttempts",
                "value": "5"
            },
            {
                "description": "",
                "displayName": "Notification based password recovery via an email",
                "name": "Recovery.Notification.Password.emailLink.Enable",
                "value": "false"
            },
            {
                "description": "",
                "displayName": "Notification based password recovery using SMS OTP",
                "name": "Recovery.Notification.Password.smsOtp.Enable",
                "value": "false"
            }
        ],
        "subCategory": "DEFAULT"
    },
    isConnectorEnabled: true,
    onSubmit: onSubmitMock
};

describe("PasswordRecoveryForm", () => {

    it("renders the PasswordRecoveryForm component.", async () => {
        render(<PasswordRecoveryConfigurationForm
            { ...initialProps }
            data-componentid="password-recovery-edit-form" />);

        expect(screen.getByTestId(`${data_component_id}-email-link-based-recovery`)).toBeInTheDocument();
    });

    it("recovery option selection checkboxes are checkable.", async () => {
        render(<PasswordRecoveryConfigurationForm { ...initialProps } />);

        const email_checkbox: HTMLInputElement = screen.getByRole("checkbox", { name: "enableEmailBasedRecovery" });
        const sms_checkbox: HTMLInputElement = screen.getByRole("checkbox", { name: "enableSMSBasedRecovery" });

        fireEvent.click(email_checkbox);
        fireEvent.click(sms_checkbox);

        expect(email_checkbox).toBeChecked();
        expect(sms_checkbox).toBeChecked();
    });

    it("otp code configuration checkboxes don't allow all checkboxes to be unchecked.", async () => {
        render(<PasswordRecoveryConfigurationForm { ...initialProps } />);

        const uppercase_checkbox: HTMLInputElement = screen.getByRole("checkbox",
            { name: "passwordRecoveryOtpUseUppercase" });
        const lowercase_checkbox: HTMLInputElement = screen.getByRole("checkbox",
            { name: "passwordRecoveryOtpUseLowercase" });
        const numeric_checkbox: HTMLInputElement = screen.getByRole("checkbox",
            { name: "passwordRecoveryOtpUseNumeric" });

        (!uppercase_checkbox.checked) && fireEvent.click(uppercase_checkbox);
        (!lowercase_checkbox.checked) && fireEvent.click(lowercase_checkbox);
        (numeric_checkbox.checked) && fireEvent.click(numeric_checkbox);
        expect(uppercase_checkbox).toBeChecked();
        expect(lowercase_checkbox).toBeChecked();
        expect(numeric_checkbox).not.toBeChecked();
        expect(numeric_checkbox).toBeDisabled();

        (!uppercase_checkbox.checked) && fireEvent.click(uppercase_checkbox);
        (!numeric_checkbox.checked) && fireEvent.click(numeric_checkbox);
        (lowercase_checkbox.checked) && fireEvent.click(lowercase_checkbox);
        expect(uppercase_checkbox).toBeChecked();
        expect(numeric_checkbox).toBeChecked();
        expect(lowercase_checkbox).not.toBeChecked();
        expect(lowercase_checkbox).toBeDisabled();

        (!lowercase_checkbox.checked) && fireEvent.click(lowercase_checkbox);
        (!numeric_checkbox.checked) && fireEvent.click(numeric_checkbox);
        (uppercase_checkbox.checked) && fireEvent.click(uppercase_checkbox);
        expect(lowercase_checkbox).toBeChecked();
        expect(numeric_checkbox).toBeChecked();
        expect(uppercase_checkbox).not.toBeChecked();
        expect(uppercase_checkbox.checked).toBeDisabled();
    });
});
