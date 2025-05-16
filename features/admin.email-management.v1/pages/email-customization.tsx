/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
import { Show, useRequiredScopes } from "@wso2is/access-control";
import BrandingPreferenceProvider from "@wso2is/admin.branding.v1/providers/branding-preference-provider";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import TemplateDangerZone from "@wso2is/common.templates.v1/components/template-danger-zone";
import TemplateHeader from "@wso2is/common.templates.v1/components/template-header";
import { TemplateManagementConstants } from "@wso2is/common.templates.v1/constants/template-management-constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DocumentationLink,
    PageLayout,
    ResourceTab,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { TabProps } from "semantic-ui-react";
import { useGetCurrentOrganizationType } from "../../admin.organizations.v1/hooks/use-get-organization-type";
import {
    createNewEmailTemplate,
    deleteEmailTemplate,
    updateEmailTemplate,
    useEmailTemplate,
    useEmailTemplatesList
} from "../api";
import { EmailCustomizationForm, EmailTemplatePreview } from "../components";
import EmailCustomizationFooter from "../components/email-customization-footer";
import { EmailManagementConstants } from "../constants/email-management-constants";
import { EmailTemplate, EmailTemplateType } from "../models";

type EmailCustomizationPageInterface = IdentifiableComponentInterface;

/**
 * Email customization page.
 *
 * @param props - Props injected to the component.
 *
 * @returns Main Page for Email Customization.
 */
const EmailCustomizationPage: FunctionComponent<EmailCustomizationPageInterface> = (
    props: EmailCustomizationPageInterface
): ReactElement => {
    const { ["data-componentid"]: componentId = "email-customization-page" } = props;

    const [ availableEmailTemplatesList, setAvailableEmailTemplatesList ] = useState<EmailTemplateType[]>([]);
    const [ selectedEmailTemplateId, setSelectedEmailTemplateId ] = useState<string>();
    const [ selectedEmailTemplateDescription, setSelectedEmailTemplateDescription ] = useState<string>();
    const [ selectedLocale, setSelectedLocale ] = useState(TemplateManagementConstants.DEAFULT_LOCALE);
    const [ selectedEmailTemplate, setSelectedEmailTemplate ] = useState<EmailTemplate>();
    const [ currentEmailTemplate, setCurrentEmailTemplate ] = useState<EmailTemplate>();
    const [ isTemplateNotAvailable, setIsTemplateNotAvailable ] = useState(false);
    const [ isSystemTemplate, setIsSystemTemplate ] = useState(false);
    const [ isInheritedTemplate, setIsInheritedTemplate ] = useState(false);
    const [ shouldFetch, setShouldFetch ] = useState(true);
    const [ error, setError ] = useState<AxiosError>();

    const emailTemplates: Record<string, string>[] = useSelector(
        (state: AppState) => state.config.deployment.extensions.emailTemplates) as Record<string, string>[];
    const enableCustomEmailTemplates: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableCustomEmailTemplates);
    const emailTemplatesFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.emailTemplates);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const hasUsersUpdateEmailTemplatesPermissions: boolean = useRequiredScopes(
        emailTemplatesFeatureConfig?.scopes?.update
    );

    const hasUsersCreateEmailTemplatesPermissions: boolean = useRequiredScopes(
        emailTemplatesFeatureConfig?.scopes?.create
    );

    const isReadOnly: boolean = useMemo(() => {
        return !isFeatureEnabled(
            emailTemplatesFeatureConfig,
            EmailManagementConstants.FEATURE_DICTIONARY.get("EMAIL_TEMPLATES_UPDATE")
        ) || !hasUsersUpdateEmailTemplatesPermissions;
    }, [ emailTemplatesFeatureConfig, allowedScopes ]);

    const hasEmailTemplateCreatePermissions: boolean = useMemo(() => {
        return isFeatureEnabled(
            emailTemplatesFeatureConfig,
            EmailManagementConstants.FEATURE_DICTIONARY.get("EMAIL_TEMPLATES_CREATE")
        ) && hasUsersCreateEmailTemplatesPermissions;
    }, [ emailTemplatesFeatureConfig, allowedScopes ]);

    const { isSubOrganization } = useGetCurrentOrganizationType();

    const {
        data: emailTemplatesList,
        isLoading: isEmailTemplatesListLoading,
        error: emailTemplatesListError
    } = useEmailTemplatesList();

    const {
        data: emailTemplate,
        isLoading: isEmailTemplateLoading,
        error: emailTemplateError,
        mutate: emailTemplateMutate
    } = useEmailTemplate(
        selectedEmailTemplateId,
        selectedLocale,
        isSystemTemplate,
        isInheritedTemplate,
        shouldFetch
    );

    useEffect(() => {
        // we don't have a good displayName and description coming from the backend
        // for the email template types. So as we agreed use the displayName and
        // description from the email template types config defined in
        // the deployment.toml file. The below code will map the email template
        // types with the config's displayName and description.
        const availableEmailTemplates: EmailTemplateType[] = emailTemplatesList
            ? (!enableCustomEmailTemplates
                ? emailTemplatesList.filter((template: EmailTemplateType) =>
                    emailTemplates?.find((emailTemplate: Record<string, string>) => emailTemplate.id === template.id)
                )
                : emailTemplatesList
            ).map((template: EmailTemplateType) => {
                const mappedTemplate: Record<string, string> = emailTemplates?.find(
                    (emailTemplate: Record<string, string>) => emailTemplate.id === template.id
                );

                return {
                    ...template,
                    description: mappedTemplate?.description || `${template.displayName} Template`,
                    displayName: mappedTemplate?.displayName || template.displayName
                };
            })
            : [];

        setAvailableEmailTemplatesList(availableEmailTemplates);

        if (!selectedEmailTemplateId) {
            setSelectedEmailTemplateId(availableEmailTemplates?.[0]?.id);
            setSelectedEmailTemplateDescription(availableEmailTemplates?.[0]?.description);
        }
    }, [ emailTemplatesList ]);

    useEffect(() => {
        setSelectedEmailTemplate({ ...emailTemplate });
        setIsTemplateNotAvailable(false);

        if (emailTemplate && Object.keys(emailTemplate).length > 0) {
            setCurrentEmailTemplate({ ...emailTemplate });
        }
    }, [ emailTemplate ]);

    useEffect(() => {
        if (!emailTemplatesListError) {
            return;
        }

        dispatch(addAlert({
            description: t("extensions:develop.emailTemplates.notifications.getEmailTemplateList.error.description"),
            level: AlertLevels.ERROR,
            message: t("extensions:develop.emailTemplates.notifications.getEmailTemplateList.error.message")
        }));
    }, [ emailTemplatesListError ]);

    useEffect(() => {
        if (!emailTemplateError || !selectedEmailTemplateId || emailTemplateError === error) {
            return;
        }

        setError(emailTemplateError);

        if (emailTemplateError.response.status === 404) {
            setIsTemplateNotAvailable(true);
            if (isSubOrganization() && !isInheritedTemplate) {
                setIsInheritedTemplate(true);

                return;
            } else if (!isSystemTemplate || selectedLocale !== TemplateManagementConstants.DEAFULT_LOCALE) {
                setIsSystemTemplate(true);

                return;
            } else {
                setCurrentEmailTemplate(undefined);
            }
        }

        dispatch(
            addAlert({
                description: t("extensions:develop.emailTemplates.notifications.getEmailTemplate.error.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.emailTemplates.notifications.getEmailTemplate.error.message")
            })
        );
    }, [ emailTemplateError, isSystemTemplate, isInheritedTemplate ]);

    // This is used to check whether the URL contains a template ID, and if so, set it as the selected template.
    useEffect(() => {
        const hash: string = window.location.hash;

        if (hash.startsWith("#templateId=")) {
            const templateId: string = hash.split("=")[1];

            setSelectedEmailTemplateId(templateId);
            setSelectedEmailTemplateDescription(availableEmailTemplatesList?.find(
                (template: EmailTemplateType) => template.id === templateId)?.description);
        }
    }, [ window.location.hash ]);

    const handleTemplateIdChange = (event: SelectChangeEvent<string>): void => {
        const templateId: string = event.target.value;

        setShouldFetch(false);
        setIsTemplateNotAvailable(false);
        setIsSystemTemplate(false);
        setIsInheritedTemplate(false);
        setCurrentEmailTemplate(undefined);
        setSelectedLocale(TemplateManagementConstants.DEAFULT_LOCALE);
        setSelectedEmailTemplateId(templateId);
        setSelectedEmailTemplateDescription(
            availableEmailTemplatesList?.find((template: EmailTemplateType) => template.id === templateId)?.description
        );
        setShouldFetch(true);
    };

    const handleTemplateChange = (updatedTemplateAttributes: Partial<EmailTemplate>) => {
        setSelectedEmailTemplate({ ...selectedEmailTemplate, ...updatedTemplateAttributes });
        setIsTemplateNotAvailable(false);
    };

    const handleLocaleChange = (event: SelectChangeEvent<string>): void => {
        const locale: string = event.target.value;

        setShouldFetch(false);
        setCurrentEmailTemplate({ ...selectedEmailTemplate });
        setIsTemplateNotAvailable(false);
        setIsSystemTemplate(false);
        setIsInheritedTemplate(false);
        setSelectedLocale(locale);
        setShouldFetch(true);
    };

    const handleSubmit = () => {
        setShouldFetch(false);
        const template: EmailTemplate = {
            ...selectedEmailTemplate,
            id: selectedLocale.replace("-", "_")
        };

        if (!template?.contentType) {
            template.contentType = EmailManagementConstants.DEFAULT_CONTENT_TYPE;
        }

        if (isSystemTemplate || isInheritedTemplate) {
            createNewEmailTemplate(selectedEmailTemplateId, template)
                .then((_response: EmailTemplate) => {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".success.message")
                    }));
                    setIsSystemTemplate(false);
                    setIsInheritedTemplate(false);
                    setShouldFetch(true);
                    emailTemplateMutate();
                }).catch(() => {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".error.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.emailTemplates.notifications" +
                            ".updateEmailTemplate.error.message")
                    }));
                });
        } else {
            updateEmailTemplate(selectedEmailTemplateId, template, selectedLocale)
                .then((_response: EmailTemplate) => {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".success.message")
                    }));
                    setIsSystemTemplate(false);
                    setIsInheritedTemplate(false);
                    setShouldFetch(true);
                    emailTemplateMutate();
                }).catch((error: IdentityAppsApiException) => {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".error.description"),
                        level: AlertLevels.ERROR,
                        message: error.message ?? t("extensions:develop.emailTemplates.notifications" +
                            ".updateEmailTemplate.error.message")
                    }));
                });
        }

        setIsTemplateNotAvailable(false);
    };

    const handleDeleteRequest = () => {
        setShouldFetch(false);
        deleteEmailTemplate(selectedEmailTemplateId, selectedLocale)
            .then((_response: AxiosResponse) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.emailTemplates.notifications.deleteEmailTemplate" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.emailTemplates.notifications.deleteEmailTemplate" +
                        ".success.message")
                }));
                setSelectedLocale(TemplateManagementConstants.DEAFULT_LOCALE);
                setIsSystemTemplate(true);
                setIsInheritedTemplate(false);
                setShouldFetch(true);
                emailTemplateMutate();
            }).catch(() => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("extensions:develop.emailTemplates.notifications.deleteEmailTemplate" +
                            ".error.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.emailTemplates.notifications.deleteEmailTemplate.error.message")
                    }));
            });
    };

    const resolveTabPanes = ():  TabProps[ "panes" ] => {
        const panes: TabProps [ "panes" ] = [];

        panes.push({
            menuItem: t("extensions:develop.emailTemplates.tabs.preview.label"),
            render: () => (
                <ResourceTab.Pane
                    className="email-template-resource-tab-pane"
                    attached="bottom"
                    data-componentid="email-customization-template-preview"
                >
                    <EmailTemplatePreview
                        emailTemplate={ selectedEmailTemplate || currentEmailTemplate }
                    />
                </ResourceTab.Pane>
            )
        });

        panes.push({
            menuItem: t("extensions:develop.emailTemplates.tabs.content.label"),
            render: () => (
                <ResourceTab.Pane
                    className="email-template-resource-tab-pane"
                    attached="bottom"
                    data-componentid="email-customization-template-content"
                >
                    <EmailCustomizationForm
                        isEmailTemplatesListLoading={ isEmailTemplatesListLoading || isEmailTemplateLoading }
                        selectedEmailTemplate={ currentEmailTemplate }
                        onTemplateChanged={
                            (updatedTemplateAttributes: Partial<EmailTemplate>) =>
                                handleTemplateChange(updatedTemplateAttributes) }
                        onSubmit={ handleSubmit }
                        readOnly={ isReadOnly || (isTemplateNotAvailable && !hasEmailTemplateCreatePermissions) }
                    />
                </ResourceTab.Pane>
            )
        });

        return panes;
    };

    return (
        <BrandingPreferenceProvider>
            <PageLayout
                title={ t("extensions:develop.emailTemplates.page.header") }
                pageTitle="Email Templates"
                description={ (
                    <>
                        { t("extensions:develop.emailTemplates.page.description") }
                        <DocumentationLink
                            link={ getLink("develop.emailCustomization.learnMore") }
                        >
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </> )
                }
                titleTextAlign="left"
                bottomMargin={ false }
                data-componentid={ componentId }
            >
                <TemplateHeader
                    templateChannel="email"
                    selectedTemplateId={ selectedEmailTemplateId }
                    selectedTemplateDescription={ selectedEmailTemplateDescription }
                    selectedLocale={ selectedLocale }
                    templatesList={ availableEmailTemplatesList }
                    onTemplateSelected={ handleTemplateIdChange }
                    onLocaleChanged={ handleLocaleChange }
                    data-componentid={ "email-customization-header" }
                />
                <ResourceTab
                    attached="top"
                    secondary={ false }
                    pointing={ false }
                    panes={ resolveTabPanes() }
                    onTabChange={ () => {
                        setCurrentEmailTemplate(selectedEmailTemplate);
                    } }
                    data-componentid={ `${ componentId }-forms` }
                />

                <Show
                    when={ featureConfig?.emailTemplates?.scopes?.update }
                >
                    {
                        (!isTemplateNotAvailable || hasEmailTemplateCreatePermissions) && (
                            <EmailCustomizationFooter
                                isSaveButtonLoading={ isEmailTemplatesListLoading || isEmailTemplateLoading }
                                onSaveButtonClick={ handleSubmit }
                            />
                        )
                    }
                </Show>

                <Show when={ featureConfig?.emailTemplates?.scopes?.delete }>
                    <TemplateDangerZone
                        templateChannel="email"
                        isSystemTemplate={ isSystemTemplate }
                        isInheritedTemplate={ isInheritedTemplate }
                        onDeleteRequest={ handleDeleteRequest }
                    />
                </Show>
            </PageLayout>
        </BrandingPreferenceProvider>
    );
};

export default EmailCustomizationPage;
