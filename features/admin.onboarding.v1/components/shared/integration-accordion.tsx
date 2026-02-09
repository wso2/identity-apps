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

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import Link from "@oxygen-ui/react/Link";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronDownIcon, CircleInfoIcon } from "@oxygen-ui/react-icons";
import { MarkdownGuide } from "@wso2is/admin.template-core.v1/components/markdown-guide";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import CodeBlock from "./code-block";
import {
    FrameworkIntegrationGuide,
    IntegrationConfig,
    generateAIPrompt,
    replaceCodePlaceholders
} from "../../constants/integration-guides";

/**
 * Props interface for IntegrationAccordion component.
 */
export interface IntegrationAccordionProps extends IdentifiableComponentInterface {
    /** Integration guide for the framework (used for AI prompt and hardcoded fallback) */
    guide?: FrameworkIntegrationGuide;
    /** Configuration values */
    config: IntegrationConfig;
    /** API-fetched guide markdown content (replaces manual steps when available) */
    guideContent?: string;
    /** Data object for guide markdown variable substitution */
    guideData?: Record<string, unknown>;
    /** Whether the guide content is still loading */
    isGuideLoading?: boolean;
    /** Test user credentials (optional) */
    testUserCredentials?: {
        username: string;
        password: string;
        email?: string;
    };
}

/**
 * Icon components for accordion sections.
 */
const SparklesIcon: FunctionComponent = (): ReactElement => (
    <svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 2L13.09 8.26L18 6L15.27 10.8L22 12L15.27 13.2L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.73 13.2L2 12L8.73 10.8L6 6L10.91 8.26L12 2Z"
            fill="#ff7300"
        />
    </svg>
);

const CodeIcon: FunctionComponent = (): ReactElement => (
    <svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8 18L2 12L8 6L9.41 7.41L4.83 12L9.41 16.59L8 18ZM16 18L14.59 16.59L19.17 12L14.59 7.41L16 6L22 12L16 18Z"
            fill="#6b7280"
        />
    </svg>
);

/**
 * Styled accordion container.
 */
const StyledAccordion = styled(Accordion)(({ theme }: { theme: Theme }) => ({
    "&.Mui-expanded": {
        margin: 0
    },
    "&:before": {
        display: "none"
    },
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: `${theme.shape.borderRadius}px !important`,
    boxShadow: "none",
    marginBottom: theme.spacing(2),
    overflow: "hidden"
}));

/**
 * Styled accordion summary.
 */
const StyledAccordionSummary = styled(AccordionSummary)(({ theme }: { theme: Theme }) => ({
    "& .MuiAccordionSummary-content": {
        alignItems: "center",
        gap: theme.spacing(2),
        margin: "12px 0"
    },
    "&.Mui-expanded": {
        minHeight: 56
    },
    minHeight: 56,
    padding: theme.spacing(0, 2)
}));

/**
 * Icon container with circular background.
 */
const IconContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.grey[100],
    borderRadius: "50%",
    display: "flex",
    flexShrink: 0,
    height: 40,
    justifyContent: "center",
    width: 40
}));

/**
 * Recommended badge styling.
 */
const RecommendedBadge = styled(Chip)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius / 2,
    color: theme.palette.primary.contrastText,
    fontSize: "0.6875rem",
    fontWeight: 600,
    height: 20,
    textTransform: "uppercase"
}));

/**
 * Accordion title container.
 */
const TitleContainer = styled(Box)(() => ({
    alignItems: "center",
    display: "flex",
    flex: 1,
    gap: 8
}));

/**
 * Accordion description.
 */
const Description = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.875rem"
}));

/**
 * Styled accordion details.
 * Content flows naturally — the parent ScrollableLeftColumn handles scrolling.
 */
const StyledAccordionDetails = styled(AccordionDetails)(({ theme }: { theme: Theme }) => ({
    borderTop: `1px solid ${theme.palette.divider}`,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    padding: theme.spacing(3)
}));

/**
 * Step container for manual integration.
 */
const StepContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5)
}));

/**
 * Step number badge.
 */
const StepNumber = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.grey[200],
    borderRadius: "50%",
    color: theme.palette.text.primary,
    display: "inline-flex",
    fontSize: "0.75rem",
    fontWeight: 600,
    height: 24,
    justifyContent: "center",
    marginRight: theme.spacing(1),
    width: 24
}));

/**
 * Step title.
 */
const StepTitle = styled(Typography)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    color: theme.palette.text.primary,
    display: "flex",
    fontSize: "0.9375rem",
    fontWeight: 500
}));

/**
 * Test user credentials container.
 */
const TestUserContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "flex-start",
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    gap: theme.spacing(1.5),
    padding: theme.spacing(2)
}));

/**
 * Integration accordion component.
 * Provides expandable sections for AI prompt and manual integration guides.
 */
const IntegrationAccordion: FunctionComponent<IntegrationAccordionProps> = (
    props: IntegrationAccordionProps
): ReactElement => {
    const {
        guide,
        config,
        guideContent,
        guideData,
        isGuideLoading = false,
        testUserCredentials,
        ["data-componentid"]: componentId = "integration-accordion"
    } = props;

    const [ aiExpanded, setAiExpanded ] = useState<boolean>(false);
    const [ manualExpanded, setManualExpanded ] = useState<boolean>(false);

    const aiPrompt: string | undefined = guide
        ? generateAIPrompt(config, guide.displayName)
        : undefined;
    const providerCode: string | undefined = guide
        ? replaceCodePlaceholders(guide.providerCode, config)
        : undefined;
    const buttonCode: string | undefined = guide?.buttonCode
        ? replaceCodePlaceholders(guide.buttonCode, config)
        : undefined;

    /**
     * Render test user credentials section (shared between API guide and fallback).
     */
    const renderTestUserCredentials = (): ReactElement | null => {
        if (!testUserCredentials) {
            return null;
        }

        return (
            <TestUserContainer>
                <CircleInfoIcon size={ 20 } />
                <Box sx={ { flex: 1 } }>
                    <Typography
                        sx={ { fontWeight: 500, mb: 1 } }
                        variant="body2"
                    >
                        We have created a test user for you to test logging in to your application
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                        <strong>Username:</strong> { testUserCredentials.username }
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                        <strong>Password:</strong> { testUserCredentials.password }
                    </Typography>
                    { testUserCredentials.email && (
                        <Typography
                            color="text.secondary"
                            sx={ { mt: 1 } }
                            variant="body2"
                        >
                            Email notifications will be sent to: { testUserCredentials.email }
                        </Typography>
                    ) }
                    <Typography
                        color="text.secondary"
                        sx={ { fontStyle: "italic", mt: 1 } }
                        variant="caption"
                    >
                        These credentials are for testing only. You can delete this test user
                        anytime in the Console.
                    </Typography>
                </Box>
            </TestUserContainer>
        );
    };

    return (
        <Box data-componentid={ componentId }>
            { /* AI Prompt Accordion - only shown when hardcoded guide is available */ }
            { guide && aiPrompt && (
                <StyledAccordion
                    disableGutters
                    expanded={ aiExpanded }
                    onChange={ () => setAiExpanded(!aiExpanded) }
                    data-componentid={ `${componentId}-ai-prompt` }
                >
                    <StyledAccordionSummary expandIcon={ <ChevronDownIcon /> }>
                        <IconContainer>
                            <SparklesIcon />
                        </IconContainer>
                        <Box>
                            <TitleContainer>
                                <Typography sx={ { fontWeight: 600 } }>AI Prompt</Typography>
                                <RecommendedBadge label="Recommended" size="small" />
                            </TitleContainer>
                            <Description>
                                Paste this prompt into your AI coding assistant to speed up integration
                            </Description>
                        </Box>
                    </StyledAccordionSummary>
                    <StyledAccordionDetails>
                        <CodeBlock
                            code={ aiPrompt }
                            label="AI Prompt"
                            maxHeight={ 200 }
                            data-componentid={ `${componentId}-ai-prompt-code` }
                        />
                    </StyledAccordionDetails>
                </StyledAccordion>
            ) }

            { /* Integration Guide Accordion */ }
            <StyledAccordion
                disableGutters
                expanded={ manualExpanded }
                onChange={ () => setManualExpanded(!manualExpanded) }
                data-componentid={ `${componentId}-manual` }
            >
                <StyledAccordionSummary expandIcon={ <ChevronDownIcon /> }>
                    <IconContainer>
                        <CodeIcon />
                    </IconContainer>
                    <Box>
                        <Typography sx={ { fontWeight: 600 } }>
                            { guideContent ? "Integration Guide" : "Test login manually" }
                        </Typography>
                        <Description>
                            { guideContent
                                ? "Follow these steps to add authentication to your application."
                                : "Copy the starter code and try signing in."
                            }
                        </Description>
                    </Box>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                    { guideContent ? (
                        <>
                            { /* API-fetched guide rendered with MarkdownGuide */ }
                            <MarkdownGuide
                                content={ guideContent }
                                data={ guideData || {} }
                                isLoading={ isGuideLoading }
                                data-componentid={ `${componentId}-markdown-guide` }
                            />
                            { renderTestUserCredentials() }
                        </>
                    ) : guide && providerCode ? (
                        <>
                            { /* Hardcoded step-by-step fallback for excluded templates */ }
                            <StepContainer>
                                <StepTitle>
                                    <StepNumber>1</StepNumber>
                                    Install the SDK
                                </StepTitle>
                                <CodeBlock
                                    code={ guide.installCommand }
                                    npmCommand={ guide.installCommand }
                                    pnpmCommand={ guide.pnpmCommand }
                                    showPackageManagerTabs
                                    yarnCommand={ guide.yarnCommand }
                                    data-componentid={ `${componentId}-install-code` }
                                />
                            </StepContainer>

                            <StepContainer>
                                <StepTitle>
                                    <StepNumber>2</StepNumber>
                                    Add provider configuration in { guide.providerFile }
                                </StepTitle>
                                <CodeBlock
                                    code={ providerCode }
                                    label={ guide.providerFile }
                                    maxHeight={ 250 }
                                    data-componentid={ `${componentId}-provider-code` }
                                />
                            </StepContainer>

                            { buttonCode && guide.buttonFile && (
                                <StepContainer>
                                    <StepTitle>
                                        <StepNumber>3</StepNumber>
                                        Add sign-in/sign-out in { guide.buttonFile }
                                    </StepTitle>
                                    <CodeBlock
                                        code={ buttonCode }
                                        label={ guide.buttonFile }
                                        maxHeight={ 200 }
                                        data-componentid={ `${componentId}-button-code` }
                                    />
                                </StepContainer>
                            ) }

                            <Link
                                href={ guide.docsUrl }
                                rel="noopener noreferrer"
                                sx={ { fontSize: "0.875rem" } }
                                target="_blank"
                            >
                                View the full { guide.displayName } quick start guide
                            </Link>

                            { renderTestUserCredentials() }
                        </>
                    ) : null }
                </StyledAccordionDetails>
            </StyledAccordion>
        </Box>
    );
};

IntegrationAccordion.displayName = "IntegrationAccordion";

export default IntegrationAccordion;
