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
import { CommonUtils } from "@wso2is/core/utils";
import { FinalForm, FinalFormField, FormRenderProps, SelectFieldAdapter } from "@wso2is/forms";
import { LocaleMeta, SupportedLanguagesMeta } from "@wso2is/i18n";
import { Button, Popup, useMediaContext } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useMemo } from "react";
import { FieldRenderProps } from "react-final-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import { LocaleJoiningSymbol, ProfileConstants } from "../../../constants";
import { LocaleFieldFormPropsInterface } from "../../../models/profile-ui";
import { AppState } from "../../../store";
import { EditSection } from "../../shared/edit-section";

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

const LocaleFieldForm: FunctionComponent<LocaleFieldFormPropsInterface> = ({
    fieldSchema: schema,
    initialValue,
    fieldLabel,
    isRequired,
    isActive,
    isEditable,
    onEditClicked,
    onEditCancelClicked,
    setIsProfileUpdating,
    handleSubmit,
    isUpdating,
    ["data-componentid"]: componentId = "locale-field-form"
}: LocaleFieldFormPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();

    const enableLegacyLocaleDropdown: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableLegacyLocaleDropdown
    );

    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

    const allSupportedLocales: { [ key: string ]: LocaleMeta } = CommonUtils.getLocaleList();

    /**
     * Locale metadata used to populate the dropdown options. Limited to the languages bundled
     * with the product UI when `enableLegacyLocaleDropdown` is enabled, otherwise the full
     * locale catalog from `@wso2is/core`.
     */
    const localeOptionsSource: { [ key: string ]: LocaleMeta } = enableLegacyLocaleDropdown
        ? supportedI18nLanguages
        : allSupportedLocales;

    const validateField = (value: unknown): string | undefined => {
        // Validate the required field.
        if (isEmpty(value) && isRequired) {
            return (
                t("myAccount:components.profile.forms.generic.inputs.validations.empty", { fieldName: fieldLabel })
            );
        }

        return undefined;
    };

    const onFormSubmit = (values: Record<string, string>): void => {
        setIsProfileUpdating(true);

        handleSubmit(schema.name, values[schema.name]);
    };

    /**
     * Prepares the locale options for the dropdown.
     */
    const localeOptionsArray: LocaleListItemInterface[] = useMemo(() => {
        return localeOptionsSource
            ? Object.keys(localeOptionsSource).map((key: string) => ({
                "data-componentId": `${ componentId }-profile-form-locale-dropdown-${
                    localeOptionsSource[key].code }`,
                flag: (localeOptionsSource[key].flag ?? ProfileConstants.GLOBE) as string,
                key: localeOptionsSource[key].code,
                text:
                    localeOptionsSource[key].name === ProfileConstants.GLOBE
                        ? localeOptionsSource[key].code
                        : `${localeOptionsSource[key].name}, ${localeOptionsSource[key].code}`,
                value: localeOptionsSource[key].code
            }))
            : [];
    }, [ localeOptionsSource ]);

    /**
     * Returns the options for the legacy dropdown.
     */
    const getLocaleOptions = (): {text: ReactNode, value: string}[] => {
        return localeOptionsArray.map(({ key, flag, text: localeDisplayText, value }: LocaleListItemInterface) => {
            return {
                text: (
                    <ListItem
                        key={ key }
                        className="p-0"
                        data-componentid={ `${componentId}-profile-form-locale-dropdown-${value}` }
                    >
                        <ListItemIcon>
                            <CountryFlag countryCode={ flag } />
                        </ListItemIcon>
                        <ListItemText>{ localeDisplayText }</ListItemText>
                    </ListItem>
                ),
                value
            };
        });
    };

    /**
     * The function returns the normalized format of locale.
     * Refer https://github.com/wso2/identity-apps/pull/5980 for more details.
     *
     * @param locale - locale value.
     * @param localeJoiningSymbol - symbol used to join language and region parts of locale.
     * @param updateSupportedLanguage - If supported languages needs to be updated with the given localString or not.
     */
    const normalizeLocaleFormat = (
        locale: string,
        localeJoiningSymbol: LocaleJoiningSymbol,
        updateSupportedLanguage: boolean
    ): string => {
        if (!locale) {
            return locale;
        }

        const separatorIndex: number = locale.search(/[-_]/);

        let normalizedLocale: string = locale;

        if (separatorIndex !== -1) {
            const language: string = locale.substring(0, separatorIndex).toLowerCase();
            const region: string = locale.substring(separatorIndex + 1).toUpperCase();

            normalizedLocale = `${language}${localeJoiningSymbol}${region}`;
        }

        if (updateSupportedLanguage && !localeOptionsSource[normalizedLocale]) {
            localeOptionsSource[normalizedLocale] = {
                code: normalizedLocale,
                name: ProfileConstants.GLOBE,
                namespaces: []
            };
        }

        return normalizedLocale;
    };

    /**
     * Returns the normalized initial value.
     */
    const normalizedInitialValue: string = useMemo(() => {
        return normalizeLocaleFormat(initialValue, LocaleJoiningSymbol.HYPHEN, true);
    }, [ initialValue ]);

    const selectedLocale: LocaleListItemInterface = localeOptionsArray.find(
        (locale: LocaleListItemInterface) =>
            locale.value === normalizedInitialValue
    );

    /**
     * Renders the locale input field. The full locale catalog is too large for a plain dropdown
     * to be searchable, so it's rendered with an Autocomplete instead when the legacy dropdown
     * is disabled.
     */
    const renderLocaleInputField = (): ReactElement => {
        if (!enableLegacyLocaleDropdown) {
            return (
                <FinalFormField
                    name={ schema.name }
                    initialValue={ selectedLocale?.value as string }
                    validate={ validateField }
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
                                disabled={ !isEditable || isUpdating }
                                disableClearable={ isRequired }
                                options={ localeOptionsArray }
                                value={ selectedOption }
                                isOptionEqualToValue={
                                    (option: LocaleListItemInterface, value: LocaleListItemInterface) =>
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
                                        required={ isRequired }
                                        error={ isError }
                                        helperText={ isError ? (meta.error || meta.submitError) : undefined }
                                        placeholder={ t(
                                            "myAccount:components.profile.forms." +
                                            "generic.dropdown.placeholder",
                                            { fieldName: fieldLabel.toLowerCase() }
                                        ) }
                                        size="small"
                                        variant="outlined"
                                    />
                                ) }
                                data-componentid={
                                    `${componentId}-${schema.name.replace(".", "-")}-select-field` }
                            />
                        );
                    } }
                </FinalFormField>
            );
        }

        return (
            <FinalFormField
                component={ SelectFieldAdapter }
                initialValue={ normalizedInitialValue }
                isClearable={ !isRequired }
                ariaLabel={ fieldLabel }
                name={ schema.name }
                validate={ validateField }
                placeholder={ t(
                    "myAccount:components.profile.forms." +
                    "generic.dropdown.placeholder",
                    { fieldName: fieldLabel.toLowerCase() }
                ) }
                options={ getLocaleOptions() }
                readOnly={ !isEditable || isUpdating }
                disableClearable={ isRequired }
                data-testid={ `${componentId}-${schema.name.replace(".", "-")}-select-field` }
                data-componentid={ `${componentId}-${schema.name.replace(".", "-")}-select-field` }
            />
        );
    };

    if (isActive) {
        return (
            <EditSection data-testid={ "profile-schema-editing-section" }>
                <Grid>
                    <Grid.Row columns={ 2 } verticalAlign="middle">
                        <Grid.Column width={ 4 } className="field-label">
                            <span className={ isRequired ? "required" : "" }>{ fieldLabel }</span>
                        </Grid.Column>
                        <Grid.Column width={ 12 }>
                            <FinalForm
                                onSubmit={ onFormSubmit }
                                render={ ({ handleSubmit }: FormRenderProps) => {
                                    return (
                                        <form
                                            onSubmit={ handleSubmit }
                                            className="dropdown-field-form"
                                            data-componentid={
                                                `${componentId}-editing-section-${
                                                    schema.name.replace(".", "-") }-form` }
                                            data-testid={
                                                `${componentId}-editing-section-${
                                                    schema.name.replace(".", "-") }-form` }
                                        >
                                            <Grid verticalAlign="middle">
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 10 }>
                                                        { renderLocaleInputField() }
                                                    </Grid.Column>
                                                    <Grid.Column
                                                        width={ 6 }
                                                    >
                                                        <div className="form-actions-wrapper">
                                                            <Button
                                                                primary
                                                                type="submit"
                                                                data-testid={
                                                                    `${componentId}-schema-mobile-editing-section-${
                                                                        schema.name.replace(
                                                                            ".",
                                                                            "-"
                                                                        )}-save-button` }
                                                            >
                                                                { t("common:save") }
                                                            </Button>
                                                            <Button
                                                                onClick={ onEditCancelClicked }
                                                                data-testid={
                                                                    `${componentId}-schema-mobile-editing-section-${
                                                                        schema.name.replace(".", "-")
                                                                    }-cancel-button`
                                                                }
                                                            >
                                                                { t("common:cancel") }
                                                            </Button>
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </form>
                                    );
                                } }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EditSection>
        );
    }

    return (
        <Grid padded={ true }>
            <Grid.Row columns={ 3 }>
                <Grid.Column mobile={ 6 } computer={ 4 } className="first-column">
                    <List.Content className="vertical-align-center field-label">
                        <span className={ isRequired ? "required" : "" }>{ fieldLabel }</span>
                    </List.Content>
                </Grid.Column>
                <Grid.Column mobile={ 8 } computer={ 10 }>
                    <List.Content>
                        <List.Description className="with-max-length">
                            { isEmpty(initialValue) ? (
                                <EmptyValueField
                                    schema={ schema }
                                    fieldLabel={ fieldLabel }
                                    placeholderText={ t(
                                        "myAccount:components.profile.forms.generic.dropdown.placeholder",
                                        { fieldName: fieldLabel.toLowerCase() }
                                    ) }
                                    onEditClicked={ onEditClicked }
                                />
                            ) : (
                                initialValue
                            ) }
                        </List.Description>
                    </List.Content>
                </Grid.Column>
                <Grid.Column mobile={ 2 } className={ `${!isMobileViewport ? "last-column" : ""}` }>
                    <List.Content floated="right" className="vertical-align-center">
                        { isEditable && (
                            <Popup
                                trigger={
                                    (<Icon
                                        link={ true }
                                        className="list-icon"
                                        size="small"
                                        color="grey"
                                        tabIndex={ 0 }
                                        onKeyPress={ (e: React.KeyboardEvent<HTMLElement>) => {
                                            if (e.key === "Enter") {
                                                onEditClicked();
                                            }
                                        } }
                                        onClick={ onEditClicked }
                                        name="pencil alternate"
                                        data-testid={ `profile-schema-mobile-editing-section-${schema.name.replace(
                                            ".",
                                            "-"
                                        )}-edit-button` }
                                    />)
                                }
                                position="top center"
                                content={ t("common:edit") }
                                inverted={ true }
                            />
                        ) }
                    </List.Content>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default LocaleFieldForm;
