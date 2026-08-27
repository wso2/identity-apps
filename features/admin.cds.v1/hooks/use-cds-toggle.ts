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

import { getApplicationList } from "@wso2is/admin.applications.v1/api/application";
import { ApplicationListInterface } from "@wso2is/admin.applications.v1/models/application";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { updateCDSConfig } from "../api/config";
import { CDSApplicationIdentifierType, CDSConfig } from "../models/config";
import { getCDSApplicationIdentifierType } from "../utils/application-identifier-utils";

/**
 * Console system application client ID (reserved consumer key). Also the
 * identifier registered with CDS in legacy `client_id` mode.
 */
const CDS_CONSOLE_APP: string = "CONSOLE";

/**
 * Resolves the identifier used to register the Console as a CDS system application,
 * honoring the configured CDS application identifier type.
 *
 * In `client_id` mode this is the Console client ID (`CONSOLE`). In `app_id` mode
 * the Console application UUID is looked up via the application list API.
 *
 * @returns The Console system application identifier for the configured mode.
 * @throws If the Console application UUID cannot be resolved in `app_id` mode.
 */
const resolveConsoleSystemApplicationIdentifier = async (): Promise<string> => {
    if (getCDSApplicationIdentifierType() !== CDSApplicationIdentifierType.APP_ID) {
        return CDS_CONSOLE_APP;
    }

    // Console is a system portal, so system portals must NOT be excluded from the lookup.
    const response: ApplicationListInterface = await getApplicationList(
        1,
        0,
        `clientId eq ${CDS_CONSOLE_APP}`,
        false
    );
    const consoleApplicationId: string | undefined = response?.applications?.[0]?.id;

    if (!consoleApplicationId) {
        throw new Error("Unable to resolve the Console application UUID for the CDS system application list.");
    }

    return consoleApplicationId;
};

/**
 * Return type of the useCDSToggle hook.
 */
interface UseCDSToggleReturnInterface {
    /**
     * Whether a toggle update request is in flight.
     */
    isUpdating: boolean;

    /**
     * Enables or disables CDS. Resolves to `true` on success, `false` on failure.
     */
    toggleCDS: (enable: boolean) => Promise<boolean>;
}

/**
 * Hook that enables/disables the Customer Data Service via PATCH.
 *
 * Enabling  → set cds_enabled: true; add the Console system application identifier
 *             (resolved per the configured CDS application identifier type) if absent.
 * Disabling → set cds_enabled: false; remove the Console system application identifier
 *             (leave others intact).
 *
 * @param cdsConfig - Current CDS configuration.
 * @param mutateCDSConfig - Mutator of the CDS configuration SWR cache.
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
            const currentApps: string[] = cdsConfig?.system_applications ?? [];

            setIsUpdating(true);

            try {
                // Resolve the Console system application identifier for the configured mode.
                // Aborts the toggle if the UUID cannot be resolved in `app_id` mode so that a
                // wrong identifier is never written to the CDS system application list.
                const consoleAppIdentifier: string = await resolveConsoleSystemApplicationIdentifier();

                const nextApps: string[] = enable
                    ? currentApps.includes(consoleAppIdentifier)
                        ? currentApps
                        : [ ...currentApps, consoleAppIdentifier ]
                    : currentApps.filter((app: string) => app !== consoleAppIdentifier);

                await updateCDSConfig({
                    cds_enabled: enable,
                    system_applications: nextApps
                });

                mutateCDSConfig();

                return true;
            } catch {
                dispatch(addAlert({
                    description: t("customerDataService:landing.notifications.update.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("customerDataService:landing.notifications.update.error.message")
                }));

                return false;
            } finally {
                setIsUpdating(false);
            }
        },
        [ cdsConfig?.system_applications, dispatch, mutateCDSConfig, t ]
    );

    return {
        isUpdating,
        toggleCDS
    };
};

export default useCDSToggle;
