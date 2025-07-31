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

import CountryFlag from "@oxygen-ui/react/CountryFlag";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemIcon from "@oxygen-ui/react/ListItemIcon";
import ListItemText from "@oxygen-ui/react/ListItemText";
import { CommonUtils } from "@wso2is/core/utils";
import { FinalFormField, SelectFieldAdapter } from "@wso2is/form";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CountryFieldPropsInterface } from "../../../models/ui";

/**
 * Country list item interface.
 */
interface CountryListItemInterface {
    flag: string;
    key: number;
    text: string;
    value: string;
};

/**
 * User profile country field.
 */
const CountryField: FunctionComponent<CountryFieldPropsInterface> = ({
    fieldName,
    fieldLabel,
    initialValue,
    isUpdating,
    isReadOnly,
    isRequired,
    validator,
    ["data-componentid"]: componentId = "country-field"
}: CountryFieldPropsInterface): ReactElement => {
    const { t } = useTranslation();

    /**
     * Validates the field value.
     *
     * @param value - Selected value.
     * @returns A non-empty error message if the value is not valid else undefined.
     */
    const validateField = (value: unknown): string | undefined => {
        // Validate the required field.
        if (isEmpty(value) && isRequired) {
            return (
                t("user:profile.forms.generic.inputs.validations.required", { fieldName: fieldLabel })
            );
        }

        return undefined;
    };

    /**
     * Get the list of countries.
     */
    const countryList: CountryListItemInterface[] = useMemo(() => CommonUtils.getCountryList(), []);

    return (
        <FinalFormField
            component={ SelectFieldAdapter }
            initialValue={ initialValue as string | string[] }
            isClearable={ !isRequired }
            ariaLabel={ fieldLabel }
            name={ fieldName }
            label={ fieldLabel }
            validate={ validator ?? validateField }
            placeholder={ t("user:profile.forms.generic.inputs.dropdownPlaceholder", { fieldName: fieldLabel }) }
            options={ countryList?.map(({ key, flag, text: countryName, value }: CountryListItemInterface) => {
                return {
                    text: (
                        <ListItem
                            key={ key }
                            className="p-0"
                            data-componentid={ `${componentId}-profile-form-country-dropdown-${value}` }
                        >
                            <ListItemIcon>
                                <CountryFlag countryCode={ flag as string } />
                            </ListItemIcon>
                            <ListItemText>{ countryName }</ListItemText>
                        </ListItem>
                    ),
                    value
                };
            }) }
            readOnly={ isReadOnly || isUpdating }
            required={ isRequired }
            disableClearable={ isRequired }
            data-componentid={ `${componentId}-input` }
            data-testid={ `${componentId}-input` }
        />
    );
};

export default CountryField;
