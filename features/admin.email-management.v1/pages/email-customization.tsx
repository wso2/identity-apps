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

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Paper from "@oxygen-ui/react/Paper";
import TextField from "@oxygen-ui/react/TextField";
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
import { I18nConstants } from "@wso2is/admin.core.v1/constants/i18n-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureFlagConstants from "@wso2is/admin.feature-gate.v1/constants/feature-flag-constants";
import useGetFlowConfig from "@wso2is/admin.flow-builder-core.v1/api/use-get-flow-config";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    FeatureAccessConfigInterface,
    HttpErrorResponseDataInterface,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DocumentationLink,
    PageLayout,
    ResourceTab,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { TabProps } from "semantic-ui-react";
import { useGetCurrentOrganizationType } from "../../admin.organizations.v1/hooks/use-get-organization-type";
import {
    createNewAppEmailTemplate,
    createNewEmailTemplate,
    deleteAppEmailTemplate,
    deleteEmailTemplate,
    updateAppEmailTemplate,
    updateEmailTemplate,
    useAppEmailTemplate,
    useEmailTemplate,
    useEmailTemplatesList
} from "../api";
import { EmailCustomizationForm, EmailTemplatePreview } from "../components";
import EmailTemplateCustomizationPremiumBanner from "../components/banners/email-template-customization-premium-banner";
import EmailCustomizationFooter from "../components/email-customization-footer";
import EmailCustomizationHeader, { LocaleOption } from "../components/email-customization-header";
import { EmailManagementConstants } from "../constants/email-management-constants";
import { EmailTemplate, EmailTemplateType } from "../models";

type EmailCustomizationPageInterface = IdentifiableComponentInterface;

/**
 * Modes for the email templates page.
 */
enum EmailTemplatesMode {
    APPLICATION = "APPLICATION",
    ORGANIZATION = "ORGANIZATION"
}

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

    const [ availableEmailTemplatesList, setAvailableEmailTemplatesList ] = useState<EmailTemplateType[]>([]);
    const [ selectedEmailTemplateId, setSelectedEmailTemplateId ] = useState<string>();
    const [ selectedEmailTemplateDescription, setSelectedEmailTemplateDescription ] = useState<string>();
    const [ selectedLocale, setSelectedLocale ] = useState(I18nConstants.DEFAULT_FALLBACK_LANGUAGE);
    const [ selectedEmailTemplate, setSelectedEmailTemplate ] = useState<EmailTemplate>();
    const [ currentEmailTemplate, setCurrentEmailTemplate ] = useState<EmailTemplate>();
    const [ showReplicatePreviousTemplateModal, setShowReplicatePreviousTemplateModal ] = useState(false);
    const [ showUpdateTemplateFromRootOrgModal, setShowUpdateTemplateFromRootOrgModal ] = useState(false);
    const [ isTemplateNotAvailable, setIsTemplateNotAvailable ] = useState(false);
    const [ isSystemTemplate, setIsSystemTemplate ] = useState(false);
    const [ isInheritedTemplate, setIsInheritedTemplate ] = useState(false);
    const [ error, setError ] = useState<AxiosError<HttpErrorResponseDataInterface>>();
    const [ appIdFromQueryParam, setAppIdFromQueryParam ] = useState<string | null>(null);
    const [ emailTemplatesMode, setEmailTemplatesMode ] =
        useState<EmailTemplatesMode>(EmailTemplatesMode.ORGANIZATION);
    const [ selectedAppId, setSelectedAppId ] = useState<string | null>(null);
    const [ applications, setApplications ] = useState<ApplicationListItemInterface[]>([]);
    const [ isFromAppRedirect, setIsFromAppRedirect ] = useState<boolean>(false);
    const [ isNewAppTemplate, setIsNewAppTemplate ] = useState<boolean>(false);

    // When the user switches modes (not a locale change), the replicate modal should not appear.
    const skipNextReplicateModalRef: React.MutableRefObject<boolean> = React.useRef<boolean>(false);
    // Only skip the replicate modal on the very first load from app edit view.
    const hasLoadedOnceRef: React.MutableRefObject<boolean> = React.useRef<boolean>(false);

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

    const emailTemplateFeatureStatus: FeatureStatus = useCheckFeatureStatus(
        FeatureFlagConstants.FEATURE_FLAG_KEY_MAP["EMAIL_TEMPLATES_CUSTOMIZATION"]
    );
    const isEmailFeatureEnabled: boolean = emailTemplateFeatureStatus === FeatureStatus.ENABLED;

    const isReadOnly: boolean = useMemo(() => {
        return !isFeatureEnabled(
            emailTemplatesFeatureConfig,
            EmailManagementConstants.FEATURE_DICTIONARY.get("EMAIL_TEMPLATES_UPDATE")
        ) || !hasUsersUpdateEmailTemplatesPermissions || !isEmailFeatureEnabled;
    }, [ emailTemplatesFeatureConfig, allowedScopes, isEmailFeatureEnabled ]);

    const hasEmailTemplateCreatePermissions: boolean = useMemo(() => {
        return isFeatureEnabled(
            emailTemplatesFeatureConfig,
            EmailManagementConstants.FEATURE_DICTIONARY.get("EMAIL_TEMPLATES_CREATE")
        ) && hasUsersCreateEmailTemplatesPermissions;
    }, [ emailTemplatesFeatureConfig, allowedScopes ]);

    const { isSubOrganization } = useGetCurrentOrganizationType();
    const { data: invitedUserRegistrationFlowConfig } = useGetFlowConfig(FlowTypes.INVITED_USER_REGISTRATION);

    const isAppSpecific: boolean = emailTemplatesMode === EmailTemplatesMode.APPLICATION
        && !!(appIdFromQueryParam ?? selectedAppId);

    const activeAppId: string | null = appIdFromQueryParam ?? selectedAppId;

    const {
        data: selectedApplicationData
    } = useGetApplication<ApplicationInterface>(activeAppId as string, isAppSpecific);

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
        selectedEmailTemplateId!,
        selectedLocale,
        isSystemTemplate,
        isInheritedTemplate,
        !!selectedEmailTemplateId
    );

    const {
        data: appEmailTemplate,
        isLoading: isAppEmailTemplateLoading,
        error: appEmailTemplateError,
        mutate: appEmailTemplateMutate
    } = useAppEmailTemplate(
        selectedEmailTemplateId!,
        activeAppId as string,
        selectedLocale,
        !!selectedEmailTemplateId && isAppSpecific
    );

    const {
        data: applicationList,
        isLoading: isApplicationListFetchRequestLoading
    } = useApplicationList(
        "templateId",
        30,
        0,
        undefined,
        emailTemplatesMode === EmailTemplatesMode.APPLICATION
    );

    useEffect(() => {
        // we don't have a good displayName and description coming from the backend
        // for the email template types. So as we agreed use the displayName and
        // description from the email template types config defined in
        // the deployment.toml file. The below code will map the email template
        // types with the config's displayName and description.
        const blockedNames: string[] = [ "askpassword", "resendaskpassword" ];
        const filterTemplates = (template: EmailTemplateType): boolean => {
            const name: string = template.displayName?.toLowerCase() || "";

            if (!invitedUserRegistrationFlowConfig?.isEnabled && name.includes("orchestrated")) {
                return false;
            } else if (invitedUserRegistrationFlowConfig?.isEnabled && blockedNames.includes(name)) {
                return false;
            }

            return !enableCustomEmailTemplates
                ? !!emailTemplates?.find(
                    (emailTemplate: Record<string, string>) => emailTemplate.id === template.id
                )
                : true;
        };

        const availableEmailTemplates: EmailTemplateType[] = emailTemplatesList
            ? emailTemplatesList.filter(filterTemplates).map((template: EmailTemplateType) => {
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
        if (!history?.location?.search) return;
        const params: URLSearchParams = new URLSearchParams(history?.location?.search);
        const appIdFromQuery: string | null = params.get("appId");

        if (!appIdFromQuery) return;
        setAppIdFromQueryParam(appIdFromQuery);
        setEmailTemplatesMode(EmailTemplatesMode.APPLICATION);
        setIsFromAppRedirect(true);

        return () => {
            setAppIdFromQueryParam(null);
            setEmailTemplatesMode(EmailTemplatesMode.ORGANIZATION);
            setIsFromAppRedirect(false);
        };
    }, [ history?.location?.search ]);

    useEffect(() => {
        if (isAppSpecific) {
            const appTemplateAvailable: boolean =
                !!appEmailTemplate && Object.keys(appEmailTemplate).length > 0;

            if (appTemplateAvailable) {
                setSelectedEmailTemplate({ ...appEmailTemplate });
                setCurrentEmailTemplate({ ...appEmailTemplate });
                setIsTemplateNotAvailable(false);
                setIsNewAppTemplate(false);
                // Mark as loaded after any successful fetch in app mode (including locale change)
                hasLoadedOnceRef.current = true;
            } else if (emailTemplate && Object.keys(emailTemplate).length > 0) {
                // App template not available — fall back to org template for display
                setSelectedEmailTemplate({ ...emailTemplate });
                setCurrentEmailTemplate({ ...emailTemplate });
                setIsTemplateNotAvailable(false);
                // Mark as loaded after any successful fetch in app mode (including locale change)
                hasLoadedOnceRef.current = true;
            }
        } else {
            setIsTemplateNotAvailable(false);

            if (emailTemplate && Object.keys(emailTemplate).length > 0) {
                setSelectedEmailTemplate({ ...emailTemplate });
                setCurrentEmailTemplate({ ...emailTemplate });
                skipNextReplicateModalRef.current = false;
            }
        }
    }, [ emailTemplate, appEmailTemplate ]);

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
        if (isAppSpecific) {
            // Handle app-specific template error
            if (appEmailTemplateError && selectedEmailTemplateId && appEmailTemplateError !== error) {
                setError(appEmailTemplateError as AxiosError<HttpErrorResponseDataInterface>);

                if (appEmailTemplateError.response?.status === 404) {
                    // 404 is expected when no app-specific template exists yet
                    setIsTemplateNotAvailable(true);
                    setIsNewAppTemplate(true);

                    // If the user previously had content for another locale, offer to replicate it.
                    // currentEmailTemplate is set by handleLocaleChange before the locale switch.
                    // Only skip the modal on the very first load from app edit view.
                    if (
                        currentEmailTemplate &&
                        Object.keys(currentEmailTemplate).length > 0 &&
                        hasEmailTemplateCreatePermissions &&
                        !skipNextReplicateModalRef.current &&
                        // Only skip the modal on the very first load from app redirect view
                        !(isFromAppRedirect && hasLoadedOnceRef.current === false)
                    ) {
                        setShowReplicatePreviousTemplateModal(true);
                        return;
                    }
                } else {
                    if (appEmailTemplateError.response?.data?.description) {
                        dispatch(addAlert({
                            description: appEmailTemplateError.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: appEmailTemplateError.response.data.message ??
                                t("extensions:develop.emailTemplates.notifications.getEmailTemplate.error.message")
                        }));
                    } else {
                        dispatch(addAlert({
                            description: t(
                                "extensions:develop.emailTemplates.notifications.getEmailTemplate.error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "extensions:develop.emailTemplates.notifications.getEmailTemplate.error.message"
                            )
                        }));
                    }

                    return;
                }
            }

            // When app template is absent, also drive the org-level fallback chain so the system
            // template is fetched and pre-fills the editor when neither app nor org template exists.
            if (isNewAppTemplate && emailTemplateError && selectedEmailTemplateId) {
                if (emailTemplateError.response?.status === 404) {
                    if (isSubOrganization() && !isInheritedTemplate) {
                        setIsInheritedTemplate(true);
                    } else if (!isSystemTemplate && selectedLocale === EmailManagementConstants.DEAFULT_LOCALE) {
                        setIsSystemTemplate(true);
                    }
                }
            }

            return;
        }

        // Org mode error handling
        const activeError: AxiosError<HttpErrorResponseDataInterface> | undefined = emailTemplateError;

        if (!activeError || !selectedEmailTemplateId || activeError === error) {
            return;
        }

        setError(activeError);

        if (activeError.response?.status === 404) {
            setIsTemplateNotAvailable(true);

            if (isSubOrganization() && !isInheritedTemplate) {
                setIsInheritedTemplate(true);

                return;
            } else if (!isSystemTemplate && selectedLocale === EmailManagementConstants.DEAFULT_LOCALE) {
                setIsSystemTemplate(true);

                return;
            } else if (hasEmailTemplateCreatePermissions) {
                if (skipNextReplicateModalRef.current) {
                    skipNextReplicateModalRef.current = false;
                    setCurrentEmailTemplate(undefined);
                } else {
                    setShowReplicatePreviousTemplateModal(true);
                }

                return;
            } else {
                setCurrentEmailTemplate(undefined);
            }
            setShowUpdateTemplateFromRootOrgModal(true);

            return;
        }

        if (activeError.response?.data?.description) {
            dispatch(addAlert({
                description: activeError.response?.data?.description,
                level: AlertLevels.ERROR,
                message: activeError.response.data.message ??
                    t("extensions:develop.emailTemplates.notifications.getEmailTemplate.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("extensions:develop.emailTemplates.notifications.getEmailTemplate.error.description"),
            level: AlertLevels.ERROR,
            message: t("extensions:develop.emailTemplates.notifications.getEmailTemplate.error.message")
        }));
    }, [ emailTemplateError, appEmailTemplateError, isSystemTemplate, isInheritedTemplate, isNewAppTemplate,
        currentEmailTemplate ]);

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

    const handleEmailTemplatesModeChange = (
        _event: React.MouseEvent<HTMLElement>,
        mode: EmailTemplatesMode
    ): void => {
        if (!mode) return;

        setEmailTemplatesMode(mode);

        if (mode === EmailTemplatesMode.ORGANIZATION) {
            setSelectedAppId(null);
        }

        skipNextReplicateModalRef.current = true;
        setIsTemplateNotAvailable(false);
        setIsSystemTemplate(false);
        setIsInheritedTemplate(false);
        setIsNewAppTemplate(false);
    };

    const handleTemplateIdChange = (templateId: string) => {
        setIsTemplateNotAvailable(false);
        setIsSystemTemplate(false);
        setIsInheritedTemplate(false);
        setIsNewAppTemplate(false);
        setCurrentEmailTemplate(undefined);
        setSelectedLocale(I18nConstants.DEFAULT_FALLBACK_LANGUAGE);
        setSelectedEmailTemplateId(templateId);
        setSelectedEmailTemplateDescription(availableEmailTemplatesList?.find(
            (template: EmailTemplateType) => template.id === templateId)?.description);
    };

    const handleTemplateChange = (updatedTemplateAttributes: Partial<EmailTemplate>) => {
        setSelectedEmailTemplate({ ...selectedEmailTemplate, ...updatedTemplateAttributes });
    };

    const handleLocaleChange = (localeOption: LocaleOption | null | undefined): void => {
        const safeLocale: string = (localeOption?.value as string) ?? selectedLocale;

        setCurrentEmailTemplate({ ...selectedEmailTemplate });
        setIsTemplateNotAvailable(false);
        setIsSystemTemplate(false);
        setIsInheritedTemplate(false);
        setIsNewAppTemplate(false);
        setSelectedLocale(safeLocale);
    };

    const handleSubmit = () => {
        const template: EmailTemplate = {
            ...selectedEmailTemplate,
            id: selectedLocale.replace("-", "_")
        };

        if (!template?.contentType) {
            template.contentType = EmailManagementConstants.DEFAULT_CONTENT_TYPE;
        }

        const mutateTemplate: () => void = isAppSpecific ? appEmailTemplateMutate : emailTemplateMutate;

        if (isSystemTemplate || isInheritedTemplate || (isAppSpecific && isNewAppTemplate)) {
            const createFn: Promise<EmailTemplate> = isAppSpecific
                ? createNewAppEmailTemplate(selectedEmailTemplateId, activeAppId as string, template)
                : createNewEmailTemplate(selectedEmailTemplateId, template);

            createFn
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
                    setIsNewAppTemplate(false);
                }).catch((error: IdentityAppsApiException) => {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".error.description"),
                        level: AlertLevels.ERROR,
                        message: error.message ?? t("extensions:develop.emailTemplates.notifications" +
                            ".updateEmailTemplate.error.message")
                    }));
                }).finally(() => mutateTemplate());
        } else {
            const updateFn: Promise<EmailTemplate> = isAppSpecific
                ? updateAppEmailTemplate(
                    selectedEmailTemplateId, activeAppId as string, template, selectedLocale)
                : updateEmailTemplate(selectedEmailTemplateId, template, selectedLocale);

            updateFn
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
                }).catch((error: IdentityAppsApiException) => {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.emailTemplates.notifications.updateEmailTemplate" +
                            ".error.description"),
                        level: AlertLevels.ERROR,
                        message: error.message ?? t("extensions:develop.emailTemplates.notifications" +
                            ".updateEmailTemplate.error.message")
                    }));
                }).finally(() => mutateTemplate());
        }

        setIsTemplateNotAvailable(false);
    };

    const handleDeleteRequest = () => {
        const deleteFn: Promise<AxiosResponse> = isAppSpecific
            ? deleteAppEmailTemplate(selectedEmailTemplateId, activeAppId as string, selectedLocale)
            : deleteEmailTemplate(selectedEmailTemplateId, selectedLocale);

        deleteFn
            .then((_response: AxiosResponse) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.emailTemplates.notifications.deleteEmailTemplate" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.emailTemplates.notifications.deleteEmailTemplate" +
                        ".success.message")
                }));

                if (isAppSpecific) {
                    setIsNewAppTemplate(true);
                } else {
                    setIsSystemTemplate(true);
                    setIsInheritedTemplate(false);
                }
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
                if (isAppSpecific) {
                    appEmailTemplateMutate();
                }
            });
    };

    const replicatePreviousTemplate = () => {
        setSelectedEmailTemplate(currentEmailTemplate);
        setShowReplicatePreviousTemplateModal(false);
        setIsSystemTemplate(true);
        setIsInheritedTemplate(false);
    };

    const cancelReplicationOfPreviousTemplate = () => {
        setSelectedEmailTemplate(undefined);
        setCurrentEmailTemplate(undefined);
        setShowReplicatePreviousTemplateModal(false);
    };

    const alertUpdateTemplateFromRootOrg = () => {
        setShowUpdateTemplateFromRootOrgModal(false);
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
                        isEmailTemplatesListLoading={ isEmailTemplatesListLoading
                            || (isAppSpecific
                                ? isAppEmailTemplateLoading && !currentEmailTemplate
                                : isEmailTemplateLoading) }
                        selectedEmailTemplate={ currentEmailTemplate }
                        selectedLocale={ selectedLocale }
                        onTemplateChanged={
                            (updatedTemplateAttributes: Partial<EmailTemplate>) =>
                                handleTemplateChange(updatedTemplateAttributes) }
                        onSubmit={ handleSubmit }
                        onDeleteRequested={ handleDeleteRequest }
                        readOnly={ isReadOnly || (isTemplateNotAvailable && !hasEmailTemplateCreatePermissions) }
                        isFeatureEnabled={ isEmailFeatureEnabled }
                    />
                </ResourceTab.Pane>
            )
        });

        return panes;
    };

    return (
        <BrandingPreferenceProvider>
            <PageLayout
                title={ (
                    <div style={ { alignItems: "center", display: "flex", justifyContent: "space-between",
                        width: "100%" } }>
                        <h1 style={ { margin: 0 } }>
                            { isFromAppRedirect && selectedApplicationData?.name
                                ? t("extensions:develop.emailTemplates.page.appSpecificHeader",
                                    { appName: selectedApplicationData.name })
                                : t("extensions:develop.emailTemplates.page.header") }
                        </h1>
                        { !appIdFromQueryParam && (
                            <div style={ { alignItems: "center", display: "flex", flexDirection: "row",
                                gap: "10px" } }>
                                <Paper
                                    elevation={ 0 }
                                    sx={ { borderColor: "#C0BFBF", display: "flex", height: "37px" } }
                                >
                                    <ToggleButtonGroup
                                        exclusive
                                        onChange={ handleEmailTemplatesModeChange }
                                        size="small"
                                        value={ emailTemplatesMode }
                                    >
                                        <ToggleButton
                                            data-componentid={
                                                `${ componentId }-organization-mode-button`
                                            }
                                            value={ EmailTemplatesMode.ORGANIZATION }
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
                                            value={ EmailTemplatesMode.APPLICATION }
                                        >
                                            <span style={ { marginRight: "5px" } }>
                                                <TilesIcon size={ 14 } />
                                            </span>
                                            { t("extensions:develop.branding.pageHeader.application") }
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Paper>
                                { emailTemplatesMode === EmailTemplatesMode.APPLICATION && (
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
                                            setCurrentEmailTemplate(undefined);
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
                pageTitle="Email Templates"
                description={ (
                    <>
                        { isAppSpecific && selectedApplicationData?.name
                            ? (
                                <Trans
                                    i18nKey="extensions:develop.emailTemplates.page.appSpecificDescription"
                                    values={ { appName: selectedApplicationData.name } }
                                    components={ { bold: <strong /> } }
                                />
                            )
                            : t("extensions:develop.emailTemplates.page.description") }
                        <DocumentationLink
                            link={ getLink("develop.emailCustomization.learnMore") }
                        >
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </> )
                }
                titleTextAlign="left"
                bottomMargin={ false }
                backButton={ isFromAppRedirect && {
                    "data-componentid": `${ componentId }-page-back-button`,
                    onClick: () => history.push(
                        (AppConstants.getPaths().get("APPLICATION_EDIT") ?? "")
                            .replace(":id", appIdFromQueryParam ?? "")
                    ),
                    text: t("extensions:develop.emailTemplates.page.backButtonText")
                } }
                data-componentid={ componentId }
            >
                { !isEmailFeatureEnabled && (
                    <EmailTemplateCustomizationPremiumBanner />
                ) }
                <EmailCustomizationHeader
                    selectedEmailTemplateId={ selectedEmailTemplateId }
                    selectedEmailTemplateDescription={ selectedEmailTemplateDescription }
                    selectedLocale={ selectedLocale }
                    emailTemplatesList={ availableEmailTemplatesList }
                    onTemplateSelected={ handleTemplateIdChange }
                    onLocaleChanged={ handleLocaleChange }
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
                                isSaveButtonDisabled={ !isEmailFeatureEnabled }
                            />
                        )
                    }
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

                <ConfirmationModal
                    type="info"
                    open={ showUpdateTemplateFromRootOrgModal }
                    primaryAction={ t("common:okay") }
                    onPrimaryActionClick={ (): void => alertUpdateTemplateFromRootOrg() }
                    data-componentid={ `${ componentId }-update-template-from-root-org-modal` }
                    closeOnDimmerClick={ true }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${ componentId }-update-template-from-root-org-modal-header` }
                    >
                        { t("extensions:develop.emailTemplates.modal.updateFromRootOrg.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        info
                        data-componentid={ `${ componentId }-update-template-from-root-org-modal-message` }
                    >
                        { t("extensions:develop.emailTemplates.modal.updateFromRootOrg.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-testid={ `${ componentId }-update-template-from-root-org-modal-content` }
                    >
                        { t("extensions:develop.emailTemplates.modal.updateFromRootOrg.content") }
                    </ConfirmationModal.Content>
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
