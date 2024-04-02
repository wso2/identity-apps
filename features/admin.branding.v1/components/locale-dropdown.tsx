/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DropdownChild } from "@wso2is/form";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownProps, Form, Select } from "semantic-ui-react";

/**
 * Prop types for the locale dropdown component.
 */
export interface LocaleDropdownPropsInterface extends IdentifiableComponentInterface {
    /**
     * Default locale.
     */
    defaultLocale: string;
    /**
     * Callback to be called when the locale is changed.
     * @param locale - selected locale for template
     */
    onChange: (locale: string) => void;
    /**
     * Supported locales.
     */
    locales: SupportedLanguagesMeta;
    /**
     * Should the dropdown render as a required field.
     */
    required?: boolean;
}

/**
 * Dropdown component to select the locale.
 *
 * @param props - Props injected to the component.
 * @returns Locale dropdown component.
 */
const LocaleDropdown: FunctionComponent<LocaleDropdownPropsInterface> = (
    props: LocaleDropdownPropsInterface
): ReactElement => {
    const { onChange, defaultLocale, locales, required, ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();

    const [ selectedLocale, setSelectedLocale ] = useState<string>(defaultLocale);

    const supportedLocales: DropdownChild[] = useMemo(() => {
        if (!locales) {
            return [];
        }

        const supportedLocales: DropdownChild[] = [];

        Object.keys(locales).map((key: string) => {
            supportedLocales.push({
                key: locales[key].code,
                text: (
                    <div>
                        <i className={ `${locales[key].flag} flag` }></i>
                        { locales[key].name }, { locales[key].code }
                    </div>
                ),
                value: locales[key].code
            });
        });

        return supportedLocales;
    }, [ locales ]);

    return (
        <Form.Field
            control={ Select }
            ariaLabel="Branding text customization locale selection"
            className="dropdown branding-preference-custom-text-locale-dropdown"
            name="locale"
            label={ t("branding:brandingCustomText.localeSelectDropdown.label") }
            options={ supportedLocales }
            required={ required }
            data-componentid={ componentId }
            placeholder={ t("branding:brandingCustomText.localeSelectDropdown.placeholder") }
            defaultValue={ supportedLocales[0]?.text }
            value={ selectedLocale }
            onChange={ (
                _: React.SyntheticEvent<HTMLElement, Event>,
                { value }: DropdownProps
            ) => {
                setSelectedLocale(value as string);
                onChange(value as string);
            } }
        />
    );
};

/**
 * Default props for the component.
 */
LocaleDropdown.defaultProps = {
    "data-componentid": "locale-dropdown",
    required: false
};

export default LocaleDropdown;
