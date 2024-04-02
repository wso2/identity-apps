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
 * Proptypes for the password-recovery fragment of login screen skeleton.
 */
export type PasswordRecoveryFragmentInterface = IdentifiableComponentInterface;

/**
 * Password recovery fragment component for the branding preview of Password Recovery box.
 *
 * @param props - Props injected to the component.
 * @returns Password recovery fragment component.
 */
const PasswordRecoveryFragment: FunctionComponent<PasswordRecoveryFragmentInterface> = (
    props: PasswordRecoveryFragmentInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { i18n } = useBrandingPreference();

    return (
        <div data-componentid={ componentId }>
            <h2>
                { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PASSWORD_RECOVERY.HEADING, "Forgot Password?") }
            </h2>
            <div className="segment-form">
                <form method="post" id="totpForm" className="ui large form otp-form">
                    <p className="line-break text-center" id="instruction" >
                        { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PASSWORD_RECOVERY.BODY,
                            "Don't worry, it happens. We will send you an email to reset your password.") }
                    </p>
                    <div className="ui divider hidden"></div>
                    <div className="ui large form">
                        <div className="field">
                            <div className="ui fluid left icon input">
                                <input
                                    type="text"
                                    id="usernameUserInput"
                                    name="usernameUserInput"
                                    placeholder={
                                        i18n(CustomTextPreferenceConstants
                                        .TEXT_BUNDLE_KEYS.PASSWORD_RECOVERY
                                        .IDENTIFIER.INPUT.PLACEHOLDER, "Username?")
                                    }
                                    data-testid="login-page-username-input"
                                />
                                <i aria-hidden="true" className="user outline icon"></i>
                                <input id="username" name="username" type="hidden" />
                            </div>
                        </div>
                    </div>
                    <div className="ui divider hidden"></div>
                    <div>
                        <button
                            type="submit"
                            id="subButton"
                            className="ui primary fluid large button mb-2"
                        >
                            { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PASSWORD_RECOVERY.BUTTON,
                                "Send Reset Link") }
                        </button>
                        <button
                            type="submit"
                            id="subButton"
                            className="ui secondary fluid large button"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
PasswordRecoveryFragment.defaultProps = {
    "data-componentid": "branding-preview-password-recovery-fragment"
};

export default PasswordRecoveryFragment;
