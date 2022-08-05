/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import React, { CSSProperties, Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { AppConstants } from "../../../../../features/core/constants";
import { BrandingPreferencesConstants } from "../../constants";
import { BrandingPreferenceMeta } from "../../meta";
import { BrandingPreferenceInterface } from "../../models";

/**
 * Proptypes for the Branding preference preview component.
 */
interface LoginScreenSkeletonInterface extends IdentifiableComponentInterface {
    /**
     * Branding preferences object.
     */
    brandingPreference: BrandingPreferenceInterface;
}

/**
 * Branding Preference Preview.
 *
 * @param {BrandingPreferencePreviewInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const LoginScreenSkeleton: FunctionComponent<LoginScreenSkeletonInterface> = (
    props: LoginScreenSkeletonInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        brandingPreference
    } = props;

    const previewOnlyStyles: {
        loginBox: CSSProperties
    } = {
        loginBox: {
            width: "410px"
        }
    };

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
        <div data-componentid={ componentId } className="login-portal layout authentication-portal-layout">
            <div className="page-wrapper">
                <main className="center-segment">
                    <div className="ui container medium center aligned middle aligned">
                        <div className="theme-icon inline auto transparent product-logo portal-logo">
                            <img
                                src={
                                    brandingPreference.theme[ brandingPreference.theme.activeTheme ].images.logo.imgURL
                                }
                                id="product-logo"
                                alt={
                                    brandingPreference.theme[ brandingPreference.theme.activeTheme ].images.logo.altText
                                }
                            />
                        </div>
                        <div className="ui segment" style={ previewOnlyStyles.loginBox }>
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
                                                placeholder="Email address"
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
                                                placeholder="Password"
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
                    </div>
                </main>

                <div className="footer">
                    <div className="ui container fluid">
                        <div className="ui text menu">
                            <div className="left menu">
                                <a className="item no-hover" id="copyright">
                                    <span>{ brandingPreference.organizationDetails.copyrightText }</span>
                                    {
                                        (brandingPreference.configs?.removeAsgardeoBranding === false) && (
                                            <Fragment>
                                                <div className="powered-by-logo-divider">|</div>
                                                    Powered by <div className="powered-by-logo">
                                                    <img
                                                        width="80"
                                                        height="20"
                                                        src={
                                                            Object.prototype.hasOwnProperty.call(
                                                                BrandingPreferenceMeta
                                                                    .getBrandingPreferenceInternalFallbacks()
                                                                    .theme,
                                                                brandingPreference.theme.activeTheme
                                                            )
                                                                ? BrandingPreferenceMeta
                                                                    .getBrandingPreferenceInternalFallbacks()
                                                                    .theme[
                                                                        brandingPreference.theme.activeTheme
                                                                    ].images.logo.imgURL
                                                                : BrandingPreferenceMeta
                                                                    .getBrandingPreferenceInternalFallbacks()
                                                                    .theme[
                                                                        BrandingPreferencesConstants.DEFAULT_THEME
                                                                    ].images.logo.imgURL
                                                        }
                                                        alt="Asgardeo Logo"
                                                    />
                                                </div>
                                            </Fragment>
                                        )
                                    }
                                </a>
                            </div>
                            <div className="right menu">
                                {
                                    !isEmpty(brandingPreference.urls?.privacyPolicyURL) && (
                                        <a
                                            id="privacy-policy"
                                            className="item"
                                            href={ brandingPreference.urls.privacyPolicyURL }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            data-testid="login-page-privacy-policy-link"
                                        >
                                                Privacy Policy
                                        </a>
                                    )
                                }
                                {
                                    !isEmpty(brandingPreference.urls?.termsOfUseURL) && (
                                        <a
                                            id="terms-of-service"
                                            className="item"
                                            href={ brandingPreference.urls.termsOfUseURL }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            data-testid="login-page-privacy-policy-link"
                                        >
                                                Terms of Service
                                        </a>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
LoginScreenSkeleton.defaultProps = {
    "data-componentid": "login-screen-skeleton"
};
