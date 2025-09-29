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
import useUserPreferences from "@wso2is/common.ui.v1/hooks/use-user-preferences";
import { AlertLevels, Claim } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import { EdgeTypes, NodeTypes, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import { AxiosRequestConfig } from "axios";
import merge from "lodash-es/merge";
import pick from "lodash-es/pick";
import startCase from "lodash-es/startCase";
import moment from "moment";
import React, {
    FunctionComponent,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import ValidationProvider from "./validation-provider";
import useGetCustomTextPreferenceFallbacks from "../api/use-get-custom-text-preference-fallbacks";
import useGetMetadata from "../api/use-metadata";
import useResolveCustomTextPreferences from "../api/use-resolve-custom-text-preference";
import FlowConstants from "../constants/flow-constants";
import AuthenticationFlowBuilderCoreContext from "../context/authentication-flow-builder-core-context";
import { ValidationConfig } from "../context/validation-context";
import { FlowCompletionConfigsInterface, FlowsHistoryInterface } from "../models/flows";
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
    /**
     * Validation configuration settings.
     */
    validationConfig?: ValidationConfig;
}

/**
 * Inner component that uses useReactFlow hook and provides the core context.
 */
const FlowContextWrapper = ({
    ElementFactory,
    ResourceProperties,
    children,
    flowType,
    screenTypes,
    validationConfig
}: PropsWithChildren<AuthenticationFlowBuilderProviderProps>): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { isSubOrganization } = useGetCurrentOrganizationType();
    const { toObject } = useReactFlow();
    const { flows, setPreferences } = useUserPreferences();

    const userName: string = useSelector((state: AppState) => state.profile.profileInfo.userName);
    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

    const [ isResourcePanelOpen, setIsResourcePanelOpen ] = useState<boolean>(true);
    const [ isResourcePropertiesPanelOpen, setIsOpenResourcePropertiesPanel ] = useState<boolean>(false);
    const [ isVersionHistoryPanelOpen, setIsVersionHistoryPanelOpen ] = useState<boolean>(false);
    const [ resourcePropertiesPanelHeading, setResourcePropertiesPanelHeading ] = useState<ReactNode>(null);
    const [ lastInteractedElementInternal, setLastInteractedElementInternal ] = useState<Resource>(null);
    const [ lastInteractedStepId, setLastInteractedStepId ] = useState<string>("");
    const [ selectedAttributes, setSelectedAttributes ] = useState<{ [key: string]: Claim[] }>({});
    const [ language, setLanguage ] = useState<string>(I18nConstants.DEFAULT_FALLBACK_LANGUAGE);
    const [ isI18nSubmitting, setIsI18nSubmitting ] = useState<boolean>(false);
    const [ flowCompletionConfigs, setFlowCompletionConfigs ] = useState<FlowCompletionConfigsInterface>({});
    const [ isAutoSaveLocalHistoryEnabled, setIsAutoSaveLocalHistoryEnabled ] = useState<boolean>(true);
    const [ isAutoSavingLocalHistory, setIsAutoSavingLocalHistory ] = useState<boolean>(false);
    const [ lastLocalHistoryAutoSaveTimestamp, setLastLocalHistoryAutoSaveTimestamp ] = useState<number | null>(null);
    const [ hasLocalHistory, setHasLocalHistory ] = useState<boolean>(false);
    const [ flowNodeTypes, setFlowNodeTypes ] = useState<NodeTypes>({});
    const [ flowEdgeTypes, setFlowEdgeTypes ] = useState<EdgeTypes>({});

    const intervalRef: MutableRefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null);

    /**
     * Memoized drafts for the current flow type.
     */
    const localHistory: FlowsHistoryInterface[] = useMemo(() => {
        return flows?.[flowType]?.history ?? [];
    }, [ flows, flowType ]);

    const { data: flowMetadata, error: flowMetadataError, isLoading: isFlowMetadataLoading } = useGetMetadata(
        flowType,
        !!flowType
    );
    const {
        data: textPreference,
        error: textPreferenceFetchError,
        isLoading: textPreferenceLoading,
        mutate: mutateTextPreference
    } = useResolveCustomTextPreferences(
        tenantDomain,
        screenTypes,
        language,
        BrandingPreferenceTypes.ORG,
        isSubOrganization(),
        screenTypes?.length > 0
    );
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
    const { data: brandingPreference, error: brandingPreferenceError } = useGetBrandingPreference(tenantDomain);

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
     * Check for existing drafts on component mount.
     */
    useEffect(() => {
        setHasLocalHistory(localHistory.length > 0);
    }, [ localHistory ]);

    /**
     * Manually trigger an auto-save operation.
     */
    const triggerLocalHistoryAutoSave: () => Promise<boolean> = useCallback(async (): Promise<boolean> => {
        if (!toObject || isAutoSavingLocalHistory) {
            return false;
        }

        setIsAutoSavingLocalHistory(true);

        try {
            const flowData: Record<string, unknown> = toObject();

            if (!flowData || Object.keys(flowData).length === 0) {
                return false;
            }

            // Check if the new flow data is different from the most recent history item
            const mostRecentHistoryItem: FlowsHistoryInterface = localHistory[localHistory.length - 1];

            if (mostRecentHistoryItem &&
                JSON.stringify(mostRecentHistoryItem.flowData) === JSON.stringify(flowData)) {
                // Data is the same as the most recent item, no need to save
                return false;
            }

            const timestamp: number = Date.now();

            const history: FlowsHistoryInterface[] = [
                ...localHistory,
                {
                    author: {
                        userName
                    },
                    flowData: flowData,
                    timestamp
                }
            ].slice(-FlowConstants.MAX_HISTORY_ITEMS);

            // Save a draft using setPreferences in localstorage.
            await setPreferences({
                flows: {
                    [flowType]: {
                        history
                    }
                }
            });

            setLastLocalHistoryAutoSaveTimestamp(timestamp);
            setHasLocalHistory(true);

            return true;
        } catch (error) {
            return false;
        } finally {
            setIsAutoSavingLocalHistory(false);
        }
    }, [ toObject, isAutoSavingLocalHistory, flowType, setPreferences, dispatch, t, localHistory ]);

    /**
     * Clear all saved drafts for this flow type.
     */
    const clearLocalHistory: () => Promise<boolean> = useCallback(async (): Promise<boolean> => {
        try {
            // Clear drafts from preferences
            await setPreferences({
                flows: {
                    [flowType]: {
                        history: []
                    }
                }
            });

            setHasLocalHistory(false);
            setLastLocalHistoryAutoSaveTimestamp(null);

            return true;
        } catch (error) {

            return false;
        }
    }, [ flowType, setPreferences ]);

    /**
     * Restore flow from a specific history item.
     */
    const restoreFromHistory: (historyItem: FlowsHistoryInterface) => Promise<boolean> = useCallback(
        async (historyItem: FlowsHistoryInterface): Promise<boolean> => {
            try {
                const { flowData } = historyItem;

                if (!flowData || !flowData.nodes || !flowData.edges) {
                    dispatch(
                        addAlert({
                            description: t("flows:core.notifications.restoreFromHistory.invalidData.description"),
                            level: AlertLevels.ERROR,
                            message: t("flows:core.notifications.restoreFromHistory.invalidData.message")
                        })
                    );

                    return false;
                }

                // Extract nodes and edges from the flow data
                const { nodes, edges } = flowData as { nodes: any[]; edges: any[] };

                // Apply the restored flow data to the current flow using React Flow's methods
                // Note: This assumes the provider has access to setNodes and setEdges methods
                // which will be provided by the specific flow builder implementation
                if (typeof window !== "undefined") {
                    // Dispatch a custom event that the flow builder cores can listen to
                    const restoreEvent: CustomEvent = new CustomEvent("restoreFromHistory", {
                        detail: {  edges, historyItem, nodes }
                    });

                    window.dispatchEvent(restoreEvent);

                    // Show success message
                    dispatch(
                        addAlert({
                            description: t("flows:core.notifications.restoreFromHistory.success.description", {
                                date: moment(Number(historyItem.timestamp)).format("MMMM DD [at] h:mm A")
                            }),
                            level: AlertLevels.SUCCESS,
                            message: t("flows:core.notifications.restoreFromHistory.success.message")
                        })
                    );
                }

                return true;
            } catch (error) {
                dispatch(
                    addAlert({
                        description: t("flows:core.notifications.restoreFromHistory.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("flows:core.notifications.restoreFromHistory.genericError.message")
                    })
                );

                return false;
            }
        },
        [ dispatch ]
    );

    /**
     * Set up auto-save interval.
     */
    useEffect(() => {
        if (isAutoSaveLocalHistoryEnabled && FlowConstants.AUTO_SAVE_INTERVAL > 0) {
            intervalRef.current = setInterval(() => {
                triggerLocalHistoryAutoSave();
            }, FlowConstants.AUTO_SAVE_INTERVAL);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            };
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return undefined;
    }, [ isAutoSaveLocalHistoryEnabled, triggerLocalHistoryAutoSave ]);

    /**
     * Cleanup interval on unmount.
     */
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    /**
     * Error handling for flow metadata fetch.
     */
    useEffect(() => {
        if (flowMetadataError) {
            dispatch(
                addAlert({
                    description: t("flows:core.notifications.flowMetadataFetch.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flows:core.notifications.flowMetadataFetch.genericError.message")
                })
            );
        }
    }, [ flowMetadataError ]);

    /**
     * Error handling for text preference fetch.
     */
    useEffect(() => {
        if (textPreferenceFetchError) {
            dispatch(
                addAlert({
                    description: t("flows:core.notifications.textPreferenceFetch.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flows:core.notifications.textPreferenceFetch.genericError.message")
                })
            );
        }
    }, [ textPreferenceFetchError ]);

    /**
     * Error handling for fallback text preference fetch.
     */
    useEffect(() => {
        if (fallbackTextPreferenceFetchError) {
            dispatch(
                addAlert({
                    description: t("flows:core.notifications.fallbackTextPreferenceFetch.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flows:core.notifications.fallbackTextPreferenceFetch.genericError.message")
                })
            );
        }
    }, [ fallbackTextPreferenceFetchError ]);

    /**
     * Error handling for custom text preference meta fetch.
     */
    useEffect(() => {
        if (customTextPreferenceMetaError?.response?.status === 404) {
            // Check if the 404 error is specifically from the extensions i18n meta endpoint.
            const errorConfig: AxiosRequestConfig = customTextPreferenceMetaError?.config;
            const isExtensionsMetaRequest: boolean =
                errorConfig?.url && errorConfig.url.includes("extensions/branding/i18n/meta.json");

            if (isExtensionsMetaRequest) {
                // Silently ignore 404 errors from extensions meta endpoint as it's optional.
                return;
            }
        }

        if (customTextPreferenceMetaError) {
            dispatch(
                addAlert({
                    description: t("flows:core.notifications.customTextPreferenceMetaFetch.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flows:core.notifications.customTextPreferenceMetaFetch.genericError.message")
                })
            );
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
            dispatch(
                addAlert({
                    description: t("flows:core.notifications.brandingPreferenceFetch.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flows:core.notifications.brandingPreferenceFetch.genericError.message")
                })
            );
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
    const updateI18nKey: (
        screenType: string,
        language: string,
        i18nText: Record<string, string>
    ) => Promise<boolean> = useCallback(
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
        },
        [ textPreference, tenantDomain ]
    );

    /**
     * Function to check if a given i18n key is custom.
     */
    const isCustomI18nKey: (key: string, excludePrimaryScreen?: boolean) => boolean = useCallback(
        (key: string, excludePrimaryScreen: boolean = true): boolean => {
            return fallbackTextPreference
                ? Object.keys(fallbackTextPreference).every(
                    (screenType: PreviewScreenType) =>
                        (screenType === primaryI18nScreen && excludePrimaryScreen) ||
                          !fallbackTextPreference[screenType][key]
                )
                : false;
        },
        [ fallbackTextPreference, primaryI18nScreen ]
    );

    return (
        <AuthenticationFlowBuilderCoreContext.Provider
            value={ {
                ElementFactory,
                ResourceProperties,
                clearLocalHistory,
                flowCompletionConfigs,
                flowEdgeTypes,
                flowNodeTypes,
                hasLocalHistory,
                i18nText,
                i18nTextLoading:
                textPreferenceLoading || fallbackTextPreferenceLoading || customTextPreferenceMetaLoading,
                isAutoSaveLocalHistoryEnabled,
                isAutoSavingLocalHistory,
                isBrandingEnabled,
                isCustomI18nKey,
                isFlowMetadataLoading,
                isI18nSubmitting,
                isResourcePanelOpen,
                isResourcePropertiesPanelOpen,
                isVersionHistoryPanelOpen,
                language,
                lastInteractedResource: lastInteractedElementInternal,
                lastInteractedStepId,
                lastLocalHistoryAutoSaveTimestamp,
                localHistory,
                metadata: flowMetadata,
                onResourceDropOnCanvas,
                primaryI18nScreen,
                resourcePropertiesPanelHeading,
                restoreFromHistory,
                selectedAttributes,
                setFlowCompletionConfigs,
                setFlowEdgeTypes,
                setFlowNodeTypes,
                setIsOpenResourcePropertiesPanel,
                setIsResourcePanelOpen,
                setIsVersionHistoryPanelOpen,
                setLanguage,
                setLastInteractedResource,
                setLastInteractedStepId,
                setLocalHistoryAutoSaveEnabled: setIsAutoSaveLocalHistoryEnabled,
                setResourcePropertiesPanelHeading,
                setSelectedAttributes,
                supportedLocales,
                triggerLocalHistoryAutoSave,
                updateI18nKey
            } }
        >
            <ValidationProvider validationConfig={ validationConfig }>{ children }</ValidationProvider>
        </AuthenticationFlowBuilderCoreContext.Provider>
    );
};

/**
 * This component provides authentication flow builder core related context to its children.
 * It wraps the internal component with ReactFlowProvider to enable useReactFlow hook usage.
 *
 * @param props - Props injected to the component.
 * @returns The AuthenticationFlowBuilderCoreProvider component.
 */
const AuthenticationFlowBuilderCoreProvider = (
    props: PropsWithChildren<AuthenticationFlowBuilderProviderProps>
): ReactElement => {
    return (
        <ReactFlowProvider>
            <FlowContextWrapper { ...props } />
        </ReactFlowProvider>
    );
};

export default AuthenticationFlowBuilderCoreProvider;
