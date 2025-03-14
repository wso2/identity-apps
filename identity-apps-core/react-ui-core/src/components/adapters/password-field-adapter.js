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
import useFieldValidation from "../../hooks/use-field-validations";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import ValidationCriteria from "../validation-criteria";
import ValidationError from "../validation-error";

const PasswordFieldAdapter = ({ component, formState, formStateHandler, formErrorHandler }) => {

    const CONFIRM_PASSWORD_RULE = [ [ {
        "conditions": [ {
            "key": "confirm.password",
            "value": "Must match with the password"
        } ],
        "name": "ConfirmPasswordValidator",
        "type": "RULE"
    } ] ];

    const { identifier, required, label, placeholder, validations } = component.config;
    const { translations } = useTranslations();
    const { fieldErrors: passwordErrors, validate } = useFieldValidation(validations);
    const {
        fieldErrors: confirmPasswordErrors,
        validate: validateConfirmPassword
    } = useFieldValidation(CONFIRM_PASSWORD_RULE);


    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ showPassword, setShowPassword ] = useState(false);

    const isPasswordField = identifier === "password";
    const isConfirmPasswordField = identifier === "confirmPassword";

    useEffect(() => {
        if (isPasswordField) {
            formStateHandler(identifier, password);
            validate({ identifier, required }, password);
            formErrorHandler(identifier, passwordErrors);

            if (formState.values.confirmPassword) {
                validateConfirmPassword(
                    { identifier: "confirmPassword", required },
                    formState.values.confirmPassword,
                    password
                );
                formErrorHandler("confirmPassword", confirmPasswordErrors);
            }
        }
    }, [ password ]);

    useEffect(() => {
        if (isConfirmPasswordField) {
            formStateHandler(identifier, confirmPassword);
            validateConfirmPassword(
                { identifier, required },
                confirmPassword,
                formState.values.password
            );
            formErrorHandler(identifier, confirmPasswordErrors);
        }
    }, [ confirmPassword, password ]);

    const handlePasswordChange = (value) => {
        setPassword(value);
    };

    const handleConfirmPasswordChange = (value) => {
        setConfirmPassword(value);
    };

    const resolveFieldCriteria = () => {
        if (isConfirmPasswordField) {
            return (
                <ValidationCriteria
                    validationConfig={ CONFIRM_PASSWORD_RULE }
                    errors={ confirmPasswordErrors }
                    value={ confirmPassword }
                />
            );
        } else {
            return validations && validations.length > 0 ? (
                <ValidationCriteria validationConfig={ validations } errors={ passwordErrors } value={ password } />
            ) : (
                <ValidationError
                    name={ identifier }
                    errors={ { fieldErrors: passwordErrors, formStateErrors: formState.errors } }
                />
            );
        }
    };

    const renderPasswordInput = (fieldValue, onChange) => (
        <>
            <label>{ resolveElementText(translations, label) }</label>
            <div className="ui fluid left icon input addon-wrapper">
                <input
                    className="form-control"
                    name={ identifier }
                    type={ showPassword ? "text" : "password" }
                    value={ fieldValue }
                    placeholder={ resolveElementText(translations, placeholder) }
                    onChange={ (e) => onChange(e.target.value) }
                />
                <i aria-hidden="true" className="lock icon"></i>
                <i
                    className={ classNames("eye icon right-align password-toggle", { slash: !showPassword }) }
                    onClick={ () => setShowPassword(!showPassword) }
                />
            </div>
            { resolveFieldCriteria() }
        </>
    );

    return (
        <>
            { isPasswordField &&
                renderPasswordInput(password, handlePasswordChange)
            }
            { isConfirmPasswordField &&
                renderPasswordInput(confirmPassword, handleConfirmPasswordChange)
            }
        </>
    );
};

PasswordFieldAdapter.propTypes = {
    component: PropTypes.shape({
        config: PropTypes.shape({
            identifier: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            placeholder: PropTypes.string.isRequired,
            required: PropTypes.boolean,
            validations: PropTypes.object
        }).isRequired
    }).isRequired,
    formErrorHandler: PropTypes.func.isRequired,
    formState: PropTypes.object.isRequired,
    formStateHandler: PropTypes.func.isRequired
};

export default PasswordFieldAdapter;
