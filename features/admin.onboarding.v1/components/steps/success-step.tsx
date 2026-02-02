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
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import IconButton from "@oxygen-ui/react/IconButton";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { CheckIcon, CopyIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useState } from "react";
import { OnboardingComponentIds } from "../../constants";
import {
    CreatedApplicationResult,
    OnboardingBrandingConfig,
    SignInOptionsConfig
} from "../../models";
import LoginBoxPreview from "../shared/login-box-preview";
import { LeftColumn, RightColumn, TwoColumnLayout } from "../shared/onboarding-styles";

/**
 * Props interface for SuccessStep component.
 */
interface SuccessStepProps extends IdentifiableComponentInterface {
    /** Created application result */
    createdApplication?: CreatedApplicationResult;
    /** Template ID */
    templateId?: string;
    /** Framework */
    framework?: string;
    /** Callback for AI integration option */
    onAIIntegrationClick?: () => void;
    /** Callback for manual integration option */
    onManualIntegrationClick?: () => void;
    /** Sign-in options for preview */
    signInOptions?: SignInOptionsConfig;
    /** Branding configuration for preview */
    brandingConfig?: OnboardingBrandingConfig;
    /** Whether this is an M2M application */
    isM2M?: boolean;
}

/**
 * Success header container.
 */
const SuccessHeader = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3)
}));

/**
 * Success icon styling.
 */
const SuccessIcon = styled(CheckIcon)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.success.main,
    height: 48,
    width: 48
}));

/**
 * Title text.
 */
const Title = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.primary,
    fontSize: "1.5rem",
    fontWeight: 600
}));

/**
 * Subtitle text.
 */
const Subtitle = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.9375rem"
}));

/**
 * Container for integration options.
 */
const IntegrationOptions = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    marginTop: theme.spacing(3)
}));

/**
 * Integration option card.
 */
const IntegrationCard = styled(Card)<{ isRecommended?: boolean }>(
    ({ theme, isRecommended }) => ({
        border: isRecommended
            ? `2px solid ${theme.palette.primary.main}`
            : `1px solid ${theme.palette.divider}`,
        cursor: "pointer",
        padding: theme.spacing(2.5),
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            boxShadow: theme.shadows[2],
            transform: "translateY(-2px)"
        }
    })
);

/**
 * Card title.
 */
const CardTitle = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.primary,
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: theme.spacing(0.5)
}));

/**
 * Card description.
 */
const CardDescription = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.875rem"
}));

/**
 * Recommended badge.
 */
const RecommendedBadge = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius / 2,
    color: theme.palette.primary.contrastText,
    display: "inline-block",
    fontSize: "0.6875rem",
    fontWeight: 600,
    marginLeft: theme.spacing(1),
    padding: theme.spacing(0.25, 0.75),
    textTransform: "uppercase"
}));

/**
 * Credentials container.
 */
const CredentialsContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
    padding: theme.spacing(3)
}));

/**
 * Credential row with copy button.
 */
const CredentialRow = styled(Box)({
    alignItems: "flex-start",
    display: "flex",
    gap: 8
});

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
 * Success step component for onboarding.
 * Shows success message and integration options after application creation.
 */
const SuccessStep: FunctionComponent<SuccessStepProps> = (
    props: SuccessStepProps
): ReactElement => {
    const {
        createdApplication,
        templateId,
        framework,
        onAIIntegrationClick,
        onManualIntegrationClick,
        signInOptions,
        brandingConfig,
        isM2M = false,
        ["data-componentid"]: componentId = OnboardingComponentIds.SUCCESS_STEP
    } = props;

    const [ copiedField, setCopiedField ] = useState<string | null>(null);

    const handleCopy = useCallback(async (value: string, field: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (error) {
            // Fallback for older browsers
            const textArea: HTMLTextAreaElement = document.createElement("textarea");

            textArea.value = value;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        }
    }, []);

    const getSuccessTitle = (): string => {
        if (isM2M) {
            return "Your M2M application is ready!";
        }

        return "Your application is ready!";
    };

    const getSuccessSubtitle = (): string => {
        if (isM2M) {
            return "Use the credentials below to authenticate your machine-to-machine application.";
        }

        return `Great job! "${createdApplication?.name || "Your app"}" has been configured. Choose how you'd like to integrate.`;
    };

    return (
        <TwoColumnLayout data-componentid={ componentId }>
            <LeftColumn>
                <SuccessHeader>
                    <SuccessIcon />
                    <Box>
                        <Title>{ getSuccessTitle() }</Title>
                        <Subtitle>{ getSuccessSubtitle() }</Subtitle>
                    </Box>
                </SuccessHeader>

                { /* M2M Credentials Display */ }
                { isM2M && createdApplication && (
                    <CredentialsContainer>
                        <Typography
                            sx={ { fontWeight: 600, mb: 1 } }
                            variant="subtitle1"
                        >
                            Application Credentials
                        </Typography>

                        <CredentialRow>
                            <TextField
                                InputProps={ { readOnly: true } }
                                fullWidth
                                label="Client ID"
                                size="small"
                                value={ createdApplication.clientId }
                            />
                            <IconButton
                                color={ copiedField === "clientId" ? "success" : "default" }
                                onClick={ () => handleCopy(createdApplication.clientId, "clientId") }
                                size="small"
                            >
                                { copiedField === "clientId" ? <CheckIcon /> : <CopyIcon /> }
                            </IconButton>
                        </CredentialRow>

                        { createdApplication.clientSecret && (
                            <CredentialRow>
                                <TextField
                                    InputProps={ { readOnly: true } }
                                    fullWidth
                                    label="Client Secret"
                                    size="small"
                                    type="password"
                                    value={ createdApplication.clientSecret }
                                />
                                <IconButton
                                    color={ copiedField === "clientSecret" ? "success" : "default" }
                                    onClick={ () =>
                                        handleCopy(createdApplication.clientSecret!, "clientSecret")
                                    }
                                    size="small"
                                >
                                    { copiedField === "clientSecret"
                                        ? <CheckIcon />
                                        : <CopyIcon />
                                    }
                                </IconButton>
                            </CredentialRow>
                        ) }

                        <Alert severity="warning" sx={ { mt: 1 } }>
                            Make sure to copy your client secret now. You won&apos;t be able to see it again.
                        </Alert>
                    </CredentialsContainer>
                ) }

                { /* Integration Options for non-M2M */ }
                { !isM2M && (
                    <IntegrationOptions>
                        <IntegrationCard
                            isRecommended
                            onClick={ onAIIntegrationClick }
                            data-componentid={ `${componentId}-ai-option` }
                        >
                            <CardTitle>
                                Get AI assistance
                                <RecommendedBadge>Recommended</RecommendedBadge>
                            </CardTitle>
                            <CardDescription>
                                Use AI to help you integrate authentication into your { framework || "application" }.
                                Get step-by-step guidance tailored to your project.
                            </CardDescription>
                        </IntegrationCard>

                        <IntegrationCard
                            onClick={ onManualIntegrationClick }
                            data-componentid={ `${componentId}-manual-option` }
                        >
                            <CardTitle>Integrate manually</CardTitle>
                            <CardDescription>
                                Follow our documentation and code samples to integrate
                                authentication yourself. Best for developers who prefer
                                full control.
                            </CardDescription>
                        </IntegrationCard>
                    </IntegrationOptions>
                ) }

                { /* Go to Console button */ }
                <Box sx={ { mt: 4 } }>
                    <Button
                        color="primary"
                        variant="contained"
                        data-componentid={ `${componentId}-go-to-console` }
                    >
                        Go to Console
                    </Button>
                </Box>
            </LeftColumn>

            { /* Preview Column - only for non-M2M */ }
            { !isM2M && (
                <PreviewColumn>
                    <LoginBoxPreview
                        brandingConfig={ brandingConfig }
                        signInOptions={ signInOptions }
                        data-componentid={ `${componentId}-preview` }
                    />
                </PreviewColumn>
            ) }
        </TwoColumnLayout>
    );
};

export default SuccessStep;
