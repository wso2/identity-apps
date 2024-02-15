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
    ReactElement
} from "react";
import BasicAuthFragment from "./fragments/basic-auth-fragment";
import CommonFragment from "./fragments/common-fragment";
import EmailOTPFragment from "./fragments/email-otp-fragment";
import PasswordRecoveryFragment from "./fragments/password-recovery-fragment";
import PasswordResetFragment from "./fragments/password-reset-fragment";
import PasswordResetSuccessFragment from "./fragments/password-reset-success-fragment";
import SignUpFragment from "./fragments/sign-up-fragment";
import SMSOTPFragment from "./fragments/sms-otp-fragment";
import TOTPFragment from "./fragments/totp-fragment";
import useBrandingPreference from "../../../hooks/use-branding-preference";
import { BrandingPreferenceInterface, PreviewScreenType } from "../../../models";

/**
 * Proptypes for the login box component of login screen skeleton.
 */
interface SignInBoxInterface extends IdentifiableComponentInterface {
    /**
     * Branding preferences object.
     */
    brandingPreference: BrandingPreferenceInterface;
}

/**
 * Login Box Component.
 *
 * @param props - Props injected to the component.
 * @returns Login Box Component.
 */
const SignInBox: FunctionComponent<SignInBoxInterface> = (
    props: SignInBoxInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;

    const { selectedScreen } = useBrandingPreference();

    const renderFragment = (): ReactElement => {
        if (selectedScreen === PreviewScreenType.COMMON) {
            return <CommonFragment />;
        } else if (selectedScreen === PreviewScreenType.LOGIN) {
            return <BasicAuthFragment />;
        } else if (selectedScreen === PreviewScreenType.SIGN_UP) {
            return <SignUpFragment />;
        } else if (selectedScreen === PreviewScreenType.EMAIL_OTP) {
            return <EmailOTPFragment />;
        } else if (selectedScreen === PreviewScreenType.SMS_OTP) {
            return <SMSOTPFragment />;
        } else if (selectedScreen === PreviewScreenType.TOTP) {
            return <TOTPFragment />;
        } else if (selectedScreen === PreviewScreenType.PASSWORD_RECOVERY) {
            return <PasswordRecoveryFragment />;
        } else if (selectedScreen === PreviewScreenType.PASSWORD_RESET) {
            return <PasswordResetFragment />;
        } else if (selectedScreen === PreviewScreenType.PASSWORD_RESET_SUCCESS) {
            return <PasswordResetSuccessFragment />;
        }
    };

    return (
        <div className="ui segment" data-componentid = { componentId }>
            { renderFragment() }
        </div>
    );
};

/**
 * Default props for the component.
 */
SignInBox.defaultProps = {
    "data-componentid": "login-screen-skeleton-login-box"
};

export default SignInBox;
