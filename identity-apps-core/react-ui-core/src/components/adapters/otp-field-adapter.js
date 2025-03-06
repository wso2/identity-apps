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

import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Input } from "semantic-ui-react";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";

const OTPFieldAdapter = ({ component, formStateHandler, otpLength = 6 }) => {
    const { translations } = useTranslations();
    const [ otpValues, setOtpValues ] = useState(Array(otpLength).fill(""));

    useEffect(() => {
        formStateHandler(component.config.name, otpValues.join(""));
    }, [ otpValues ]);

    const handleInputChange = (index, value) => {
        const newOtpValues = [ ...otpValues ];

        newOtpValues[index] = value.replace(/[^0-9]/g, "").slice(0, 1);
        setOtpValues(newOtpValues);

        if (value && index < otpLength - 1) {
            document.getElementById(`otp-field-${index + 1}`).focus();
        }

        if (!value && index > 0) {
            document.getElementById(`otp-field-${index - 1}`).focus();
        }
    };

    const handlePaste = (event) => {
        const pastedData = event.clipboardData.getData("Text");

        if (pastedData.length === otpLength && /^[0-9]+$/.test(pastedData)) {
            const otpArray = pastedData.slice(0, otpLength).split("");

            setOtpValues(otpArray);
        }
    };

    return (
        <div className={ classNames("otp-field") }>
            <label>{ resolveElementText(translations, component.config.label) }</label>
            <div className="sms-otp-fields equal width fields" onPaste={ handlePaste }>
                { otpValues.map((_, index) => (
                    <div key={ index } className="field mt-5">
                        <Input
                            className="text-center p-3"
                            id={ `otp-field-${index}` }
                            name={ `otp-field-${index}` }
                            value={ otpValues[index] }
                            onChange={ (e) => handleInputChange(index, e.target.value) }
                            tabIndex="1"
                            placeholder="·"
                            maxLength="1"
                            autoFocus={ index === 0 }
                        />
                    </div>
                )) }
            </div>
        </div>
    );
};

OTPFieldAdapter.propTypes = {
    component: PropTypes.shape({
        config: PropTypes.shape({
            label: PropTypes.string,
            name: PropTypes.string,
            placeholder: PropTypes.string,
            value: PropTypes.string
        }).isRequired
    }).isRequired,
    formStateHandler: PropTypes.func.isRequired,
    otpLength: PropTypes.number
};

export default OTPFieldAdapter;
