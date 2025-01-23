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

import Chip from "@oxygen-ui/react/Chip";
import { FeatureAccessConfigInterface, FeatureFlagsInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import useFeatureFlag from "../hooks/use-feature-flag";
import { FeatureStatusLabel } from "../models/feature-status";

/**
 * Proptypes for the feature flag label component.
 */
interface FeatureFlagLabelPropsInterface {
    featureKey: string;
    featureConfig?: FeatureAccessConfigInterface;
    featureName?: string;
    featureFlags?: FeatureFlagsInterface[];
    type?: "chip" | "ribbon";
}

/**
 * Feature flag label component.
 *
 * @param featureFlags   - Feature flags array.
 * @param featureKey     - Feature key to look up.
 * @param featureConfig  - Feature config object.
 * @param featureName    - Name (key) in the feature config object.
 * @param type           - Display type (chip/ribbon).
 *
 * @returns ReactElement
 */
const FeatureFlagLabel: FunctionComponent<FeatureFlagLabelPropsInterface> = (
    {
        featureFlags,
        featureConfig,
        featureName,
        featureKey,
        type = "chip"
    }: FeatureFlagLabelPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const label: string = useFeatureFlag(featureFlags, featureKey, featureConfig, featureName);

    /**
     * Resolves the class for the feature flag label.
     *
     * @param flag - Feature flag.
     *
     * @returns string
     */
    const resolveFeatureLabelClass = (flag: string): string => {
        switch (flag) {
            case FeatureStatusLabel.BETA:
                return "oxygen-chip-beta";
            case FeatureStatusLabel.NEW:
                return "oxygen-chip-new";
            case FeatureStatusLabel.COMING_SOON:
                return "oxygen-chip-coming-soon";
            default:
                return "";
        }
    };

    /**
     * Resolves the label component based on the type.
     *
     * @param flag - Feature flag.
     *
     * @returns ReactElement
     */
    const resolveLabelComponent = (flag: string): ReactElement => {
        switch (type) {
            case "chip":
                return (
                    <Chip
                        size="small"
                        sx={ { marginLeft: 1 } }
                        label={ t(flag) }
                        className={ resolveFeatureLabelClass(flag) }
                    />
                );
            case "ribbon":
                return (
                    <div
                        className={
                            "ribbon " +
                            resolveFeatureLabelClass(flag)
                        }
                    >
                        <span className="MuiChip-label">
                            { t(flag) }
                        </span>
                    </div>
                );
            default:
                return (
                    <Chip
                        size="small"
                        sx={ { marginLeft: 1 } }
                        label={ t(flag) }
                        className="oxygen-chip-beta"
                    />
                );
        }
    };

    return label ? resolveLabelComponent(FeatureStatusLabel[label]) : null;
};

export default FeatureFlagLabel;
