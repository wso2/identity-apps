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

import { AppState } from "@wso2is/admin.core.v1/store";
import { BrandingPreferenceInterface } from "@wso2is/common.branding.v1/models";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useSelector } from "react-redux";
import { CustomTextPreferenceConstants } from "../../../../../constants/custom-text-preference-constants";
import useBrandingPreference from "../../../../../hooks/use-branding-preference";

/**
 * Proptypes for the username-recovery-success-email fragment of login screen skeleton.
 */
interface UsernameRecoverySuccessEmailFragmentInterface extends IdentifiableComponentInterface {
    brandingPreference: BrandingPreferenceInterface;
}

/**
 * Username recovery success email fragment component for the branding preview of Username Recovery box.
 *
 * @param props - Props injected to the component.
 * @returns Username recovery fragment component.
 */
const UsernameRecoverySuccessEmailFragment: FunctionComponent<UsernameRecoverySuccessEmailFragmentInterface> = (
    props: UsernameRecoverySuccessEmailFragmentInterface
): ReactElement => {
    const {
        brandingPreference,
        ["data-componentid"]: componentId = "username-recovery-success-email"
    } = props;

    const { i18n } = useBrandingPreference();
    const supportEmail: string = useSelector((state: AppState) => {
        return state.config.deployment.extensions?.supportEmail as string;
    });

    return (
        <div data-componentid={ componentId } className="ui green mt-3 attached">
            <h3 className="ui header text-center slogan-message mt-4 mb-6" >{ i18n(CustomTextPreferenceConstants.
                TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_SUCCESS_EMAIL.HEADING, "Check Your Email") }
            </h3>
            <p className="portal-tagline-description">
                { i18n(
                    CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_SUCCESS_EMAIL.BODY,
                    "Username recovery details have been sent to the email provided. If the email is not " +
                    "received,try again using different information."
                ) }
                <br/>
                <br/>
                <br/>
                <i className="caret left icon primary"/>
                <a>
                    { i18n(
                        CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.USERNAME_RECOVERY_SUCCESS_EMAIL.BUTTON,
                        "Back to application"
                    ) }
                </a>
                <p className="ui portal-tagline-description">
                    For further assistance, write to
                    <br/>
                    <a>
                        <span className="orange-text-color button">
                            { brandingPreference.organizationDetails.supportEmail || supportEmail }
                        </span>
                    </a>
                </p>
            </p>
        </div>
    );
};

export default UsernameRecoverySuccessEmailFragment;
