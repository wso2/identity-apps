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
import { AppState } from "@wso2is/admin.core.v1/store";
import { FinalFormField, SelectFieldAdapter } from "@wso2is/form";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { LocaleJoiningSymbol, UserManagementConstants } from "../../../constants/user-management-constants";
import { LocaleFieldPropsInterface } from "../../../models/ui";
import { normalizeLocaleFormat } from "../../../utils/user-management-utils";

/**
 * Interface for the locale list item.
 */
interface LocaleListItemInterface {
    flag: string;
    key: string;
    text: string;
    value: string;
    "data-componentId": string;
};

/**
 * User profile locale field component.
 */
const LocaleField: FunctionComponent<LocaleFieldPropsInterface> = ({
    fieldName,
    fieldLabel,
    initialValue,
    isUpdating,
    isReadOnly,
    isRequired,
    validator,
    ["data-componentid"]: componentId = "locale-field"
}: LocaleFieldPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

    /**
     * Prepares the supported i18n languages array for the locale dropdown options.
     */
    const supportedI18nLanguagesArray: LocaleListItemInterface[] = useMemo(() => {
        return supportedI18nLanguages
            ? Object.keys(supportedI18nLanguages).map((key: string) => ({
                "data-componentId": `${ componentId }-profile-form-locale-dropdown-${
                    supportedI18nLanguages[key].code }`,
                flag: supportedI18nLanguages[key].flag ?? UserManagementConstants.GLOBE,
                key: supportedI18nLanguages[key].code,
                text:
                    supportedI18nLanguages[key].name === UserManagementConstants.GLOBE
                        ? supportedI18nLanguages[key].code
                        : `${supportedI18nLanguages[key].name}, ${supportedI18nLanguages[key].code}`,
                value: supportedI18nLanguages[key].code
            }))
            : [];
    }, [ supportedI18nLanguages ]);

    const normalizedLocale: string = normalizeLocaleFormat(initialValue,
        LocaleJoiningSymbol.HYPHEN, true, supportedI18nLanguages);

    const selectedLocale: LocaleListItemInterface = supportedI18nLanguagesArray.find(
        (locale: LocaleListItemInterface) =>
            locale.value === normalizedLocale
    );

    return (
        <FinalFormField
            component={ SelectFieldAdapter }
            initialValue={ selectedLocale?.value as string | string[] }
            ariaLabel={ fieldLabel }
            name={ fieldName }
            label={ fieldLabel }
            placeholder={ t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                { fieldName: fieldLabel })
            }
            validator={ validator }
            options={ supportedI18nLanguagesArray?.map(
                ({ key, flag, text: countryName, value }: LocaleListItemInterface) => {
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
                })
            }
            readOnly={ isReadOnly || isUpdating }
            required={ isRequired }
            isClearable={ !isRequired }
            data-testid={ `${ componentId }-input` }
            data-componentid={ `${ componentId }-input` }
        />
    );
};

export default LocaleField;
