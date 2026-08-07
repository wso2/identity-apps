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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import CountryFlag from "@oxygen-ui/react/CountryFlag";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemIcon from "@oxygen-ui/react/ListItemIcon";
import ListItemText from "@oxygen-ui/react/ListItemText";
import TextField from "@oxygen-ui/react/TextField";
import { AppState } from "@wso2is/admin.core.v1/store";
import { CommonUtils } from "@wso2is/core/utils";
import { FinalFormField, SelectFieldAdapter } from "@wso2is/forms";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useMemo } from "react";
import { FieldRenderProps } from "react-final-form";
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
 * Interface for a raw locale metadata entry
 */
interface LocaleMetaInterface {
    code: string;
    flag?: string;
    name: string;
}

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
    validateFields,
    ["data-componentid"]: componentId = "locale-field"
}: LocaleFieldPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const enableLegacyLocaleDropdown: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableLegacyLocaleDropdown
    );

    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

    const allSupportedLocales: { [ key: string ]: LocaleMetaInterface } = CommonUtils.getLocaleList();

    /**
     * Locale metadata used to populate the dropdown options. Limited to the languages bundled
     * with the product UI when `enableLegacyLocaleDropdown` is enabled, otherwise the full
     * locale catalog from `@wso2is/core`.
     */
    const localeOptionsSource: { [ key: string ]: LocaleMetaInterface } = enableLegacyLocaleDropdown
        ? supportedI18nLanguages
        : allSupportedLocales;

    const normalizedLocale: string = normalizeLocaleFormat(initialValue,
        LocaleJoiningSymbol.HYPHEN, true, localeOptionsSource);

    /**
     * Validates the field value.
     *
     * @param value - Selected value.
     * @returns A non-empty error message if the value is not valid else undefined.
     */
    const validateField = (value: string): string | undefined => {
        if (isEmpty(value) && isRequired) {
            return (
                t("user:profile.forms.generic.inputs.validations.required", { fieldName: fieldLabel })
            );
        }

        return undefined;
    };

    /**
     * Prepares the locale options for the dropdown.
     */
    const localeOptionsArray: LocaleListItemInterface[] = useMemo(() => {
        return localeOptionsSource
            ? Object.keys(localeOptionsSource).map((key: string) => ({
                "data-componentId": `${ componentId }-profile-form-locale-dropdown-${
                    localeOptionsSource[key].code }`,
                flag: localeOptionsSource[key].flag ?? UserManagementConstants.GLOBE,
                key: localeOptionsSource[key].code,
                text:
                    localeOptionsSource[key].name === UserManagementConstants.GLOBE
                        ? localeOptionsSource[key].code
                        : `${localeOptionsSource[key].name}, ${localeOptionsSource[key].code}`,
                value: localeOptionsSource[key].code
            }))
            : [];
    }, [ localeOptionsSource ]);

    const selectedLocale: LocaleListItemInterface = localeOptionsArray.find(
        (locale: LocaleListItemInterface) =>
            locale.value === normalizedLocale
    );

    /**
     * The full locale catalog is too large for a plain dropdown to be searchable, so it's
     * rendered with an Autocomplete instead. The displayed value is derived directly from
     * `input.value` on every render (rather than mirrored into local state) so it can never
     * drift out of sync with the react-final-form field state, e.g. once the profile data or
     * `supportedI18nLanguages` resolve after this field has already mounted.
     */
    if (!enableLegacyLocaleDropdown) {
        return (
            <FinalFormField
                name={ fieldName }
                initialValue={ selectedLocale?.value as string }
                validate={ validator ?? validateField }
                validateFields={ validateFields }
            >
                { ({ input, meta }: FieldRenderProps<string>): ReactElement => {
                    const isError: boolean = (meta.error || meta.submitError) && meta.touched;
                    const selectedOption: LocaleListItemInterface = localeOptionsArray.find(
                        (locale: LocaleListItemInterface) => locale.value === input.value
                    ) ?? null;

                    return (
                        <Autocomplete
                            disablePortal
                            fullWidth
                            size="small"
                            disabled={ isReadOnly || isUpdating }
                            disableClearable={ isRequired }
                            options={ localeOptionsArray }
                            value={ selectedOption }
                            isOptionEqualToValue={ (option: LocaleListItemInterface, value: LocaleListItemInterface) =>
                                option.value === value.value
                            }
                            getOptionLabel={ (option: LocaleListItemInterface) => option.text ?? "" }
                            onChange={ (_event: SyntheticEvent, option: LocaleListItemInterface | null) => {
                                input.onChange(option?.value ?? "");
                            } }
                            onBlur={ input.onBlur }
                            renderOption={ (props: React.ComponentProps<"li">, option: LocaleListItemInterface) => (
                                <li { ...props } key={ option.key }>
                                    <ListItem
                                        className="p-0"
                                        data-componentid={
                                            `${componentId}-profile-form-locale-dropdown-${option.value}`
                                        }
                                    >
                                        <ListItemIcon>
                                            <CountryFlag countryCode={ option.flag } />
                                        </ListItemIcon>
                                        <ListItemText>{ option.text }</ListItemText>
                                    </ListItem>
                                </li>
                            ) }
                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                <TextField
                                    { ...params }
                                    label={ fieldLabel }
                                    required={ isRequired }
                                    error={ isError }
                                    helperText={ isError ? (meta.error || meta.submitError) : undefined }
                                    placeholder={ t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                                        { fieldName: fieldLabel })
                                    }
                                    size="small"
                                    variant="outlined"
                                />
                            ) }
                            data-componentid={ `${ componentId }-input` }
                        />
                    );
                } }
            </FinalFormField>
        );
    }

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
            validate={ validator ?? validateField }
            validateFields={ validateFields }
            options={ localeOptionsArray?.map(
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
