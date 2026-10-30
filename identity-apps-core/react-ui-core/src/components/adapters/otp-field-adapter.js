/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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
import React, { useEffect, useRef, useState } from "react";
import useFieldValidation from "../../hooks/use-field-validations";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import Hint from "../hint";
import ValidationError from "../validation-error";

/**
 * Strips characters that cannot be part of an OTP (whitespace, separators, etc.)
 * so that pasted or OS-autofilled codes such as "123 456" are accepted.
 *
 * @param {string} value - Raw input value.
 * @param {number} maxLength - Maximum OTP length.
 * @returns {string} Sanitized OTP value.
 */
const sanitizeOtp = (value, maxLength) => value.replace(/[^a-zA-Z0-9]/g, "").slice(0, maxLength);

const OTPFieldAdapter = ({ component, formState, formStateHandler, fieldErrorHandler, validations }) => {
    const { hint, identifier, label, length, placeholder, required } = component.config;

    const otpLength = length ? length : 6;
    const isSegmented = otpLength <= 6;

    const [ otpValue, setOtpValue ] = useState("");
    const [ isFocused, setIsFocused ] = useState(false);
    const [ showOTP, setShowOTP ] = useState(false);
    const otpInputRef = useRef(null);

    const { translations } = useTranslations();
    const { fieldErrors, validate } = useFieldValidation(validations, otpValue);

    useEffect(() => {
        formStateHandler(identifier, otpValue);
    }, [ otpValue ]);

    /**
     * Handle field validation.
     */
    const handleFieldValidation = () => {
        const { erros: errors, isValid } = validate({ identifier, required }, otpValue);

        fieldErrorHandler(identifier, isValid ? null : errors);
    };

    /**
     * Handle typed, autofilled, or pasted input on the OTP field.
     *
     * @param {object} event - The change event.
     */
    const handleChange = (event) => {
        setOtpValue(sanitizeOtp(event.target.value, otpLength));
    };

    /**
     * Handle paste of OTP codes. The default paste is prevented so that a code with
     * surrounding whitespace or separators is not truncated by the max length.
     *
     * @param {object} event - The paste event.
     */
    const handlePaste = (event) => {
        const pastedData = sanitizeOtp((event.clipboardData || window.clipboardData).getData("Text"), otpLength);

        event.preventDefault();

        if (pastedData) {
            setOtpValue(pastedData);
        }
    };

    /**
     * Keep the caret pinned to the end of the overlay input, since the digit boxes
     * only support appending and deleting from the end.
     */
    const handleSelect = () => {
        const input = otpInputRef.current;

        if (input && (input.selectionStart !== input.value.length || input.selectionEnd !== input.value.length)) {
            input.setSelectionRange(input.value.length, input.value.length);
        }
    };

    const otpInputProps = {
        autoCapitalize: "off",
        autoComplete: "one-time-code",
        autoCorrect: "off",
        name: identifier,
        onBlur: () => {
            setIsFocused(false);
            handleFieldValidation();
        },
        onChange: handleChange,
        onPaste: handlePaste,
        required: required,
        spellCheck: false,
        value: otpValue
    };

    return (
        <>
            <label htmlFor={ `${ identifier }-otp-input` }>{ resolveElementText(translations, label) }</label>
            {
                isSegmented ? (
                    <div
                        className="sms-otp-fields equal width fields segmented-otp-field"
                        style={ { display: "flex", gap: "0.8rem", margin: "auto 0" } }
                    >
                        <input
                            { ...otpInputProps }
                            ref={ otpInputRef }
                            id={ `${ identifier }-otp-input` }
                            type="text"
                            className="segmented-otp-input"
                            maxLength={ otpLength }
                            onFocus={ () => setIsFocused(true) }
                            onSelect={ handleSelect }
                            onCopy={ (e) => e.preventDefault() }
                            onCut={ (e) => e.preventDefault() }
                        />
                        {
                            Array.from({ length: otpLength }, (_, i) => (
                                <div
                                    key={ i }
                                    id={ `pincode-${ i + 1 }` }
                                    aria-hidden="true"
                                    className={ classNames("text-center p-1 pb-3 pt-3", {
                                        "active-pincode": isFocused && i === otpValue.length
                                    }) }
                                    style={ { width: "3.1rem" } }
                                >
                                    { otpValue[i] || "·" }
                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <div className="ui fluid right icon input addon-wrapper">
                        <input
                            { ...otpInputProps }
                            id={ `${ identifier }-otp-input` }
                            className="form-control"
                            type={ showOTP ? "text" : "password" }
                            placeholder={ resolveElementText(translations, placeholder) }
                        />
                        <i
                            className={ classNames("eye icon right-align password-toggle", { slash: !showOTP }) }
                            onClick={ () => setShowOTP(!showOTP) }
                        />
                    </div>
                )
            }
            {
                hint && ( <Hint hint={ hint } /> )
            }
            {
                <ValidationError
                    name={ identifier }
                    errors={ { fieldErrors: fieldErrors, formStateErrors: formState ? formState.errors : [] } }
                />
            }
        </>
    );
};

OTPFieldAdapter.propTypes = {
    component: PropTypes.shape({
        config: PropTypes.shape({
            hint: PropTypes.string,
            identifier: PropTypes.string,
            label: PropTypes.string,
            length: PropTypes.number,
            placeholder: PropTypes.string,
            required: PropTypes.bool
        }).isRequired
    }).isRequired,
    fieldErrorHandler: PropTypes.func,
    formState: PropTypes.object,
    formStateHandler: PropTypes.func.isRequired,
    otpLength: PropTypes.number,
    validations: PropTypes.object
};

export default OTPFieldAdapter;
