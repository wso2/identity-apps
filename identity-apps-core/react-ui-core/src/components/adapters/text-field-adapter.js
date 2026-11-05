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
import React, { useEffect, useState } from "react";
import { Input } from "semantic-ui-react";
import useFieldValidation from "../../hooks/use-field-validations";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import { getInputIconClass } from "../../utils/ui-utils";
import Hint from "../hint";
import ValidationError from "../validation-error";

const TextFieldAdapter = ({ component, formState, formStateHandler, fieldErrorHandler }) => {

    const { identifier, required, label, placeholder, validations, hint } = component.config;
    const isEmailField = component.variant === "EMAIL";
    const [ value, setValue ] = useState("");
    const [ hasBlurred, setHasBlurred ] = useState(false);

    const emailValidationRule = { name: "EmailFormatValidator", type: "RULE" };
    const emailValidations = Array.isArray(validations)
        ? validations.reduce((rules, rule) => rules.concat(rule), [])
        : [];
    const hasEmailValidation = emailValidations.some((rule) => rule && rule.name === "EmailFormatValidator");
    const fieldValidations = isEmailField
        ? [ ...emailValidations, ...(hasEmailValidation ? [] : [ emailValidationRule ]) ]
        : validations;

    const { translations } = useTranslations();
    const { fieldErrors, validate } = useFieldValidation(fieldValidations);
    const hasValidationError = fieldErrors.length > 0
        || Boolean(formState && formState.errors && formState.errors[identifier]);

    useEffect(() => {
        formStateHandler(component.config.identifier, value);
    }, [ value ]);

    const handleFieldValidation = (value) => {
        const { errors, isValid } = validate({ identifier, required }, value);

        formState.isValid = isValid;
        fieldErrorHandler(identifier, isValid ? null : errors);
    };

    const handleChange = (event) => {
        const newValue = event.target.value;

        setValue(newValue);

        if (isEmailField && hasBlurred) {
            handleFieldValidation(newValue);
        }
    };

    const handleBlur = (event) => {
        if (isEmailField) {
            setHasBlurred(true);
        }

        handleFieldValidation(event.target.value);
    };

    const inputIconClass = getInputIconClass(identifier);

    return (
        <>
            <label htmlFor={ identifier }>{ resolveElementText(translations, label) }</label>
            <Input
                fluid
                aria-invalid={ hasValidationError }
                aria-describedby={ hasValidationError ? `${identifier}-error` : undefined }
                className={ inputIconClass ? "left icon" : null }
                placeholder={ resolveElementText(translations, placeholder) }
                onChange={ handleChange }
                onBlur={ handleBlur }
                name={ identifier }
                icon={ getInputIconClass(identifier) }
            />
            {
                hint && ( <Hint hint={ hint } /> )
            }
            {
                <ValidationError
                    name={ identifier }
                    errors={ {
                        fieldErrors: fieldErrors,
                        formStateErrors: formState.errors
                    } }
                />
            }
        </>
    );
};

TextFieldAdapter.propTypes = {
    component: PropTypes.object.isRequired,
    fieldErrorHandler: PropTypes.func,
    formState: PropTypes.object,
    formStateHandler: PropTypes.func
};

export default TextFieldAdapter;
