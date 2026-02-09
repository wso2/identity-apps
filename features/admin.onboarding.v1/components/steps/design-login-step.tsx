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

import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback } from "react";
import { DEFAULT_BRANDING_CONFIG, OnboardingComponentIds } from "../../constants";
import { OnboardingBrandingConfig, SignInOptionsConfig } from "../../models";
import ColorPicker from "../shared/color-picker";
import LoginBoxPreview from "../shared/login-box-preview";
import LogoSelector from "../shared/logo-selector";
import { LeftColumn, RightColumn, TwoColumnLayout } from "../shared/onboarding-styles";
import StepHeader from "../shared/step-header";

/**
 * Props interface for DesignLoginStep component.
 */
interface DesignLoginStepProps extends IdentifiableComponentInterface {
    /** Current branding configuration */
    brandingConfig?: OnboardingBrandingConfig;
    /** Callback when branding configuration changes */
    onBrandingConfigChange: (config: OnboardingBrandingConfig) => void;
    /** Sign-in options for preview */
    signInOptions?: SignInOptionsConfig;
}

/**
 * Container for design options.
 */
const DesignOptionsContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(4),
    maxWidth: 400
}));

/**
 * Preview column styling.
 */
const PreviewColumn = styled(RightColumn)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius * 2,
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(4)
}));

/**
 * Design login step component for onboarding.
 * Allows users to customize the appearance of their login page.
 */
const DesignLoginStep: FunctionComponent<DesignLoginStepProps> = (
    props: DesignLoginStepProps
): ReactElement => {
    const {
        brandingConfig = DEFAULT_BRANDING_CONFIG,
        onBrandingConfigChange,
        signInOptions,
        ["data-componentid"]: componentId = OnboardingComponentIds.DESIGN_LOGIN_STEP
    } = props;

    const handleColorChange = useCallback((color: string): void => {
        onBrandingConfigChange({
            ...brandingConfig,
            primaryColor: color
        });
    }, [ brandingConfig, onBrandingConfigChange ]);

    const handleLogoSelect = useCallback((logoUrl: string | undefined): void => {
        onBrandingConfigChange({
            ...brandingConfig,
            logoAltText: logoUrl ? "Logo" : undefined,
            logoUrl
        });
    }, [ brandingConfig, onBrandingConfigChange ]);

    return (
        <TwoColumnLayout data-componentid={ componentId }>
            <LeftColumn>
                <StepHeader
                    data-componentid={ `${componentId}-header` }
                    title="Design your application's login"
                />

                <DesignOptionsContainer>
                    <LogoSelector
                        data-componentid={ `${componentId}-logo-selector` }
                        label="Choose a logo"
                        onLogoSelect={ handleLogoSelect }
                        selectedLogoUrl={ brandingConfig.logoUrl }
                    />

                    <ColorPicker
                        color={ brandingConfig.primaryColor }
                        data-componentid={ `${componentId}-color-picker` }
                        label="Choose a brand color"
                        onChange={ handleColorChange }
                        showHint
                    />
                </DesignOptionsContainer>
            </LeftColumn>

            <PreviewColumn>
                <LoginBoxPreview
                    brandingConfig={ brandingConfig }
                    signInOptions={ signInOptions }
                    data-componentid={ `${componentId}-preview` }
                />
            </PreviewColumn>
        </TwoColumnLayout>
    );
};

export default DesignLoginStep;
