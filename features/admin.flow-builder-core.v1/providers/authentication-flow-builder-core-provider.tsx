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
import { I18nConstants } from "@wso2is/admin.core.v1/constants/i18n-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { BrandingPreferenceTypes, PreviewScreenType } from "@wso2is/common.branding.v1/models/branding-preferences";
import { AlertLevels, Claim } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ReactFlowProvider } from "@xyflow/react";
import merge from "lodash-es/merge";
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
import { getCustomScreenName } from "../utils/custom-text-utils";

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
        BrandingPreferenceTypes.ORG, isSubOrganization(), flowType, screenTypes?.length > 0);
    const {
        data: fallbackTextPreference,
        error: fallbackTextPreferenceFetchError,
        isLoading: fallbackTextPreferenceLoading
    } = useGetCustomTextPreferenceFallbacks(screenTypes, language, screenTypes?.length > 0);

    /**
     * Memoized i18n text combining both text preference and fallback.
     */
    const i18nText: { [key in PreviewScreenType]?: Record<string, string> } = useMemo(() => {
        if (!textPreference || !fallbackTextPreference) {
            return {};
        }

        return merge(fallbackTextPreference, textPreference);
    }, [ textPreference, fallbackTextPreference ]);

    /**
     * Error handling for flow metadata fetch.
     */
    useEffect(() => {
        if (flowMetadataError) {
            dispatch(addAlert({
                description: t("flows:core.errors.flowMetadataFetch.description"),
                level: AlertLevels.ERROR,
                message: t("flows:core.errors.flowMetadataFetch.message")
            }));
        }
    }, [ flowMetadataError ]);

    /**
     * Error handling for text preference fetch.
     */
    useEffect(() => {
        if (textPreferenceFetchError) {
            dispatch(addAlert({
                description: t("flows:core.errors.textPreferenceFetch.description"),
                level: AlertLevels.ERROR,
                message: t("flows:core.errors.textPreferenceFetch.message")
            }));
        }
    }, [ textPreferenceFetchError ]);

    /**
     * Error handling for fallback text preference fetch.
     */
    useEffect(() => {
        if (fallbackTextPreferenceFetchError) {
            dispatch(addAlert({
                description: t("flows:core.errors.fallbackTextPreferenceFetch.description"),
                level: AlertLevels.ERROR,
                message: t("flows:core.errors.fallbackTextPreferenceFetch.message")
            }));
        }
    }, [ fallbackTextPreferenceFetchError ]);

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
     * Function to add a new i18n key for the flow builder custom screen.
     */
    const addI18nKey: (key: string, value: string) => Promise<void> = useCallback(
        async (key: string, value: string): Promise<void> => {
            setIsI18nSubmitting(true);
            const customScreenName: string = getCustomScreenName(flowType);

            try {
                if (!i18nText[customScreenName]) {
                    await updateCustomTextPreference(
                        false,
                        {
                            text: {
                                [ key ]: value
                            }
                        },
                        tenantDomain,
                        customScreenName,
                        language,
                        BrandingPreferenceTypes.ORG
                    );
                } else {
                    await updateCustomTextPreference(
                        true,
                        {
                            text: {
                                ...i18nText[customScreenName],
                                [ key ]: value
                            }
                        },
                        tenantDomain,
                        customScreenName,
                        language,
                        BrandingPreferenceTypes.ORG
                    );
                }

                mutateTextPreference();
            } catch (error) {
                dispatch(addAlert({
                    description: t("flows:core.errors.addI18nKey.description"),
                    level: AlertLevels.ERROR,
                    message: t("flows:core.errors.addI18nKey.message")
                }));
            } finally {
                setIsI18nSubmitting(false);
            }
        }, [ i18nText, language, tenantDomain ]);

    /**
     * Function to update an existing i18n key for the flow builder custom screen.
     */
    const updateI18nKey: (screenType: string, i18nKey: string, value: string) => Promise<void> = useCallback(
        async (screenType: string, i18nKey: string, value: string): Promise<void> => {
            setIsI18nSubmitting(true);

            try {
                if (!i18nText[screenType]) {
                    await updateCustomTextPreference(
                        false,
                        {
                            text: {
                                [ i18nKey ]: value
                            }
                        },
                        tenantDomain,
                        screenType,
                        language,
                        BrandingPreferenceTypes.ORG
                    );
                } else {
                    await updateCustomTextPreference(
                        true,
                        {
                            text: {
                                ...i18nText[screenType],
                                [ i18nKey ]: value
                            }
                        },
                        tenantDomain,
                        screenType,
                        language,
                        BrandingPreferenceTypes.ORG
                    );
                }

                mutateTextPreference();
            } catch (error) {
                dispatch(addAlert({
                    description: t("flows:core.errors.updateI18nKey.description"),
                    level: AlertLevels.ERROR,
                    message: t("flows:core.errors.updateI18nKey.message")
                }));
            } finally {
                setIsI18nSubmitting(false);
            }
        }, [ i18nText, language, tenantDomain ]);

    return (
        <ReactFlowProvider>
            <AuthenticationFlowBuilderCoreContext.Provider
                value={ {
                    ElementFactory,
                    ResourceProperties,
                    addI18nKey,
                    i18nText,
                    i18nTextLoading: textPreferenceLoading || fallbackTextPreferenceLoading,
                    isI18nSubmitting,
                    isResourcePanelOpen,
                    isResourcePropertiesPanelOpen,
                    language,
                    lastInteractedResource: lastInteractedElementInternal,
                    lastInteractedStepId,
                    metadata: flowMetadata,
                    onResourceDropOnCanvas,
                    resourcePropertiesPanelHeading,
                    selectedAttributes,
                    setIsOpenResourcePropertiesPanel,
                    setIsResourcePanelOpen,
                    setLanguage,
                    setLastInteractedResource,
                    setLastInteractedStepId,
                    setResourcePropertiesPanelHeading,
                    setSelectedAttributes,
                    updateI18nKey
                } }
            >
                { children }
            </AuthenticationFlowBuilderCoreContext.Provider>
        </ReactFlowProvider>
    );
};

export default AuthenticationFlowBuilderCoreProvider;
