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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { getCDSConfig, updateCDSConfig, updateCDSServerConfig, updateCDSStatus } from "../api/config";
import { CDSConfig } from "../models/config";
import { resolveConsoleSystemApplicationIdentifier } from "../utils/application-identifier-utils";
import { isCDSServerConfigEnabled } from "../utils/ui-mode-utils";

/**
 * Return type of the useCDSToggle hook.
 */
interface UseCDSToggleReturnInterface {
    /**
     * Whether a toggle update request is in flight.
     */
    isUpdating: boolean;

    /**
     * Enables or disables CDS. Resolves to `true` on success, `false` on failure or when the CDS
     * configuration is not loaded and the Identity Server cannot enable CDS first.
     */
    toggleCDS: (enable: boolean) => Promise<boolean>;
}

/**
 * Hook that enables/disables the Customer Data Service via PATCH.
 *
 * Enabling  → set the CDS status to true; add the Console system application identifier
 *             (resolved per the configured CDS application identifier type) if absent.
 * Disabling → set the CDS status to false; remove the Console system application identifier
 *             (leave others intact).
 *
 * See `updateCDSStatus` for the APIs that get the status.
 *
 * Before the first enable, CDS can have no configuration for the Console to read: with service
 * credentials, CDS gets the credentials of the organization only when the Identity Server enables
 * it, and it cannot introspect the Console token without them. When the server configuration API is
 * enabled, enabling then goes through the Identity Server first, which creates the credentials and
 * enables CDS. The hook then reads the CDS configuration and sets the system applications.
 *
 * @param cdsConfig - Current CDS configuration.
 * @param mutateCDSConfig - Gets the CDS configuration and the CDS status again.
 * @returns The toggle handler and its in-flight state.
 */
const useCDSToggle = (
    cdsConfig: CDSConfig,
    mutateCDSConfig: () => void
): UseCDSToggleReturnInterface => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isUpdating, setIsUpdating ] = useState<boolean>(false);

    const toggleCDS: (enable: boolean) => Promise<boolean> = useCallback(
        async (enable: boolean): Promise<boolean> => {
            // Without the CDS configuration, the new list would drop the other system applications.
            // Only an enable through the Identity Server can go on: it makes CDS answer the Console.
            const isFirstEnable: boolean = !cdsConfig && enable && isCDSServerConfigEnabled();

            if (!cdsConfig && !isFirstEnable) {
                return false;
            }

            setIsUpdating(true);

            try {
                // Resolve the Console system application identifier for the configured mode.
                // Aborts the toggle if the UUID cannot be resolved in `app_id` mode so that a
                // wrong identifier is never written to the CDS system application list.
                const consoleAppIdentifier: string = await resolveConsoleSystemApplicationIdentifier();

                let currentConfig: CDSConfig = cdsConfig;

                if (isFirstEnable) {
                    await updateCDSServerConfig(true);
                    currentConfig = await getCDSConfig();
                }

                const currentApps: string[] = currentConfig?.system_applications ?? [];

                const nextApps: string[] = enable
                    ? currentApps.includes(consoleAppIdentifier)
                        ? currentApps
                        : [ ...currentApps, consoleAppIdentifier ]
                    : currentApps.filter((app: string) => app !== consoleAppIdentifier);

                if (isFirstEnable) {
                    // The Identity Server has already enabled CDS.
                    await updateCDSConfig({ system_applications: nextApps });
                } else {
                    await updateCDSStatus(enable, nextApps);
                }

                return true;
            } catch {
                dispatch(addAlert({
                    description: t("customerDataService:landing.notifications.update.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("customerDataService:landing.notifications.update.error.message")
                }));

                return false;
            } finally {
                // Also after a failure: the Identity Server can store the status before the CDS request fails.
                mutateCDSConfig();
                setIsUpdating(false);
            }
        },
        [ cdsConfig, dispatch, mutateCDSConfig, t ]
    );

    return {
        isUpdating,
        toggleCDS
    };
};

export default useCDSToggle;
