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
import React from "react";
import { Header } from "semantic-ui-react";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";

const TypographyAdapter = ({ component }) => {
    const { variant, config } = component;

    const { translations } = useTranslations ();

    switch (variant) {
        case "H6":
            return (
                <Header as="h6" className="mb-4">
                    { resolveElementText(translations, config.text) }
                </Header>
            );
        case "H5":
            return (
                <Header as="h5" className="mb-4">
                    { resolveElementText(translations, config.text) }
                </Header>
            );
        case "H4":
            return (
                <Header as="h4" className="mb-4">
                    { resolveElementText(translations, config.text) }
                </Header>
            );
        case "H3":
            return (
                <Header as="h3" className="mb-4">
                    { resolveElementText(translations, config.text) }
                </Header>
            );
        case "H2":
            return (
                <Header as="h2" className="mb-4">
                    { resolveElementText(translations, config.text) }
                </Header>
            );
        case "H1":
            return (
                <Header as="h1" className="mb-4">
                    { resolveElementText(translations, config.text) }
                </Header>
            );
        default:
            return (
                <Header as="h3" className="mb-4">
                    { resolveElementText(translations, config.text) }
                </Header>
            );
    }
};

TypographyAdapter.propTypes = {
    component: PropTypes.shape({
        config: PropTypes.shape({
            text: PropTypes.string.isRequired
        }).isRequired,
        id: PropTypes.string,
        type: PropTypes.string,
        variant: PropTypes.string
    }).isRequired
};

export default TypographyAdapter;
