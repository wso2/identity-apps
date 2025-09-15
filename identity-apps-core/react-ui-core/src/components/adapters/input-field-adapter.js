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
import CheckboxFieldAdapter from "./checkbox-field-adapter";
import CountryFieldAdapter from "./country-field-adapter";
import DateFieldAdapter from "./date-field-adapter";
import NumberFieldAdapter from "./number-field-adapter";
import OTPFieldAdapter from "./otp-field-adapter";
import PasswordFieldAdapter from "./password-field-adapter";
import PhoneNumberFieldAdapter from "./phone-number-field-adapter";
import TextFieldAdapter from "./text-field-adapter";

const InputFieldAdapter = ({ component, formState, formStateHandler, formFieldError }) => {
    switch (component.variant) {
        case "TEXT":
            return (
                <TextFieldAdapter
                    component={ component }
                    formState={ formState }
                    formStateHandler={ formStateHandler }
                    fieldErrorHandler={ formFieldError }
                />
            );
        case "EMAIL":
            return (
                <TextFieldAdapter
                    component={ component }
                    formState={ formState }
                    formStateHandler={ formStateHandler }
                    fieldErrorHandler={ formFieldError }
                />
            );
        case "DATE":
            return (
                <DateFieldAdapter
                    component={ component }
                    formState={ formState }
                    formStateHandler={ formStateHandler }
                    fieldErrorHandler={ formFieldError }
                />
            );
        case "COUNTRY":
            return (
                <CountryFieldAdapter
                    component={ component }
                    formState={ formState }
                    formStateHandler={ formStateHandler }
                    fieldErrorHandler={ formFieldError }
                />
            );
        case "PASSWORD":
            return (
                <PasswordFieldAdapter
                    component={ component }
                    formState={ formState }
                    formStateHandler={ formStateHandler }
                    formErrorHandler={ formFieldError }
                />
            );
        case "TELEPHONE":
            return (
                <PhoneNumberFieldAdapter
                    component={ component }
                    formState={ formState }
                    formStateHandler={ formStateHandler }
                    fieldErrorHandler={ formFieldError }
                />
            );
        case "OTP":
            return (
                <OTPFieldAdapter
                    component={ component }
                    formStateHandler={ formStateHandler }
                />
            );
        case "CHECKBOX":
            return (
                <CheckboxFieldAdapter
                    component={ component }
                    formStateHandler={ formStateHandler }
                />
            );
        case "NUMBER":
            return (
                <NumberFieldAdapter
                    component={ component }
                    formState={ formState }
                    formStateHandler={ formStateHandler }
                    fieldErrorHandler={ formFieldError }
                />
            );
        default:
            return null;
    }
};

InputFieldAdapter.propTypes = {
    component: PropTypes.object.isRequired,
    formFieldError: PropTypes.func.isRequired,
    formState: PropTypes.isRequired,
    formStateHandler: PropTypes.func.isRequired
};

export default InputFieldAdapter;
