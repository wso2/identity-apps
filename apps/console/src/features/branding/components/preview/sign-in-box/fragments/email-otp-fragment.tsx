/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import React, { FunctionComponent, ReactElement } from "react";
import {
    CustomTextPreferenceConstants
} from "../../../../constants/custom-text-preference-constants";
import useBrandingPreference from "../../../../hooks/use-branding-preference";

/**
 * Proptypes for the email-otp fragment of login screen skeleton.
 */
export type EmailOTPInterface = IdentifiableComponentInterface;

/**
 * Email OTP fragment component for the branding preview of Sign In box.
 *
 * @param props - Props injected to the component.
 * @returns Email OTP fragment component.
 */
const EmailOTP: FunctionComponent<EmailOTPInterface> = (props: EmailOTPInterface): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { i18n } = useBrandingPreference();

    return (
        <div data-componentid={ componentId }>
            <h2>{ i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.EMAIL_OTP.HEADING, "OTP Verification") }</h2>
            <div className="ui divider hidden" />
            <div className="segment-form">
                <form className="ui large form" id="codeForm" name="codeForm" method="POST">
                    <div className="field">
                        <label>Enter the code sent to your email ID (john*****@gmail.com)</label>

                        <div className="ui fluid icon input addon-wrapper">
                            <input type="password" id="OTPCode" name="OTPCode" aria-describedby="OTPDescription" />
                            <i id="password-eye" className="eye icon right-align password-toggle"></i>
                        </div>
                    </div>
                    <input type="hidden" name="sessionDataKey" value="2de498ba-6271-4918-aa60-5fbab7ba6136" />
                    <input type="hidden" name="resendCode" id="resendCode" value="false" />

                    <div className="ui divider hidden" />
                    <div className="align-right buttons">
                        <a className="ui button secondary" id="resend">
                            Resend Code
                        </a>
                        <input
                            type="button"
                            name="authenticate"
                            id="authenticate"
                            value="Continue"
                            className="ui primary button"
                        />
                    </div>

                    <div className="ui divider hidden" />
                </form>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
EmailOTP.defaultProps = {
    "data-componentid": "branding-preview-email-otp-fragment"
};

export default EmailOTP;
