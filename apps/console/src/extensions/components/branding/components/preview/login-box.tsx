/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { AppConstants } from "../../../../../features/core/constants";
import { BrandingPreferenceInterface } from "../../models";

/**
 * Proptypes for the login box component of login screen skeleton.
 */
interface LoginBoxInterface extends IdentifiableComponentInterface {
    /**
     * Branding preferences object.
     */
    brandingPreference: BrandingPreferenceInterface;
}

/**
 * Login Box Component.
 *
 * @param {LoginBoxInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const LoginBox: FunctionComponent<LoginBoxInterface> = (
    props: LoginBoxInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;

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
        <div className="ui segment" data-componentid = { componentId }>
            <h3 className="ui header">
                Sign In
            </h3>

            <div className="segment-form">
                <div className="ui large form">
                    <div className="field m-0">
                        <label>Email</label>
                        <div className="ui fluid left icon input">
                            <input
                                type="text"
                                id="usernameUserInput"
                                name="usernameUserInput"
                                placeholder="Enter your email"
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
                                    Forgot
                                    password?
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
                                    Sign In
                            </button>
                        </div>
                    </div>
                    <div className="mt-0">
                        <div className="buttons">
                            <button
                                type="button"
                                className="ui large fluid button secondary"
                                data-testid="login-page-create-account-button"
                            >
                                Create an account
                            </button>
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
LoginBox.defaultProps = {
    "data-componentid": "login-screen-skeleton-login-box"
};
