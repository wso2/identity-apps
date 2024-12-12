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
import React, { useEffect, useState } from "react";

const CountryFieldAdapter = ({ component, formStateHandler }) => {

    const { required, name, rest } = component.properties;

    const [ countryList, setCountryList ] = useState([]);

    useEffect(() => {
        const countryList = getCountryList();

        setCountryList(countryList);
    }, []);

    const getCountryList = () => {
        const countryCodes = Intl.supportedValuesOf("region");
        const countryMap = {};

        countryCodes.forEach((countryCode) => {
            const locale = new Intl.DisplayNames([ "en" ], { type: "region" });
            const countryDisplayName = locale.of(countryCode);

            countryMap[countryCode] = countryDisplayName;
        });

        return countryMap;
    };

    return (
        <div className={ classNames("field", required ? "required" : null) }>
            <div
                className="ui fluid search selection dropdown"
                id="country-dropdown"
                data-testid="country-dropdown">
                <input
                    type="hidden"
                    required={ required }
                    name={ name }
                    { ...rest }
                />
                <i className="dropdown icon"></i>
                <div className="default text">Enter Country</div>
                <div className="menu">
                    {
                        countryList && Object.keys(countryList).map((countryCode, index) => {
                            return (
                                <div
                                    className="item"
                                    key={ index }
                                    data-value={ countryCode }
                                    onClick={ (e) => {
                                        formStateHandler(
                                            name, e.target.getAttribute("data-value")
                                        );
                                    } }
                                >
                                    <i className="${country.key.toLowerCase()} flag"></i>
                                    { countryList[ countryCode ] }
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default CountryFieldAdapter;
