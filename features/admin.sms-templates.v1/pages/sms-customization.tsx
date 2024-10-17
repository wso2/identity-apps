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
import { DangerZone, DangerZoneGroup, DocumentationLink, PageLayout, useDocumentation } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Segment } from "semantic-ui-react";
import createSmsTemplate from "../api/create-sms-template";
import deleteSmsTemplate from "../api/delete-sms-template";
import updateSmsTemplate from "../api/update-sms-template";
import useGetSmsTemplate from "../api/use-get-sms-template";
import useGetSmsTemplatesList from "../api/use-get-sms-templates-list";
import SmsCustomizationFooter from "../components/sms-customization-footer";
import { SmsCustomizationForm } from "../components/sms-customization-form";
import SmsCustomizationHeader from "../components/sms-customization-header";
import { SmsTemplatePreview } from "../components/sms-template-preview";
import { SmsTemplate, SmsTemplateType } from "../models/sms-templates";
import "./sms-customization.scss";

type SmsCustomizationPageInterface = IdentifiableComponentInterface;

/**
 * SMS customization page.
 *
 * @param props - Props injected to the component. { dataComponentId = "sms-customization-page" }
 *
 * @returns Main Page for SMS Customization.
 */
const SmsCustomizationPage: FunctionComponent<SmsCustomizationPageInterface> = (
    props: SmsCustomizationPageInterface
): ReactElement => {
    const { ["data-componentid"]: componentId = "sms-customization-page" } = props;

    const [ availableSmsTemplatesList, setAvailableSmsTemplatesList ] = useState<SmsTemplateType[]>([]);
    const [ currentSmsTemplate, setCurrentSmsTemplate ] = useState<SmsTemplate>();
    const [ isSystemTemplate, setIsSystemTemplate ] = useState(false);
    const [ shouldFetch, setShouldFetch ] = useState(true);
    const [ isTemplateNotAvailable, setIsTemplateNotAvailable ] = useState(false);
    const [ selectedLocale, setSelectedLocale ] = useState(I18nConstants.DEFAULT_FALLBACK_LANGUAGE);
    const [ selectedSmsTemplateId, setSelectedSmsTemplateId ] = useState<string>();
    const [ selectedSmsTemplateDescription, setSelectedSmsTemplateDescription ] = useState<string>();
    const [ selectedSmsTemplate, setSelectedSmsTemplate ] = useState<SmsTemplate>();
    const [ error, setError ] = useState<AxiosError>();

    const smsTemplates: Record<string, string>[] = useSelector(
        (state: AppState) => state.config.deployment.extensions.smsTemplates
    ) as Record<string, string>[];
    const enableCustomSmsTemplates: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableCustomSmsTemplates
    );
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const smsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features.smsTemplates
    );

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const hasUpdatePermission: boolean = useRequiredScopes(smsFeatureConfig?.scopes?.update);
    const hasCreatePermission: boolean = useRequiredScopes(smsFeatureConfig?.scopes?.create);

    const isReadOnly: boolean = !smsFeatureConfig.enabled || !hasUpdatePermission;
    const hasSmsTemplateCreatePermissions: boolean = smsFeatureConfig.enabled && hasCreatePermission;

    const {
        data: smsTemplatesList,
        isLoading: isSmsTemplatesListLoading,
        error: smsTemplatesListError
    } = useGetSmsTemplatesList();

    const {
        data: smsTemplate,
        isLoading: isSmsTemplateLoading,
        error: smsTemplateError
    } = useGetSmsTemplate(selectedSmsTemplateId, selectedLocale, isSystemTemplate, shouldFetch);

    useEffect(() => {
        // we don't have a good displayName and description coming from the backend
        // for the SMS template types. So as we agreed use the displayName and
        // description from the SMS template types config defined in
        // the deployment.toml file. The below code will map the SMS template
        // types with the config's displayName and description.
        const availableSmsTemplates: SmsTemplateType[] = smsTemplatesList
            ? (!enableCustomSmsTemplates
                ? smsTemplatesList.filter((template: SmsTemplateType) =>
                    smsTemplates?.find((smsTemplate: Record<string, string>) => smsTemplate.id === template.id)
                )
                : smsTemplatesList
            ).map((template: SmsTemplateType) => {
                const mappedTemplate: Record<string, string> = smsTemplates?.find(
                    (smsTemplate: Record<string, string>) => smsTemplate.id === template.id
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
        if (!smsTemplatesListError) {
            return;
        }

        dispatch(
            addAlert({
                description: t("smsTemplates:notifications.getSmsTemplateList.error.description"),
                level: AlertLevels.ERROR,
                message: t("smsTemplates:notifications.getSmsTemplateList.error.message")
            })
        );
    }, [ smsTemplatesListError ]);

    useEffect(() => {
        if (!smsTemplateError || !selectedSmsTemplateId || smsTemplateError === error) {
            return;
        }

        setError(smsTemplateError);

        // Show the replicate previous template modal and set the "isTemplateNotAvailable" flag to identify whether the
        // current template is a new template or not
        if (smsTemplateError.response.status === 404) {
            setIsTemplateNotAvailable(true);
            if (hasSmsTemplateCreatePermissions) {
                if (!isSystemTemplate || selectedLocale !== I18nConstants.DEFAULT_FALLBACK_LANGUAGE) {
                    // replicatePreviousTemplate();
                    setIsSystemTemplate(true);
                }

                return;
            } else {
                setCurrentSmsTemplate(undefined);
            }
        }

        dispatch(
            addAlert({
                description: t("smsTemplates:notifications.getSmsTemplate.error.description"),
                level: AlertLevels.ERROR,
                message: t("smsTemplates:notifications.getSmsTemplate.error.message")
            })
        );
    }, [ smsTemplateError, isSystemTemplate ]);

    // This is used to check whether the URL contains a template ID, and if so, set it as the selected template.
    useEffect(() => {
        const hash: string = window.location.hash;

        if (hash.startsWith("#templateId=")) {
            const templateId: string = hash.split("=")[1];

            setSelectedSmsTemplateId(templateId);
            setSelectedSmsTemplateDescription(
                availableSmsTemplatesList?.find((template: SmsTemplateType) => template.id === templateId)?.description
            );
        }
    }, [ window.location.hash ]);

    const handleTemplateIdChange = (templateId: string): void => {
        setShouldFetch(false);
        setIsTemplateNotAvailable(false);
        setIsSystemTemplate(false);
        setCurrentSmsTemplate(undefined);
        setSelectedLocale(I18nConstants.DEFAULT_FALLBACK_LANGUAGE);
        setSelectedSmsTemplateId(templateId);
        setSelectedSmsTemplateDescription(
            availableSmsTemplatesList?.find((template: SmsTemplateType) => template.id === templateId)?.description
        );
        setShouldFetch(true);
    };

    const handleTemplateChange = (updatedTemplateAttributes: Partial<SmsTemplate>): void => {
        setSelectedSmsTemplate({ ...selectedSmsTemplate, ...updatedTemplateAttributes });
        setIsTemplateNotAvailable(false);
    };

    const handleLocaleChange = (locale: string): void => {
        setShouldFetch(false);
        setCurrentSmsTemplate({ ...selectedSmsTemplate });
        setIsTemplateNotAvailable(true);
        setIsSystemTemplate(false);
        setSelectedLocale(locale);
        setShouldFetch(true);
    };

    const handleSubmit = (): void => {
        setShouldFetch(false);
        const template: SmsTemplate = {
            ...selectedSmsTemplate,
            id: selectedLocale.replace("-", "_")
        };

        if (isSystemTemplate) {
            createSmsTemplate(selectedSmsTemplateId, template)
                .then((_response: SmsTemplate) => {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("smsTemplates:notifications.updateSmsTemplate" + ".success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("smsTemplates:notifications.updateSmsTemplate" + ".success.message")
                        })
                    );
                    setIsSystemTemplate(false);
                    setShouldFetch(true);
                })
                .catch((error: IdentityAppsApiException) => {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("smsTemplates:notifications.updateSmsTemplate.error.description"),
                            level: AlertLevels.ERROR,
                            message: error.message ?? t("smsTemplates:notifications.updateSmsTemplate.error.message")
                        })
                    );
                });
        } else {
            updateSmsTemplate(selectedSmsTemplateId, template, selectedLocale)
                .then((_response: SmsTemplate) => {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("smsTemplates:notifications.updateSmsTemplate" + ".success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("smsTemplates:notifications.updateSmsTemplate" + ".success.message")
                        })
                    );
                    setIsSystemTemplate(false);
                    setShouldFetch(true);
                })
                .catch((error: IdentityAppsApiException) => {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("smsTemplates:notifications.updateSmsTemplate" + ".error.description"),
                            level: AlertLevels.ERROR,
                            message:
                                error.message ?? t("smsTemplates:notifications" + ".updateSmsTemplate.error.message")
                        })
                    );
                });
        }

        setIsTemplateNotAvailable(false);
        setIsSystemTemplate(false);
    };

    const handleDeleteRequest = (): void => {
        setShouldFetch(false);
        deleteSmsTemplate(selectedSmsTemplateId, selectedLocale)
            .then((_response: AxiosResponse) => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("smsTemplates:notifications.deleteSmsTemplate" + ".success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("smsTemplates:notifications.deleteSmsTemplate" + ".success.message")
                    })
                );
                setSelectedLocale(I18nConstants.DEFAULT_FALLBACK_LANGUAGE);
                setIsSystemTemplate(false);
                setShouldFetch(true);
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("smsTemplates:notifications.deleteSmsTemplate" + ".error.description"),
                        level: AlertLevels.ERROR,
                        message: error.message ?? t("smsTemplates:notifications" + ".deleteSmsTemplate.error.message")
                    })
                );
            });
    };

    return (
        <BrandingPreferenceProvider>
            <PageLayout
                title={ t("smsTemplates:page.header") }
                pageTitle={ t("smsTemplates:page.header") }
                description={
                    (<>
                        { t("smsTemplates:page.description") }
                        <DocumentationLink link={ getLink("develop.smsCustomization.learnMore") }>
                            { t("smsTemplates:common.learnMore") }
                        </DocumentationLink>
                    </>)
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
                        <Segment className="sms-template-segment-content-header">
                            { t("smsTemplates:tabs.content.label") }
                        </Segment>
                        <Segment>{ t("smsTemplates:tabs.preview.label") }</Segment>
                    </Segment.Group>

                    <Segment.Group horizontal>
                        <Segment className="sms-template-segment-content">
                            <SmsCustomizationForm
                                isSmsTemplatesListLoading={ isSmsTemplatesListLoading || isSmsTemplateLoading }
                                selectedSmsTemplate={ currentSmsTemplate }
                                selectedLocale={ selectedLocale }
                                onTemplateChanged={ (updatedTemplateAttributes: Partial<SmsTemplate>) =>
                                    handleTemplateChange(updatedTemplateAttributes)
                                }
                                onSubmit={ handleSubmit }
                                onDeleteRequested={ handleDeleteRequest }
                                readOnly={ isReadOnly || (isTemplateNotAvailable && !hasSmsTemplateCreatePermissions) }
                            />
                        </Segment>
                        <Segment className="sms-template-segment-preview">
                            <SmsTemplatePreview smsTemplate={ selectedSmsTemplate || currentSmsTemplate } />
                        </Segment>
                    </Segment.Group>

                    <Segment padded={ true }>
                        <Show when={ featureConfig?.smsTemplates?.scopes?.update }>
                            { (!isTemplateNotAvailable || hasSmsTemplateCreatePermissions) && (
                                <SmsCustomizationFooter
                                    isSaveButtonLoading={ isSmsTemplatesListLoading || isSmsTemplateLoading }
                                    onSaveButtonClick={ handleSubmit }
                                />
                            ) }
                        </Show>
                    </Segment>
                </Segment.Group>

                <Divider hidden />

                { !isSystemTemplate && selectedLocale !== I18nConstants.DEFAULT_FALLBACK_LANGUAGE && (
                    <Show when={ featureConfig?.smsTemplates?.scopes?.delete }>
                        <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                            <DangerZone
                                data-componentid={ `${componentId}-remove-sms-provider-config` }
                                actionTitle={ t("smsTemplates:dangerZone.remove.action") }
                                header={ t("smsTemplates:dangerZone.remove.heading") }
                                subheader={ t("smsTemplates:dangerZone.remove.message") }
                                onActionClick={ handleDeleteRequest }
                            />
                        </DangerZoneGroup>
                    </Show>
                ) }

                { !isSystemTemplate && selectedLocale === I18nConstants.DEFAULT_FALLBACK_LANGUAGE && (
                    <Show when={ featureConfig?.smsTemplates?.scopes?.delete }>
                        <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                            <DangerZone
                                data-componentid={ `${componentId}-revert-sms-provider-config` }
                                actionTitle={ t("smsTemplates:dangerZone.revert.action") }
                                header={ t("smsTemplates:dangerZone.revert.heading") }
                                subheader={ t("smsTemplates:dangerZone.revert.message") }
                                onActionClick={ handleDeleteRequest }
                            />
                        </DangerZoneGroup>
                    </Show>
                ) }
            </PageLayout>
        </BrandingPreferenceProvider>
    );
};

export default SmsCustomizationPage;
