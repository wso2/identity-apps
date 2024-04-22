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

import { FormState } from "@wso2is/form";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import { Context, createContext } from "react";
import {
    BrandingPreferenceAPIResponseInterface,
    BrandingSubFeatures,
    PreviewScreenType,
    PreviewScreenVariationType
} from "../models/branding-preferences";
import {
    CustomTextConfigurationModes,
    CustomTextInterface,
    CustomTextPreferenceScreenMetaInterface
} from "../models/custom-text-preference";

/**
 * Props interface for BrandingPreferenceContext.
 */
export interface BrandingPreferenceContextProps {
    /**
     * Sets the screen requested for preview.
     * @param screen - Selected screen.
     */
    onSelectedPreviewScreenChange: (screen: PreviewScreenType) => void;
    /**
     * Sets the variation of the current screen, requested for preview.
     * @param variation - Selected screen variation.
     */
    onSelectedPreviewScreenVariationChange: (variation: PreviewScreenVariationType) => void;
    /**
     * Resets the variations back to default
     */
    resetSelectedPreviewScreenVariations: () => void;
    /**
     * Sets the language requesting for preview.
     * @param locale - Selected language.
     */
    onSelectedLocaleChange: (locale: string) => void;
    /**
     * Selected screen requesting text preference.
     */
    selectedScreen: PreviewScreenType;
    /**
     * Selected screen variation requesting text preference.
     */
    selectedScreenVariation: PreviewScreenVariationType;
    /**
     * Selected language requesting text preference.
     */
    selectedLocale: string;
    /**
     * Branding preference from the `/branding-preference` API.
     */
    preference: BrandingPreferenceAPIResponseInterface;
    /**
     * Text customization preference from the `/branding-preference/text` API.
     */
    customText: CustomTextInterface;
    /**
     * Default text customization preference from the in-app resource bundle.
     */
    customTextDefaults: CustomTextInterface;
    /**
     * Meta data for the custom text preference screen.
     */
    customTextScreenMeta: CustomTextPreferenceScreenMetaInterface
    /**
     * Updates the custom text preference.
     * @param values - Values to be updated.
     */
    updateCustomTextPreference: (values: CustomTextInterface) => void;
    /**
     * Function to get the translated text for a given key.
     * @param key - Key of the text to be translated.
     * @param fallback - Fallback text to be used if the key is not found.
     * @returns Translated text.
     */
    i18n: (key: string, fallback: string) => string;
    /**
     * Fetching state of the custom text preference.
     */
    isCustomTextPreferenceFetching: boolean;
    /**
     * Sets the subscription for the custom text form.
     * @param subscription - Subscription to be set.
     */
    updateCustomTextFormSubscription: (
        subscription: Partial<FormState<CustomTextInterface, CustomTextInterface>>
    ) => void;
    /**
     * Get the set of supported locales for a requested view.
     * @param requestingView - Requesting view.
     * @returns Supported locales.
     */
    customTextFormSubscription: Partial<FormState<CustomTextInterface, CustomTextInterface>>;
    /**
     * Get the set of supported locales for a requested view.
     * @param requestingView - Requesting view.
     * @returns Supported locales.
     */
    getLocales: (requestingView: BrandingSubFeatures) => SupportedLanguagesMeta;
    /**
     * Get the set of supported screens for a requested view.
     * @param requestingView - Requesting view.
     * @returns Supported screens.
     */
    getScreens: (requestingView: BrandingSubFeatures) => string[];
    /**
     * Get the set of supported screen variations for a requested screen.
     * @param screen - Screen for which the variations list is requested.
     * @returns Supported screen variations.
     */
    getScreenVariations: (screen: PreviewScreenType) => PreviewScreenVariationType[];
    /**
     * Resets the custom text preference for a given screen and locale.
     * @param screen - Screen to be reset.
     * @param locale - Locale to be reset.
     */
    resetAllCustomTextPreference: (screen: string, locale: string) => void;
    /**
     * Resets a custom text field for a given screen and locale.
     * @param key - Key to be reset.
     */
    resetCustomTextField: (key: string, screen: string, locale: string) => void;
    /**
     * Active tab id.
     */
    activeTab: string;
    /**
     * Update active tab.
     * @param tab - Active tab id.
     */
    updateActiveTab: (tab: string) => void;
    /**
     * If custom text configured for a given screen and locale.
     */
    isCustomTextConfigured: boolean;
    /**
     * Currently active tab for configuring custom text.
     */
    activeCustomTextConfigurationMode: CustomTextConfigurationModes;
    /**
     * Persist the active custom text preference configuration tab.
     */
    updateActiveCustomTextConfigurationMode: (mode: CustomTextConfigurationModes) => void;
}

/**
 * Context object for managing branding preference.
 */
const BrandingPreferenceContext: Context<BrandingPreferenceContextProps> = createContext<
    null | BrandingPreferenceContextProps
>(
    null
);

/**
 * Display name for the BrandingPreferenceContext.
 */
BrandingPreferenceContext.displayName = "BrandingPreferenceContext";

export default BrandingPreferenceContext;
