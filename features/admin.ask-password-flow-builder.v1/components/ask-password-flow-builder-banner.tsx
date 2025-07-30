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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureFlagLabel from "@wso2is/admin.feature-gate.v1/components/feature-flag-label";
import FeatureFlagConstants from "@wso2is/admin.feature-gate.v1/constants/feature-flag-constants";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BackgroundSprites from "../../themes/wso2is/assets/images/illustrations/ai-banner-background-white.svg";
import "./ask-password-flow-builder-banner.scss";

/**
 * Props interface of {@link AskPasswordFlowBuilderBanner}
 */
export type AskPasswordFlowBuilderBannerProps = IdentifiableComponentInterface;

/**
 * Component to display the password recovery flow builder banner.
 *
 * @param props - Props injected to the component.
 * @returns The AskPasswordFlowBuilderBanner component.
 */
const AskPasswordFlowBuilderBanner: FC<AskPasswordFlowBuilderBannerProps> = ({
    "data-componentid": componentId = "ask-password-flow-builder-banner"
}: AskPasswordFlowBuilderBannerProps) => {

    const { t } = useTranslation();
    const flowsFeatureAIConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.ai);

    return (
        <Card
            sx={ { backgroundImage: `url(${BackgroundSprites})` } }
            className="ask-password-flow-builder-banner"
            data-componentid={ componentId }
        >
            <Stack
                direction={ { md: "row", sm: "column", xs: "column" } }
                spacing={ { md: 4, sm: 2, xs: 1 } }
                justifyContent="space-between"
                alignItems="center"
            >
                <Box>
                    <Typography variant="h5">
                        Construct your ideal recovery experience with our new{ " " }
                        <span className="text-gradient primary">{ t("flows:askPasswordFlowBuilder") }</span>
                        <FeatureFlagLabel
                            featureFlags={ flowsFeatureAIConfig?.featureFlags }
                            featureKey={ FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.FLOWS_TYPES_REGISTRATION }
                            type="chip"
                        />
                    </Typography>
                    <Typography variant="body1">
                        Provide a seamless account recovery experience to your users by customizing the
                        recovery flow to suit your organization&apos;s needs.
                    </Typography>
                </Box>
                <Button
                    onClick={ () => history.push(AppConstants.getPaths().get("REGISTRATION_FLOW_BUILDER")) }
                    color="primary"
                    variant="contained"
                >
                    Explore
                </Button>
            </Stack>
        </Card>
    );
};

export default AskPasswordFlowBuilderBanner;
