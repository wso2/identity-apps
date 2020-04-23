/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
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

import React, { FunctionComponent, ReactElement, useEffect, useState, SyntheticEvent } from "react";
import { history } from "../../../helpers";
import { EMAIL_TEMPLATE_VIEW_PATH } from "../../../constants";
import { Forms, Field, FormValue } from "@wso2is/forms";
import { Grid, Button, DropdownItemProps, Form, Dropdown, DropdownProps } from "semantic-ui-react";
import * as CountryLanguage from "country-language";
import { EmailTemplateEditor } from "../email-code-editor";
import { EmailTemplate, EmailTemplateType, AlertInterface, AlertLevels } from "../../../models";
import { createLocaleTemplate, getTemplateDetails, replaceLocaleTemplateContent } from "../../../api";
import { AxiosResponse, AxiosError } from "axios";
import { addAlert } from "@wso2is/core/dist/src/store";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

interface AddLocaleTemplatePropsInterface {
    templateId: string;
    templateTypeId: string;
}

/**
 * Component to handle ADD/EDIT of a locale based email template.
 * 
 * @param props - props required for component
 */
export const AddLocaleTemplate: FunctionComponent<AddLocaleTemplatePropsInterface> = (
    props: AddLocaleTemplatePropsInterface
): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [ localeList, setLocaleList ] = useState<DropdownItemProps[]>([]);
    const [ subject, setSubject ] = useState<string>('');
    const [ locale, setLocale ] = useState<string>('');
    const [ htmlBodyContent, setHtmlBodyContent ] = useState<string>('');
    const [ htmlFooterContent, setHtmlFooterContent ] = useState<string>('');

    const {
        templateId,
        templateTypeId
    } = props;

    /**
     * This will load the locales to the dropdown.
     */
    useEffect(() => {
        const locales: string[] = CountryLanguage.getLocales(true);
        const localeDropDown: DropdownItemProps[] = [];

        locales.forEach((locale, index) => {
            const countryCode = locale.split("-")[1];
            const languageCode = locale.split("-")[0];

            const language = CountryLanguage.getLanguage(languageCode).name;
            const country = CountryLanguage.getCountry(countryCode).name;

            localeDropDown.push({
                key: index,
                value: locale,
                text: country ? language + " (" + country + ")" : language,
            })
        });

        setLocaleList(localeDropDown);

    }, [localeList.length]);

    /**
     * Will get fired if there is a template ID to trigger edit flow.
     */
    useEffect(() => {
        getTemplateDetails(templateTypeId, templateId).then((response: AxiosResponse<EmailTemplate>) => {
            if (response.status === 200) {
                const templateDetails = response.data;

                setLocale(templateDetails.id);
                setSubject(templateDetails.subject);
                setHtmlBodyContent(templateDetails.body);
                setHtmlFooterContent(templateDetails.footer);
            }
        })
    },[templateId != ''])

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Util method to handle create template based on the form data captured.
     * 
     * @param values - values from the form submit
     */
    const createTemplate = (values: Map<string, FormValue>) => {
        const templateDate: EmailTemplate = {
            contentType: "text/html",
            subject: values.get("emailSubject").toString(),
            body: htmlBodyContent,
            footer: htmlFooterContent,
            id: locale,
        }

        createLocaleTemplate(templateTypeId, templateDate).then((response: AxiosResponse<EmailTemplateType>) => {
            if (response.status === 201) {
                handleAlerts({
                    description: t(
                        "devPortal:components.emailTemplates.notifications.createTemplate.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "devPortal:components.emailTemplates.notifications.createTemplate.success.message"
                    )
                });
                history.push(EMAIL_TEMPLATE_VIEW_PATH + templateTypeId);
            }
        }).catch((error: AxiosError) => {
            handleAlerts({
                description: error.response.data.description,
                level: AlertLevels.ERROR,
                message: t(
                    "devPortal:components.emailTemplates.notifications.createTemplate.genericError.message"
                )
            });
        })
    }

    /**
     * Util method to handle update/replace content in template based on the form data
     * captured.
     * 
     * @param values - values from the form submit
     */
    const updateTemplate = (values: Map<string, FormValue>) => {
        const templateDate: EmailTemplate = {
            contentType: "text/html",
            subject: values.get("emailSubject").toString(),
            body: htmlBodyContent,
            footer: htmlFooterContent,
            id: templateId
        }

        replaceLocaleTemplateContent(templateTypeId, templateId, templateDate).then((response: AxiosResponse) => {
            if (response.status === 200) {
                handleAlerts({
                    description: t(
                        "devPortal:components.emailTemplates.notifications.updateTemplate.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "devPortal:components.emailTemplates.notifications.updateTemplate.success.message"
                    )
                });
            }
        }).catch(error => {
            handleAlerts({
                description: error.response.data.description,
                level: AlertLevels.ERROR,
                message: t(
                    "devPortal:components.emailTemplates.notifications.updateTemplate.genericError.message"
                )
            });
        });
    }

    return (
        <Forms 
            onSubmit={ (values: Map<string, FormValue>) => {
                if (templateId === "") {
                    createTemplate(values)
                } else {
                    updateTemplate(values);
                }
            } }
        >
            <Grid>
                {
                    templateId === "" &&
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 4 }>
                            <Dropdown
                                placeholder="Select Locale"
                                label="Locale "
                                name="locale"
                                requiredErrorMessage="Select locale"
                                required={ true }
                                options={ localeList ? localeList : [] }
                                onChange={ (event: SyntheticEvent, data: DropdownProps) => {
                                    setLocale(data.value.toString());
                                } }
                                value={ locale }
                                selection
                                fluid
                                scrolling
                            />
                        </Grid.Column>
                    </Grid.Row>
                }
                
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 4 }>
                        <Field
                            name={ "emailSubject" }
                            label={ "Subject" }
                            required={ true }
                            requiredErrorMessage={ "Email Subject is required" }
                            placeholder={ "Enter your email subject" }
                            type="text"
                            value={ subject }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 12 }>
                        <Form.Field>
                            <label>Body</label>
                            <EmailTemplateEditor 
                                htmlContent={ htmlBodyContent } 
                                isReadOnly={ false }
                                updateHtmlContent={ setHtmlBodyContent }
                            />
                        </Form.Field>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 12 }>
                        <Form.Field>
                            <label>Mail signature</label>
                            <EmailTemplateEditor 
                                htmlContent={ htmlFooterContent } 
                                isReadOnly={ false }
                                customClass="mail-signature"
                                updateHtmlContent={ setHtmlFooterContent }
                            />
                        </Form.Field>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Button primary type="submit" size="small" className="form-button">
                            {templateId === '' ? "Add Locale Template" : "Save Changes" }
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    )
}
