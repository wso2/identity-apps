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

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import * as CountryLanguage from "country-language";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { AppConstants, history } from "../../core";
import { getEmailTemplate } from "../api";
import { AddEmailTemplateForm } from "../components";
import { EmailTemplateDetails, EmailTemplateFormModes } from "../models";

/**
 * Props for the add Templates Locale page.
 */
type EmailTemplateEditPagePropsInterface = TestableComponentInterface;

/**
 * Route parameters interface.
 */
interface RouteParams {
    templateTypeId: string;
    templateId: string;
}

/**
 * Component will render add view for a email template based on
 * locale for selected email template type.
 *
 * @param {EmailTemplateEditPagePropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
const EmailTemplateEditPage: FunctionComponent<EmailTemplateEditPagePropsInterface> = (
    props: EmailTemplateEditPagePropsInterface & RouteComponentProps<RouteParams>
): ReactElement => {

    const {
        match,
        [ "data-testid" ]: testId
    } = props;

    const templateTypeId = match?.params?.templateTypeId;
    const templateId = match?.params?.templateId;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ localeName, setLocaleName ] = useState<string>("");
    const [ formMode, setFormMode ] = useState<EmailTemplateFormModes>(EmailTemplateFormModes.ADD);
    const [ emailTemplateTypeDetails, setEmailTemplateTypeDetails ] = useState<EmailTemplateDetails>(undefined);
    const [ emailTemplateName, setEmailTemplateName ] = useState<string>("");

    useEffect(() => {
        // Return if the path doesn't have the template type id or template id URL params.
        if (!templateTypeId || !templateId) {
            return;
        }

        // If only template type id is there in the path, then the component should
        // behave as a template adding component.
        if (templateTypeId && (!templateId || templateId === AppConstants.EMAIL_TEMPLATE_ADD_URL_PARAM)) {
            setFormMode(EmailTemplateFormModes.ADD);

            return;
        }

        // If both template type id & template if is there in the path, then the component should
        // behave as a template editing component.
        setFormMode(EmailTemplateFormModes.EDIT);

        let countryCode = "";
        let languageCode = "";

        if (templateId.indexOf("_") !== -1) {
            countryCode = templateId.split("_")[ 1 ];
            languageCode = templateId.split("_")[ 0 ];
        }

        const language = CountryLanguage.getLanguage(languageCode).name;
        const country = CountryLanguage.getCountry(countryCode).name;

        setLocaleName(country ? language + " (" + country + ")" : language);

        getEmailTemplate(templateTypeId)
            .then((response: AxiosResponse<EmailTemplateDetails>) => {
                if (response.status === 200) {
                    setEmailTemplateTypeDetails(response.data);
                    setEmailTemplateName(response.data.displayName);

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.emailTemplates.notifications.getTemplateDetails" +
                        ".genericError.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.emailTemplates.notifications.getTemplateDetails" +
                        ".genericError.message")
                }));
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.emailTemplates.notifications.getTemplateDetails" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.emailTemplates.notifications.getTemplateDetails" +
                        ".genericError.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.emailTemplates.notifications.getTemplateDetails" +
                        ".genericError.message")
                }));
            });
    }, [ templateTypeId, templateId ]);

    /**
     * Util to handle back button event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("EMAIL_TEMPLATES").replace(":templateTypeId", templateTypeId));
    };

    return (
        <PageLayout
            title={
                formMode === EmailTemplateFormModes.EDIT
                    ? t("console:manage.pages.editTemplate.title",
                        { template: emailTemplateTypeDetails?.displayName })
                    : t("console:manage.pages.addEmailTemplate.title")
            }
            pageTitle={
                formMode === EmailTemplateFormModes.EDIT
                    ? t("console:manage.pages.editTemplate.title",
                        { template: emailTemplateTypeDetails?.displayName })
                    : t("console:manage.pages.addEmailTemplate.title")
            }
            backButton={ {
                onClick: handleBackButtonClick,
                text: formMode === EmailTemplateFormModes.EDIT
                    ? t("console:manage.pages.editTemplate.backButton", { name: emailTemplateName })
                    : t("console:manage.pages.addEmailTemplate.backButton", { name: emailTemplateName })
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={
                formMode === EmailTemplateFormModes.EDIT
                    ? `${ testId }-edit-page-layout`
                    : `${ testId }-add-page-layout`
            }
        >
            <AddEmailTemplateForm
                mode={ formMode }
                templateId={ templateId }
                templateTypeId={ templateTypeId }
                data-testid={ `${ testId }-form` }
            />
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
EmailTemplateEditPage.defaultProps = {
    "data-testid": "email-template"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default EmailTemplateEditPage;
