/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import * as Country from "country-language";
import { DropdownItemProps } from "semantic-ui-react";

/**
 * Utility class for common UI functions.
 */
export class UIUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Get the list of countries to be added to the country dropdown input field.
     *
     * @return List of country objects.
     */
    public static getCountryList(): DropdownItemProps[] {
        const countryCodesToSkip = ["AQ", "BQ", "CW", "GG", "IM", "JE", "BL", "MF", "SX", "SS"];
        const countries: any[] = Country.getCountries();
        const countryDropDown: DropdownItemProps[] = [];

        countries.forEach((country, index) => {
            if (!countryCodesToSkip.includes(country.code_2)) {
                countryDropDown.push({
                    key: index,
                    value: country.name,
                    text: country.name,
                    flag: country.code_2.toLowerCase()
                });
            }
        });
        return countryDropDown;
    }
}
