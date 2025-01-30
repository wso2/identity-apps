/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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
import Typography from "@oxygen-ui/react/Typography";
import { Show, useRequiredScopes } from "@wso2is/access-control";
import BrandingPreferenceProvider from "@wso2is/admin.branding.v1/providers/branding-preference-provider";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import {
    AlertInterface,
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DangerZone, DangerZoneGroup, DocumentationLink, PageLayout, useDocumentation } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import createSmsTemplate from "../api/create-sms-template";
import deleteSmsTemplate from "../api/delete-sms-template";
import updateSmsTemplate from "../api/update-sms-template";
import useGetSmsTemplate from "../api/use-get-sms-template";
import useGetSmsTemplatesList from "../api/use-get-sms-templates-list";
import SMSCustomizationFooter from "../components/sms-customization-footer";
import SMSCustomizationForm from "../components/sms-customization-form";
import SMSCustomizationHeader from "../components/sms-customization-header";
import SMSTemplatePreview from "../components/sms-template-preview";
import { SMSTemplateConstants } from "../constants/sms-template-constants";
import { SMSTemplate, SMSTemplateType } from "../models/sms-templates";
import "./sms-customization.scss";

type SMSCustomizationPageInterface = IdentifiableComponentInterface;

/**
 * SMS customization page.
 *
 * @param props - Props injected to the component. \{ dataComponentId = "sms-customization-page" \}
 * @returns Main Page for SMS Customization.
 */
const SMSCustomizationPage: FunctionComponent<SMSCustomizationPageInterface> = (
    props: SMSCustomizationPageInterface
): ReactElement => {
    const { ["data-componentid"]: componentId = "sms-customization-page" } = props;

    const [ availableSmsTemplatesList, setAvailableSmsTemplatesList ] = useState<SMSTemplateType[]>([]);
    const [ currentSmsTemplate, setCurrentSmsTemplate ] = useState<SMSTemplate>();
    const [ isSystemTemplate, setIsSystemTemplate ] = useState(false);
    const [ isInheritedTemplate, setIsInheritedTemplate ] = useState(false);
    const [ shouldFetch, setShouldFetch ] = useState(true);
    const [ isTemplateNotAvailable, setIsTemplateNotAvailable ] = useState(false);
    const [ selectedLocale, setSelectedLocale ] = useState(SMSTemplateConstants.DEAFULT_LOCALE);
    const [ selectedSmsTemplateId, setSelectedSmsTemplateId ] = useState<string>();
    const [ selectedSmsTemplateDescription, setSelectedSmsTemplateDescription ] = useState<string>();
    const [ selectedSmsTemplate, setSelectedSmsTemplate ] = useState<SMSTemplate>();
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

    const { isSubOrganization } = useGetCurrentOrganizationType();

    const {
        data: smsTemplatesList,
        isLoading: isSmsTemplatesListLoading,
        error: smsTemplatesListError
    } = useGetSmsTemplatesList();

    const {
        data: smsTemplate,
        isLoading: isSmsTemplateLoading,
        error: smsTemplateError,
        mutate: mutateSmsTemplate
    } = useGetSmsTemplate(
        selectedSmsTemplateId,
        selectedLocale,
        isSystemTemplate,
        isInheritedTemplate,
        shouldFetch
    );

    useEffect(() => {
        // we don't have a good displayName and description coming from the backend
        // for the SMS template types. So as we agreed use the displayName and
        // description from the SMS template types config defined in
        // the deployment.toml file. The below code will map the SMS template
        // types with the config's displayName and description.
        const availableSmsTemplates: SMSTemplateType[] = [];

        if (smsTemplatesList) {
            const filteredTemplates: SMSTemplateType[] = smsTemplatesList.filter((template: SMSTemplateType) => {
                if (!enableCustomSmsTemplates) {
                    return smsTemplates?.some((smsTemplate: Record<string, string>) => smsTemplate.id === template.id);
                }

                return true;
            });

            filteredTemplates.forEach((template: SMSTemplateType) => {
                const mappedTemplate: Record<string, string> =
                    smsTemplates?.find((smsTemplate: Record<string, string>) => smsTemplate.id === template.id) || {};

                availableSmsTemplates.push({
                    ...template,
                    description: mappedTemplate.description || `${template.displayName} Template`,
                    displayName: mappedTemplate.displayName || template.displayName
                });
            });
        }

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

        if (smsTemplateError.response.status === 404) {
            setIsTemplateNotAvailable(true);
            if (isSubOrganization() && !isInheritedTemplate) {
                setIsInheritedTemplate(true);

                return;
            } else if (!isSystemTemplate || selectedLocale !== SMSTemplateConstants.DEAFULT_LOCALE) {
                setIsSystemTemplate(true);

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
    }, [ smsTemplateError, isSystemTemplate, isInheritedTemplate ]);

    const handleTemplateIdChange = (event: SelectChangeEvent<string>): void => {
        const templateId: string = event.target.value;

        setShouldFetch(false);
        setIsTemplateNotAvailable(false);
        setIsSystemTemplate(false);
        setIsInheritedTemplate(false);
        setCurrentSmsTemplate(undefined);
        setSelectedLocale(SMSTemplateConstants.DEAFULT_LOCALE);
        setSelectedSmsTemplateId(templateId);
        setSelectedSmsTemplateDescription(
            availableSmsTemplatesList?.find((template: SMSTemplateType) => template.id === templateId)?.description
        );
        setShouldFetch(true);
        mutateSmsTemplate();
    };

    const handleTemplateChange = (updatedTemplateAttributes: Partial<SMSTemplate>): void => {
        setSelectedSmsTemplate({ ...selectedSmsTemplate, ...updatedTemplateAttributes });
        setIsTemplateNotAvailable(false);
    };

    const handleLocaleChange = (event: SelectChangeEvent<string>): void => {
        const locale: string = event.target.value;

        setShouldFetch(false);
        setCurrentSmsTemplate({ ...selectedSmsTemplate });
        setIsTemplateNotAvailable(true);
        setIsSystemTemplate(false);
        setIsInheritedTemplate(false);
        setSelectedLocale(locale);
        setShouldFetch(true);
        mutateSmsTemplate();
    };

    const handleSubmit = (): void => {
        setShouldFetch(false);
        const template: SMSTemplate = {
            ...selectedSmsTemplate,
            id: selectedLocale.replace("-", "_")
        };

        if (isSystemTemplate || isInheritedTemplate) {
            createSmsTemplate(selectedSmsTemplateId, template)
                .then((_response: SMSTemplate) => {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("smsTemplates:notifications.updateSmsTemplate.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("smsTemplates:notifications.updateSmsTemplate.success.message")
                        })
                    );
                    setIsSystemTemplate(false);
                    setIsInheritedTemplate(false);
                    setShouldFetch(true);
                    mutateSmsTemplate();
                })
                .catch(() => {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("smsTemplates:notifications.updateSmsTemplate.error.description"),
                            level: AlertLevels.ERROR,
                            message: t("smsTemplates:notifications.updateSmsTemplate.error.message")
                        })
                    );
                });
        } else {
            updateSmsTemplate(selectedSmsTemplateId, template, selectedLocale)
                .then((_response: SMSTemplate) => {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("smsTemplates:notifications.updateSmsTemplate.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("smsTemplates:notifications.updateSmsTemplate.success.message")
                        })
                    );
                    setIsSystemTemplate(false);
                    setIsInheritedTemplate(false);
                    setShouldFetch(true);
                    mutateSmsTemplate();
                })
                .catch(() => {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("smsTemplates:notifications.updateSmsTemplate.error.description"),
                            level: AlertLevels.ERROR,
                            message: t("smsTemplates:notifications.updateSmsTemplate.error.message")
                        })
                    );
                });
        }

        setIsTemplateNotAvailable(false);
        setIsSystemTemplate(false);
        setIsInheritedTemplate(false);
    };

    const handleDeleteRequest = (): void => {
        setShouldFetch(false);
        deleteSmsTemplate(selectedSmsTemplateId, selectedLocale)
            .then((_response: AxiosResponse) => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("smsTemplates:notifications.deleteSmsTemplate.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("smsTemplates:notifications.deleteSmsTemplate.success.message")
                    })
                );
                setSelectedLocale(SMSTemplateConstants.DEAFULT_LOCALE);
                setIsSystemTemplate(false);
                setIsInheritedTemplate(false);
                setShouldFetch(true);
                mutateSmsTemplate();
            })
            .catch(() => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("smsTemplates:notifications.deleteSmsTemplate.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("smsTemplates:notifications.deleteSmsTemplate.error.message")
                    })
                );
            });
    };

    const renderDangerZone = (): ReactElement => {
        let zoneType: string = "revert";

        if (isSystemTemplate || isInheritedTemplate) {
            return null;
        } else if (selectedLocale !== SMSTemplateConstants.DEAFULT_LOCALE) {
            zoneType = "remove";
        }

        const props: any = {
            actionTitle: t(`smsTemplates:dangerZone.${zoneType}.action`),
            header: t(`smsTemplates:dangerZone.${zoneType}.heading`),
            subheader: t(`smsTemplates:dangerZone.${zoneType}.message`)
        };

        return (
            <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                <DangerZone
                    { ...props }
                    data-componentid={ `${componentId}-remove-sms-provider-config` }
                    onActionClick={ handleDeleteRequest }
                />
            </DangerZoneGroup>
        );
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
                <SMSCustomizationHeader
                    selectedSmsTemplateId={ selectedSmsTemplateId }
                    selectedSmsTemplateDescription={ selectedSmsTemplateDescription }
                    selectedLocale={ selectedLocale }
                    smsTemplatesList={ availableSmsTemplatesList }
                    onTemplateSelected={ handleTemplateIdChange }
                    onLocaleChanged={ handleLocaleChange }
                />

                <Card className="p-0 mb-5">
                    <Grid container>
                        <Grid xs={ 8 } className="right-border bottom-border p-3">
                            <Typography>
                                { t("smsTemplates:tabs.content.label") }
                            </Typography>
                        </Grid>
                        <Grid xs={ 4 } className="bottom-border p-3">
                            <Typography>
                                { t("smsTemplates:tabs.preview.label") }
                            </Typography>
                        </Grid>

                        <Grid xs={ 8 } padding={ 2 } className="right-border bottom-border">
                            <SMSCustomizationForm
                                isSmsTemplatesListLoading={ isSmsTemplatesListLoading || isSmsTemplateLoading }
                                selectedSmsTemplate={ currentSmsTemplate }
                                selectedLocale={ selectedLocale }
                                onTemplateChanged={ (updatedTemplateAttributes: Partial<SMSTemplate>) =>
                                    handleTemplateChange(updatedTemplateAttributes)
                                }
                                onSubmit={ handleSubmit }
                                onDeleteRequested={ handleDeleteRequest }
                                readOnly={ isReadOnly || (isTemplateNotAvailable && !hasSmsTemplateCreatePermissions) }
                            />
                        </Grid>
                        <Grid xs={ 4 } padding={ 2 } display={ "flex" } paddingBottom={ 0 } className="bottom-border">
                            <SMSTemplatePreview smsTemplate={ selectedSmsTemplate || currentSmsTemplate } />
                        </Grid>
                        <Grid xs={ 12 } padding={ 2 }>
                            <Show when={ featureConfig?.smsTemplates?.scopes?.update }>
                                { (!isTemplateNotAvailable || hasSmsTemplateCreatePermissions) && (
                                    <SMSCustomizationFooter
                                        isSaveButtonLoading={ isSmsTemplatesListLoading || isSmsTemplateLoading }
                                        onSaveButtonClick={ handleSubmit }
                                    />
                                ) }
                            </Show>
                        </Grid>
                    </Grid>
                </Card>

                <Show when={ featureConfig?.smsTemplates?.scopes?.delete }>{ renderDangerZone() }</Show>
            </PageLayout>
        </BrandingPreferenceProvider>
    );
};

export default SMSCustomizationPage;
