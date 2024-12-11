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

import PropTypes from "prop-types";
import React from "react";
import { useTranslations } from "../../hooks/use-translations";
import { getTranslationByKey } from "../../utils/i18n-utils";

const TypographyAdapter = ({ component }) => {
    const { variant, properties } = component;
    const { className, styles, text } = properties;

    const { translations } = useTranslations ();

    switch (variant) {
        case "H3":
            return (
                <h3 className={ "ui header mb-1" + className } style={ styles }>
                    { getTranslationByKey(translations, text) }
                </h3>
            );
        case "H1":
            return <h1 className={ "ui header mb-1" + className } style={ styles }>{ text }</h1>;
        case "H2":
            return <h2 className={ "ui header mb-1" + className } style={ styles }>{ text }</h2>;
        default:
            return <p className={ "ui header mb-1" + className } style={ styles }>{ text }</p>;
    }
};

TypographyAdapter.propTypes = {
    id: PropTypes.string,
    category: PropTypes.string,
    type: PropTypes.string,
    properties: PropTypes.shape({
        text: PropTypes.string.isRequired,
        className: PropTypes.string,
        styles: PropTypes.object
    }).isRequired,
    variant: PropTypes.string.isRequired
};

export default TypographyAdapter;
