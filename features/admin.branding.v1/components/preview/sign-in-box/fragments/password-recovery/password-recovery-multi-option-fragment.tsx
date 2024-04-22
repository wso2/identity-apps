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
import { CustomTextPreferenceConstants } from "../../../../../constants/custom-text-preference-constants";
import useBrandingPreference from "../../../../../hooks/use-branding-preference";

/**
 * Proptypes for the password-recovery fragment of login screen skeleton.
 */
export type PasswordRecoveryMultiOptionFragmentInterface = IdentifiableComponentInterface;

/**
 * Password recovery fragment component for the branding preview of Password Recovery box.
 *
 * @param props - Props injected to the component.
 * @returns Password recovery fragment component.
 */
const PasswordRecoveryMultiOptionFragment: FunctionComponent<PasswordRecoveryMultiOptionFragmentInterface> = (
    props: PasswordRecoveryMultiOptionFragmentInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { i18n } = useBrandingPreference();

    return (
        <div data-componentid={ componentId }>
            <h3 className="ui header m-0" data-testid="password-recovery-page-header">
                Forgot Password?
            </h3>

            <div className="ui divider hidden"></div>
            <div className="segment-form">
                <form className="ui large form" method="post" action="#" id="recoverDetailsForm">
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
                                            .IDENTIFIER.INPUT.PLACEHOLDER, "Username")
                                    }
                                    data-testid="login-page-username-input"
                                />
                                <i aria-hidden="true" className="user outline icon"></i>
                                <input id="username" name="username" type="hidden" />
                            </div>
                        </div>
                    </div>
                    <div className="segment" style={ { "textAlign": "left" } }>
                        <div className="field">
                            <div className="ui radio checkbox">
                                <input type="radio" name="recoveryOption" value="EMAIL" checked />
                                <label>{ i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PASSWORD_RECOVERY
                                    .RADIO_BUTTON.EMAIL_LINK,
                                "Send reset link via email.") }
                                </label>
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui radio checkbox">
                                <input type="radio" name="recoveryOption" value="SMSOTP" />
                                <label>{ i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PASSWORD_RECOVERY
                                    .RADIO_BUTTON.SMS_OTP,
                                "Send code via SMS.") }
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            id="recoverySubmit"
                            className="ui primary button large fluid"
                            type="submit">
                            { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PASSWORD_RECOVERY
                                .BUTTON.MULTI,
                            "Submit") }
                        </button>
                    </div>
                    <div className="mt-1 align-center">
                        <a href="javascript:goBack()" className="ui button secondary large fluid">
                            Cancel
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
PasswordRecoveryMultiOptionFragment.defaultProps = {
    "data-componentid": "branding-preview-password-recovery-fragment"
};

export default PasswordRecoveryMultiOptionFragment;
