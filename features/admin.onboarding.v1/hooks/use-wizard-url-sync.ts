/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { history } from "@wso2is/admin.core.v1/helpers/history";
import debounce from "lodash-es/debounce";
import { useEffect, useRef } from "react";
import { OnboardingDataInterface, OnboardingStep } from "../models";
import { serializeWizardUrlParams } from "../utils/serialize-wizard-url-params";

const URL_SYNC_DEBOUNCE_MS: number = 300;

/**
 * Hook that reactively syncs wizard state to URL query parameters.
 * Uses `history.replace()` to update the URL without creating browser history entries.
 *
 * @param currentStep - Current wizard step
 * @param onboardingData - Current onboarding data
 */
export const useWizardUrlSync: (
    currentStep: OnboardingStep,
    onboardingData: OnboardingDataInterface
) => void = (
    currentStep: OnboardingStep,
    onboardingData: OnboardingDataInterface
): void => {
    const debouncedSyncRef: React.MutableRefObject<ReturnType<typeof debounce> | null> =
        useRef<ReturnType<typeof debounce> | null>(null);

    useEffect(() => {
        if (debouncedSyncRef.current) {
            debouncedSyncRef.current.cancel();
        }

        const syncToUrl: () => void = (): void => {
            const params: URLSearchParams = serializeWizardUrlParams(currentStep, onboardingData);
            const search: string = params.toString();
            const newSearch: string = search ? `?${search}` : "";

            if (history.location.search !== newSearch) {
                history.replace({
                    ...history.location,
                    search: newSearch
                });
            }
        };

        const debouncedSync: ReturnType<typeof debounce> = debounce(syncToUrl, URL_SYNC_DEBOUNCE_MS);

        debouncedSyncRef.current = debouncedSync;
        debouncedSync();

        return () => {
            debouncedSync.cancel();
        };
    }, [ currentStep, onboardingData ]);
};
