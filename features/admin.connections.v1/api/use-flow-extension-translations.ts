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

import useGetCustomTextPreferenceMeta from "@wso2is/admin.branding.v1/api/use-get-custom-text-preference-meta";
import { CustomTextPreferenceMeta } from "@wso2is/admin.branding.v1/models/custom-text-preference";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1/store";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants/organization-constants";
import { BrandingPreferenceTypes } from "@wso2is/common.branding.v1/models/branding-preferences";
import { HttpMethods } from "@wso2is/core/models";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import { AxiosError, AxiosRequestConfig } from "axios";
import pick from "lodash-es/pick";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { INFLOW_EXTENSION_SCREEN } from "../utils/inflow-extension-utils";

/**
 * Represents a grouped translation entry with its translations across locales.
 */
export interface TranslationEntry {
    shortKey: string;
    translations: Record<string, string>;
}

/**
 * Return type of the `useInflowExtensionTranslations` hook.
 */
interface UseInflowExtensionTranslationsResult {
    entries: TranslationEntry[];
    localeData: Record<string, Record<string, string>>;
    isConfiguredPerLocale: Record<string, boolean>;
    supportedLocales: SupportedLanguagesMeta;
    isLoading: boolean;
    refetch: () => Promise<void>;
}

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetch custom text preference for a given screen + locale.
 * Returns null if not configured (404 with specific error code).
 */
const fetchCustomTextForLocale = async (
    endpointUrl: string,
    tenantDomain: string,
    screen: string,
    locale: string,
    type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG
): Promise<{ text: Record<string, string>; isConfigured: boolean }> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            locale,
            name: tenantDomain,
            screen,
            type
        },
        url: endpointUrl
    };

    try {
        const response: any = await httpClient(requestConfig);

        if (response.status === 200 && response?.data?.preference?.text) {
            return { isConfigured: true, text: response.data.preference.text };
        }

        return { isConfigured: false, text: {} };
    } catch (error) {
        const axiosError: AxiosError = error as AxiosError;

        if (axiosError.response?.status === 404) {
            return { isConfigured: false, text: {} };
        }

        return { isConfigured: false, text: {} };
    }
};

/**
 * Hook that fetches custom text preferences for all supported locales
 * for the `inflow-extension` screen, filters by a given key prefix,
 * and groups them into `TranslationEntry` objects.
 *
 * @param keyPrefix - The key prefix to filter entries (e.g., "inflow.extension.my.connection.").
 * @param enabled - Whether data fetching is enabled.
 */
const useInflowExtensionTranslations = (
    keyPrefix: string,
    enabled: boolean
): UseInflowExtensionTranslationsResult => {
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

    const {
        data: customTextPreferenceMeta,
        isLoading: metaLoading
    } = useGetCustomTextPreferenceMeta<CustomTextPreferenceMeta>();

    const supportedLocales: SupportedLanguagesMeta = useMemo(() => {
        if (!supportedI18nLanguages || !customTextPreferenceMeta) {
            return {};
        }

        return pick(supportedI18nLanguages, customTextPreferenceMeta?.locales);
    }, [ supportedI18nLanguages, customTextPreferenceMeta ]);

    const [ localeData, setLocaleData ] = useState<Record<string, Record<string, string>>>({});
    const [ isConfiguredPerLocale, setIsConfiguredPerLocale ] = useState<Record<string, boolean>>({});
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ fetchCounter, setFetchCounter ] = useState<number>(0);

    const isMounted: React.MutableRefObject<boolean> = useRef<boolean>(true);

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    const localeKeys: string = useMemo(
        () => Object.keys(supportedLocales).sort().join(","),
        [ supportedLocales ]
    );

    useEffect(() => {
        if (!enabled || !localeKeys || metaLoading) {
            if (!enabled) {
                setIsLoading(false);
            }

            return;
        }

        const locales: string[] = localeKeys.split(",").filter(Boolean);

        if (locales.length === 0) {
            setIsLoading(false);

            return;
        }

        const organizationType: string = store.getState()?.organization?.organizationType;
        const endpointUrl: string = organizationType === OrganizationType.SUBORGANIZATION
            ? `${store.getState().config.endpoints.brandingTextPreferenceSubOrg}/resolve`
            : `${store.getState().config.endpoints.brandingTextPreference}/resolve`;

        const tenantDomain: string = organizationType === OrganizationType.SUBORGANIZATION
            ? store.getState()?.organization?.organization?.id
            : store.getState()?.auth?.tenantDomain;

        setIsLoading(true);

        Promise.all(
            locales.map(async (locale: string) => {
                const result: { text: Record<string, string>; isConfigured: boolean } =
                    await fetchCustomTextForLocale(
                        endpointUrl,
                        tenantDomain,
                        INFLOW_EXTENSION_SCREEN,
                        locale
                    );

                return { isConfigured: result.isConfigured, locale, text: result.text };
            })
        ).then((results: { locale: string; text: Record<string, string>; isConfigured: boolean }[]) => {
            if (!isMounted.current) return;

            const newLocaleData: Record<string, Record<string, string>> = {};
            const newIsConfigured: Record<string, boolean> = {};

            results.forEach(({ locale, text, isConfigured }: {
                locale: string;
                text: Record<string, string>;
                isConfigured: boolean;
            }) => {
                newLocaleData[locale] = text;
                newIsConfigured[locale] = isConfigured;
            });

            setLocaleData(newLocaleData);
            setIsConfiguredPerLocale(newIsConfigured);
            setIsLoading(false);
        }).catch(() => {
            if (!isMounted.current) return;

            setIsLoading(false);
        });
    }, [ enabled, localeKeys, metaLoading, fetchCounter ]);

    const entries: TranslationEntry[] = useMemo(() => {
        if (!keyPrefix) return [];

        const keyMap: Record<string, Record<string, string>> = {};

        Object.entries(localeData).forEach(([ locale, textMap ]: [string, Record<string, string>]) => {
            Object.entries(textMap).forEach(([ fullKey, text ]: [string, string]) => {
                if (!fullKey.startsWith(keyPrefix)) return;

                const shortKey: string = fullKey.slice(keyPrefix.length);

                if (!keyMap[shortKey]) {
                    keyMap[shortKey] = {};
                }

                keyMap[shortKey][locale] = text;
            });
        });

        return Object.entries(keyMap).map(([ shortKey, translations ]: [string, Record<string, string>]) => ({
            shortKey,
            translations
        }));
    }, [ localeData, keyPrefix ]);

    const refetch: () => Promise<void> = useCallback(async () => {
        setFetchCounter((c: number) => c + 1);
    }, []);

    return {
        entries,
        isConfiguredPerLocale,
        isLoading: isLoading || metaLoading,
        localeData,
        refetch,
        supportedLocales
    };
};

export default useInflowExtensionTranslations;
