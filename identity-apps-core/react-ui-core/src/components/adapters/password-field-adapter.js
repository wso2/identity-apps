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

import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import useFieldValidation from "../../hooks/use-field-validations";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import ValidationCriteria from "../validation-criteria";
import ValidationError from "../validation-error";

const PasswordFieldAdapter = ({ component, formState, formStateHandler, formErrorHandler }) => {

    const { required, name, label, placeholder, rest, validation } = component.properties;

    const { translations } = useTranslations();
    const { fieldErrors, validate } = useFieldValidation(validation);

    const fieldError = formState && formState.errors && formState.errors.length > 0 &&
        formState.errors.filter(error => error.label === component.properties.name);
    const error = fieldError ? fieldError[0] && fieldError[0].error :
        fieldErrors && fieldErrors.length >= 0 && fieldErrors[0] && fieldErrors[0].error;

    const [ password, setPassword ] = useState("");
    const [ showPassword, setShowPassword ] = useState(false);

    useEffect(() => {
        formStateHandler(name, password);
    }, [ password ]);

    const handlePasswordChange = (value) => {
        setPassword(value);

        if (validation) {
            validate(value);
            formErrorHandler(component.properties.name, fieldErrors);
        }
    };

    return (
        <>
            <div
                id="passwordField"
                className={ classNames("field", required ? "required" : null) }
            >
                <label>{ resolveElementText(translations, label) }</label>
                <div className="ui fluid left icon input addon-wrapper">
                    <input
                        className="form-control"
                        name={ name }
                        type={ showPassword ? "text" : "password" }
                        id="password"
                        value={ password }
                        placeholder={ resolveElementText(translations, placeholder) }
                        onChange={ (e) => handlePasswordChange(e.target.value) }
                        { ...rest }
                    />
                    <i aria-hidden="true" className="lock icon"></i>
                    <i
                        id="password-eye"
                        className={ classNames("eye icon right-align password-toggle", { "slash": !showPassword } ) }
                        onClick={ () => setShowPassword(!showPassword) }
                    />
                </div>
                {
                    validation && validation.type === "CRITERIA" && validation.showValidationCriteria (
                        <ValidationCriteria validationConfig={ validation } errors={ fieldErrors } value={ password } />
                    )
                }
                {
                    (fieldErrors.length > 0 || formState.errors.length > 0) &&  (
                        <ValidationError error={ error } />
                    )
                }
                <div className="ui divider hidden"></div>
            </div>
        </>
    );
};

PasswordFieldAdapter.propTypes = {
    component: PropTypes.shape({
        properties: PropTypes.shape({
            label: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            placeholder: PropTypes.string.isRequired,
            value: PropTypes.string,
            policies: PropTypes.arrayOf(
                PropTypes.shape({
                    description: PropTypes.string.isRequired,
                    key: PropTypes.string.isRequired,
                    policy: PropTypes.string.isRequired,
                    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired
                })
            ).isRequired,
            policyCriteria: PropTypes.arrayOf(
                PropTypes.shape({
                    appliesTo: PropTypes.arrayOf(PropTypes.string).isRequired,
                    criteria: PropTypes.string.isRequired,
                    description: PropTypes.string.isRequired
                })
            ).isRequired,
            showValidationCriteria: PropTypes.bool
        }).isRequired
    }).isRequired,
    formStateHandler: PropTypes.func.isRequired
};

export default PasswordFieldAdapter;
