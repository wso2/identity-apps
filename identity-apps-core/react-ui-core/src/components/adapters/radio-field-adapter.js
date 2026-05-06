/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import { Form } from "semantic-ui-react";
import useFieldValidation from "../../hooks/use-field-validations";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import Hint from "../hint";
import ValidationError from "../validation-error";

const RadioFieldAdapter = ({ component, formState, formStateHandler, fieldErrorHandler }) => {

    const { identifier, label, hint, validations, required, defaultValue, options } = component.config;
    const { translations } = useTranslations();
    const [ value, setValue ] = useState(defaultValue || "");
    const { fieldErrors, validate } = useFieldValidation(validations, value);

    useEffect(() => {
        formStateHandler(identifier, value);
    }, [ identifier, value ]);

    const handleFieldValidation = (selectedValue) => {
        const { errors, isValid } = validate({ identifier, required }, selectedValue);

        fieldErrorHandler(identifier, isValid ? null : errors);
    };

    const handleChange = (e, { value: selectedValue }) => {
        setValue(selectedValue);
        handleFieldValidation(selectedValue);
        formStateHandler(identifier, selectedValue);
    };

    return (
        <div>
            <label>{ resolveElementText(translations, label) }</label>
            <Form.Group grouped>
                {
                    options && options.map((option) => (
                        <Form.Radio
                            key={ option.key }
                            label={ resolveElementText(translations, option.label) }
                            name={ identifier }
                            value={ option.value }
                            checked={ value === option.value }
                            onChange={ handleChange }
                        />
                    ))
                }
            </Form.Group>
            {
                hint && ( <Hint hint={ hint } /> )
            }
            {
                <ValidationError
                    name={ identifier }
                    errors={ { fieldErrors: fieldErrors, formStateErrors: formState.errors } }
                />
            }
        </div>
    );
};

RadioFieldAdapter.propTypes = {
    component: PropTypes.object.isRequired,
    fieldErrorHandler: PropTypes.func.isRequired,
    formState: PropTypes.object.isRequired,
    formStateHandler: PropTypes.func.isRequired
};

export default RadioFieldAdapter;
