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

const NumberFieldAdapter = ({ component, formState, formStateHandler, fieldErrorHandler }) => {

    const { identifier, required, label, placeholder, validations, hint } = component.config;

    const { translations } = useTranslations();
    const [ value, setValue ] = useState("");
    const { fieldErrors, validate } = useFieldValidation(validations, value);

    useEffect(() => {
        formStateHandler(component.config.identifier, value);
    }, [ value ]);

    const handleFieldValidation = (value) => {
        const isValid = validate({ identifier, required }, value);

        fieldErrorHandler(identifier, isValid ? null : fieldErrors);
    };

    const handleNumberChange = (e) => {
        const inputValue = e.target.value;

        // Allow empty string for optional fields
        if (inputValue === "" && !required) {
            setValue("");

            return;
        }

        // Only allow numeric input
        if (/^\d*\.?\d*$/.test(inputValue)) {
            setValue(inputValue);
        }
    };

    const inputIconClass = getInputIconClass(identifier);

    return (
        <>
            <label htmlFor={ identifier }>{ resolveElementText(translations, label) }</label>
            <Input
                fluid
                type="number"
                className={ inputIconClass ? "left icon" : null }
                placeholder={ resolveElementText(translations, placeholder) }
                value={ value }
                onChange={ handleNumberChange }
                onBlur={ (e) => handleFieldValidation(e.target.value) }
                name={ identifier }
                id={ identifier }
                icon={ inputIconClass }
            />
            {
                hint && ( <Hint hint={ hint } /> )
            }
            {
                <ValidationError
                    name={ identifier }
                    errors={ {
                        fieldErrors: fieldErrors,
                        formStateErrors: formState && formState.errors
                    } }
                />
            }
        </>
    );
};

NumberFieldAdapter.propTypes = {
    component: PropTypes.object.isRequired,
    fieldErrorHandler: PropTypes.func,
    formState: PropTypes.object,
    formStateHandler: PropTypes.func
};

export default NumberFieldAdapter;
