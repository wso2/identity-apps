/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { Theme, styled } from "@mui/material/styles";
import Autocomplete, {
    AutocompleteRenderGroupParams,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Divider from "@oxygen-ui/react/Divider";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import { DropdownChild } from "@wso2is/forms";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header } from "semantic-ui-react";
import { AppState } from "../store";

export type LocaleOption = DropdownChild & {
    name: string;
    isDefaultLocale?: boolean;
};

interface LocaleMetaInterface {
    code: string;
    flag: string;
    name: string;
}

/**
 * Props interface of {@link GroupedLocaleAutocomplete}
 */
export interface GroupedLocaleAutocompletePropsInterface extends IdentifiableComponentInterface {
    /**
     * Accessible label for the input.
     */
    ariaLabel: string;
    /**
     * Called when the selected locale changes.
     */
    onLocaleChanged: (localeOption: LocaleOption | null) => void;
    /**
     * Currently selected locale code.
     */
    selectedLocale: string;
}

const LocaleGroupHeader: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.25),
    padding: theme.spacing(1, 2, 0.5, 2)
}));

const LocaleGroupDivider: typeof Divider = styled(Divider)(({ theme }: { theme: Theme }) => ({
    borderBottomWidth: 2,
    marginBlock: theme.spacing(1),
    marginInline: theme.spacing(2)
}));

const LocaleGroupSubHeading: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(0.5)
}));

/**
 * Locale selection input used by the notification template editors (email/SMS). Groups the
 * languages bundled with the product UI ahead of the full locale catalog, separated by a divider.
 * Labels are sourced from the `common:localeDropdown` translation namespace.
 *
 * @param props - Props injected to the component.
 *
 * @returns Grouped locale autocomplete component.
 */
const GroupedLocaleAutocomplete: FunctionComponent<GroupedLocaleAutocompletePropsInterface> = ({
    ariaLabel,
    onLocaleChanged,
    selectedLocale,
    ["data-componentid"]: componentId = "grouped-locale-autocomplete"
}: GroupedLocaleAutocompletePropsInterface): ReactElement => {

    const { t } = useTranslation();

    const [ localeList, setLocaleList ] = useState<LocaleOption[]>([]);

    const supportedI18nLanguagesFromStore: SupportedLanguagesMeta = useSelector(
        (state: AppState): SupportedLanguagesMeta => state.global.supportedI18nLanguages
    );

    const allSupportedLocales: SupportedLanguagesMeta = CommonUtils.getLocaleList();

    useEffect(() => {
        if (!allSupportedLocales) {
            return;
        }

        const toLocaleOption: (locale: LocaleMetaInterface, isDefaultLocale: boolean) => LocaleOption =
            (locale: LocaleMetaInterface, isDefaultLocale: boolean) => ({
                isDefaultLocale,
                key: locale.code,
                name: `${ locale.name }, ${ locale.code }`,
                text: (
                    <div>
                        <i className={ locale.flag + " flag" }></i>
                        { locale.name }, { locale.code }
                    </div>
                ),
                value: locale.code
            });

        const defaultLocaleCodes: Set<string> = new Set(
            Object.values(supportedI18nLanguagesFromStore ?? {}).map(
                (locale: LocaleMetaInterface) => locale.code
            )
        );

        const defaultLocaleList: LocaleOption[] = Object.values(supportedI18nLanguagesFromStore ?? {})
            .map((locale: LocaleMetaInterface) => toLocaleOption(locale, true));

        const otherLocaleList: LocaleOption[] = Object.values(allSupportedLocales)
            .filter((locale: LocaleMetaInterface) => !defaultLocaleCodes.has(locale.code))
            .map((locale: LocaleMetaInterface) => toLocaleOption(locale, false));

        setLocaleList([ ...defaultLocaleList, ...otherLocaleList ]);
    }, [ allSupportedLocales, supportedI18nLanguagesFromStore ]);

    return (
        <Autocomplete
            disablePortal
            fullWidth
            aria-label={ ariaLabel }
            className="pt-1"
            ListboxProps={ {
                sx: { maxHeight: "60vh" }
            } }
            componentsProps={ {
                paper: {
                    elevation: 2
                },
                popper: {
                    modifiers: [
                        {
                            enabled: false,
                            name: "flip"
                        },
                        {
                            enabled: false,
                            name: "preventOverflow"
                        }
                    ]
                }
            } }
            data-componentid={ componentId }
            isOptionEqualToValue={
                (option: LocaleOption, value: LocaleOption) =>
                    option.value === value.value
            }
            getOptionLabel={ (option: LocaleOption) => {
                return option?.name;
            } }
            options={ localeList }
            groupBy={ (option: LocaleOption) =>
                option.isDefaultLocale ? "default" : "other"
            }
            renderGroup={ (params: AutocompleteRenderGroupParams) => (
                <li key={ params.key }>
                    { params.group === "other" && <LocaleGroupDivider /> }
                    <LocaleGroupHeader>
                        <Typography variant="subtitle2" fontWeight={ 600 } lineHeight={ 1.3 }>
                            { params.group === "default"
                                ? t("common:localeDropdown.groups.default.heading")
                                : t("common:localeDropdown.groups.other.heading") }
                        </Typography>
                        <LocaleGroupSubHeading>
                            <Typography variant="caption" color="text.secondary" lineHeight={ 1.3 }>
                                { params.group === "default"
                                    ? t("common:localeDropdown.groups.default.subHeading")
                                    : t("common:localeDropdown.groups.other.subHeading") }
                            </Typography>
                            { params.group === "default" && (
                                <Hint className="mt-0 mb-0" popup>
                                    { t("common:localeDropdown.groups.default.hint") }
                                </Hint>
                            ) }
                        </LocaleGroupSubHeading>
                    </LocaleGroupHeader>
                    <ul className="p-0">{ params.children }</ul>
                </li>
            ) }
            onChange={ (
                _event: SyntheticEvent<HTMLElement>,
                localeOption: LocaleOption | null
            ) => {
                onLocaleChanged(localeOption);
            } }
            noOptionsText={ t("common:noResultsFound") }
            renderInput={ (params: AutocompleteRenderInputParams) => {
                return (
                    <TextField
                        { ...params }
                        label={ t("common:localeDropdown.label") }
                        required
                        placeholder={ t("common:localeDropdown.placeholder") }
                        size="small"
                        variant="outlined"
                    />
                );
            } }
            renderOption={ (props: React.ComponentProps<"li">, localeOption: LocaleOption) => {
                return (
                    <li { ...props }>
                        <Header.Content>
                            { localeOption.text }
                        </Header.Content>
                    </li>
                );
            } }
            key="locale"
            value={ localeList.find(
                (locale: LocaleOption) => locale.value === selectedLocale
            ) ?? null }
        />
    );
};

export default GroupedLocaleAutocomplete;
