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
 * Proptypes for the totp fragment of login screen skeleton.
 */
export type PushAuthFragmentInterface = IdentifiableComponentInterface;

/**
 * PushAuthFragment fragment component for the branding preview of Sign In box.
 *
 * @param props - Props injected to the component.
 * @returns PushAuthFragment fragment component.
 */
const PushAuthFragment: FunctionComponent<PushAuthFragmentInterface> = (
    props: PushAuthFragmentInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { i18n } = useBrandingPreference();

    return (
        <div data-componentid={ componentId }>
            <h3 className="ui header text-center">
                { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PUSH_AUTH.HEADING, "Verify Your Identity") }
            </h3>

            <div className="segment-form">
                <form method="post" id="totpForm" className="ui large form otp-form">
                    <p className="text-center" id="instruction">
                        {
                            i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PUSH_AUTH.BODY,
                                // eslint-disable-next-line max-len
                                "A push notification has been sent to your device. Please respond to the request to continue."
                            )
                        }
                    </p>

                    <div className="ui divider hidden"></div>
                    <div className="ui divider hidden"></div>
                    <div>
                        <input
                            type="submit"
                            id="subButton"
                            value="00:57"
                            className="ui primary fluid large button disabled"
                        />
                    </div>
                    <div className="text-center mt-1"></div>
                </form>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
PushAuthFragment.defaultProps = {
    "data-componentid": "branding-preview-totp-fragment"
};

export default PushAuthFragment;
