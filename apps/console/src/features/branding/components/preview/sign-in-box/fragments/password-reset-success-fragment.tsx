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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { CustomTextPreferenceConstants } from "../../../../constants/custom-text-preference-constants";
import useBrandingPreference from "../../../../hooks/use-branding-preference";

/**
 * Proptypes for the password-reset-success fragment of login screen skeleton.
 */
export type PasswordResetSuccessFragmentInterface = IdentifiableComponentInterface;

/**
 * Password reset success fragment component for the branding preview of Password Reset Success box.
 *
 * @param props - Props injected to the component.
 * @returns Password reset success fragment component.
 */
const PasswordResetSuccessFragment: FunctionComponent<PasswordResetSuccessFragmentInterface> = (
    props: PasswordResetSuccessFragmentInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { i18n } = useBrandingPreference();

    return (
        <div data-componentid={ componentId }>
            <h2>
                { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PASSWORD_RESET_SUCCESS.HEADING,
                    "Check Your Email") }
            </h2>
            <div className="segment-form">
                <form method="post" id="totpForm" className="ui large form otp-form">
                    <p className="text-center" id="instruction">
                        An email with a password reset link and instructions has been sent to your email.
                    </p>
                    <p className="text-center" id="instruction">
                        Didn&apos;t receive an email yet? Your email address is not registered on
                        or you have signed up using a social account with the provided email.
                        Create an account or use a different login option.
                    </p>
                    <div className="ui divider hidden"></div>
                    <div className="ui divider hidden"></div>
                    <div className="text-center">
                        <i className="caret left icon primary"></i>
                        <a>
                            { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PASSWORD_RESET_SUCCESS.ACTION,
                                "Back to application") }
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
PasswordResetSuccessFragment.defaultProps = {
    "data-componentid": "branding-preview-password-reset-success-fragment"
};

export default PasswordResetSuccessFragment;
