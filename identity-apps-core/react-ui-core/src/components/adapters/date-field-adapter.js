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
import Hint from "../hint";
import ValidationCriteria from "../validation-criteria";
import ValidationError from "../validation-error";

const DOB_CLAIM_IDENTIFIER = "http://wso2.org/claims/dob";
const DOB_DATE_FORMAT = "YYYY-MM-DD";
const DOB_VALUE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DOB_FORMAT_ERROR = "Date of Birth is not in the correct format of YYYY-MM-DD.";
const DOB_FUTURE_DATE_ERROR = "Date of Birth cannot be a future date.";

/**
 * Parse a YYYY-MM-DD string into a Date. Returns null if the string
 * does not represent an existing calendar date (e.g. 2025-02-30).
 */
const parseDateString = (value) => {
    const parts = value.split("-").map((part) => parseInt(part, 10));
    const date = new Date(parts[0], parts[1] - 1, parts[2]);

    if (date.getFullYear() !== parts[0]
        || (date.getMonth() + 1) !== parts[1]
        || date.getDate() !== parts[2]) {

        return null;
    }

    return date;
};

/**
 * Format a Date as a YYYY-MM-DD string.
 */
const formatDateString = (date) => {
    const pad = (num) => String(num).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const DateFieldAdapter = ({ component, formState, formStateHandler, fieldErrorHandler }) => {

    const { identifier, required, label, placeholder, validations, hint } = component.config;

    const { translations } = useTranslations();
    const { fieldErrors, validate } = useFieldValidation(validations);

    const [ value, setValue ] = useState("");

    const isDOBField = identifier === DOB_CLAIM_IDENTIFIER;

    useEffect(() => {
        formStateHandler(component.config.identifier, value);
    }, [ value ]);

    /**
     * Validate a date of birth value. Returns an error message or null.
     */
    const validateDateOfBirth = (value) => {
        if (!value) {

            return null;
        }

        if (!DOB_VALUE_PATTERN.test(value)) {

            return DOB_FORMAT_ERROR;
        }

        const date = parseDateString(value);

        if (!date) {

            return DOB_FORMAT_ERROR;
        }

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (date > today) {

            return DOB_FUTURE_DATE_ERROR;
        }

        return null;
    };

    const handleFieldValidation = (value) => {
        const { errors } = validate({ identifier, required }, value);
        const combinedErrors = [ ...errors ];

        if (isDOBField) {
            const dobError = validateDateOfBirth(value);

            if (dobError) {
                combinedErrors.push(dobError);
            }
        }

        fieldErrorHandler(identifier, combinedErrors.length > 0 ? combinedErrors : null);
    };

    return (
        <div style={ { width: "100% !important" } }>
            <label htmlFor={ identifier }>{ resolveElementText(translations, label) }</label>
            <DateInput
                name={ identifier }
                placeholder={ placeholder }
                iconPosition="left"
                onChange={ (event, { value }) => {
                    setValue(value);
                    handleFieldValidation(value);
                } }
                value={ value }
                required={ required }
                dateFormat={ isDOBField ? DOB_DATE_FORMAT : undefined }
                maxDate={ isDOBField ? formatDateString(new Date()) : undefined }
                clearable
                closeOnMouseLeave
                closable
                className="mb-0"
            />
            {
                hint && ( <Hint hint={ hint } /> )
            }
            {
                validations && validations.type === "RULE" && (
                    <ValidationCriteria validationConfig={ validations } errors={ fieldErrors } value={ value } />
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
