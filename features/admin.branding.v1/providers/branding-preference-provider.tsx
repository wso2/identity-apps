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

import { OrganizationType } from "@wso2is/admin.core.v1";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { OrganizationResponseInterface } from "@wso2is/admin.organizations.v1/models/organizations";
import useGetBrandingPreferenceResolve from "@wso2is/common.branding.v1/api/use-get-branding-preference-resolve";
import { BrandingSubFeatures, PreviewScreenType } from "@wso2is/common.branding.v1/models/branding-preferences";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormState } from "@wso2is/form";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEqual from "lodash-es/isEqual";
import merge from "lodash-es/merge";
import pick from "lodash-es/pick";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import deleteCustomTextPreference from "../api/delete-custom-text-preference";
import updateCustomTextPreference from "../api/update-custom-text-preference";
import useGetCustomTextPreferenceFallbacks from "../api/use-get-custom-text-preference-fallbacks";
import useGetCustomTextPreferenceMeta from "../api/use-get-custom-text-preference-meta";
import useGetCustomTextPreferenceResolve from "../api/use-get-custom-text-preference-resolve";
import useGetCustomTextPreferenceScreenMeta from "../api/use-get-custom-text-preference-screen-meta";
import { BrandingPreferencesConstants } from "../constants/branding-preferences-constants";
import { CustomTextPreferenceConstants } from "../constants/custom-text-preference-constants";
import AuthenticationFlowContext from "../context/branding-preference-context";
import {
    CustomTextConfigurationModes,
    CustomTextInterface,
    CustomTextPreferenceAPIResponseInterface,
    CustomTextPreferenceInterface
} from "../models/custom-text-preference";
import BrandingPreferenceMigrationClient from "../utils/branding-preference-migration-client";
import processCustomTextTemplateLiterals from "../utils/process-custom-text-template-literals";

/**
 * Props interface for the Branding preference provider.
 */
export type BrandingPreferenceProviderProps = PropsWithChildren;

/**
 * React context provider for the branding preference context.
 * This provider must be added at the root of the features to make the context available throughout the feature.
 *
 * @example
 * <BrandingPreferenceProvider>
 *    <Feature />
 * </BrandingPreferenceProvider>
 *
 * @param props - Props injected to the component.
 * @returns Branding preference context instance.
 */
const BrandingPreferenceProvider: FunctionComponent<BrandingPreferenceProviderProps> = (
    props: BrandingPreferenceProviderProps
): ReactElement => {
    const { children } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();
    const { organizationType } = useGetCurrentOrganizationType();

    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state?.global?.supportedI18nLanguages
    );
    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state?.organization?.organization
    );

    const [ selectedScreen, setSelectedPreviewScreen ] = useState<PreviewScreenType>(PreviewScreenType.COMMON);
    const [ selectedLocale, setSelectedCustomTextLocale ] = useState<string>(
        CustomTextPreferenceConstants.DEFAULT_LOCALE
    );
    const [ customTextFormSubscription, setCustomTextFormSubscription ] = useState<
        Partial<FormState<CustomTextInterface, CustomTextInterface>>
    >(null);
    const [ activeTab, setActiveTab ] = useState<string>(null);
    const [ activeCustomTextConfigurationMode, setActiveCustomTextConfigurationMode ] = useState<
        CustomTextConfigurationModes
    >(CustomTextConfigurationModes.TEXT_FIELDS);

    const [ isCustomTextPreferenceConfigured, setIsCustomTextPreferenceConfigured ] = useState<boolean>(true);


    const {
        data: brandingPreference
    } = useGetBrandingPreferenceResolve(tenantDomain);

    const {
        data: customTextCommons
    } = useGetCustomTextPreferenceResolve(!!selectedLocale, tenantDomain, "common", selectedLocale);

    const {
        data: customText,
        error: customTextPreferenceFetchRequestError,
        isLoading: isCustomTextPreferenceFetching,
        mutate: mutateCustomTextPreferenceFetchRequest
    } = useGetCustomTextPreferenceResolve(
        !!selectedScreen && !!selectedLocale,
        tenantDomain,
        selectedScreen,
        selectedLocale
    );

    const {
        data: customTextFallbackCommons
    } = useGetCustomTextPreferenceFallbacks(!!selectedLocale, tenantDomain, PreviewScreenType.COMMON, selectedLocale);

    const {
        data: customTextFallbacks
    } = useGetCustomTextPreferenceFallbacks(
        !!selectedScreen && !!selectedLocale,
        tenantDomain,
        selectedScreen,
        selectedLocale
    );

    const {
        data: customTextMeta
    } = useGetCustomTextPreferenceMeta();

    const {
        data: customTextScreenMeta
    } = useGetCustomTextPreferenceScreenMeta(
        !!selectedScreen,
        selectedScreen
    );

    /**
     * Merge the custom text preference with the fallbacks.
     * This is done to ensure that the custom text preference is always up to date.
     * If the custom text preference is not available, the fallbacks will be used.
     */
    const resolvedCustomText: CustomTextPreferenceAPIResponseInterface = useMemo(() => {
        return merge(
            cloneDeep(
                BrandingPreferenceMigrationClient.migrateCustomTextPreference(customTextFallbacks, brandingPreference)
            ),
            cloneDeep(customText)
        );
    }, [ customTextFallbacks, customText ]);

    /**
     * Check if the custom text preference fetch request has failed.
     */
    useEffect(() => {
        if (!customTextPreferenceFetchRequestError) {
            return;
        }

        // Check if Branding is not configured for the tenant. If so, silent the errors.
        if (
            customTextPreferenceFetchRequestError.response?.data?.code ===
            CustomTextPreferenceConstants.CUSTOM_TEXT_PREFERENCE_NOT_CONFIGURED_ERROR_CODE
        ) {
            return;
        }

        dispatch(
            addAlert<AlertInterface>({
                description: t("branding:brandingCustomText.notifications.getPreferenceError.description", {
                    locale: selectedLocale,
                    screen: selectedScreen
                }),
                level: AlertLevels.ERROR,
                message: t("branding:brandingCustomText.notifications.getPreferenceError.message")
            })
        );
    }, [ customTextPreferenceFetchRequestError ]);

    /**
     * Moderates the Custom Text Preference response.
     */
    useEffect(() => {
        if (!customText) {
            return;
        }
        if (organizationType === OrganizationType.SUBORGANIZATION
            && customText?.name !== currentOrganization?.id) {
            // This means the sub-org has no custom text preference configured.
            // It gets the custom text preference from the parent org.
            setIsCustomTextPreferenceConfigured(false);
        } else {
            setIsCustomTextPreferenceConfigured(true);
        }
    }, [ customText ]);

    /**
     * Updates the custom text preference.
     *
     * @param values - Values to be updated.
     * @param _isCustomTextPreferenceConfigured - Flag to check if the custom text preference is configured.
     * @returns Promise containing the API response.
     */
    const _updateCustomTextPreference = (
        values: CustomTextPreferenceInterface,
        _isCustomTextPreferenceConfigured: boolean
    ): Promise<void> => {

        return updateCustomTextPreference(_isCustomTextPreferenceConfigured, values, tenantDomain, selectedScreen,
            selectedLocale)
            .then(
                () => {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("branding:brandingCustomText.notifications.updateSuccess.description", {
                                locale: selectedLocale,
                                screen: selectedScreen
                            }),
                            level: AlertLevels.SUCCESS,
                            message: t("branding:brandingCustomText.notifications.updateSuccess.message")
                        })
                    );

                    mutateCustomTextPreferenceFetchRequest();
                }
            )
            .catch((error: IdentityAppsApiException) => {
                // Edge Case.Try again with POST, if custom text preference has been removed due to concurrent sessions.
                if (error.code === BrandingPreferencesConstants.CUSTOM_TEXT_PREFERENCE_NOT_CONFIGURED_ERROR_CODE) {
                    _updateCustomTextPreference(values, false);

                    return;
                }
                addAlert<AlertInterface>({
                    description: t("branding:brandingCustomText.notifications.updateError.description", {
                        locale: selectedLocale,
                        screen: selectedScreen
                    }),
                    level: AlertLevels.ERROR,
                    message: t("branding:brandingCustomText.notifications.updateError.message")
                });
            });
    };

    /**
     * Resets all custom text fields to system defaults.
     *
     * @param screen - Screen to be reset.
     * @param locale - Locale to be reset.
     */
    const _deleteCustomTextPreference = (screen: string, locale: string): void => {
        deleteCustomTextPreference(tenantDomain, screen, locale).then(() => {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("branding:brandingCustomText.notifications.resetSuccess.description", {
                        locale: selectedLocale,
                        screen: selectedScreen
                    }),
                    level: AlertLevels.SUCCESS,
                    message: t("branding:brandingCustomText.notifications.resetSuccess.message")
                })
            );

            setCustomTextFormSubscription({
                ...customTextFormSubscription,
                values: cloneDeep(customTextFallbacks?.preference?.text)
            });

            mutateCustomTextPreferenceFetchRequest();
        })
            .catch(() => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("branding:brandingCustomText.notifications.updateError.description", {
                            locale: selectedLocale,
                            screen: selectedScreen
                        }),
                        level: AlertLevels.SUCCESS,
                        message: t("branding:brandingCustomText.notifications.updateError.message")
                    })
                );
            });
    };

    /**
     * Returns the custom text value for the given key.
     *
     * @param key - Key of the custom text field.
     * @param fallback - Fallback value to be returned if the key is not found.
     * @returns Custom text value.
     */
    const i18n = (key: string, fallback: string): string => {
        return processCustomTextTemplateLiterals(
            get(
                merge(
                    cloneDeep(
                        customTextCommons?.preference?.text ??
                            BrandingPreferenceMigrationClient.migrateCustomTextPreference(
                                customTextFallbackCommons,
                                brandingPreference
                            )?.preference?.text
                    ),
                    cloneDeep(customTextFormSubscription?.values ?? resolvedCustomText?.preference?.text)
                ),
                key,
                fallback
            )
        );
    };

    /**
     * Resets a specific custom text field to system default.
     * @param key - Key of the custom text field.
     */
    const resetCustomTextField = (key: string): void => {
        let updatedValues: CustomTextPreferenceInterface = cloneDeep(resolvedCustomText?.preference);

        updatedValues = {
            ...updatedValues,
            text: {
                ...updatedValues.text,
                [key]: customTextFallbacks?.preference?.text[key]
            }
        };

        // Update the value in the API.
        _updateCustomTextPreference(updatedValues, isCustomTextPreferenceConfigured).then(() => {
            // Update the value in the form state.
            setCustomTextFormSubscription({
                ...customTextFormSubscription,
                values: {
                    ...customTextFormSubscription?.values,
                    [key]: customTextFallbacks?.preference?.text[key]
                }
            });
        });
    };

    return (
        <AuthenticationFlowContext.Provider
            value={ {
                activeCustomTextConfigurationMode,
                activeTab,
                customText: customTextFormSubscription?.values ?? resolvedCustomText?.preference?.text,
                customTextDefaults: customTextFallbacks?.preference?.text,
                customTextFormSubscription: customTextFormSubscription ?? {
                    values: resolvedCustomText?.preference?.text
                },
                customTextScreenMeta,
                getLocales: (requestingView: BrandingSubFeatures): SupportedLanguagesMeta => {
                    if (requestingView === BrandingSubFeatures.CUSTOM_TEXT) {
                        return pick(supportedI18nLanguages, customTextMeta?.locales);
                    }

                    return null;
                },
                getScreens: (requestingView: BrandingSubFeatures): PreviewScreenType[] => {
                    if (!Array.isArray(customTextMeta?.screens)) {
                        return [];
                    }

                    let meta: PreviewScreenType[] = [];

                    if (requestingView === BrandingSubFeatures.CUSTOM_TEXT) {
                        meta = customTextMeta?.screens;
                    } else {
                        meta = customTextMeta?.screens.filter((screen: string) => {
                            return screen !== PreviewScreenType.COMMON;
                        });

                        meta.push(PreviewScreenType.MY_ACCOUNT);
                        meta.push(PreviewScreenType.EMAIL_TEMPLATE);
                    }

                    return meta;
                },
                i18n,
                isCustomTextConfigured: customText && !isEqual(customText, customTextFallbacks),
                isCustomTextPreferenceFetching: isCustomTextPreferenceFetching,
                onSelectedLocaleChange: (locale: string): void => {
                    setCustomTextFormSubscription(null);
                    setSelectedCustomTextLocale(locale);
                },
                onSelectedPreviewScreenChange: (screen: PreviewScreenType): void => {
                    setCustomTextFormSubscription(null);
                    setSelectedPreviewScreen(screen);
                },
                preference: brandingPreference,
                resetAllCustomTextPreference: _deleteCustomTextPreference,
                resetCustomTextField,
                selectedLocale,
                selectedScreen,
                updateActiveCustomTextConfigurationMode: setActiveCustomTextConfigurationMode,
                updateActiveTab: (tab: string) => {
                    // If the tab is the text tab, set the preview screen to common before changing the tab.
                    // This is done to overcome an issue occurred in only production.
                    if (tab === BrandingPreferencesConstants.TABS.TEXT_TAB_ID) {
                        setSelectedPreviewScreen(PreviewScreenType.COMMON);
                    }

                    setActiveTab(tab);
                },
                updateCustomTextFormSubscription: (
                    subscription: FormState<CustomTextInterface, CustomTextInterface>
                ): void => {
                    const updatedValues: FormState<CustomTextInterface, CustomTextInterface> = cloneDeep(subscription);

                    if (updatedValues) {
                        for (const key in resolvedCustomText?.preference?.text) {
                            // Check if the key is missing in the values object
                            if (!(key in updatedValues?.values)) {
                                updatedValues.values[key] = "";
                            }
                        }
                    }

                    setCustomTextFormSubscription(updatedValues);
                },
                updateCustomTextPreference: (): void => {
                    _updateCustomTextPreference({
                        ...resolvedCustomText?.preference,
                        text: customTextFormSubscription?.values
                    }, isCustomTextPreferenceConfigured);
                }
            } }
        >
            { children }
        </AuthenticationFlowContext.Provider>
    );
};

export default BrandingPreferenceProvider;
