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
import React, {
    FunctionComponent,
    ReactElement
} from "react";
import { CustomTextPreferenceConstants } from "../../../../constants/custom-text-preference-constants";
import useBrandingPreference from "../../../../hooks/use-branding-preference";

/**
 * Proptypes for the password-reset fragment of login screen skeleton.
 */
export type PasswordResetFragmentInterface = IdentifiableComponentInterface;

/**
 * Password reset fragment component for the branding preview of Sign In box.
 *
 * @param props - Props injected to the component.
 * @returns Password reset fragment component.
 */
const PasswordResetFragment: FunctionComponent<PasswordResetFragmentInterface> = (
    props: PasswordResetFragmentInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { i18n } = useBrandingPreference();

    return (
        <div data-componentid={ componentId }>
            <h2>
                { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PASSWORD_RESET.HEADING, "Reset Password") }
            </h2>
            <div className="segment-form">
                <form method="post" id="totpForm" className="ui large form otp-form">
                    <div className="ui divider hidden"></div>
                    <div className="ui large form">
                        <div id="passwordField" className="field">
                            <label>Enter new password</label>
                            <div className="ui fluid left icon input addon-wrapper">
                                <input
                                    type="password"
                                    id="passwordUserInput"
                                    value=""
                                    name="passwordUserInput"
                                    data-testid="self-register-page-password-input"
                                    autoComplete="new-password"
                                />
                                <i id="password-eye" className="eye icon right-align password-toggle slash"></i>
                                <input id="password" name="password" type="hidden" />
                            </div>
                        </div>

                        <div id="password-validation-block">
                            <div
                                id="length-block"
                                className="password-policy-description mb-2"
                                style={ { display: "block" } }
                            >
                                <i id="password-validation-neutral-length" className="inverted grey circle icon"></i>
                                <i
                                    id="password-validation-cross-length"
                                    style={ { display: "none" } }
                                    className="red times circle icon"
                                ></i>
                                <i
                                    id="password-validation-check-length"
                                    style={ { display: "none" } }
                                    className="green check circle icon"
                                ></i>
                                <p id="length" className="pl-4">
                                Must be between 8 and 30 characters
                                </p>
                            </div>
                            <div
                                id="case-block"
                                className="password-policy-description mb-2"
                                style={ { display: "block" } }
                            >
                                <i id="password-validation-neutral-case" className="inverted grey circle icon"></i>
                                <i
                                    id="password-validation-cross-case"
                                    style={ { display: "none" } }
                                    className="red times circle icon"
                                ></i>
                                <i
                                    id="password-validation-check-case"
                                    style={ { display: "none" } }
                                    className="green check circle icon"
                                ></i>
                                <p id="case" className="pl-4">
                                At least 1 uppercase and 1 lowercase character(s)
                                </p>
                            </div>
                            <div
                                id="number-block"
                                className="password-policy-description mb-2"
                                style={ { display: "block" } }
                            >
                                <i id="password-validation-neutral-number" className="inverted grey circle icon"></i>
                                <i
                                    id="password-validation-cross-number"
                                    style={ { display: "none" } }
                                    className="red times circle icon"
                                ></i>
                                <i
                                    id="password-validation-check-number"
                                    style={ { display: "none" } }
                                    className="green check circle icon"
                                ></i>
                                <p id="number" className="pl-4">
                                At least 1 number(s)
                                </p>
                            </div>
                            <div
                                id="special-chr-block"
                                className="password-policy-description mb-2"
                                style={ { display: "block" } }
                            >
                                <i
                                    id="password-validation-neutral-special-chr"
                                    className="inverted grey circle icon"
                                ></i>
                                <i
                                    id="password-validation-cross-special-chr"
                                    style={ { display: "none" } }
                                    className="red times circle icon"
                                ></i>
                                <i
                                    id="password-validation-check-special-chr"
                                    style={ { display: "none" } }
                                    className="green check circle icon"
                                ></i>
                                <p id="special-chr" className="pl-4">
                                At least 1 special character(s)
                                </p>
                            </div>
                            <div
                                id="unique-chr-block"
                                className="password-policy-description mb-2"
                                style={ { display: "none" } }
                            >
                                <i
                                    id="password-validation-neutral-unique-chr"
                                    className="inverted grey circle icon"
                                ></i>
                                <i
                                    id="password-validation-cross-unique-chr"
                                    style={ { display: "none" } }
                                    className="red times circle icon"
                                ></i>
                                <i
                                    id="password-validation-check-unique-chr"
                                    style={ { display: "none" } }
                                    className="green check circle icon"
                                ></i>
                                <p id="unique-chr" className="pl-4">
                                At least one unique character
                                </p>
                            </div>
                            <div
                                id="repeated-chr-block"
                                className="password-policy-description mb-2"
                                style={ { display: "none" } }
                            >
                                <i
                                    id="password-validation-neutral-repeated-chr"
                                    className="inverted grey circle icon"
                                ></i>
                                <i
                                    id="password-validation-cross-repeated-chr"
                                    style={ { display: "none" } }
                                    className="red times circle icon"
                                ></i>
                                <i
                                    id="password-validation-check-repeated-chr"
                                    style={ { display: "none" } }
                                    className="green check circle icon"
                                ></i>
                                <p id="repeated-chr" className="pl-4">
                                No more than one repeated character
                                </p>
                            </div>
                        </div>

                        <div id="passwordField" className="field">
                            <label>Confirm password</label>
                            <div className="ui fluid left icon input addon-wrapper">
                                <input
                                    type="password"
                                    id="passwordUserInput"
                                    value=""
                                    name="passwordUserInput"
                                    data-testid="self-register-page-password-input"
                                    autoComplete="new-password"
                                />
                                <i id="password-eye" className="eye icon right-align password-toggle slash"></i>
                                <input id="password" name="password" type="hidden" />
                            </div>
                        </div>

                    </div>
                    <div className="ui divider hidden"></div>
                    <div className="align-right buttons">
                        <button
                            type="button"
                            name="authenticate"
                            id="authenticate"
                            className="ui primary button"
                        >
                            { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PASSWORD_RESET.BUTTON,
                                "Proceed") }
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
PasswordResetFragment.defaultProps = {
    "data-componentid": "branding-preview-password-reset-fragment"
};

export default PasswordResetFragment;
