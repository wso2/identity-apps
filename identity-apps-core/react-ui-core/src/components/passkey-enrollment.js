/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import PropTypes from "prop-types";
import React from "react";
import { Message } from "semantic-ui-react";
import PasskeyEnrollmentIllustration from "../assets/passkey-enrollment-illustration.svg";
import "./passkey-enrollment.css";

const PasskeyEnrollment = ({ passkeyError }) => {
    return (
        <div className="passkey-enrollment-container">
            <div className="passkey-enrollment">
                <div>
                    <h3>Passkey Verification</h3>
                    <PasskeyEnrollmentIllustration/>
                    { passkeyError ? (
                        <Message negative className="mb-4">
                            Passkey enrollment cancelled or failed. Please try again.
                        </Message>
                    ) : (
                        <div className="mt-4">
                            <p>
                                Please follow the browser or device prompt to register your passkey.
                            </p>
                            <Message info>
                                Make sure your device supports passkeys and is ready for enrollment.
                            </Message>
                        </div>
                    ) }
                </div>
                { passkeyError && (
                    <button
                        onClick={ () => window.location.reload() }
                        className="ui primary fluid large button"
                    >
                        Try Again
                    </button>
                ) }
            </div>
        </div>
    );
};

PasskeyEnrollment.propTypes = {
    handledPasskeyRetry: PropTypes.func.isRequired,
    passkeyError: PropTypes.string
};

export default PasskeyEnrollment;
