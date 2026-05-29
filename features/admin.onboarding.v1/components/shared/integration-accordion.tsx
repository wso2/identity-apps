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

import IconButton from "@mui/material/IconButton";
import { Theme, styled } from "@mui/material/styles";
import Box, { BoxProps } from "@oxygen-ui/react/Box";
import Link from "@oxygen-ui/react/Link";
import Typography from "@oxygen-ui/react/Typography";
import {
    CircleInfoIcon,
    EyeIcon,
    EyeSlashIcon
} from "@oxygen-ui/react-icons";
import { MarkdownGuide } from "@wso2is/admin.template-core.v1/components/markdown-guide";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useState } from "react";
import CodeBlock from "./code-block";
import { SectionLabel } from "./onboarding-styles";
import { ReactComponent as StarsIcon } from "../../assets/icons/stars.svg";
import {
    FrameworkIntegrationGuideInterface,
    IntegrationConfigInterface,
    generateAIPrompt,
    replaceCodePlaceholders
} from "../../constants/integration-guides";

/**
 * Props interface for IntegrationAccordion component.
 */
interface IntegrationAccordionPropsInterface extends IdentifiableComponentInterface {
    /** Integration guide for the framework (used for AI prompt and hardcoded fallback) */
    guide?: FrameworkIntegrationGuideInterface;
    /** Configuration values */
    config: IntegrationConfigInterface;
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
 * Tab types for integration options.
 */
enum IntegrationTab {
    AI_PROMPT = "ai-prompt",
    GUIDE = "guide"
}

/**
 * Segmented control container — groups tab options into a single pill.
 */
const SegmentedControl: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignSelf: "flex-start",
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.spacing(3),
    display: "inline-flex",
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5)
}));

/**
 * Individual segment option within the segmented control.
 */
interface SegmentProps extends BoxProps {
    isActive?: boolean;
}

const Segment: React.ComponentType<SegmentProps> = styled(Box, {
    shouldForwardProp: (prop: string) => prop !== "isActive"
})<SegmentProps>(({ theme, isActive }: SegmentProps & { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: isActive ? theme.palette.background.paper : "transparent",
    borderRadius: theme.spacing(2.5),
    boxShadow: isActive ? theme.shadows[1] : "none",
    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "0.875rem",
    fontWeight: isActive ? 600 : 500,
    gap: theme.spacing(1),
    padding: theme.spacing(0.75, 2),
    transition: "all 0.15s ease-in-out",
    userSelect: "none"
}));

/**
 * AI segment with gradient fill when active.
 */
const AISegment: React.ComponentType<SegmentProps> = styled(Box, {
    shouldForwardProp: (prop: string) => prop !== "isActive"
})<SegmentProps>(({ theme, isActive }: SegmentProps & { theme: Theme }) => ({
    alignItems: "center",
    background: isActive
        ? `linear-gradient(135deg, ${theme.palette.primary.main}, #8b5cf6)`
        : "transparent",
    borderRadius: theme.spacing(2.5),
    color: isActive ? "#fff" : theme.palette.text.secondary,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "0.875rem",
    fontWeight: isActive ? 600 : 500,
    gap: theme.spacing(0.75),
    padding: theme.spacing(0.75, 2),
    transition: "all 0.15s ease-in-out",
    userSelect: "none"
}));

/**
 * Tab content container.
 */
const TabContent: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2)
}));

/**
 * Slide transition duration in ms.
 */
const SLIDE_DURATION: number = 200;

/**
 * Step container for manual integration.
 */
const StepContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5)
}));

/**
 * Step number badge.
 */
const StepNumber: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
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
const StepTitle: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    color: theme.palette.text.primary,
    display: "flex",
    fontSize: "0.9375rem",
    fontWeight: 500
}));

/**
 * Test user credentials container.
 */
const TestUserContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "flex-start",
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    gap: theme.spacing(1.5),
    padding: theme.spacing(2)
}));

/**
 * Integration accordion component.
 * Provides tabbed sections for AI prompt and integration guides.
 */
const IntegrationAccordion: FunctionComponent<IntegrationAccordionPropsInterface> = (
    props: IntegrationAccordionPropsInterface
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

    const hasAIPrompt: boolean = !!guide;
    const hasGuide: boolean = !!guideContent || (!!guide && !!guide.providerCode);

    const [ activeTab, setActiveTab ] = useState<IntegrationTab>(
        hasAIPrompt ? IntegrationTab.AI_PROMPT : IntegrationTab.GUIDE
    );
    const [ showPassword, setShowPassword ] = useState<boolean>(false);

    const handleTabChange: (tab: IntegrationTab) => void = useCallback(
        (tab: IntegrationTab): void => {
            if (tab === activeTab) return;

            setActiveTab(tab);
        },
        [ activeTab ]
    );

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
     * Render test user credentials section.
     */
    const renderTestUserCredentials: () => ReactElement | null = (): ReactElement | null => {
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
                    <Box sx={ { alignItems: "center", display: "flex", gap: 1 } }>
                        <Typography color="text.secondary" variant="body2">
                            <strong>Password:</strong>
                            { showPassword ? testUserCredentials.password : "••••••••" }
                        </Typography>
                        <IconButton
                            aria-label={ showPassword ? "Hide password" : "Show password" }
                            onClick={ () => setShowPassword(!showPassword) }
                            size="small"
                            sx={ { ml: -0.5 } }
                        >
                            { showPassword ? <EyeSlashIcon /> : <EyeIcon /> }
                        </IconButton>
                    </Box>
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
        <Box
            data-componentid={ componentId }
            sx={ { display: "flex", flex: 1, flexDirection: "column", gap: 2.5, minHeight: 0 } }
        >
            <SectionLabel>
                Integrate with your application
            </SectionLabel>
            <SegmentedControl>
                { hasAIPrompt && (
                    <AISegment
                        data-componentid={ `${componentId}-tab-ai` }
                        isActive={ activeTab === IntegrationTab.AI_PROMPT }
                        onClick={ () => handleTabChange(IntegrationTab.AI_PROMPT) }
                        role="tab"
                        tabIndex={ 0 }
                    >
                        <StarsIcon fill="currentColor" height={ 14 } width={ 14 } />
                        AI Prompt
                    </AISegment>
                ) }
                { hasGuide && (
                    <Segment
                        data-componentid={ `${componentId}-tab-guide` }
                        isActive={ activeTab === IntegrationTab.GUIDE }
                        onClick={ () => handleTabChange(IntegrationTab.GUIDE) }
                        role="tab"
                        tabIndex={ 0 }
                    >
                        Guide
                    </Segment>
                ) }
            </SegmentedControl>
            { activeTab === IntegrationTab.AI_PROMPT && aiPrompt && (
                <TabContent
                    sx={ {
                        "@keyframes fadeIn": {
                            from: { opacity: 0 },
                            to: { opacity: 1 }
                        },
                        animation: `fadeIn ${SLIDE_DURATION}ms ease-out`
                    } }
                >
                    <CodeBlock
                        code={ aiPrompt }
                        data-componentid={ `${componentId}-ai-code` }
                        maxHeight={ 180 }
                    />
                    <Box sx={ { alignItems: "center", display: "flex", gap: 1.5 } }>
                        <Typography
                            sx={ (theme: Theme) => ({
                                alignItems: "center",
                                color: theme.palette.text.secondary,
                                display: "inline-flex",
                                fontSize: "0.8125rem",
                                gap: 0.5
                            }) }
                        >
                            ⏱️ 2 min setup
                        </Typography>
                    </Box>
                </TabContent>
            ) }
            { activeTab === IntegrationTab.GUIDE && hasGuide && (
                <TabContent
                    sx={ (theme: Theme) => ({
                        "& .ui.grid, & .ui.grid > .row, & .ui.grid > .column, & .ui.grid > .row > .column": {
                            marginLeft: "0 !important",
                            marginRight: "0 !important",
                            paddingLeft: "0 !important",
                            paddingRight: "0 !important"
                        },
                        "& h2, & h3": {
                            fontSize: "1rem !important"
                        },
                        "&::-webkit-scrollbar": { width: 6 },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "transparent",
                            borderRadius: 3,
                            transition: "background-color 200ms ease"
                        },
                        "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
                        "&:hover::-webkit-scrollbar-thumb": {
                            backgroundColor: theme.palette.grey[300]
                        },
                        "@keyframes fadeIn": {
                            from: { opacity: 0 },
                            to: { opacity: 1 }
                        },
                        animation: `fadeIn ${SLIDE_DURATION}ms ease-out`,
                        flex: 1,
                        minHeight: 0,
                        overflow: "auto",
                        scrollbarGutter: "stable"
                    }) }
                >
                    { guideContent ? (
                        <>
                            <MarkdownGuide
                                content={ guideContent }
                                data={ guideData || {} }
                                isLoading={ isGuideLoading }
                                computerColumnWidth={ 16 }
                                data-componentid={ `${componentId}-markdown-guide` }
                            />
                            { renderTestUserCredentials() }
                        </>
                    ) : (
                        <>
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
                    ) }
                </TabContent>
            ) }
        </Box>
    );
};

IntegrationAccordion.displayName = "IntegrationAccordion";

export default IntegrationAccordion;
