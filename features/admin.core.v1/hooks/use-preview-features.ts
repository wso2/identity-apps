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

import { FeatureStatus, useCheckFeatureStatus } from "@wso2is/access-control";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import useFeatureGate from "@wso2is/admin.feature-gate.v1/hooks/use-feature-gate";
import { ChangeEvent, ReactElement, useCallback, useEffect, useMemo, useState } from "react";

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
interface UsePreviewFeaturesReturnInterface {
    accessibleFeatures: PreviewFeaturesListInterface[];
    canUsePreviewFeatures: boolean;
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
 * The Customer Data Service is not a preview feature anymore. It is enabled from its own page, so the
 * list has no features now.
 *
 * @returns Preview features list, accessible list, hasPreviewFeatures flag, and modal state/handlers.
 */
export const usePreviewFeatures = (): UsePreviewFeaturesReturnInterface => {
    const { selectedPreviewFeatureToShow } = useFeatureGate();

    const saasFeatureStatus: FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);
    const previewFeaturesFeatureStatus: FeatureStatus = useCheckFeatureStatus(
        FeatureGateConstants.PREVIEW_FEATURES_IDENTIFIER
    );

    const previewFeaturesList: PreviewFeaturesListInterface[] = useMemo(() => [], []);

    const accessibleFeatures: PreviewFeaturesListInterface[] = previewFeaturesList;

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

    const handlePageRedirection: (actionId: string) => void = useCallback((): void => {
        // No preview feature has a page to open.
    }, []);

    const handleToggleChange: (
        e: ChangeEvent<HTMLInputElement>,
        actionId: string
    ) => Promise<void> = useCallback(
        async (): Promise<void> => {
            // No preview feature has a toggle.
        },
        []
    );

    const hasAccessiblePreviewFeatures: boolean = accessibleFeatures.length > 0;
    const canUsePreviewFeatures: boolean =
        saasFeatureStatus === FeatureStatus.ENABLED &&
        previewFeaturesFeatureStatus === FeatureStatus.ENABLED &&
        hasAccessiblePreviewFeatures;

    return {
        accessibleFeatures,
        canUsePreviewFeatures,
        handlePageRedirection,
        handleToggleChange,
        previewFeaturesList,
        selected,
        selectedFeatureIndex,
        setSelectedFeatureIndex
    };
};
