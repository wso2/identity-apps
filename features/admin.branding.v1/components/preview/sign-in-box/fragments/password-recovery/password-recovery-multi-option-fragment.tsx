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
                    <div className="field mb-5">
                        No problem, we&#39;re here to assist. Let&#39;s get your password reset for you.
                    </div>
                    <div className="field">
                        <label htmlFor="username">
                            Username
                        </label>
                        <div className="ui fluid left icon input">
                            <input
                                placeholder="Enter your username here"
                                id="usernameUserInput"
                                name="usernameUserInput"
                                type="text"
                                tabIndex={ 0 }
                                required
                            />
                            <i aria-hidden="true" className="user fill icon"></i>
                        </div>
                    </div>
                    <div className="ui list mb-5 field-validation-error-description" id="error-msg-invalid-email">
                        <i className="exclamation circle icon"></i>
                        <span id="error-message">Please enter a valid email address.
                        </span>
                    </div>
                    <div className="segment" style={ { "textAlign": "left" } }>
                        <div className="field">
                            <div className="ui radio checkbox">
                                <input type="radio" name="recoveryOption" value="EMAIL" checked />
                                <label>Send reset link via email</label>
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui radio checkbox">
                                <input type="radio" name="recoveryOption" value="SMSOTP" />
                                <label>Send code via SMS</label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button 
                            id="recoverySubmit"
                            className="ui primary button large fluid"
                            type="submit">
                            Submit
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
