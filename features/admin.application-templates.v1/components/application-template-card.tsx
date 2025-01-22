/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@oxygen-ui/react/Avatar";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Tooltip from "@oxygen-ui/react/Tooltip";
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
import { useSelector } from "react-redux";
import { ApplicationTemplateConstants } from "../constants/templates";
import { ApplicationTemplateFeatureStatus, SupportedTechnologyMetadataInterface } from "../models/templates";
import "./application-template-card.scss";

/**
 * Props for the application template card component.
 */
export interface ApplicationTemplateCardPropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback function triggered upon clicking on the application template card.
     *
     * @param e - Click event.
     */
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    /**
     * Details needed to render the application template card.
     */
    template: ExtensionTemplateListInterface;
}

/**
 * Application template card component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Application template card component.
 */
const ApplicationTemplateCard: FunctionComponent<ApplicationTemplateCardPropsInterface> = ({
    template,
    onClick,
    ["data-componentid"]: componentId = "application-template-card"
}: ApplicationTemplateCardPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const applicationFeatureFlagsConfig: FeatureFlagsInterface[] = useSelector(
        (state: AppState) => state.config.ui.features.applications.featureFlags);

    const featureFlag: string = useFeatureFlag(applicationFeatureFlagsConfig,
        FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.APPLICATION_TEMPLATES);

    /**
     * Extract the supported technology details related to the current application template.
     */
    const supportedTechnologies: SupportedTechnologyMetadataInterface[] = useMemo(() => {
        if (!template?.customAttributes ||
            !Array.isArray(template?.customAttributes) ||
            template?.customAttributes?.length <= 0) {

            return [];
        }

        const property: CustomAttributeInterface =  template?.customAttributes?.find(
            (property: CustomAttributeInterface) =>
                property?.key === ApplicationTemplateConstants.SUPPORTED_TECHNOLOGIES_ATTRIBUTE_KEY
        );

        return property?.value ?
            typeof property?.value === "string" ?
                JSON.parse(property?.value) :
                property?.value :
            [];
    }, [ template ]);

    /**
     * Resolve the current template feature status.
     */
    const featureStatus: ApplicationTemplateFeatureStatus = useMemo(() => {
        if (!template?.customAttributes
            || !Array.isArray(template?.customAttributes)
            || template?.customAttributes?.length <= 0) {

            return null;
        }

        const property: CustomAttributeInterface = template?.customAttributes?.find(
            (property: CustomAttributeInterface) =>
                property?.key === ApplicationTemplateConstants.FEATURE_STATUS_ATTRIBUTE_KEY
        );

        if (featureFlag === "TRUE") {

            return property?.value as ApplicationTemplateFeatureStatus;
        }

        return null;

    }, [ template ]);

    /**
     * Resolve the corresponding label for the current feature label.
     *
     * @param featureStatus - Feature status from the template.
     * @returns The feature status label.
     */
    const resolveRibbonLabel = (featureStatus: ApplicationTemplateFeatureStatus): string => {
        switch (featureStatus) {
            case ApplicationTemplateFeatureStatus.COMING_SOON:
                return t("common:comingSoon");
            case ApplicationTemplateFeatureStatus.NEW:
                return t("common:new");
        }
    };

    /**
     * Resolve the corresponding class name for the current feature status label.
     *
     * @param featureStatus - Feature status from the template.
     * @returns The class name for the feature status label.
     */
    const resolveFeatureLabelClass = (featureStatus: ApplicationTemplateFeatureStatus) => {
        switch (featureStatus) {
            case ApplicationTemplateFeatureStatus.COMING_SOON:
                return "oxygen-chip-coming-soon";
            case ApplicationTemplateFeatureStatus.NEW:
                return "oxygen-chip-new";
        }
    };

    return (
        <Card
            key={ template?.id }
            className={ classnames("application-template", {
                disabled: featureStatus === ApplicationTemplateFeatureStatus.COMING_SOON
            }) }
            onClick={
                (e: MouseEvent<HTMLDivElement>) => {
                    if (featureStatus !== ApplicationTemplateFeatureStatus.COMING_SOON) {
                        onClick(e);
                    }
                }
            }
            data-componentid={ `${componentId}-${template?.id}` }
        >
            <CardContent className="application-template-header">
                <div className="application-template-image-container">
                    <img
                        className="application-template-image"
                        src={
                            ExtensionTemplateManagementUtils.resolveExtensionTemplateResourcePath(
                                template?.image,
                                ResourceTypes.APPLICATIONS
                            )
                        }
                        loading="lazy"
                    />
                </div>
                <div>
                    <Typography variant="h6">
                        { template?.name }
                    </Typography>
                </div>
                {
                    featureStatus
                        ? (
                            <div
                                className={ classnames("application-template-ribbon",
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
            <CardContent className="application-template-body">
                <Tooltip title={ template?.description }>
                    <div className="application-template-description">
                        <Typography variant="body2" color="text.secondary">
                            { template?.description }
                        </Typography>
                    </div>
                </Tooltip>
                { supportedTechnologies?.length > 0 && (
                    <AvatarGroup className="application-template-supported-technologies" max={ 10 }>
                        { supportedTechnologies.map(
                            (technology: SupportedTechnologyMetadataInterface) => (
                                <Avatar
                                    sx={ { height: 20, width: 20 } }
                                    variant="square"
                                    key={ technology?.displayName }
                                    className="application-template-supported-technology"
                                    alt={ technology?.displayName }
                                    src={
                                        ExtensionTemplateManagementUtils.resolveExtensionTemplateResourcePath(
                                            technology?.logo,
                                            ResourceTypes.APPLICATIONS
                                        )
                                    }
                                />
                            )
                        ) }
                    </AvatarGroup>
                ) }
            </CardContent>
        </Card>
    );
};

export default ApplicationTemplateCard;
