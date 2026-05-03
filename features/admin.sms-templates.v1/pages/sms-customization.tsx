/**
 * Copyright (c) 2024-2026, WSO2 LLC. (https://www.wso2.com).
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

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Card from "@oxygen-ui/react/Card";
import Grid from "@oxygen-ui/react/Grid";
import Paper from "@oxygen-ui/react/Paper";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { BuildingIcon, TilesIcon } from "@oxygen-ui/react-icons";
import { FeatureStatus, Show, useCheckFeatureStatus, useRequiredScopes } from "@wso2is/access-control";
import { useApplicationList } from "@wso2is/admin.applications.v1/api/application";
import { useGetApplication } from "@wso2is/admin.applications.v1/api/use-get-application";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants/application-management";
import {
    ApplicationInterface,
    ApplicationListItemInterface
} from "@wso2is/admin.applications.v1/models/application";
import BrandingPreferenceProvider from "@wso2is/admin.branding.v1/providers/branding-preference-provider";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureLockedBanner from "@wso2is/admin.feature-gate.v1/components/feature-locked-banner";
import FeatureFlagConstants from "@wso2is/admin.feature-gate.v1/constants/feature-flag-constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import {
    AlertInterface,
    AlertLevels,
    FeatureAccessConfigInterface,
    HttpErrorResponseDataInterface,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DangerZone, DangerZoneGroup, DocumentationLink, PageLayout, useDocumentation } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import createAppSmsTemplate from "../api/create-app-sms-template";
import createSmsTemplate from "../api/create-sms-template";
import deleteAppSmsTemplate from "../api/delete-app-sms-template";
import deleteSmsTemplate from "../api/delete-sms-template";
import updateAppSmsTemplate from "../api/update-app-sms-template";
import updateSmsTemplate from "../api/update-sms-template";
import useGetAppSmsTemplate from "../api/use-get-app-sms-template";
import useGetSmsTemplate from "../api/use-get-sms-template";
import useGetSmsTemplatesList from "../api/use-get-sms-templates-list";
import SMSCustomizationFooter from "../components/sms-customization-footer";
import SMSCustomizationForm from "../components/sms-customization-form";
import SMSCustomizationHeader, { LocaleOption } from "../components/sms-customization-header";
import SMSTemplatePreview from "../components/sms-template-preview";
import { SMSTemplateConstants } from "../constants/sms-template-constants";
import { SMSTemplate, SMSTemplateType } from "../models/sms-templates";
import "./sms-customization.scss";

type SMSCustomizationPageInterface = IdentifiableComponentInterface;

/**
 * Modes for the SMS templates page.
 */
enum SMSTemplatesMode {
    APPLICATION = "APPLICATION",
    ORGANIZATION = "ORGANIZATION"
}

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
    const [ error, setError ] = useState<AxiosError<HttpErrorResponseDataInterface>>();
    const [ appIdFromQueryParam, setAppIdFromQueryParam ] = useState<string | null>(null);
    const [ smsTemplatesMode, setSmsTemplatesMode ] =
        useState<SMSTemplatesMode>(SMSTemplatesMode.ORGANIZATION);
    const [ selectedAppId, setSelectedAppId ] = useState<string | null>(null);
    const [ applications, setApplications ] = useState<ApplicationListItemInterface[]>([]);
    const [ isFromAppRedirect, setIsFromAppRedirect ] = useState<boolean>(false);
    const [ isNewAppTemplate, setIsNewAppTemplate ] = useState<boolean>(false);

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
    const disabledFeatures: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.features?.applications?.disabledFeatures);

    const isAppSpecificSmsTemplateBrandingEnabled: boolean = !disabledFeatures?.includes(
        FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.APPLICATION_EDIT_SMS_TEMPLATES_LINK
    );

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const hasUpdatePermission: boolean = useRequiredScopes(smsFeatureConfig?.scopes?.update);
    const hasCreatePermission: boolean = useRequiredScopes(smsFeatureConfig?.scopes?.create);

    const smsTemplateFeatureStatus: FeatureStatus = useCheckFeatureStatus(
        FeatureFlagConstants.FEATURE_FLAG_KEY_MAP["SMS_TEMPLATES_CUSTOMIZATION"]
    );
    const isSmsFeatureEnabled: boolean = smsTemplateFeatureStatus === FeatureStatus.ENABLED;

    const isReadOnly: boolean = !smsFeatureConfig.enabled || !hasUpdatePermission || !isSmsFeatureEnabled;
    const hasSmsTemplateCreatePermissions: boolean = smsFeatureConfig.enabled && hasCreatePermission;

    const { isSubOrganization } = useGetCurrentOrganizationType();

    const isAppSpecific: boolean = smsTemplatesMode === SMSTemplatesMode.APPLICATION
        && !!(appIdFromQueryParam ?? selectedAppId);

    const activeAppId: string | null = appIdFromQueryParam ?? selectedAppId;

    const {
        data: selectedApplicationData
    } = useGetApplication<ApplicationInterface>(activeAppId as string, isAppSpecific);

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

    const {
        data: appSmsTemplate,
        isLoading: isAppSmsTemplateLoading,
        error: appSmsTemplateError,
        mutate: appSmsTemplateMutate
    } = useGetAppSmsTemplate(
        selectedSmsTemplateId!,
        activeAppId as string,
        selectedLocale,
        !!selectedSmsTemplateId && isAppSpecific
    );

    const {
        data: applicationList,
        isLoading: isApplicationListFetchRequestLoading
    } = useApplicationList(
        "templateId",
        100,
        0,
        undefined,
        smsTemplatesMode === SMSTemplatesMode.APPLICATION
    );

    useEffect(() => {
        if (!history?.location?.search) return;
        const params: URLSearchParams = new URLSearchParams(history?.location?.search);
        const appIdFromQuery: string | null = params.get("appId");

        if (!appIdFromQuery) return;
        setAppIdFromQueryParam(appIdFromQuery);
        setSmsTemplatesMode(SMSTemplatesMode.APPLICATION);
        setIsFromAppRedirect(true);

        return () => {
            setAppIdFromQueryParam(null);
            setSmsTemplatesMode(SMSTemplatesMode.ORGANIZATION);
            setIsFromAppRedirect(false);
        };
    }, [ history?.location?.search ]);

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
        if (isAppSpecific) {
            const appTemplateAvailable: boolean =
                !!appSmsTemplate && Object.keys(appSmsTemplate).length > 0;

            if (appTemplateAvailable) {
                setSelectedSmsTemplate({ ...appSmsTemplate });
                setCurrentSmsTemplate({ ...appSmsTemplate });
                setIsTemplateNotAvailable(false);
                setIsNewAppTemplate(false);
            } else if (smsTemplate && Object.keys(smsTemplate).length > 0) {
                setSelectedSmsTemplate({ ...smsTemplate });
                setCurrentSmsTemplate({ ...smsTemplate });
                setIsTemplateNotAvailable(false);
            }
        } else {
            setIsTemplateNotAvailable(false);

            if (smsTemplate && Object.keys(smsTemplate).length > 0) {
                setSelectedSmsTemplate({ ...smsTemplate });
                setCurrentSmsTemplate({ ...smsTemplate });
            }
        }
    }, [ smsTemplate, appSmsTemplate, isAppSpecific ]);

    useEffect(() => {
        if (smsTemplatesMode === SMSTemplatesMode.ORGANIZATION) {
            setIsSystemTemplate(false);
            setIsInheritedTemplate(false);
        }
    }, [ smsTemplatesMode ]);

    useEffect(() => {
        if (!applicationList?.applications) return;

        setApplications(
            applicationList.applications.filter((app: ApplicationListItemInterface) =>
                !ApplicationManagementConstants.SYSTEM_APPS.includes(app.name) &&
                !ApplicationManagementConstants.DEFAULT_APPS.includes(app.name) &&
                !(app.templateId === ApplicationManagementConstants.M2M_APP_TEMPLATE_ID)
            )
        );
    }, [ applicationList ]);

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
        if (isAppSpecific) {
            if (appSmsTemplateError && selectedSmsTemplateId && appSmsTemplateError !== error) {
                setError(appSmsTemplateError as AxiosError<HttpErrorResponseDataInterface>);

                if (appSmsTemplateError.response?.status === 404) {
                    setIsTemplateNotAvailable(true);
                    setIsNewAppTemplate(true);

                    return;
                } else {
                    if (appSmsTemplateError?.response?.data?.code !==
                        SMSTemplateConstants.TEMPLATE_NOT_AVAILABLE_ERROR_CODE &&
                        appSmsTemplateError?.response?.data?.code !==
                        SMSTemplateConstants.INVALID_TEMPLATE_TYPE_ERROR_CODE) {
                        dispatch(
                            addAlert({
                                description: t("smsTemplates:notifications.getSmsTemplate.error.description"),
                                level: AlertLevels.ERROR,
                                message: t("smsTemplates:notifications.getSmsTemplate.error.message")
                            })
                        );
                    }

                    return;
                }
            }

            if (isNewAppTemplate && smsTemplateError && selectedSmsTemplateId) {
                if (smsTemplateError.response?.status === 404) {
                    if (isSubOrganization() && !isInheritedTemplate) {
                        setIsInheritedTemplate(true);
                    } else if (!isSystemTemplate && selectedLocale === SMSTemplateConstants.DEAFULT_LOCALE) {
                        setIsSystemTemplate(true);
                    }
                }
            }

            return;
        }

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

        if (smsTemplateError?.response?.data?.code !== SMSTemplateConstants.TEMPLATE_NOT_AVAILABLE_ERROR_CODE &&
            smsTemplateError?.response?.data?.code !== SMSTemplateConstants.INVALID_TEMPLATE_TYPE_ERROR_CODE) {
            dispatch(
                addAlert({
                    description: t("smsTemplates:notifications.getSmsTemplate.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("smsTemplates:notifications.getSmsTemplate.error.message")
                })
            );
        }
    }, [ smsTemplateError, appSmsTemplateError, isSystemTemplate, isInheritedTemplate, isNewAppTemplate ]);

    const handleSmsTemplatesModeChange = (
        _event: React.MouseEvent<HTMLElement>,
        mode: SMSTemplatesMode
    ): void => {
        if (!mode) return;

        setSmsTemplatesMode(mode);

        if (mode === SMSTemplatesMode.ORGANIZATION) {
            setSelectedAppId(null);
            setError(undefined);
            mutateSmsTemplate();
        }

        setIsTemplateNotAvailable(false);
        setIsNewAppTemplate(false);
    };

    const handleTemplateIdChange = (templateId: string): void => {

        setShouldFetch(false);
        setIsTemplateNotAvailable(false);
        setIsSystemTemplate(false);
        setIsInheritedTemplate(false);
        setIsNewAppTemplate(false);
        setCurrentSmsTemplate(undefined);
        setSelectedLocale(SMSTemplateConstants.DEAFULT_LOCALE);
        setSelectedSmsTemplateId(templateId);
        setSelectedSmsTemplateDescription(
            availableSmsTemplatesList?.find((template: SMSTemplateType) => template.id === templateId)?.description
        );
        setShouldFetch(true);
    };

    const handleTemplateChange = (updatedTemplateAttributes: Partial<SMSTemplate>): void => {
        setSelectedSmsTemplate({ ...selectedSmsTemplate, ...updatedTemplateAttributes });
        setIsTemplateNotAvailable(false);
    };

    const handleLocaleChange = (localeOption: LocaleOption | null): void => {
        const safeLocale: string = (localeOption?.value as string) ?? selectedLocale;

        setShouldFetch(false);
        setCurrentSmsTemplate({ ...selectedSmsTemplate });
        setIsTemplateNotAvailable(true);
        setIsSystemTemplate(false);
        setIsInheritedTemplate(false);
        setIsNewAppTemplate(false);
        setSelectedLocale(safeLocale);
        setShouldFetch(true);
    };

    const handleSubmit = (): void => {
        setShouldFetch(false);
        const template: SMSTemplate = {
            ...selectedSmsTemplate,
            id: selectedLocale.replace("-", "_")
        };

        const mutateTemplate: () => void = isAppSpecific ? appSmsTemplateMutate : mutateSmsTemplate;

        if (isSystemTemplate || isInheritedTemplate || (isAppSpecific && isNewAppTemplate)) {
            const createFn: Promise<SMSTemplate> = isAppSpecific
                ? createAppSmsTemplate(selectedSmsTemplateId, activeAppId as string, template)
                : createSmsTemplate(selectedSmsTemplateId, template);

            createFn
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
                    setIsNewAppTemplate(false);
                    setShouldFetch(true);
                })
                .catch(() => {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("smsTemplates:notifications.updateSmsTemplate.error.description"),
                            level: AlertLevels.ERROR,
                            message: t("smsTemplates:notifications.updateSmsTemplate.error.message")
                        })
                    );
                })
                .finally(() => mutateTemplate());
        } else {
            const updateFn: Promise<SMSTemplate> = isAppSpecific
                ? updateAppSmsTemplate(selectedSmsTemplateId, activeAppId as string, template, selectedLocale)
                : updateSmsTemplate(selectedSmsTemplateId, template, selectedLocale);

            updateFn
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
                })
                .catch(() => {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("smsTemplates:notifications.updateSmsTemplate.error.description"),
                            level: AlertLevels.ERROR,
                            message: t("smsTemplates:notifications.updateSmsTemplate.error.message")
                        })
                    );
                })
                .finally(() => mutateTemplate());
        }

        setIsTemplateNotAvailable(false);
        setIsSystemTemplate(false);
        setIsInheritedTemplate(false);
    };

    const handleDeleteRequest = (): void => {
        setShouldFetch(false);

        const deleteFn: Promise<AxiosResponse> = isAppSpecific
            ? deleteAppSmsTemplate(selectedSmsTemplateId, activeAppId as string, selectedLocale)
            : deleteSmsTemplate(selectedSmsTemplateId, selectedLocale);

        deleteFn
            .then((_response: AxiosResponse) => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("smsTemplates:notifications.deleteSmsTemplate.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("smsTemplates:notifications.deleteSmsTemplate.success.message")
                    })
                );

                if (isAppSpecific) {
                    setIsNewAppTemplate(true);
                } else {
                    setSelectedLocale(SMSTemplateConstants.DEAFULT_LOCALE);
                    setIsSystemTemplate(false);
                    setIsInheritedTemplate(false);
                }
                setShouldFetch(true);
            })
            .catch(() => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("smsTemplates:notifications.deleteSmsTemplate.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("smsTemplates:notifications.deleteSmsTemplate.error.message")
                    })
                );
            })
            .finally(() => {
                if (isAppSpecific) {
                    appSmsTemplateMutate();
                } else {
                    mutateSmsTemplate();
                }
            });
    };

    const renderDangerZone = (): ReactElement => {
        let zoneType: string = "revert";

        if (isSystemTemplate || isInheritedTemplate || (isAppSpecific && isNewAppTemplate)) {
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
                title={ (
                    <div style={ { alignItems: "center", display: "flex", justifyContent: "space-between",
                        width: "100%" } }>
                        <h1 style={ { margin: 0 } }>
                            { isFromAppRedirect && selectedApplicationData?.name
                                ? t("smsTemplates:page.appSpecificHeader",
                                    { appName: selectedApplicationData.name })
                                : t("smsTemplates:page.header") }
                        </h1>
                        { !appIdFromQueryParam && isAppSpecificSmsTemplateBrandingEnabled && (
                            <div style={ { alignItems: "center", display: "flex", flexDirection: "row",
                                gap: "10px" } }>
                                <Paper
                                    elevation={ 0 }
                                    sx={ { borderColor: "#C0BFBF", display: "flex", height: "37px" } }
                                >
                                    <ToggleButtonGroup
                                        exclusive
                                        onChange={ handleSmsTemplatesModeChange }
                                        size="small"
                                        value={ smsTemplatesMode }
                                    >
                                        <ToggleButton
                                            data-componentid={
                                                `${ componentId }-organization-mode-button`
                                            }
                                            value={ SMSTemplatesMode.ORGANIZATION }
                                        >
                                            <span style={ { marginRight: "5px" } }>
                                                <BuildingIcon size={ 14 } />
                                            </span>
                                            { t("extensions:develop.branding.pageHeader.organization") }
                                        </ToggleButton>
                                        <ToggleButton
                                            data-componentid={
                                                `${ componentId }-application-mode-button`
                                            }
                                            value={ SMSTemplatesMode.APPLICATION }
                                        >
                                            <span style={ { marginRight: "5px" } }>
                                                <TilesIcon size={ 14 } />
                                            </span>
                                            { t("extensions:develop.branding.pageHeader.application") }
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Paper>
                                { smsTemplatesMode === SMSTemplatesMode.APPLICATION && (
                                    <Autocomplete
                                        data-componentid={ `${ componentId }-application-dropdown` }
                                        sx={ { width: 190 } }
                                        clearIcon={ null }
                                        options={ applications ?? [] }
                                        value={
                                            applications?.find(
                                                (app: ApplicationListItemInterface) =>
                                                    app.id === selectedAppId
                                            ) ?? null
                                        }
                                        onChange={ (
                                            _event: SyntheticEvent<Element, Event>,
                                            app: ApplicationListItemInterface | null
                                        ) => {
                                            setSelectedAppId(app?.id ?? null);
                                            setIsNewAppTemplate(false);
                                        } }
                                        isOptionEqualToValue={ (
                                            option: ApplicationListItemInterface,
                                            value: ApplicationListItemInterface
                                        ) => option.id === value.id }
                                        loading={ isApplicationListFetchRequestLoading }
                                        getOptionLabel={ (app: ApplicationListItemInterface) => app.name }
                                        renderInput={ (params: AutocompleteRenderInputParams) => (
                                            <TextField
                                                { ...params }
                                                size="small"
                                                placeholder={ t(
                                                    "extensions:develop.branding.pageHeader.selectApplication"
                                                ) }
                                                margin="none"
                                            />
                                        ) }
                                    />
                                ) }
                            </div>
                        ) }
                    </div>
                ) }
                pageTitle={ t("smsTemplates:page.header") }
                description={
                    (<>
                        { isAppSpecific && selectedApplicationData?.name
                            ? (
                                <Trans
                                    i18nKey="smsTemplates:page.appSpecificDescription"
                                    values={ { appName: selectedApplicationData.name } }
                                    components={ { bold: <strong /> } }
                                />
                            )
                            : t("smsTemplates:page.description") }
                        <DocumentationLink link={ getLink("develop.smsCustomization.learnMore") }>
                            { t("smsTemplates:common.learnMore") }
                        </DocumentationLink>
                    </>)
                }
                titleTextAlign="left"
                bottomMargin={ false }
                backButton={ isFromAppRedirect && {
                    "data-componentid": `${ componentId }-page-back-button`,
                    onClick: () => history.push(
                        (AppConstants.getPaths().get("APPLICATION_EDIT") ?? "")
                            .replace(":id", appIdFromQueryParam ?? "")
                    ),
                    text: t("smsTemplates:page.backButtonText")
                } }
                data-componentid={ componentId }
            >

                { !isSmsFeatureEnabled && (
                    <FeatureLockedBanner
                        data-componentid={ `${componentId}-feature-locked-banner` }
                    />
                ) }

                <SMSCustomizationHeader
                    selectedSMSTemplateId={ selectedSmsTemplateId }
                    selectedSMSTemplateDescription={ selectedSmsTemplateDescription }
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
                                isSmsTemplatesListLoading={ isSmsTemplatesListLoading || isSmsTemplateLoading
                                    || (isAppSpecific
                                        ? isAppSmsTemplateLoading && !currentSmsTemplate
                                        : isSmsTemplateLoading) }
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
                                        isSaveButtonDisabled={ !isSmsFeatureEnabled }
                                        isSaveButtonLoading={ isSmsTemplatesListLoading || isSmsTemplateLoading
                                            || (isAppSpecific && isAppSmsTemplateLoading)
                                        }
                                        onSaveButtonClick={ handleSubmit }
                                    />
                                ) }
                            </Show>
                        </Grid>
                    </Grid>
                </Card>

                <Show when={ featureConfig?.smsTemplates?.scopes?.delete }>
                    { isSmsFeatureEnabled && renderDangerZone() }
                </Show>
            </PageLayout>
        </BrandingPreferenceProvider>
    );
};

export default SMSCustomizationPage;
