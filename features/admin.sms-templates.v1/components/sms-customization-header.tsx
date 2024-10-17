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

import { AppState } from "@wso2is/admin.core.v1";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DropdownChild, Field, Form } from "@wso2is/form";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Segment } from "semantic-ui-react";
import { SmsTemplateType } from "../models/sms-templates";

const FORM_ID: string = "sms-customization-header-form";

interface SmsCustomizationHeaderProps extends IdentifiableComponentInterface {
    /**
     * Selected SMS template id.
     */
    selectedSmsTemplateId: string;

    /**
     * Selected SMS template description.
     */
    selectedSmsTemplateDescription: string;

    /**
     * Selected locale
     */
    selectedLocale: string;

    /**
     * SMS templates list.
     */
    smsTemplatesList: SmsTemplateType[];

    /**
     * Callback to be called when the template is changed.
     * @param templateId - selected template id from the dropdown
     */
    onTemplateSelected: (templateId: string) => void;

    /**
     * Callback to be called when the locale is change
     * @param locale - selected locale for template
     */
    onLocaleChanged: (locale: string) => void;
}

/**
 * SMS customization header.
 *
 * @param props - Props injected to the component.
 *
 * @returns Header component for SMS Customization.
 */
const SmsCustomizationHeader: FunctionComponent<SmsCustomizationHeaderProps> = (
    props: SmsCustomizationHeaderProps
): ReactElement => {
    const {
        selectedSmsTemplateId,
        selectedSmsTemplateDescription,
        selectedLocale,
        smsTemplatesList,
        onTemplateSelected,
        onLocaleChanged,
        ["data-componentid"]: componentId = "sms-customization-header"
    } = props;

    const { t } = useTranslation();

    const [ localeList, setLocaleList ] =
        useState<DropdownChild[]>(undefined);

    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

    /**
     * Memoized list of SMS template options.
     *
     * Generates an array of objects with `text` as the template display name
     * and `value` as the template ID. Recomputes only when `smsTemplatesList` changes.
     *
     * @returns Array of dropdown options.
     */
    const smsTemplateListOptions: { text: string, value: string }[] = useMemo(() => {
        return smsTemplatesList?.map((template: SmsTemplateType) => {
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

        const localeList: DropdownChild[] = [];

        Object.keys(supportedI18nLanguages).map((key: string) => {
            localeList.push({
                key: supportedI18nLanguages[key].code,
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
                            ariaLabel="SMS Template Dropdown"
                            name="selectedSmsTemplate"
                            label={ t("smsTemplates:form.inputs.template.label") }
                            options={ smsTemplateListOptions }
                            required={ true }
                            data-componentid={ `${ componentId }-sms-template-list` }
                            hint={ selectedSmsTemplateDescription ?? null }
                            placeholder={ t("smsTemplates:form.inputs.template.placeholder") }
                            value={ selectedSmsTemplateId }
                            listen={ onTemplateSelected }
                        />
                    </Grid.Column>

                    <Grid.Column
                        mobile={ 16 }
                        computer={ 8 }
                    >
                        <Field.Dropdown
                            ariaLabel="SMS Template Locale Dropdown"
                            name="selectedSmsTemplateLocale"
                            label={ t("smsTemplates:form.inputs.locale.label") }
                            options={ localeList }
                            required={ true }
                            data-componentid={ `${ componentId }-sms-template-locale` }
                            placeholder={ t("smsTemplates:form.inputs.locale.placeholder") }
                            defaultValue={ selectedLocale }
                            value={ selectedLocale }
                            listen={ onLocaleChanged }
                        />
                    </Grid.Column>
                </Grid>
            </Form>
        </Segment>
    );
};

export default SmsCustomizationHeader;
