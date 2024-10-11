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

import { Show, useRequiredScopes } from "@wso2is/access-control";
import BrandingPreferenceProvider from "@wso2is/admin.branding.v1/providers/branding-preference-provider";
import { AppState, FeatureConfigInterface, I18nConstants } from "@wso2is/admin.core.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    AlertInterface,
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal, DangerZone,
    DangerZoneGroup,
    DocumentationLink,
    PageLayout,
    ResourceTab,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {TabProps, Segment, Divider} from "semantic-ui-react";
import {
    createNewEmailTemplate,
    deleteEmailTemplate,
    updateEmailTemplate,
    useEmailTemplate,
    useEmailTemplatesList
} from "../api";
import { SmsCustomizationForm, SmsTemplatePreview } from "../components";
import EmailCustomizationFooter from "../components/email-customization-footer";
import SmsCustomizationHeader from "../components/sms-customization-header";
import { SmsTemplate, SmsTemplateType } from "../models";
import Img from "./phone.png";
import {flexbox} from "@mui/system";
import exports from "webpack";
import system = exports.RuntimeGlobals.system;

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

    const { ["data-componentid"]: componentId } = props;
    const [ isSystemTemplate, setIsSystemTemplate] = useState(false);
    const [ availableSmsTemplatesList, setAvailableSmsTemplatesList ] = useState<SmsTemplateType[]>([]);
    const [ selectedSmsTemplateId, setSelectedSmsTemplateId ] = useState<string>();
    const [ selectedSmsTemplateDescription, setSelectedSmsTemplateDescription ] = useState<string>();
    const [ selectedLocale, setSelectedLocale ] = useState(I18nConstants.DEFAULT_FALLBACK_LANGUAGE);
    const [ selectedSmsTemplate, setSelectedSmsTemplate ] = useState<SmsTemplate>();
    const [ currentSmsTemplate, setCurrentSmsTemplate ] = useState<SmsTemplate>();
    const [ showReplicatePreviousTemplateModal, setShowReplicatePreviousTemplateModal ] = useState(false);
    const [ isTemplateNotAvailable, setIsTemplateNotAvailable ] = useState(false);

    const smsTemplates: Record<string, string>[] = useSelector(
        (state: AppState) => state.config.deployment.extensions.smsTemplates) as Record<string, string>[];
    const enableCustomEmailTemplates: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableCustomEmailTemplates);
    const emailTemplatesFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.emailTemplates);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const smsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features.smsTemplates);
    const hasUpdatePermission : boolean = useRequiredScopes(smsFeatureConfig?.scopes?.update);
    const hasCreatePermission : boolean = useRequiredScopes(smsFeatureConfig?.scopes?.create);

    const isReadOnly: boolean = useMemo(() => {
        return !smsFeatureConfig.enabled || !hasUpdatePermission;
    }, [ emailTemplatesFeatureConfig, allowedScopes ]);

    const hasEmailTemplateCreatePermissions: boolean = useMemo(() => {
        return smsFeatureConfig.enabled && hasCreatePermission;
    }, [ emailTemplatesFeatureConfig, allowedScopes ]);

    const {
        data: smsTemplatesList,
        isLoading: isSmsTemplatesListLoading,
        error: emailTemplatesListError
    } = useEmailTemplatesList();

    const {
        data: smsTemplate,
        isLoading: isSmsTemplateLoading,
        error: emailTemplateError,
        mutate: emailTemplateMutate
    } = useEmailTemplate(selectedSmsTemplateId, selectedLocale, setIsSystemTemplate);

    useEffect(() => {
        // we don't have a good displayName and description coming from the backend
        // for the SMS template types. So as we agreed use the displayName and
        // description from the email template types config defined in
        // the deployment.toml file. The below code will map the email template
        // types with the config's displayName and description.
        const availableSmsTemplates: SmsTemplateType[] = smsTemplatesList
            ? (!enableCustomEmailTemplates
                ? smsTemplatesList.filter((template: SmsTemplateType) =>
                    smsTemplates?.find((smsTemplate: Record<string, string>) => smsTemplate.id === template.id)
                )
                : smsTemplatesList
            ).map((template: SmsTemplateType) => {
                const mappedTemplate: Record<string, string> = smsTemplates?.find(
                    (emailTemplate: Record<string, string>) => emailTemplate.id === template.id
                );

                return {
                    ...template,
                    description: mappedTemplate?.description || `${template.displayName} Template`,
                    displayName: mappedTemplate?.displayName || template.displayName
                };
            })
            : [];

        setAvailableSmsTemplatesList(availableSmsTemplates);

        if (!selectedSmsTemplateId) {
            setSelectedSmsTemplateId(availableSmsTemplates?.[0]?.id);
            setSelectedSmsTemplateDescription(availableSmsTemplates?.[0]?.description);
        }
    }, [ smsTemplatesList ]);

    useEffect(() => {
        setSelectedSmsTemplate({ ...smsTemplate });
        setIsTemplateNotAvailable(false);

        if (smsTemplate && Object.keys(smsTemplate).length > 0) {
            setCurrentSmsTemplate({ ...smsTemplate });
        }
    }, [ smsTemplate ]);

    useEffect(() => {
        if (!emailTemplatesListError) {
            return;
        }

        if (emailTemplatesListError.response.data.description) {
            dispatch(addAlert({
                description: emailTemplatesListError.response?.data?.description,
                level: AlertLevels.ERROR,
                message: emailTemplatesListError.response.data.message ??
                    t("extensions:develop.emailTemplates.notifications.getEmailTemplateList.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("extensions:develop.emailTemplates.notifications.getEmailTemplateList.error.description"),
            level: AlertLevels.ERROR,
            message: t("extensions:develop.emailTemplates.notifications.getEmailTemplateList.error.message")
        }));
    }, [ emailTemplatesListError ]);

    useEffect(() => {
        if (!emailTemplateError || !selectedSmsTemplateId) {
            return;
        }

        // Show the replicate previous template modal and set the "isTemplateNotAvailable" flag to identify whether the
        // current template is a new template or not
        if (emailTemplateError.response.status === 404) {
            setIsTemplateNotAvailable(true);
            if (hasEmailTemplateCreatePermissions) {
                setShowReplicatePreviousTemplateModal(!isSystemTemplate ||
                    selectedLocale !== I18nConstants.DEFAULT_FALLBACK_LANGUAGE);

                return;
            } else {
                setCurrentSmsTemplate(undefined);
            }
        }

        if (emailTemplateError.response.data.description) {
            dispatch(addAlert({
                description: emailTemplateError.response?.data?.description,
                level: AlertLevels.ERROR,
                message: emailTemplateError.response.data.message ??
                    t("extensions:develop.emailTemplates.notifications.getEmailTemplate.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("extensions:develop.emailTemplates.notifications.getEmailTemplate.error.description"),
            level: AlertLevels.ERROR,
            message: t("extensions:develop.emailTemplates.notifications.getEmailTemplate.error.message")
        }));
    }, [ emailTemplateError ]);

    // This is used to check whether the URL contains a template ID, and if so, set it as the selected template.
    useEffect(() => {
        const hash: string = window.location.hash;

        if (hash.startsWith("#templateId=")) {
            const templateId: string = hash.split("=")[1];

            setSelectedSmsTemplateId(templateId);
            setSelectedSmsTemplateDescription(availableSmsTemplatesList?.find(
                (template: SmsTemplateType) => template.id === templateId)?.description);
        }
    }, [ window.location.hash ]);

    const handleTemplateIdChange = (templateId: string) => {
        setIsTemplateNotAvailable(false);
        setCurrentSmsTemplate(undefined);
        setSelectedLocale(I18nConstants.DEFAULT_FALLBACK_LANGUAGE);
        setSelectedSmsTemplateId(templateId);
        setSelectedSmsTemplateDescription(availableSmsTemplatesList?.find(
            (template: SmsTemplateType) => template.id === templateId)?.description);
    };

    const handleTemplateChange = (updatedTemplateAttributes: Partial<SmsTemplate>) => {
        setSelectedSmsTemplate({ ...selectedSmsTemplate, ...updatedTemplateAttributes });
    };

    const handleLocaleChange = (locale: string) => {
        setCurrentSmsTemplate({ ...selectedSmsTemplate });
        setIsTemplateNotAvailable(false);
        setIsSystemTemplate(false);
        setSelectedLocale(locale);
    };

    const handleSubmit = () => {
        const template: SmsTemplate = {
            ...selectedSmsTemplate,
            id: selectedLocale.replace("-", "_")
        };

        console.log(isSystemTemplate);
        if (isTemplateNotAvailable || isSystemTemplate) {
            createNewEmailTemplate(selectedSmsTemplateId, template)
                .then((_response: SmsTemplate) => {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".success.message")
                    }));
                }).catch((error: IdentityAppsApiException) => {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".error.description"),
                        level: AlertLevels.ERROR,
                        message: error.message ?? t("extensions:develop.emailTemplates.notifications" +
                            ".updateEmailTemplate.error.message")
                    }));
                }).finally(() => emailTemplateMutate());
        } else {
            updateEmailTemplate(selectedSmsTemplateId, template, selectedLocale)
                .then((_response: SmsTemplate) => {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".success.message")
                    }));
                }).catch((error: IdentityAppsApiException) => {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".error.description"),
                        level: AlertLevels.ERROR,
                        message: error.message ?? t("extensions:develop.emailTemplates.notifications" +
                            ".updateEmailTemplate.error.message")
                    }));
                }).finally(() => emailTemplateMutate());
        }

        setIsTemplateNotAvailable(false);
    };

    const handleDeleteRequest = () => {
        deleteEmailTemplate(selectedSmsTemplateId, selectedLocale)
            .then((_response: AxiosResponse) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.emailTemplates.notifications.deleteEmailTemplate" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.emailTemplates.notifications.deleteEmailTemplate" +
                        ".success.message")
                }));
            }).catch((error: IdentityAppsApiException) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.emailTemplates.notifications.deleteEmailTemplate" +
                        ".error.description"),
                    level: AlertLevels.ERROR,
                    message: error.message ?? t("extensions:develop.emailTemplates.notifications" +
                        ".deleteEmailTemplate.error.message")
                }));
            }).finally(() => {
                setSelectedLocale(I18nConstants.DEFAULT_FALLBACK_LANGUAGE);
            });
    };

    const replicatePreviousTemplate = () => {
        setSelectedSmsTemplate(currentSmsTemplate);
        setShowReplicatePreviousTemplateModal(false);
    };

    const cancelReplicationOfPreviousTemplate = () => {
        setSelectedSmsTemplate(undefined);
        setCurrentSmsTemplate(undefined);
        setShowReplicatePreviousTemplateModal(false);
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
                    <SmsTemplatePreview
                        smsTemplate={ selectedSmsTemplate || currentSmsTemplate }
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
                    <SmsCustomizationForm
                        isSmsTemplatesListLoading={ isSmsTemplatesListLoading || isSmsTemplateLoading }
                        selectedSmsTemplate={ currentSmsTemplate }
                        selectedLocale={ selectedLocale }
                        onTemplateChanged={
                            (updatedTemplateAttributes: Partial<SmsTemplate>) =>
                                handleTemplateChange(updatedTemplateAttributes) }
                        onSubmit={ handleSubmit }
                        onDeleteRequested={ handleDeleteRequest }
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
                title={ t("extensions:develop.smsTemplates.page.header") }
                pageTitle="Email Templates sssss"
                description={ (
                    <>
                        { t("extensions:develop.smsTemplates.page.description") }
                        <DocumentationLink
                            link={ getLink("develop.emailCustomization.learnMore") }
                        >
                            { t("extensions:common.learnMore") }
                        </DocumentationLink>
                    </> )
                }
                titleTextAlign="left"
                bottomMargin={ false }
                data-componentid={ componentId }
            >
                <SmsCustomizationHeader
                    selectedSmsTemplateId={ selectedSmsTemplateId }
                    selectedSmsTemplateDescription={ selectedSmsTemplateDescription }
                    selectedLocale={ selectedLocale }
                    smsTemplatesList={ availableSmsTemplatesList }
                    onTemplateSelected={ handleTemplateIdChange }
                    onLocaleChanged={ handleLocaleChange }
                />

                <Segment.Group>
                    <Segment.Group horizontal>
                        <Segment style={ { flex: "0 0 65%" } }>
                            { t("extensions:develop.emailTemplates.tabs.content.label") }
                        </Segment>
                        <Segment>{ t("extensions:develop.emailTemplates.tabs.preview.label") }</Segment>
                    </Segment.Group>

                    <Segment.Group horizontal style={ { backgroundColor: "white" } }>
                        <Segment style={ { flex: "0 0 65%" } }>
                            <SmsCustomizationForm
                                isSmsTemplatesListLoading={ isSmsTemplatesListLoading || isSmsTemplateLoading }
                                selectedSmsTemplate={ currentSmsTemplate }
                                selectedLocale={ selectedLocale }
                                onTemplateChanged={
                                    (updatedTemplateAttributes: Partial<SmsTemplate>) =>
                                        handleTemplateChange(updatedTemplateAttributes) }
                                onSubmit={ handleSubmit }
                                onDeleteRequested={ handleDeleteRequest }
                                readOnly={
                                    isReadOnly || (isTemplateNotAvailable && !hasEmailTemplateCreatePermissions) }
                            />
                        </Segment>
                        <Segment style={{display:'flex', paddingBottom:0}}>
                            <SmsTemplatePreview
                                smsTemplate={ selectedSmsTemplate || currentSmsTemplate }
                            />
                        </Segment>
                    </Segment.Group>

                    <Segment padded={ true }>
                        <Show
                            when={ featureConfig?.emailTemplates?.scopes?.update }
                        >
                            {
                                (!isTemplateNotAvailable || hasEmailTemplateCreatePermissions) && (
                                    <EmailCustomizationFooter
                                        isSaveButtonLoading={ isSmsTemplatesListLoading || isSmsTemplateLoading }
                                        onSaveButtonClick={ handleSubmit }
                                    />
                                )
                            }
                        </Show>
                    </Segment>
                </Segment.Group>

                <Divider hidden/>

                <Show
                    when={ featureConfig?.emailTemplates?.scopes?.delete }
                >
                    <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                        <DangerZone
                            data-componentid={ `${ componentId }-revert-email-provider-config` }
                            actionTitle={ t("extensions:develop.emailTemplates.dangerZone.action") }
                            header={ t("extensions:develop.emailTemplates.dangerZone.heading") }
                            subheader={ t("extensions:develop.emailTemplates.dangerZone.message") }
                            isButtonDisabled={ selectedLocale === I18nConstants.DEFAULT_FALLBACK_LANGUAGE }
                            buttonDisableHint={ t("extensions:develop.emailTemplates.dangerZone.actionDisabledHint") }
                            onActionClick={ handleDeleteRequest }
                        />
                    </DangerZoneGroup>
                </Show>

                <ConfirmationModal
                    type="info"
                    open={ showReplicatePreviousTemplateModal }
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => cancelReplicationOfPreviousTemplate() }
                    onPrimaryActionClick={ (): void => replicatePreviousTemplate() }
                    data-componentid={ `${ componentId }-replicate-previous-template-confirmation-modal` }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${ componentId }-replicate-previous-template-confirmation-modal-header` }
                    >
                        { t("extensions:develop.emailTemplates.modal.replicateContent.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        info
                        data-componentid={ `${ componentId }-replicate-previous-template-confirmation-modal-message` }
                    >
                        { t("extensions:develop.emailTemplates.modal.replicateContent.message") }
                    </ConfirmationModal.Message>
                </ConfirmationModal>
            </PageLayout>
        </BrandingPreferenceProvider>
    );
};

/**
 * Default props for the component.
 */
EmailCustomizationPage.defaultProps = {
    "data-componentid": "email-customization-page"
};

export default EmailCustomizationPage;
