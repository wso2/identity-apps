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

import { TestableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import * as CountryLanguage from "country-language";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getEmailTemplate } from "../../api";
import { AddLocaleTemplate } from "../../components";
import { EMAIL_TEMPLATE_VIEW_PATH } from "../../constants";
import { history } from "../../helpers";
import { EmailTemplateDetails } from "../../models";

/**
 * Props for the add Templates Locale page.
 */
type AddTemplateLocalePageInterface = TestableComponentInterface

/**
 * Component will render add view for a email template based on
 * locale for selected email template type.
 *
 * @param {AddTemplateLocalePageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const AddTemplateLocale: FunctionComponent<AddTemplateLocalePageInterface> = (
    props: AddTemplateLocalePageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ templateTypeId, setTemplateTypeId ] = useState<string>("");
    const [ templateId, setTemplateId ] = useState<string>("");
    const [ localeName, setLocaleName ] = useState<string>("");
    const [ emailTemplateTypeDetails, setEmailTemplateTypeDetails ] = useState<EmailTemplateDetails>(undefined);
    const [ emailTemplateName, setEmailTemplateName ] = useState<string>("");

    /**
     * Util to handle back button event.
     */
    const handleBackButtonClick = () => {
        history.push(EMAIL_TEMPLATE_VIEW_PATH + templateTypeId);
    };

    useEffect(() => {
        const path: string[] = history.location.pathname.split("/");
        let templateTypeId = "";
        let templateId = "";
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
            title={ templateId === ""
                ? t("adminPortal:pages.emailLocaleAddWithDisplayName.title",
                    { displayName: emailTemplateTypeDetails?.displayName })
                : t("adminPortal:pages.emailLocaleAdd.title", { name: localeName })
            }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("adminPortal:pages.emailLocaleAdd.backButton", { name: emailTemplateName })
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >
            <AddLocaleTemplate
                templateId={ templateId }
                templateTypeId={ templateTypeId }
                data-testid={ `${ testId }-form` }
            />
        </PageLayout>
    )
};

/**
 * Default props for the component.
 */
AddTemplateLocale.defaultProps = {
    "data-testid": "email-locale-add"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AddTemplateLocale;
