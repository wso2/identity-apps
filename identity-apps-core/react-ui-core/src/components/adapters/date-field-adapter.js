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
import { DateInput } from "semantic-ui-calendar-react";
import useFieldValidation from "../../hooks/use-field-validations";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import ValidationCriteria from "../validation-criteria";
import ValidationError from "../validation-error";

const DateFieldAdapter = ({ component, formState, formStateHandler, fieldErrorHandler }) => {

    const { identifier, required, label, placeholder, validation } = component.config;

    const { translations } = useTranslations();
    const { fieldErrors, validate } = useFieldValidation(validation);

    const [ value, setValue ] = useState("");

    useEffect(() => {
        formStateHandler(component.config.identifier, value);
    }, [ value ]);

    const handleFieldValidation = () => {
        const isValid = validate({ identifier, required }, value);

        fieldErrorHandler(identifier, isValid ? null : fieldErrors);
    };

    return (
        <div style={ { width: "100% !important" } }>
            <label htmlFor={ identifier }>{ resolveElementText(translations, label) }</label>
            <DateInput
                name={ identifier }
                placeholder={ placeholder }
                iconPosition="left"
                onChange={ (event, { value }) => setValue(value) }
                onBlur={ handleFieldValidation }
                value={ value }
                required={ required }
                clearable
                closeOnMouseLeave
                closable
            />
            {
                validation && validation.type === "CRITERIA" && validation.showValidationCriteria (
                    <ValidationCriteria validationConfig={ validation } errors={ fieldErrors } value={ value } />
                )
            }
            {
                <ValidationError
                    name={ identifier }
                    errors={ { fieldErrors: fieldErrors, formStateErrors: formState.errors  } }
                />
            }
        </div>
    );
};

DateFieldAdapter.propTypes = {
    component: PropTypes.object.isRequired,
    fieldErrorHandler: PropTypes.func.isRequired,
    formState: PropTypes.isRequired,
    formStateHandler: PropTypes.func.isRequired
};

export default DateFieldAdapter;
