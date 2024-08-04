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
 * Proptypes for the sms-otp fragment of login screen skeleton.
 */
export type SMSOTPInterface = IdentifiableComponentInterface;

/**
 * SMS OTP fragment component for the branding preview of Sign In box.
 *
 * @param props - Props injected to the component.
 * @returns SMS OTP fragment component.
 */
const SMSOTP: FunctionComponent<SMSOTPInterface> = (props: SMSOTPInterface): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { i18n } = useBrandingPreference();

    return (
        <div className="sms-otp-portal-layout" data-componentid={ componentId }>
            <h2>{ i18n(CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.SMS_OTP.HEADING, "OTP Verification") }</h2>
            <div className="ui divider hidden" />
            <div className="segment-form">
                <form className="ui large form" id="codeForm" name="codeForm" method="POST">
                    <div className="field">
                        <label htmlFor="password">Enter the code sent to your mobile phone (******3830)</label>
                        <div className="sms-otp-fields equal width fields">
                            <div className="field mt-5">
                                <input
                                    className="text-center p-3"
                                    id="pincode-1"
                                    name="pincode-1"
                                    placeholder="·"
                                    maxLength={ 1 }
                                />
                            </div>

                            <div className="field mt-5">
                                <input
                                    className="text-center p-3"
                                    id="pincode-2"
                                    name="pincode-2"
                                    placeholder="·"
                                    maxLength={ 1 }
                                />
                            </div>

                            <div className="field mt-5">
                                <input
                                    className="text-center p-3"
                                    id="pincode-3"
                                    name="pincode-3"
                                    placeholder="·"
                                    maxLength={ 1 }
                                />
                            </div>

                            <div className="field mt-5">
                                <input
                                    className="text-center p-3"
                                    id="pincode-4"
                                    name="pincode-4"
                                    placeholder="·"
                                    maxLength={ 1 }
                                />
                            </div>

                            <div className="field mt-5">
                                <input
                                    className="text-center p-3"
                                    id="pincode-5"
                                    name="pincode-5"
                                    placeholder="·"
                                    maxLength={ 1 }
                                />
                            </div>

                            <div className="field mt-5">
                                <input
                                    className="text-center p-3"
                                    id="pincode-6"
                                    name="pincode-6"
                                    placeholder="·"
                                    maxLength={ 1 }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="ui divider hidden"></div>
                    <div className="buttons">
                        <div>
                            <input
                                type="button"
                                id="subButton"
                                value="Continue"
                                className="ui primary fluid large button"
                            />
                        </div>

                        <button type="button" className="ui fluid large button secondary mt-2" id="resend">
                            Resend Code
                        </button>
                        <a className="ui fluid large button secondary mt-2" id="goBackLink">
                            Choose a different option
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
SMSOTP.defaultProps = {
    "data-componentid": "branding-preview-sms-otp-fragment"
};

export default SMSOTP;
