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
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { AppConstants } from "../../../../../admin-core-v1/constants";
import { CustomTextPreferenceConstants } from "../../../../constants/custom-text-preference-constants";
import useBrandingPreference from "../../../../hooks/use-branding-preference";

/**
 * Proptypes for the basic-auth fragment of login screen skeleton.
 */
export type BasicAuthFragmentInterface = IdentifiableComponentInterface;

/**
 * Basic auth fragment component for the branding preview of Sign In box.
 *
 * @param props - Props injected to the component.
 * @returns Basic auth fragment component.
 */
const BasicAuthFragment: FunctionComponent<BasicAuthFragmentInterface> = (
    props: BasicAuthFragmentInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { i18n } = useBrandingPreference();

    const [ googleLogoURL, setGoogleLogoURL ] = useState<string>(undefined);

    useEffect(() => {
        if (!AppConstants.getClientOrigin()) {
            return;
        }

        if (AppConstants.getAppBasename()) {
            setGoogleLogoURL(AppConstants.getClientOrigin() +
                "/" + AppConstants.getAppBasename() +
                "/libs/themes/default/assets/images/identity-providers/google-idp-illustration.svg");

            return;
        }

        setGoogleLogoURL(AppConstants.getClientOrigin()
            + "/libs/themes/default/assets/images/identity-providers/google-idp-illustration.svg");
    }, [ AppConstants.getClientOrigin(), AppConstants.getAppBasename() ]);

    return (
        <div data-componentid={ componentId }>
            <h3 className="ui header">
                { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.LOGIN.HEADING, "Sign In") }
            </h3>

            <div className="segment-form">
                <div className="ui large form">
                    <div className="field m-0">
                        <label>Username</label>
                        <div className="ui fluid left icon input">
                            <input
                                type="text"
                                id="usernameUserInput"
                                name="usernameUserInput"
                                placeholder="Enter your username"
                                data-testid="login-page-username-input"
                            />
                            <i aria-hidden="true" className="envelope outline icon"></i>
                            <input id="username" name="username" type="hidden" />
                        </div>
                    </div>

                    <div className="field mt-3 mb-0">
                        <label>Password</label>
                        <div className="ui fluid left icon input addon-wrapper">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                autoComplete="off"
                                placeholder="Enter your password"
                                data-testid="login-page-password-input"
                            />
                            <i aria-hidden="true" className="lock icon"></i>
                            <i
                                id="password-eye"
                                className="eye icon right-align password-toggle slash"></i>
                        </div>
                    </div>

                    <div className="buttons mt-2">
                        <div className="field external-link-container text-small">
                            <a
                                id="passwordRecoverLink"
                            >
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div className="ui divider hidden"></div>

                    <div className="field external-link-container text-small">
                        <div className="ui checkbox">
                            <input
                                type="checkbox"
                                id="chkRemember"
                                name="chkRemember"
                                data-testid="login-page-remember-me-checkbox"
                            />
                            <label>Remember me on this computer</label>
                        </div>
                    </div>
                    <input
                        type="hidden"
                        name="sessionDataKey"
                    />
                    <div className="mt-0">
                        <div className="buttons">
                            <button
                                type="submit"
                                className="ui primary fluid large button"
                                role="button"
                                data-testid="login-page-continue-login-button"
                            >
                                { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.LOGIN.BUTTON, "Sign In") }
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 mb-4">
                        <div className="mt-3 external-link-container text-small">
                            { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.REGISTER_TEXT.MESSAGE, 
                                "Don't have an account? ") }
                            <a
                                target="_self"
                                id="registerLink"
                                className="clickable-link"
                                rel="noopener noreferrer"
                                data-testid="login-page-create-account-button"
                            >
                                { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.REGISTER_TEXT.REGISTER, 
                                    "Register") }
                            </a>
                        </div>
                    </div>
                </div>
                <div className="ui horizontal divider">
                    Or
                </div>
                <div className="field">
                    <div className="ui vertical ui center aligned segment form">
                        <div className="social-login blurring social-dimmer">
                            <div className="field">
                                <button
                                    type="button"
                                    className="ui seconda button"
                                    data-testid="login-page-sign-in-with-google"
                                >
                                    <img
                                        alt="google-logo"
                                        className="ui image"
                                        src={ googleLogoURL }
                                    />
                                    <span>Sign In With Google</span>
                                </button>
                            </div>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
BasicAuthFragment.defaultProps = {
    "data-componentid": "branding-preview-basic-auth-fragment"
};

export default BasicAuthFragment;
