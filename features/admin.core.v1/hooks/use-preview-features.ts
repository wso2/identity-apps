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

import { FeatureStatus, useCheckFeatureStatus, useRequiredScopes } from "@wso2is/access-control";
import { updateCDSConfig } from "@wso2is/admin.cds.v1/api/config";
import useCDSConfig from "@wso2is/admin.cds.v1/hooks/use-config";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import useFeatureGate from "@wso2is/admin.feature-gate.v1/hooks/use-feature-gate";
import { AlertLevels, FeatureAccessConfigInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { ChangeEvent, Dispatch, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import NewCDSFeatureImage from "../assets/illustrations/preview-features/new-cds-feature.png";
import { AppConstants } from "../constants/app-constants";
import { history } from "../helpers/history";
import { AppState } from "../store";

/** Added or removed as a system application when CDS is toggled. */
const CDS_CONSOLE_APP: string = "CONSOLE";

/**
 * Preview features list item interface.
 */
export interface PreviewFeaturesListInterface {
    action?: string;
    name: string;
    component?: ReactElement;
    description: string;
    id: string;
    image?: string;
    enabled?: boolean;
    value: string;
    requiredScopes?: string[];
    message?: {
        type: "info" | "warning" | "error";
        content: string;
    };
}

/**
 * Return type of usePreviewFeatures hook.
 */
export interface UsePreviewFeaturesReturnInterface {
    accessibleFeatures: PreviewFeaturesListInterface[];
    canUsePreviewFeatures: boolean;
    handleCDSToggle: (enable: boolean) => Promise<void>;
    handlePageRedirection: (actionId: string) => void;
    handleToggleChange: (e: ChangeEvent<HTMLInputElement>, actionId: string) => Promise<void>;
    previewFeaturesList: PreviewFeaturesListInterface[];
    selected: PreviewFeaturesListInterface | undefined;
    selectedFeatureIndex: number;
    setSelectedFeatureIndex: (index: number) => void;
}

/**
 * Builds the preview features list, accessible features, and modal state/handlers.
 * Used by FeaturePreviewModal for rendering and by Header to gate the Feature Preview menu item.
 *
 * @returns Preview features list, accessible list, hasPreviewFeatures flag, and modal state/handlers.
 */
export const usePreviewFeatures = (): UsePreviewFeaturesReturnInterface => {
    const { t } = useTranslation();
    const dispatch: Dispatch<unknown> = useDispatch();
    const { selectedPreviewFeatureToShow } = useFeatureGate();

    const cdsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.customerDataService
    );

    const saasFeatureStatus: FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);
    const previewFeaturesFeatureStatus: FeatureStatus = useCheckFeatureStatus(
        FeatureGateConstants.PREVIEW_FEATURES_IDENTIFIER
    );

    const hasCDSScopes: boolean = useRequiredScopes(cdsFeatureConfig?.scopes?.update);
    
    const {
        data: cdsConfig,
        mutate: mutateCDSConfig
    } = useCDSConfig(cdsFeatureConfig?.enabled ?? false);

    const previewFeaturesList: PreviewFeaturesListInterface[] = useMemo(() => {
        const items: (PreviewFeaturesListInterface | false)[] = [
            cdsFeatureConfig?.enabled &&
                hasCDSScopes && {
                action: t("customerDataService:common.featurePreview.action"),
                description: t("customerDataService:common.featurePreview.description"),
                enabled: cdsConfig?.cds_enabled,
                id: "customer-data-service",
                image: NewCDSFeatureImage,
                message: {
                    content: t("customerDataService:common.featurePreview.message"),
                    type: "warning" as const
                },
                name: t("customerDataService:common.featurePreview.name"),
                requiredScopes: cdsFeatureConfig?.scopes?.update,
                value: "CDS.Enable"
            }
        ];

        return items.filter((item): item is PreviewFeaturesListInterface => Boolean(item));
    }, [ cdsConfig, cdsFeatureConfig, hasCDSScopes, t ]);

    const accessibleFeatures: PreviewFeaturesListInterface[] = useMemo(
        () =>
            previewFeaturesList.filter((feature: PreviewFeaturesListInterface) => {
                if (feature.id === "customer-data-service") {
                    return hasCDSScopes;
                }

                return true;
            }),
        [ previewFeaturesList, hasCDSScopes ]
    );

    const [ selectedFeatureIndex, setSelectedFeatureIndex ] = useState<number>(0);

    const selected: PreviewFeaturesListInterface | undefined = useMemo(
        () => accessibleFeatures[selectedFeatureIndex],
        [ selectedFeatureIndex, accessibleFeatures ]
    );

    useEffect(() => {
        const activePreviewFeatureIndex: number = accessibleFeatures.findIndex(
            (feature: PreviewFeaturesListInterface) => feature?.id === selectedPreviewFeatureToShow
        );

        setSelectedFeatureIndex(activePreviewFeatureIndex >= 0 ? activePreviewFeatureIndex : 0);
    }, [ accessibleFeatures, selectedPreviewFeatureToShow ]);

    const handlePageRedirection: (actionId: string) => void = useCallback((actionId: string) => {
        switch (actionId) {
            case "customer-data-service":
                history.push(AppConstants.getPaths().get("PROFILES"));
                break;
            default:
                break;
        }
    }, []);

    const handleCDSToggle: (enable: boolean) => Promise<void> = useCallback(
        async (enable: boolean): Promise<void> => {
            const currentApps: string[] = cdsConfig?.system_applications ?? [];
            const nextApps: string[] = enable
                ? currentApps.length === 0
                    ? [ CDS_CONSOLE_APP ]
                    : currentApps
                : currentApps.filter((app: string) => app !== CDS_CONSOLE_APP);

            try {
                await updateCDSConfig({
                    cds_enabled: enable,
                    system_applications: nextApps
                });
                mutateCDSConfig();
            } catch {
                dispatch(
                    addAlert({
                        description: t("customerDataService:common.featurePreview.updateError"),
                        level: AlertLevels.ERROR,
                        message: t("common:error")
                    })
                );
            }
        },
        [ cdsConfig?.system_applications, dispatch, mutateCDSConfig, t ]
    );

    const handleToggleChange: (
        e: ChangeEvent<HTMLInputElement>,
        actionId: string
    ) => Promise<void> = useCallback(
        async (e: ChangeEvent<HTMLInputElement>, actionId: string): Promise<void> => {
            const isChecked: boolean = e.target.checked;

            switch (actionId) {
                case "customer-data-service":
                    await handleCDSToggle(isChecked);
                    break;
                default:
                    break;
            }
        },
        [ handleCDSToggle ]
    );

    const hasAccessiblePreviewFeatures: boolean = accessibleFeatures.length > 0;
    const canUsePreviewFeatures: boolean =
        saasFeatureStatus === FeatureStatus.ENABLED &&
        previewFeaturesFeatureStatus === FeatureStatus.ENABLED &&
        hasAccessiblePreviewFeatures;

    return {
        accessibleFeatures,
        canUsePreviewFeatures,
        handleCDSToggle,
        handlePageRedirection,
        handleToggleChange,
        previewFeaturesList,
        selected,
        selectedFeatureIndex,
        setSelectedFeatureIndex
    };
};

