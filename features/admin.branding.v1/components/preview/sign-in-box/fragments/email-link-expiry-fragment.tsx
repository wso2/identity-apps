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
 * Proptypes for the email-link-expiry fragment of login screen skeleton.
 */
export type EmailLinkExpiryFragmentInterface = IdentifiableComponentInterface;

/**
 * Email link expiry fragment component for the branding preview of Email Link Expiry screen.
 *
 * @param props - Props injected to the component.
 * @returns Email link expiry fragment component.
 */
const EmailLinkExpiryFragment: FunctionComponent<EmailLinkExpiryFragmentInterface> = (
    props: EmailLinkExpiryFragmentInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { i18n } = useBrandingPreference();

    return (
        <div data-componentid={ componentId } >
            <h2 style={ { color: "#d95858", height: "200px" } } className="mt-5">
                { i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.EMAIL_LINK_EXPIRY.MESSAGE,
                    "This link has expired.") }
            </h2>
            <div>
                <button className="ui primary button mb-2">Go Back</button>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
EmailLinkExpiryFragment.defaultProps = {
    "data-componentid": "branding-preview-email-link-expiry-fragment"
};

export default EmailLinkExpiryFragment;
