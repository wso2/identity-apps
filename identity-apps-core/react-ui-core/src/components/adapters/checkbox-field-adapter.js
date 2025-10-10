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
import React, { useState } from "react";
import { Checkbox } from "semantic-ui-react";
import useFieldValidation from "../../hooks/use-field-validations";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import Hint from "../hint";
import ValidationError from "../validation-error";

const CheckboxFieldAdapter = ({ component, formState, formStateHandler, fieldErrorHandler }) => {

    const { identifier, label, hint, validations, required } = component.config;
    const { translations } = useTranslations();
    const [ value, setValue ] = useState(false);
    const { fieldErrors, validate } = useFieldValidation(validations, value);

    const handleFieldValidation = (value) => {
        const { errors, isValid } = validate({ identifier, required }, value);

        fieldErrorHandler(identifier, isValid ? null : errors);
    };

    const handleChange = (e, data) => {
        setValue(data.checked);
        handleFieldValidation(data.checked);
        formStateHandler(identifier, data.checked);
    };

    return (
        <div>
            <Checkbox
                name={ identifier }
                label={ resolveElementText(translations, label) }
                onChange={ handleChange }
            />
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

CheckboxFieldAdapter.propTypes = {
    component: PropTypes.object.isRequired,
    fieldErrorHandler: PropTypes.func.isRequired,
    formState: PropTypes.object.isRequired,
    formStateHandler: PropTypes.func.isRequired
};

export default CheckboxFieldAdapter;
