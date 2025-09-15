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
import React, { createContext, useEffect, useState } from "react";

export const I18nContext = createContext();

export const I18nProvider = ({ locale, translationsObject, children }) => {

    const [ translations, setTranslations ] = useState({});

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                setTranslations(translationsObject);
            } catch (err) {
                console.error("Error loading translations:", err);
            }
        };

        loadTranslations();
    }, []);

    return (
        <I18nContext.Provider value={ { locale, translations } }>
            { children }
        </I18nContext.Provider>
    );
};

I18nProvider.propTypes = {
    children: PropTypes.any.isRequired,
    locale: PropTypes.string.isRequired,
    translationsObject: PropTypes.object.isRequired
};
