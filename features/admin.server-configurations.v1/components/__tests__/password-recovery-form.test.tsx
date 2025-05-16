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

import { fireEvent, render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import "@testing-library/jest-dom";
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

    it("Renders the PasswordRecoveryForm component.", async () => {

        render(<PasswordRecoveryConfigurationForm
            { ...initialProps }
            data-componentid="password-recovery-edit-form" />);

        expect(screen.getByTestId(`${data_component_id}-email-based-recovery`)).toBeInTheDocument();
    });

    it("Recovery option selection checkboxes are checkable.", async () => {

        render(<PasswordRecoveryConfigurationForm { ...initialProps } />);
        const emailCheckbox: HTMLInputElement | null =
            screen.getByTestId(`${data_component_id}-email-based-recovery`).querySelector("input");
        const smsCheckbox: HTMLInputElement | null =
            screen.getByTestId(`${data_component_id}-sms-based-recovery`).querySelector("input");

        expect(emailCheckbox).not.toBeNull();
        expect(smsCheckbox).not.toBeNull();

        emailCheckbox && !(emailCheckbox.checked) && fireEvent.click(emailCheckbox);
        smsCheckbox && !(smsCheckbox.checked) && fireEvent.click(smsCheckbox);

        expect(emailCheckbox).toBeChecked();
        expect(smsCheckbox).toBeChecked();
    });

    it("OTP code configuration checkboxes don't allow all checkboxes to be unchecked.", async () => {

        render(<PasswordRecoveryConfigurationForm
            { ...initialProps }
            data-componentid="password-recovery-edit-form" />);

        const uppercaseCheckbox: HTMLInputElement | null =
            screen.getByTestId(`${data_component_id}-sms-otp-uppercase`).querySelector("input");
        const lowercaseCheckbox: HTMLInputElement | null =
            screen.getByTestId(`${data_component_id}-sms-otp-lowercase`).querySelector("input");
        const numericCheckbox: HTMLInputElement | null =
            screen.getByTestId(`${data_component_id}-sms-otp-numeric`).querySelector("input");

        expect(uppercaseCheckbox).not.toBeNull();
        expect(lowercaseCheckbox).not.toBeNull();
        expect(numericCheckbox).not.toBeNull();

        if (!uppercaseCheckbox || !lowercaseCheckbox || !numericCheckbox ) return;

        if (!uppercaseCheckbox.checked) fireEvent.click(uppercaseCheckbox);
        if (lowercaseCheckbox.checked) fireEvent.click(lowercaseCheckbox);
        if (numericCheckbox.checked) fireEvent.click(numericCheckbox);
        expect(lowercaseCheckbox).not.toBeChecked();
        expect(numericCheckbox).not.toBeChecked();
        expect(uppercaseCheckbox).toBeChecked();
        expect(uppercaseCheckbox).toBeDisabled();

        if (!lowercaseCheckbox.checked) fireEvent.click(lowercaseCheckbox);
        if (uppercaseCheckbox.checked) fireEvent.click(uppercaseCheckbox);
        if (numericCheckbox.checked) fireEvent.click(numericCheckbox);
        expect(uppercaseCheckbox).not.toBeChecked();
        expect(numericCheckbox).not.toBeChecked();
        expect(lowercaseCheckbox).toBeChecked();
        expect(lowercaseCheckbox).toBeDisabled();

        if (!numericCheckbox.checked) fireEvent.click(numericCheckbox);
        if (uppercaseCheckbox.checked) fireEvent.click(uppercaseCheckbox);
        if (lowercaseCheckbox.checked) fireEvent.click(lowercaseCheckbox);
        expect(lowercaseCheckbox).not.toBeChecked();
        expect(uppercaseCheckbox).not.toBeChecked();
        expect(numericCheckbox).toBeChecked();
        expect(numericCheckbox).toBeDisabled();
    });
});
