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
import { AppState } from "../../core/store";
import deleteCustomTextPreference from "../api/delete-custom-text-preference";
import updateCustomTextPreference from "../api/update-custom-text-preference";
import useGetBrandingPreferenceResolve from "../api/use-get-branding-preference-resolve";
import useGetCustomTextPreference from "../api/use-get-custom-text-preference";
import useGetCustomTextPreferenceFallbacks from "../api/use-get-custom-text-preference-fallbacks";
import useGetCustomTextPreferenceMeta from "../api/use-get-custom-text-preference-meta";
import { CustomTextPreferenceConstants } from "../constants/custom-text-preference-constants";
import AuthenticationFlowContext from "../context/branding-preference-context";
import { BrandingSubFeatures, PreviewScreenType } from "../models/branding-preferences";
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

    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state?.global?.supportedI18nLanguages
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

    const {
        data: brandingPreference
    } = useGetBrandingPreferenceResolve(tenantDomain);

    const {
        data: customTextCommons
    } = useGetCustomTextPreference(!!selectedLocale, tenantDomain, "common", selectedLocale);

    const {
        data: customText,
        error: customTextPreferenceFetchRequestError,
        mutate: mutateCustomTextPreferenceFetchRequest
    } = useGetCustomTextPreference(!!selectedScreen && !!selectedLocale, tenantDomain, selectedScreen, selectedLocale);

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
                description: t("console:brandingCustomText.notifications.getPreferenceError.description", {
                    locale: selectedLocale,
                    screen: selectedScreen
                }),
                level: AlertLevels.ERROR,
                message: t("console:brandingCustomText.notifications.getPreferenceError.message")
            })
        );
    }, [ customTextPreferenceFetchRequestError ]);

    /**
     * Updates the custom text preference.
     *
     * @param values - Values to be updated.
     * @returns Promise containing the API response.
     */
    const _updateCustomTextPreference = (values: CustomTextPreferenceInterface): Promise<void> => {
        return updateCustomTextPreference(!!customText, values, tenantDomain, selectedScreen, selectedLocale)
            .then(
                () => {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("console:brandingCustomText.notifications.updateSuccess.description", {
                                locale: selectedLocale,
                                screen: selectedScreen
                            }),
                            level: AlertLevels.SUCCESS,
                            message: t("console:brandingCustomText.notifications.updateSuccess.message")
                        })
                    );

                    mutateCustomTextPreferenceFetchRequest();
                }
            )
            .catch(() => {
                addAlert<AlertInterface>({
                    description: t("console:brandingCustomText.notifications.updateError.description", {
                        locale: selectedLocale,
                        screen: selectedScreen
                    }),
                    level: AlertLevels.ERROR,
                    message: t("console:brandingCustomText.notifications.updateError.message")
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
                    description: t("console:brandingCustomText.notifications.resetSuccess.description", {
                        locale: selectedLocale,
                        screen: selectedScreen
                    }),
                    level: AlertLevels.SUCCESS,
                    message: t("console:brandingCustomText.notifications.resetSuccess.message")
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
                        description: t("console:brandingCustomText.notifications.updateError.description", {
                            locale: selectedLocale,
                            screen: selectedScreen
                        }),
                        level: AlertLevels.SUCCESS,
                        message: t("console:brandingCustomText.notifications.updateError.message")
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
        _updateCustomTextPreference(updatedValues).then(() => {
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
                onSelectedLocaleChange: (locale: string): void => {
                    setSelectedCustomTextLocale(locale);
                    setCustomTextFormSubscription(null);
                },
                onSelectedPreviewScreenChange: (screen: PreviewScreenType): void => {
                    setSelectedPreviewScreen(screen);
                    setCustomTextFormSubscription(null);
                },
                preference: brandingPreference,
                resetAllCustomTextPreference: _deleteCustomTextPreference,
                resetCustomTextField,
                selectedLocale,
                selectedScreen,
                updateActiveCustomTextConfigurationMode: setActiveCustomTextConfigurationMode,
                updateActiveTab: setActiveTab,
                updateCustomTextFormSubscription: (
                    subscription: FormState<CustomTextInterface, CustomTextInterface>
                ): void => {
                    const updatedValues: FormState<CustomTextInterface, CustomTextInterface> = cloneDeep(subscription);

                    for (const key in resolvedCustomText?.preference?.text) {
                        // Check if the key is missing in the values object
                        if (!(key in updatedValues.values)) {
                            updatedValues.values[key] = "";
                        }
                    }

                    setCustomTextFormSubscription(updatedValues);
                },
                updateCustomTextPreference: (): void => {
                    _updateCustomTextPreference({
                        ...resolvedCustomText?.preference,
                        text: customTextFormSubscription?.values
                    });
                }
            } }
        >
            { children }
        </AuthenticationFlowContext.Provider>
    );
};

export default BrandingPreferenceProvider;
