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

import React, { FunctionComponent, ReactElement, useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import { EmailTemplateDetails } from "../models";
import { EMAIL_TEMPLATE_VIEW_PATH } from "../constants";
import { getEmailTemplate } from "../api";
import { PageLayout } from "../layouts";
import { history } from "../helpers";
import { AddLocaleTemplate } from "../components/email-templates";
import * as CountryLanguage from "country-language";

/**
 * Component will render add view for a email template based on 
 * locale for selected email template type.
 */
export const AddTemplateLocale: FunctionComponent = (): ReactElement => {
    
    const [ templateTypeId, setTemplateTypeId ] = useState<string>('');
    const [ templateId, setTemplateId ] = useState<string>('');
    const [ localeName, setLocaleName ] = useState<string>('');
    const [ emailTemplateTypeDetails, setEmailTemplateTypeDetails ] = useState<EmailTemplateDetails>(undefined);
    const [ emailTemplateName, setEmailTemplateName ] = useState<string>('');

    /**
     * Util to handle back button event.
     */
    const handleBackButtonClick = () => {
        history.push(EMAIL_TEMPLATE_VIEW_PATH + templateTypeId);
    };

    useEffect(() => {
        const path: string[] = history.location.pathname.split("/");
        let templateTypeId = '';
        let templateId = '';
        let countryCode = "";
        let languageCode = "";
        
        //Handle edit flow if length is 5
        if (path.length === 5) {
            templateTypeId = path[ path.length - 3 ];
            templateId =  path[ path.length - 1 ];

            if (templateId.indexOf("_") !== -1) {
                countryCode = templateId.split("_")[1];
                languageCode = templateId.split("_")[0];
            } else {
                countryCode = templateId.split("-")[1];
                languageCode = templateId.split("-")[0];
            }

            const language = CountryLanguage.getLanguage(languageCode).name;
            const country = CountryLanguage.getCountry(countryCode).name;

            setLocaleName(country ? language + " (" + country + ")" : language);
        } else if (path.length === 4) {
            templateTypeId = path[ path.length - 2 ];
        }

        setTemplateId(templateId);
        setTemplateTypeId(templateTypeId);

        getEmailTemplate(templateTypeId).then((response: AxiosResponse<EmailTemplateDetails>) => {
            if (response.status === 200) {
                setEmailTemplateTypeDetails(response.data);
                setEmailTemplateName(response.data.displayName)
            }
        })
    }, [emailTemplateTypeDetails !== undefined]);

    return (
        <PageLayout
            title={ templateId === "" ? 
                "Add new template for " + emailTemplateTypeDetails?.displayName : 
                "Edit template - " + localeName }
            backButton={ {
                onClick: handleBackButtonClick,
                text: "Go back to " + emailTemplateName + " template"
            } }
            titleTextAlign="left"
            showBottomDivider={ true }
            bottomMargin={ false }
        >
            <AddLocaleTemplate templateId={ templateId } templateTypeId={ templateTypeId } />
        </PageLayout>
    )
}
