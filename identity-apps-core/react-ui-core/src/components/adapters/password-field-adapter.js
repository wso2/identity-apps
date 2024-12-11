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
import { getTranslationByKey } from "../../utils/i18n-utils";
import ValidationCriteria from "../field-validation";

const PasswordFieldAdapter = ({ component, formStateHandler, formErrorHandler }) => {

    const { required, name, label, placeholder, rest, validation } = component.properties;

    const { translations } = useTranslations();
    const { fieldErrors, validate } = useFieldValidation(validation);

    const [ password, setPassword ] = useState("");
    const [ showPassword, setShowPassword ] = useState(false);

    useEffect(() => {
        formStateHandler(name, password);
    }, [ password ]);

    const handleFieldValidation = (value) => {
        if (validation) {
            validate(value);
            formErrorHandler(component.properties.name, fieldErrors);
        }
    };

    return (
        <div
            id="passwordField"
            className={ classNames("field", required ? "required" : null) }
        >
            <label>{ getTranslationByKey(translations, label) }</label>
            <div className="ui fluid left icon input addon-wrapper">
                <input
                    className="form-control"
                    name={ name }
                    type={ showPassword ? "text" : "password" }
                    id="password"
                    value={ password }
                    placeholder={ getTranslationByKey(translations, placeholder) }
                    onChange={ (e) => setPassword(e.target.value) }
                    onBlur={ (e) => handleFieldValidation(e.target.value) }
                    { ...rest }
                />
                <i aria-hidden="true" className="lock icon"></i>
                <i
                    id="password-eye"
                    className={ classNames("eye icon right-align password-toggle", { "slash": !showPassword } ) }
                    onClick={ () => setShowPassword(!showPassword) }
                />
            </div>
            { validation && (
                <ValidationCriteria validationConfig={ validation } errors={ fieldErrors } value={ password } />
            ) }
            <div className="ui divider hidden"></div>
        </div>
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
