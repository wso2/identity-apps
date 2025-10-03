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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import TextField from "@oxygen-ui/react/TextField";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DropdownChild, Field, Form } from "@wso2is/form";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { DropdownItemProps, DropdownProps, Grid, Header, Segment } from "semantic-ui-react";
import { EmailTemplateType } from "../models";
import "./email-customization-header.scss";

const FORM_ID: string = "email-customization-header-form";

interface EmailCustomizationHeaderProps extends IdentifiableComponentInterface {
    /**
     * Selected email template id.
     */
    selectedEmailTemplateId: string;

    /**
     * Selected email template description.
     */
    selectedEmailTemplateDescription: string;

    /**
     * Selected locale
     */
    selectedLocale: string;

    /**
     * Email templates list.
     */
    emailTemplatesList: EmailTemplateType[];

    /**
     * Callback to be called when the template is changed.
     * @param templateId - selected template id from the dropdown
     */
    onTemplateSelected: (templateId: string) => void;

    /**
     * Callback to be called when the locale is change
     * @param locale - selected locale for template
     */
    onLocaleChanged: (localeOption: DropdownProps) => void;
}

type LocaleOptionList = DropdownChild & {
    name: string;
}[];

/**
 * Email customization header.
 *
 * @param props - Props injected to the component.
 *
 * @returns Header component for Email Customization.
 */
const EmailCustomizationHeader: FunctionComponent<EmailCustomizationHeaderProps> = ({
    selectedEmailTemplateId,
    selectedEmailTemplateDescription,
    selectedLocale,
    emailTemplatesList,
    onTemplateSelected,
    onLocaleChanged,
    ["data-componentid"]: componentId = "email-customization-header"
}: EmailCustomizationHeaderProps): ReactElement => {

    const { t } = useTranslation();

    const [ localeList, setLocaleList ] =
        useState<LocaleOptionList[]>([]);

    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

    const emailTemplateListOptions: { text: string, value: string }[] = useMemo(() => {
        return emailTemplatesList?.map((template: EmailTemplateType) => {
            return {
                text: template.displayName,
                value: template.id
            };
        });
    }, [ emailTemplatesList ]);

    useEffect(() => {
        if (!supportedI18nLanguages) {
            return;
        }

        const localeList: LocaleOptionList[] = [];

        Object.keys(supportedI18nLanguages).map((key: string) => {
            localeList.push({
                key: supportedI18nLanguages[key].code,
                name: `${ supportedI18nLanguages[key].name }, ${ supportedI18nLanguages[key].code }`,
                text: (
                    <div>
                        <i className={ supportedI18nLanguages[key].flag + " flag" }></i>
                        { supportedI18nLanguages[key].name }, { supportedI18nLanguages[key].code }
                    </div>
                ),
                value: supportedI18nLanguages[key].code
            });
        });

        setLocaleList(localeList);
    }, [ supportedI18nLanguages ]);

    return (
        <Segment
            className="mb-4 p-4"
            data-componentid={ componentId }
            padded={ "very" }
        >
            <Form
                id={ FORM_ID }
                uncontrolledForm={ true }
                onSubmit={ () => { return; } }
            >
                <Grid>
                    <Grid.Column
                        mobile={ 16 }
                        computer={ 8 }
                    >
                        <Field.Dropdown
                            ariaLabel="Email Template Dropdown"
                            name="selectedEmailTemplate"
                            label={ t("extensions:develop.emailTemplates.form.inputs.template.label") }
                            options={ emailTemplateListOptions }
                            required={ true }
                            data-componentid={ `${ componentId }-email-template-list` }
                            hint={ selectedEmailTemplateDescription ?? null }
                            placeholder={ t("extensions:develop.emailTemplates.form.inputs.template.placeholder") }
                            value={ selectedEmailTemplateId }
                            listen={ onTemplateSelected }
                        />
                    </Grid.Column>

                    <Grid.Column
                        mobile={ 16 }
                        computer={ 8 }
                    >
                        <Autocomplete
                            disablePortal
                            fullWidth
                            aria-label="Email Template Locale Dropdown"
                            className="pt-1"
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
                            data-componentid={ `${componentId}-api` }
                            isOptionEqualToValue={
                                (option: DropdownItemProps, value: DropdownItemProps) =>
                                    option.value === value.value
                            }
                            getOptionLabel={ (option: DropdownItemProps) => {
                                return option?.name;
                            } }
                            options={ localeList }
                            onChange={ (
                                _event: SyntheticEvent<HTMLElement>,
                                data: DropdownProps
                            ) => {
                                onLocaleChanged(data);
                            } }
                            noOptionsText={ t("common:noResultsFound") }
                            renderInput={ (params: AutocompleteRenderInputParams) => {

                                return (
                                    <TextField
                                        { ...params }
                                        label="Locale"
                                        required
                                        placeholder="Select Locale"
                                        size="small"
                                        variant="outlined"
                                    />
                                );
                            } }
                            renderOption={ (props: any, localeOption: any) => {
                                return (
                                    <div { ...props }>
                                        <Header.Content>
                                            { localeOption.text }
                                        </Header.Content>
                                    </div>
                                );
                            } }
                            key="locale"
                            defaultValue={ {
                                code: "en-US",
                                flag: "us",
                                name: "English (United States), en-US"
                            } }
                            value={ localeList.find((locale: LocaleOptionList) => locale.value === selectedLocale) }
                        />
                    </Grid.Column>
                </Grid>
            </Form>
        </Segment>
    );
};

export default EmailCustomizationHeader;
