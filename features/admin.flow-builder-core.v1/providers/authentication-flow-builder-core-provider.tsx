/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Avatar from "@oxygen-ui/react/Avatar";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import updateCustomTextPreference from "@wso2is/admin.branding.v1/api/update-custom-text-preference";
import useGetCustomTextPreferenceMeta from "@wso2is/admin.branding.v1/api/use-get-custom-text-preference-meta";
import { I18nConstants } from "@wso2is/admin.core.v1/constants/i18n-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import useGetBrandingPreference from "@wso2is/common.branding.v1/api/use-get-branding-preference";
import { BrandingPreferenceTypes, PreviewScreenType } from "@wso2is/common.branding.v1/models/branding-preferences";
import { AlertLevels, Claim } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import { ReactFlowProvider } from "@xyflow/react";
import { AxiosRequestConfig } from "axios";
import merge from "lodash-es/merge";
import pick from "lodash-es/pick";
import startCase from "lodash-es/startCase";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import useGetCustomTextPreferenceFallbacks from "../api/use-get-custom-text-preference-fallbacks";
import useGetMetadata from "../api/use-metadata";
import useResolveCustomTextPreferences from "../api/use-resolve-custom-text-preference";
import AuthenticationFlowBuilderCoreContext from "../context/authentication-flow-builder-core-context";
import { Resource, ResourceTypes } from "../models/resources";
import { StepTypes } from "../models/steps";

/**
 * Props interface of {@link AuthenticationFlowBuilderCoreProvider}
 */
export interface AuthenticationFlowBuilderProviderProps {
    /**
     * The factory for creating nodes.
     */
    ElementFactory: FunctionComponent<any>;
    /**
     * The factory for creating element properties.
     */
    ResourceProperties: FunctionComponent<any>;
    /**
     * The type of the flow.
     */
    flowType: FlowTypes;
    /**
     * Screen types for the i18n text.
     * First provided screen type will be used as the primary screen type.
     */
    screenTypes: PreviewScreenType[];
}

/**
 * This component provides authentication flow builder core related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The AuthenticationFlowBuilderCoreProvider component.
 */
const AuthenticationFlowBuilderCoreProvider = ({
    ElementFactory,
    ResourceProperties,
    children,
    flowType,
    screenTypes
}: PropsWithChildren<AuthenticationFlowBuilderProviderProps>): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { isSubOrganization } = useGetCurrentOrganizationType();
    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

    const [ isResourcePanelOpen, setIsResourcePanelOpen ] = useState<boolean>(true);
    const [ isResourcePropertiesPanelOpen, setIsOpenResourcePropertiesPanel ] = useState<boolean>(false);
    const [ resourcePropertiesPanelHeading, setResourcePropertiesPanelHeading ] = useState<ReactNode>(null);
    const [ lastInteractedElementInternal, setLastInteractedElementInternal ] = useState<Resource>(null);
    const [ lastInteractedStepId, setLastInteractedStepId ] = useState<string>("");
    const [ selectedAttributes, setSelectedAttributes ] = useState<{ [key: string]: Claim[] }>({});
    const [ language, setLanguage ] = useState<string>(I18nConstants.DEFAULT_FALLBACK_LANGUAGE);
    const [ isI18nSubmitting, setIsI18nSubmitting ] = useState<boolean>(false);

    const { data: flowMetadata, error: flowMetadataError } = useGetMetadata(flowType, !!flowType);
    const {
        data: textPreference,
        error: textPreferenceFetchError,
        isLoading: textPreferenceLoading,
        mutate: mutateTextPreference
    } = useResolveCustomTextPreferences(tenantDomain, screenTypes, language,
        BrandingPreferenceTypes.ORG, isSubOrganization(), screenTypes?.length > 0);
    const {
        data: fallbackTextPreference,
        error: fallbackTextPreferenceFetchError,
        isLoading: fallbackTextPreferenceLoading
    } = useGetCustomTextPreferenceFallbacks(screenTypes, language, screenTypes?.length > 0);
    const {
        data: customTextPreferenceMeta,
        isLoading: customTextPreferenceMetaLoading,
        error: customTextPreferenceMetaError
    } = useGetCustomTextPreferenceMeta();
    const {
        data: brandingPreference,
        error: brandingPreferenceError
    } = useGetBrandingPreference(tenantDomain);

    /**
     * Memoized i18n text combining both text preference and fallback.
     */
    const i18nText: { [key in PreviewScreenType]?: Record<string, string> } = useMemo(() => {
        if (!textPreference || !fallbackTextPreference) {
            return {};
        }

        return merge({}, fallbackTextPreference, textPreference);
    }, [ textPreference, fallbackTextPreference ]);

    /**
     * Memoized supported locales based on the custom text preference meta.
     */
    const supportedLocales: SupportedLanguagesMeta = useMemo(() => {
        if (!supportedI18nLanguages || !customTextPreferenceMeta) {
            return {};
        }

        return pick(supportedI18nLanguages, customTextPreferenceMeta?.locales);
    }, [ supportedI18nLanguages, customTextPreferenceMeta ]);

    /**
     * Memoized branding enabled status based on the branding preference.
     */
    const isBrandingEnabled: boolean = useMemo(() => {
        return brandingPreference?.preference?.configs?.isBrandingEnabled ?? false;
    }, [ brandingPreference ]);

    /**
     * Memoized primary i18n screen based on the screen types.
     */
    const primaryI18nScreen: PreviewScreenType = useMemo(() => {
        return screenTypes?.[0] || PreviewScreenType.COMMON;
    }, [ screenTypes ]);

    /**
     * Error handling for flow metadata fetch.
     */
    useEffect(() => {
        if (flowMetadataError) {
            dispatch(addAlert({
                description: t("flows:core.notifications.flowMetadataFetch.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("flows:core.notifications.flowMetadataFetch.genericError.message")
            }));
        }
    }, [ flowMetadataError ]);

    /**
     * Error handling for text preference fetch.
     */
    useEffect(() => {
        if (textPreferenceFetchError) {
            dispatch(addAlert({
                description: t("flows:core.notifications.textPreferenceFetch.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("flows:core.notifications.textPreferenceFetch.genericError.message")
            }));
        }
    }, [ textPreferenceFetchError ]);

    /**
     * Error handling for fallback text preference fetch.
     */
    useEffect(() => {
        if (fallbackTextPreferenceFetchError) {
            dispatch(addAlert({
                description: t("flows:core.notifications.fallbackTextPreferenceFetch.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("flows:core.notifications.fallbackTextPreferenceFetch.genericError.message")
            }));
        }
    }, [ fallbackTextPreferenceFetchError ]);

    /**
     * Error handling for custom text preference meta fetch.
     */
    useEffect(() => {
        if (customTextPreferenceMetaError?.response?.status === 404) {
            // Check if the 404 error is specifically from the extensions i18n meta endpoint.
            const errorConfig: AxiosRequestConfig = customTextPreferenceMetaError?.config;
            const isExtensionsMetaRequest: boolean = errorConfig?.url &&
                errorConfig.url.includes("extensions/branding/i18n/meta.json");

            if (isExtensionsMetaRequest) {
                // Silently ignore 404 errors from extensions meta endpoint as it's optional.
                return;
            }
        }

        if (customTextPreferenceMetaError) {
            dispatch(addAlert({
                description: t("flows:core.notifications.customTextPreferenceMetaFetch.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("flows:core.notifications.customTextPreferenceMetaFetch.genericError.message")
            }));
        }
    }, [ customTextPreferenceMetaError ]);

    /**
     * Error handling for branding preference fetch.
     */
    useEffect(() => {
        if (brandingPreferenceError?.response?.status === 404) {
            return;
        }

        if (brandingPreferenceError) {
            dispatch(addAlert({
                description: t("flows:core.notifications.brandingPreferenceFetch.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("flows:core.notifications.brandingPreferenceFetch.genericError.message")
            }));
        }
    }, [ brandingPreferenceError ]);

    const onResourceDropOnCanvas = (resource: Resource, stepId: string): void => {
        setLastInteractedResource(resource);
        setLastInteractedStepId(stepId);
    };

    const setLastInteractedResource = (resource: Resource): void => {
        // TODO: Internationalize this string and get from a mapping.
        setResourcePropertiesPanelHeading(
            <Stack direction="row" className="sub-title" gap={ 1 } alignItems="center">
                <Avatar src={ resource?.display?.image } variant="square" />
                <Typography variant="h6">{ startCase(resource?.type?.toLowerCase()) } Properties</Typography>
            </Stack>
        );
        setLastInteractedElementInternal(resource);

        // If the element is a step node, do not open the properties panel for now.
        // TODO: Figure out if there are properties for a step.
        if (
            (resource.category === ResourceTypes.Step && resource.type === StepTypes.View) ||
            resource.resourceType === ResourceTypes.Template ||
            resource.resourceType === ResourceTypes.Widget
        ) {
            setIsOpenResourcePropertiesPanel(false);

            return;
        }

        setIsOpenResourcePropertiesPanel(true);
    };

    /**
     * Function to update an existing i18n key for the flow builder custom screen.
     */
    const updateI18nKey: (screenType: string, language: string,
        i18nText: Record<string, string>) => Promise<boolean> = useCallback(
            async (screenType: string, language: string, i18nText: Record<string, string>): Promise<boolean> => {
                setIsI18nSubmitting(true);
                const isUpdate: boolean = Object.keys(textPreference[screenType]).length > 0;

                try {
                    await updateCustomTextPreference(
                        isUpdate,
                        {
                            text: i18nText
                        },
                        tenantDomain,
                        screenType,
                        language,
                        BrandingPreferenceTypes.ORG
                    );

                    mutateTextPreference();

                    return true;
                } catch (error) {
                    return false;
                } finally {
                    setIsI18nSubmitting(false);
                }
            }, [ textPreference, tenantDomain ]);

    /**
     * Function to check if a given i18n key is custom.
     */
    const isCustomI18nKey: (key: string, excludePrimaryScreen?: boolean) => boolean = useCallback(
        (key: string, excludePrimaryScreen: boolean = true): boolean => {
            return fallbackTextPreference ? Object.keys(fallbackTextPreference).every(
                (screenType: PreviewScreenType) => (screenType === primaryI18nScreen && excludePrimaryScreen)
                    || !fallbackTextPreference[screenType][key]) : false;
        }, [ fallbackTextPreference, primaryI18nScreen ]);

    return (
        <ReactFlowProvider>
            <AuthenticationFlowBuilderCoreContext.Provider
                value={ {
                    ElementFactory,
                    ResourceProperties,
                    i18nText,
                    i18nTextLoading: textPreferenceLoading ||
                        fallbackTextPreferenceLoading ||
                        customTextPreferenceMetaLoading,
                    isBrandingEnabled,
                    isCustomI18nKey,
                    isI18nSubmitting,
                    isResourcePanelOpen,
                    isResourcePropertiesPanelOpen,
                    language,
                    lastInteractedResource: lastInteractedElementInternal,
                    lastInteractedStepId,
                    metadata: flowMetadata,
                    onResourceDropOnCanvas,
                    primaryI18nScreen,
                    resourcePropertiesPanelHeading,
                    selectedAttributes,
                    setIsOpenResourcePropertiesPanel,
                    setIsResourcePanelOpen,
                    setLanguage,
                    setLastInteractedResource,
                    setLastInteractedStepId,
                    setResourcePropertiesPanelHeading,
                    setSelectedAttributes,
                    supportedLocales,
                    updateI18nKey
                } }
            >
                { children }
            </AuthenticationFlowBuilderCoreContext.Provider>
        </ReactFlowProvider>
    );
};

export default AuthenticationFlowBuilderCoreProvider;
