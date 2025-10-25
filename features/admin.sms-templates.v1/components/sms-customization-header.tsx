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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import { DropdownChild, Field, Form } from "@wso2is/form";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownItemProps, DropdownProps, Grid, Header, Segment } from "semantic-ui-react";
import { SMSTemplateType } from "../models/sms-templates";
import "./sms-customization-header.scss";

const FORM_ID: string = "sms-customization-header-form";

interface SMSCustomizationHeaderProps extends IdentifiableComponentInterface {
    /**
     * Selected SMS template id.
     */
    selectedSMSTemplateId: string;

    /**
     * Selected SMS template description.
     */
    selectedSMSTemplateDescription: string;

    /**
     * Selected locale
     */
    selectedLocale: string;

    /**
     * SMS templates list.
     */
    smsTemplatesList: SMSTemplateType[];

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

type LocaleOption = DropdownChild & {
    name: string;
};

type LocaleOptionList = LocaleOption[];

/**
 * Email customization header.
 *
 * @param props - Props injected to the component.
 *
 * @returns Header component for SMS Customization.
 */
const SMSCustomizationHeader: FunctionComponent<SMSCustomizationHeaderProps> = ({
    selectedSMSTemplateId,
    selectedSMSTemplateDescription,
    selectedLocale,
    smsTemplatesList,
    onTemplateSelected,
    onLocaleChanged,
    ["data-componentid"]: componentId = "sms-customization-header"
}: SMSCustomizationHeaderProps): ReactElement => {

    const { t } = useTranslation();

    const [ localeList, setLocaleList ] =
        useState<LocaleOptionList>([]);

    const supportedI18nLanguages: SupportedLanguagesMeta = CommonUtils.getLocaleList();

    const smsTemplateListOptions: { text: string, value: string }[] = useMemo(() => {
        return smsTemplatesList?.map((template: SMSTemplateType) => {
            return {
                text: template.displayName,
                value: template.id
            };
        });
    }, [ smsTemplatesList ]);

    useEffect(() => {
        if (!supportedI18nLanguages) {
            return;
        }

        const localeList: LocaleOption[] = [];

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
                            name="selectedSMSTemplate"
                            label={ t("extensions:develop.smsTemplates.form.inputs.template.label") }
                            options={ smsTemplateListOptions }
                            required={ true }
                            data-componentid={ `${ componentId }-sms-template-list` }
                            hint={ selectedSMSTemplateDescription ?? null }
                            placeholder={ t("extensions:develop.smsTemplates.form.inputs.template.placeholder") }
                            value={ selectedSMSTemplateId }
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
                            value={ localeList.find((locale: LocaleOption) => locale.value === selectedLocale) }
                        />
                    </Grid.Column>
                </Grid>
            </Form>
        </Segment>
    );
};

export default SMSCustomizationHeader;
