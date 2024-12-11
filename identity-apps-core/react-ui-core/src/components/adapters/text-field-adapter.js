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
import { getInputIconClass } from "../../utils/ui-utils";
import ValidationCriteria from "../field-validation";

const TextFieldAdapter = ({ component, formStateHandler, formErrorHandler }) => {

    const { name, required, styles, label, placeholder, rest, validation } = component.properties;

    const { translations } = useTranslations();
    const { fieldErrors, validate } = useFieldValidation(validation);

    const [ value, setValue ] = useState("");

    useEffect(() => {
        formStateHandler(component.properties.name, value);
    }, [ value ]);

    const handleFieldValidation = (value) => {
        if (validation) {
            validate(value);
            formErrorHandler(component.properties.name, fieldErrors);
        }
    };

    const inputIconClass = getInputIconClass(name);

    return (
        <div className={ classNames("field", required ? "required" : null) } style={ styles }>
            <label htmlFor={ name }>{ getTranslationByKey(translations, label) }</label>
            <div className={ classNames("ui fluid input", inputIconClass ? "left icon" : null) }>
                <input
                    placeholder={ getTranslationByKey(translations, placeholder) }
                    onChange={ (e) => setValue(e.target.value) }
                    onBlur={ (e) => handleFieldValidation(e.target.value) }
                    required={ required }
                    { ...rest }
                />
                {
                    inputIconClass
                        ? <i aria-hidden="true" className={ `${ getInputIconClass(name) } icon` }></i>
                        : null
                }
            </div>
            { validation && (
                <ValidationCriteria validationConfig={ validation } errors={ fieldErrors } value={ value } />
            ) }
        </div>
    );
};

TextFieldAdapter.propTypes = {
    component: PropTypes.object.isRequired,
    formStateHandler: PropTypes.func.isRequired
};

export default TextFieldAdapter;
