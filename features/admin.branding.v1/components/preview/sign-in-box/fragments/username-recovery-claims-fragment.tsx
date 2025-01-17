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
 * Proptypes for the username-recovery-claims fragment of login screen skeleton.
 */
export type UsernameRecoveryClaimsFragmentInterface = IdentifiableComponentInterface;

/**
 * Username recovery claim fragment component for the branding preview of Username Recovery box.
 *
 * @param props - Props injected to the component.
 * @returns Username recovery fragment component.
 */
const UsernameRecoveryClaimsFragment: FunctionComponent<UsernameRecoveryClaimsFragmentInterface> = (
    props: UsernameRecoveryClaimsFragmentInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { i18n } = useBrandingPreference();

    return (
        <div data-componentid={ componentId }>
            <h2>
                { i18n(CustomTextPreferenceConstants.
                    TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_CLAIM.HEADING, "Username Recovery") }
            </h2>
            <p>
                { i18n(
                    CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_CLAIM.BODY,
                    "Enter below details to recover your username."
                ) }
            </p>

            <div className="ui divider hidden"></div>
            <div className="segment-form">
                <form className="ui large form" method="post" id="recoverDetailsForm">
                    <div className="field">
                        <label>name</label>
                        <div className="two fields">
                            <div className="required field">
                                <input id="first-name" placeholder="First Name*" type="text" />
                            </div>
                            <div className="field">
                                <input id="last-name" placeholder="Last Name" type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="required field">
                        <label>
                            { i18n(
                                CustomTextPreferenceConstants.
                                    TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_CLAIM.IDENTIFIER.INPUT.LABEL,
                                "Email or mobile"
                            ) }
                        </label>
                        <input
                            id="contact"
                            type="text"
                            placeholder={ i18n(
                                CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_CLAIM.IDENTIFIER.INPUT
                                    .PLACEHOLDER,
                                "Email or mobile"
                            ) }
                        />
                    </div>
                    <div className="ui divider hidden"></div>
                    <div className="mt-0">
                        <button className="ui fluid large primary button" type="submit">
                            { i18n(
                                CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_CLAIM.BUTTON.NEXT,
                                "Next"
                            ) }
                        </button>
                    </div>
                    <div className="mt-1 align-center">
                        <a className="ui button secondary large fluid">
                            { i18n(
                                CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_CLAIM.BUTTON.CANCEL,
                                "Cancel"
                            ) }
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * Default proptypes for the component.
 */
UsernameRecoveryClaimsFragment.defaultProps = {
    "data-componentid": "username-recovery-claims-fragment"
};

export default UsernameRecoveryClaimsFragment;
