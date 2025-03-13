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
import useFieldValidation from "../../hooks/use-field-validations";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import ValidationError from "../validation-error";

const OTPFieldAdapter = ({ component, formState, formStateHandler, fieldErrorHandler, validations }) => {
    const { placeholder, identifier, label, length, required } = component.config;
    
    const { translations } = useTranslations();
    const { fieldErrors, validate } = useFieldValidation(validations, otpValues ? otpValues.join("") : "");

    const [ otpLength, ] = useState(9);
    const [ otpValues, setOtpValues ] = useState(Array(otpLength).fill(""));
    const [ showOTP, setShowOTP ] = useState(false);

    useEffect(() => {
        formStateHandler(identifier, otpValues.join(""));
    }, [ otpValues ]);

    /**
     * Handle field validation.
     * 
     * @param {*} value 
     */
    const handleFieldValidation = (value) => {
        const isValid = validate({ identifier, required }, value);

        fieldErrorHandler(identifier, isValid ? null : fieldErrors);
    };

    /**
     * Handle each digit input change.
     *
     * @param {number} index - The index of the OTP box being edited.
     * @param {string} value - The new input value for that OTP box.
     */
    const handleInputChange = (index, value) => {
        const cleaned = value.replace(/[^0-9]/g, "").slice(0, 1);
        const newOtpValues = [ ...otpValues ];

        newOtpValues[index] = cleaned;
        setOtpValues(newOtpValues);
    };

    /**
     * On keyUp, decide whether to move focus to next or previous input.
     *
     * @param {object} event - The keyboard event.
     * @param {number} index - The index of the current field.
     */
    const movetoNext = (event, index) => {
        const key = event.keyCode || event.charCode;
        const currentValue = event.target.value;

        if ((key === 8 || key === 46) && !currentValue && index > 0) {
            document.getElementById(`otp-field-${ index - 1 }`)?.focus();
            return;
        }
        if (currentValue && index < otpLength - 1) {
            document.getElementById(`otp-field-${ index + 1 }`)?.focus();
        }
    };

    /**
     * Handle full paste of OTP codes.
     *
     * @param {object} event - The paste event.
     */
    const handlePaste = (event) => {
        const pastedData = event.clipboardData.getData("Text");

        if (pastedData.length === otpLength && /^[0-9]+$/.test(pastedData)) {
            setOtpValues(pastedData.split(""));
        }
    };

    return (
        <>
            <label>{ resolveElementText(translations, label) }</label>
            {
                otpLength <= 6 ? (
                    <div
                        className="sms-otp-fields equal width fields"
                        onPaste={ handlePaste }
                        style={{ display: "flex", gap: "1rem", margin: "auto 0" }}
                    >
                        <input
                            hidden
                            type="text"
                            name={ identifier }
                            className="form-control"
                            value={ otpValues.join("") }
                            required={ required }
                        />
                        {
                            otpValues.map((value, i) => {
                                return (
                                    <Input
                                        key={ i }
                                        id={ `otp-field-${ i }` }
                                        className="text-center"
                                        value={ value }
                                        onChange={ (e) => handleInputChange(i, e.target.value) }
                                        onKeyUp={ (e) => movetoNext(e, i) }
                                        placeholder="·"
                                        maxLength="1"
                                        style={{
                                            width: "3rem",
                                            textAlign: "center"
                                        }}
                                    />
                                );
                            })
                        }
                    </div>
                ) : (
                    <div className="ui fluid left icon input addon-wrapper">
                        <input
                            className="form-control"
                            name={ identifier }
                            type={ setShowOTP ? "text" : "password" }
                            placeholder={ resolveElementText(translations, placeholder) }
                            required={ required }
                            onChange={ (e) => {
                                const cleaned = e.target.value.replace(/[^0-9]/g, "").slice(0, otpLength);
                                setOtpValues(cleaned.split(""));
                            } }
                            onBlur={ (e) => handleFieldValidation(e.target.value) }
                        />
                        <i
                            className={ classNames("eye icon right-align password-toggle", { slash: !showOTP }) }
                            onClick={ () => setShowOTP(!showOTP) }
                        />
                    </div>
                )
            }
            {
                <ValidationError
                    name={ identifier }
                    errors={ { formStateErrors: formState ? formState.errors : [], fieldErrors: fieldErrors } }
                />
            }
        </>
    );
};

OTPFieldAdapter.propTypes = {
    component: PropTypes.shape({
        config: PropTypes.shape({
            label: PropTypes.string,
            identifier: PropTypes.string
        }).isRequired
    }).isRequired,
    formStateHandler: PropTypes.func.isRequired,
    otpLength: PropTypes.number
};

export default OTPFieldAdapter;
