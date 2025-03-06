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
import { Dropdown } from "semantic-ui-react";
import countryData from "../../data/country-data.js";
import useFieldValidation from "../../hooks/use-field-validations";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import ValidationCriteria from "../validation-criteria";
import ValidationError from "../validation-error";

const CountryFieldAdapter = ({ component, formState, formStateHandler, fieldErrorHandler }) => {

    const { required, identifier, placeholder, label, validation } = component.config;

    const { translations } = useTranslations();
    const { fieldErrors, validate } = useFieldValidation(validation, selectedCountry);

    const [ countryList, setCountryList ] = useState([]);
    const [ selectedCountry, setSelectedCountry ] = useState("");

    useEffect(() => {
        setCountryList(getCountryList());
    }, []);

    useEffect(() => {
        formStateHandler(identifier, selectedCountry);
    }, [ selectedCountry ]);

    const handleFieldValidation = () => {
        const isValid = validate({ identifier, required }, selectedCountry);

        fieldErrorHandler(identifier, isValid ? null : fieldErrors);
    };

    const getCountryList = () => {
        return countryData.map((country) => ({
            flag: country.code,
            key: country.code,
            text: country.name,
            value: country.name
        }));
    };

    return (
        <>
            <label htmlFor={ identifier }>{ resolveElementText(translations, label) }</label>
            <Dropdown
                name={ identifier }
                options={ countryList }
                placeholder={ placeholder }
                required= { required }
                onBlur={ handleFieldValidation }
                onChange={ (e, data) => setSelectedCountry(data.value) }
                fluid
                search
                selection
            />
            {
                validation && validation.type === "CRITERIA" && validation.showValidationCriteria (
                    <ValidationCriteria
                        validationConfig={ validation }
                        errors={ fieldErrors }
                        value={ selectedCountry }
                    />
                )
            }
            {
                <ValidationError
                    name={ identifier }
                    errors={ { fieldErrors: fieldErrors, formStateErrors: formState.errors } }
                />
            }
        </>
    );
};

CountryFieldAdapter.propTypes = {
    component: PropTypes.shape({
        config: PropTypes.shape({
            identifier: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            placeholder: PropTypes.string.isRequired,
            required: PropTypes.boolean.isRequired,
            validation: PropTypes.array
        }).isRequired,
        id: PropTypes.string,
        type: PropTypes.string,
        variant: PropTypes.string
    }).isRequired,
    fieldErrorHandler: PropTypes.func.isRequired,
    formState: PropTypes.isRequired,
    formStateHandler: PropTypes.func.isRequired
};

export default CountryFieldAdapter;
