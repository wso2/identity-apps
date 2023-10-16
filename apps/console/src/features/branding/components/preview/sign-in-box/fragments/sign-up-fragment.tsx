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
import { CustomTextPreferenceConstants } from "../../../../constants/custom-text-preference-constants";
import useBrandingPreference from "../../../../hooks/use-branding-preference";

/**
 * Proptypes for the sign-up fragment of login screen skeleton.
 */
export type SignUpFragmentInterface = IdentifiableComponentInterface;

/**
 * Sign Up fragment component for the branding preview of Sign In box.
 *
 * @param props - Props injected to the component.
 * @returns Sign Up fragment component.
 */
const SignUpFragment: FunctionComponent<SignUpFragmentInterface> = (props: SignUpFragmentInterface): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { i18n } = useBrandingPreference();

    return (
        <div data-componentid={ componentId }>
            <h3 className="ui header" data-testid="self-registration-username-request-page-header">
                { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.SIGN_UP.HEADING, "Sign Up") }
            </h3>

            <div className="ui negative message" id="error-msg" hidden={ true }></div>
            <div className="segment-form" id="basic-form" hidden={ true } style={ { display: "block" } }>
                <form
                    className="ui large form"
                    action="processregistration.do"
                    method="post"
                    id="register"
                    noValidate={ true }
                >
                    <div id="alphanumericUsernameField" className="field required" hidden={ true }>
                        <input id="isSaaSApp" name="isSaaSApp" type="hidden" value="false" />

                        <div className="ui divider hidden"></div>
                        <label>Username</label>
                        <div className="ui fluid left icon input">
                            <input
                                type="text"
                                id="alphanumericUsernameUserInput"
                                value=""
                                name="usernameInput"
                                placeholder="Enter your username"
                                data-testid="self-register-page-username-input"
                            />
                            <i aria-hidden="true" className="user outline icon"></i>
                        </div>
                        <div className="mt-1" id="alphanumeric-username-error-msg" hidden={ true }>
                            <div className="ui grid">
                                <div className="one wide column">
                                    <i className="red exclamation circle icon"></i>
                                </div>
                                <div
                                    className="fourteen wide column validation-error-message"
                                    id="alphanumeric-username-error-msg-text"
                                ></div>
                            </div>
                        </div>
                        <div className="mt-1 password-policy-description" id="alphanumeric-username-msg">
                            <div className="ui grid">
                                <div className="one wide column">
                                    <i className="info circle icon" data-variation="inverted"></i>
                                </div>
                                <div className="fourteen wide column" id="alphanumeric-username-msg-text">
                                    Must be an alphanumeric (a-z, A-Z, 0-9) string between 3 to 255 characters including
                                    at least one letter.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="usernameField" className="field required">
                        <div className="ui divider hidden"></div>
                        <label>Email</label>
                        <div className="ui fluid left icon input">
                            <input
                                type="email"
                                id="usernameUserInput"
                                value=""
                                name="http://wso2.org/claims/emailaddress"
                                placeholder="Enter your email"
                                data-testid="self-register-page-username-input"
                            />
                            <i aria-hidden="true" className="envelope outline icon"></i>
                            <input id="username" name="username" type="hidden" />
                        </div>
                        <div className="mt-1" id="username-error-msg" hidden={ true }>
                            <div className="ui grid">
                                <div className="one wide column">
                                    <i className="red exclamation circle icon"></i>
                                </div>
                                <div
                                    className="fourteen wide column validation-error-message"
                                    id="username-error-msg-text"
                                ></div>
                            </div>
                        </div>
                        <div className="ui divider hidden"></div>
                    </div>
                    <div id="passwordField" className="field required">
                        <label>Password</label>
                        <div className="ui fluid left icon input addon-wrapper">
                            <input
                                type="password"
                                id="passwordUserInput"
                                value=""
                                name="passwordUserInput"
                                placeholder="Enter your password"
                                data-testid="self-register-page-password-input"
                                autoComplete="new-password"
                            />
                            <i aria-hidden="true" className="lock icon"></i>
                            <i id="password-eye" className="eye icon right-align password-toggle slash"></i>
                            <input id="password" name="password" type="hidden" />
                        </div>
                        <div className="mt-1" id="password-error-msg" hidden={ true }>
                            <div className="ui grid">
                                <div className="one wide column">
                                    <i className="red exclamation circle icon"></i>
                                </div>
                                <div
                                    className="fourteen wide column validation-error-message"
                                    id="password-error-msg-text"
                                ></div>
                            </div>
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
                        <div id="case-block" className="password-policy-description mb-2" style={ { display: "block" } }>
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
                            <i id="password-validation-neutral-special-chr" className="inverted grey circle icon"></i>
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
                            <i id="password-validation-neutral-unique-chr" className="inverted grey circle icon"></i>
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
                            <i id="password-validation-neutral-repeated-chr" className="inverted grey circle icon"></i>
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

                    <div className="mt-4">
                        <div className="two fields mb-0">
                            <div id="firstNameField" className="field">
                                <label className="control-label">First Name</label>
                                <input
                                    id="firstNameUserInput"
                                    type="text"
                                    name="http://wso2.org/claims/givenname"
                                    className="form-control"
                                    placeholder="First Name"
                                />
                                <div className="mt-1" id="firstname-error-msg" hidden={ true }>
                                    <div className="ui grid">
                                        <div className="one wide column">
                                            <i className="red exclamation circle icon"></i>
                                        </div>
                                        <div
                                            className="ten wide column validation-error-message"
                                            id="firstname-error-msg-text"
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div id="lastNameField" className="field form-group">
                                <label className="control-label">Last Name</label>
                                <input
                                    id="lastNameUserInput"
                                    type="text"
                                    name="http://wso2.org/claims/lastname"
                                    className="form-control"
                                    placeholder="Last Name"
                                />
                                <div className="mt-1" id="lastname-error-msg" hidden={ true }>
                                    <div className="ui grid">
                                        <div className="one wide column">
                                            <i className="red exclamation circle icon"></i>
                                        </div>
                                        <div
                                            className="ten wide column validation-error-message"
                                            id="lastname-error-msg-text"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3"></div>

                        <div id="dob_field" className="field">
                            <label className="control-label">Birth Date</label>

                            <div className="ui calendar" id="date_picker">
                                <div className="ui input right icon" style={ { width: "100%" } }>
                                    <div className="ui popup calendar">
                                        <table className="ui celled center aligned unstackable table seven column day">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <span className="link">October 2023</span>
                                                        <span className="prev link">
                                                            <i className="chevron left icon"></i>
                                                        </span>
                                                        <span className="next link">
                                                            <i className="chevron right icon"></i>
                                                        </span>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th>S</th>
                                                    <th>M</th>
                                                    <th>T</th>
                                                    <th>W</th>
                                                    <th>T</th>
                                                    <th>F</th>
                                                    <th>S</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="link">1</td>
                                                    <td className="link">2</td>
                                                    <td className="link">3</td>
                                                    <td className="link">4</td>
                                                    <td className="link">5</td>
                                                    <td className="link">6</td>
                                                    <td className="link today focus">7</td>
                                                </tr>
                                                <tr>
                                                    <td className="link">8</td>
                                                    <td className="link">9</td>
                                                    <td className="link">10</td>
                                                    <td className="link">11</td>
                                                    <td className="link">12</td>
                                                    <td className="link">13</td>
                                                    <td className="link">14</td>
                                                </tr>
                                                <tr>
                                                    <td className="link">15</td>
                                                    <td className="link">16</td>
                                                    <td className="link">17</td>
                                                    <td className="link">18</td>
                                                    <td className="link">19</td>
                                                    <td className="link">20</td>
                                                    <td className="link">21</td>
                                                </tr>
                                                <tr>
                                                    <td className="link">22</td>
                                                    <td className="link">23</td>
                                                    <td className="link">24</td>
                                                    <td className="link">25</td>
                                                    <td className="link">26</td>
                                                    <td className="link">27</td>
                                                    <td className="link">28</td>
                                                </tr>
                                                <tr>
                                                    <td className="link">29</td>
                                                    <td className="link">30</td>
                                                    <td className="link">31</td>
                                                    <td className="link adjacent disabled">1</td>
                                                    <td className="link adjacent disabled">2</td>
                                                    <td className="link adjacent disabled">3</td>
                                                    <td className="link adjacent disabled">4</td>
                                                </tr>
                                                <tr>
                                                    <td className="link adjacent disabled">5</td>
                                                    <td className="link adjacent disabled">6</td>
                                                    <td className="link adjacent disabled">7</td>
                                                    <td className="link adjacent disabled">8</td>
                                                    <td className="link adjacent disabled">9</td>
                                                    <td className="link adjacent disabled">10</td>
                                                    <td className="link adjacent disabled">11</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <i className="calendar icon"></i>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        name="http://wso2.org/claims/dob"
                                        id="birthOfDate"
                                        placeholder="Enter Birth Date"
                                    />
                                </div>
                            </div>

                            <div className="mt-1" id="dob_error" hidden={ true }>
                                <div className="ui grid">
                                    <div className="one wide column">
                                        <i className="red exclamation circle icon"></i>
                                    </div>
                                    <div
                                        className="fourteen wide column validation-error-message"
                                        id="dob_error_text"
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div id="country_field" className="field">
                            <label className="control-label">Country</label>

                            <div
                                className="ui fluid search selection dropdown"
                                id="country-dropdown"
                                data-testid="country-dropdown"
                            >
                                <input type="hidden" id="country" name="http://wso2.org/claims/country" />
                                <i className="dropdown icon"></i>
                                <input className="search" autoComplete="off" tabIndex={ 0 } role="presentation" />
                                <div className="default text">Enter Country</div>
                            </div>

                            <div className="mt-1" id="country_error" hidden={ true }>
                                <div className="ui grid">
                                    <div className="one wide column">
                                        <i className="red exclamation circle icon"></i>
                                    </div>
                                    <div
                                        className="fourteen wide column validation-error-message"
                                        id="country_error_text"
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div id="mobile_field" className="field">
                            <label className="control-label">Mobile</label>

                            <input
                                type="text"
                                name="http://wso2.org/claims/mobile"
                                className="form-control"
                                pattern="^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})?[-. )]*(\d{3})?[-. ]*(\d{4,6})(?: *x(\d+))?\s*$"
                                id="mobileNumber"
                                placeholder="Enter Mobile"
                            />

                            <div className="mt-1" id="mobile_error" hidden={ true }>
                                <div className="ui grid">
                                    <div className="one wide column">
                                        <i className="red exclamation circle icon"></i>
                                    </div>
                                    <div
                                        className="fourteen wide column validation-error-message"
                                        id="mobile_error_text"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <div className="ui divider hidden"></div>

                        <div className="ui divider hidden"></div>

                        <div className="field">
                            <input
                                id="isSelfRegistrationWithVerification"
                                type="hidden"
                                name="isSelfRegistrationWithVerification"
                                value="true"
                            />

                            <input id="sp" name="sp" type="hidden" value="SPA" />
                        </div>
                    </div>
                    <div className="buttons mt-4">
                        <button id="registrationSubmit" className="ui primary button large fluid" type="submit">
                            { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.SIGN_UP.BUTTON, "Sign Up") }
                        </button>
                    </div>
                    <div className="ui divider hidden"></div>

                    <div className="buttons mt-2">
                        <div className="field external-link-container text-small">
                            Already have an account?
                            <a href="">Sign in</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
SignUpFragment.defaultProps = {
    "data-componentid": "branding-preview-sign-up-fragment"
};

export default SignUpFragment;
