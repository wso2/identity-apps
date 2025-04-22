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

import { SelectChangeEvent } from "@mui/material";
import Card from "@oxygen-ui/react/Card";
import Grid from "@oxygen-ui/react/Grid";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DropdownChild, FinalForm, FinalFormField, SelectFieldAdapter } from "@wso2is/form";
import { FormRenderProps } from "@wso2is/form/src";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { TemplateType } from "../models/templates";

interface TemplateHeaderProps extends IdentifiableComponentInterface {

    /**
     * Template type.
     */
    templateType: string;

    /**
     * Selected template id.
     */
    selectedTemplateId: string;

    /**
     * Selected template description.
     */
    selectedTemplateDescription: string;

    /**
     * Selected locale
     */
    selectedLocale: string;

    /**
     * Templates list.
     */
    templatesList: TemplateType[];

    /**
     * Callback to be called when the template is changed.
     * @param event - Event to extract the selected value.
     */
    onTemplateSelected: (event: SelectChangeEvent<string>) => void;

    /**
     * Callback to be called when the locale is changed.
     * @param event - Event to extract the selected value.
     */
    onLocaleChanged: (event: SelectChangeEvent<string>) => void;
}

/**
 * customization header.
 *
 * @param props - Props injected to the component.
 *
 * @returns Header component for Customization.
 */
const TemplateHeader: FunctionComponent<TemplateHeaderProps> = (
    props: TemplateHeaderProps
): ReactElement => {
    const {
        templateType,
        selectedTemplateId,
        selectedTemplateDescription,
        selectedLocale,
        templatesList,
        onTemplateSelected,
        onLocaleChanged,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ localeList, setLocaleList ] = useState<DropdownChild[]>(undefined);

    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

    /**
     * Memoized list of template options.
     *
     * Generates an array of objects with `text` as the template display name
     * and `value` as the template ID. Recomputes only when `templatesList` changes.
     *
     * @returns Array of dropdown options.
     */
    const templateListOptions: { text: string; value: string }[] = useMemo(() => {
        return templatesList?.map((template: TemplateType) => {
            return {
                text: template.displayName,
                value: template.id
            };
        });
    }, [ templatesList ]);

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

    const renderFormFields = (): ReactElement => {
        return (
            <Grid container spacing={ 2 } marginTop={ 2 }>
                <Grid xs={ 12 } md={ 6 } lg={ 5 } xl={ 4 }>
                    <FinalFormField
                        key="selectedTemplate"
                        width={ 16 }
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        ariaLabel= "Template Dropdown"
                        required={ true }
                        data-componentid={ `${componentId}-${templateType}-template-list` }
                        name="selectedTemplate"
                        type={ "dropdown" }
                        label={ t(`${templateType}Templates:form.inputs.template.label`) }
                        placeholder={ t(`${templateType}Templates:form.inputs.template.placeholder`) }
                        component={ SelectFieldAdapter }
                        options={ templateListOptions }
                        onChange={ onTemplateSelected }
                        value={ selectedTemplateId }
                        defaultValue={ selectedTemplateId }
                    />
                    <Hint>{ selectedTemplateDescription ?? null }</Hint>
                </Grid>
                <Grid xs={ 12 } md={ 6 } lg={ 5 } xl={ 4 }>
                    <FinalFormField
                        key="selectedTemplateLocale"
                        width={ 16 }
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        ariaLabel= "Template Locale Dropdown"
                        required={ true }
                        data-componentid={ `${componentId}-${templateType}-template-locale` }
                        name="selectedTemplateLocale"
                        type={ "dropdown" }
                        label={ t(`${templateType}Templates:form.inputs.locale.label`) }
                        placeholder={ t(`${templateType}Templates:form.inputs.locale.placeholder`) }
                        value={ selectedLocale }
                        defaultValue={ selectedLocale }
                        component={ SelectFieldAdapter }
                        options={ localeList }
                        onChange={ onLocaleChanged }
                    />
                </Grid>
            </Grid>
        );
    };

    return (
        <Card className="mb-4 p-4 pb-2" data-componentid={ componentId }>
            <FinalForm
                onSubmit={ () => {} }
                initialValues={ {
                    selectedTemplate: selectedTemplateId,
                    selectedTemplateLocale: selectedLocale
                } }
                render={ ({ handleSubmit }: FormRenderProps) => (
                    <form onSubmit={ handleSubmit }>{ renderFormFields() }</form>
                ) }
            />
        </Card>
    );
};

export default TemplateHeader;
