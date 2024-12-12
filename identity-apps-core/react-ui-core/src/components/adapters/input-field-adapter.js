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

import PropTypes from "prop-types";
import React from "react";
import CountryFieldAdapter from "./country-field-adapter";
import OTPFieldAdapter from "./otp-field-adapter";
import PasswordFieldAdapter from "./password-field-adapter";
import TextFieldAdapter from "./text-field-adapter";

const InputFieldAdapter = ({ component, formStateHandler, formErrorHandler }) => {

    switch (component.variant) {
        case "TEXT":
            return (
                <TextFieldAdapter
                    component={ component }
                    formStateHandler={ formStateHandler }
                    formErrorHandler={ formErrorHandler }
                />
            );
        case "DATE":
            return <CountryFieldAdapter component={ component } formStateHandler={ formStateHandler } />;
        case "PASSWORD":
            return (
                <PasswordFieldAdapter
                    component={ component }
                    formStateHandler={ formStateHandler }
                />
            );
        case "OTP":
            return (
                <OTPFieldAdapter
                    component={ component }
                    formStateHandler={ formStateHandler }
                />
            );
        default:
            return null;
    }
};

InputFieldAdapter.propTypes = {
    component: PropTypes.object.isRequired,
    formState: PropTypes.object.isRequired,
    formStateHandler: PropTypes.func.isRequired
};

export default InputFieldAdapter;
