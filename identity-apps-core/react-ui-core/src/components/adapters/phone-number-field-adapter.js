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
import React, { useEffect, useRef, useState } from "react";
import { Flag, Icon, Input } from "semantic-ui-react";
import countryData from "../../data/country-data.js";
import useFieldValidation from "../../hooks/use-field-validations";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import ValidationError from "../validation-error";
import "./phone-number-field-adapter.css";

const PhoneNumberFieldAdapter = ({ component, formState, formStateHandler, fieldErrorHandler }) => {

    const { identifier, required, label, placeholder, validations } = component.config;

    const dropdownRef = useRef(null);
    const { translations } = useTranslations();
    const { fieldErrors, validate } = useFieldValidation(validations, fullNumber);

    const [ selectedCountry, setSelectedCountry ] = useState({
        key: "us",
        value: "us",
        flag: "us",
        text: "United States",
        dialCode: "+1"
    });
    const [ phoneNumber, setPhoneNumber ] = useState("");
    const [ fullNumber, setFullNumber ] = useState("");
    const [ dropdownOpen, setDropdownOpen ] = useState(false);
    const [ searchQuery, setSearchQuery ] = useState("");

    const countryOptions = countryData.map(country => ({
        content: (
            <div className="country-option">
                <Flag name={ country.code } />
                <span className="country-name">{ country.name }</span>
                <span className="country-dial-code">{ country.dialCode }</span>
            </div>
        ),
        dialCode: country.dialCode,
        flag: country.code,
        key: country.code,
        text: country.name,
        value: country.code
    }));

    useEffect(() => {
        formStateHandler(component.config.identifier, fullNumber);
    }, [ fullNumber ]);

    const handleCountryChange = (e, { value }) => {
        const country = countryOptions.find(c => c.value === value);

        if (!country) return;

        setSelectedCountry(country);
        setFullNumber(`${country.dialCode} ${phoneNumber}`);
        setDropdownOpen(false);
    };

    const handleFieldValidation = () => {
        const isValid = validate({ identifier, required }, fullNumber);

        fieldErrorHandler(identifier, isValid ? null : fieldErrors);
    };

    const handlePhoneChange = e => {
        const newPhoneNumber = e.target.value;

        setPhoneNumber(newPhoneNumber);
        setFullNumber(`${selectedCountry.dialCode}${newPhoneNumber}`);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        setSearchQuery("");
    };

    const filteredOptions = searchQuery
        ? countryOptions.filter(
            option =>
                option.text.toLowerCase().includes(searchQuery.toLowerCase()) || option.dialCode.includes(searchQuery)
        )
        : countryOptions;

    useEffect(() => {
        const handleClickOutside = event => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={ classNames("phone-field-container field", required ? "required" : null) }>
            { label && <label htmlFor={ identifier }>{ resolveElementText(translations, label) }</label> }
            <div className="phone-input-wrapper">
                <div ref={ dropdownRef } className="flag-dropdown">
                    <div className="selected-flag" onClick={ toggleDropdown }>
                        <Flag name={ selectedCountry.flag } />
                        <Icon name="chevron down" size="small" className="dropdown-arrow" />
                    </div>
                    { dropdownOpen && (
                        <div className="country-list">
                            <div className="search-container">
                                <Input
                                    icon="search"
                                    placeholder="Search"
                                    value={ searchQuery }
                                    onChange={ e => setSearchQuery(e.target.value) }
                                    fluid
                                />
                            </div>
                            <div className="country-options-list">
                                { filteredOptions.map(country => (
                                    <div
                                        key={ country.key }
                                        className="country-option"
                                        onClick={ () => handleCountryChange(null, { value: country.value }) }
                                    >
                                        <Flag name={ country.flag } />
                                        <span className="country-name">{ country.text }</span>
                                        <span className="country-dial-code">{ country.dialCode }</span>
                                    </div>
                                )) }
                            </div>
                        </div>
                    ) }
                </div>
                <input
                    type="tel"
                    name={ identifier }
                    placeholder={ resolveElementText(translations, placeholder) || "(201) 555-0123" }
                    value={ phoneNumber }
                    onChange={ handlePhoneChange }
                    onBlur={ handleFieldValidation }
                    required={ required }
                    className="phone-number-input"
                />
            </div>
            {
                <ValidationError
                    name={ identifier }
                    errors={ { formStateErrors: formState.errors, fieldErrors: fieldErrors } }
                />
            }
        </div>
    );
};

PhoneNumberFieldAdapter.propTypes = {
    component: PropTypes.object,
    fieldErrorHandler: PropTypes.func,
    formState: PropTypes.object,
    formStateHandler: PropTypes.func
};

export default PhoneNumberFieldAdapter;
