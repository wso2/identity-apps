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
 * Proptypes for the username-recovery-channel-selection fragment of login screen skeleton.
 */
export type UsernameRecoveryChannelSelectionFragmentInterface = IdentifiableComponentInterface;

/**
 * Username recovery channel selection fragment component for the branding preview of Username Recovery box.
 *
 * @param props - Props injected to the component.
 * @returns Username recovery fragment component.
 */
const UsernameRecoveryChannelSelectionFragment: FunctionComponent<UsernameRecoveryChannelSelectionFragmentInterface> = (
    props: UsernameRecoveryChannelSelectionFragmentInterface
): ReactElement => {
    const { ["data-componentid"]: componentId = "username-recovery-channel-selection" } = props;

    const { i18n } = useBrandingPreference();

    return (
        <div data-componentid={ componentId }>
            <h2>{ i18n(CustomTextPreferenceConstants.
                TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_CHANNEL_SELECTION.HEADING, "Recovery Username") }
            </h2>
            <p>
                { i18n(
                    CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_CHANNEL_SELECTION.BODY,
                    "Select a recovery option."
                ) }
            </p>
            <div className="ui divider hidden"></div>

            <div className="segment-form">
                <form className="ui large form" id="channelSelectionForm">
                    <div className="field">
                        <div className="ui radio checkbox">
                            <input type="radio" value="email" checked={ true } />
                            <label>{ i18n(CustomTextPreferenceConstants.
                                TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_CHANNEL_SELECTION.RADIO_BUTTON.EMAIL,
                            "Send Username via Email") }
                            </label>
                        </div>
                    </div>
                    <div className="field">
                        <div className="ui radio checkbox">
                            <input type="radio" value="sms" />
                            <label>{ i18n(CustomTextPreferenceConstants.
                                TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_CHANNEL_SELECTION.RADIO_BUTTON.SMS,
                            "Send Username via SMS") }
                            </label>
                        </div>
                    </div>

                    <div className="ui divider hidden"></div>

                    <div className="mt-4">
                        <button className="ui primary button large fluid" type="submit">
                            { i18n(CustomTextPreferenceConstants.
                                TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_CHANNEL_SELECTION.BUTTON.NEXT, "Next") }
                        </button>
                    </div>

                    <div className="mt-1 align-center">
                        <a className="ui button secondary large fluid">
                            { i18n(CustomTextPreferenceConstants.
                                TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_CHANNEL_SELECTION.BUTTON.CANCEL, "Cancel") }
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsernameRecoveryChannelSelectionFragment;
