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
import { updateCDSConfig } from "../api/config";
import type { CDSConfig } from "../models/config";

/** Added or removed as a system application when CDS is toggled. */
const CDS_CONSOLE_APP: string = "CONSOLE";

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
 * Enabling  → set cds_enabled: true; if system_applications is empty, seed it with ["CONSOLE"].
 * Disabling → set cds_enabled: false; remove "CONSOLE" from system_applications (leave others intact).
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

            let nextApps: string[];

            if (enable) {
                nextApps = currentApps.length === 0
                    ? [ CDS_CONSOLE_APP ]
                    : currentApps;
            } else {
                nextApps = currentApps.filter((app: string) => app !== CDS_CONSOLE_APP);
            }

            setIsUpdating(true);

            try {
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
