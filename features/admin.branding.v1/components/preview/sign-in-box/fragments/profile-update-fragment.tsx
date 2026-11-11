/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
 * Proptypes for the profile-update fragment of login screen skeleton.
 */
type ProfileUpdateFragmentInterface = IdentifiableComponentInterface;

/**
 * Profile update fragment component for the branding preview of Sign In box.
 *
 * @param props - Props injected to the component.
 * @returns Profile update fragment component.
 */
const ProfileUpdateFragment: FunctionComponent<ProfileUpdateFragmentInterface> = (
    props: ProfileUpdateFragmentInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { i18n } = useBrandingPreference();

    return (
        <div data-componentid={ componentId }>
            <h3 className="ui header">
                { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PROFILE_UPDATE.HEADING, "Update Profile") }
            </h3>
            <div className="segment-form">
                <form className="ui large form">
                    <div className="field">
                        <label>First Name</label>
                        <div className="ui fluid input">
                            <input type="text" value="" placeholder="Enter your first name" />
                        </div>
                    </div>
                    <div className="field">
                        <label>Last Name</label>
                        <div className="ui fluid input">
                            <input type="text" value="" placeholder="Enter your last name" />
                        </div>
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <div className="ui fluid input">
                            <input type="email" value="" placeholder="Enter your email" />
                        </div>
                    </div>
                    <div className="ui divider hidden"></div>
                    <button type="button" className="ui primary fluid large button">
                        { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.PROFILE_UPDATE.BUTTON, "Continue") }
                    </button>
                </form>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
ProfileUpdateFragment.defaultProps = {
    "data-componentid": "branding-preview-profile-update-fragment"
};

export default ProfileUpdateFragment;
