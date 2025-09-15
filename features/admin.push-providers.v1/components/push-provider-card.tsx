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

import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Typography from "@oxygen-ui/react/Typography";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureFlagConstants from "@wso2is/admin.feature-gate.v1/constants/feature-flag-constants";
import useFeatureFlag from "@wso2is/admin.feature-gate.v1/hooks/use-feature-flag";
import {
    CustomAttributeInterface,
    ExtensionTemplateListInterface,
    ResourceTypes
} from "@wso2is/admin.template-core.v1/models/templates";
import { ExtensionTemplateManagementUtils } from "@wso2is/admin.template-core.v1/utils/templates";
import { FeatureFlagsInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import classnames from "classnames";
import React, { FunctionComponent, MouseEvent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./push-provider-card.scss";
import { useSelector } from "react-redux";
import { PushProviderConstants } from "../constants/push-provider-constants";
import { PushProviderTemplateFeatureStatus } from "../models/templates";

/**
 * Props for the push provider card component.
 */
export interface PushProviderCardPropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback function triggered upon clicking on the push provider card.
     *
     * @param e - Click event.
     */
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    /**
     * Details needed to render the push provider card.
     */
    template: ExtensionTemplateListInterface;

    selected: boolean
}

const PushProviderCard: FunctionComponent<PushProviderCardPropsInterface> = ({
    template,
    onClick,
    selected,
    ["data-componentid"]: componentId = "push-provider-card"
}: PushProviderCardPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const pushProviderFeatureFlagsConfig: FeatureFlagsInterface[] = useSelector(
        (state: AppState) => state.config.ui.features.pushProviders?.featureFlags
    );

    const featureFlag: string = useFeatureFlag(FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.PUSH_PROVIDER_TEMPLATES,
        pushProviderFeatureFlagsConfig
    );

    const featureStatus: PushProviderTemplateFeatureStatus = useMemo(() => {
        if (!template?.customAttributes
            || !Array.isArray(template?.customAttributes)
            || template?.customAttributes.length === 0) {

            return null;
        }

        const property: CustomAttributeInterface = template?.customAttributes?.find(
            (property: CustomAttributeInterface) =>
                property?.key === PushProviderConstants.FEATURE_STATUS_ATTRIBUTE_KEY
        );

        if (featureFlag === "TRUE") {
            return property?.value as PushProviderTemplateFeatureStatus;
        }

        return null;
    }, [ template ]);

    const resolveRibbonLabel = (featureStatus: PushProviderTemplateFeatureStatus): string => {
        switch (featureStatus) {
            case PushProviderTemplateFeatureStatus.NEW:
                return t("common:new");
        }
    };

    const resolveFeatureLabelClass = (featureStatus: PushProviderTemplateFeatureStatus) => {
        switch (featureStatus) {
            case PushProviderTemplateFeatureStatus.NEW:
                return "oxygen-chip-new";
        }
    };

    return(
        <Card
            key={ template?.id }
            // className="push-provider-card"
            className={ classnames("push-provider-card", {
                "push-provider-card--selected": selected
            }) }
            onClick={
                (e: MouseEvent<HTMLDivElement>) => {
                    onClick(e);
                }
            }
            data-componentid={ `${componentId}-${template?.id}` }
        >
            <CardContent className="push-provider-card-content">
                <div className="push-provider-template-image-container">
                    <img
                        className="push-provider-template-image"
                        src={
                            ExtensionTemplateManagementUtils.resolveExtensionTemplateResourcePath(
                                template?.image,
                                ResourceTypes.NOTIFICATION_PROVIDERS
                            )
                        }
                        loading="lazy"
                    />
                </div>
                <div className="push-provider-template-name-label">
                    <Typography variant="h6">
                        { template?.name }
                    </Typography>
                </div>
                {
                    featureStatus
                        ? (
                            <div
                                className={ classnames("push-provider-template-ribbon",
                                    resolveFeatureLabelClass(featureStatus) ) }
                            >
                                <span className="MuiChip-label">
                                    { resolveRibbonLabel(featureStatus) }
                                </span>
                            </div>
                        )
                        : null
                }
            </CardContent>
        </Card>
    );
};

export default PushProviderCard;
