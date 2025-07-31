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
import { FinalForm, FinalFormField, FormRenderProps, SelectFieldAdapter } from "@wso2is/form";
import { LocaleMeta, SupportedLanguagesMeta } from "@wso2is/i18n";
import { Button, Popup, useMediaContext } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import { LocaleJoiningSymbol, ProfileConstants } from "../../../constants";
import { LocaleFieldFormPropsInterface } from "../../../models/profile-ui";
import { AppState } from "../../../store";
import { EditSection } from "../../shared/edit-section";

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

    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

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
     * Returns the options for the dropdown.
     */
    const getLocaleOptions = (): {text: ReactNode, value: string}[] => {
        return Object.entries(supportedI18nLanguages ?? {}).map(([ key, localMeta ]: [string, LocaleMeta]) => {
            const localeDisplayText: string = localMeta.name === ProfileConstants.GLOBE
                ? localMeta.code : `${localMeta.name}, ${localMeta.code}`;

            return {
                text: (
                    <ListItem
                        key={ key }
                        className="p-0"
                        data-componentid={ `${componentId}-profile-form-locale-dropdown-${localMeta.code}` }
                    >
                        <ListItemIcon>
                            <CountryFlag
                                countryCode={ (localMeta.flag ?? ProfileConstants.GLOBE) as string }
                            />
                        </ListItemIcon>
                        <ListItemText>{ localeDisplayText }</ListItemText>
                    </ListItem>
                ),
                value: localMeta.code
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

        if (updateSupportedLanguage && !supportedI18nLanguages[normalizedLocale]) {
            supportedI18nLanguages[normalizedLocale] = {
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

    if (isActive) {
        return (
            <EditSection data-testid={ "profile-schema-editing-section" }>
                <Grid>
                    <Grid.Row columns={ 2 } verticalAlign="middle">
                        <Grid.Column width={ 4 }>{ fieldLabel }</Grid.Column>
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
                                                            data-testid={
                                                                `${componentId}-${
                                                                    schema.name.replace(".", "-")}-select-field` }
                                                            data-componentid={
                                                                `${componentId}-${
                                                                    schema.name.replace(".", "-")}-select-field` }
                                                        />
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
                    <List.Content className="vertical-align-center">{ fieldLabel }</List.Content>
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
